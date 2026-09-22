// Wires up the contact/apply modal (<dialog id="contact-modal">) to the
// three trigger buttons (apply as a local, apply as a musician/employer,
// general contact) and submits it as JSON to api/contact.php.
(function () {
  function init() {
    const modal = document.getElementById("contact-modal");
    const form = document.querySelector('[data-testid="contact-form"]');
    const reasonField = document.getElementById("contact-reason");
    const statusEl = document.querySelector('[data-testid="contact-status"]');
    const closeBtn = document.querySelector('[data-testid="contact-close"]');
    const cancelBtn = document.querySelector('[data-testid="contact-cancel"]');
    if (!modal || !form || !reasonField || !statusEl) return;

    function setStatus(text, variant) {
      statusEl.textContent = text;
      statusEl.className = "contact-status" + (variant ? ` contact-status-${variant}` : "");
    }

    document.querySelectorAll("[data-reason]").forEach((trigger) => {
      trigger.addEventListener("click", () => {
        form.reset();
        setStatus("");
        reasonField.value = trigger.getAttribute("data-reason") || "general";
        // Time-trap start: contact.php rejects a submission that arrives
        // suspiciously soon after this, since no real person fills in a
        // four-field form that fast — see api/contact.php.
        form.elements.opened_at.value = String(Date.now());
        modal.showModal();
      });
    });

    function closeModal() {
      modal.close();
    }
    closeBtn.addEventListener("click", closeModal);
    cancelBtn.addEventListener("click", closeModal);
    modal.addEventListener("click", (event) => {
      if (event.target === modal) closeModal();
    });

    form.addEventListener("submit", async (event) => {
      event.preventDefault();

      const payload = {
        reason: reasonField.value,
        name: form.elements.name.value.trim(),
        email: form.elements.email.value.trim(),
        message: form.elements.message.value.trim(),
        website: form.elements.website.value, // honeypot — left blank by real users
        opened_at: form.elements.opened_at.value, // time-trap — see api/contact.php
      };

      const submitBtn = form.querySelector('[data-testid="contact-submit"]');
      submitBtn.disabled = true;
      setStatus("Sending…");

      try {
        const response = await fetch("api/contact.php", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        let result = null;
        try {
          result = await response.json();
        } catch (_parseError) {
          // Non-JSON response — treated as failure below.
        }

        if (!response.ok || !result || result.ok !== true) {
          throw new Error((result && result.error) || "Request failed");
        }

        setStatus("Thanks — we'll be in touch soon.", "success");
        form.reset();
      } catch (_err) {
        setStatus("Something went wrong sending that. Please try again shortly.", "error");
      } finally {
        submitBtn.disabled = false;
      }
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
