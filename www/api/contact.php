<?php
declare(strict_types=1);

// Public contact endpoint for the Innershell Cosign marketing site.
header('Content-Type: application/json; charset=utf-8');

const RECIPIENT = 'innershell@gmail.com';
const ALLOWED_REASONS = ['general', 'pricing', 'beta'];
const REASON_LABELS = [
    'general' => 'General question',
    'pricing' => 'Pricing inquiry',
    'beta' => 'Beta / pilot request',
];
const MIN_HUMAN_SECONDS = 1.5;

function respond(int $status, array $body): void
{
    http_response_code($status);
    echo json_encode($body);
    exit;
}

function sanitize_header_value(string $value): string
{
    return trim((string) preg_replace('/[\r\n\x00-\x1F]+/', ' ', $value));
}

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    respond(405, ['error' => 'Method not allowed']);
}

$raw = file_get_contents('php://input');
$data = json_decode($raw !== false ? $raw : '', true);
if (!is_array($data)) {
    respond(400, ['error' => 'Invalid request body']);
}

$name = trim((string) ($data['name'] ?? ''));
$email = trim((string) ($data['email'] ?? ''));
$message = trim((string) ($data['message'] ?? ''));
$reason = trim((string) ($data['reason'] ?? 'general'));
$honeypot = trim((string) ($data['website'] ?? ''));
$openedAtMs = (int) ($data['opened_at'] ?? 0);

$submittedTooFast = $openedAtMs > 0
    && (microtime(true) - ($openedAtMs / 1000)) < MIN_HUMAN_SECONDS;

if ($honeypot !== '' || $submittedTooFast) {
    respond(200, ['ok' => true]);
}

if ($name === '' || $email === '' || $message === '') {
    respond(400, ['error' => 'Name, email, and message are required']);
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    respond(400, ['error' => 'Invalid email address']);
}

if (!in_array($reason, ALLOWED_REASONS, true)) {
    $reason = 'general';
}

$safeName = sanitize_header_value($name);
$safeEmail = sanitize_header_value($email);
$reasonLabel = REASON_LABELS[$reason] ?? REASON_LABELS['general'];

$subject = 'Cosign inquiry: ' . $reasonLabel;
$body = "Reason: {$reasonLabel}\n"
    . "Name: {$safeName}\n"
    . "Email: {$safeEmail}\n\n"
    . "Message:\n{$message}\n";

$headers = [
    'From: Innershell Cosign <no-reply@innershell.com>',
    'Reply-To: ' . $safeEmail,
    'Content-Type: text/plain; charset=utf-8',
];

$sent = mail(RECIPIENT, $subject, $body, implode("\r\n", $headers));

if (!$sent) {
    respond(502, ['error' => 'Unable to send message']);
}

respond(200, ['ok' => true]);
