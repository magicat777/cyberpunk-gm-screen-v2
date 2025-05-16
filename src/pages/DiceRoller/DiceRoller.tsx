import React from 'react';
import styles from './DiceRoller.module.css';

const DiceRoller: React.FC = () => {
  return (
    <div className={styles.diceRoller}>
      <h1 className={styles.title}>Dice Roller</h1>
      <p className={styles.placeholder}>Dice roller component coming soon...</p>
    </div>
  );
};

export default DiceRoller;