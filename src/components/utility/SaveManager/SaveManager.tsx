import { useState, useRef, useEffect } from 'react';
import { saveLoadService, SaveSlot } from '../../../services/saveLoadService';
import { Button } from '../Form/Button';
import { TextInput } from '../Form/TextInput';
import { Icon } from '../Icon';
import { Typography } from '../Typography/Typography';
import { useStore } from '../../../store/useStore';
import { useNotification } from '../../../hooks/useNotification';
import styles from './SaveManager.module.css';
import clsx from 'clsx';

export function SaveManager() {
  const [isOpen, setIsOpen] = useState(false);
  const [saveSlots, setSaveSlots] = useState<SaveSlot[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<number | null>(null);
  const [saveName, setSaveName] = useState('');
  const [saveDescription, setSaveDescription] = useState('');
  const [showConfirmDelete, setShowConfirmDelete] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { showSuccess, showError } = useNotification();
  const { preferences } = useStore();

  // Load save slots on mount and when isOpen changes
  useEffect(() => {
    if (isOpen) {
      loadSaveSlots();
    }
  }, [isOpen]);

  // Auto-save functionality
  useEffect(() => {
    if (preferences.autoSave) {
      const autoSaveInterval = setInterval(() => {
        handleAutoSave();
      }, 60000); // Auto-save every minute

      return () => clearInterval(autoSaveInterval);
    }
  }, [preferences.autoSave]);

  const loadSaveSlots = () => {
    const slots = saveLoadService.getSaveSlots();
    setSaveSlots(slots);
  };

  const handleSave = (slotNumber?: number) => {
    const slot = slotNumber || selectedSlot;
    if (!slot || !saveName.trim()) {
      showError('Please provide a save name');
      return;
    }

    const savedSlot = saveLoadService.saveToSlot(slot, saveName, saveDescription);
    if (savedSlot) {
      showSuccess(`Game saved to slot ${slot}`);
      loadSaveSlots();
      setSaveName('');
      setSaveDescription('');
      setSelectedSlot(null);
    } else {
      showError('Failed to save game');
    }
  };

  const handleLoad = (slotNumber: number) => {
    const loadedFile = saveLoadService.loadFromSlot(slotNumber);
    if (loadedFile) {
      showSuccess('Game loaded successfully');
      setIsOpen(false);
    } else {
      showError('Failed to load save file');
    }
  };

  const handleDelete = (slotNumber: number) => {
    if (saveLoadService.deleteSaveSlot(slotNumber)) {
      showSuccess('Save deleted');
      loadSaveSlots();
      setShowConfirmDelete(null);
    } else {
      showError('Failed to delete save');
    }
  };

  const handleAutoSave = () => {
    const savedSlot = saveLoadService.autoSave();
    if (savedSlot) {
      console.log('Auto-saved successfully');
    }
  };

  const handleExport = (slotNumber?: number) => {
    saveLoadService.exportSave(slotNumber);
    showSuccess('Save exported to file');
  };

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const importedSlot = await saveLoadService.importSave(file);
    if (importedSlot) {
      showSuccess('Save imported successfully');
      loadSaveSlots();
    } else {
      showError('Failed to import save file');
    }
  };

  const handleLoadAutoSave = () => {
    const loadedFile = saveLoadService.loadAutoSave();
    if (loadedFile) {
      showSuccess('Auto-save loaded successfully');
      setIsOpen(false);
    } else {
      showError('No auto-save found');
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const formatDate = (date: Date): string => {
    return new Date(date).toLocaleString();
  };

  // Calculate current state size
  const currentSaveSize = saveLoadService.getSaveSize();

  return (
    <>
      <Button
        variant="tertiary"
        size="sm"
        onClick={() => setIsOpen(true)}
        startIcon={<Icon name="save" />}
      >
        Save/Load
      </Button>

      {isOpen && (
        <div className={styles.overlay} onClick={() => setIsOpen(false)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.header}>
              <Typography variant="h2">Save/Load Game</Typography>
              <button
                className={styles.closeButton}
                onClick={() => setIsOpen(false)}
                aria-label="Close save manager"
              >
                <Icon name="close" />
              </button>
            </div>

            <div className={styles.content}>
              <div className={styles.currentState}>
                <Typography variant="h3">Current Game State</Typography>
                <div className={styles.stateInfo}>
                  <span>Size: {formatFileSize(currentSaveSize)}</span>
                  <div className={styles.actions}>
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => handleExport()}
                      startIcon={<Icon name="download" />}
                    >
                      Export Current
                    </Button>
                  </div>
                </div>
              </div>

              <div className={styles.saveSlots}>
                <Typography variant="h3">Save Slots</Typography>
                
                <div className={styles.slotsList}>
                  {saveSlots.length === 0 ? (
                    <div className={styles.emptyState}>
                      <Icon name="save" size="xl" />
                      <Typography variant="body1">No saved games</Typography>
                    </div>
                  ) : (
                    saveSlots.map((slot) => (
                      <div
                        key={slot.id}
                        className={clsx(
                          styles.saveSlot,
                          selectedSlot === slot.slotNumber && styles.selected,
                          slot.isAutoSave && styles.autoSave
                        )}
                      >
                        <div className={styles.slotInfo}>
                          <Typography variant="h4">
                            {slot.isAutoSave ? 'Auto-save' : `Slot ${slot.slotNumber}`}: {slot.metadata.name}
                          </Typography>
                          {slot.metadata.description && (
                            <Typography variant="body2" className={styles.description}>
                              {slot.metadata.description}
                            </Typography>
                          )}
                          <Typography variant="caption" className={styles.timestamp}>
                            {formatDate(slot.metadata.lastModified)}
                          </Typography>
                        </div>
                        
                        <div className={styles.slotActions}>
                          <Button
                            variant="tertiary"
                            size="sm"
                            onClick={() => handleLoad(slot.slotNumber || 0)}
                            startIcon={<Icon name="upload" />}
                          >
                            Load
                          </Button>
                          {!slot.isAutoSave && (
                            <>
                              <Button
                                variant="tertiary"
                                size="sm"
                                onClick={() => setSelectedSlot(slot.slotNumber || null)}
                                startIcon={<Icon name="edit" />}
                              >
                                Overwrite
                              </Button>
                              <Button
                                variant="tertiary"
                                size="sm"
                                onClick={() => handleExport(slot.slotNumber)}
                                startIcon={<Icon name="download" />}
                              >
                                Export
                              </Button>
                              {showConfirmDelete === slot.slotNumber ? (
                                <>
                                  <Button
                                    variant="danger"
                                    size="sm"
                                    onClick={() => handleDelete(slot.slotNumber || 0)}
                                  >
                                    Confirm
                                  </Button>
                                  <Button
                                    variant="tertiary"
                                    size="sm"
                                    onClick={() => setShowConfirmDelete(null)}
                                  >
                                    Cancel
                                  </Button>
                                </>
                              ) : (
                                <Button
                                  variant="tertiary"
                                  size="sm"
                                  onClick={() => setShowConfirmDelete(slot.slotNumber || null)}
                                  startIcon={<Icon name="remove" />}
                                >
                                  Delete
                                </Button>
                              )}
                            </>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              <div className={styles.newSave}>
                <Typography variant="h3">New Save</Typography>
                <div className={styles.saveForm}>
                  <TextInput
                    label="Save Name"
                    value={saveName}
                    onChange={(value) => setSaveName(value)}
                    placeholder="My Campaign"
                  />
                  <TextInput
                    label="Description (optional)"
                    value={saveDescription}
                    onChange={(value) => setSaveDescription(value)}
                    placeholder="After defeating the cyber gang..."
                  />
                  <div className={styles.slotSelector}>
                    <Typography variant="body2">Select slot:</Typography>
                    <div className={styles.slots}>
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(slot => {
                        const existingSlot = saveSlots.find(s => s.slotNumber === slot);
                        return (
                          <button
                            key={slot}
                            className={clsx(
                              styles.slotButton,
                              selectedSlot === slot && styles.selected,
                              existingSlot && styles.occupied
                            )}
                            onClick={() => setSelectedSlot(slot)}
                          >
                            {slot}
                            {existingSlot && <Icon name="check" size="xs" />}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                  <Button
                    variant="primary"
                    onClick={() => handleSave()}
                    disabled={!selectedSlot || !saveName.trim()}
                    fullWidth
                    startIcon={<Icon name="save" />}
                  >
                    Save Game
                  </Button>
                </div>
              </div>

              <div className={styles.importExport}>
                <Typography variant="h3">Import/Export</Typography>
                <div className={styles.importActions}>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".json"
                    onChange={handleImport}
                    style={{ display: 'none' }}
                  />
                  <Button
                    variant="secondary"
                    onClick={() => fileInputRef.current?.click()}
                    startIcon={<Icon name="upload" />}
                    fullWidth
                  >
                    Import Save File
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={handleLoadAutoSave}
                    startIcon={<Icon name="redo" />}
                    fullWidth
                  >
                    Load Auto-save
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}