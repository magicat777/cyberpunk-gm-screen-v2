import React, { useState, useRef, useEffect } from 'react';
import { 
  NetArchitecture, 
  NetFloor,
  Challenge, 
  DigitalLoot,
  SecurityLevel
} from '../../../types/netarchitecture';
import { architectureTemplates, challengeTemplates, lootTemplates, visualThemes } from '../../../data/netArchitectureData';
import styles from './NetArchitectureVisualizer.module.css';
import { Button } from '../../utility/Form/Button';
import { Icon } from '../../utility/Icon';
import { TextInput } from '../../utility/Form/TextInput';
import { Select } from '../../utility/Form/Select';

export const NetArchitectureVisualizer: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [activeTab, setActiveTab] = useState<'visualizer' | 'generator' | 'saved'>('visualizer');
  const [selectedArchitecture, setSelectedArchitecture] = useState<NetArchitecture | null>(null);
  const [selectedFloor, setSelectedFloor] = useState<NetFloor | null>(null);
  const [savedArchitectures, setSavedArchitectures] = useState<NetArchitecture[]>([]);
  
  const [generatorOptions, setGeneratorOptions] = useState({
    name: '',
    template: '',
    difficulty: 'standard' as NetArchitecture['difficulty'],
    floors: 3,
    location: '',
    customTheme: false,
    theme: 'corporate' as keyof typeof visualThemes
  });

  // Visualize the architecture
  const drawArchitecture = () => {
    const canvas = canvasRef.current;
    if (!canvas || !selectedArchitecture) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw background
    ctx.fillStyle = '#0a0a0a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Calculate floor dimensions
    const floorHeight = 120;
    const floorWidth = 600;
    const startX = (canvas.width - floorWidth) / 2;
    let currentY = 50;

    // Draw each floor
    selectedArchitecture.floors.forEach((floor, index) => {
      const theme = visualThemes[floor.visualStyle?.theme || 'corporate'];
      const isSelected = selectedFloor?.id === floor.id;

      // Draw floor box
      ctx.fillStyle = isSelected ? theme.primaryColor : '#1a1a1a';
      ctx.fillRect(startX, currentY, floorWidth, floorHeight);
      
      ctx.strokeStyle = theme.primaryColor;
      ctx.lineWidth = isSelected ? 3 : 1;
      ctx.strokeRect(startX, currentY, floorWidth, floorHeight);

      // Draw floor info
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 16px Arial';
      ctx.textAlign = 'left';
      ctx.fillText(`Floor ${floor.level}: ${floor.name}`, startX + 20, currentY + 30);
      
      ctx.font = '14px Arial';
      ctx.fillStyle = '#cccccc';
      ctx.fillText(floor.type.replace('_', ' ').toUpperCase(), startX + 20, currentY + 50);
      ctx.fillText(`Difficulty: ${floor.difficulty}`, startX + 20, currentY + 70);

      // Draw challenges
      const challengeStartX = startX + 300;
      ctx.fillStyle = '#ffaa00';
      ctx.font = '12px Arial';
      ctx.fillText(`Challenges: ${floor.challenges.length}`, challengeStartX, currentY + 30);
      
      // Draw loot
      ctx.fillStyle = '#00ff00';
      ctx.fillText(`Loot: ${floor.loot.length}`, challengeStartX, currentY + 50);

      // Draw connection to next floor
      if (index < selectedArchitecture.floors.length - 1) {
        ctx.strokeStyle = '#00ff00';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(startX + floorWidth / 2, currentY + floorHeight);
        ctx.lineTo(startX + floorWidth / 2, currentY + floorHeight + 30);
        ctx.stroke();
        
        // Arrow
        ctx.beginPath();
        ctx.moveTo(startX + floorWidth / 2 - 10, currentY + floorHeight + 20);
        ctx.lineTo(startX + floorWidth / 2, currentY + floorHeight + 30);
        ctx.lineTo(startX + floorWidth / 2 + 10, currentY + floorHeight + 20);
        ctx.closePath();
        ctx.fill();
      }

      currentY += floorHeight + 40;
    });

    // Draw security level
    const secX = canvas.width - 200;
    ctx.fillStyle = '#ff0000';
    ctx.font = '14px Arial';
    ctx.textAlign = 'right';
    ctx.fillText(`Security: ${selectedArchitecture.security.rating}/5`, secX, 30);
  };

  useEffect(() => {
    drawArchitecture();
  }, [selectedArchitecture, selectedFloor]);

  // Generate new architecture
  const generateArchitecture = () => {
    const template = architectureTemplates.find(t => t.id === generatorOptions.template);
    const floors: NetFloor[] = [];
    
    // Generate floors based on template or random
    for (let i = 0; i < generatorOptions.floors; i++) {
      const level = i + 1;
      const floorTemplate = template?.floors[i];
      
      const floor: NetFloor = {
        id: `floor_${Date.now()}_${i}`,
        level,
        name: floorTemplate?.name || `Floor ${level}`,
        type: floorTemplate?.type || 'file_server',
        difficulty: floorTemplate?.difficulty || 10 + (i * 3),
        description: floorTemplate?.description || 'Generated floor',
        challenges: generateChallenges(level, generatorOptions.difficulty),
        loot: generateLoot(level, generatorOptions.difficulty),
        connections: [],
        visualStyle: {
          theme: generatorOptions.theme,
          primaryColor: visualThemes[generatorOptions.theme].primaryColor,
          secondaryColor: visualThemes[generatorOptions.theme].secondaryColor
        }
      };
      
      floors.push(floor);
    }

    // Create connections between floors
    for (let i = 0; i < floors.length - 1; i++) {
      floors[i].connections.push({
        fromFloor: floors[i].id,
        toFloor: floors[i + 1].id,
        type: 'standard'
      });
    }

    const architecture: NetArchitecture = {
      id: Date.now().toString(),
      name: generatorOptions.name || 'Generated Architecture',
      description: template?.description || 'Custom generated architecture',
      difficulty: generatorOptions.difficulty,
      floors,
      security: calculateSecurity(generatorOptions.difficulty),
      location: generatorOptions.location,
      tags: [template?.category || 'custom'],
      createdAt: new Date(),
      modifiedAt: new Date()
    };

    setSavedArchitectures([...savedArchitectures, architecture]);
    setSelectedArchitecture(architecture);
    setActiveTab('visualizer');
  };

  const generateChallenges = (level: number, difficulty: string): Challenge[] => {
    const challengeCount = Math.min(level, 3);
    const challenges: Challenge[] = [];
    const difficultyModifier = { basic: -2, standard: 0, uncommon: 2, advanced: 4, legendary: 6 }[difficulty] || 0;
    
    for (let i = 0; i < challengeCount; i++) {
      const types = Object.keys(challengeTemplates);
      const type = types[Math.floor(Math.random() * types.length)];
      const typeTemplates = challengeTemplates[type];
      const template = typeTemplates[Math.floor(Math.random() * typeTemplates.length)];
      
      challenges.push({
        ...template,
        id: `challenge_${Date.now()}_${i}`,
        difficulty: template.difficulty + difficultyModifier
      });
    }
    
    return challenges;
  };

  const generateLoot = (_level: number, difficulty: string): DigitalLoot[] => {
    const lootCount = Math.floor(Math.random() * 3) + 1;
    const loot: DigitalLoot[] = [];
    const valueMultiplier = { basic: 0.5, standard: 1, uncommon: 1.5, advanced: 2, legendary: 3 }[difficulty] || 1;
    
    for (let i = 0; i < lootCount; i++) {
      const types = Object.keys(lootTemplates);
      const type = types[Math.floor(Math.random() * types.length)];
      const typeTemplates = lootTemplates[type];
      const template = typeTemplates[Math.floor(Math.random() * typeTemplates.length)];
      
      loot.push({
        ...template,
        id: `loot_${Date.now()}_${i}`,
        value: Math.floor(template.value * valueMultiplier * (0.8 + Math.random() * 0.4))
      });
    }
    
    return loot;
  };

  const calculateSecurity = (difficulty: string): SecurityLevel => {
    const ratings: Record<string, SecurityLevel> = {
      basic: { rating: 1, description: 'Minimal security' },
      standard: { rating: 2, description: 'Standard security protocols' },
      uncommon: { rating: 3, description: 'Enhanced security measures' },
      advanced: { rating: 4, description: 'Military-grade security' },
      legendary: { rating: 5, description: 'Maximum security' }
    };
    
    return ratings[difficulty] || ratings.standard;
  };

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!selectedArchitecture) return;
    
    const canvas = canvasRef.current!;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Calculate which floor was clicked
    const floorHeight = 120;
    const floorWidth = 600;
    const startX = (canvas.width - floorWidth) / 2;
    let currentY = 50;
    
    for (const floor of selectedArchitecture.floors) {
      if (x >= startX && x <= startX + floorWidth &&
          y >= currentY && y <= currentY + floorHeight) {
        setSelectedFloor(floor);
        break;
      }
      currentY += floorHeight + 40;
    }
  };

  const renderVisualizer = () => (
    <div className={styles.visualizerContent}>
      <div className={styles.canvasContainer}>
        <canvas
          ref={canvasRef}
          width={800}
          height={600}
          className={styles.architectureCanvas}
          onClick={handleCanvasClick}
        />
      </div>
      
      {selectedFloor && (
        <div className={styles.floorDetails}>
          <h3>Floor {selectedFloor.level}: {selectedFloor.name}</h3>
          <p className={styles.floorType}>{selectedFloor.type.replace('_', ' ').toUpperCase()}</p>
          <p>{selectedFloor.description}</p>
          
          <div className={styles.challengesSection}>
            <h4>Challenges</h4>
            {selectedFloor.challenges.length === 0 ? (
              <p>No challenges on this floor</p>
            ) : (
              <ul>
                {selectedFloor.challenges.map(challenge => (
                  <li key={challenge.id}>
                    <strong>{challenge.name}</strong> ({challenge.type})
                    <br />
                    Difficulty: {challenge.difficulty}
                    <br />
                    {challenge.description}
                    {challenge.damage && <><br />Damage: {challenge.damage}</>}
                  </li>
                ))}
              </ul>
            )}
          </div>
          
          <div className={styles.lootSection}>
            <h4>Digital Loot</h4>
            {selectedFloor.loot.length === 0 ? (
              <p>No loot on this floor</p>
            ) : (
              <ul>
                {selectedFloor.loot.map(loot => (
                  <li key={loot.id}>
                    <strong>{loot.name}</strong> ({loot.type})
                    <br />
                    Value: {loot.value}eb
                    <br />
                    {loot.description}
                    {loot.encrypted && <><br />🔒 Encrypted</>}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  );

  const renderGenerator = () => (
    <div className={styles.generatorContent}>
      <div className={styles.generatorForm}>
        <h3>Architecture Generator</h3>
        
        <TextInput
          label="Name"
          value={generatorOptions.name}
          onChange={(value) => setGeneratorOptions({ ...generatorOptions, name: value })}
          placeholder="Enter architecture name..."
        />
        
        <Select
          label="Template"
          value={generatorOptions.template}
          onChange={(value) => setGeneratorOptions({ ...generatorOptions, template: value })}
        >
          <option value="">Custom</option>
          {architectureTemplates.map(template => (
            <option key={template.id} value={template.id}>
              {template.name} ({template.category})
            </option>
          ))}
        </Select>
        
        <Select
          label="Difficulty"
          value={generatorOptions.difficulty}
          onChange={(value) => setGeneratorOptions({ 
            ...generatorOptions, 
            difficulty: value as NetArchitecture['difficulty'] 
          })}
        >
          <option value="basic">Basic</option>
          <option value="standard">Standard</option>
          <option value="uncommon">Uncommon</option>
          <option value="advanced">Advanced</option>
          <option value="legendary">Legendary</option>
        </Select>
        
        <TextInput
          label="Number of Floors"
          type="number"
          value={generatorOptions.floors.toString()}
          onChange={(value) => setGeneratorOptions({ 
            ...generatorOptions, 
            floors: parseInt(value) || 1 
          })}
        />
        
        <Select
          label="Visual Theme"
          value={generatorOptions.theme}
          onChange={(value) => setGeneratorOptions({ 
            ...generatorOptions, 
            theme: value as keyof typeof visualThemes 
          })}
        >
          {Object.keys(visualThemes).map(theme => (
            <option key={theme} value={theme}>
              {theme.charAt(0).toUpperCase() + theme.slice(1)}
            </option>
          ))}
        </Select>
        
        <TextInput
          label="Location (optional)"
          value={generatorOptions.location}
          onChange={(value) => setGeneratorOptions({ ...generatorOptions, location: value })}
          placeholder="Link to map region..."
        />
        
        <Button onClick={generateArchitecture} fullWidth>
          <Icon name="tech" /> Generate Architecture
        </Button>
      </div>
      
      <div className={styles.templates}>
        <h3>Available Templates</h3>
        {architectureTemplates.map(template => (
          <div key={template.id} className={styles.templateCard}>
            <h4>{template.name}</h4>
            <p className={styles.templateCategory}>{template.category}</p>
            <p>{template.description}</p>
            <div className={styles.templateStats}>
              <span>Floors: {template.floors.length}</span>
              <span>Difficulty: {template.difficulty}</span>
            </div>
            <Button
              onClick={() => {
                setGeneratorOptions({
                  ...generatorOptions,
                  template: template.id,
                  floors: template.floors.length,
                  difficulty: template.difficulty
                });
              }}
              size="sm"
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
      {savedArchitectures.length === 0 ? (
        <div className={styles.noSaved}>
          <Icon name="save" size="lg" />
          <p>No saved architectures</p>
        </div>
      ) : (
        <div className={styles.savedGrid}>
          {savedArchitectures.map(architecture => (
            <div key={architecture.id} className={styles.savedCard}>
              <h4>{architecture.name}</h4>
              <p className={styles.savedMeta}>
                <span className={`${styles.difficulty} ${styles[architecture.difficulty]}`}>
                  {architecture.difficulty}
                </span>
                <span>Floors: {architecture.floors.length}</span>
                <span>Security: {architecture.security.rating}/5</span>
              </p>
              <p>{architecture.description}</p>
              {architecture.location && (
                <p className={styles.location}>
                  <Icon name="location" /> {architecture.location}
                </p>
              )}
              <div className={styles.savedActions}>
                <Button
                  onClick={() => {
                    setSelectedArchitecture(architecture);
                    setActiveTab('visualizer');
                  }}
                  size="sm"
                >
                  <Icon name="search" /> View
                </Button>
                <Button
                  onClick={() => {
                    setSavedArchitectures(savedArchitectures.filter(a => a.id !== architecture.id));
                  }}
                  variant="danger"
                  size="sm"
                >
                  <Icon name="remove" /> Delete
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className={styles.netArchitectureVisualizer}>
      <div className={styles.header}>
        <h2>NetArchitecture Visualizer</h2>
        <p>Create and visualize complex netrunning challenges</p>
      </div>
      
      <div className={styles.tabs}>
        <button
          className={`${styles.tab} ${activeTab === 'visualizer' ? styles.active : ''}`}
          onClick={() => setActiveTab('visualizer')}
        >
          <Icon name="chip" /> Visualizer
        </button>
        <button
          className={`${styles.tab} ${activeTab === 'generator' ? styles.active : ''}`}
          onClick={() => setActiveTab('generator')}
        >
          <Icon name="tech" /> Generator
        </button>
        <button
          className={`${styles.tab} ${activeTab === 'saved' ? styles.active : ''}`}
          onClick={() => setActiveTab('saved')}
        >
          <Icon name="save" /> Saved
        </button>
      </div>
      
      <div className={styles.content}>
        {activeTab === 'visualizer' && renderVisualizer()}
        {activeTab === 'generator' && renderGenerator()}
        {activeTab === 'saved' && renderSaved()}
      </div>
    </div>
  );
};