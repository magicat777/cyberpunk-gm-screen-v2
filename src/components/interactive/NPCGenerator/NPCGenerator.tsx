import { handleKeyboardClick } from '@/utils/accessibilityHelpers';
import React, { useState, useCallback } from 'react';
import { useStore } from '../../../store/useStore';
import { 
  NPCGeneratorOptions, 
  GeneratedNPC, 
  NPCArchetype, 
  NPCAppearance,
  NPCMotivation
} from '../../../types/npc';
import { RoleType, StatType, SkillType, Stat, SkillCategory, Skill } from '../../../types/game';
import { npcGeneratorData, npcTemplates } from '../../../data/npcGeneratorData';
import { CharacterSheet } from '../CharacterSheet/CharacterSheet';
import styles from './NPCGenerator.module.css';
import { Button } from '../../utility/Form/Button';
import { Icon } from '../../utility/Icon';
import { Select } from '../../utility/Form/Select';
import { Checkbox } from '../../utility/Form/Checkbox';
import { TextInput } from '../../utility/Form/TextInput';

export const NPCGenerator: React.FC = () => {
  const { addCharacter } = useStore();
  const [options, setOptions] = useState<NPCGeneratorOptions>({
    threat: 'medium',
    includeBackground: true,
    includeMotivation: true,
    includeAppearance: true,
    includeCyberware: true,
    includeEquipment: true
  });
  const [generatedNPC, setGeneratedNPC] = useState<GeneratedNPC | null>(null);
  const [savedNPCs, setSavedNPCs] = useState<GeneratedNPC[]>([]);
  const [activeTab, setActiveTab] = useState<'generator' | 'saved'>('generator');
  const [selectedSavedNPC, setSelectedSavedNPC] = useState<GeneratedNPC | null>(null);

  const generateRandomName = (gender: 'male' | 'female' | 'neutral' = 'neutral'): string => {
    const { firstNames, lastNames, nicknames } = npcGeneratorData;
    const firstName = firstNames[gender][Math.floor(Math.random() * firstNames[gender].length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    const useNickname = Math.random() < 0.3;
    
    if (useNickname) {
      const nickname = nicknames[Math.floor(Math.random() * nicknames.length)];
      return `${firstName} "${nickname}" ${lastName}`;
    }
    
    return `${firstName} ${lastName}`;
  };

  // Helper function to get linked stat for a skill
  const getLinkedStat = (skill: SkillType): StatType => {
    // Map skills to their linked stats based on Cyberpunk RED rules
    const skillStatMap: Partial<Record<SkillType, StatType>> = {
      // Awareness skills -> INT
      [SkillType.Concentration]: 'INT',
      [SkillType.ConcealRevealObject]: 'INT',
      [SkillType.LipReading]: 'INT',
      [SkillType.Perception]: 'INT',
      [SkillType.Tracking]: 'INT',
      // Body skills -> BODY
      [SkillType.Athletics]: 'BODY',
      [SkillType.Contortionist]: 'BODY',
      [SkillType.Dance]: 'BODY',
      [SkillType.Endurance]: 'BODY',
      [SkillType.ResistTortureDrugs]: 'BODY',
      [SkillType.Stealth]: 'DEX',
      // Control skills -> REF
      [SkillType.Driving]: 'REF',
      [SkillType.PilotAirVehicle]: 'REF',
      [SkillType.PilotSeaVehicle]: 'REF',
      [SkillType.Riding]: 'REF',
      // Fighting skills -> REF
      [SkillType.Brawling]: 'REF',
      [SkillType.Evasion]: 'DEX',
      [SkillType.MartialArts]: 'REF',
      [SkillType.MeleeWeapon]: 'REF',
      // Ranged weapon skills -> REF
      [SkillType.Archery]: 'REF',
      [SkillType.Handgun]: 'REF',
      [SkillType.HeavyWeapons]: 'REF',
      [SkillType.ShoulderArms]: 'REF',
      // Social skills -> COOL or EMP
      [SkillType.Bribery]: 'COOL',
      [SkillType.Conversation]: 'EMP',
      [SkillType.HumanPerception]: 'EMP',
      [SkillType.Interrogation]: 'COOL',
      [SkillType.Persuasion]: 'COOL',
      [SkillType.PersonalGrooming]: 'COOL',
      [SkillType.Streetwise]: 'COOL',
      [SkillType.Trading]: 'COOL',
      [SkillType.WardrobeStyle]: 'COOL',
      // Education skills -> INT
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
      // Technique skills -> TECH
      [SkillType.AnimalHandling]: 'TECH',
      [SkillType.Demolitions]: 'TECH',
      [SkillType.DriveLandVehicle]: 'TECH',
      [SkillType.ElectronicsSecurityTech]: 'TECH',
      [SkillType.FirstAid]: 'TECH',
      [SkillType.Forgery]: 'TECH',
      [SkillType.Interface]: 'TECH',
      [SkillType.LandVehicleTech]: 'TECH',
      [SkillType.PaintDrawSculpt]: 'TECH',
      [SkillType.Paramedic]: 'TECH',
      [SkillType.PhotographyFilm]: 'TECH',
      [SkillType.PickLock]: 'TECH',
      [SkillType.PickPocket]: 'TECH',
      [SkillType.SeaVehicleTech]: 'TECH',
      [SkillType.WeaponsTech]: 'TECH'
    };
    
    return skillStatMap[skill] || 'INT';
  };

  const getSkillCategory = (skill: SkillType): SkillCategory => {
    const skillCategoryMap: Partial<Record<SkillType, SkillCategory>> = {
      // Awareness skills
      [SkillType.Concentration]: 'Awareness',
      [SkillType.ConcealRevealObject]: 'Awareness',
      [SkillType.LipReading]: 'Awareness',
      [SkillType.Perception]: 'Awareness',
      [SkillType.Tracking]: 'Awareness',
      // Body skills
      [SkillType.Athletics]: 'Body',
      [SkillType.Contortionist]: 'Body',
      [SkillType.Dance]: 'Body',
      [SkillType.Endurance]: 'Body',
      [SkillType.ResistTortureDrugs]: 'Body',
      [SkillType.Stealth]: 'Body',
      // Control skills
      [SkillType.Driving]: 'Control',
      [SkillType.PilotAirVehicle]: 'Control',
      [SkillType.PilotSeaVehicle]: 'Control',
      [SkillType.Riding]: 'Control',
      // Fighting skills
      [SkillType.Brawling]: 'Fighting',
      [SkillType.Evasion]: 'Fighting',
      [SkillType.MartialArts]: 'Fighting',
      [SkillType.MeleeWeapon]: 'Fighting',
      // Performance skills
      [SkillType.Acting]: 'Performance',
      [SkillType.PlayInstrument]: 'Performance',
      // Ranged weapon skills
      [SkillType.Archery]: 'Ranged Weapon',
      [SkillType.Handgun]: 'Ranged Weapon',
      [SkillType.HeavyWeapons]: 'Ranged Weapon',
      [SkillType.ShoulderArms]: 'Ranged Weapon',
      // Social skills
      [SkillType.Bribery]: 'Social',
      [SkillType.Conversation]: 'Social',
      [SkillType.HumanPerception]: 'Social',
      [SkillType.Interrogation]: 'Social',
      [SkillType.Persuasion]: 'Social',
      [SkillType.PersonalGrooming]: 'Social',
      [SkillType.Streetwise]: 'Social',
      [SkillType.Trading]: 'Social',
      [SkillType.WardrobeStyle]: 'Social',
      // Education skills
      [SkillType.Accounting]: 'Education',
      [SkillType.Bureaucracy]: 'Education',
      [SkillType.Business]: 'Education',
      [SkillType.Composition]: 'Education',
      [SkillType.Criminology]: 'Education',
      [SkillType.Cryptography]: 'Education',
      [SkillType.Deduction]: 'Education',
      [SkillType.Education]: 'Education',
      [SkillType.Gamble]: 'Education',
      [SkillType.Language]: 'Education',
      [SkillType.LibrarySearch]: 'Education',
      [SkillType.LocalExpert]: 'Education',
      [SkillType.Science]: 'Education',
      [SkillType.Tactics]: 'Education',
      [SkillType.WildernessSurvival]: 'Education',
      // Technique skills
      [SkillType.AnimalHandling]: 'Technique',
      [SkillType.Demolitions]: 'Technique',
      [SkillType.DriveLandVehicle]: 'Technique',
      [SkillType.ElectronicsSecurityTech]: 'Technique',
      [SkillType.FirstAid]: 'Technique',
      [SkillType.Forgery]: 'Technique',
      [SkillType.Interface]: 'Technique',
      [SkillType.LandVehicleTech]: 'Technique',
      [SkillType.PaintDrawSculpt]: 'Technique',
      [SkillType.Paramedic]: 'Technique',
      [SkillType.PhotographyFilm]: 'Technique',
      [SkillType.PickLock]: 'Technique',
      [SkillType.PickPocket]: 'Technique',
      [SkillType.SeaVehicleTech]: 'Technique',
      [SkillType.WeaponsTech]: 'Technique'
    };
    
    return skillCategoryMap[skill] || 'Awareness';
  };

  const generateAppearance = (archetype: NPCArchetype): NPCAppearance => {
    const { appearances } = npcGeneratorData;
    const gender = ['male', 'female', 'other'][Math.floor(Math.random() * 3)];
    
    return {
      age: appearances.ages[Math.floor(Math.random() * appearances.ages.length)],
      gender,
      height: `${150 + Math.floor(Math.random() * 50)}cm`,
      build: appearances.builds[Math.floor(Math.random() * appearances.builds.length)],
      hairStyle: appearances.hairStyles[Math.floor(Math.random() * appearances.hairStyles.length)],
      hairColor: appearances.hairColors[Math.floor(Math.random() * appearances.hairColors.length)],
      eyeColor: appearances.eyeColors[Math.floor(Math.random() * appearances.eyeColors.length)],
      distinguishingFeatures: appearances.features
        .sort(() => Math.random() - 0.5)
        .slice(0, Math.floor(Math.random() * 3) + 1),
      clothingStyle: appearances.clothingStyles[archetype][
        Math.floor(Math.random() * appearances.clothingStyles[archetype].length)
      ],
      accessories: appearances.accessories
        .sort(() => Math.random() - 0.5)
        .slice(0, Math.floor(Math.random() * 3))
    };
  };

  const generateMotivation = (archetype: NPCArchetype): NPCMotivation => {
    const { motivations } = npcGeneratorData;
    
    return {
      primaryGoal: motivations.goals[archetype][
        Math.floor(Math.random() * motivations.goals[archetype].length)
      ],
      fears: motivations.fears
        .sort(() => Math.random() - 0.5)
        .slice(0, Math.floor(Math.random() * 2) + 1),
      desires: motivations.desires
        .sort(() => Math.random() - 0.5)
        .slice(0, Math.floor(Math.random() * 2) + 1),
      values: motivations.values
        .sort(() => Math.random() - 0.5)
        .slice(0, Math.floor(Math.random() * 3) + 1),
      methods: motivations.methods
        .sort(() => Math.random() - 0.5)
        .slice(0, Math.floor(Math.random() * 2) + 1)
    };
  };

  const generateStats = (threat: string, archetype: NPCArchetype): Record<StatType, Stat> => {
    const template = npcTemplates.find(t => t.archetype === archetype) ?? npcTemplates[0];
    const threatModifier = { low: -1, medium: 0, high: 1, elite: 2 }[threat] ?? 0;
    
    const stats: Partial<Record<StatType, Stat>> = {};
    
    Object.entries(template.statRanges).forEach(([stat, range]) => {
      const base = Math.max(1, Math.min(10, 
        range.min + Math.floor(Math.random() * (range.max - range.min + 1)) + threatModifier
      ));
      stats[stat as StatType] = { name: stat as StatType, value: base, base, modifier: 0 };
    });
    
    return stats as Record<StatType, Stat>;
  };

  const generateSkills = (
    _stats: Record<StatType, Stat>,
    threat: string,
    archetype: NPCArchetype
  ): Skill[] => {
    const template = npcTemplates.find(t => t.archetype === archetype) ?? npcTemplates[0];
    const threatBonus = { low: 0, medium: 2, high: 4, elite: 6 }[threat] ?? 0;
    
    const skillsMap: Record<string, Skill> = {};
    
    // Initialize all skills to 0
    Object.values(SkillType).forEach(skill => {
      const stat = getLinkedStat(skill);
      const level = 0;
      skillsMap[skill] = {
        name: skill,
        category: getSkillCategory(skill),
        stat,
        level,
        ip: 0,
        total: level // total will be calculated with stats later
      };
    });
    
    // Set primary skills
    template.skillPriorities.primary.forEach(skill => {
      if (skillsMap[skill]) {
        skillsMap[skill].level = Math.min(10, 4 + threatBonus + Math.floor(Math.random() * 3));
      }
    });
    
    // Set secondary skills
    template.skillPriorities.secondary.forEach(skill => {
      if (skillsMap[skill]) {
        skillsMap[skill].level = Math.min(10, 2 + threatBonus + Math.floor(Math.random() * 3));
      }
    });
    
    // Minimal skills stay at 0 or 1
    template.skillPriorities.minimal.forEach(skill => {
      if (skillsMap[skill]) {
        skillsMap[skill].level = Math.random() < 0.3 ? 1 : 0;
      }
    });
    
    return Object.values(skillsMap);
  };

  const handleSelectSavedNPC = useCallback((npc: GeneratedNPC) => {
    setSelectedSavedNPC(npc);
  }, []);

  const handleSelectSavedNPCKeyDown = useCallback((e: React.KeyboardEvent, npc: GeneratedNPC) => {
    handleKeyboardClick(e, () => handleSelectSavedNPC(npc));
  }, [handleSelectSavedNPC]);

  const handleDeleteNPC = useCallback((e: React.MouseEvent, npcId: string) => {
    e.stopPropagation();
    setSavedNPCs(prevNPCs => prevNPCs.filter(n => n.id !== npcId));
    if (selectedSavedNPC?.id === npcId) {
      setSelectedSavedNPC(null);
    }
  }, [selectedSavedNPC]);

  const generateNPC = () => {
    const archetype = options.archetype ?? 
      (['ganger', 'corporate', 'civilian', 'criminal', 'mercenary'] as NPCArchetype[])[
        Math.floor(Math.random() * 5)
      ];
    
    const role = options.role ?? 
      (['Solo', 'Netrunner', 'Tech', 'Medtech', 'Fixer'] as RoleType[])[
        Math.floor(Math.random() * 5)
      ];
    
    const threat = options.threat ?? 'medium';
    const gender = ['male', 'female', 'neutral'][Math.floor(Math.random() * 3)] as any;
    const name = options.customName ?? generateRandomName(gender);
    
    const stats = generateStats(threat, archetype);
    const skills = generateSkills(stats, threat, archetype);
    
    const hp = 10 + (stats.BODY.value * 5);
    
    const newNPC: GeneratedNPC = {
      id: Date.now().toString(),
      name,
      role,
      roleRank: Math.max(1, Math.min(10, 
        { low: 1, medium: 3, high: 5, elite: 7 }[threat] + Math.floor(Math.random() * 3)
      )),
      reputation: Math.floor(Math.random() * 3) + 1,
      stats,
      skills,
      hitPoints: {
        current: hp,
        max: hp,
        seriouslyWounded: Math.floor(hp / 2),
        deathSave: stats.BODY.value
      },
      humanity: {
        current: 50 - Math.floor(Math.random() * 20),
        max: 50
      },
      armor: [],
      weapons: [],
      cyberware: [],
      gear: [],
      background: {},
      lifepath: {
        friends: [],
        enemies: [],
        lovers: [],
        mentors: []
      },
      eurodollars: Math.floor(Math.random() * 5000) + 500,
      ip: 0,
      notes: '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isNPC: true,
      archetype,
      threat
    };
    
    if (options.includeAppearance) {
      newNPC.appearance = generateAppearance(archetype);
    }
    
    if (options.includeMotivation) {
      newNPC.motivation = generateMotivation(archetype);
    }
    
    if (options.includeBackground) {
      const { mannerisms, combatStyles, secrets } = npcGeneratorData;
      newNPC.mannerisms = mannerisms
        .sort(() => Math.random() - 0.5)
        .slice(0, Math.floor(Math.random() * 3) + 1);
      newNPC.combatStyle = combatStyles[archetype][
        Math.floor(Math.random() * combatStyles[archetype].length)
      ];
      newNPC.secrets = secrets[archetype]
        .sort(() => Math.random() - 0.5)
        .slice(0, Math.floor(Math.random() * 2) + 1);
    }
    
    setGeneratedNPC(newNPC);
  };


  const saveNPC = () => {
    if (generatedNPC) {
      addCharacter(generatedNPC);
      setSavedNPCs([...savedNPCs, generatedNPC]);
      setGeneratedNPC(null);
    }
  };

  const renderGenerator = () => (
    <div className={styles.generatorContent}>
      <div className={styles.optionsPanel}>
        <h3>Generator Options</h3>
        
        <Select
          label="Archetype"
          value={options.archetype ?? ''}
          onChange={(value) => setOptions({ ...options, archetype: value as NPCArchetype || undefined })}
          options={[
            { value: '', label: 'Random' },
            { value: 'ganger', label: 'Ganger' },
            { value: 'corporate', label: 'Corporate' },
            { value: 'lawEnforcement', label: 'Law Enforcement' },
            { value: 'civilian', label: 'Civilian' },
            { value: 'fixer', label: 'Fixer' },
            { value: 'techie', label: 'Techie' },
            { value: 'media', label: 'Media' },
            { value: 'nomad', label: 'Nomad' },
            { value: 'criminal', label: 'Criminal' },
            { value: 'mercenary', label: 'Mercenary' },
            { value: 'netrunner', label: 'Netrunner' },
            { value: 'medtech', label: 'Medtech' },
            { value: 'exotic', label: 'Exotic' }
          ]}
        />
        
        <Select
          label="Role"
          value={options.role ?? ''}
          onChange={(value) => setOptions({ ...options, role: value as RoleType || undefined })}
          options={[
            { value: '', label: 'Random' },
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
        
        <Select
          label="Threat Level"
          value={options.threat ?? 'medium'}
          onChange={(value) => setOptions({ ...options, threat: value as any })}
          options={[
            { value: 'low', label: 'Low' },
            { value: 'medium', label: 'Medium' },
            { value: 'high', label: 'High' },
            { value: 'elite', label: 'Elite' }
          ]}
        />
        
        <TextInput
          label="Custom Name (optional)"
          value={options.customName ?? ''}
          onChange={(value) => setOptions({ ...options, customName: value })}
          placeholder="Leave blank for random"
        />
        
        <div className={styles.checkboxGroup}>
          <Checkbox
            label="Include Appearance"
            checked={options.includeAppearance ?? false}
            onChange={(checked) => setOptions({ ...options, includeAppearance: checked })}
          />
          <Checkbox
            label="Include Motivation"
            checked={options.includeMotivation ?? false}
            onChange={(checked) => setOptions({ ...options, includeMotivation: checked })}
          />
          <Checkbox
            label="Include Background"
            checked={options.includeBackground ?? false}
            onChange={(checked) => setOptions({ ...options, includeBackground: checked })}
          />
          <Checkbox
            label="Include Cyberware"
            checked={options.includeCyberware ?? false}
            onChange={(checked) => setOptions({ ...options, includeCyberware: checked })}
          />
          <Checkbox
            label="Include Equipment"
            checked={options.includeEquipment ?? false}
            onChange={(checked) => setOptions({ ...options, includeEquipment: checked })}
          />
        </div>
        
        <div className={styles.generateActions}>
          <Button onClick={generateNPC} size="lg" fullWidth>
            <Icon name="dice-d6" /> Generate NPC
          </Button>
          {generatedNPC && (
            <Button onClick={saveNPC} variant="primary" fullWidth>
              <Icon name="save" /> Save NPC
            </Button>
          )}
        </div>
      </div>
      
      <div className={styles.previewPanel}>
        {generatedNPC ? (
          <>
            <div className={styles.npcHeader}>
              <h3>{generatedNPC.name}</h3>
              <div className={styles.npcMeta}>
                <span className={styles.archetype}>{generatedNPC.archetype}</span>
                <span className={`${styles.threat} ${styles[generatedNPC.threat]}`}>
                  {generatedNPC.threat}
                </span>
                <span>{generatedNPC.role} (Rank {generatedNPC.roleRank})</span>
              </div>
            </div>
            
            <div className={styles.npcDetails}>
              {generatedNPC.appearance && (
                <div className={styles.section}>
                  <h4>Appearance</h4>
                  <div className={styles.appearanceGrid}>
                    <div><strong>Age:</strong> {generatedNPC.appearance.age}</div>
                    <div><strong>Gender:</strong> {generatedNPC.appearance.gender}</div>
                    <div><strong>Height:</strong> {generatedNPC.appearance.height}</div>
                    <div><strong>Build:</strong> {generatedNPC.appearance.build}</div>
                    <div><strong>Hair:</strong> {generatedNPC.appearance.hairColor} {generatedNPC.appearance.hairStyle}</div>
                    <div><strong>Eyes:</strong> {generatedNPC.appearance.eyeColor}</div>
                    <div><strong>Style:</strong> {generatedNPC.appearance.clothingStyle}</div>
                    <div><strong>Features:</strong> {generatedNPC.appearance.distinguishingFeatures.join(', ')}</div>
                  </div>
                </div>
              )}
              
              {generatedNPC.motivation && (
                <div className={styles.section}>
                  <h4>Motivation</h4>
                  <p><strong>Goal:</strong> {generatedNPC.motivation.primaryGoal}</p>
                  <p><strong>Fears:</strong> {generatedNPC.motivation.fears.join(', ')}</p>
                  <p><strong>Desires:</strong> {generatedNPC.motivation.desires.join(', ')}</p>
                  <p><strong>Values:</strong> {generatedNPC.motivation.values.join(', ')}</p>
                  <p><strong>Methods:</strong> {generatedNPC.motivation.methods.join(', ')}</p>
                </div>
              )}
              
              {generatedNPC.mannerisms && (
                <div className={styles.section}>
                  <h4>Personality</h4>
                  <p><strong>Mannerisms:</strong> {generatedNPC.mannerisms.join(', ')}</p>
                  {generatedNPC.combatStyle && (
                    <p><strong>Combat Style:</strong> {generatedNPC.combatStyle}</p>
                  )}
                  {generatedNPC.secrets && (
                    <p><strong>Secrets:</strong> {generatedNPC.secrets.join(', ')}</p>
                  )}
                </div>
              )}
              
              <div className={styles.section}>
                <h4>Stats & Skills</h4>
                <CharacterSheet
                  character={generatedNPC}
                  isEditable={false}
                />
              </div>
            </div>
          </>
        ) : (
          <div className={styles.noNPC}>
            <Icon name="player" size="xl" />
            <p>Generate an NPC to see the preview</p>
          </div>
        )}
      </div>
    </div>
  );

  const renderSaved = () => (
    <div className={styles.savedContent}>
      {savedNPCs.length === 0 ? (
        <div className={styles.noSaved}>
          <Icon name="save" size="lg" />
          <p>No saved NPCs</p>
        </div>
      ) : (
        <div className={styles.savedGrid}>
          {savedNPCs.map(npc => (
            <button
              key={npc.id}
              className={`${styles.savedCard} ${selectedSavedNPC?.id === npc.id ? styles.selected : ''}`}
              onClick={() => handleSelectSavedNPC(npc)}
              onKeyDown={(e) => handleSelectSavedNPCKeyDown(e, npc)}
              tabIndex={0}
            >
              <h4>{npc.name}</h4>
              <div className={styles.savedMeta}>
                <span className={styles.archetype}>{npc.archetype}</span>
                <span className={`${styles.threat} ${styles[npc.threat]}`}>{npc.threat}</span>
                <span>{npc.role} (Rank {npc.roleRank})</span>
              </div>
              <div className={styles.savedActions}>
                <Button
                  onClick={() => {
                    addCharacter(npc);
                  }}
                  size="sm"
                >
                  <Icon name="add" /> Add to Characters
                </Button>
                <div
                  onClick={(e: React.MouseEvent) => handleDeleteNPC(e, npc.id)}
                  style={{ display: 'inline-block' }}
                >
                  <Button
                    variant="danger"
                    size="sm"
                  >
                    <Icon name="remove" /> Delete
                  </Button>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
      
      {selectedSavedNPC && (
        <div className={styles.savedPreview}>
          <h3>{selectedSavedNPC.name}</h3>
          <CharacterSheet
            character={selectedSavedNPC}
            isEditable={false}
          />
        </div>
      )}
    </div>
  );

  return (
    <div className={styles.npcGenerator}>
      <div className={styles.header}>
        <h2>NPC Generator</h2>
        <p>Quickly generate NPCs for your Cyberpunk Red games</p>
      </div>
      
      <div className={styles.tabs}>
        <button
          className={`${styles.tab} ${activeTab === 'generator' ? styles.active : ''}`}
          onClick={() => setActiveTab('generator')}
        >
          <Icon name="player" /> Generator
        </button>
        <button
          className={`${styles.tab} ${activeTab === 'saved' ? styles.active : ''}`}
          onClick={() => setActiveTab('saved')}
        >
          <Icon name="save" /> Saved NPCs
        </button>
      </div>
      
      <div className={styles.content}>
        {activeTab === 'generator' && renderGenerator()}
        {activeTab === 'saved' && renderSaved()}
      </div>
    </div>
  );
};

