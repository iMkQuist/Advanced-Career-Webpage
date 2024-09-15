// MainLayout.tsx
"use client"; // Add this line at the top

import { ReactNode, useEffect, useState } from 'react';
import Head from 'next/head';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { usePathname, useSearchParams } from 'next/navigation'; // Updated navigation API
import Loader from '../components/Loader';
import ErrorBoundary from '../components/ErrorBoundary';

interface MainLayoutProps {
  children: ReactNode;
  title?: string;
  description?: string;
  keywords?: string;
  showBreadcrumbs?: boolean; // Toggle to show breadcrumbs if needed
}

export default function MainLayout({
  children,
  title = 'Default Title',
  description = 'Default description of the page',
  keywords = 'default, keywords, for, seo',
  showBreadcrumbs = true, // You can toggle this from individual pages
}: MainLayoutProps) {
  const pathname = usePathname() ?? ''; // Ensure pathname is not null, fallback to empty string
  const [loading, setLoading] = useState(false);

  // Scroll restoration and loading indicator for route changes
  useEffect(() => {
    const handleRouteChangeStart = () => {
      setLoading(true);
      window.scrollTo(0, 0); // Scroll to the top on page transition
    };
    const handleRouteChangeComplete = () => setLoading(false);

    // Simulating route change event listeners manually since useRouter is no longer in use
    window.addEventListener('popstate', handleRouteChangeStart); // Detects back/forward navigation
    window.addEventListener('load', handleRouteChangeComplete); // Detect when the page is fully loaded

    return () => {
      window.removeEventListener('popstate', handleRouteChangeStart);
      window.removeEventListener('load', handleRouteChangeComplete);
    };
  }, [pathname]);

  return (
    <>
      {/* Meta tags for SEO */}
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="keywords" content={keywords} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      {/* Header */}
      <Header />

      {/* Loading indicator */}
      {loading && <Loader />}

      {/* Breadcrumbs (optional) */}
      {showBreadcrumbs && (
        <nav aria-label="Breadcrumb" className="breadcrumbs">
          <ol>
            {pathname
              .split('/')
              .filter(Boolean)
              .map((crumb, index) => (
                <li key={index}>
                  <a href={`/${crumb}`}>{crumb || 'Home'}</a>
                </li>
              ))}
          </ol>
        </nav>
      )}

      {/* Main content area with error boundary */}
      <ErrorBoundary>
        <main className="main-content">{children}</main>
      </ErrorBoundary>

      {/* Footer */}
      <Footer />

      {/* Global styles and layout */}
      <style jsx>{`
        .main-content {
          min-height: calc(100vh - 150px); /* Ensure the footer is at the bottom */
          padding: 20px;
          margin: 0 auto;
          max-width: 1200px; /* Max width for better readability */
        }

        .breadcrumbs {
          margin: 20px 0;
          padding: 10px;
          background-color: #f9f9f9;
          border-radius: 5px;
        }

        .breadcrumbs ol {
          display: flex;
          gap: 8px;
          list-style: none;
        }

        .breadcrumbs ol li a {
          color: #0070f3;
          text-decoration: none;
        }

        .breadcrumbs ol li a:hover {
          text-decoration: underline;
        }

        @media (max-width: 768px) {
          .main-content {
            padding: 15px;
            max-width: 100%; /* Full width for smaller devices */
          }
        }
      `}</style>
    </>
  );
}
