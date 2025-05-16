import React from 'react';
import { Link } from 'react-router-dom';
import styles from './NotFound.module.css';

const NotFound: React.FC = () => {
  return (
    <div className={styles.notFound}>
      <h1 className={styles.title}>404</h1>
      <p className={styles.message}>Page not found in the matrix</p>
      <Link to="/" className={styles.link}>
        Return to Dashboard
      </Link>
    </div>
  );
};

export default NotFound;