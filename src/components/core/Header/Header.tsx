import React from 'react';
import { usePreferences } from '@/store';
import styles from './Header.module.css';

interface HeaderProps {
  onMenuClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onMenuClick }) => {
  const { preferences, updateTheme } = usePreferences();
  
  const handleThemeToggle = () => {
    const themes: Array<typeof preferences.theme> = ['cyberpunk', 'dark', 'light', 'high-contrast'];
    const currentIndex = themes.indexOf(preferences.theme);
    const nextIndex = (currentIndex + 1) % themes.length;
    updateTheme(themes[nextIndex]);
  };
  
  const getThemeIcon = () => {
    switch (preferences.theme) {
      case 'light':
        return '☀️';
      case 'dark':
        return '🌙';
      case 'cyberpunk':
        return '💾';
      case 'high-contrast':
        return '👁️';
      default:
        return '🌙';
    }
  };
  
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
            onClick={handleThemeToggle}
            aria-label={`Current theme: ${preferences.theme}. Click to change theme`}
            type="button"
            title={`Theme: ${preferences.theme}`}
          >
            {getThemeIcon()}
          </button>
        </div>
      </div>
    </header>
  );
};