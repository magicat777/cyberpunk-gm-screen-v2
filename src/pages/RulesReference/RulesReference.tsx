import React from 'react';
import { RulesReference as RulesReferenceComponent } from '@components/reference/RulesReference';
import styles from './RulesReference.module.css';

const RulesReference: React.FC = () => {
  return (
    <div className={styles.rulesReference}>
      <RulesReferenceComponent />
    </div>
  );
};

export default RulesReference;