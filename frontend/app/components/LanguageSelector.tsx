'use client';

import { useEffect } from 'react';

// Add type definitions for Google Translate
declare global {
  interface Window {
    google: {
      translate: {
        TranslateElement: {
          new (options: any, element: string): any;
          InlineLayout: {
            HORIZONTAL: string;
          };
        };
      };
    };
    googleTranslateElementInit?: () => void;
  }
}

// Add custom styles to override Google Translate widget
const injectCustomStyles = () => {
  const style = document.createElement('style');
  style.innerHTML = `
    /* Hide Google Translate attribution */
    .goog-logo-link {
      display: none !important;
    }
    .goog-te-gadget {
      color: transparent !important;
    }
    .goog-te-gadget .goog-te-combo {
      color: #4B5563;
      border: 1px solid #E5E7EB;
      border-radius: 0.25rem;
      padding: 0.25rem 1.5rem 0.25rem 0.5rem;
      font-size: 0.75rem;
      line-height: 1rem;
      background-color: transparent;
      cursor: pointer;
      outline: none;
      min-width: 140px;
      max-width: 200px;
    }
    .goog-te-gadget .goog-te-combo:hover {
      border-color: #9CA3AF;
    }
    .goog-te-gadget .goog-te-combo:focus {
      border-color: #6366F1;
      ring: 1px;
      ring-offset: 1px;
      ring-indigo-500;
    }
    /* Hide the banner when translation is in progress */
    .goog-te-banner-frame {
      display: none !important;
    }
    body {
      top: 0 !important;
    }
    /* Make dropdown options smaller */
    .goog-te-combo option {
      font-size: 0.75rem;
      padding: 2px 4px;
    }
  `;
  document.head.appendChild(style);
};

export default function LanguageSelector() {
  useEffect(() => {
    // Add Google Translate script
    const addScript = document.createElement('script');
    addScript.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
    addScript.async = true;
    document.body.appendChild(addScript);

    // Initialize Google Translate with Indian regional languages
    window.googleTranslateElementInit = () => {
      new window.google.translate.TranslateElement(
        {
          pageLanguage: 'en',
          includedLanguages: 'en,hi,bn,te,ta,mr,gu,kn,ml,pa,ur', // Indian languages
          layout: window.google.translate.TranslateElement.InlineLayout.HORIZONTAL,
          autoDisplay: false,
        },
        'google_translate_element'
      );
    };

    // Inject custom styles
    injectCustomStyles();

    return () => {
      document.body.removeChild(addScript);
      delete window.googleTranslateElementInit;
      // Remove custom styles
      const customStyle = document.querySelector('style');
      if (customStyle) {
        customStyle.remove();
      }
    };
  }, []);

  return (
    <div className="fixed top-3 left-3 z-50">
      <div 
        id="google_translate_element" 
        className="bg-white/40 backdrop-blur-sm rounded-md shadow-sm px-1.5 py-1 hover:bg-white/60 transition-all duration-200"
      ></div>
    </div>
  );
}