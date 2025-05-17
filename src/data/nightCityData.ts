import { MapRegion } from '../types/map';

export const nightCityRegions: MapRegion[] = [
  // Main Districts
  {
    id: 'city-center',
    name: 'City Center',
    type: 'district',
    coordinates: { x: 400, y: 300, width: 200, height: 200 },
    description: 'The corporate heart of Night City, home to megacorps and high-security zones.',
    dangerLevel: 2,
    tags: ['corporate', 'high-security', 'wealthy'],
    landmarks: [
      {
        id: 'arasaka-tower',
        name: 'Arasaka Tower',
        type: 'corporate',
        description: 'Massive corporate headquarters of Arasaka Corporation',
        importance: 'major'
      },
      {
        id: 'corpo-plaza',
        name: 'Corporate Plaza',
        type: 'corporate',
        description: 'Central business district with multiple corporate offices',
        importance: 'major'
      }
    ]
  },
  {
    id: 'watson',
    name: 'Watson',
    type: 'district',
    coordinates: { x: 300, y: 100, width: 200, height: 200 },
    description: 'Once a corporate district, now a mix of markets, gangs, and immigrants.',
    dangerLevel: 3,
    gangTerritory: {
      gangName: 'Maelstrom',
      influence: 'contested',
      description: 'Maelstrom controls parts of Watson, especially industrial areas'
    },
    tags: ['multicultural', 'markets', 'gang-activity'],
    childRegions: ['kabuki', 'little-china', 'northside-industrial']
  },
  {
    id: 'westbrook',
    name: 'Westbrook',
    type: 'district',
    coordinates: { x: 600, y: 200, width: 200, height: 200 },
    description: 'Luxury district featuring Japantown and North Oak wealthy residentials.',
    dangerLevel: 2,
    gangTerritory: {
      gangName: 'Tyger Claws',
      influence: 'controlled',
      description: 'Tyger Claws run Japantown and most entertainment venues'
    },
    tags: ['luxury', 'entertainment', 'japantown'],
    childRegions: ['japantown', 'north-oak', 'charter-hill']
  },
  {
    id: 'heywood',
    name: 'Heywood',
    type: 'district',
    coordinates: { x: 300, y: 400, width: 250, height: 200 },
    description: 'Suburban district with strong Latino culture and Valentinos presence.',
    dangerLevel: 3,
    gangTerritory: {
      gangName: 'Valentinos',
      influence: 'controlled',
      description: 'Valentinos control most of Heywood, especially Glen and Wellsprings'
    },
    tags: ['suburban', 'latino', 'residential'],
    childRegions: ['the-glen', 'wellsprings', 'vista-del-rey']
  },
  {
    id: 'santo-domingo',
    name: 'Santo Domingo',
    type: 'district',
    coordinates: { x: 200, y: 300, width: 200, height: 200 },
    description: 'Industrial district with power plants and manufacturing.',
    dangerLevel: 4,
    gangTerritory: {
      gangName: '6th Street',
      influence: 'contested',
      description: '6th Street maintains influence but faces competition'
    },
    tags: ['industrial', 'working-class', 'power-generation'],
    childRegions: ['arroyo', 'rancho-coronado']
  },
  {
    id: 'pacifica',
    name: 'Pacifica',
    type: 'district',
    coordinates: { x: 100, y: 500, width: 200, height: 150 },
    description: 'Abandoned resort district, now lawless and controlled by Voodoo Boys.',
    dangerLevel: 5,
    gangTerritory: {
      gangName: 'Voodoo Boys',
      influence: 'controlled',
      description: 'Voodoo Boys control Pacifica and the abandoned NET infrastructure'
    },
    tags: ['abandoned', 'dangerous', 'lawless', 'coastal'],
    childRegions: ['coastview', 'west-wind-estate']
  },
  {
    id: 'badlands',
    name: 'Badlands',
    type: 'district',
    coordinates: { x: 0, y: 0, width: 800, height: 700 },
    description: 'Desert wasteland surrounding Night City, home to Nomad clans.',
    dangerLevel: 4,
    tags: ['desert', 'nomad', 'wasteland', 'dangerous'],
    landmarks: [
      {
        id: 'biotechnica-farms',
        name: 'Biotechnica Protein Farms',
        type: 'industrial',
        description: 'Massive protein farming facilities',
        importance: 'major'
      },
      {
        id: 'nomad-camps',
        name: 'Nomad Camps',
        type: 'residential',
        description: 'Various Nomad clan settlements',
        importance: 'minor'
      }
    ]
  },

  // Sub-regions
  {
    id: 'kabuki',
    name: 'Kabuki',
    type: 'neighborhood',
    parentRegion: 'watson',
    coordinates: { x: 320, y: 120, width: 80, height: 80 },
    description: 'Dense market district with mix of legal and illegal goods.',
    dangerLevel: 3,
    tags: ['markets', 'crowded', 'black-market'],
    landmarks: [
      {
        id: 'kabuki-market',
        name: 'Kabuki Market',
        type: 'commercial',
        description: 'Sprawling market with everything from food to illegal cyberware',
        importance: 'major'
      }
    ]
  },
  {
    id: 'japantown',
    name: 'Japantown',
    type: 'neighborhood',
    parentRegion: 'westbrook',
    coordinates: { x: 620, y: 250, width: 80, height: 80 },
    description: 'Entertainment district with strong Japanese cultural influence.',
    dangerLevel: 2,
    gangTerritory: {
      gangName: 'Tyger Claws',
      influence: 'controlled',
      description: 'Tyger Claws run all major establishments'
    },
    tags: ['entertainment', 'japanese', 'nightlife'],
    landmarks: [
      {
        id: 'clouds',
        name: 'Clouds',
        type: 'entertainment',
        description: 'High-end braindance club',
        importance: 'major'
      },
      {
        id: 'jinguji',
        name: 'Jinguji',
        type: 'commercial',
        description: 'Major shopping center',
        importance: 'minor'
      }
    ]
  },
  {
    id: 'the-glen',
    name: 'The Glen',
    type: 'neighborhood',
    parentRegion: 'heywood',
    coordinates: { x: 350, y: 450, width: 80, height: 80 },
    description: 'Upscale Heywood neighborhood with corporate presence.',
    dangerLevel: 2,
    tags: ['upscale', 'corporate', 'secure'],
    landmarks: [
      {
        id: 'embers',
        name: "Embers",
        type: 'entertainment',
        description: 'High-end restaurant and bar',
        importance: 'minor'
      }
    ]
  },
  {
    id: 'arroyo',
    name: 'Arroyo',
    type: 'neighborhood',
    parentRegion: 'santo-domingo',
    coordinates: { x: 220, y: 350, width: 80, height: 80 },
    description: 'Industrial zone with power plants and factories.',
    dangerLevel: 4,
    gangTerritory: {
      gangName: '6th Street',
      influence: 'presence',
      description: '6th Street patrols but doesn\'t fully control'
    },
    tags: ['industrial', 'power-plants', 'working-class'],
    landmarks: [
      {
        id: 'power-plant',
        name: 'Arroyo Power Plant',
        type: 'industrial',
        description: 'Major power generation facility for Night City',
        importance: 'major'
      }
    ]
  },
  {
    id: 'coastview',
    name: 'Coastview',
    type: 'neighborhood',
    parentRegion: 'pacifica',
    coordinates: { x: 120, y: 520, width: 80, height: 80 },
    description: 'Abandoned beachfront area with ruined hotels and malls.',
    dangerLevel: 5,
    gangTerritory: {
      gangName: 'Voodoo Boys',
      influence: 'controlled',
      description: 'Voodoo Boys use the area for NET operations'
    },
    tags: ['abandoned', 'dangerous', 'coastal', 'ruins'],
    landmarks: [
      {
        id: 'grand-imperial-mall',
        name: 'Grand Imperial Mall',
        type: 'commercial',
        description: 'Massive abandoned shopping mall, now gang territory',
        importance: 'major'
      },
      {
        id: 'pacifica-pier',
        name: 'Pacifica Pier',
        type: 'entertainment',
        description: 'Ruined amusement pier',
        importance: 'minor'
      }
    ]
  }
];

export const nightCityGangs = [
  {
    name: 'Maelstrom',
    color: '#ff0000',
    description: 'Cyberpsycho gang obsessed with cyberware',
    territories: ['watson', 'northside-industrial'],
    activities: ['Cyberware trafficking', 'Kidnapping', 'Extortion']
  },
  {
    name: 'Valentinos',
    color: '#ff00ff',
    description: 'Latino gang with strong cultural traditions',
    territories: ['heywood', 'the-glen', 'wellsprings'],
    activities: ['Protection rackets', 'Street racing', 'Drug dealing']
  },
  {
    name: 'Tyger Claws',
    color: '#00ff00',
    description: 'Japanese gang controlling entertainment districts',
    territories: ['westbrook', 'japantown'],
    activities: ['Prostitution', 'Gambling', 'Protection']
  },
  {
    name: 'Voodoo Boys',
    color: '#00ffff',
    description: 'Haitian netrunner gang',
    territories: ['pacifica', 'coastview'],
    activities: ['NET operations', 'Data theft', 'Smuggling']
  },
  {
    name: '6th Street',
    color: '#ffff00',
    description: 'Patriotic gang of NUSA veterans',
    territories: ['santo-domingo', 'arroyo'],
    activities: ['Gun running', 'Protection', 'Vigilante justice']
  },
  {
    name: 'Animals',
    color: '#ff8800',
    description: 'Muscle-obsessed gang using animal hormones',
    territories: ['pacifica', 'santo-domingo'],
    activities: ['Muscle for hire', 'Steroid trafficking']
  },
  {
    name: 'Moxes',
    color: '#ff00ff',
    description: 'Gang protecting sex workers and outcasts',
    territories: ['watson', 'kabuki'],
    activities: ['Protection', 'Club security']
  },
  {
    name: 'Scavengers',
    color: '#888888',
    description: 'Organ harvesting gang',
    territories: ['Various'],
    activities: ['Organ harvesting', 'Kidnapping', 'Murder']
  }
];