import { useState, useCallback } from 'react';
import { Header, Footer } from './components/layout';
import { Hero, Features, Pricing, Support } from './components/sections';
import { ContactModal } from './components/ui';
import { ThemeProvider } from './context/ThemeContext';
import './styles/main.css';

/**
 * Main App Component
 */
function App() {
  const [activeSection, setActiveSection] = useState('home');
  const [modalState, setModalState] = useState({
    isOpen: false,
    reason: 'general',
  });

  // Navigation handler - triggers smooth scroll
  const handleNavigate = useCallback((href) => {
    if (href.startsWith('#')) {
      const sectionId = href.slice(1);
      setActiveSection(sectionId);

      // Smooth scroll to section
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  }, []);

  // Section change handler - updates active section without scrolling
  const handleSectionChange = useCallback((sectionId) => {
    setActiveSection(sectionId);
  }, []);

  // Contact modal handlers
  const openContactModal = useCallback((reason = 'general') => {
    setModalState({ isOpen: true, reason });
  }, []);

  const closeContactModal = useCallback(() => {
    setModalState((prev) => ({ ...prev, isOpen: false }));
  }, []);

  const handleContactSubmit = useCallback(async (payload) => {
    const submitBtn = document.querySelector('[data-testid="contact-submit"]');
    const statusEl = document.querySelector('[data-testid="contact-status"]');

    const setStatus = (text, variant) => {
      if (statusEl) {
        statusEl.textContent = text;
        statusEl.className = `contact-status${variant ? ` contact-status-${variant}` : ''}`;
      }
    };

    if (submitBtn) submitBtn.disabled = true;
    setStatus('Sending…');

    try {
      const response = await fetch('api/contact.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      let result = null;
      try {
        result = await response.json();
      } catch (_parseError) {
        // Non-JSON response — treated as failure below.
      }

      if (!response.ok || !result || result.ok !== true) {
        throw new Error((result && result.error) || 'Request failed');
      }

      setStatus('Thanks — we\'ll be in touch soon.', 'success');
    } catch (_err) {
      setStatus('Something went wrong sending that. Please try again shortly.', 'error');
    } finally {
      if (submitBtn) submitBtn.disabled = false;
    }
  }, []);

  return (
    <ThemeProvider>
      <Header
        activeSection={activeSection}
        onNavigate={handleNavigate}
        onSectionChange={handleSectionChange}
      />
      <main>
        <Hero onNavigate={handleNavigate} />
        <Features />
        <Pricing onOpenContact={openContactModal} />
        <Support onOpenContact={openContactModal} />
      </main>
      <Footer />
      <ContactModal
        isOpen={modalState.isOpen}
        onClose={closeContactModal}
        onSubmit={handleContactSubmit}
        initialReason={modalState.reason}
      />
    </ThemeProvider>
  );
}

export default App;
