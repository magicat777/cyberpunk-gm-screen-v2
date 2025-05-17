export interface Equipment {
  id: string;
  name: string;
  category: EquipmentCategory;
  type: string;
  cost: number;
  weight?: number;
  availability: 'E' | 'C' | 'P' | 'V' | 'L';
  description: string;
  tags?: string[];
  source?: string;
  page?: number;
}

export type EquipmentCategory = 
  | 'weapons'
  | 'armor'
  | 'cyberware'
  | 'gear'
  | 'fashion'
  | 'drugs'
  | 'services'
  | 'vehicles';

export interface Weapon extends Equipment {
  category: 'weapons';
  type: WeaponType;
  damage: string;
  range: string;
  rof: number;
  hands: 1 | 2;
  magazine?: number;
  concealability: 'P' | 'J' | 'L' | 'N';
  attachments?: string[];
  specialRules?: string[];
}

export type WeaponType = 
  | 'melee'
  | 'pistol'
  | 'smg'
  | 'rifle'
  | 'shotgun'
  | 'heavy'
  | 'exotic'
  | 'thrown';

export interface Armor extends Equipment {
  category: 'armor';
  type: ArmorType;
  stoppingPower: number;
  armorPenalty: number;
  locations: ArmorLocation[];
  specialRules?: string[];
}

export type ArmorType = 
  | 'clothing'
  | 'leathers'
  | 'kevlar'
  | 'flak'
  | 'metalgear'
  | 'bodyweight';

export type ArmorLocation = 
  | 'head'
  | 'body'
  | 'arms'
  | 'legs'
  | 'shield';

export interface Cyberware extends Equipment {
  category: 'cyberware';
  type: CyberwareType;
  humanityLoss: string;
  surgery: 'M' | 'MA' | 'CR' | 'N';
  location: string;
  options?: CyberwareOption[];
  requirements?: string[];
}

export type CyberwareType = 
  | 'neuralware'
  | 'cyberoptics'
  | 'cyberaudio'
  | 'internal'
  | 'external'
  | 'cyberlimb'
  | 'borgware'
  | 'fashionware';

export interface CyberwareOption {
  name: string;
  cost: number;
  humanityLoss: string;
  description: string;
}

export interface Gear extends Equipment {
  category: 'gear';
  type: GearType;
  properties?: Record<string, any>;
}

export type GearType = 
  | 'survival'
  | 'medical'
  | 'tech'
  | 'security'
  | 'entertainment'
  | 'tools'
  | 'communication'
  | 'netrunning';

export interface Fashion extends Equipment {
  category: 'fashion';
  type: FashionType;
  style: string;
  quality: 'generic' | 'branded' | 'luxury';
}

export type FashionType = 
  | 'clothes'
  | 'jewelry'
  | 'accessories'
  | 'cosmetics';

export interface Drug extends Equipment {
  category: 'drugs';
  type: DrugType;
  strength: string;
  duration: string;
  sideEffects?: string[];
  addiction?: string;
  legal: boolean;
}

export type DrugType = 
  | 'combat'
  | 'medical'
  | 'recreational'
  | 'enhancement';

export interface Service extends Equipment {
  category: 'services';
  type: ServiceType;
  duration?: string;
  requirements?: string[];
}

export type ServiceType = 
  | 'medical'
  | 'technical'
  | 'information'
  | 'transportation'
  | 'security'
  | 'lifestyle';

export interface Vehicle extends Equipment {
  category: 'vehicles';
  type: VehicleType;
  speed: number;
  handling: number;
  armor: number;
  seats: number;
  cargo?: string;
  specialSystems?: string[];
}

export type VehicleType = 
  | 'groundcar'
  | 'bike'
  | 'aerodyne'
  | 'boat'
  | 'powered_armor';

export interface EquipmentFilter {
  categories?: EquipmentCategory[];
  minCost?: number;
  maxCost?: number;
  availability?: string[];
  search?: string;
  tags?: string[];
}