import React, { useState, useEffect } from 'react';
import styles from './TimerManager.module.css';
import { Button } from '../../utility/Form/Button';
import { Icon } from '../../utility/Icon';
import { TextInput } from '../../utility/Form/TextInput';
import { Select } from '../../utility/Form/Select';

interface Timer {
  id: string;
  name: string;
  duration: number; // in seconds
  remaining: number; // in seconds
  isRunning: boolean;
  type: 'countdown' | 'stopwatch';
  category: 'combat' | 'session' | 'custom';
  color?: string;
  sound?: boolean;
  createdAt: Date;
}

export const TimerManager: React.FC = () => {
  const [timers, setTimers] = useState<Timer[]>([]);
  const [showNewTimerModal, setShowNewTimerModal] = useState(false);
  const [newTimerData, setNewTimerData] = useState<{
    name: string;
    minutes: number;
    seconds: number;
    type: 'countdown' | 'stopwatch';
    category: 'combat' | 'session' | 'custom';
    sound: boolean;
  }>({
    name: '',
    minutes: 0,
    seconds: 0,
    type: 'countdown',
    category: 'custom',
    sound: true
  });

  // Pre-defined timer templates
  const templates = [
    { name: 'Combat Round', minutes: 0, seconds: 6, category: 'combat' },
    { name: 'Turn Timer', minutes: 0, seconds: 30, category: 'combat' },
    { name: 'Short Rest', minutes: 10, seconds: 0, category: 'session' },
    { name: 'Scene Timer', minutes: 5, seconds: 0, category: 'session' },
    { name: 'Netrun Timer', minutes: 1, seconds: 0, category: 'combat' },
    { name: 'Initiative Reset', minutes: 0, seconds: 10, category: 'combat' }
  ];

  // Update all timers every second
  useEffect(() => {
    const interval = setInterval(() => {
      setTimers(prevTimers => 
        prevTimers.map(timer => {
          if (!timer.isRunning) return timer;

          if (timer.type === 'countdown') {
            const newRemaining = Math.max(0, timer.remaining - 1);
            if (newRemaining === 0 && timer.sound) {
              playAlertSound();
            }
            return { ...timer, remaining: newRemaining };
          } else {
            return { ...timer, remaining: timer.remaining + 1 };
          }
        })
      );
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const playAlertSound = () => {
    // Create a simple beep sound
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.value = 800;
    oscillator.type = 'sine';
    gainNode.gain.value = 0.3;
    
    oscillator.start();
    oscillator.stop(audioContext.currentTime + 0.2);
  };

  const createTimer = () => {
    const duration = newTimerData.minutes * 60 + newTimerData.seconds;
    const newTimer: Timer = {
      id: Date.now().toString(),
      name: newTimerData.name || 'Timer',
      duration,
      remaining: newTimerData.type === 'countdown' ? duration : 0,
      isRunning: false,
      type: newTimerData.type,
      category: newTimerData.category,
      sound: newTimerData.sound,
      color: getCategoryColor(newTimerData.category),
      createdAt: new Date()
    };

    setTimers([...timers, newTimer]);
    setShowNewTimerModal(false);
    setNewTimerData({
      name: '',
      minutes: 0,
      seconds: 0,
      type: 'countdown',
      category: 'custom',
      sound: true
    });
  };

  const createFromTemplate = (template: typeof templates[0]) => {
    const duration = template.minutes * 60 + template.seconds;
    const newTimer: Timer = {
      id: Date.now().toString(),
      name: template.name,
      duration,
      remaining: duration,
      isRunning: false,
      type: 'countdown',
      category: template.category as Timer['category'],
      sound: true,
      color: getCategoryColor(template.category as Timer['category']),
      createdAt: new Date()
    };

    setTimers([...timers, newTimer]);
  };

  const toggleTimer = (id: string) => {
    setTimers(timers.map(timer => 
      timer.id === id ? { ...timer, isRunning: !timer.isRunning } : timer
    ));
  };

  const resetTimer = (id: string) => {
    setTimers(timers.map(timer => 
      timer.id === id ? { 
        ...timer, 
        remaining: timer.type === 'countdown' ? timer.duration : 0,
        isRunning: false 
      } : timer
    ));
  };

  const deleteTimer = (id: string) => {
    setTimers(timers.filter(timer => timer.id !== id));
  };

  const getCategoryColor = (category: Timer['category']): string => {
    switch (category) {
      case 'combat': return '#dc2626';
      case 'session': return '#2563eb';
      case 'custom': return '#7c3aed';
      default: return '#6b7280';
    }
  };

  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return `${hours}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getTimerProgress = (timer: Timer): number => {
    if (timer.type === 'stopwatch') return 0;
    return ((timer.duration - timer.remaining) / timer.duration) * 100;
  };

  return (
    <div className={styles.timerManager}>
      <div className={styles.header}>
        <h2>Timer Manager</h2>
        <div className={styles.headerActions}>
          <Button onClick={() => setShowNewTimerModal(true)}>
            <Icon name="add" /> New Timer
          </Button>
        </div>
      </div>

      <div className={styles.templates}>
        <h3>Quick Timers</h3>
        <div className={styles.templateGrid}>
          {templates.map((template, index) => (
            <Button
              key={index}
              onClick={() => createFromTemplate(template)}
              variant="secondary"
              size="sm"
            >
              <Icon name="settings" /> {template.name}
            </Button>
          ))}
        </div>
      </div>

      <div className={styles.timersSection}>
        <h3>Active Timers</h3>
        {timers.length === 0 ? (
          <div className={styles.noTimers}>
            <Icon name="settings" size="lg" />
            <p>No active timers</p>
          </div>
        ) : (
          <div className={styles.timerGrid}>
            {timers.map(timer => (
              <div
                key={timer.id}
                className={`${styles.timerCard} ${timer.isRunning ? styles.running : ''}`}
                style={{ borderColor: timer.color }}
              >
                <div className={styles.timerHeader}>
                  <h4>{timer.name}</h4>
                  <span className={styles.timerCategory} style={{ color: timer.color }}>
                    {timer.category}
                  </span>
                </div>

                <div className={styles.timerDisplay}>
                  <div className={styles.time}>
                    {formatTime(timer.remaining)}
                  </div>
                  {timer.type === 'countdown' && (
                    <div className={styles.progressBar}>
                      <div
                        className={styles.progressFill}
                        style={{ 
                          width: `${getTimerProgress(timer)}%`,
                          backgroundColor: timer.color
                        }}
                      />
                    </div>
                  )}
                </div>

                <div className={styles.timerControls}>
                  <Button
                    onClick={() => toggleTimer(timer.id)}
                    variant={timer.isRunning ? 'secondary' : 'primary'}
                    size="sm"
                  >
                    <Icon name={timer.isRunning ? 'chevron-up' : 'chevron-right'} />
                    {timer.isRunning ? 'Pause' : 'Start'}
                  </Button>
                  <Button
                    onClick={() => resetTimer(timer.id)}
                    variant="tertiary"
                    size="sm"
                  >
                    <Icon name="redo" /> Reset
                  </Button>
                  <Button
                    onClick={() => deleteTimer(timer.id)}
                    variant="danger"
                    size="sm"
                  >
                    <Icon name="remove" />
                  </Button>
                </div>

                {timer.type === 'countdown' && timer.remaining === 0 && (
                  <div className={styles.timerComplete}>
                    Timer Complete!
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {showNewTimerModal && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <h3>New Timer</h3>
            
            <TextInput
              label="Timer Name"
              value={newTimerData.name}
              onChange={(value) => setNewTimerData({ ...newTimerData, name: value })}
              placeholder="Enter timer name..."
            />

            <div className={styles.durationInputs}>
              <TextInput
                label="Minutes"
                type="number"
                value={newTimerData.minutes.toString()}
                onChange={(value) => setNewTimerData({ 
                  ...newTimerData, 
                  minutes: parseInt(value) || 0 
                })}
              />
              <TextInput
                label="Seconds"
                type="number"
                value={newTimerData.seconds.toString()}
                onChange={(value) => setNewTimerData({ 
                  ...newTimerData, 
                  seconds: parseInt(value) || 0 
                })}
              />
            </div>

            <Select
              label="Timer Type"
              value={newTimerData.type}
              onChange={(value) => setNewTimerData({ 
                ...newTimerData, 
                type: value as 'countdown' | 'stopwatch' 
              })}
              options={[
                { value: 'countdown', label: 'Countdown' },
                { value: 'stopwatch', label: 'Stopwatch' }
              ]}
            />

            <Select
              label="Category"
              value={newTimerData.category}
              onChange={(value) => setNewTimerData({ 
                ...newTimerData, 
                category: value as Timer['category'] 
              })}
              options={[
                { value: 'combat', label: 'Combat' },
                { value: 'session', label: 'Session' },
                { value: 'custom', label: 'Custom' }
              ]}
            />

            <label className={styles.soundToggle}>
              <input
                type="checkbox"
                checked={newTimerData.sound}
                onChange={(e) => setNewTimerData({ 
                  ...newTimerData, 
                  sound: e.target.checked 
                })}
              />
              Play sound when timer completes
            </label>

            <div className={styles.modalActions}>
              <Button 
                onClick={() => setShowNewTimerModal(false)} 
                variant="secondary"
              >
                Cancel
              </Button>
              <Button 
                onClick={createTimer}
                disabled={!newTimerData.name || (newTimerData.minutes === 0 && newTimerData.seconds === 0)}
              >
                Create Timer
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};