import { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from '../styles/Footer.module.css'; // Assuming CSS Modules

export default function Footer() {
  const [showBackToTop, setShowBackToTop] = useState<boolean>(false);
  const [email, setEmail] = useState<string>('');
  const [subscribed, setSubscribed] = useState<boolean>(false);

  useEffect(() => {
    // Show back-to-top button when scrolled down
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowBackToTop(true);
      } else {
        setShowBackToTop(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSubscribe = (e: any) => {
    e.preventDefault();
    if (!email) {
      alert('Please enter a valid email.');
      return;
    }
    // Subscription logic here (e.g., call to API)
    setSubscribed(true);
    setEmail('');
  };

  return (
    <footer className={styles.footer}>
      <div className={styles.footerTop}>
        <div className={styles.column}>
          <h3>About Us</h3>
          <p>
            Career Website is dedicated to helping individuals find the best job opportunities.
            Our platform offers thousands of listings from top companies around the globe.
          </p>
        </div>

        <div className={styles.column}>
          <h3>Quick Links</h3>
          <ul>
            <li>
              <Link href="/about">About Us</Link>
            </li>
            <li>
              <Link href="/privacy">Privacy Policy</Link>
            </li>
            <li>
              <Link href="/terms">Terms of Service</Link>
            </li>
            <li>
              <Link href="/contact">Contact Us</Link>
            </li>
          </ul>
        </div>

        <div className={styles.column}>
          <h3>Follow Us</h3>
          <div className={styles.socialIcons}>
            <a href="https://www.facebook.com" target="_blank" aria-label="Facebook">
              <i className="fab fa-facebook"></i>
            </a>
            <a href="https://www.twitter.com" target="_blank" aria-label="Twitter">
              <i className="fab fa-twitter"></i>
            </a>
            <a href="https://www.linkedin.com" target="_blank" aria-label="LinkedIn">
              <i className="fab fa-linkedin"></i>
            </a>
            <a href="https://www.instagram.com" target="_blank" aria-label="Instagram">
              <i className="fab fa-instagram"></i>
            </a>
          </div>
        </div>

        <div className={styles.column}>
          <h3>Subscribe to Our Newsletter</h3>
          {subscribed ? (
            <p className={styles.successMessage}>Thank you for subscribing!</p>
          ) : (
            <form onSubmit={handleSubscribe} className={styles.newsletterForm}>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className={styles.inputField}
              />
              <button type="submit" className={styles.subscribeButton}>
                Subscribe
              </button>
            </form>
          )}
        </div>
      </div>

      <div className={styles.footerBottom}>
        <p>&copy; {new Date().getFullYear()} Career Website. All rights reserved.</p>
      </div>

      {showBackToTop && (
        <button
          className={styles.backToTopButton}
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
          Back to Top
        </button>
      )}
    </footer>
  );
}
