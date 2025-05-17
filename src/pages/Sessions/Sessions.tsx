import React from 'react';
import { SessionManager } from '../../components/utility/SessionManager/SessionManager';
import styles from './Sessions.module.css';

export const Sessions: React.FC = () => {
  return (
    <div className={styles.sessionsPage}>
      <div className={styles.header}>
        <h1>Session Management</h1>
        <p>Manage your game sessions, campaigns, and track progress</p>
      </div>
      
      <SessionManager />
    </div>
  );
};