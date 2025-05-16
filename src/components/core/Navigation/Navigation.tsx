import React from 'react';
import { NavLink } from 'react-router-dom';
import styles from './Navigation.module.css';

interface NavigationProps {
  isOpen: boolean;
  onClose: () => void;
}

const navItems = [
  { to: '/', label: 'Dashboard', icon: '🏠' },
  { to: '/dice', label: 'Dice Roller', icon: '🎲' },
  { to: '/rules', label: 'Rules Reference', icon: '📖' },
  { to: '/combat', label: 'Combat Tracker', icon: '⚔️' },
  { to: '/npcs', label: 'NPCs', icon: '👥' },
  { to: '/cyberware', label: 'Cyberware', icon: '🤖' },
  { to: '/equipment', label: 'Equipment', icon: '🔧' },
  { to: '/maps', label: 'Maps', icon: '🗺️' },
];

export const Navigation: React.FC<NavigationProps> = ({ isOpen, onClose }) => {
  return (
    <>
      {isOpen && (
        <div 
          className={styles.overlay} 
          onClick={onClose}
          aria-hidden="true"
        />
      )}
      
      <nav
        className={`${styles.navigation} ${isOpen ? styles.open : ''}`}
        role="navigation"
        aria-label="Main navigation"
      >
        <div className={styles.header}>
          <h2 className={styles.title}>Navigation</h2>
          <button
            className={styles.closeButton}
            onClick={onClose}
            aria-label="Close navigation"
            type="button"
          >
            ✕
          </button>
        </div>
        
        <ul className={styles.navList}>
          {navItems.map((item) => (
            <li key={item.to}>
              <NavLink
                to={item.to}
                className={({ isActive }) =>
                  `${styles.navLink} ${isActive ? styles.active : ''}`
                }
                onClick={onClose}
              >
                <span className={styles.icon}>{item.icon}</span>
                <span className={styles.label}>{item.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </>
  );
};