import { handleKeyboardClick } from '@/utils/accessibilityHelpers';
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
  const { characters, addCharacter, updateCharacter, deleteCharacter } = useStore();
  const [showNewCharacterModal, setShowNewCharacterModal] = useState(false);
  const [selectedCharacterId, setSelectedCharacterId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState<RoleType | 'all'>('all');
  const [newCharacterData, setNewCharacterData] = useState({
    name: '',
    handle: '',
    role: 'Solo' as RoleType
  });

  const getSkillCategory = (skill: SkillType): any => {
    // Map skills to their categories
    const skillCategories: Record<string, string> = {
      // Awareness
      Concentration: 'Awareness',
      ConcealRevealObject: 'Awareness',
      LipReading: 'Awareness',
      Perception: 'Awareness',
      Tracking: 'Awareness',
      // Body
      Athletics: 'Body',
      Contortionist: 'Body',
      Dance: 'Body',
      Endurance: 'Body',
      ResistTortureDrugs: 'Body',
      Stealth: 'Body',
      // Control
      Driving: 'Control',
      PilotAirVehicle: 'Control',
      PilotSeaVehicle: 'Control',
      Riding: 'Control',
      // Fighting
      Brawling: 'Fighting',
      Evasion: 'Fighting',
      MartialArts: 'Fighting',
      MeleeWeapon: 'Fighting',
      // Performance
      Acting: 'Performance',
      PlayInstrument: 'Performance',
      // Ranged Weapon
      Archery: 'Ranged Weapon',
      Handgun: 'Ranged Weapon',
      HeavyWeapons: 'Ranged Weapon',
      ShoulderArms: 'Ranged Weapon',
      // Social
      Bribery: 'Social',
      Conversation: 'Social',
      HumanPerception: 'Social',
      Interrogation: 'Social',
      Persuasion: 'Social',
      PersonalGrooming: 'Social',
      Streetwise: 'Social',
      Trading: 'Social',
      WardrobeStyle: 'Social',
      // Technique
      AnimalHandling: 'Technique',
      Demolitions: 'Technique',
      DriveLandVehicle: 'Technique',
      ElectronicsSecurityTech: 'Technique',
      FirstAid: 'Technique',
      Forgery: 'Technique',
      Interface: 'Technique',
      LandVehicleTech: 'Technique',
      PaintDrawSculpt: 'Technique',
      Paramedic: 'Technique',
      PhotographyFilm: 'Technique',
      PickLock: 'Technique',
      PickPocket: 'Technique',
      SeaVehicleTech: 'Technique',
      WeaponsTech: 'Technique'
    };
    
    return skillCategories[skill] || 'Education';
  };

  const createNewCharacter = () => {
    const newCharacter: Character = {
      id: Date.now().toString(),
      name: newCharacterData.name,
      handle: newCharacterData.handle,
      role: newCharacterData.role,
      roleRank: 5,
      stats: {
        INT: { name: 'INT', value: 5, base: 5, modifier: 0 },
        REF: { name: 'REF', value: 5, base: 5, modifier: 0 },
        DEX: { name: 'DEX', value: 5, base: 5, modifier: 0 },
        TECH: { name: 'TECH', value: 5, base: 5, modifier: 0 },
        COOL: { name: 'COOL', value: 5, base: 5, modifier: 0 },
        WILL: { name: 'WILL', value: 5, base: 5, modifier: 0 },
        LUCK: { name: 'LUCK', value: 5, base: 5, modifier: 0 },
        MOVE: { name: 'MOVE', value: 5, base: 5, modifier: 0 },
        BODY: { name: 'BODY', value: 5, base: 5, modifier: 0 },
        EMP: { name: 'EMP', value: 5, base: 5, modifier: 0 }
      },
      skills: Object.values(SkillType).map(skill => ({
        name: skill,
        category: getSkillCategory(skill),
        stat: getLinkedStat(skill),
        level: 0,
        ip: 0,
        total: 5,
        isRoleSkill: false
      })),
      hitPoints: {
        current: 40,
        max: 40,
        seriouslyWounded: 20,
        deathSave: 5
      },
      humanity: {
        current: 50,
        max: 50
      },
      armor: [],
      weapons: [],
      cyberware: [],
      gear: [],
      eurodollars: 2550,
      reputation: 0,
      ip: 0,
      background: {},
      lifepath: {
        friends: [],
        enemies: [],
        lovers: [],
        mentors: []
      },
      notes: '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isNPC: false
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
      deleteCharacter(characterId);
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
          <Button onClick={() => setShowNewCharacterModal(true)} size="sm">
            <Icon name="add" /> New
          </Button>
        </div>

        <div className={styles.filters}>
          <TextInput
            placeholder="Search characters..."
            value={searchTerm}
            onChange={(value) => setSearchTerm(value)}
            className={styles.searchInput}
          />
          <Select
            value={filterRole}
            onChange={(value) => setFilterRole(value as RoleType | 'all')}
            className={styles.roleFilter}
            options={[
              { value: 'all', label: 'All Roles' },
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
        </div>

        <div className={styles.characterList}>
          {filteredCharacters.length === 0 ? (
            <p className={styles.noCharacters}>No characters found</p>
          ) : (
            filteredCharacters.map(character => (
              <button
                key={character.id}
                className={`${styles.characterCard} ${selectedCharacterId === character.id ? styles.selected : ''}`}
                onClick={() => setSelectedCharacterId(character.id)}
                onKeyDown={(e) => handleKeyboardClick(e, () => setSelectedCharacterId(character.id))}
                tabIndex={0}
              >
                <div className={styles.characterInfo}>
                  <h3>{character.name}</h3>
                  {character.handle && <p className={styles.handle}>"{character.handle}"</p>}
                  <p className={styles.role}>{character.role} (Rank {character.roleRank})</p>
                </div>
                <div className={styles.characterStats}>
                  <span>HP: {character.hitPoints.current}/{character.hitPoints.max}</span>
                  <span>Humanity: {character.humanity.current}</span>
                </div>
              </button>
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
            <Icon name="player" size="xl" />
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
              onChange={(value) => setNewCharacterData({ ...newCharacterData, name: value })}
              required
            />
            <TextInput
              label="Handle (optional)"
              value={newCharacterData.handle}
              onChange={(value) => setNewCharacterData({ ...newCharacterData, handle: value })}
            />
            <Select
              label="Role"
              value={newCharacterData.role}
              onChange={(value) => setNewCharacterData({ ...newCharacterData, role: value as RoleType })}
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
    [SkillType.AnimalHandling]: 'INT',
    [SkillType.Demolitions]: 'TECH',
    [SkillType.DriveLandVehicle]: 'REF',
    [SkillType.ElectronicsSecurityTech]: 'TECH',
    [SkillType.FirstAid]: 'TECH',
    [SkillType.Forgery]: 'TECH',
    [SkillType.LandVehicleTech]: 'TECH',
    [SkillType.PaintDrawSculpt]: 'TECH',
    [SkillType.Paramedic]: 'TECH',
    [SkillType.PhotographyFilm]: 'TECH',
    [SkillType.PickLock]: 'TECH',
    [SkillType.PickPocket]: 'TECH',
    [SkillType.SeaVehicleTech]: 'TECH',
    [SkillType.WeaponsTech]: 'TECH',
    [SkillType.Interface]: 'INT'
  };
  
  return skillStatMap[skill] || 'INT';
}