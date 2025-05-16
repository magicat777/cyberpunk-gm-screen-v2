import React from 'react';
import styles from './AppShell.module.css';
import { Header } from '../Header';
import { Navigation } from '../Navigation';
import { Footer } from '../Footer';

interface AppShellProps {
  children: React.ReactNode;
}

export const AppShell: React.FC<AppShellProps> = ({ children }) => {
  const [isNavigationOpen, setIsNavigationOpen] = React.useState(false);

  return (
    <div className={styles.appShell}>
      <Header onMenuClick={() => setIsNavigationOpen(!isNavigationOpen)} />
      
      <div className={styles.main}>
        <Navigation 
          isOpen={isNavigationOpen} 
          onClose={() => setIsNavigationOpen(false)} 
        />
        
        <main className={styles.content} role="main">
          {children}
        </main>
      </div>
      
      <Footer />
    </div>
  );
};