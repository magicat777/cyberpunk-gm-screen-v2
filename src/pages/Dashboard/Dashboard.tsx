import React from 'react';
import styles from './Dashboard.module.css';

const Dashboard: React.FC = () => {
  return (
    <div className={styles.dashboard}>
      <h1 className={styles.title}>Game Master Dashboard</h1>
      
      <div className={styles.grid}>
        <div className={styles.card}>
          <h2>Quick Actions</h2>
          <p>Access your most used tools</p>
        </div>
        
        <div className={styles.card}>
          <h2>Recent Sessions</h2>
          <p>Continue where you left off</p>
        </div>
        
        <div className={styles.card}>
          <h2>Campaign Notes</h2>
          <p>View and edit your campaign</p>
        </div>
        
        <div className={styles.card}>
          <h2>Resources</h2>
          <p>Quick access to game resources</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;