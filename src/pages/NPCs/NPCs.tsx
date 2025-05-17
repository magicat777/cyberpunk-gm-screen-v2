import React from 'react';
import { NPCGenerator } from '../../components/interactive/NPCGenerator/NPCGenerator';
import styles from './NPCs.module.css';

export const NPCs: React.FC = () => {
  return (
    <div className={styles.npcsPage}>
      <NPCGenerator />
    </div>
  );
};