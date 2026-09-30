import { test, expect } from "@playwright/test";
import { spawn, ChildProcessWithoutNullStreams } from "child_process";
import path from "path";

// Real integration tests against a live `php -S` server — unlike
// contact-and-apply.spec.ts (which mocks the network call to verify
// client-side behavior only), these actually execute api/contact.php and
// check its validation, honeypot, and time-trap logic. This became
// possible once PHP was installed in this environment; before that, the
// script could only be read, not run (see docs/tickets/
// 20260920-cct-12-www-marketing-site.md, Notes).
//
// This intentionally does not go through www/serve.js (which has no PHP
// runtime and 501s .php requests by design — see that file) or through
// www/playwright.config.ts's own webServer — it spawns a second, PHP-only
// server on a different port, scoped to this file.

// Serial: fullyParallel (playwright.config.ts) would otherwise let two
// workers pick up tests from this file at once, and both would try to
// spawn `php -S` on the same PORT in their own beforeAll — the loser
// fails to bind, and requests routed to it get connection resets. One
// worker, one php -S instance, tests run in sequence.
test.describe.configure({ mode: "serial" });

const PORT = 4322;
const BASE_URL = `http://localhost:${PORT}`;
const WWW_ROOT = path.resolve(__dirname, "../..");

let phpServer: ChildProcessWithoutNullStreams;

async function waitForServer(): Promise<void> {
  const deadline = Date.now() + 10_000;
  while (Date.now() < deadline) {
    try {
      await fetch(`${BASE_URL}/index.html`);
      return;
    } catch {
      await new Promise((resolve) => setTimeout(resolve, 150));
    }
  }
  throw new Error("php -S did not become ready in time");
}

test.beforeAll(async () => {
  phpServer = spawn("php", ["-S", `localhost:${PORT}`, "-t", WWW_ROOT]);
  await waitForServer();
});

test.afterAll(() => {
  phpServer.kill();
});

function post(body: unknown, headers: Record<string, string> = {}) {
  return fetch(`${BASE_URL}/api/contact.php`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...headers },
    body: typeof body === "string" ? body : JSON.stringify(body),
  });
}

function validPayload(overrides: Record<string, unknown> = {}) {
  return {
    reason: "general",
    name: "Jamie Rivera",
    email: "jamie@example.com",
    message: "Test message from the integration suite.",
    website: "",
    // 2 seconds in the past — comfortably clears the server's
    // MIN_HUMAN_SECONDS time-trap without an actual test sleep.
    opened_at: Date.now() - 2000,
    ...overrides,
  };
}

test("rejects a non-POST request", async () => {
  const response = await fetch(`${BASE_URL}/api/contact.php`);
  expect(response.status).toBe(405);
});

test("rejects a malformed JSON body", async () => {
  const response = await post("{not valid json");
  expect(response.status).toBe(400);
});

test("rejects missing required fields", async () => {
  const response = await post(validPayload({ name: "", message: "" }));
  expect(response.status).toBe(400);
  const body = await response.json();
  expect(body.error).toMatch(/required/i);
});

test("rejects an invalid email address", async () => {
  const response = await post(validPayload({ email: "not-an-email" }));
  expect(response.status).toBe(400);
  const body = await response.json();
  expect(body.error).toMatch(/email/i);
});

test("a filled honeypot silently pretends success", async () => {
  const response = await post(validPayload({ website: "https://spam.example" }));
  expect(response.status).toBe(200);
  const body = await response.json();
  expect(body).toEqual({ ok: true });
});

test("a submission faster than the time-trap threshold silently pretends success", async () => {
  const response = await post(validPayload({ opened_at: Date.now() - 100 }));
  expect(response.status).toBe(200);
  const body = await response.json();
  expect(body).toEqual({ ok: true });
});

test("a legitimate submission reaches mail() and fails cleanly with no MTA configured", async () => {
  // This sandbox has no configured MTA, so PHP's mail() returns false —
  // this test's real value is confirming contact.php runs end-to-end
  // without a fatal error and surfaces that failure as a clean 502, not a
  // crash or a silent false "success". A deploy target with a working MTA
  // would instead get 200 {ok:true} on this same request.
  const response = await post(validPayload());
  expect(response.status).toBe(502);
  const body = await response.json();
  expect(body.error).toMatch(/unable to send/i);
});

test("an unrecognized reason falls back to general rather than erroring", async () => {
  const response = await post(validPayload({ reason: "not-a-real-reason" }));
  // Falls back internally to "general" and still proceeds to the mail()
  // attempt (502 here, same as the legitimate-submission case above) —
  // an unrecognized reason must not be rejected outright.
  expect(response.status).toBe(502);
});
