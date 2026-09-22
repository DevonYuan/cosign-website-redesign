/**
 * Cosign Website - Development Server
 * Serves static files and handles contact form submissions
 */

import express from 'express';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

// Contact form endpoint
app.post('/api/contact', async (req, res) => {
  const { reason, name, email, message, website, opened_at } = req.body;

  // Honeypot check
  if (website) {
    return res.status(400).json({ ok: false, error: 'Spam detected' });
  }

  // Basic validation
  if (!reason || !name || !email || !message) {
    return res.status(400).json({ ok: false, error: 'Missing required fields' });
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ ok: false, error: 'Invalid email format' });
  }

  // In production, you would send this to an email service (SendGrid, Resend, etc.)
  // For now, we'll just log it and return success
  console.log('📬 Contact form submission:', {
    reason,
    name: name.trim(),
    email: email.trim(),
    message: message.trim(),
    opened_at,
    timestamp: new Date().toISOString(),
  });

  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));

  res.json({ ok: true });
});

// SPA fallback - serve index.html for all non-API routes
app.get('*', (req, res) => {
  if (!req.path.startsWith('/api/')) {
    res.sendFile(join(__dirname, 'index.html'));
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Cosign website running at http://localhost:${PORT}`);
});