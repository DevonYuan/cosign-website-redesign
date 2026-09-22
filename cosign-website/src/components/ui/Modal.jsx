import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

/**
 * Contact Modal component
 * @param {Object} props - Modal props
 * @param {boolean} props.isOpen - Whether modal is open
 * @param {Function} props.onClose - Close handler
 * @param {Function} props.onSubmit - Form submit handler
 * @param {string} props.initialReason - Initial reason value
 */
export function ContactModal({ isOpen, onClose, onSubmit, initialReason = 'general' }) {
  const modalRef = useRef(null);
  const formRef = useRef(null);
  const previousActiveElement = useRef(null);

  // Show/hide modal using native dialog methods
  useEffect(() => {
    const dialog = modalRef.current;
    if (!dialog) return;

    if (isOpen) {
      previousActiveElement.current = document.activeElement;
      document.body.style.overflow = 'hidden';
      dialog.showModal();
      // Focus first input after render
      setTimeout(() => {
        const firstInput = dialog.querySelector('input, select, textarea');
        firstInput?.focus();
      }, 0);
    } else {
      dialog.close();
      document.body.style.overflow = '';
      previousActiveElement.current?.focus();
    }

    return () => {
      document.body.style.overflow = '';
      if (dialog.open) dialog.close();
    };
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Handle backdrop click
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const payload = {
      reason: formData.get('reason'),
      name: formData.get('name').trim(),
      email: formData.get('email').trim(),
      message: formData.get('message').trim(),
      website: formData.get('website'), // honeypot
      opened_at: formData.get('opened_at'),
    };

    await onSubmit(payload);
  };

  if (!isOpen) return null;

  const modalContent = (
    <dialog
      ref={modalRef}
      className="contact-modal"
      data-testid="contact-modal"
      onClick={handleBackdropClick}
    >
      <form ref={formRef} className="contact-form" data-testid="contact-form" onSubmit={handleSubmit}>
        <button
          type="button"
          className="modal-close"
          data-testid="contact-close"
          aria-label="Close"
          onClick={onClose}
        >
          ×
        </button>

        <h3 id="contact-modal-title">Get in touch</h3>

        <div className="field">
          <label htmlFor="contact-reason">Reason</label>
          <select
            name="reason"
            id="contact-reason"
            data-testid="contact-reason"
            required
            defaultValue={initialReason}
          >
            <option value="general">General question</option>
            <option value="pricing">I'd like pricing details</option>
            <option value="beta">I'd like to request beta access</option>
          </select>
        </div>

        <div className="field">
          <label htmlFor="contact-name">Name</label>
          <input
            type="text"
            name="name"
            id="contact-name"
            data-testid="contact-name"
            required
            autoComplete="name"
          />
        </div>

        <div className="field">
          <label htmlFor="contact-email">Email</label>
          <input
            type="email"
            name="email"
            id="contact-email"
            data-testid="contact-email"
            required
            autoComplete="email"
          />
        </div>

        <div className="field">
          <label htmlFor="contact-message">Message</label>
          <textarea
            name="message"
            id="contact-message"
            data-testid="contact-message"
            rows={4}
            required
          />
        </div>

        {/* Honeypot field */}
        <div className="field visually-hidden" aria-hidden="true">
          <label htmlFor="contact-honeypot">Leave this field blank</label>
          <input
            type="text"
            name="website"
            id="contact-honeypot"
            data-testid="contact-honeypot"
            tabIndex={-1}
            autoComplete="off"
          />
        </div>
        <input type="hidden" name="opened_at" data-testid="contact-opened-at" defaultValue={Date.now()} />

        <p className="contact-status" data-testid="contact-status" role="status" aria-live="polite"></p>

        <div className="contact-actions">
          <button
            type="button"
            className="button button-secondary"
            data-testid="contact-cancel"
            onClick={onClose}
          >
            Cancel
          </button>
          <button type="submit" className="button button-primary" data-testid="contact-submit">
            Send
          </button>
        </div>
      </form>
    </dialog>
  );

  // Render modal in portal to body for proper stacking
  return createPortal(modalContent, document.body);
}