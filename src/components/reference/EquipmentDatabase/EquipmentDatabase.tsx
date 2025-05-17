import React, { useState, useMemo } from 'react';
import { 
  Equipment, 
  EquipmentCategory, 
  EquipmentFilter,
  Weapon,
  Armor,
  Cyberware,
  Gear,
  Fashion,
  Drug,
  Service,
  Vehicle
} from '../../../types/equipment';
import { allEquipment } from '../../../data/equipmentData';
import styles from './EquipmentDatabase.module.css';
import { Button } from '../../utility/Form/Button';
import { Icon } from '../../utility/Icon';
import { TextInput } from '../../utility/Form/TextInput';
import { Select } from '../../utility/Form/Select';
import { Checkbox } from '../../utility/Form/Checkbox';

export const EquipmentDatabase: React.FC = () => {
  const [filters, setFilters] = useState<EquipmentFilter>({
    categories: [],
    search: ''
  });
  const [selectedItem, setSelectedItem] = useState<Equipment | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<'name' | 'cost' | 'category'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const categories: EquipmentCategory[] = [
    'weapons', 'armor', 'cyberware', 'gear', 
    'fashion', 'drugs', 'services', 'vehicles'
  ];

  const filteredEquipment = useMemo(() => {
    let filtered = [...allEquipment];

    // Category filter
    if (filters.categories && filters.categories.length > 0) {
      filtered = filtered.filter(item => 
        filters.categories!.includes(item.category)
      );
    }

    // Search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(item =>
        item.name.toLowerCase().includes(searchLower) ||
        item.description.toLowerCase().includes(searchLower) ||
        item.tags?.some(tag => tag.toLowerCase().includes(searchLower))
      );
    }

    // Cost filter
    if (filters.minCost !== undefined) {
      filtered = filtered.filter(item => item.cost >= filters.minCost!);
    }
    if (filters.maxCost !== undefined) {
      filtered = filtered.filter(item => item.cost <= filters.maxCost!);
    }

    // Availability filter
    if (filters.availability && filters.availability.length > 0) {
      filtered = filtered.filter(item =>
        filters.availability!.includes(item.availability)
      );
    }

    // Sorting
    filtered.sort((a, b) => {
      let comparison = 0;
      switch (sortBy) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'cost':
          comparison = a.cost - b.cost;
          break;
        case 'category':
          comparison = a.category.localeCompare(b.category);
          break;
      }
      return sortOrder === 'asc' ? comparison : -comparison;
    });

    return filtered;
  }, [filters, sortBy, sortOrder]);

  const handleCategoryToggle = (category: EquipmentCategory) => {
    const current = filters.categories || [];
    if (current.includes(category)) {
      setFilters({
        ...filters,
        categories: current.filter(c => c !== category)
      });
    } else {
      setFilters({
        ...filters,
        categories: [...current, category]
      });
    }
  };

  const renderItemDetails = (item: Equipment) => {
    switch (item.category) {
      case 'weapons':
        const weapon = item as Weapon;
        return (
          <>
            <div className={styles.detailRow}>
              <span>Type:</span>
              <span>{weapon.type}</span>
            </div>
            <div className={styles.detailRow}>
              <span>Damage:</span>
              <span>{weapon.damage}</span>
            </div>
            <div className={styles.detailRow}>
              <span>Range:</span>
              <span>{weapon.range}</span>
            </div>
            <div className={styles.detailRow}>
              <span>ROF:</span>
              <span>{weapon.rof}</span>
            </div>
            <div className={styles.detailRow}>
              <span>Hands:</span>
              <span>{weapon.hands}</span>
            </div>
            {weapon.magazine && (
              <div className={styles.detailRow}>
                <span>Magazine:</span>
                <span>{weapon.magazine}</span>
              </div>
            )}
            <div className={styles.detailRow}>
              <span>Concealability:</span>
              <span>{weapon.concealability}</span>
            </div>
            {weapon.attachments && (
              <div className={styles.detailSection}>
                <h4>Attachments</h4>
                <ul>
                  {weapon.attachments.map((att, index) => (
                    <li key={index}>{att}</li>
                  ))}
                </ul>
              </div>
            )}
          </>
        );
      
      case 'armor':
        const armor = item as Armor;
        return (
          <>
            <div className={styles.detailRow}>
              <span>Type:</span>
              <span>{armor.type}</span>
            </div>
            <div className={styles.detailRow}>
              <span>Stopping Power:</span>
              <span>{armor.stoppingPower}</span>
            </div>
            <div className={styles.detailRow}>
              <span>Armor Penalty:</span>
              <span>{armor.armorPenalty}</span>
            </div>
            <div className={styles.detailRow}>
              <span>Locations:</span>
              <span>{armor.locations.join(', ')}</span>
            </div>
          </>
        );

      case 'cyberware':
        const cyber = item as Cyberware;
        return (
          <>
            <div className={styles.detailRow}>
              <span>Type:</span>
              <span>{cyber.type}</span>
            </div>
            <div className={styles.detailRow}>
              <span>Humanity Loss:</span>
              <span>{cyber.humanityLoss}</span>
            </div>
            <div className={styles.detailRow}>
              <span>Surgery:</span>
              <span>{cyber.surgery}</span>
            </div>
            <div className={styles.detailRow}>
              <span>Location:</span>
              <span>{cyber.location}</span>
            </div>
            {cyber.options && (
              <div className={styles.detailSection}>
                <h4>Options</h4>
                <ul>
                  {cyber.options.map((option, index) => (
                    <li key={index}>
                      <strong>{option.name}</strong> - {option.cost}eb (HL: {option.humanityLoss})
                      <br />
                      {option.description}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </>
        );

      case 'vehicles':
        const vehicle = item as Vehicle;
        return (
          <>
            <div className={styles.detailRow}>
              <span>Type:</span>
              <span>{vehicle.type}</span>
            </div>
            <div className={styles.detailRow}>
              <span>Speed:</span>
              <span>{vehicle.speed} mph</span>
            </div>
            <div className={styles.detailRow}>
              <span>Handling:</span>
              <span>{vehicle.handling}</span>
            </div>
            <div className={styles.detailRow}>
              <span>Armor:</span>
              <span>{vehicle.armor}</span>
            </div>
            <div className={styles.detailRow}>
              <span>Seats:</span>
              <span>{vehicle.seats}</span>
            </div>
            {vehicle.specialSystems && (
              <div className={styles.detailSection}>
                <h4>Special Systems</h4>
                <ul>
                  {vehicle.specialSystems.map((system, index) => (
                    <li key={index}>{system}</li>
                  ))}
                </ul>
              </div>
            )}
          </>
        );

      default:
        return null;
    }
  };

  const renderItemCard = (item: Equipment) => (
    <div
      key={item.id}
      className={`${styles.itemCard} ${selectedItem?.id === item.id ? styles.selected : ''}`}
      onClick={() => setSelectedItem(item)}
    >
      <div className={styles.itemHeader}>
        <h4>{item.name}</h4>
        <span className={styles.itemCost}>{item.cost}eb</span>
      </div>
      <div className={styles.itemMeta}>
        <span className={`${styles.category} ${styles[item.category]}`}>
          {item.category}
        </span>
        <span className={styles.availability}>Avail: {item.availability}</span>
      </div>
      <p className={styles.itemDescription}>{item.description}</p>
    </div>
  );

  const renderItemRow = (item: Equipment) => (
    <tr
      key={item.id}
      className={selectedItem?.id === item.id ? styles.selected : ''}
      onClick={() => setSelectedItem(item)}
    >
      <td>{item.name}</td>
      <td className={styles.categoryCell}>
        <span className={`${styles.category} ${styles[item.category]}`}>
          {item.category}
        </span>
      </td>
      <td>{item.cost}eb</td>
      <td>{item.availability}</td>
      <td className={styles.descriptionCell}>{item.description}</td>
    </tr>
  );

  return (
    <div className={styles.equipmentDatabase}>
      <div className={styles.sidebar}>
        <div className={styles.filters}>
          <h3>Filters</h3>
          
          <div className={styles.searchSection}>
            <TextInput
              placeholder="Search equipment..."
              value={filters.search || ''}
              onChange={(value) => setFilters({ ...filters, search: value })}
              className={styles.searchInput}
            />
          </div>

          <div className={styles.filterSection}>
            <h4>Categories</h4>
            {categories.map(category => (
              <Checkbox
                key={category}
                label={category.charAt(0).toUpperCase() + category.slice(1)}
                checked={filters.categories?.includes(category) || false}
                onChange={() => handleCategoryToggle(category)}
              />
            ))}
          </div>

          <div className={styles.filterSection}>
            <h4>Cost Range</h4>
            <div className={styles.costInputs}>
              <TextInput
                type="number"
                placeholder="Min"
                value={filters.minCost || ''}
                onChange={(value) => setFilters({ 
                  ...filters, 
                  minCost: value ? parseInt(value) : undefined 
                })}
              />
              <span>-</span>
              <TextInput
                type="number"
                placeholder="Max"
                value={filters.maxCost || ''}
                onChange={(value) => setFilters({ 
                  ...filters, 
                  maxCost: value ? parseInt(value) : undefined 
                })}
              />
            </div>
          </div>

          <div className={styles.filterSection}>
            <h4>Availability</h4>
            {['E', 'C', 'P', 'V', 'L'].map(avail => (
              <Checkbox
                key={avail}
                label={avail}
                checked={filters.availability?.includes(avail) || false}
                onChange={(checked) => {
                  const current = filters.availability || [];
                  setFilters({
                    ...filters,
                    availability: checked
                      ? [...current, avail]
                      : current.filter(a => a !== avail)
                  });
                }}
              />
            ))}
          </div>

          <Button
            onClick={() => setFilters({})}
            variant="secondary"
            fullWidth
          >
            Clear Filters
          </Button>
        </div>
      </div>

      <div className={styles.mainContent}>
        <div className={styles.toolbar}>
          <div className={styles.viewControls}>
            <Button
              onClick={() => setViewMode('grid')}
              variant={viewMode === 'grid' ? 'primary' : 'ghost'}
              size="sm"
            >
              <Icon name="grid" /> Grid
            </Button>
            <Button
              onClick={() => setViewMode('list')}
              variant={viewMode === 'list' ? 'primary' : 'ghost'}
              size="sm"
            >
              <Icon name="list" /> List
            </Button>
          </div>

          <div className={styles.sortControls}>
            <Select
              value={sortBy}
              onChange={(value) => setSortBy(value as any)}
              className={styles.sortSelect}
            >
              <option value="name">Name</option>
              <option value="cost">Cost</option>
              <option value="category">Category</option>
            </Select>
            <Button
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              size="sm"
            >
              <Icon name={sortOrder === 'asc' ? 'sort-asc' : 'sort-desc'} />
            </Button>
          </div>

          <div className={styles.resultCount}>
            {filteredEquipment.length} items
          </div>
        </div>

        <div className={styles.contentArea}>
          {viewMode === 'grid' ? (
            <div className={styles.itemGrid}>
              {filteredEquipment.map(renderItemCard)}
            </div>
          ) : (
            <div className={styles.itemList}>
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Category</th>
                    <th>Cost</th>
                    <th>Availability</th>
                    <th>Description</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredEquipment.map(renderItemRow)}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {selectedItem && (
        <div className={styles.detailPanel}>
          <div className={styles.detailHeader}>
            <h3>{selectedItem.name}</h3>
            <Button
              onClick={() => setSelectedItem(null)}
              variant="tertiary"
              size="sm"
            >
              <Icon name="close" />
            </Button>
          </div>

          <div className={styles.detailContent}>
            <div className={styles.detailBasics}>
              <div className={styles.detailRow}>
                <span>Cost:</span>
                <span>{selectedItem.cost}eb</span>
              </div>
              <div className={styles.detailRow}>
                <span>Availability:</span>
                <span>{selectedItem.availability}</span>
              </div>
              {selectedItem.weight && (
                <div className={styles.detailRow}>
                  <span>Weight:</span>
                  <span>{selectedItem.weight}kg</span>
                </div>
              )}
            </div>

            <div className={styles.detailDescription}>
              <h4>Description</h4>
              <p>{selectedItem.description}</p>
            </div>

            {renderItemDetails(selectedItem)}

            {selectedItem.tags && (
              <div className={styles.detailTags}>
                <h4>Tags</h4>
                <div className={styles.tagList}>
                  {selectedItem.tags.map((tag, index) => (
                    <span key={index} className={styles.tag}>
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};