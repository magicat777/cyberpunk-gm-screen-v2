import React, { useState } from 'react';
import { useStore } from '../../../store/useStore';
import { Character, StatType, SkillType, ArmorLocation } from '../../../types/game';
import styles from './CharacterSheet.module.css';
import { Button } from '../../utility/Form/Button';
import { Icon } from '../../utility/Icon';
import { TextInput } from '../../utility/Form/TextInput';
import { Select } from '../../utility/Form/Select';
import { Checkbox } from '../../utility/Form/Checkbox';

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
      hp: {
        ...prev.hp,
        current: Math.max(0, Math.min(prev.hp.max, value))
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
              onChange={(e) => setEditedCharacter({ ...editedCharacter, name: e.target.value })}
              className={styles.nameInput}
            />
            <TextInput
              label="Handle"
              value={editedCharacter.handle || ''}
              onChange={(e) => setEditedCharacter({ ...editedCharacter, handle: e.target.value })}
              className={styles.handleInput}
            />
            <Select
              label="Role"
              value={editedCharacter.role}
              onChange={(e) => setEditedCharacter({ ...editedCharacter, role: e.target.value as any })}
              className={styles.roleSelect}
            >
              <option value="Solo">Solo</option>
              <option value="Netrunner">Netrunner</option>
              <option value="Tech">Tech</option>
              <option value="Medtech">Medtech</option>
              <option value="Media">Media</option>
              <option value="Exec">Exec</option>
              <option value="Lawman">Lawman</option>
              <option value="Fixer">Fixer</option>
              <option value="Nomad">Nomad</option>
              <option value="Rockerboy">Rockerboy</option>
            </Select>
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
                <Button onClick={handleSave} size="small">
                  <Icon name="save" /> Save
                </Button>
                <Button onClick={handleCancel} variant="secondary" size="small">
                  <Icon name="times" /> Cancel
                </Button>
              </>
            ) : (
              <Button onClick={() => setIsEditing(true)} size="small">
                <Icon name="pencil" /> Edit
              </Button>
            )}
          </>
        )}
        {onDelete && (
          <Button onClick={() => onDelete(character.id)} variant="danger" size="small">
            <Icon name="trash" /> Delete
          </Button>
        )}
      </div>
    </div>
  );

  const renderStats = () => (
    <div className={styles.statsGrid}>
      {Object.entries(editedCharacter.stats).map(([stat, data]) => (
        <div key={stat} className={styles.statBlock}>
          <label>{stat.toUpperCase()}</label>
          {isEditing ? (
            <input
              type="number"
              min="1"
              max="10"
              value={data.current}
              onChange={(e) => updateStat(stat as StatType, parseInt(e.target.value) || 1)}
              className={styles.statInput}
            />
          ) : (
            <div className={styles.statValue}>{data.current}</div>
          )}
          {data.current !== data.base && (
            <span className={styles.modifier}>
              ({data.base}{data.current > data.base ? '+' : ''}{data.current - data.base})
            </span>
          )}
        </div>
      ))}
    </div>
  );

  const renderSkills = () => (
    <div className={styles.skillsList}>
      {Object.entries(editedCharacter.skills).map(([skill, data]) => (
        <div key={skill} className={styles.skillRow}>
          <span className={styles.skillName}>
            {skill.replace(/([A-Z])/g, ' $1').trim()}
          </span>
          <span className={styles.skillStat}>({data.linkedStat})</span>
          {isEditing ? (
            <input
              type="number"
              min="0"
              max="10"
              value={data.level}
              onChange={(e) => updateSkill(skill as SkillType, parseInt(e.target.value) || 0)}
              className={styles.skillInput}
            />
          ) : (
            <span className={styles.skillLevel}>{data.level}</span>
          )}
          <span className={styles.skillTotal}>
            Total: {data.level + editedCharacter.stats[data.linkedStat].current}
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
                <input
                  type="number"
                  min="0"
                  max={editedCharacter.hp.max}
                  value={editedCharacter.hp.current}
                  onChange={(e) => updateHP(parseInt(e.target.value) || 0)}
                  className={styles.hpInput}
                />
                / {editedCharacter.hp.max}
              </>
            ) : (
              `${editedCharacter.hp.current} / ${editedCharacter.hp.max}`
            )}
          </span>
        </div>
        <p className={styles.deathSave}>Death Save: {editedCharacter.deathSave}</p>
      </div>

      <div className={styles.armorSection}>
        <h3>Armor</h3>
        <div className={styles.armorGrid}>
          {Object.entries(editedCharacter.armor).map(([location, armor]) => (
            <div key={location} className={styles.armorBlock}>
              <label>{location}</label>
              {isEditing ? (
                <input
                  type="number"
                  min="0"
                  value={armor.current}
                  onChange={(e) => updateArmor(location as ArmorLocation, parseInt(e.target.value) || 0)}
                  className={styles.armorInput}
                />
              ) : (
                <span>{armor.current} / {armor.max}</span>
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
        <label>Humanity</label>
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
          <Icon name="user" /> Lifepath
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