import React, { useState, useMemo } from 'react';
import {
  MarioCharacterAvatar,
  MarioMushroomIcon,
  MarioFireFlowerIcon,
  MarioStarIcon,
  MarioPipeIcon,
  MarioPeachCrownIcon,
  Mario1UpIcon,
  MarioCoinIcon,
} from './MarioIcons';
import { MarioAvatar } from '../types/laborLaw';
import { HERO_ROSTER, getHeroMeta } from '../data/heroesData';
import { ALL_LAW_TOPICS } from '../data/laborLawData';
import {
  computeWorldProgressMap,
  GROUP_MEMBERS,
} from '../utils/engagementFeatures';
import { marioAudio } from '../utils/audio';
import {
  ArrowRight,
  Compass,
  Users,
  ChevronDown,
  ChevronUp,
  Calendar,
  CheckCircle2,
  Unlock,
  Lock,
  Sparkles,
  Award,
} from 'lucide-react';

interface WorldMapProps {
  onSelectWorld: (worldId: string) => void;
  onSelectTopic?: (worldId: string, topicId: string) => void;
  activeWorld: string;
  fontSize: 'normal' | 'large' | 'xlarge';
  equippedAvatar: MarioAvatar;
  setEquippedAvatar: (avatar: MarioAvatar) => void;
  completedTopicIds?: string[];
  onToggleTopicComplete?: (topicId: string) => void;
  onOpenWalkthrough?: () => void;
  onOpenProfile?: () => void;
  unlockedAchievementsCount?: number;
}

interface MapNode {
  id: string;
  levelNumber: string;
  name: string;
  worldName: string;
  x: number;
  y: number;
  iconType: 'mushroom' | 'flower' | 'star' | 'crown' | '1up' | 'pipe' | 'holiday';
  badge: string;
  summary: string;
  topicsCount: number;
}

const MAP_NODES: MapNode[] = [
  {
    id: 'world1',
    levelNumber: 'WORLD 1',
    name: 'YOSHI ISLAND',
    worldName: 'Hours of Work',
    x: 16,
    y: 70,
    iconType: 'mushroom',
    badge: 'Art. 82-90 Labor Code',
    summary:
      'Coverage & Exclusions, Managerial & Field Tests, 20-min Brownouts, Travel Time, Compressed Work Week & Overtime.',
    topicsCount: 3,
  },
  {
    id: 'world2',
    levelNumber: 'WORLD 2',
    name: 'DONUT PLAINS',
    worldName: 'Rest & Holidays',
    x: 30,
    y: 36,
    iconType: 'flower',
    badge: 'Art. 91-94, RA 11360, PD 851',
    summary:
      'Rest Periods, 12 Regular & 9 Special Holidays, Double Holidays, 100% Service Charge & 13th Month Pay.',
    topicsCount: 4,
  },
  {
    id: 'holidays',
    levelNumber: 'HOLIDAY HUB',
    name: 'FESTIVAL ISLAND',
    worldName: 'PH Holidays Master Tab',
    x: 42,
    y: 17,
    iconType: 'holiday',
    badge: '12 Regular + Special Days',
    summary:
      'Dedicated Holiday Hub: All Regular & Special Non-Working Days, Double Holiday 300%/390% rules, Preceding Absence doctrines & Interactive Holiday Simulator.',
    topicsCount: 12,
  },
  {
    id: 'world3',
    levelNumber: 'WORLD 3',
    name: 'VANILLA DOME',
    worldName: 'Wages & D.O. 174',
    x: 52,
    y: 72,
    iconType: 'star',
    badge: 'Art. 97-129 & D.O. 174',
    summary:
      'No Work-No Pay, Wage vs Salary, 12 Exemptions, D.O. 174 Job vs Labor-Only Contracting, 10 Deductions & Distortion.',
    topicsCount: 2,
  },
  {
    id: 'world4',
    levelNumber: 'WORLD 4',
    name: 'FOREST OF ILLUSION',
    worldName: 'Special Groups',
    x: 70,
    y: 34,
    iconType: 'crown',
    badge: 'Women, Minors, Kasambahay',
    summary:
      'Women Facilities & Discrimination, Competitor Rule, Child Labor, Batas Kasambahay 8 Rights, Homeworkers & Night Work.',
    topicsCount: 2,
  },
  {
    id: 'world5',
    levelNumber: 'WORLD 5',
    name: 'BOWSER CASTLE',
    worldName: 'Protective Laws',
    x: 84,
    y: 62,
    iconType: '1up',
    badge: 'RA 10028, 7192, 9710, 7877, 11313, 9262',
    summary:
      'Breastfeeding Act, RA 7192, Magna Carta, Sexual Harassment, Safe Spaces Act, Anti-VAWC, SPES & Telecommuting.',
    topicsCount: 3,
  },
  {
    id: 'warp_calc',
    levelNumber: 'WARP PIPE',
    name: 'PIPE LAND',
    worldName: 'Multiplier Calculator',
    x: 34,
    y: 84,
    iconType: 'pipe',
    badge: 'Interactive Wage Engine',
    summary:
      'Statutory calculation simulator for base pay, overtime, holiday premiums, night differentials, and 13th month.',
    topicsCount: 1,
  },
  {
    id: 'wages_matrix',
    levelNumber: 'STAR ROAD',
    name: 'STAR ROAD',
    worldName: '17 Regions Matrix',
    x: 68,
    y: 15,
    iconType: 'star',
    badge: 'NCR to BARMM Rates',
    summary:
      'Complete regional minimum wage rates for Non-Agriculture, Agriculture, and Kasambahay domestic workers.',
    topicsCount: 1,
  },
];

export const WorldMap: React.FC<WorldMapProps> = ({
  onSelectWorld,
  onSelectTopic,
  activeWorld,
  fontSize,
  equippedAvatar,
  setEquippedAvatar,
  completedTopicIds = [],
  onToggleTopicComplete,
  onOpenWalkthrough,
  onOpenProfile,
  unlockedAchievementsCount = 0,
}) => {
  const [selectedNodeId, setSelectedNodeId] = useState<string>(
    MAP_NODES.some((n) => n.id === activeWorld) ? activeWorld : 'world1'
  );
  const [showAllHeroes, setShowAllHeroes] = useState<boolean>(() =>
    typeof window !== 'undefined' ? window.innerWidth >= 640 : true
  );

  const worldProgressMap = useMemo(
    () => computeWorldProgressMap(ALL_LAW_TOPICS, completedTopicIds),
    [completedTopicIds]
  );

  const selectedNode =
    MAP_NODES.find((n) => n.id === selectedNodeId) || MAP_NODES[0];
  const selectedWorldProgress = worldProgressMap[selectedNode.id] || null;

  const totalClearedWorlds = Object.values(worldProgressMap).filter(
    (w) => w.isWorldCleared
  ).length;

  const handleNodeInspect = (node: MapNode) => {
    setSelectedNodeId(node.id);
    marioAudio.playJump();
  };

  const handleSelectHero = (id: MarioAvatar) => {
    setEquippedAvatar(id);
    marioAudio.playJump();
    try {
      localStorage.setItem('mario_equipped_avatar', id);
    } catch {
      // ignore
    }
  };

  const activeHeroMeta = getHeroMeta(equippedAvatar);
  const bodyTextClass =
    fontSize === 'xlarge' ? 'text-xl' : fontSize === 'large' ? 'text-lg' : 'text-base';

  return (
    <div className="space-y-6">
      <div className="bg-[#1e293b] rounded-3xl mario-card border-4 border-slate-950 p-4 md:p-6 text-white overflow-hidden relative">
        {/* Top Header of Map */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 border-b-2 border-slate-700 pb-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-amber-400 border-2 border-slate-900 rounded-2xl flex items-center justify-center shadow-[0_3px_0_#000] shrink-0">
              <Compass className="w-7 h-7 text-slate-950" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-black uppercase text-amber-400 tracking-wider font-mario">
                  OVERWORLD LEVEL SELECT
                </span>
                <span className="text-emerald-300 text-xs font-bold tabular-nums">
                  · {completedTopicIds.length}/{ALL_LAW_TOPICS.length} Topics · {totalClearedWorlds}/5 Worlds
                </span>
              </div>
              <h2 className="text-2xl md:text-3xl font-black text-white font-display">
                MUSHROOM KINGDOM INTERACTIVE MAP
              </h2>
              <div className="flex flex-wrap items-center gap-2 pt-1.5">
                {onOpenWalkthrough && (
                  <button
                    type="button"
                    onClick={() => {
                      onOpenWalkthrough();
                      marioAudio.playCoin();
                    }}
                    className="h-8 px-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs border-2 border-black shadow-[0_2px_0_#000] inline-flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
                  >
                    <Compass className="w-3.5 h-3.5" />
                    <span>App Guide Tour</span>
                  </button>
                )}
                {onOpenProfile && (
                  <button
                    type="button"
                    onClick={() => {
                      onOpenProfile();
                      marioAudio.playCoin();
                    }}
                    className="h-8 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-amber-300 font-black text-xs border-2 border-slate-700 inline-flex items-center gap-1.5 cursor-pointer whitespace-nowrap tabular-nums"
                  >
                    <Award className="w-3.5 h-3.5" />
                    <span>Achievements ({unlockedAchievementsCount}/12)</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Active Hero Summary + All 24 Characters Toggle */}
          <div className="flex flex-wrap items-center gap-2 bg-slate-900/95 px-3 py-2 rounded-2xl border-2 border-slate-700 w-full lg:w-auto justify-between lg:justify-end">
            <div className="inline-flex items-center gap-2.5">
              <div className="w-9 h-9 bg-amber-400 rounded-xl border-2 border-black flex items-center justify-center shrink-0">
                <MarioCharacterAvatar character={equippedAvatar} className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] font-black text-amber-400 uppercase font-mario block leading-none">
                  HERO ({HERO_ROSTER.length} AVAILABLE)
                </span>
                <span className="text-xs sm:text-sm font-black text-white font-display block mt-0.5 leading-tight">
                  {activeHeroMeta.name} •{' '}
                  <span className="text-slate-300 font-semibold">{activeHeroMeta.title}</span>
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                setShowAllHeroes((v) => !v);
                marioAudio.playPipe();
              }}
              className="h-9 inline-flex items-center justify-center gap-1.5 px-3.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs border-2 border-black shadow-[0_2px_0_#000] cursor-pointer whitespace-nowrap"
            >
              <Users className="w-3.5 h-3.5 shrink-0" />
              <span>{showAllHeroes ? 'Hide Roster' : `All ${HERO_ROSTER.length} Heroes`}</span>
              {showAllHeroes ? (
                <ChevronUp className="w-3.5 h-3.5 shrink-0" />
              ) : (
                <ChevronDown className="w-3.5 h-3.5 shrink-0" />
              )}
            </button>
          </div>
        </div>

        {/* Full 24-Character Aligned Grid */}
        <div className="mb-4 bg-slate-900/95 border-2 border-slate-700 rounded-2xl p-3">
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2">
            {(showAllHeroes ? HERO_ROSTER : HERO_ROSTER.slice(0, 8)).map((hero) => {
              const isSelected = equippedAvatar === hero.id;
              return (
                <button
                  key={hero.id}
                  type="button"
                  onClick={() => handleSelectHero(hero.id)}
                  className={`h-10 px-2.5 rounded-xl border-2 inline-flex items-center justify-start gap-2 transition-all cursor-pointer leading-none min-w-0 ${
                    isSelected
                      ? 'bg-amber-400 text-slate-950 border-black shadow-[0_2px_0_#000]'
                      : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
                  }`}
                >
                  <MarioCharacterAvatar character={hero.id} className="w-5 h-5 shrink-0" />
                  <span className="text-xs font-black truncate">{hero.shortName}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 2D Canvas-style Interactive Map Display with Live Unlocked/Cleared Progress */}
        <div
          data-testid="interactive-world-map"
          className="relative w-full h-[460px] md:h-[500px] bg-[#064e3b] rounded-2xl border-4 border-slate-950 overflow-hidden shadow-inner select-none"
        >
          <div
            className="absolute inset-0 opacity-40"
            style={{
              backgroundImage: `radial-gradient(#10b981 15%, transparent 16%), radial-gradient(#059669 15%, transparent 16%)`,
              backgroundSize: '36px 36px',
              backgroundPosition: '0 0, 18px 18px',
            }}
          />

          <div className="absolute inset-x-0 bottom-0 h-28 bg-[#1e3a8a]/70 border-t-4 border-[#3b82f6]/40" />

          {/* Dotted / Illuminated Level Trail Lines */}
          <svg
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            className="absolute inset-0 w-full h-full pointer-events-none z-0"
          >
            <path
              d="M 16 70 Q 22 50 30 36"
              stroke={worldProgressMap.world2?.isWorldUnlocked ? '#34d399' : '#F59E0B'}
              strokeWidth="1.4"
              strokeDasharray={worldProgressMap.world1?.isWorldCleared ? undefined : '2 2'}
              fill="none"
            />
            <path d="M 30 36 L 42 17" stroke="#EC4899" strokeWidth="1.2" strokeDasharray="1.8 1.8" fill="none" />
            <path
              d="M 30 36 Q 40 55 52 72"
              stroke={worldProgressMap.world3?.isWorldUnlocked ? '#34d399' : '#F59E0B'}
              strokeWidth="1.4"
              strokeDasharray={worldProgressMap.world2?.isWorldCleared ? undefined : '2 2'}
              fill="none"
            />
            <path
              d="M 52 72 Q 62 48 70 34"
              stroke={worldProgressMap.world4?.isWorldUnlocked ? '#34d399' : '#F59E0B'}
              strokeWidth="1.4"
              strokeDasharray={worldProgressMap.world3?.isWorldCleared ? undefined : '2 2'}
              fill="none"
            />
            <path
              d="M 70 34 Q 78 48 84 62"
              stroke={worldProgressMap.world5?.isWorldUnlocked ? '#34d399' : '#F59E0B'}
              strokeWidth="1.4"
              strokeDasharray={worldProgressMap.world4?.isWorldCleared ? undefined : '2 2'}
              fill="none"
            />
            <path d="M 16 70 L 34 84" stroke="#10B981" strokeWidth="1" strokeDasharray="1.5 1.5" fill="none" />
            <path d="M 42 17 L 68 15 L 70 34" stroke="#FCD34D" strokeWidth="1" strokeDasharray="1.5 1.5" fill="none" />
          </svg>

          {/* Map Legend Pill */}
          <div className="absolute top-2.5 left-2.5 z-10 bg-slate-950/85 border border-slate-700 rounded-xl px-2.5 py-1.5 flex items-center gap-2.5 text-[10px] font-bold text-slate-200">
            <span className="inline-flex items-center gap-1 text-emerald-300">
              <CheckCircle2 className="w-3 h-3" /> Cleared
            </span>
            <span className="inline-flex items-center gap-1 text-amber-300">
              <Unlock className="w-3 h-3" /> Unlocked
            </span>
            <span className="hidden sm:inline text-slate-400">
              Tap a node to inspect stages, double-tap or click &ldquo;Enter&rdquo; to warp
            </span>
          </div>

          {/* Map Level Nodes */}
          {MAP_NODES.map((node) => {
            const isSelected = selectedNode.id === node.id;
            const isActive = activeWorld === node.id;
            const wp = worldProgressMap[node.id];
            const isCleared = Boolean(wp?.isWorldCleared);
            const isUnlocked = wp ? wp.isWorldUnlocked : true;

            return (
              <div
                key={node.id}
                style={{ left: `${node.x}%`, top: `${node.y}%` }}
                className="absolute -translate-x-1/2 -translate-y-1/2 z-10"
              >
                <button
                  type="button"
                  data-testid={`map-node-${node.id}`}
                  onClick={() => handleNodeInspect(node)}
                  onDoubleClick={() => onSelectWorld(node.id)}
                  className={`group relative flex flex-col items-center focus:outline-none cursor-pointer transition-transform duration-200 ${
                    isActive || isSelected ? 'scale-105 sm:scale-110' : 'hover:scale-105'
                  }`}
                >
                  {(isActive || isSelected) && (
                    <div className="absolute -top-9 sm:-top-10 animate-bounce">
                      <div className="bg-white/95 p-1 rounded-full border-2 border-black shadow-md">
                        <MarioCharacterAvatar
                          character={equippedAvatar}
                          className="w-6 h-6 sm:w-7 sm:h-7"
                        />
                      </div>
                    </div>
                  )}

                  {/* Cleared Star / Lock Corner Badge */}
                  {wp && (
                    <span
                      className={`absolute -top-2 -right-2 z-20 w-5 h-5 sm:w-6 sm:h-6 rounded-full border-2 border-black flex items-center justify-center shadow ${
                        isCleared
                          ? 'bg-emerald-400 text-slate-950'
                          : isUnlocked
                          ? 'bg-amber-300 text-slate-950'
                          : 'bg-slate-800 text-slate-300'
                      }`}
                      title={
                        isCleared
                          ? 'World 100% Mastered!'
                          : isUnlocked
                          ? `Unlocked (${wp.completedCount}/${wp.totalCount})`
                          : 'Complete a topic in the previous World to unlock trail'
                      }
                    >
                      {isCleared ? (
                        <CheckCircle2 className="w-3.5 h-3.5 stroke-[3]" />
                      ) : isUnlocked ? (
                        <Unlock className="w-3 h-3 stroke-[2.5]" />
                      ) : (
                        <Lock className="w-3 h-3 stroke-[2.5]" />
                      )}
                    </span>
                  )}

                  <div
                    className={`w-11 h-11 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-2xl flex items-center justify-center border-3 sm:border-4 border-slate-950 transition-all ${
                      isCleared
                        ? 'bg-emerald-500 shadow-[0_0_16px_#10b981]'
                        : isSelected || isActive
                        ? 'bg-amber-400 shadow-[0_0_15px_#f59e0b]'
                        : node.iconType === 'pipe'
                        ? 'bg-emerald-600'
                        : node.iconType === 'holiday'
                        ? 'bg-pink-600'
                        : node.iconType === 'star'
                        ? 'bg-yellow-500'
                        : isUnlocked
                        ? 'bg-red-600'
                        : 'bg-slate-700 opacity-90'
                    }`}
                  >
                    {node.iconType === 'mushroom' && (
                      <MarioMushroomIcon className="w-6 h-6 sm:w-8 sm:h-8" />
                    )}
                    {node.iconType === 'flower' && (
                      <MarioFireFlowerIcon className="w-6 h-6 sm:w-8 sm:h-8" />
                    )}
                    {node.iconType === 'star' && (
                      <MarioStarIcon className="w-6 h-6 sm:w-8 sm:h-8" />
                    )}
                    {node.iconType === 'crown' && (
                      <MarioPeachCrownIcon className="w-6 h-6 sm:w-8 sm:h-8" />
                    )}
                    {node.iconType === '1up' && (
                      <Mario1UpIcon className="w-6 h-6 sm:w-8 sm:h-8" />
                    )}
                    {node.iconType === 'pipe' && (
                      <MarioPipeIcon className="w-6 h-6 sm:w-8 sm:h-8" />
                    )}
                    {node.iconType === 'holiday' && (
                      <Calendar
                        className={`w-5 h-5 sm:w-7 sm:h-7 ${
                          isSelected || isActive ? 'text-slate-950' : 'text-white'
                        }`}
                      />
                    )}
                  </div>

                  <div className="mt-1 px-1.5 sm:px-2.5 py-0.5 rounded-lg bg-slate-950/95 text-white border-2 border-slate-700 shadow font-black text-[9px] sm:text-[10px] whitespace-nowrap flex items-center gap-1">
                    <span>{node.levelNumber}</span>
                    {wp && (
                      <span
                        className={`px-1 rounded text-[8px] sm:text-[9px] font-mono ${
                          isCleared
                            ? 'bg-emerald-400 text-slate-950'
                            : 'bg-slate-800 text-amber-300'
                        }`}
                      >
                        {wp.completedCount}/{wp.totalCount}
                      </span>
                    )}
                  </div>
                </button>
              </div>
            );
          })}
        </div>

        {/* Selected Stage Dossier + Interactive Topic Unlock & Completion Checklist */}
        {selectedNode && (
          <div className="mt-5 bg-slate-900 border-3 border-amber-400 rounded-2xl p-4 sm:p-5 space-y-4">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="space-y-1.5 w-full md:w-auto">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="px-2.5 py-1 bg-red-600 text-white text-[11px] font-black rounded-md border border-black uppercase font-mario leading-none">
                    {selectedNode.levelNumber}
                  </span>
                  <span className="text-lg sm:text-xl font-black text-amber-300 font-display">
                    {selectedNode.name}: {selectedNode.worldName}
                  </span>
                  <span className="text-xs font-bold text-slate-300 bg-slate-800 px-2.5 py-0.5 rounded-md border border-slate-700">
                    {selectedNode.badge}
                  </span>
                  {selectedWorldProgress && (
                    <span
                      className={`px-2.5 py-0.5 rounded-md text-xs font-black border ${
                        selectedWorldProgress.isWorldCleared
                          ? 'bg-emerald-400 text-slate-950 border-black'
                          : 'bg-amber-400/20 text-amber-300 border-amber-400/40'
                      }`}
                    >
                      {selectedWorldProgress.isWorldCleared
                        ? '★ WORLD CLEARED (100%)'
                        : `${selectedWorldProgress.completedCount}/${selectedWorldProgress.totalCount} Stages Mastered (${selectedWorldProgress.percent}%)`}
                    </span>
                  )}
                </div>
                <p className={`${bodyTextClass} text-slate-200 font-semibold text-xs sm:text-sm`}>
                  {selectedNode.summary}
                </p>
              </div>

              <button
                type="button"
                onClick={() => onSelectWorld(selectedNode.id)}
                className="h-11 inline-flex items-center justify-center gap-2 px-6 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black rounded-xl border-3 border-black shadow-[0_4px_0_#000] active:translate-y-0.5 text-sm sm:text-base cursor-pointer transition-transform w-full md:w-auto flex-shrink-0 whitespace-nowrap"
              >
                <span>ENTER {selectedNode.levelNumber}</span>
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
              </button>
            </div>

            {/* Interactive Unlocked Topics Map Progression Grid */}
            {selectedWorldProgress && selectedWorldProgress.topics.length > 0 && (
              <div className="pt-3 border-t border-slate-800 space-y-2.5">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <span className="text-[10px] font-black uppercase text-amber-400 font-mario flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>STAGE UNLOCK PROGRESSION — COMPLETE ALL FOR +50 COINS LEVEL-UP!</span>
                  </span>
                  <div className="w-full sm:w-44 h-2.5 bg-slate-950 rounded-full border border-slate-700 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-amber-400 to-emerald-400 transition-all duration-300"
                      style={{ width: `${selectedWorldProgress.percent}%` }}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                  {selectedWorldProgress.topics.map((topic) => (
                    <div
                      key={topic.id}
                      data-testid={`map-topic-row-${topic.id}`}
                      className={`rounded-xl p-3 border-2 flex items-center justify-between gap-2.5 transition-all ${
                        topic.isCompleted
                          ? 'bg-emerald-950/45 border-emerald-400/80 text-white'
                          : topic.isUnlocked
                          ? 'bg-slate-800/90 border-amber-400/50 text-white'
                          : 'bg-slate-950/60 border-slate-800 text-slate-400'
                      }`}
                    >
                      <button
                        type="button"
                        onClick={() => {
                          if (onSelectTopic) {
                            onSelectTopic(selectedNode.id, topic.id);
                          } else {
                            onSelectWorld(selectedNode.id);
                          }
                        }}
                        className="flex items-center gap-2.5 min-w-0 text-left flex-1 cursor-pointer"
                      >
                        <span
                          className={`w-8 h-8 rounded-lg border border-black flex items-center justify-center shrink-0 font-black text-xs font-mario ${
                            topic.isCompleted
                              ? 'bg-emerald-400 text-slate-950'
                              : topic.isUnlocked
                              ? 'bg-amber-400 text-slate-950'
                              : 'bg-slate-800 text-slate-400'
                          }`}
                        >
                          {topic.isCompleted ? (
                            <CheckCircle2 className="w-4 h-4 stroke-[3]" />
                          ) : topic.isUnlocked ? (
                            <Unlock className="w-4 h-4" />
                          ) : (
                            <Lock className="w-4 h-4" />
                          )}
                        </span>
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="text-[10px] font-black font-mono uppercase text-amber-300">
                              Stage {selectedNode.levelNumber.replace('WORLD ', '')}-{topic.stageOrder}
                            </span>
                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-950 text-slate-300 font-bold">
                              {topic.badge}
                            </span>
                            <span
                              className={`text-[9px] font-black uppercase px-1.5 py-0.5 rounded ${
                                topic.isCompleted
                                  ? 'bg-emerald-500/25 text-emerald-300'
                                  : topic.isUnlocked
                                  ? 'bg-amber-500/20 text-amber-300'
                                  : 'bg-slate-800 text-slate-400'
                              }`}
                            >
                              {topic.isCompleted
                                ? 'CLEARED'
                                : topic.isUnlocked
                                ? 'UNLOCKED'
                                : 'NEXT UP'}
                            </span>
                          </div>
                          <p className="text-xs sm:text-sm font-black truncate mt-0.5">
                            {topic.title}
                          </p>
                        </div>
                      </button>

                      {onToggleTopicComplete && (
                        <button
                          type="button"
                          onClick={() => onToggleTopicComplete(topic.id)}
                          data-testid={`map-toggle-complete-${topic.id}`}
                          aria-label={
                            topic.isCompleted
                              ? `Unmark ${topic.title} as complete`
                              : `Mark ${topic.title} as complete`
                          }
                          className={`h-9 px-2.5 rounded-lg border border-black font-black text-[10px] font-mario inline-flex items-center justify-center gap-1 shrink-0 cursor-pointer transition-colors ${
                            topic.isCompleted
                              ? 'bg-emerald-400 hover:bg-emerald-300 text-slate-950'
                              : 'bg-slate-700 hover:bg-amber-400 hover:text-slate-950 text-amber-300'
                          }`}
                        >
                          {topic.isCompleted ? (
                            <>
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span className="hidden sm:inline">DONE</span>
                            </>
                          ) : (
                            <>
                              <MarioCoinIcon className="w-3.5 h-3.5" />
                              <span>+2</span>
                            </>
                          )}
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Group Members / Project Team Showcase Card */}
      <section
        aria-label="Project Group Members"
        data-testid="group-members-card"
        className="bg-white rounded-3xl mario-card border-4 border-slate-950 p-4 sm:p-6 shadow-[6px_6px_0_#000]"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b-2 border-slate-200 pb-3.5 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-amber-400 border-2 border-black flex items-center justify-center shrink-0 shadow-[0_2px_0_#000]">
              <Award className="w-6 h-6 text-slate-950" />
            </div>
            <div>
              <span className="text-[10px] font-black uppercase text-red-600 font-mario block">
                MUSHROOM KINGDOM LEGAL PARTY • AUTHORS
              </span>
              <h3 className="text-lg sm:text-xl font-black text-slate-950 font-display">
                PROJECT GROUP MEMBERS
              </h3>
            </div>
          </div>
          <span className="px-3 py-1 rounded-xl bg-slate-900 text-amber-300 font-black text-[10px] font-mario border border-black self-start sm:self-auto">
            {GROUP_MEMBERS.length} MEMBERS
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
          {GROUP_MEMBERS.map((memberName, idx) => (
            <div
              key={memberName}
              className="flex items-center gap-2.5 p-2.5 sm:p-3 rounded-2xl bg-slate-50 border-2 border-slate-900 shadow-[2px_2px_0_#0f172a]"
            >
              <span className="w-7 h-7 rounded-xl bg-red-600 text-white border border-black font-black text-xs font-mario inline-flex items-center justify-center shrink-0">
                {idx + 1}
              </span>
              <span className="font-black text-xs sm:text-sm text-slate-950 tracking-tight truncate">
                {memberName}
              </span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
