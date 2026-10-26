export type WorldId =
  | 'world1'
  | 'world2'
  | 'world3'
  | 'world4'
  | 'world5'
  | 'holidays'
  | 'warp_calc'
  | 'flashcards'
  | 'wage_matrix'
  | 'shop'
  | 'vault';

export type MarioTheme =
  | 'overworld'
  | 'underground'
  | 'castle'
  | 'galaxy'
  | 'rainbow'
  | 'bowser_lava'
  | 'retro_nes'
  | 'neon_synth'
  | 'desert_oasis'
  | 'aurora';

export type MarioAvatar =
  | 'mario'
  | 'luigi'
  | 'peach'
  | 'daisy'
  | 'rosalina'
  | 'pauline'
  | 'toad'
  | 'toadette'
  | 'capttoad'
  | 'yoshi'
  | 'birdo'
  | 'donkeykong'
  | 'diddykong'
  | 'wario'
  | 'waluigi'
  | 'bowser'
  | 'bowserjr'
  | 'koopatroopa'
  | 'shyguy'
  | 'boo'
  | 'kamek'
  | 'drybones'
  | 'metalmario'
  | 'goldmario';

export type ComplexityMode = 'beginner' | 'advanced';

export type StudyDifficulty = 'casual' | 'exam_prep';

export type ShopCategory =
  | 'theme'
  | 'avatar'
  | 'perk'
  | 'soundpack'
  | 'title'
  | 'certificate';

export interface ShopItem {
  id: string;
  name: string;
  category: ShopCategory;
  price: number;
  description: string;
  previewColor?: string;
  avatarId?: MarioAvatar;
  themeId?: MarioTheme;
  faction?: string;
  badge?: string;
  perkEffect?: string;
}

export interface LawTopic {
  id: string;
  worldId: WorldId;
  title: string;
  badge: string; // e.g., "Art. 82", "R.A. 11360", "D.O. 174"
  iconName: string; // Mario item representation
  summary: string;
  beginnerSummary?: string; // Plain-English simplified summary for Beginner mode
  practicalTakeaway?: string; // Real-world practical application for employees/employers
  keyDoctrines: string[];
  rules: {
    heading: string;
    description?: string;
    items?: string[];
    subSections?: {
      title: string;
      items: string[];
    }[];
    tableData?: {
      headers: string[];
      rows: string[][];
    };
  }[];
  exceptions?: {
    generalRule: string;
    exceptions: string[];
    exceptionToException?: string[];
  }[];
  barTips?: string[];
  keyTips?: string[];
}

export interface Flashcard {
  id: string;
  world: string;
  worldNum: number;
  question: string;
  answer: string;
  keyTakeaway: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
}

export interface RegionalWageEntry {
  region: string;
  effectivity: string;
  nonAgri: string;
  agri: string;
}

export interface KasambahayWageEntry {
  region: string;
  effectivity: string;
  minimumWage: string;
}
