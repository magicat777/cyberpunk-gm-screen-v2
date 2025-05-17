import React from 'react';
import { EquipmentDatabase } from '../../components/reference/EquipmentDatabase/EquipmentDatabase';
import styles from './Equipment.module.css';

export const Equipment: React.FC = () => {
  return (
    <div className={styles.equipmentPage}>
      <div className={styles.header}>
        <h1>Equipment Database</h1>
        <p>Browse weapons, armor, cyberware, and more</p>
      </div>
      
      <EquipmentDatabase />
    </div>
  );
};