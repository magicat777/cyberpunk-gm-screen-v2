import React, { useState } from 'react';
import { Encounter, EncounterParticipant, EncounterTemplate, EnvironmentConditions } from '../../../types/encounter';
import styles from './EncounterBuilder.module.css';
import { Button } from '../../utility/Form/Button';
import { Icon } from '../../utility/Icon';
import { TextInput } from '../../utility/Form/TextInput';
import { TextArea } from '../../utility/Form/TextArea';
import { Select } from '../../utility/Form/Select';

export const EncounterBuilder: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'builder' | 'templates' | 'saved'>('builder');
  const [encounter, setEncounter] = useState<Partial<Encounter>>({
    name: '',
    description: '',
    difficulty: 'medium',
    location: '',
    participants: [],
    environment: {
      lighting: 'normal',
      terrain: 'urban'
    },
    objectives: [],
    rewards: [],
    notes: '',
    tags: []
  });

  const [newObjective, setNewObjective] = useState('');
  const [newTag, setNewTag] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [savedEncounters, setSavedEncounters] = useState<Encounter[]>([]);

  // Pre-defined templates for quick encounter generation
  const templates: EncounterTemplate[] = [
    {
      id: '1',
      name: 'Street Gang Ambush',
      category: 'combat',
      description: 'A typical street gang tries to rob or attack the party',
      suggestedParticipants: [
        { type: 'Gang Leader', minQuantity: 1, maxQuantity: 1, threat: 'medium' },
        { type: 'Gang Member', minQuantity: 3, maxQuantity: 6, threat: 'low' }
      ],
      suggestedEnvironment: {
        lighting: 'dim',
        terrain: 'urban',
        cover: 'moderate'
      },
      suggestedObjectives: ['Survive the ambush', 'Defeat or drive off attackers'],
      suggestedRewards: [
        { type: 'eurodollars', name: 'Gang Stash', value: 500 },
        { type: 'item', name: 'Stolen goods' }
      ],
      difficulty: 'easy',
      partySize: { min: 3, max: 5 }
    },
    {
      id: '2',
      name: 'Corporate Extraction',
      category: 'stealth',
      description: 'Extract a target from a corporate facility',
      suggestedParticipants: [
        { type: 'Corporate Security', minQuantity: 4, maxQuantity: 8, threat: 'medium' },
        { type: 'Corporate Exec', minQuantity: 1, maxQuantity: 1, threat: 'low' }
      ],
      suggestedEnvironment: {
        lighting: 'bright',
        terrain: 'indoor',
        cover: 'light'
      },
      suggestedObjectives: ['Extract the target', 'Avoid raising alarms', 'Escape undetected'],
      suggestedRewards: [
        { type: 'eurodollars', name: 'Mission Payment', value: 5000 },
        { type: 'reputation', name: 'Fixer Rep' }
      ],
      difficulty: 'hard',
      partySize: { min: 4, max: 6 }
    },
    {
      id: '3',
      name: 'Boostergang Race',
      category: 'chase',
      description: 'High-speed chase through Night City streets',
      suggestedParticipants: [
        { type: 'Boostergang Racer', minQuantity: 3, maxQuantity: 5, threat: 'medium' }
      ],
      suggestedEnvironment: {
        lighting: 'normal',
        terrain: 'highway',
        weather: 'clear'
      },
      suggestedObjectives: ['Win the race', 'Survive the dangerous route'],
      suggestedRewards: [
        { type: 'eurodollars', name: 'Race Prize', value: 2000 },
        { type: 'reputation', name: 'Street Cred' }
      ],
      difficulty: 'medium',
      partySize: { min: 2, max: 4 }
    }
  ];

  const addParticipant = (type: 'player' | 'npc' | 'enemy') => {
    const newParticipant: EncounterParticipant = {
      id: Date.now().toString(),
      name: '',
      type,
      quantity: 1,
      threat: 'medium'
    };
    
    setEncounter(prev => ({
      ...prev,
      participants: [...(prev.participants || []), newParticipant]
    }));
  };

  const updateParticipant = (id: string, updates: Partial<EncounterParticipant>) => {
    setEncounter(prev => ({
      ...prev,
      participants: prev.participants?.map(p => 
        p.id === id ? { ...p, ...updates } : p
      ) || []
    }));
  };

  const removeParticipant = (id: string) => {
    setEncounter(prev => ({
      ...prev,
      participants: prev.participants?.filter(p => p.id !== id) || []
    }));
  };

  const addObjective = () => {
    if (newObjective.trim()) {
      setEncounter(prev => ({
        ...prev,
        objectives: [...(prev.objectives || []), newObjective.trim()]
      }));
      setNewObjective('');
    }
  };

  const removeObjective = (index: number) => {
    setEncounter(prev => ({
      ...prev,
      objectives: prev.objectives?.filter((_, i) => i !== index) || []
    }));
  };

  const addTag = () => {
    if (newTag.trim()) {
      setEncounter(prev => ({
        ...prev,
        tags: [...(prev.tags || []), newTag.trim()]
      }));
      setNewTag('');
    }
  };

  const removeTag = (index: number) => {
    setEncounter(prev => ({
      ...prev,
      tags: prev.tags?.filter((_, i) => i !== index) || []
    }));
  };

  const loadTemplate = (templateId: string) => {
    const template = templates.find(t => t.id === templateId);
    if (!template) return;

    setEncounter({
      name: template.name,
      description: template.description,
      difficulty: template.difficulty,
      environment: template.suggestedEnvironment as EnvironmentConditions,
      objectives: [...template.suggestedObjectives],
      participants: template.suggestedParticipants.map((sp, index) => ({
        id: Date.now().toString() + index,
        name: sp.type,
        type: 'enemy' as const,
        quantity: sp.minQuantity,
        threat: sp.threat
      })),
      rewards: template.suggestedRewards.map((sr, index) => ({
        id: Date.now().toString() + index,
        ...sr
      }))
    });
    setSelectedTemplate(templateId);
  };

  const saveEncounter = () => {
    if (!encounter.name) return;

    const newEncounter: Encounter = {
      id: Date.now().toString(),
      name: encounter.name,
      description: encounter.description,
      difficulty: encounter.difficulty || 'medium',
      location: encounter.location,
      participants: encounter.participants || [],
      environment: encounter.environment,
      objectives: encounter.objectives,
      rewards: encounter.rewards,
      notes: encounter.notes,
      tags: encounter.tags,
      createdAt: new Date(),
      modifiedAt: new Date()
    };

    setSavedEncounters(prev => [...prev, newEncounter]);
    // Reset form
    setEncounter({
      name: '',
      description: '',
      difficulty: 'medium',
      location: '',
      participants: [],
      environment: {
        lighting: 'normal',
        terrain: 'urban'
      },
      objectives: [],
      rewards: [],
      notes: '',
      tags: []
    });
  };

  const calculateThreatLevel = () => {
    const threatValues = { low: 1, medium: 2, high: 3 };
    const totalThreat = encounter.participants?.reduce((sum, p) => {
      if (p.type === 'enemy') {
        return sum + (threatValues[p.threat || 'medium'] * p.quantity);
      }
      return sum;
    }, 0) || 0;

    const playerCount = encounter.participants?.filter(p => p.type === 'player').length || 0;
    const threatRatio = playerCount > 0 ? totalThreat / playerCount : totalThreat;

    if (threatRatio < 2) return 'Low';
    if (threatRatio < 4) return 'Medium';
    if (threatRatio < 6) return 'High';
    return 'Extreme';
  };

  const renderBuilder = () => (
    <div className={styles.builderContent}>
      <div className={styles.section}>
        <h3>Basic Information</h3>
        <div className={styles.formGrid}>
          <TextInput
            label="Encounter Name"
            value={encounter.name || ''}
            onChange={(value) => setEncounter({ ...encounter, name: value })}
            required
          />
          <Select
            label="Difficulty"
            value={encounter.difficulty || 'medium'}
            onChange={(value) => setEncounter({ ...encounter, difficulty: value as Encounter['difficulty'] })}
            options={[
              { value: 'easy', label: 'Easy' },
              { value: 'medium', label: 'Medium' },
              { value: 'hard', label: 'Hard' },
              { value: 'deadly', label: 'Deadly' }
            ]}
          />
          <TextInput
            label="Location"
            value={encounter.location || ''}
            onChange={(value) => setEncounter({ ...encounter, location: value })}
          />
        </div>
        <TextArea
          label="Description"
          value={encounter.description || ''}
          onChange={(value) => setEncounter({ ...encounter, description: value })}
          rows={3}
        />
      </div>

      <div className={styles.section}>
        <h3>Environment</h3>
        <div className={styles.formGrid}>
          <Select
            label="Lighting"
            value={encounter.environment?.lighting || 'normal'}
            onChange={(value) => setEncounter({
              ...encounter,
              environment: { 
                ...encounter.environment,
                lighting: value as EnvironmentConditions['lighting'] 
              }
            })}
            options={[
              { value: 'bright', label: 'Bright' },
              { value: 'normal', label: 'Normal' },
              { value: 'dim', label: 'Dim' },
              { value: 'dark', label: 'Dark' }
            ]}
          />
          <Select
            label="Terrain"
            value={encounter.environment?.terrain || 'urban'}
            onChange={(value) => setEncounter({
              ...encounter,
              environment: { 
                lighting: encounter.environment?.lighting || 'normal',
                ...encounter.environment, 
                terrain: value as EnvironmentConditions['terrain'] 
              }
            })}
            options={[
              { value: 'urban', label: 'Urban' },
              { value: 'indoor', label: 'Indoor' },
              { value: 'badlands', label: 'Badlands' },
              { value: 'highway', label: 'Highway' },
              { value: 'rooftop', label: 'Rooftop' }
            ]}
          />
          <Select
            label="Weather"
            value={encounter.environment?.weather || ''}
            onChange={(value) => setEncounter({
              ...encounter,
              environment: { 
                lighting: encounter.environment?.lighting || 'normal',
                ...encounter.environment, 
                weather: value as EnvironmentConditions['weather'] || undefined 
              }
            })}
            options={[
              { value: '', label: 'None' },
              { value: 'clear', label: 'Clear' },
              { value: 'rain', label: 'Rain' },
              { value: 'fog', label: 'Fog' },
              { value: 'storm', label: 'Storm' },
              { value: 'snow', label: 'Snow' }
            ]}
          />
          <Select
            label="Cover"
            value={encounter.environment?.cover || 'moderate'}
            onChange={(value) => setEncounter({
              ...encounter,
              environment: { 
                lighting: encounter.environment?.lighting || 'normal',
                ...encounter.environment, 
                cover: value as EnvironmentConditions['cover'] 
              }
            })}
            options={[
              { value: 'none', label: 'None' },
              { value: 'light', label: 'Light' },
              { value: 'moderate', label: 'Moderate' },
              { value: 'heavy', label: 'Heavy' }
            ]}
          />
        </div>
      </div>

      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <h3>Participants</h3>
          <div className={styles.threatLevel}>
            Threat Level: <span className={styles[calculateThreatLevel().toLowerCase()]}>
              {calculateThreatLevel()}
            </span>
          </div>
        </div>
        <div className={styles.participantButtons}>
          <Button onClick={() => addParticipant('player')} size="sm" icon={<Icon name="add" />}>
            Add Player
          </Button>
          <Button onClick={() => addParticipant('npc')} size="sm" icon={<Icon name="add" />}>
            Add NPC
          </Button>
          <Button onClick={() => addParticipant('enemy')} size="sm" icon={<Icon name="add" />}>
            Add Enemy
          </Button>
        </div>
        <div className={styles.participantsList}>
          {encounter.participants?.map(participant => (
            <div key={participant.id} className={`${styles.participantCard} ${styles[participant.type]}`}>
              <div className={styles.participantHeader}>
                <TextInput
                  value={participant.name}
                  onChange={(value) => updateParticipant(participant.id, { name: value })}
                  placeholder="Name"
                  className={styles.nameInput}
                />
                <Button
                  onClick={() => removeParticipant(participant.id)}
                  variant="danger"
                  size="sm"
                  icon={<Icon name="remove" />}
                >
                  Remove
                </Button>
              </div>
              <div className={styles.participantDetails}>
                <input
                  type="number"
                  value={participant.quantity}
                  onChange={(e) => updateParticipant(participant.id, { 
                    quantity: parseInt(e.target.value) || 1 
                  })}
                  min="1"
                  className={styles.quantityInput}
                />
                {participant.type === 'enemy' && (
                  <Select
                    value={participant.threat || 'medium'}
                    onChange={(value) => updateParticipant(participant.id, {
                      threat: value as any
                    })}
                    className={styles.threatSelect}
                    options={[
                      { value: 'low', label: 'Low Threat' },
                      { value: 'medium', label: 'Medium Threat' },
                      { value: 'high', label: 'High Threat' }
                    ]}
                  />
                )}
                <TextInput
                  value={participant.faction || ''}
                  onChange={(value) => updateParticipant(participant.id, { faction: value })}
                  placeholder="Faction"
                  className={styles.factionInput}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.section}>
        <h3>Objectives</h3>
        <div className={styles.objectiveInput}>
          <TextInput
            value={newObjective}
            onChange={(value) => setNewObjective(value)}
            placeholder="Add objective..."
          />
          <Button onClick={addObjective} size="sm" icon={<Icon name="add" />}>
            Add
          </Button>
        </div>
        <ul className={styles.objectivesList}>
          {encounter.objectives?.map((objective, index) => (
            <li key={index}>
              {objective}
              <button
                onClick={() => removeObjective(index)}
                className={styles.removeButton}
              >
                <Icon name="close" size="sm" />
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div className={styles.section}>
        <h3>Tags</h3>
        <div className={styles.tagInput}>
          <TextInput
            value={newTag}
            onChange={(value) => setNewTag(value)}
            placeholder="Add tag..."
          />
          <Button onClick={addTag} size="sm" icon={<Icon name="add" />}>
            Add
          </Button>
        </div>
        <div className={styles.tagsList}>
          {encounter.tags?.map((tag, index) => (
            <span key={index} className={styles.tag}>
              {tag}
              <button
                onClick={() => removeTag(index)}
                className={styles.removeTagButton}
              >
                <Icon name="close" size="sm" />
              </button>
            </span>
          ))}
        </div>
      </div>

      <div className={styles.section}>
        <h3>Notes</h3>
        <TextArea
          value={encounter.notes || ''}
          onChange={(value) => setEncounter({ ...encounter, notes: value })}
          rows={4}
          placeholder="Additional notes..."
        />
      </div>

      <div className={styles.actions}>
        <Button onClick={saveEncounter} disabled={!encounter.name} icon={<Icon name="save" />}>
          Save Encounter
        </Button>
        <Button
          onClick={() => setEncounter({
            name: '',
            description: '',
            difficulty: 'medium',
            location: '',
            participants: [],
            environment: {
              lighting: 'normal',
              terrain: 'urban'
            },
            objectives: [],
            rewards: [],
            notes: '',
            tags: []
          })}
          variant="secondary"
          icon={<Icon name="redo" />}
        >
          Clear Form
        </Button>
      </div>
    </div>
  );

  const renderTemplates = () => (
    <div className={styles.templatesContent}>
      <div className={styles.templateGrid}>
        {templates.map(template => (
          <div
            key={template.id}
            className={`${styles.templateCard} ${selectedTemplate === template.id ? styles.selected : ''}`}
            onClick={() => setSelectedTemplate(template.id)}
          >
            <h4>{template.name}</h4>
            <div className={styles.templateMeta}>
              <span className={styles.category}>{template.category}</span>
              <span className={`${styles.difficulty} ${styles[template.difficulty]}`}>
                {template.difficulty}
              </span>
            </div>
            <p>{template.description}</p>
            <div className={styles.templateDetails}>
              <span>Party Size: {template.partySize.min}-{template.partySize.max}</span>
              <span>Participants: {template.suggestedParticipants.length} types</span>
            </div>
            <Button
              onClick={() => {
                loadTemplate(template.id);
                setActiveTab('builder');
              }}
              size="sm"
              icon={<Icon name="chevron-right" />}
            >
              Use Template
            </Button>
          </div>
        ))}
      </div>
    </div>
  );

  const renderSaved = () => (
    <div className={styles.savedContent}>
      {savedEncounters.length === 0 ? (
        <div className={styles.noSaved}>
          <Icon name="load" size="lg" />
          <p>No saved encounters</p>
        </div>
      ) : (
        <div className={styles.savedGrid}>
          {savedEncounters.map(saved => (
            <div key={saved.id} className={styles.savedCard}>
              <h4>{saved.name}</h4>
              <div className={styles.savedMeta}>
                <span className={`${styles.difficulty} ${styles[saved.difficulty]}`}>
                  {saved.difficulty}
                </span>
                {saved.location && <span>{saved.location}</span>}
                <span>{saved.participants.length} participants</span>
              </div>
              {saved.description && <p>{saved.description}</p>}
              <div className={styles.savedActions}>
                <Button
                  onClick={() => {
                    setEncounter(saved);
                    setActiveTab('builder');
                  }}
                  size="sm"
                  icon={<Icon name="edit" />}
                >
                  Edit
                </Button>
                <Button
                  onClick={() => setSavedEncounters(prev => 
                    prev.filter(e => e.id !== saved.id)
                  )}
                  variant="danger"
                  size="sm"
                  icon={<Icon name="remove" />}
                >
                  Delete
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className={styles.encounterBuilder}>
      <div className={styles.header}>
        <h2>Encounter Builder</h2>
        <p>Create and manage combat encounters</p>
      </div>

      <div className={styles.tabs}>
        <button
          className={`${styles.tab} ${activeTab === 'builder' ? styles.active : ''}`}
          onClick={() => setActiveTab('builder')}
        >
          <Icon name="settings" /> Builder
        </button>
        <button
          className={`${styles.tab} ${activeTab === 'templates' ? styles.active : ''}`}
          onClick={() => setActiveTab('templates')}
        >
          <Icon name="save" /> Templates
        </button>
        <button
          className={`${styles.tab} ${activeTab === 'saved' ? styles.active : ''}`}
          onClick={() => setActiveTab('saved')}
        >
          <Icon name="save" /> Saved
        </button>
      </div>

      <div className={styles.content}>
        {activeTab === 'builder' && renderBuilder()}
        {activeTab === 'templates' && renderTemplates()}
        {activeTab === 'saved' && renderSaved()}
      </div>
    </div>
  );
};