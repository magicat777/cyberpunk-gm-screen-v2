import React, { useState } from 'react';
import { Icon } from './Icon';
import { IconName } from '@/types/icons';
import { iconPaths } from './iconPaths';
import styles from './IconShowcase.module.css';

const iconCategories = {
  dice: ['dice-d4', 'dice-d6', 'dice-d8', 'dice-d10', 'dice-d12', 'dice-d20'],
  navigation: ['chevron-up', 'chevron-down', 'chevron-left', 'chevron-right'],
  actions: ['add', 'remove', 'edit', 'copy', 'paste', 'save', 'load', 'print', 'download', 'upload', 'share'],
  controls: ['menu', 'close', 'settings', 'search', 'filter', 'sort', 'undo', 'redo'],
  states: ['info', 'warning', 'error', 'success', 'help'],
  combat: ['sword', 'shield', 'crosshair', 'combat', 'heart', 'health'],
  cyberpunk: ['cyberware', 'netrunner', 'gun', 'armor', 'vehicle', 'chip', 'night-city'],
  roles: ['solo', 'fixer', 'cop', 'medtech', 'media', 'rockerboy', 'nomad', 'corpo', 'streetkid'],
  damage: ['fire', 'ice', 'electric', 'poison', 'radiation', 'biohazard', 'drug', 'medical'],
  skills: ['stealth', 'hacking', 'social', 'tech', 'reflex', 'endurance', 'intelligence'],
  system: ['theme-light', 'theme-dark', 'theme-auto', 'accessibility', 'font-size', 'contrast', 'motion', 'keyboard'],
  game: ['encounter', 'initiative', 'humanity', 'money', 'map', 'location', 'npc', 'player']
};

export const IconShowcase: React.FC = () => {
  const [selectedIcon, setSelectedIcon] = useState<IconName | null>(null);
  const [iconSize, setIconSize] = useState<'sm' | 'md' | 'lg' | 'xl'>('md');
  const [searchTerm, setSearchTerm] = useState('');

  const allIcons = Object.keys(iconPaths) as IconName[];
  const filteredIcons = searchTerm
    ? allIcons.filter(icon => icon.toLowerCase().includes(searchTerm.toLowerCase()))
    : allIcons;

  const getIconsByCategory = (category: string) => {
    const categoryIcons = iconCategories[category as keyof typeof iconCategories] || [];
    return categoryIcons.filter(icon => filteredIcons.includes(icon as IconName));
  };

  return (
    <div className={styles.showcase}>
      <h2>Icon Showcase</h2>
      
      <div className={styles.controls}>
        <input
          type="text"
          placeholder="Search icons..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={styles.searchInput}
        />
        
        <div className={styles.sizeSelector}>
          <label>Size:</label>
          {(['sm', 'md', 'lg', 'xl'] as const).map(size => (
            <button
              key={size}
              onClick={() => setIconSize(size)}
              className={iconSize === size ? styles.active : ''}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      {selectedIcon && (
        <div className={styles.selectedInfo}>
          <h3>Selected: {selectedIcon}</h3>
          <Icon name={selectedIcon} size="xl" />
          <code>{`<Icon name="${selectedIcon}" size="${iconSize}" />`}</code>
        </div>
      )}

      {Object.entries(iconCategories).map(([category, icons]) => {
        const categoryIcons = getIconsByCategory(category);
        if (categoryIcons.length === 0) return null;

        return (
          <div key={category} className={styles.category}>
            <h3>{category.charAt(0).toUpperCase() + category.slice(1)}</h3>
            <div className={styles.iconGrid}>
              {categoryIcons.map(iconName => (
                <div
                  key={iconName}
                  className={styles.iconItem}
                  onClick={() => setSelectedIcon(iconName as IconName)}
                >
                  <Icon name={iconName as IconName} size={iconSize} />
                  <span>{iconName}</span>
                </div>
              ))}
            </div>
          </div>
        );
      })}

      {filteredIcons.length === 0 && (
        <p className={styles.noResults}>No icons found matching "{searchTerm}"</p>
      )}
    </div>
  );
};