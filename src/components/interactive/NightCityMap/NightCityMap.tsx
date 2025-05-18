import React, { useState, useRef, useEffect, useCallback } from 'react';
import { MapRegion, MapLayer, Note } from '../../../types/map';
import { nightCityRegions, nightCityGangs } from '../../../data/nightCityData';
import styles from './NightCityMap.module.css';
import { Button } from '../../utility/Form/Button';
import { Icon } from '../../utility/Icon';
import { TextInput } from '../../utility/Form/TextInput';
import { TextArea } from '../../utility/Form/TextArea';
import { Select } from '../../utility/Form/Select';
import { Checkbox } from '../../utility/Form/Checkbox';

export const NightCityMap: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [mapState, setMapState] = useState({
    zoom: 1,
    center: { x: 400, y: 350 },
    selectedRegion: null as string | null,
    isDragging: false,
    dragStart: { x: 0, y: 0 }
  });

  const [layers, setLayers] = useState<MapLayer[]>([
    { id: 'base', name: 'Base Map', visible: true, type: 'base', data: null },
    { id: 'districts', name: 'Districts', visible: true, type: 'districts', data: null },
    { id: 'gangs', name: 'Gang Territories', visible: true, type: 'gangs', data: null },
    { id: 'landmarks', name: 'Landmarks', visible: true, type: 'landmarks', data: null },
    { id: 'notes', name: 'Notes', visible: true, type: 'notes', data: null }
  ]);

  const [selectedRegion, setSelectedRegion] = useState<MapRegion | null>(null);
  const [showRegionDetails, setShowRegionDetails] = useState(false);
  const [showAddNote, setShowAddNote] = useState(false);
  const [notes, setNotes] = useState<Note[]>([]);
  const [filterTags, setFilterTags] = useState<string[]>([]);

  const [newNote, setNewNote] = useState({
    title: '',
    content: '',
    author: 'GM',
    visibility: 'gm' as const,
    tags: [] as string[]
  });

  // Draw map on canvas
  const drawMap = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Set up transform for zoom and pan
    ctx.save();
    ctx.scale(mapState.zoom, mapState.zoom);
    ctx.translate(-mapState.center.x + canvas.width / (2 * mapState.zoom), 
                  -mapState.center.y + canvas.height / (2 * mapState.zoom));

    // Draw base map (simple grid for now)
    if (layers.find(l => l.id === 'base')?.visible) {
      ctx.strokeStyle = '#2a2a2a';
      ctx.lineWidth = 1;
      for (let x = 0; x < 800; x += 50) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, 700);
        ctx.stroke();
      }
      for (let y = 0; y < 700; y += 50) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(800, y);
        ctx.stroke();
      }
    }

    // Draw districts
    if (layers.find(l => l.id === 'districts')?.visible) {
      nightCityRegions.forEach(region => {
        if (region.type === 'district') {
          // Draw district boundary
          ctx.strokeStyle = '#00ff00';
          ctx.lineWidth = 2;
          ctx.strokeRect(
            region.coordinates.x,
            region.coordinates.y,
            region.coordinates.width,
            region.coordinates.height
          );

          // Draw district name
          ctx.fillStyle = '#00ff00';
          ctx.font = '16px Arial';
          ctx.textAlign = 'center';
          ctx.fillText(
            region.name,
            region.coordinates.x + region.coordinates.width / 2,
            region.coordinates.y + 20
          );
        }
      });
    }

    // Draw neighborhoods
    nightCityRegions.forEach(region => {
      if (region.type === 'neighborhood') {
        // Draw neighborhood
        ctx.strokeStyle = region.id === mapState.selectedRegion ? '#ffff00' : '#00ffff';
        ctx.lineWidth = region.id === mapState.selectedRegion ? 3 : 1;
        ctx.strokeRect(
          region.coordinates.x,
          region.coordinates.y,
          region.coordinates.width,
          region.coordinates.height
        );

        // Draw neighborhood name
        ctx.fillStyle = '#00ffff';
        ctx.font = '12px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(
          region.name,
          region.coordinates.x + region.coordinates.width / 2,
          region.coordinates.y + region.coordinates.height / 2
        );
      }
    });

    // Draw gang territories
    if (layers.find(l => l.id === 'gangs')?.visible) {
      nightCityRegions.forEach(region => {
        if (region.gangTerritory) {
          const gang = nightCityGangs.find(g => g.name === region.gangTerritory!.gangName);
          if (gang) {
            ctx.fillStyle = gang.color + '40'; // Add transparency
            ctx.fillRect(
              region.coordinates.x,
              region.coordinates.y,
              region.coordinates.width,
              region.coordinates.height
            );

            // Draw gang name
            ctx.fillStyle = gang.color;
            ctx.font = '10px Arial';
            ctx.textAlign = 'center';
            ctx.fillText(
              gang.name,
              region.coordinates.x + region.coordinates.width / 2,
              region.coordinates.y + region.coordinates.height - 10
            );
          }
        }
      });
    }

    // Draw landmarks
    if (layers.find(l => l.id === 'landmarks')?.visible) {
      nightCityRegions.forEach(region => {
        if (region.landmarks) {
          region.landmarks.forEach(landmark => {
            const x = region.coordinates.x + region.coordinates.width / 2;
            const y = region.coordinates.y + region.coordinates.height / 2;

            // Draw landmark marker
            ctx.fillStyle = landmark.importance === 'major' ? '#ff0000' : '#ffff00';
            ctx.beginPath();
            ctx.arc(x, y, landmark.importance === 'major' ? 5 : 3, 0, Math.PI * 2);
            ctx.fill();

            // Draw landmark name
            ctx.fillStyle = '#ffffff';
            ctx.font = '10px Arial';
            ctx.textAlign = 'center';
            ctx.fillText(landmark.name, x, y - 10);
          });
        }
      });
    }

    ctx.restore();
  }, [mapState, layers]);

  useEffect(() => {
    drawMap();
  }, [drawMap]);

  // Mouse event handlers
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = canvasRef.current!.getBoundingClientRect();
    const x = (e.clientX - rect.left) / mapState.zoom + mapState.center.x - rect.width / (2 * mapState.zoom);
    const y = (e.clientY - rect.top) / mapState.zoom + mapState.center.y - rect.height / (2 * mapState.zoom);

    // Check if clicked on a region
    const clickedRegion = nightCityRegions.find(region => {
      return x >= region.coordinates.x &&
             x <= region.coordinates.x + region.coordinates.width &&
             y >= region.coordinates.y &&
             y <= region.coordinates.y + region.coordinates.height;
    });

    if (clickedRegion) {
      setSelectedRegion(clickedRegion);
      setMapState({ ...mapState, selectedRegion: clickedRegion.id });
      setShowRegionDetails(true);
    } else {
      setMapState({
        ...mapState,
        isDragging: true,
        dragStart: { x: e.clientX, y: e.clientY }
      });
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (mapState.isDragging) {
      const dx = e.clientX - mapState.dragStart.x;
      const dy = e.clientY - mapState.dragStart.y;
      
      setMapState({
        ...mapState,
        center: {
          x: mapState.center.x - dx / mapState.zoom,
          y: mapState.center.y - dy / mapState.zoom
        },
        dragStart: { x: e.clientX, y: e.clientY }
      });
    }
  };

  const handleMouseUp = () => {
    setMapState({ ...mapState, isDragging: false });
  };

  const handleWheel = (e: React.WheelEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    const newZoom = Math.min(Math.max(mapState.zoom * delta, 0.5), 3);
    setMapState({ ...mapState, zoom: newZoom });
  };

  const toggleLayer = (layerId: string) => {
    setLayers(layers.map(layer => 
      layer.id === layerId ? { ...layer, visible: !layer.visible } : layer
    ));
  };

  const addNote = () => {
    const note: Note = {
      id: Date.now().toString(),
      title: newNote.title,
      content: newNote.content,
      author: newNote.author,
      timestamp: new Date(),
      visibility: newNote.visibility,
      tags: newNote.tags,
      linkedRegions: selectedRegion ? [selectedRegion.id] : []
    };

    setNotes([...notes, note]);
    setShowAddNote(false);
    setNewNote({
      title: '',
      content: '',
      author: 'GM',
      visibility: 'gm',
      tags: []
    });
  };

  const getRegionNotes = (regionId: string) => {
    return notes.filter(note => 
      note.linkedRegions?.includes(regionId) &&
      (note.visibility === 'public' || note.visibility === 'gm')
    );
  };

  return (
    <div className={styles.mapContainer}>
      <div className={styles.mapControls}>
        <div className={styles.zoomControls}>
          <Button onClick={() => setMapState({ ...mapState, zoom: mapState.zoom * 1.2 })}>
            <Icon name="add" /> Zoom In
          </Button>
          <Button onClick={() => setMapState({ ...mapState, zoom: mapState.zoom * 0.8 })}>
            <Icon name="remove" /> Zoom Out
          </Button>
          <Button onClick={() => setMapState({ ...mapState, zoom: 1, center: { x: 400, y: 350 } })}>
            <Icon name="redo" /> Reset View
          </Button>
        </div>

        <div className={styles.layers}>
          <h3>Map Layers</h3>
          {layers.map(layer => (
            <Checkbox
              key={layer.id}
              label={layer.name}
              checked={layer.visible}
              onChange={() => toggleLayer(layer.id)}
            />
          ))}
        </div>

        <div className={styles.filters}>
          <h3>Filter by Tag</h3>
          <Select
            multiple
            value={filterTags}
            onChange={(value) => setFilterTags(Array.isArray(value) ? value : [value])}
          >
            <option value="corporate">Corporate</option>
            <option value="gang-activity">Gang Activity</option>
            <option value="dangerous">Dangerous</option>
            <option value="residential">Residential</option>
            <option value="industrial">Industrial</option>
            <option value="entertainment">Entertainment</option>
          </Select>
        </div>
      </div>

      <div className={styles.mapArea}>
        <canvas
          ref={canvasRef}
          width={800}
          height={600}
          className={styles.mapCanvas}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onWheel={handleWheel}
        />
      </div>

      {showRegionDetails && selectedRegion && (
        <div className={styles.regionDetails}>
          <div className={styles.detailsHeader}>
            <h3>{selectedRegion.name}</h3>
            <Button onClick={() => setShowRegionDetails(false)} variant="tertiary">
              <Icon name="close" />
            </Button>
          </div>

          <div className={styles.detailsContent}>
            <p className={styles.regionType}>{selectedRegion.type}</p>
            <p>{selectedRegion.description}</p>

            {selectedRegion.dangerLevel && (
              <div className={styles.dangerLevel}>
                <span>Danger Level:</span>
                <div className={styles.dangerIndicator}>
                  {[...Array(5)].map((_, i) => (
                    <span
                      key={i}
                      className={`${styles.dangerDot} ${i < selectedRegion.dangerLevel! ? styles.active : ''}`}
                    />
                  ))}
                </div>
              </div>
            )}

            {selectedRegion.gangTerritory && (
              <div className={styles.gangInfo}>
                <h4>Gang Territory</h4>
                <p><strong>{selectedRegion.gangTerritory.gangName}</strong></p>
                <p>Control: {selectedRegion.gangTerritory.influence}</p>
                {selectedRegion.gangTerritory.description && (
                  <p>{selectedRegion.gangTerritory.description}</p>
                )}
              </div>
            )}

            {selectedRegion.landmarks && selectedRegion.landmarks.length > 0 && (
              <div className={styles.landmarks}>
                <h4>Landmarks</h4>
                <ul>
                  {selectedRegion.landmarks.map(landmark => (
                    <li key={landmark.id}>
                      <strong>{landmark.name}</strong> ({landmark.type})
                      <p>{landmark.description}</p>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className={styles.notesSection}>
              <h4>Notes</h4>
              {getRegionNotes(selectedRegion.id).map(note => (
                <div key={note.id} className={styles.note}>
                  <h5>{note.title}</h5>
                  <p>{note.content}</p>
                  <div className={styles.noteMeta}>
                    <span>By {note.author}</span>
                    <span>{new Date(note.timestamp).toLocaleDateString()}</span>
                  </div>
                </div>
              ))}
              <Button onClick={() => setShowAddNote(true)}>
                <Icon name="add" /> Add Note
              </Button>
            </div>

            {selectedRegion.tags && (
              <div className={styles.tags}>
                {selectedRegion.tags.map(tag => (
                  <span key={tag} className={styles.tag}>{tag}</span>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {showAddNote && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <h3>Add Note</h3>
            <TextInput
              label="Title"
              value={newNote.title}
              onChange={(value) => setNewNote({ ...newNote, title: value })}
              required
            />
            <TextArea
              label="Content"
              value={newNote.content}
              onChange={(value) => setNewNote({ ...newNote, content: value })}
              rows={5}
              required
            />
            <Select
              label="Visibility"
              value={newNote.visibility}
              onChange={(value) => setNewNote({ ...newNote, visibility: value as any })}
            >
              <option value="gm">GM Only</option>
              <option value="player">Players</option>
              <option value="public">Public</option>
            </Select>
            <div className={styles.modalActions}>
              <Button onClick={() => setShowAddNote(false)} variant="secondary">
                Cancel
              </Button>
              <Button onClick={addNote} disabled={!newNote.title || !newNote.content}>
                Add Note
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};