import type { Character, RoleType, StatType, Stat, Skill, SkillCategory } from '../types/game';

export class CharacterModel implements Character {
  id: string;
  name: string;
  handle?: string;
  role: RoleType;
  roleRank: number;
  stats: Record<StatType, Stat>;
  hitPoints: {
    max: number;
    current: number;
    seriouslyWounded: number;
    deathSave: number;
  };
  humanity: {
    max: number;
    current: number;
  };
  skills: Skill[];
  weapons: any[] = [];
  armor: any[] = [];
  cyberware: any[] = [];
  gear: any[] = [];
  background: any = {};
  lifepath: any = {
    friends: [],
    enemies: [],
    lovers: [],
    mentors: []
  };
  eurodollars: number = 0;
  reputation: number = 0;
  ip: number = 0;
  notes: string = '';
  createdAt: string;
  updatedAt: string;
  isNPC: boolean;

  constructor(data: Partial<Character> = {}) {
    this.id = data.id || crypto.randomUUID();
    this.name = data.name || 'Unknown';
    this.handle = data.handle;
    this.role = data.role || 'Solo';
    this.roleRank = data.roleRank || 4;
    this.isNPC = data.isNPC || false;
    
    // Initialize stats with default values
    this.stats = this.initializeStats(data.stats);
    
    // Calculate derived values
    this.hitPoints = this.calculateHitPoints();
    this.humanity = {
      max: data.humanity?.max || this.getStat('EMP') * 10,
      current: data.humanity?.current || this.getStat('EMP') * 10
    };
    
    // Initialize skills
    this.skills = data.skills || this.getDefaultSkills();
    
    // Equipment
    this.weapons = data.weapons || [];
    this.armor = data.armor || [];
    this.cyberware = data.cyberware || [];
    this.gear = data.gear || [];
    
    // Background and lifepath
    this.background = data.background || {};
    this.lifepath = data.lifepath || {
      friends: [],
      enemies: [],
      lovers: [],
      mentors: []
    };
    
    // Resources
    this.eurodollars = data.eurodollars || 0;
    this.reputation = data.reputation || 0;
    this.ip = data.ip || 0;
    
    // Metadata
    this.notes = data.notes || '';
    const now = new Date().toISOString();
    this.createdAt = data.createdAt || now;
    this.updatedAt = data.updatedAt || now;
  }

  private initializeStats(stats?: Partial<Record<StatType, Stat>>): Record<StatType, Stat> {
    const statTypes: StatType[] = ['INT', 'REF', 'DEX', 'TECH', 'COOL', 'WILL', 'LUCK', 'MOVE', 'BODY', 'EMP'];
    const result: Record<StatType, Stat> = {} as Record<StatType, Stat>;
    
    for (const statType of statTypes) {
      const existing = stats?.[statType];
      result[statType] = {
        name: statType,
        value: existing?.value || 5,
        base: existing?.base || 5,
        modifier: existing?.modifier || 0
      };
    }
    
    return result;
  }

  private calculateHitPoints() {
    const body = this.getStat('BODY');
    const will = this.getStat('WILL');
    const maxHP = 10 + (5 * Math.ceil(((body + will) / 2)));
    
    return {
      max: maxHP,
      current: maxHP,
      seriouslyWounded: Math.floor(maxHP / 2),
      deathSave: body
    };
  }

  private getDefaultSkills(): Skill[] {
    const coreSkills: Array<{name: string, category: SkillCategory, stat: StatType}> = [
      // Awareness Skills
      { name: 'Concentration', category: 'Awareness', stat: 'WILL' },
      { name: 'Conceal/Reveal Object', category: 'Awareness', stat: 'INT' },
      { name: 'Lip Reading', category: 'Awareness', stat: 'INT' },
      { name: 'Perception', category: 'Awareness', stat: 'INT' },
      { name: 'Tracking', category: 'Awareness', stat: 'INT' },
      
      // Body Skills
      { name: 'Athletics', category: 'Body', stat: 'DEX' },
      { name: 'Contortionist', category: 'Body', stat: 'DEX' },
      { name: 'Dance', category: 'Body', stat: 'DEX' },
      { name: 'Endurance', category: 'Body', stat: 'WILL' },
      { name: 'Resist Torture/Drugs', category: 'Body', stat: 'WILL' },
      { name: 'Stealth', category: 'Body', stat: 'DEX' },
      
      // Control Skills
      { name: 'Drive Land Vehicle', category: 'Control', stat: 'REF' },
      { name: 'Pilot Air Vehicle', category: 'Control', stat: 'REF' },
      { name: 'Pilot Sea Vehicle', category: 'Control', stat: 'REF' },
      { name: 'Riding', category: 'Control', stat: 'REF' },
      
      // Education Skills
      { name: 'Accounting', category: 'Education', stat: 'INT' },
      { name: 'Animal Handling', category: 'Education', stat: 'INT' },
      { name: 'Bureaucracy', category: 'Education', stat: 'INT' },
      { name: 'Business', category: 'Education', stat: 'INT' },
      { name: 'Composition', category: 'Education', stat: 'INT' },
      { name: 'Deduction', category: 'Education', stat: 'INT' },
      { name: 'Education', category: 'Education', stat: 'INT' },
      { name: 'Gamble', category: 'Education', stat: 'INT' },
      { name: 'Language', category: 'Education', stat: 'INT' },
      { name: 'Library Search', category: 'Education', stat: 'INT' },
      { name: 'Local Expert', category: 'Education', stat: 'INT' },
      { name: 'Science', category: 'Education', stat: 'INT' },
      { name: 'Tactics', category: 'Education', stat: 'INT' },
      { name: 'Wilderness Survival', category: 'Education', stat: 'INT' },
      
      // Fighting Skills  
      { name: 'Brawling', category: 'Fighting', stat: 'DEX' },
      { name: 'Evasion', category: 'Fighting', stat: 'DEX' },
      { name: 'Martial Arts', category: 'Fighting', stat: 'DEX' },
      { name: 'Melee Weapon', category: 'Fighting', stat: 'DEX' },
      
      // Performance Skills
      { name: 'Acting', category: 'Performance', stat: 'COOL' },
      { name: 'Play Instrument', category: 'Performance', stat: 'TECH' },
      
      // Ranged Weapon Skills
      { name: 'Archery', category: 'Ranged Weapon', stat: 'REF' },
      { name: 'Autofire', category: 'Ranged Weapon', stat: 'REF' },
      { name: 'Handgun', category: 'Ranged Weapon', stat: 'REF' },
      { name: 'Heavy Weapons', category: 'Ranged Weapon', stat: 'REF' },
      { name: 'Shoulder Arms', category: 'Ranged Weapon', stat: 'REF' },
      
      // Social Skills
      { name: 'Bribery', category: 'Social', stat: 'COOL' },
      { name: 'Conversation', category: 'Social', stat: 'EMP' },
      { name: 'Human Perception', category: 'Social', stat: 'EMP' },
      { name: 'Interrogation', category: 'Social', stat: 'COOL' },
      { name: 'Persuasion', category: 'Social', stat: 'COOL' },
      { name: 'Personal Grooming', category: 'Social', stat: 'COOL' },
      { name: 'Streetwise', category: 'Social', stat: 'COOL' },
      { name: 'Trading', category: 'Social', stat: 'COOL' },
      { name: 'Wardrobe & Style', category: 'Social', stat: 'COOL' },
      
      // Technique Skills
      { name: 'Basic Tech', category: 'Technique', stat: 'TECH' },
      { name: 'Cybertech', category: 'Technique', stat: 'TECH' },
      { name: 'Demolitions', category: 'Technique', stat: 'TECH' },
      { name: 'Electronics/Security Tech', category: 'Technique', stat: 'TECH' },
      { name: 'First Aid', category: 'Technique', stat: 'TECH' },
      { name: 'Forgery', category: 'Technique', stat: 'TECH' },
      { name: 'Pick Lock', category: 'Technique', stat: 'TECH' },
      { name: 'Pick Pocket', category: 'Technique', stat: 'TECH' },
      { name: 'Photography/Film', category: 'Technique', stat: 'TECH' },
      { name: 'Weaponstech', category: 'Technique', stat: 'TECH' }
    ];

    return coreSkills.map(skill => ({
      ...skill,
      level: 0,
      ip: 0,
      total: this.getStat(skill.stat),
      isRoleSkill: false
    }));
  }

  // Helper methods
  getStat(stat: StatType): number {
    return this.stats[stat].value;
  }

  getSkill(skillName: string): Skill | undefined {
    return this.skills.find(s => s.name === skillName);
  }

  getSkillTotal(skillName: string): number {
    const skill = this.getSkill(skillName);
    if (!skill) return 0;
    return skill.level + this.getStat(skill.stat);
  }

  addSkillIP(skillName: string, ip: number): void {
    const skill = this.getSkill(skillName);
    if (!skill) return;
    
    skill.ip += ip;
    
    // Check for level up (every 10 IP = 1 level)
    while (skill.ip >= 10) {
      skill.ip -= 10;
      skill.level += 1;
      skill.total = skill.level + this.getStat(skill.stat);
    }
    
    this.updatedAt = new Date().toISOString();
  }

  takeDamage(damage: number): void {
    this.hitPoints.current = Math.max(0, this.hitPoints.current - damage);
    
    if (this.hitPoints.current <= this.hitPoints.seriouslyWounded) {
      // Apply seriously wounded penalties
      console.log(`${this.name} is seriously wounded!`);
    }
    
    if (this.hitPoints.current <= 0) {
      // Death save required
      console.log(`${this.name} needs to make a death save!`);
    }
    
    this.updatedAt = new Date().toISOString();
  }

  heal(amount: number): void {
    this.hitPoints.current = Math.min(this.hitPoints.max, this.hitPoints.current + amount);
    this.updatedAt = new Date().toISOString();
  }

  loseHumanity(amount: number): void {
    this.humanity.current = Math.max(0, this.humanity.current - amount);
    
    if (this.humanity.current <= 0) {
      console.log(`${this.name} has gone cyberpsycho!`);
    }
    
    this.updatedAt = new Date().toISOString();
  }

  getRoleAbility(): string {
    const roleAbilities: Record<RoleType, string> = {
      'Solo': 'Combat Awareness',
      'Rockerboy': 'Charismatic Impact',
      'Netrunner': 'Interface',
      'Tech': 'Maker',
      'Medtech': 'Medicine',
      'Media': 'Credibility',
      'Exec': 'Teamwork',
      'Lawman': 'Backup',
      'Fixer': 'Operator',
      'Nomad': 'Moto'
    };
    
    return roleAbilities[this.role];
  }

  isAlive(): boolean {
    return this.hitPoints.current > 0;
  }

  toJSON(): Character {
    return {
      id: this.id,
      name: this.name,
      handle: this.handle,
      role: this.role,
      roleRank: this.roleRank,
      stats: this.stats,
      hitPoints: this.hitPoints,
      humanity: this.humanity,
      skills: this.skills,
      weapons: this.weapons,
      armor: this.armor,
      cyberware: this.cyberware,
      gear: this.gear,
      background: this.background,
      lifepath: this.lifepath,
      eurodollars: this.eurodollars,
      reputation: this.reputation,
      ip: this.ip,
      notes: this.notes,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      isNPC: this.isNPC
    };
  }
}