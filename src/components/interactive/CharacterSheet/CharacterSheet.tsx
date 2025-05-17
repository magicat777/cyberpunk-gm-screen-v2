import React, { useState } from 'react';
// import { useStore } from '../../../store/useStore';
import { Character, StatType, SkillType, ArmorLocation, RoleType } from '../../../types/game';
import styles from './CharacterSheet.module.css';
import { Button } from '../../utility/Form/Button';
import { Icon } from '../../utility/Icon';
import { TextInput } from '../../utility/Form/TextInput';
import { Select } from '../../utility/Form/Select';
// import { Checkbox } from '../../utility/Form/Checkbox';

interface CharacterSheetProps {
  character: Character;
  onUpdate?: (character: Character) => void;
  onDelete?: (characterId: string) => void;
  isEditable?: boolean;
}

export const CharacterSheet: React.FC<CharacterSheetProps> = ({
  character,
  onUpdate,
  onDelete,
  isEditable = true
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedCharacter, setEditedCharacter] = useState<Character>(character);
  const [activeTab, setActiveTab] = useState<'stats' | 'skills' | 'combat' | 'gear' | 'cyberware' | 'lifepath'>('stats');

  const handleSave = () => {
    if (onUpdate) {
      onUpdate(editedCharacter);
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedCharacter(character);
    setIsEditing(false);
  };

  const updateStat = (stat: StatType, value: number) => {
    setEditedCharacter(prev => ({
      ...prev,
      stats: {
        ...prev.stats,
        [stat]: {
          ...prev.stats[stat],
          current: Math.max(1, Math.min(10, value))
        }
      }
    }));
  };

  const updateSkill = (skill: SkillType, value: number) => {
    setEditedCharacter(prev => ({
      ...prev,
      skills: {
        ...prev.skills,
        [skill]: {
          ...prev.skills[skill],
          level: Math.max(0, Math.min(10, value))
        }
      }
    }));
  };

  const updateHP = (value: number) => {
    setEditedCharacter(prev => ({
      ...prev,
      hitPoints: {
        ...prev.hitPoints,
        current: Math.max(0, Math.min(prev.hitPoints.max, value))
      }
    }));
  };

  const updateArmor = (location: ArmorLocation, value: number) => {
    setEditedCharacter(prev => ({
      ...prev,
      armor: {
        ...prev.armor,
        [location]: {
          ...prev.armor[location],
          current: Math.max(0, value)
        }
      }
    }));
  };

  const renderHeader = () => (
    <div className={styles.header}>
      <div className={styles.basicInfo}>
        {isEditing ? (
          <>
            <TextInput
              label="Name"
              value={editedCharacter.name}
              onChange={(value) => setEditedCharacter({ ...editedCharacter, name: value })}
              className={styles.nameInput}
            />
            <TextInput
              label="Handle"
              value={editedCharacter.handle || ''}
              onChange={(value) => setEditedCharacter({ ...editedCharacter, handle: value })}
              className={styles.handleInput}
            />
            <Select
              label="Role"
              value={editedCharacter.role}
              onChange={(value) => setEditedCharacter({ ...editedCharacter, role: value as RoleType })}
              className={styles.roleSelect}
              options={[
                { value: 'Solo', label: 'Solo' },
                { value: 'Netrunner', label: 'Netrunner' },
                { value: 'Tech', label: 'Tech' },
                { value: 'Medtech', label: 'Medtech' },
                { value: 'Media', label: 'Media' },
                { value: 'Exec', label: 'Exec' },
                { value: 'Lawman', label: 'Lawman' },
                { value: 'Fixer', label: 'Fixer' },
                { value: 'Nomad', label: 'Nomad' },
                { value: 'Rockerboy', label: 'Rockerboy' }
              ]}
            />
          </>
        ) : (
          <>
            <h2>{character.name}</h2>
            {character.handle && <p className={styles.handle}>"{character.handle}"</p>}
            <p className={styles.role}>{character.role} (Rank {character.roleRank})</p>
          </>
        )}
      </div>
      
      <div className={styles.actions}>
        {isEditable && (
          <>
            {isEditing ? (
              <>
                <Button onClick={handleSave} size="sm">
                  <Icon name="save" /> Save
                </Button>
                <Button onClick={handleCancel} variant="secondary" size="sm">
                  <Icon name="close" /> Cancel
                </Button>
              </>
            ) : (
              <Button onClick={() => setIsEditing(true)} size="sm">
                <Icon name="edit" /> Edit
              </Button>
            )}
          </>
        )}
        {onDelete && (
          <Button onClick={() => onDelete(character.id)} variant="danger" size="sm">
            <Icon name="remove" /> Delete
          </Button>
        )}
      </div>
    </div>
  );

  const renderStats = () => (
    <div className={styles.statsGrid}>
      {Object.entries(editedCharacter.stats).map(([stat, data]) => (
        <div key={stat} className={styles.statBlock}>
          <label htmlFor="field-1">{stat.toUpperCase()}</label>
          {isEditing ? (
            <input id="field-1"
              type="number"
              min="1"
              max="10"
              value={data.value}
              onChange={(value) => updateStat(stat as StatType, parseInt(value) || 1)}
              className={styles.statInput}
            />
          ) : (
            <div className={styles.statValue}>{data.value}</div>
          )}
          {data.value !== data.base && (
            <span className={styles.modifier}>
              ({data.base}{data.value > data.base ? '+' : ''}{data.value - data.base})
            </span>
          )}
        </div>
      ))}
    </div>
  );

  const renderSkills = () => (
    <div className={styles.skillsList}>
      {editedCharacter.skills.map((skill) => (
        <div key={skill.name} className={styles.skillRow}>
          <span className={styles.skillName}>
            {skill.name.replace(/([A-Z])/g, ' $1').trim()}
          </span>
          <span className={styles.skillStat}>({skill.stat})</span>
          {isEditing ? (
            <input id="field-1"
              type="number"
              min="0"
              max="10"
              value={skill.level}
              onChange={(value) => updateSkill(skill.name as SkillType, parseInt(value) || 0)}
              className={styles.skillInput}
            />
          ) : (
            <span className={styles.skillLevel}>{skill.level}</span>
          )}
          <span className={styles.skillTotal}>
            Total: {skill.level + editedCharacter.stats[skill.stat].value}
          </span>
        </div>
      ))}
    </div>
  );

  const renderCombat = () => (
    <div className={styles.combatSection}>
      <div className={styles.hpSection}>
        <h3>Hit Points</h3>
        <div className={styles.hpBar}>
          <div
            className={styles.hpFill}
            style={{ width: `${(editedCharacter.hp.current / editedCharacter.hp.max) * 100}%` }}
          />
          <span className={styles.hpText}>
            {isEditing ? (
              <>
                <input id="field-1"
                  type="number"
                  min="0"
                  max={editedCharacter.hp.max}
                  value={editedCharacter.hp.current}
                  onChange={(value) => updateHP(parseInt(value) || 0)}
                  className={styles.hpInput}
                />
                / {editedCharacter.hp.max}
              </>
            ) : (
              `${editedCharacter.hitPoints.current} / ${editedCharacter.hitPoints.max}`
            )}
          </span>
        </div>
        <p className={styles.deathSave}>Death Save: {editedCharacter.hitPoints.deathSave}</p>
      </div>

      <div className={styles.armorSection}>
        <h3>Armor</h3>
        <div className={styles.armorGrid}>
          {editedCharacter.armor.map((armor) => (
            <div key={armor.id} className={styles.armorBlock}>
              <label htmlFor="field-1">{armor.location}</label>
              {isEditing ? (
                <input id="field-1"
                  type="number"
                  min="0"
                  value={armor.sp}
                  onChange={(value) => updateArmor(armor.location, parseInt(value) || 0)}
                  className={styles.armorInput}
                />
              ) : (
                <span>{armor.sp}</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderGear = () => (
    <div className={styles.gearSection}>
      <div className={styles.weaponsSection}>
        <h3>Weapons</h3>
        {editedCharacter.weapons.length === 0 ? (
          <p>No weapons equipped</p>
        ) : (
          <div className={styles.weaponsList}>
            {editedCharacter.weapons.map((weapon, index) => (
              <div key={index} className={styles.weaponCard}>
                <h4>{weapon.name}</h4>
                <div className={styles.weaponStats}>
                  <span>Type: {weapon.type}</span>
                  <span>Damage: {weapon.damage}</span>
                  <span>Range: {weapon.range}</span>
                  <span>ROF: {weapon.rof}</span>
                  {weapon.ammo && <span>Ammo: {weapon.ammo.current}/{weapon.ammo.max}</span>}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className={styles.inventorySection}>
        <h3>Inventory</h3>
        {editedCharacter.inventory.length === 0 ? (
          <p>No items in inventory</p>
        ) : (
          <ul className={styles.inventoryList}>
            {editedCharacter.inventory.map((item, index) => (
              <li key={index}>
                {item.quantity > 1 && `${item.quantity}x `}{item.name}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );

  const renderCyberware = () => (
    <div className={styles.cyberwareSection}>
      <h3>Cyberware</h3>
      <div className={styles.humanityBar}>
        <label htmlFor="field-1">Humanity</label>
        <div className={styles.humanityProgress}>
          <div
            className={styles.humanityFill}
            style={{ width: `${(editedCharacter.humanity.current / editedCharacter.humanity.max) * 100}%` }}
          />
          <span>{editedCharacter.humanity.current} / {editedCharacter.humanity.max}</span>
        </div>
      </div>
      
      {editedCharacter.cyberware.length === 0 ? (
        <p>No cyberware installed</p>
      ) : (
        <div className={styles.cyberwareList}>
          {editedCharacter.cyberware.map((cyber, index) => (
            <div key={index} className={styles.cyberwareCard}>
              <h4>{cyber.name}</h4>
              <p>{cyber.type} - {cyber.location}</p>
              <p>{cyber.description}</p>
              <p>HL: {cyber.humanityLoss}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderLifepath = () => (
    <div className={styles.lifepathSection}>
      <h3>Background</h3>
      <div className={styles.lifepathGrid}>
        <div>
          <h4>Cultural Region</h4>
          <p>{editedCharacter.lifepath.background?.culturalRegion || 'Unknown'}</p>
        </div>
        <div>
          <h4>Personality</h4>
          <p>{editedCharacter.lifepath.background?.personality || 'Unknown'}</p>
        </div>
        <div>
          <h4>Clothing Style</h4>
          <p>{editedCharacter.lifepath.background?.clothingStyle || 'Unknown'}</p>
        </div>
        <div>
          <h4>Hairstyle</h4>
          <p>{editedCharacter.lifepath.background?.hairstyle || 'Unknown'}</p>
        </div>
      </div>
      
      <h3>Motivations</h3>
      <div className={styles.motivationsGrid}>
        <div>
          <h4>What Do You Value Most?</h4>
          <p>{editedCharacter.lifepath.motivation?.valueMost || 'Unknown'}</p>
        </div>
        <div>
          <h4>Who Do You Value Most?</h4>
          <p>{editedCharacter.lifepath.motivation?.valueWho || 'Unknown'}</p>
        </div>
        <div>
          <h4>What's Your Outlook?</h4>
          <p>{editedCharacter.lifepath.motivation?.outlook || 'Unknown'}</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className={styles.characterSheet}>
      {renderHeader()}
      
      <div className={styles.tabs}>
        <button
          className={`${styles.tab} ${activeTab === 'stats' ? styles.active : ''}`}
          onClick={() => setActiveTab('stats')}
        >
          <Icon name="intelligence" /> Stats
        </button>
        <button
          className={`${styles.tab} ${activeTab === 'skills' ? styles.active : ''}`}
          onClick={() => setActiveTab('skills')}
        >
          <Icon name="star" /> Skills
        </button>
        <button
          className={`${styles.tab} ${activeTab === 'combat' ? styles.active : ''}`}
          onClick={() => setActiveTab('combat')}
        >
          <Icon name="shield" /> Combat
        </button>
        <button
          className={`${styles.tab} ${activeTab === 'gear' ? styles.active : ''}`}
          onClick={() => setActiveTab('gear')}
        >
          <Icon name="gun" /> Gear
        </button>
        <button
          className={`${styles.tab} ${activeTab === 'cyberware' ? styles.active : ''}`}
          onClick={() => setActiveTab('cyberware')}
        >
          <Icon name="cyberware" /> Cyberware
        </button>
        <button
          className={`${styles.tab} ${activeTab === 'lifepath' ? styles.active : ''}`}
          onClick={() => setActiveTab('lifepath')}
        >
          <Icon name="player" /> Lifepath
        </button>
      </div>

      <div className={styles.content}>
        {activeTab === 'stats' && renderStats()}
        {activeTab === 'skills' && renderSkills()}
        {activeTab === 'combat' && renderCombat()}
        {activeTab === 'gear' && renderGear()}
        {activeTab === 'cyberware' && renderCyberware()}
        {activeTab === 'lifepath' && renderLifepath()}
      </div>
    </div>
  );
};