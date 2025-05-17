import React from 'react';
import { NetArchitectureVisualizer } from '../../components/interactive/NetArchitectureVisualizer/NetArchitectureVisualizer';
import styles from './Netrunning.module.css';

export const Netrunning: React.FC = () => {
  return (
    <div className={styles.netrunningPage}>
      <div className={styles.header}>
        <h1>NetArchitecture System</h1>
        <p>Design and visualize complex netrunning environments for 2077/Edgerunners era</p>
      </div>
      
      <NetArchitectureVisualizer />
    </div>
  );
};