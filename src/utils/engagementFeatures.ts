import { LawTopic } from '../types/laborLaw';

export type MarioSoundscapeId = 'overworld' | 'underground' | 'castle' | 'star_road';

export interface SoundscapeMeta {
  id: MarioSoundscapeId;
  name: string;
  shortName: string;
  subtitle: string;
  bpmLabel: string;
  accentClass: string;
}

export const MARIO_SOUNDSCAPES: SoundscapeMeta[] = [
  {
    id: 'overworld',
    name: 'Overworld Breeze',
    shortName: 'Overworld',
    subtitle: 'Upbeat Mushroom Kingdom study groove',
    bpmLabel: '124 BPM • Major',
    accentClass: 'bg-emerald-500 text-slate-950',
  },
  {
    id: 'underground',
    name: 'Underground Cavern',
    shortName: 'Underground',
    subtitle: 'Deep bassline focus loop for statutory reading',
    bpmLabel: '108 BPM • Bass',
    accentClass: 'bg-cyan-400 text-slate-950',
  },
  {
    id: 'castle',
    name: "Bowser's Castle",
    shortName: 'Castle',
    subtitle: 'Intense dramatic tension for Exam Prep & Boss runs',
    bpmLabel: '132 BPM • Minor',
    accentClass: 'bg-rose-500 text-white',
  },
  {
    id: 'star_road',
    name: 'Star Road Lullaby',
    shortName: 'Star Road',
    subtitle: 'Calm celestial arpeggios for long memorization blocks',
    bpmLabel: '92 BPM • Ambient',
    accentClass: 'bg-amber-400 text-slate-950',
  },
];

export const GROUP_MEMBERS: readonly string[] = [
  'CORPUZ, MATTHEW CESAR',
  'CRUZ, MARY LOUISE',
  'FANGED, TRACY FAE',
  'FERNANDEZ, JELYN',
  'GARCIA, AERON STEVEN',
  'GARVIDA, MHELBOURNE',
  'MAÑALAC, ABIGAIL',
  'UNTALAN, BEYONCE HELEIN',
  'VILA, HANNAH DANIELA',
] as const;

// ==================== STUDY NOTES (PERSISTENT RIGHT DRAWER) ====================

export const STUDY_NOTES_STORAGE_KEY = 'mario_labor_study_notes_v1';

export interface StudyNoteItem {
  id: string;
  title: string;
  content: string;
  worldTag: string; // e.g., 'all', 'world1'..'world5', 'holidays', 'wages_matrix'
  pinned: boolean;
  updatedAt: string;
}

export interface StorageLike {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
}

export function loadStudyNotes(storage?: StorageLike | null): StudyNoteItem[] {
  if (!storage) return [];
  try {
    const raw = storage.getItem(STUDY_NOTES_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (item): item is StudyNoteItem =>
        Boolean(item) &&
        typeof item.id === 'string' &&
        typeof item.content === 'string'
    );
  } catch {
    return [];
  }
}

export function saveStudyNotes(
  notes: StudyNoteItem[],
  storage?: StorageLike | null
): void {
  if (!storage) return;
  try {
    storage.setItem(STUDY_NOTES_STORAGE_KEY, JSON.stringify(notes));
  } catch {
    // ignore storage quota errors
  }
}

export function createStudyNote(
  notes: StudyNoteItem[],
  input: { title?: string; content: string; worldTag?: string },
  nowIso: string = new Date().toISOString()
): StudyNoteItem[] {
  const trimmedContent = input.content.trim();
  if (!trimmedContent) return notes;
  const trimmedTitle = (input.title || '').trim() || deriveNoteTitle(trimmedContent);
  const newItem: StudyNoteItem = {
    id: `note-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    title: trimmedTitle,
    content: trimmedContent,
    worldTag: input.worldTag || 'all',
    pinned: false,
    updatedAt: nowIso,
  };
  return sortStudyNotes([newItem, ...notes]);
}

export function updateStudyNote(
  notes: StudyNoteItem[],
  id: string,
  patch: Partial<Pick<StudyNoteItem, 'title' | 'content' | 'worldTag' | 'pinned'>>,
  nowIso: string = new Date().toISOString()
): StudyNoteItem[] {
  const updated = notes.map((n) => {
    if (n.id !== id) return n;
    const nextContent =
      patch.content !== undefined ? patch.content.trim() : n.content;
    if (!nextContent) return n;
    const nextTitle =
      patch.title !== undefined
        ? patch.title.trim() || deriveNoteTitle(nextContent)
        : n.title;
    return {
      ...n,
      ...patch,
      title: nextTitle,
      content: nextContent,
      updatedAt: nowIso,
    };
  });
  return sortStudyNotes(updated);
}

export function deleteStudyNote(
  notes: StudyNoteItem[],
  id: string
): StudyNoteItem[] {
  return notes.filter((n) => n.id !== id);
}

export function filterStudyNotes(
  notes: StudyNoteItem[],
  worldFilter: string,
  query: string
): StudyNoteItem[] {
  const q = query.trim().toLowerCase();
  return sortStudyNotes(
    notes.filter((n) => {
      const worldMatches =
        worldFilter === 'all' || n.worldTag === worldFilter;
      if (!worldMatches) return false;
      if (!q) return true;
      return (
        n.title.toLowerCase().includes(q) ||
        n.content.toLowerCase().includes(q) ||
        n.worldTag.toLowerCase().includes(q)
      );
    })
  );
}

function deriveNoteTitle(content: string): string {
  const firstLine = content.split('\n')[0].trim();
  return firstLine.length > 44 ? `${firstLine.slice(0, 41)}...` : firstLine;
}

function sortStudyNotes(notes: StudyNoteItem[]): StudyNoteItem[] {
  return [...notes].sort((a, b) => {
    if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;
    return b.updatedAt.localeCompare(a.updatedAt);
  });
}

// ==================== WORLD PROGRESS & LEVEL-UP CELEBRATION ====================

export const CLAIMED_WORLD_LEVELUPS_KEY = 'mario_claimed_world_levelups_v1';
export const WORLD_LEVELUP_BONUS_COINS = 50;

export interface TopicUnlockStatus {
  id: string;
  title: string;
  badge: string;
  isCompleted: boolean;
  isUnlocked: boolean;
  stageOrder: number;
}

export interface WorldProgressSnapshot {
  worldId: string;
  completedCount: number;
  totalCount: number;
  percent: number;
  isWorldCleared: boolean;
  isWorldUnlocked: boolean;
  topics: TopicUnlockStatus[];
}

const ORDERED_STUDY_WORLDS = ['world1', 'world2', 'world3', 'world4', 'world5'] as const;

export function computeWorldProgressMap(
  allTopics: Pick<LawTopic, 'id' | 'worldId' | 'title' | 'badge'>[],
  completedTopicIds: string[]
): Record<string, WorldProgressSnapshot> {
  const completedSet = new Set(completedTopicIds);
  const result: Record<string, WorldProgressSnapshot> = {};

  ORDERED_STUDY_WORLDS.forEach((worldId, worldIndex) => {
    const worldTopics = allTopics.filter((t) => t.worldId === worldId);
    const totalCount = worldTopics.length;
    const completedCount = worldTopics.filter((t) => completedSet.has(t.id)).length;
    const percent =
      totalCount > 0 ? Math.min(100, Math.round((completedCount / totalCount) * 100)) : 0;
    const isWorldCleared = totalCount > 0 && completedCount === totalCount;

    // World 1 is always unlocked; subsequent worlds unlock when at least 1 topic in prior world is studied OR any topic in this world is studied (plus users can always preview, while showing clear progression status)
    const prevWorldId = worldIndex > 0 ? ORDERED_STUDY_WORLDS[worldIndex - 1] : null;
    const prevProgress = prevWorldId ? result[prevWorldId] : null;
    const isWorldUnlocked =
      worldIndex === 0 ||
      completedCount > 0 ||
      Boolean(prevProgress && prevProgress.completedCount > 0);

    const topics: TopicUnlockStatus[] = worldTopics.map((topic, idx) => {
      const isCompleted = completedSet.has(topic.id);
      const prevTopicCompleted = idx === 0 ? true : completedSet.has(worldTopics[idx - 1].id);
      // First stage in world or any stage following a completed stage (or already completed) shows unlocked
      const isUnlocked = isCompleted || (idx === 0 && isWorldUnlocked) || prevTopicCompleted;
      return {
        id: topic.id,
        title: topic.title,
        badge: topic.badge,
        isCompleted,
        isUnlocked,
        stageOrder: idx + 1,
      };
    });

    result[worldId] = {
      worldId,
      completedCount,
      totalCount,
      percent,
      isWorldCleared,
      isWorldUnlocked,
      topics,
    };
  });

  return result;
}

export interface WorldLevelUpCheckResult {
  triggered: boolean;
  worldId: string | null;
  bonusCoins: number;
  updatedClaimedWorlds: string[];
}

/**
 * Checks whether toggling `toggledTopicId` ON just completed all modules for its world.
 * Awards bonus coins on first-time world mastery (stored in claimedWorldIds) and still
 * celebrates world completion if a user completes the final module of a world.
 */
export function evaluateWorldLevelUp(params: {
  toggledTopicId: string;
  previousCompletedIds: string[];
  nextCompletedIds: string[];
  allTopics: Pick<LawTopic, 'id' | 'worldId'>[];
  claimedWorldIds: string[];
}): WorldLevelUpCheckResult {
  const {
    toggledTopicId,
    previousCompletedIds,
    nextCompletedIds,
    allTopics,
    claimedWorldIds,
  } = params;

  const topic = allTopics.find((t) => t.id === toggledTopicId);
  if (!topic) {
    return {
      triggered: false,
      worldId: null,
      bonusCoins: 0,
      updatedClaimedWorlds: claimedWorldIds,
    };
  }

  const worldTopics = allTopics.filter((t) => t.worldId === topic.worldId);
  if (worldTopics.length === 0) {
    return {
      triggered: false,
      worldId: null,
      bonusCoins: 0,
      updatedClaimedWorlds: claimedWorldIds,
    };
  }

  const prevSet = new Set(previousCompletedIds);
  const nextSet = new Set(nextCompletedIds);

  const wasClearedBefore = worldTopics.every((t) => prevSet.has(t.id));
  const isClearedNow = worldTopics.every((t) => nextSet.has(t.id));

  if (!wasClearedBefore && isClearedNow) {
    const alreadyClaimed = claimedWorldIds.includes(topic.worldId);
    const bonusCoins = alreadyClaimed ? 15 : WORLD_LEVELUP_BONUS_COINS;
    const updatedClaimedWorlds = alreadyClaimed
      ? claimedWorldIds
      : [...claimedWorldIds, topic.worldId];

    return {
      triggered: true,
      worldId: topic.worldId,
      bonusCoins,
      updatedClaimedWorlds,
    };
  }

  return {
    triggered: false,
    worldId: null,
    bonusCoins: 0,
    updatedClaimedWorlds: claimedWorldIds,
  };
}

// ==================== POMODORO TIMER HELPERS ====================

export type PomodoroMode = 'focus' | 'shortBreak' | 'longBreak' | 'sprint';

export const POMODORO_PRESETS: Record<
  PomodoroMode,
  { label: string; shortLabel: string; minutes: number; coinReward: number }
> = {
  focus: { label: '25m Deep Study', shortLabel: '25m Focus', minutes: 25, coinReward: 15 },
  sprint: { label: '15m Quick Sprint', shortLabel: '15m Sprint', minutes: 15, coinReward: 10 },
  shortBreak: { label: '5m Mushroom Break', shortLabel: '5m Break', minutes: 5, coinReward: 0 },
  longBreak: { label: '15m Warp Rest', shortLabel: '15m Rest', minutes: 15, coinReward: 0 },
};

export function formatPomodoroSeconds(totalSeconds: number): string {
  const clamped = Math.max(0, Math.floor(totalSeconds));
  const mins = Math.floor(clamped / 60);
  const secs = clamped % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

export function getNextPomodoroModeAfterCompletion(
  completedMode: PomodoroMode,
  completedFocusSessionsCount: number
): PomodoroMode {
  if (completedMode === 'focus' || completedMode === 'sprint') {
    return completedFocusSessionsCount > 0 && completedFocusSessionsCount % 4 === 0
      ? 'longBreak'
      : 'shortBreak';
  }
  return 'focus';
}

export function getAutoScrollMobilePosition(pomodoroState: {
  active: boolean;
  hasNotice: boolean;
  isExpanded: boolean;
}): {
  hidden: boolean;
  bottomClass: string;
} {
  if (pomodoroState.isExpanded) {
    return { hidden: true, bottomClass: 'hidden' };
  }
  if (pomodoroState.active) {
    return {
      hidden: false,
      bottomClass: pomodoroState.hasNotice ? 'bottom-[14rem]' : 'bottom-[6.75rem]',
    };
  }
  return {
    hidden: false,
    bottomClass: 'bottom-3.5',
  };
}

