import React from 'react';
import { EncounterBuilder } from '../../components/gm-tools/EncounterBuilder/EncounterBuilder';
import styles from './Encounters.module.css';

export const Encounters: React.FC = () => {
  return (
    <div className={styles.encountersPage}>
      <EncounterBuilder />
    </div>
  );
};