export interface MapRegion {
  id: string;
  name: string;
  type: RegionType;
  coordinates: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  parentRegion?: string;
  childRegions?: string[];
  description: string;
  gangTerritory?: GangInfo;
  landmarks?: Landmark[];
  notes?: Note[];
  tags?: string[];
  dangerLevel?: 1 | 2 | 3 | 4 | 5;
  linkedMaps?: MapLink[];
}

export type RegionType = 
  | 'district'
  | 'neighborhood'
  | 'zone'
  | 'building'
  | 'poi' // Point of Interest
  | 'street';

export interface GangInfo {
  gangName: string;
  influence: 'controlled' | 'contested' | 'presence';
  description?: string;
  notableMembers?: string[];
  activities?: string[];
}

export interface Landmark {
  id: string;
  name: string;
  type: LandmarkType;
  description: string;
  coordinates?: {
    x: number;
    y: number;
  };
  importance: 'major' | 'minor' | 'hidden';
}

export type LandmarkType = 
  | 'corporate'
  | 'commercial'
  | 'residential'
  | 'industrial'
  | 'entertainment'
  | 'government'
  | 'medical'
  | 'criminal';

export interface Note {
  id: string;
  title: string;
  content: string;
  author: string;
  timestamp: Date;
  visibility: 'public' | 'gm' | 'player';
  tags?: string[];
  linkedRegions?: string[];
}

export interface MapLink {
  id: string;
  targetMapId: string;
  targetRegionId?: string;
  title: string;
  description?: string;
  type: 'detail' | 'overview' | 'related';
}

export interface MapLayer {
  id: string;
  name: string;
  visible: boolean;
  type: LayerType;
  data: any;
}

export type LayerType = 
  | 'base'
  | 'districts'
  | 'gangs'
  | 'landmarks'
  | 'notes'
  | 'custom';

export interface MapState {
  currentMapId: string;
  zoom: number;
  center: { x: number; y: number };
  selectedRegion: string | null;
  layers: MapLayer[];
  filterTags: string[];
}