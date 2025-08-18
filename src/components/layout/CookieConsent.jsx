import { useState, useEffect } from 'react';

export default function CookieConsent() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('cookieConsent');
    if (!consent) setShow(true);
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookieConsent', 'true');
    setShow(false);
  };

  const handleDecline = () => {
    localStorage.setItem('cookieConsent', 'false');
    setShow(false);
  };

  if (!show) return null;

  return (
    <div className="bg-dark text-white p-3 fixed-bottom">
      <div className="container d-flex flex-column flex-sm-row justify-content-between align-items-center">
        <div className="mb-2 mb-sm-0 text-center text-sm-start">
          Ce site utilise des cookies{' '}
          <a href="/cookies" className="text-primary text-decoration-underline">
            En savoir plus
          </a>
        </div>
        <div>
          <button className="btn btn-primary btn-sm me-2" onClick={handleAccept}>
            Accepter
          </button>
          <button className="btn btn-outline-light btn-sm" onClick={handleDecline}>
            Refuser
          </button>
        </div>
      </div>
    </div>
  );
}
