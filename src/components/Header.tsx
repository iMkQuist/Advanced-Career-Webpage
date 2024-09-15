import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAuth } from '../context/AuthContext'; // Assuming you have an AuthContext
import styles from '../styles/Header.module.css'; // Assuming you're using CSS modules
import { BsSearch, BsSun, BsMoon } from 'react-icons/bs'; // Icons for dark mode and search

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const { user, logout } = useAuth(); // Assuming useAuth gives us user and logout
  const router = useRouter();

  useEffect(() => {
    // Check for the theme preference in local storage
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  const handleLogout = () => {
    logout();
    router.push('/login'); // Redirect to login page after logout
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleDarkMode = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    if (newMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(`/search?query=${searchQuery}`);
  };

  return (
    <header className={styles.header}>
      <nav className={styles.navbar} aria-label="Main Navigation">
        <Link href="/" className={styles.brand}>
          Career Website
        </Link>

        {/* Search Bar */}
        <form className={styles.searchForm} onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Search jobs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={styles.searchInput}
          />
          <button type="submit" className={styles.searchButton}>
            <BsSearch />
          </button>
        </form>

        {/* Desktop Navigation Links */}
        <ul className={`${styles.navLinks} ${isMenuOpen ? styles.active : ''}`}>
          <li className={router.pathname === '/jobs' ? styles.activeLink : ''}>
            <Link href="/jobs">Jobs</Link>
          </li>
          <li className={router.pathname === '/profile' ? styles.activeLink : ''}>
            {user ? (
              <div className={styles.dropdown}>
                <button className={styles.profileButton}>
                  Profile
                </button>
                <ul className={styles.dropdownContent}>
                  <li>
                    <Link href="/profile">My Profile</Link>
                  </li>
                  <li>
                    <Link href="/settings">Settings</Link>
                  </li>
                  <li>
                    <button onClick={handleLogout}>Logout</button>
                  </li>
                </ul>
              </div>
            ) : (
              <Link href="/login">Login</Link>
            )}
          </li>
          <li className={router.pathname === '/admin/dashboard' ? styles.activeLink : ''}>
            {user?.isAdmin && <Link href="/admin/dashboard">Admin</Link>}
          </li>
        </ul>

        {/* Theme Toggle and Hamburger Menu for Mobile */}
        <div className={styles.rightActions}>
          <button onClick={toggleDarkMode} className={styles.themeToggle}>
            {isDarkMode ? <BsMoon /> : <BsSun />}
          </button>
          <button
            className={styles.menuToggle}
            aria-label="Menu"
            aria-expanded={isMenuOpen}
            onClick={toggleMenu}
          >
            <span className={styles.hamburger}></span>
            <span className={styles.hamburger}></span>
            <span className={styles.hamburger}></span>
          </button>
        </div>
      </nav>
    </header>
  );
}
