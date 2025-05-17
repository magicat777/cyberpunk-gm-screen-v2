import React, { useState } from 'react';
import { useDice } from '@/store';
import { useSound } from '@/utils/sound';
import styles from './DiceRoller.module.css';

interface DiceType {
  value: number;
  label: string;
  color: string;
}

const DICE_TYPES: DiceType[] = [
  { value: 4, label: 'd4', color: '#ff00ff' },
  { value: 6, label: 'd6', color: '#00ffff' },
  { value: 8, label: 'd8', color: '#00ff41' },
  { value: 10, label: 'd10', color: '#ffff00' },
  { value: 12, label: 'd12', color: '#ff8800' },
  { value: 20, label: 'd20', color: '#ff0040' },
];

export const DiceRoller: React.FC = () => {
  const { rollDice, diceHistory, clearHistory, removeRoll, isRolling } = useDice();
  const { playDiceRoll } = useSound();
  const [selectedDice, setSelectedDice] = useState<DiceType>(DICE_TYPES[1]); // d6 default
  const [diceCount, setDiceCount] = useState(1);
  const [modifier, setModifier] = useState(0);
  const [exploding, setExploding] = useState(false);
  const [recentRollAnimation, setRecentRollAnimation] = useState(false);

  const handleRoll = () => {
    const result = rollDice(`d${selectedDice.value}`, diceCount, modifier, exploding);
    playDiceRoll(result.result, selectedDice.value * diceCount + modifier);
    setRecentRollAnimation(true);
    setTimeout(() => setRecentRollAnimation(false), 600);
  };

  const handleQuickRoll = (dice: DiceType) => {
    const result = rollDice(`d${dice.value}`, 1, 0, false);
    playDiceRoll(result.result, dice.value);
    setRecentRollAnimation(true);
    setTimeout(() => setRecentRollAnimation(false), 600);
  };

  const getMostRecentRoll = () => {
    return diceHistory[0];
  };

  const formatRollString = (roll: typeof diceHistory[0]) => {
    let result = roll.type;
    if (roll.exploded) result += ' (exploding)';
    return result;
  };

  return (
    <div className={styles.diceRoller}>
      <div className={styles.mainSection}>
        <h2 className={styles.title}>Dice Roller</h2>
        
        {/* Quick Roll Buttons */}
        <div className={styles.quickRolls}>
          <h3 className={styles.sectionTitle}>Quick Roll</h3>
          <div className={styles.diceGrid}>
            {DICE_TYPES.map((dice) => (
              <button
                key={dice.value}
                className={styles.quickDice}
                onClick={() => handleQuickRoll(dice)}
                style={{ '--dice-color': dice.color } as React.CSSProperties}
                disabled={isRolling}
                aria-label={`Quick roll ${dice.label}`}
              >
                {dice.label}
              </button>
            ))}
          </div>
        </div>

        {/* Custom Roll Section */}
        <div className={styles.customRoll}>
          <h3 className={styles.sectionTitle}>Custom Roll</h3>
          
          <div className={styles.rollControls}>
            {/* Dice Count */}
            <div className={styles.control}>
              <label htmlFor="dice-count">Count</label>
              <input
                id="dice-count"
                type="number"
                min="1"
                max="20"
                value={diceCount}
                onChange={(e) => setDiceCount(Math.max(1, parseInt(e.target.value) || 1))}
                className={styles.numberInput}
              />
            </div>

            {/* Dice Type */}
            <div className={styles.control}>
              <label htmlFor="dice-type">Type</label>
              <select
                id="dice-type"
                value={selectedDice.value}
                onChange={(e) => {
                  const dice = DICE_TYPES.find(d => d.value === parseInt(e.target.value));
                  if (dice) setSelectedDice(dice);
                }}
                className={styles.select}
              >
                {DICE_TYPES.map((dice) => (
                  <option key={dice.value} value={dice.value}>
                    {dice.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Modifier */}
            <div className={styles.control}>
              <label htmlFor="modifier">Modifier</label>
              <input
                id="modifier"
                type="number"
                min="-20"
                max="20"
                value={modifier}
                onChange={(e) => setModifier(parseInt(e.target.value) || 0)}
                className={styles.numberInput}
              />
            </div>

            {/* Exploding Dice */}
            <div className={styles.control}>
              <label htmlFor="exploding" className={styles.checkboxLabel}>
                <input
                  id="exploding"
                  type="checkbox"
                  checked={exploding}
                  onChange={(e) => setExploding(e.target.checked)}
                  className={styles.checkbox}
                />
                Exploding
              </label>
            </div>
          </div>

          <button
            className={styles.rollButton}
            onClick={handleRoll}
            disabled={isRolling}
            style={{ '--dice-color': selectedDice.color } as React.CSSProperties}
          >
            Roll {diceCount}d{selectedDice.value}
            {modifier !== 0 && `${modifier > 0 ? '+' : ''}${modifier}`}
            {exploding && ' (exploding)'}
          </button>
        </div>

        {/* Most Recent Roll */}
        {diceHistory.length > 0 && (
          <div className={`${styles.recentRoll} ${recentRollAnimation ? styles.rollAnimation : ''}`}>
            <h3 className={styles.sectionTitle}>Last Roll</h3>
            <div className={styles.rollResult}>
              <div className={`${styles.resultValue} ${
                getMostRecentRoll()?.result === (getMostRecentRoll()?.rolls[0] || 0) && 
                getMostRecentRoll()?.rolls[0] === 20 ? styles.critical : ''
              }`}>
                {getMostRecentRoll()?.result}
              </div>
              <div className={styles.resultDetails}>
                <div className={styles.rollType}>{formatRollString(getMostRecentRoll()!)}</div>
                <div className={styles.rollBreakdown}>
                  Rolls: [{getMostRecentRoll()?.rolls.join(', ')}]
                  {getMostRecentRoll()?.modifier !== 0 && 
                    ` + ${getMostRecentRoll()?.modifier}`
                  }
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Roll History */}
      <div className={styles.historySection}>
        <div className={styles.historyHeader}>
          <h3 className={styles.sectionTitle}>Roll History</h3>
          <button
            className={styles.clearButton}
            onClick={clearHistory}
            aria-label="Clear roll history"
          >
            Clear All
          </button>
        </div>

        <div className={styles.historyList}>
          {diceHistory.length === 0 ? (
            <div className={styles.emptyHistory}>No rolls yet</div>
          ) : (
            diceHistory.map((roll) => (
              <div key={roll.id} className={styles.historyItem}>
                <div className={styles.historyResult}>{roll.result}</div>
                <div className={styles.historyDetails}>
                  <div className={styles.historyType}>{formatRollString(roll)}</div>
                  <div className={styles.historyRolls}>
                    [{roll.rolls.join(', ')}]
                  </div>
                </div>
                <button
                  className={styles.removeButton}
                  onClick={() => removeRoll(roll.id)}
                  aria-label="Remove this roll"
                >
                  ✕
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};