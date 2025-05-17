import React from 'react';
import { NightCityMap } from '../../components/interactive/NightCityMap/NightCityMap';
import styles from './Maps.module.css';

export const Maps: React.FC = () => {
  return (
    <div className={styles.mapsPage}>
      <div className={styles.header}>
        <h1>Night City Map</h1>
        <p>Interactive map with districts, gang territories, and landmarks</p>
      </div>
      
      <NightCityMap />
    </div>
  );
};