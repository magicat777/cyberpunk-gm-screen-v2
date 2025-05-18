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
import { Character, RoleType, StatType, SkillType } from '../../../types/game';
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

  const generateStats = (threat: string, archetype: NPCArchetype): Record<StatType, { base: number; current: number }> => {
    const template = npcTemplates.find(t => t.archetype === archetype) ?? npcTemplates[0];
    const threatModifier = { low: -1, medium: 0, high: 1, elite: 2 }[threat] ?? 0;
    
    const stats: Partial<Record<StatType, { base: number; current: number }>> = {};
    
    Object.entries(template.statRanges).forEach(([stat, range]) => {
      const base = Math.max(1, Math.min(10, 
        range.min + Math.floor(Math.random() * (range.max - range.min + 1)) + threatModifier
      ));
      stats[stat as StatType] = { base, current: base };
    });
    
    return stats as Record<StatType, { base: number; current: number }>;
  };

  const generateSkills = (
    stats: Record<StatType, { base: number; current: number }>,
    threat: string,
    archetype: NPCArchetype
  ): Character['skills'] => {
    const template = npcTemplates.find(t => t.archetype === archetype) ?? npcTemplates[0];
    const threatBonus = { low: 0, medium: 2, high: 4, elite: 6 }[threat] ?? 0;
    
    const skills: Character['skills'] = {} as any;
    
    // Initialize all skills to 0
    Object.values(SkillType).forEach(skill => {
      skills[skill] = {
        level: 0,
        linkedStat: getLinkedStat(skill),
        ipSpent: 0
      };
    });
    
    // Set primary skills
    template.skillPriorities.primary.forEach(skill => {
      skills[skill].level = Math.min(10, 4 + threatBonus + Math.floor(Math.random() * 3));
    });
    
    // Set secondary skills
    template.skillPriorities.secondary.forEach(skill => {
      skills[skill].level = Math.min(10, 2 + threatBonus + Math.floor(Math.random() * 3));
    });
    
    // Minimal skills stay at 0 or 1
    template.skillPriorities.minimal.forEach(skill => {
      skills[skill].level = Math.random() < 0.3 ? 1 : 0;
    });
    
    return skills;
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
    
    const hp = 10 + (stats.body.current * 5);
    
    const newNPC: GeneratedNPC = {
      id: Date.now().toString(),
      name,
      role,
      roleRank: Math.max(1, Math.min(10, 
        { low: 1, medium: 3, high: 5, elite: 7 }[threat] + Math.floor(Math.random() * 3)
      )),
      reputationRank: Math.floor(Math.random() * 3) + 1,
      stats,
      skills,
      hp: {
        current: hp,
        max: hp,
        wounds: { light: 0, serious: 0, critical: 0, mortal: 0 }
      },
      deathSave: stats.body.current,
      humanity: {
        current: 50 - Math.floor(Math.random() * 20),
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
      money: Math.floor(Math.random() * 5000) + 500,
      improvement: { totalIp: 0, availableIp: 0, spentIp: 0 },
      lifepath: { background: {}, motivation: {}, events: [] },
      notes: '',
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
        >
          <option value="">Random</option>
          <option value="ganger">Ganger</option>
          <option value="corporate">Corporate</option>
          <option value="lawEnforcement">Law Enforcement</option>
          <option value="civilian">Civilian</option>
          <option value="fixer">Fixer</option>
          <option value="techie">Techie</option>
          <option value="media">Media</option>
          <option value="nomad">Nomad</option>
          <option value="criminal">Criminal</option>
          <option value="mercenary">Mercenary</option>
          <option value="netrunner">Netrunner</option>
          <option value="medtech">Medtech</option>
          <option value="exotic">Exotic</option>
        </Select>
        
        <Select
          label="Role"
          value={options.role ?? ''}
          onChange={(value) => setOptions({ ...options, role: value as RoleType || undefined })}
        >
          <option value="">Random</option>
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
        
        <Select
          label="Threat Level"
          value={options.threat ?? 'medium'}
          onChange={(value) => setOptions({ ...options, threat: value as any })}
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
          <option value="elite">Elite</option>
        </Select>
        
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
            <Icon name="dice" /> Generate NPC
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
            <Icon name="player" size="xlarge" />
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
          <Icon name="folder-open" size="lg" />
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
                  onClick={(e) => {
                    e.stopPropagation();
                    addCharacter(npc);
                  }}
                  size="sm"
                >
                  <Icon name="add" /> Add to Characters
                </Button>
                <Button
                  onClick={(e) => handleDeleteNPC(e, npc.id)}
                  variant="danger"
                  size="sm"
                >
                  <Icon name="remove" /> Delete
                </Button>
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
          <Icon name="magic" /> Generator
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

// Helper function for skill stats
function getLinkedStat(skill: SkillType): StatType {
  // This is a simplified mapping - you should use the full mapping from Characters.tsx
  const skillStatMap: Partial<Record<SkillType, StatType>> = {
    [SkillType.Concentration]: 'WILL',
    [SkillType.Athletics]: 'DEX',
    [SkillType.Handgun]: 'REF',
    [SkillType.Interface]: 'INT',
    // Add more mappings as needed
  };
  
  return skillStatMap[skill] ?? 'INT';
}

