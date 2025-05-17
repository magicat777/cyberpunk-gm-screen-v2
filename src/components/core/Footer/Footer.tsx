import React from 'react';
import styles from './Footer.module.css';

export const Footer: React.FC = () => {
  return (
    <footer className={styles.footer} role="contentinfo">
      <div className={styles.container}>
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>About</h3>
          <p className={styles.text}>
            Cyberpunk GM Screen is an interactive tool for Game Masters running
            Cyberpunk Red tabletop RPG sessions.
          </p>
        </div>
        
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>Legal</h3>
          <p className={styles.text}>
            Cyberpunk Red is a trademark of R. Talsorian Games Inc.
          </p>
          <p className={styles.text}>
            This is an unofficial fan project.
          </p>
        </div>
        
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>Links</h3>
          <ul className={styles.links}>
            <li>
              <a 
                href="https://github.com/magicat777/cyberpunk-gm-screen-v2"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.link}
              >
                GitHub
              </a>
            </li>
            <li>
              <button type="button" className={`link-button ${styles.link}`}
              >
                Documentation
              </button>
            </li>
          </ul>
        </div>
      </div>
      
      <div className={styles.bottom}>
        <p className={styles.copyright}>
          © 2024 Cyberpunk GM Screen. All rights reserved.
        </p>
      </div>
    </footer>
  );
};
