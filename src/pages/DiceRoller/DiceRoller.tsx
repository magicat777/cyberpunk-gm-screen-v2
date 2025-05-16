import React from 'react';
import { DiceRoller as DiceRollerComponent } from '@components/gm-tools/DiceRoller';
import styles from './DiceRoller.module.css';

const DiceRoller: React.FC = () => {
  return (
    <div className={styles.diceRoller}>
      <DiceRollerComponent />
    </div>
  );
};

export default DiceRoller;