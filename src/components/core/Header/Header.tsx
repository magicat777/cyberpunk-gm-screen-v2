import React from 'react';
import styles from './Header.module.css';

interface HeaderProps {
  onMenuClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onMenuClick }) => {
  return (
    <header className={styles.header} role="banner">
      <div className={styles.container}>
        <button
          className={styles.menuButton}
          onClick={onMenuClick}
          aria-label="Toggle navigation menu"
          type="button"
        >
          <span className={styles.hamburger}>
            <span></span>
            <span></span>
            <span></span>
          </span>
        </button>
        
        <h1 className={styles.title}>Cyberpunk GM Screen</h1>
        
        <div className={styles.actions}>
          <button
            className={styles.themeToggle}
            aria-label="Toggle theme"
            type="button"
          >
            🌙
          </button>
        </div>
      </div>
    </header>
  );
};