import React, { useState } from 'react';
import { useStore } from '../../store/useStore';
import { CharacterSheet } from '../../components/interactive/CharacterSheet/CharacterSheet';
import { Button } from '../../components/utility/Form/Button';
import { Icon } from '../../components/utility/Icon';
import { TextInput } from '../../components/utility/Form/TextInput';
import { Select } from '../../components/utility/Form/Select';
import { Character, RoleType, StatType, SkillType } from '../../types/game';
import styles from './Characters.module.css';

export const Characters: React.FC = () => {
  const { characters, addCharacter, updateCharacter, removeCharacter } = useStore();
  const [showNewCharacterModal, setShowNewCharacterModal] = useState(false);
  const [selectedCharacterId, setSelectedCharacterId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState<RoleType | 'all'>('all');
  const [newCharacterData, setNewCharacterData] = useState({
    name: '',
    handle: '',
    role: 'Solo' as RoleType
  });

  const createNewCharacter = () => {
    const newCharacter: Character = {
      id: Date.now().toString(),
      name: newCharacterData.name,
      handle: newCharacterData.handle,
      role: newCharacterData.role,
      roleRank: 5,
      reputationRank: 1,
      stats: {
        int: { base: 5, current: 5 },
        ref: { base: 5, current: 5 },
        dex: { base: 5, current: 5 },
        tech: { base: 5, current: 5 },
        cool: { base: 5, current: 5 },
        will: { base: 5, current: 5 },
        luck: { base: 5, current: 5 },
        move: { base: 5, current: 5 },
        body: { base: 5, current: 5 },
        emp: { base: 5, current: 5 }
      },
      skills: Object.values(SkillType).reduce((acc, skill) => {
        acc[skill] = {
          level: 0,
          linkedStat: getLinkedStat(skill),
          ipSpent: 0
        };
        return acc;
      }, {} as Character['skills']),
      hp: {
        current: 40,
        max: 40,
        wounds: {
          light: 0,
          serious: 0,
          critical: 0,
          mortal: 0
        }
      },
      deathSave: 5,
      humanity: {
        current: 50,
        max: 50
      },
      armor: {
        head: { current: 11, max: 11 },
        body: { current: 11, max: 11 },
        leftArm: { current: 11, max: 11 },
        rightArm: { current: 11, max: 11 },
        leftLeg: { current: 11, max: 11 },
        rightLeg: { current: 11, max: 11 }
      },
      weapons: [],
      cyberware: [],
      inventory: [],
      money: 2550,
      improvement: {
        totalIp: 0,
        availableIp: 0,
        spentIp: 0
      },
      lifepath: {
        background: {},
        motivation: {},
        events: []
      },
      notes: ''
    };

    addCharacter(newCharacter);
    setShowNewCharacterModal(false);
    setNewCharacterData({ name: '', handle: '', role: 'Solo' });
    setSelectedCharacterId(newCharacter.id);
  };

  const handleCharacterUpdate = (updatedCharacter: Character) => {
    updateCharacter(updatedCharacter.id, updatedCharacter);
  };

  const handleCharacterDelete = (characterId: string) => {
    if (confirm('Are you sure you want to delete this character?')) {
      removeCharacter(characterId);
      if (selectedCharacterId === characterId) {
        setSelectedCharacterId(null);
      }
    }
  };

  const filteredCharacters = characters.filter(character => {
    const matchesSearch = character.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (character.handle && character.handle.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesRole = filterRole === 'all' || character.role === filterRole;
    return matchesSearch && matchesRole;
  });

  const selectedCharacter = characters.find(c => c.id === selectedCharacterId);

  return (
    <div className={styles.charactersPage}>
      <div className={styles.sidebar}>
        <div className={styles.sidebarHeader}>
          <h2>Characters</h2>
          <Button onClick={() => setShowNewCharacterModal(true)} size="small">
            <Icon name="plus" /> New
          </Button>
        </div>

        <div className={styles.filters}>
          <TextInput
            placeholder="Search characters..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={styles.searchInput}
          />
          <Select
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value as RoleType | 'all')}
            className={styles.roleFilter}
          >
            <option value="all">All Roles</option>
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
        </div>

        <div className={styles.characterList}>
          {filteredCharacters.length === 0 ? (
            <p className={styles.noCharacters}>No characters found</p>
          ) : (
            filteredCharacters.map(character => (
              <div
                key={character.id}
                className={`${styles.characterCard} ${selectedCharacterId === character.id ? styles.selected : ''}`}
                onClick={() => setSelectedCharacterId(character.id)}
              >
                <div className={styles.characterInfo}>
                  <h3>{character.name}</h3>
                  {character.handle && <p className={styles.handle}>"{character.handle}"</p>}
                  <p className={styles.role}>{character.role} (Rank {character.roleRank})</p>
                </div>
                <div className={styles.characterStats}>
                  <span>HP: {character.hp.current}/{character.hp.max}</span>
                  <span>Humanity: {character.humanity.current}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <div className={styles.mainContent}>
        {selectedCharacter ? (
          <CharacterSheet
            character={selectedCharacter}
            onUpdate={handleCharacterUpdate}
            onDelete={handleCharacterDelete}
          />
        ) : (
          <div className={styles.noSelection}>
            <Icon name="user" size="xlarge" />
            <p>Select a character or create a new one</p>
          </div>
        )}
      </div>

      {showNewCharacterModal && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <h3>New Character</h3>
            <TextInput
              label="Name"
              value={newCharacterData.name}
              onChange={(e) => setNewCharacterData({ ...newCharacterData, name: e.target.value })}
              required
            />
            <TextInput
              label="Handle (optional)"
              value={newCharacterData.handle}
              onChange={(e) => setNewCharacterData({ ...newCharacterData, handle: e.target.value })}
            />
            <Select
              label="Role"
              value={newCharacterData.role}
              onChange={(e) => setNewCharacterData({ ...newCharacterData, role: e.target.value as RoleType })}
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
            <div className={styles.modalActions}>
              <Button onClick={() => setShowNewCharacterModal(false)} variant="secondary">
                Cancel
              </Button>
              <Button onClick={createNewCharacter} disabled={!newCharacterData.name}>
                Create
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Helper function to get linked stat for skills
function getLinkedStat(skill: SkillType): StatType {
  const skillStatMap: Record<SkillType, StatType> = {
    [SkillType.Concentration]: 'WILL',
    [SkillType.ConcealRevealObject]: 'INT',
    [SkillType.LipReading]: 'INT',
    [SkillType.Perception]: 'INT',
    [SkillType.Tracking]: 'INT',
    [SkillType.Athletics]: 'DEX',
    [SkillType.Contortionist]: 'DEX',
    [SkillType.Dance]: 'DEX',
    [SkillType.Endurance]: 'BODY',
    [SkillType.ResistTortureDrugs]: 'WILL',
    [SkillType.Stealth]: 'DEX',
    [SkillType.Driving]: 'REF',
    [SkillType.PilotAirVehicle]: 'REF',
    [SkillType.PilotSeaVehicle]: 'TECH',
    [SkillType.Riding]: 'REF',
    [SkillType.Accounting]: 'INT',
    [SkillType.Bureaucracy]: 'INT',
    [SkillType.Business]: 'INT',
    [SkillType.Composition]: 'INT',
    [SkillType.Criminology]: 'INT',
    [SkillType.Cryptography]: 'INT',
    [SkillType.Deduction]: 'INT',
    [SkillType.Education]: 'INT',
    [SkillType.Gamble]: 'INT',
    [SkillType.Language]: 'INT',
    [SkillType.LibrarySearch]: 'INT',
    [SkillType.LocalExpert]: 'INT',
    [SkillType.Science]: 'INT',
    [SkillType.Tactics]: 'INT',
    [SkillType.WildernessSurvival]: 'INT',
    [SkillType.Brawling]: 'BODY',
    [SkillType.Evasion]: 'DEX',
    [SkillType.MartialArts]: 'DEX',
    [SkillType.MeleeWeapon]: 'DEX',
    [SkillType.Acting]: 'COOL',
    [SkillType.PlayInstrument]: 'TECH',
    [SkillType.Archery]: 'REF',
    [SkillType.Autofire]: 'REF',
    [SkillType.Handgun]: 'REF',
    [SkillType.HeavyWeapons]: 'REF',
    [SkillType.ShoulderArms]: 'REF',
    [SkillType.Bribery]: 'COOL',
    [SkillType.Conversation]: 'EMP',
    [SkillType.HumanPerception]: 'EMP',
    [SkillType.Interrogation]: 'COOL',
    [SkillType.Persuasion]: 'COOL',
    [SkillType.PersonalGrooming]: 'COOL',
    [SkillType.Streetwise]: 'COOL',
    [SkillType.Trading]: 'COOL',
    [SkillType.WardrobeStyle]: 'COOL',
    [SkillType.AirVehicleTech]: 'TECH',
    [SkillType.BasicTech]: 'TECH',
    [SkillType.Cybertech]: 'TECH',
    [SkillType.Demolitions]: 'TECH',
    [SkillType.Electronics]: 'TECH',
    [SkillType.ElectronicsSecurity]: 'TECH',
    [SkillType.FirstAid]: 'TECH',
    [SkillType.Forgery]: 'TECH',
    [SkillType.LandVehicleTech]: 'TECH',
    [SkillType.PaintDrawSculpt]: 'TECH',
    [SkillType.Paramedic]: 'TECH',
    [SkillType.Photography]: 'TECH',
    [SkillType.PickLock]: 'TECH',
    [SkillType.PickPocket]: 'TECH',
    [SkillType.SeaVehicleTech]: 'TECH',
    [SkillType.Weaponstech]: 'TECH',
    [SkillType.Interface]: 'INT',
    [SkillType.MedTech]: 'TECH',
    [SkillType.Resources]: 'INT',
    [SkillType.Streetdeal]: 'COOL'
  };
  
  return skillStatMap[skill] || 'INT';
}