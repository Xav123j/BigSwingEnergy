/**
 * Big Swing Energy - Cookie Consent Banner
 * Lightweight vanilla JS implementation of a GDPR & PECR compliant cookie banner
 * Blocks non-essential scripts until consent is provided
 * Stores consent in localStorage
 */

(function() {
  'use strict';
  
  // Configuration
  const COOKIE_CONSENT_KEY = 'bse_cookie_consent';
  const COOKIE_CONSENT_EXPIRY_DAYS = 365;
  
  // Cookie categories - add more as needed
  const COOKIE_CATEGORIES = {
    necessary: {
      id: 'necessary',
      label: 'Necessary',
      description: 'Required for the website to function properly. Cannot be disabled.',
      isAlwaysEnabled: true,
    },
    analytics: {
      id: 'analytics',
      label: 'Analytics',
      description: 'Helps us understand how visitors interact with our website so we can improve it.',
      isAlwaysEnabled: false,
    },
  };
  
  /**
   * Get consent from localStorage
   */
  function getConsent() {
    try {
      const consent = localStorage.getItem(COOKIE_CONSENT_KEY);
      return consent ? JSON.parse(consent) : null;
    } catch (error) {
      console.error('Error getting cookie consent from localStorage:', error);
      return null;
    }
  }
  
  /**
   * Save consent to localStorage
   */
  function saveConsent(consentData) {
    try {
      // Add timestamp when the consent was saved
      const consentWithTimestamp = { 
        ...consentData,
        timestamp: new Date().toISOString(),
        expiresAt: new Date(Date.now() + COOKIE_CONSENT_EXPIRY_DAYS * 24 * 60 * 60 * 1000).toISOString()
      };
      
      localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify(consentWithTimestamp));
      return true;
    } catch (error) {
      console.error('Error saving cookie consent to localStorage:', error);
      return false;
    }
  }
  
  /**
   * Check if consent has expired
   */
  function isConsentExpired(consentData) {
    if (!consentData || !consentData.expiresAt) return true;
    
    try {
      const expiryDate = new Date(consentData.expiresAt);
      return expiryDate < new Date();
    } catch (error) {
      console.error('Error checking consent expiry:', error);
      return true;
    }
  }
  
  /**
   * Create cookie banner element - smaller and less intrusive
   */
  function createBanner() {
    const banner = document.createElement('div');
    banner.id = 'cookie-consent-banner';
    banner.setAttribute('aria-live', 'polite');
    banner.setAttribute('role', 'dialog');
    banner.setAttribute('aria-modal', 'false');
    banner.setAttribute('aria-labelledby', 'cookie-consent-title');
    banner.setAttribute('aria-describedby', 'cookie-consent-description');
    
    // Add styling for a smaller, corner-positioned banner
    banner.style.position = 'fixed';
    banner.style.bottom = '1rem';
    banner.style.right = '1rem';
    banner.style.maxWidth = '320px';
    banner.style.backgroundColor = '#000000';
    banner.style.color = '#f5f5f5';
    banner.style.padding = '0.75rem';
    banner.style.boxShadow = '0 2px 12px rgba(0, 0, 0, 0.25)';
    banner.style.zIndex = '9999';
    banner.style.borderRadius = '8px';
    banner.style.border = '1px solid #d4af37';
    banner.style.fontFamily = 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    banner.style.fontSize = '0.8rem';
    banner.style.lineHeight = '1.4';
    
    // Set compact banner content
    banner.innerHTML = `
      <div style="display: flex; flex-direction: column; gap: 0.5rem;">
        <div>
          <p id="cookie-consent-description" style="margin: 0 0 0.5rem 0; font-size: 0.8rem;">We use cookies to improve your experience. <a href="/privacy.html" style="color: #d4af37; text-decoration: underline;">Learn more</a></p>
        </div>
        <div style="display: flex; flex-wrap: wrap; gap: 0.5rem;">
          <button id="accept-all-cookies" style="background-color: #d4af37; color: #000000; border: none; padding: 0.4rem 0.75rem; border-radius: 9999px; cursor: pointer; font-weight: bold; font-size: 0.8rem; white-space: nowrap;">Accept All</button>
          <button id="reject-non-essential-cookies" style="background-color: transparent; color: #f5f5f5; border: 1px solid #d4af37; padding: 0.4rem 0.75rem; border-radius: 9999px; cursor: pointer; font-size: 0.8rem; white-space: nowrap;">Reject Non-Essential</button>
          <button id="manage-cookie-settings" style="background-color: transparent; color: #f5f5f5; border: none; text-decoration: underline; cursor: pointer; padding: 0.3rem; font-size: 0.8rem;">Settings</button>
        </div>
      </div>
    `;
    
    return banner;
  }
  
  /**
   * Create detailed settings modal
   */
  function createSettingsModal() {
    const modal = document.createElement('div');
    modal.id = 'cookie-settings-modal';
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-labelledby', 'cookie-settings-title');
    modal.setAttribute('aria-modal', 'true');
    
    // Style the modal
    modal.style.position = 'fixed';
    modal.style.top = '0';
    modal.style.left = '0';
    modal.style.right = '0';
    modal.style.bottom = '0';
    modal.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
    modal.style.display = 'flex';
    modal.style.alignItems = 'center';
    modal.style.justifyContent = 'center';
    modal.style.zIndex = '10000';
    modal.style.padding = '1rem';
    
    // Create modal content
    const modalContent = document.createElement('div');
    modalContent.style.backgroundColor = '#000000';
    modalContent.style.color = '#f5f5f5';
    modalContent.style.borderRadius = '0.5rem';
    modalContent.style.padding = '1.5rem';
    modalContent.style.maxWidth = '500px';
    modalContent.style.width = '100%';
    modalContent.style.maxHeight = '90vh';
    modalContent.style.overflowY = 'auto';
    modalContent.style.border = '1px solid #d4af37';
    modalContent.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.3)';
    
    // Add title
    const title = document.createElement('h2');
    title.id = 'cookie-settings-title';
    title.textContent = 'Cookie Settings';
    title.style.color = '#d4af37';
    title.style.marginTop = '0';
    title.style.fontSize = '1.2rem';
    
    // Add description
    const description = document.createElement('p');
    description.textContent = 'Customize your cookie preferences below. Necessary cookies are always enabled.';
    description.style.fontSize = '0.9rem';
    
    // Create form for cookie options
    const form = document.createElement('form');
    form.id = 'cookie-settings-form';
    form.style.marginTop = '1rem';
    
    // Add options for each cookie category
    Object.values(COOKIE_CATEGORIES).forEach(category => {
      const categoryDiv = document.createElement('div');
      categoryDiv.style.marginBottom = '1rem';
      categoryDiv.style.padding = '0.75rem';
      categoryDiv.style.border = '1px solid rgba(212, 175, 55, 0.3)';
      categoryDiv.style.borderRadius = '0.25rem';
      
      const labelWrapper = document.createElement('div');
      labelWrapper.style.display = 'flex';
      labelWrapper.style.alignItems = 'center';
      labelWrapper.style.justifyContent = 'space-between';
      labelWrapper.style.marginBottom = '0.5rem';
      
      const label = document.createElement('label');
      label.setAttribute('for', `cookie-${category.id}`);
      label.textContent = category.label;
      label.style.fontWeight = 'bold';
      label.style.fontSize = '1rem';
      
      const toggle = document.createElement('div');
      toggle.style.display = 'flex';
      toggle.style.alignItems = 'center';
      
      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.id = `cookie-${category.id}`;
      checkbox.name = category.id;
      checkbox.checked = category.isAlwaysEnabled;
      checkbox.disabled = category.isAlwaysEnabled;
      checkbox.style.marginRight = '0.5rem';
      
      const status = document.createElement('span');
      status.textContent = category.isAlwaysEnabled ? 'Required' : 'Optional';
      status.style.fontSize = '0.75rem';
      status.style.opacity = '0.7';
      
      toggle.appendChild(checkbox);
      toggle.appendChild(status);
      
      labelWrapper.appendChild(label);
      labelWrapper.appendChild(toggle);
      
      const description = document.createElement('p');
      description.textContent = category.description;
      description.style.margin = '0';
      description.style.fontSize = '0.85rem';
      
      categoryDiv.appendChild(labelWrapper);
      categoryDiv.appendChild(description);
      
      form.appendChild(categoryDiv);
    });
    
    // Add buttons
    const buttonContainer = document.createElement('div');
    buttonContainer.style.display = 'flex';
    buttonContainer.style.justifyContent = 'flex-end';
    buttonContainer.style.gap = '0.75rem';
    buttonContainer.style.marginTop = '1rem';
    
    const cancelButton = document.createElement('button');
    cancelButton.type = 'button';
    cancelButton.id = 'cancel-cookie-settings';
    cancelButton.textContent = 'Cancel';
    cancelButton.style.backgroundColor = 'transparent';
    cancelButton.style.color = '#f5f5f5';
    cancelButton.style.border = '1px solid #d4af37';
    cancelButton.style.padding = '0.4rem 0.75rem';
    cancelButton.style.borderRadius = '9999px';
    cancelButton.style.cursor = 'pointer';
    cancelButton.style.fontSize = '0.85rem';
    
    const saveButton = document.createElement('button');
    saveButton.type = 'button';
    saveButton.id = 'save-cookie-settings';
    saveButton.textContent = 'Save Preferences';
    saveButton.style.backgroundColor = '#d4af37';
    saveButton.style.color = '#000000';
    saveButton.style.border = 'none';
    saveButton.style.padding = '0.4rem 0.75rem';
    saveButton.style.borderRadius = '9999px';
    saveButton.style.cursor = 'pointer';
    saveButton.style.fontWeight = 'bold';
    saveButton.style.fontSize = '0.85rem';
    
    buttonContainer.appendChild(cancelButton);
    buttonContainer.appendChild(saveButton);
    
    // Assemble the modal
    modalContent.appendChild(title);
    modalContent.appendChild(description);
    modalContent.appendChild(form);
    modalContent.appendChild(buttonContainer);
    modal.appendChild(modalContent);
    
    return modal;
  }
  
  /**
   * Handle user consent choices
   */
  function handleConsent(type) {
    let consentData = {
      necessary: true, // Always enabled
      analytics: false // Disabled by default
    };
    
    switch (type) {
      case 'accept-all':
        // Enable all cookie categories
        Object.keys(COOKIE_CATEGORIES).forEach(category => {
          consentData[category] = true;
        });
        break;
        
      case 'reject-non-essential':
        // Only enable necessary cookies
        // (consentData already has necessary: true as default)
        break;
        
      case 'save-settings':
        // Get selections from form
        const form = document.getElementById('cookie-settings-form');
        if (form) {
          Object.keys(COOKIE_CATEGORIES).forEach(category => {
            const checkbox = document.getElementById(`cookie-${category}`);
            if (checkbox) {
              consentData[category] = checkbox.checked;
            }
          });
        }
        break;
        
      default:
        console.error('Unknown consent type:', type);
        return;
    }
    
    // Save the user's consent
    saveConsent(consentData);
    
    // Close banner and modal
    const banner = document.getElementById('cookie-consent-banner');
    if (banner) banner.remove();
    
    const modal = document.getElementById('cookie-settings-modal');
    if (modal) modal.remove();
    
    // Apply consent (enable/disable scripts based on choices)
    applyConsent(consentData);
    
    // Dispatch an event so other scripts can react to consent changes
    window.dispatchEvent(new CustomEvent('cookieConsentUpdated', { detail: consentData }));
  }
  
  /**
   * Apply consent by enabling/disabling scripts
   */
  function applyConsent(consentData) {
    // 1. Handle analytics consent (e.g., Google Analytics)
    if (consentData.analytics) {
      enableAnalytics();
    }
    
    // Add more consent applications as needed for other categories
  }
  
  /**
   * Enable Google Analytics if present
   */
  function enableAnalytics() {
    // If you're using Google Analytics/Google Tag Manager
    // This function would activate those scripts
    
    // Example: Load GA script
    if (typeof window.gtag === 'undefined' && !document.getElementById('ga-script')) {
      /* Uncomment and update when ready to add Google Analytics
      const gaScript = document.createElement('script');
      gaScript.id = 'ga-script';
      gaScript.async = true;
      gaScript.src = 'https://www.googletagmanager.com/gtag/js?id=YOUR-GA-ID';
      document.head.appendChild(gaScript);
      
      const gaInit = document.createElement('script');
      gaInit.innerHTML = `
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', 'YOUR-GA-ID');
      `;
      document.head.appendChild(gaInit);
      */
    }
  }
  
  /**
   * Initialize the cookie consent system
   */
  function init() {
    // Check if we already have consent stored
    const existingConsent = getConsent();
    
    // If we have valid consent that hasn't expired, apply it
    if (existingConsent && !isConsentExpired(existingConsent)) {
      applyConsent(existingConsent);
      return;
    }
    
    // Otherwise, show the cookie banner
    const banner = createBanner();
    document.body.appendChild(banner);
    
    // Set up event listeners for banner buttons
    document.getElementById('accept-all-cookies').addEventListener('click', () => {
      handleConsent('accept-all');
    });
    
    document.getElementById('reject-non-essential-cookies').addEventListener('click', () => {
      handleConsent('reject-non-essential');
    });
    
    document.getElementById('manage-cookie-settings').addEventListener('click', () => {
      // Show detailed settings modal
      const modal = createSettingsModal();
      document.body.appendChild(modal);
      
      // Set up event listeners for modal buttons
      document.getElementById('cancel-cookie-settings').addEventListener('click', () => {
        modal.remove();
      });
      
      document.getElementById('save-cookie-settings').addEventListener('click', () => {
        handleConsent('save-settings');
      });
      
      // Close modal when clicking outside
      modal.addEventListener('click', (event) => {
        if (event.target === modal) {
          modal.remove();
        }
      });
    });
  }
  
  // Initialize when the DOM is fully loaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
  
  // Expose API for use by other scripts
  window.BSECookieConsent = {
    getConsent,
    openSettings: function() {
      const modal = createSettingsModal();
      document.body.appendChild(modal);
      
      // Set up event listeners for modal buttons
      document.getElementById('cancel-cookie-settings').addEventListener('click', () => {
        modal.remove();
      });
      
      document.getElementById('save-cookie-settings').addEventListener('click', () => {
        handleConsent('save-settings');
      });
      
      // Close modal when clicking outside
      modal.addEventListener('click', (event) => {
        if (event.target === modal) {
          modal.remove();
        }
      });
    }
  };
})(); 