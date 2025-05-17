import { useState, useEffect } from 'react';
import { Button } from '../../utility/Form/Button';
import { TextInput } from '../../utility/Form/TextInput';
import { Icon } from '../../utility/Icon';
import { Typography } from '../../utility/Typography/Typography';
import { useStore } from '../../../store/useStore';
import { CombatParticipant } from '../../../store/types';
import styles from './InitiativeTracker.module.css';
import clsx from 'clsx';

export function InitiativeTracker() {
  const {
    activeCombat,
    combatEncounters,
    createEncounter,
    addParticipant,
    updateParticipant,
    removeParticipant,
    startCombat,
    endCombat,
    nextTurn,
    previousTurn,
    sortByInitiative
  } = useStore();

  const [showAddForm, setShowAddForm] = useState(false);
  const [newParticipantName, setNewParticipantName] = useState('');
  const [newParticipantReflex, setNewParticipantReflex] = useState('');
  const [newParticipantHP, setNewParticipantHP] = useState('');
  const [isNPC, setIsNPC] = useState(true);
  const [selectedEncounterId, setSelectedEncounterId] = useState<string>('');

  // Create a new encounter if none exist
  useEffect(() => {
    if (combatEncounters.length === 0) {
      createEncounter('New Combat');
    }
  }, [combatEncounters.length, createEncounter]);

  // Set selected encounter
  useEffect(() => {
    if (combatEncounters.length > 0 && !selectedEncounterId) {
      setSelectedEncounterId(combatEncounters[0].id);
    }
  }, [combatEncounters, selectedEncounterId]);

  const currentEncounter = activeCombat || combatEncounters.find(e => e.id === selectedEncounterId);

  const handleAddParticipant = () => {
    if (!currentEncounter || !newParticipantName.trim()) return;

    const reflexValue = parseInt(newParticipantReflex) || 5;
    const hpValue = parseInt(newParticipantHP) || 30;
    const initiativeRoll = Math.floor(Math.random() * 10) + 1;
    const initiative = reflexValue + initiativeRoll;

    const newParticipant: CombatParticipant = {
      id: crypto.randomUUID(),
      name: newParticipantName.trim(),
      initiative,
      initiativeRoll,
      reflexes: reflexValue,
      hitPoints: hpValue,
      maxHitPoints: hpValue,
      seriouslyWounded: false,
      deathSave: 0,
      isNPC,
      conditions: [],
      hasActed: false,
      delayedTurn: false,
      color: getRandomColor()
    };

    addParticipant(currentEncounter.id, newParticipant);
    
    // Reset form
    setNewParticipantName('');
    setNewParticipantReflex('');
    setNewParticipantHP('');
    setShowAddForm(false);
  };

  const handleRollAllInitiatives = () => {
    if (!currentEncounter) return;

    currentEncounter.participants.forEach(participant => {
      const newRoll = Math.floor(Math.random() * 10) + 1;
      const newInitiative = (participant.reflexes || 5) + newRoll;
      
      updateParticipant(currentEncounter.id, participant.id, {
        initiativeRoll: newRoll,
        initiative: newInitiative
      });
    });

    // Sort participants after rolling
    sortByInitiative(currentEncounter.id);
  };

  const handleUpdateHP = (participantId: string, newHP: number) => {
    if (!currentEncounter) return;

    const participant = currentEncounter.participants.find(p => p.id === participantId);
    if (!participant) return;

    const seriouslyWounded = newHP <= Math.floor(participant.maxHitPoints / 2);
    
    updateParticipant(currentEncounter.id, participantId, {
      hitPoints: newHP,
      seriouslyWounded
    });
  };

  const getRandomColor = () => {
    const colors = [
      '#ff006e', '#fb5607', '#ffbe0b', '#8338ec', '#3a86ff',
      '#06ffa5', '#ff4cc9', '#c77dff', '#7209b7', '#f72585'
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  const currentParticipant = currentEncounter?.participants[currentEncounter.currentTurn];

  if (!currentEncounter) {
    return <div>Loading...</div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Typography variant="h2">Initiative Tracker</Typography>
        <div className={styles.headerActions}>
          {!currentEncounter.isActive ? (
            <>
              <Button
                variant="primary"
                size="sm"
                onClick={() => startCombat(currentEncounter.id)}
                icon={<Icon name="chevron-right" />}
                iconPosition="start"
                disabled={currentEncounter.participants.length === 0}
              >
                Start Combat
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={handleRollAllInitiatives}
                icon={<Icon name="dice-d10" />}
                iconPosition="start"
                disabled={currentEncounter.participants.length === 0}
              >
                Roll All
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="danger"
                size="sm"
                onClick={() => endCombat(currentEncounter.id)}
                icon={<Icon name="close" />}
                iconPosition="start"
              >
                End Combat
              </Button>
              <Typography variant="body2" className={styles.roundCounter}>
                Round {currentEncounter.round}
              </Typography>
            </>
          )}
        </div>
      </div>

      {currentEncounter.isActive && currentParticipant && (
        <div className={styles.currentTurn}>
          <Typography variant="h3">Current Turn</Typography>
          <div 
            className={styles.currentParticipant}
            style={{ borderColor: currentParticipant.color }}
          >
            <div className={styles.participantInfo}>
              <Typography variant="h4">{currentParticipant.name}</Typography>
              <Typography variant="body2">
                Initiative: {currentParticipant.initiative} 
                ({currentParticipant.reflexes || '?'} + {currentParticipant.initiativeRoll || '?'})
              </Typography>
            </div>
            <div className={styles.turnActions}>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => previousTurn(currentEncounter.id)}
                icon={<Icon name="chevron-left" />}
                iconPosition="start"
              >
                Previous
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={() => nextTurn(currentEncounter.id)}
                icon={<Icon name="chevron-right" />}
                iconPosition="end"
              >
                Next Turn
              </Button>
            </div>
          </div>
        </div>
      )}

      <div className={styles.participantsList}>
        <div className={styles.listHeader}>
          <Typography variant="h3">Participants</Typography>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setShowAddForm(!showAddForm)}
            icon={<Icon name={showAddForm ? 'close' : 'add'} />}
            iconPosition="start"
          >
            {showAddForm ? 'Cancel' : 'Add'}
          </Button>
        </div>

        {showAddForm && (
          <div className={styles.addForm}>
            <TextInput
              label="Name"
              value={newParticipantName}
              onChange={(value) => setNewParticipantName(value)}
              placeholder="Character name"
            />
            <div className={styles.statsRow}>
              <TextInput
                label="REF"
                value={newParticipantReflex}
                onChange={(value) => setNewParticipantReflex(value)}
                placeholder="5"
                type="number"
              />
              <TextInput
                label="HP"
                value={newParticipantHP}
                onChange={(value) => setNewParticipantHP(value)}
                placeholder="30"
                type="number"
              />
            </div>
            <div className={styles.typeToggle}>
              <Button
                variant={!isNPC ? 'primary' : 'secondary'}
                size="sm"
                onClick={() => setIsNPC(false)}
              >
                PC
              </Button>
              <Button
                variant={isNPC ? 'primary' : 'secondary'}
                size="sm"
                onClick={() => setIsNPC(true)}
              >
                NPC
              </Button>
            </div>
            <Button
              variant="primary"
              onClick={handleAddParticipant}
              disabled={!newParticipantName.trim()}
              fullWidth
            >
              Add Participant
            </Button>
          </div>
        )}

        <div className={styles.participants}>
          {currentEncounter.participants.length === 0 ? (
            <div className={styles.emptyState}>
              <Icon name="player" size="xl" />
              <Typography variant="body1">No participants yet</Typography>
              <Typography variant="body2">Add characters to begin combat</Typography>
            </div>
          ) : (
            currentEncounter.participants.map((participant, index) => (
              <div
                key={participant.id}
                className={clsx(
                  styles.participantCard,
                  currentEncounter.isActive && index === currentEncounter.currentTurn && styles.currentTurn,
                  participant.seriouslyWounded && styles.wounded,
                  participant.hitPoints <= 0 && styles.down
                )}
                style={{ borderLeftColor: participant.color }}
              >
                <div className={styles.participantHeader}>
                  <div className={styles.participantName}>
                    <Icon 
                      name={participant.isNPC ? 'npc' : 'player'} 
                      size="sm"
                      title={participant.isNPC ? 'NPC' : 'Player Character'}
                    />
                    <Typography variant="h4">{participant.name}</Typography>
                  </div>
                  <div className={styles.initiative}>
                    <Typography variant="h3">{participant.initiative}</Typography>
                    <Typography variant="caption">
                      {participant.reflexes || '?'} + {participant.initiativeRoll || '?'}
                    </Typography>
                  </div>
                </div>

                <div className={styles.participantStats}>
                  <div className={styles.hpTracker}>
                    <Typography variant="body2">HP:</Typography>
                    <TextInput
                      value={String(participant.hitPoints)}
                      onChange={(value) => handleUpdateHP(participant.id, parseInt(value) || 0)}
                      type="number"
                      className={styles.hpInput}
                    />
                    <Typography variant="body2">/ {participant.maxHitPoints}</Typography>
                  </div>

                  {participant.conditions.length > 0 && (
                    <div className={styles.conditions}>
                      {participant.conditions.map(condition => (
                        <span 
                          key={condition.id} 
                          className={styles.condition}
                          title={condition.effects.join(', ')}
                        >
                          {condition.name}
                          {condition.duration && ` (${condition.duration})`}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className={styles.participantActions}>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => {
                      const newRoll = Math.floor(Math.random() * 10) + 1;
                      const newInitiative = (participant.reflexes || 5) + newRoll;
                      updateParticipant(currentEncounter.id, participant.id, {
                        initiativeRoll: newRoll,
                        initiative: newInitiative
                      });
                      sortByInitiative(currentEncounter.id);
                    }}
                    title="Reroll initiative"
                  >
                    <Icon name="redo" />
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => removeParticipant(currentEncounter.id, participant.id)}
                    title="Remove participant"
                  >
                    <Icon name="close" />
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}