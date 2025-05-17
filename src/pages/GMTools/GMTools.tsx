import { useState } from 'react';
import { InitiativeTracker } from '../../components/gm-tools/InitiativeTracker';
import { EncounterBuilder } from '../../components/gm-tools/EncounterBuilder';
import { TimerManager } from '../../components/gm-tools/TimerManager';
import { Typography } from '../../components/utility/Typography/Typography';
import { Button } from '../../components/utility/Form/Button';
import { Icon } from '../../components/utility/Icon';
import styles from './GMTools.module.css';
import clsx from 'clsx';

type GMTool = 'initiative' | 'encounter' | 'timer' | 'session';

export function GMTools() {
  const [activeTool, setActiveTool] = useState<GMTool>('initiative');

  const tools = [
    { id: 'initiative' as GMTool, name: 'Initiative Tracker', icon: 'list-ordered', available: true },
    { id: 'encounter' as GMTool, name: 'Encounter Builder', icon: 'sword', available: true },
    { id: 'timer' as GMTool, name: 'Timer Manager', icon: 'clock', available: true },
    { id: 'session' as GMTool, name: 'Session Notes', icon: 'book-open', available: false }
  ];

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Typography variant="h1">GM Tools</Typography>
        <Typography variant="body1">Essential tools for managing your Cyberpunk Red sessions</Typography>
      </div>

      <div className={styles.toolSelector}>
        {tools.map(tool => (
          <Button
            key={tool.id}
            variant={activeTool === tool.id ? 'primary' : 'ghost'}
            className={clsx(styles.toolButton, !tool.available && styles.disabled)}
            onClick={() => tool.available && setActiveTool(tool.id)}
            disabled={!tool.available}
            startIcon={<Icon name={tool.icon as any} />}
          >
            {tool.name}
            {!tool.available && <span className={styles.comingSoon}>Coming Soon</span>}
          </Button>
        ))}
      </div>

      <div className={styles.toolContent}>
        {activeTool === 'initiative' && <InitiativeTracker />}
        {activeTool === 'encounter' && <EncounterBuilder />}
        {activeTool === 'timer' && <TimerManager />}
        {activeTool === 'session' && (
          <div className={styles.placeholder}>
            <Icon name="book-open" size="xl" />
            <Typography variant="h3">Session Notes</Typography>
            <Typography variant="body1">Keep notes and track session progress</Typography>
            <Typography variant="body2">Coming Soon</Typography>
          </div>
        )}
      </div>
    </div>
  );
}