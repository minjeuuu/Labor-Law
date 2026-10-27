import React, { useState, useMemo, useEffect } from 'react';
import {
  ALL_LAW_TOPICS,
  WORLDS_METADATA,
} from './data/laborLawData';
import { Navbar } from './components/Navbar';
import { WorldMap } from './components/WorldMap';
import { TopicCard } from './components/TopicCard';
import { StageProgressBar } from './components/StageProgressBar';
import { BenefitsCalculator } from './components/Calculator';
import { RegionalWageMatrix } from './components/RegionalWageMatrix';
import { FlashcardsView } from './components/FlashcardsView';
import { BarQuizQuest } from './components/BarQuizQuest';
import { Game2D } from './components/Game2D';
import { Game3D } from './components/Game3D';
import { GameVault } from './components/GameVault';
import { ToadShop } from './components/ToadShop';
import { HolidaysView } from './components/HolidaysView';
import { DailyRewardModal } from './components/DailyRewardModal';
import { AutoScrollController } from './components/AutoScrollController';
import { ExportProgressModal } from './components/ExportProgressModal';
import { GlobalSearchModal } from './components/GlobalSearchModal';
import { PrintStudyGuideModal } from './components/PrintStudyGuideModal';
import { StudyNotesDrawer } from './components/StudyNotesDrawer';
import { LevelUpModal } from './components/LevelUpModal';
import { OfflineIndicator } from './components/PWAInstallButton';
import { UserProfileModal } from './components/UserProfileModal';
import { AppWalkthroughModal } from './components/AppWalkthroughModal';
import {
  MarioMushroomIcon,
  MarioFireFlowerIcon,
  MarioStarIcon,
  MarioPeachCrownIcon,
  Mario1UpIcon,
  MarioCoinIcon,
} from './components/MarioIcons';
import { marioAudio } from './utils/audio';
import {
  syncDailyLoginStreak,
  readStoredStudyDifficulty,
  STUDY_DIFFICULTY_KEY,
} from './utils/studyModes';
import {
  CLAIMED_WORLD_LEVELUPS_KEY,
  evaluateWorldLevelUp,
  GROUP_MEMBERS,
  loadStudyNotes,
  StudyNoteItem,
} from './utils/engagementFeatures';
import {
  ColorMode,
  readStoredColorMode,
  saveStoredColorMode,
  shouldAutoOpenWalkthrough,
  markWalkthroughCompleted,
  loadPlayerProfileStats,
  savePlayerProfileStats,
  recordStudySeconds,
  recordPomodoroFocusFinish,
  recordCompletedQuizRun,
  evaluateAchievements,
  EvaluatedAchievement,
  PlayerProfileStats,
  QuizCompletionPayload,
} from './utils/profileAchievements';
import { MarioTheme, MarioAvatar, ComplexityMode, StudyDifficulty } from './types/laborLaw';
import {
  ArrowRight,
  ShoppingBag,
  Flame,
  Calendar,
  Users,
  Award,
  X,
  Compass,
  BookOpen,
  HelpCircle,
  Trophy,
  Gamepad2,
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('map');
  const [activeWorld, setActiveWorld] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [fontSize, setFontSize] = useState<'normal' | 'large' | 'xlarge'>('normal');
  const [coins, setCoins] = useState<number>(35);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [zenMode, setZenMode] = useState<boolean>(false);

  // Modals & Persistent Drawers
  const [isDailyRewardOpen, setIsDailyRewardOpen] = useState<boolean>(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState<boolean>(false);
  const [isGlobalSearchOpen, setIsGlobalSearchOpen] = useState<boolean>(false);
  const [isPrintGuideOpen, setIsPrintGuideOpen] = useState<boolean>(false);
  const [isProfileOpen, setIsProfileOpen] = useState<boolean>(false);
  const [isWalkthroughOpen, setIsWalkthroughOpen] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return shouldAutoOpenWalkthrough(window.location.search, window.localStorage);
    }
    return false;
  });

  // Dark / Light Mode state synced with <html class="dark">
  const [colorMode, setColorMode] = useState<ColorMode>(() => {
    if (typeof window !== 'undefined') {
      return readStoredColorMode(window.localStorage);
    }
    return 'light';
  });

  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.classList.toggle('dark', colorMode === 'dark');
    }
    if (typeof window !== 'undefined') {
      saveStoredColorMode(colorMode, window.localStorage);
    }
  }, [colorMode]);

  const handleToggleColorMode = (explicitMode?: ColorMode) => {
    setColorMode((prev) =>
      explicitMode ? explicitMode : prev === 'dark' ? 'light' : 'dark'
    );
  };

  // Persistent Player Profile Stats & Achievements
  const [profileStats, setProfileStats] = useState<PlayerProfileStats>(() =>
    typeof window !== 'undefined'
      ? loadPlayerProfileStats(window.localStorage)
      : loadPlayerProfileStats(null)
  );
  const [achievementBanner, setAchievementBanner] = useState<EvaluatedAchievement | null>(
    null
  );

  const [studyNotes, setStudyNotes] = useState<StudyNoteItem[]>(() =>
    typeof window !== 'undefined' ? loadStudyNotes(window.localStorage) : []
  );
  const [claimedWorldIds, setClaimedWorldIds] = useState<string[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const raw = localStorage.getItem(CLAIMED_WORLD_LEVELUPS_KEY);
        return raw ? JSON.parse(raw) : [];
      } catch {
        return [];
      }
    }
    return [];
  });
  const [levelUpCelebration, setLevelUpCelebration] = useState<{
    worldId: string | null;
    bonusCoins: number;
  }>({ worldId: null, bonusCoins: 0 });

  // Global Ctrl+K / Cmd+K shortcut listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && (e.key === 'k' || e.key === 'K')) {
        e.preventDefault();
        setIsGlobalSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Unlocked Themes & Avatars
  const [activeTheme, setActiveTheme] = useState<MarioTheme>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('mario_active_theme') as MarioTheme;
        return saved || 'overworld';
      } catch {
        return 'overworld';
      }
    }
    return 'overworld';
  });

  const [equippedAvatar, setEquippedAvatar] = useState<MarioAvatar>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('mario_equipped_avatar') as MarioAvatar;
        return saved || 'mario';
      } catch {
        return 'mario';
      }
    }
    return 'mario';
  });

  // Complexity Mode: 'beginner' vs 'advanced'
  const [complexityMode, setComplexityMode] = useState<ComplexityMode>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('mario_complexity_mode') as ComplexityMode;
        return saved || 'beginner';
      } catch {
        return 'beginner';
      }
    }
    return 'beginner';
  });

  const handleSetComplexityMode = (mode: ComplexityMode) => {
    setComplexityMode(mode);
    try {
      localStorage.setItem('mario_complexity_mode', mode);
    } catch {
      // fallback
    }
  };

  // Global Study Difficulty ('casual' vs 'exam_prep') for Flashcards & Quizzes
  const [studyDifficulty, setStudyDifficultyState] = useState<StudyDifficulty>(() => {
    if (typeof window !== 'undefined') {
      try {
        return readStoredStudyDifficulty(window.localStorage);
      } catch {
        return 'exam_prep';
      }
    }
    return 'exam_prep';
  });

  const handleSetStudyDifficulty = (diff: StudyDifficulty) => {
    setStudyDifficultyState(diff);
    try {
      localStorage.setItem(STUDY_DIFFICULTY_KEY, diff);
    } catch {
      // fallback
    }
  };

  // Global Legal Citations Toggle for Bar students
  const [showLegalCitations, setShowLegalCitationsState] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('mario_legal_citations');
        return saved !== null ? saved === 'true' : true;
      } catch {
        return true;
      }
    }
    return true;
  });

  const handleSetShowLegalCitations = (show: boolean) => {
    setShowLegalCitationsState(show);
    try {
      localStorage.setItem('mario_legal_citations', String(show));
    } catch {
      // ignore
    }
  };

  // Daily Login Streak Counter synced with localStorage
  const [loginStreak, setLoginStreak] = useState<number>(() => {
    if (typeof window !== 'undefined') {
      try {
        return syncDailyLoginStreak(window.localStorage).streak;
      } catch {
        return 1;
      }
    }
    return 1;
  });

  const [isBonusClaimedToday, setIsBonusClaimedToday] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      try {
        return syncDailyLoginStreak(window.localStorage).isBonusClaimedToday;
      } catch {
        return false;
      }
    }
    return false;
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const synced = syncDailyLoginStreak(window.localStorage);
      setLoginStreak(synced.streak);
      setIsBonusClaimedToday(synced.isBonusClaimedToday);
    } catch {
      // fallback
    }
  }, []);

  // Completed / Studied topics persistence
  const [completedTopicIds, setCompletedTopicIds] = useState<string[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('mario_completed_topics');
        return saved ? JSON.parse(saved) : [];
      } catch {
        return [];
      }
    }
    return [];
  });

  const handleToggleTopicComplete = (topicId: string) => {
    const isNowDone = !completedTopicIds.includes(topicId);
    let next: string[];

    if (isNowDone) {
      next = [...completedTopicIds, topicId];
      // Coin collection SFX when topic is marked complete
      marioAudio.playCoin();

      const levelUpCheck = evaluateWorldLevelUp({
        toggledTopicId: topicId,
        previousCompletedIds: completedTopicIds,
        nextCompletedIds: next,
        allTopics: ALL_LAW_TOPICS,
        claimedWorldIds,
      });

      if (levelUpCheck.triggered && levelUpCheck.worldId) {
        setCoins((c) => c + 2 + levelUpCheck.bonusCoins);
        setClaimedWorldIds(levelUpCheck.updatedClaimedWorlds);
        try {
          localStorage.setItem(
            CLAIMED_WORLD_LEVELUPS_KEY,
            JSON.stringify(levelUpCheck.updatedClaimedWorlds)
          );
        } catch {
          // fallback
        }
        setLevelUpCelebration({
          worldId: levelUpCheck.worldId,
          bonusCoins: levelUpCheck.bonusCoins,
        });
      } else {
        setCoins((c) => c + 2);
      }
    } else {
      next = completedTopicIds.filter((id) => id !== topicId);
      marioAudio.playJump();
    }

    setCompletedTopicIds(next);
    try {
      localStorage.setItem('mario_completed_topics', JSON.stringify(next));
    } catch {
      // fallback
    }
  };

  const handleResetProgress = () => {
    setCompletedTopicIds([]);
    try {
      localStorage.removeItem('mario_completed_topics');
    } catch {
      // fallback
    }
    marioAudio.playPipe();
  };

  const handleMarkAllComplete = () => {
    const allIds = ALL_LAW_TOPICS.map((t) => t.id);
    setCompletedTopicIds(allIds);
    try {
      localStorage.setItem('mario_completed_topics', JSON.stringify(allIds));
    } catch {
      // fallback
    }
    marioAudio.playQuizComplete();
  };

  // Helper for world icons
  const renderWorldIcon = (iconType: string, className = 'w-5 h-5') => {
    switch (iconType) {
      case 'mushroom':
        return <MarioMushroomIcon className={className} />;
      case 'flower':
        return <MarioFireFlowerIcon className={className} />;
      case 'star':
        return <MarioStarIcon className={className} />;
      case 'crown':
        return <MarioPeachCrownIcon className={className} />;
      case '1up':
        return <Mario1UpIcon className={className} />;
      default:
        return <MarioMushroomIcon className={className} />;
    }
  };

  // Filter topics based on active world and search query
  const displayedTopics = useMemo(() => {
    return ALL_LAW_TOPICS.filter((topic) => {
      const matchesWorld = activeWorld === 'all' || topic.worldId === activeWorld;
      if (!matchesWorld) return false;

      if (!searchQuery.trim()) return true;

      const q = searchQuery.toLowerCase();
      const titleMatch = topic.title.toLowerCase().includes(q);
      const summaryMatch = topic.summary.toLowerCase().includes(q);
      const badgeMatch = topic.badge.toLowerCase().includes(q);
      const docMatch = topic.keyDoctrines.some((d) => d.toLowerCase().includes(q));
      const rulesMatch = topic.rules.some(
        (r) =>
          r.heading.toLowerCase().includes(q) ||
          (r.items && r.items.some((i) => i.toLowerCase().includes(q))) ||
          (r.description && r.description.toLowerCase().includes(q))
      );
      const tipsMatch = topic.barTips && topic.barTips.some((t) => t.toLowerCase().includes(q));

      return titleMatch || summaryMatch || badgeMatch || docMatch || rulesMatch || tipsMatch;
    });
  }, [activeWorld, searchQuery]);

  const handleWorldSelect = (worldId: string) => {
    setActiveWorld(worldId);
    marioAudio.playTabSwitch();
  };

  const handleMapWorldSelect = (worldId: string) => {
    if (worldId === 'warp_calc') {
      setActiveTab('calculator');
    } else if (worldId === 'wages_matrix') {
      setActiveTab('wages_matrix');
    } else if (worldId === 'holidays') {
      setActiveTab('holidays');
    } else {
      setActiveWorld(worldId);
      setActiveTab('modules');
    }
    marioAudio.playTabSwitch();
  };

  const handleEarnCoin = () => {
    setCoins((c) => c + 1);
  };

  const handleEarnCoins = (amount: number) => {
    setCoins((c) => c + amount);
  };

  // Persist profile stats whenever updated
  useEffect(() => {
    if (typeof window !== 'undefined') {
      savePlayerProfileStats(profileStats, window.localStorage);
    }
  }, [profileStats]);

  // Passive active-study heartbeat (credits 15s every 15s while document is visible on study/quiz/calc tabs)
  useEffect(() => {
    if (typeof document === 'undefined') return;
    const interval = window.setInterval(() => {
      if (document.visibilityState === 'visible') {
        setProfileStats((prev) => recordStudySeconds(prev, 15));
      }
    }, 15000);
    return () => window.clearInterval(interval);
  }, []);

  const handlePomodoroStudySeconds = (secs: number) => {
    setProfileStats((prev) => recordStudySeconds(prev, secs));
  };

  const handlePomodoroFocusComplete = () => {
    setProfileStats((prev) => recordPomodoroFocusFinish(prev, 0));
  };

  const handleQuizCompleted = (payload: QuizCompletionPayload) => {
    setProfileStats((prev) => recordCompletedQuizRun(prev, payload));
  };

  const handleUpdatePlayerName = (name: string) => {
    setProfileStats((prev) => ({ ...prev, playerName: name }));
  };

  const handleSelectAvatarPersist = (avatar: MarioAvatar) => {
    setEquippedAvatar(avatar);
    try {
      localStorage.setItem('mario_equipped_avatar', avatar);
    } catch {
      // ignore
    }
  };

  const handleCompleteWalkthrough = (navigateToTab?: string) => {
    const firstGraduation = !profileStats.walkthroughCompleted;
    if (typeof window !== 'undefined') {
      markWalkthroughCompleted(window.localStorage);
    }
    if (firstGraduation) {
      setProfileStats((prev) => ({
        ...prev,
        walkthroughCompleted: true,
      }));
    }
    if (navigateToTab) {
      setActiveTab(navigateToTab);
    }
    setIsWalkthroughOpen(false);
  };

  const world1TopicIds = useMemo(
    () => ALL_LAW_TOPICS.filter((t) => t.worldId === 'world1').map((t) => t.id),
    []
  );

  const achievementSync = useMemo(
    () =>
      evaluateAchievements({
        stats: profileStats,
        completedTopicIds,
        totalTopicsCount: ALL_LAW_TOPICS.length,
        world1TopicIds,
        loginStreak,
        notesCount: studyNotes.length,
      }),
    [profileStats, completedTopicIds, world1TopicIds, loginStreak, studyNotes.length]
  );

  // Sync newly unlocked achievement dates & reward coins automatically
  useEffect(() => {
    if (achievementSync.newlyUnlocked.length > 0) {
      setProfileStats(achievementSync.updatedStats);
      if (achievementSync.totalBonusCoinsEarned > 0) {
        setCoins((c) => c + achievementSync.totalBonusCoinsEarned);
      }
      setAchievementBanner(achievementSync.newlyUnlocked[0]);
      marioAudio.playAchievementUnlock();
    }
  }, [achievementSync]);

  useEffect(() => {
    if (achievementBanner) {
      const timer = setTimeout(() => {
        setAchievementBanner(null);
      }, 6000);
      return () => clearTimeout(timer);
    }
  }, [achievementBanner]);

  const unlockedAchievementsCount = useMemo(
    () => achievementSync.achievements.filter((a) => a.unlocked).length,
    [achievementSync.achievements]
  );

  // Font styling class
  const bodyTextClass =
    fontSize === 'xlarge' ? 'text-xl' : fontSize === 'large' ? 'text-lg' : 'text-base';

  return (
    <div className={`min-h-screen flex flex-col text-slate-900 dark:text-slate-100 pb-16 antialiased theme-${activeTheme} max-w-full overflow-x-hidden`}>
      {/* Main Navigation Container — Safe Top Padding so UI is never cropped behind browser/system bars */}
      <div className="sticky top-0 z-40 w-full pt-2 sm:pt-3 bg-[#0f172a] safe-top-nav">
        <Navbar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          fontSize={fontSize}
          setFontSize={setFontSize}
          coins={coins}
          setCoins={setCoins}
          soundEnabled={soundEnabled}
          setSoundEnabled={setSoundEnabled}
          zenMode={zenMode}
          setZenMode={setZenMode}
          complexityMode={complexityMode}
          setComplexityMode={handleSetComplexityMode}
          studyDifficulty={studyDifficulty}
          setStudyDifficulty={handleSetStudyDifficulty}
          loginStreak={loginStreak}
          isBonusClaimedToday={isBonusClaimedToday}
          equippedAvatar={equippedAvatar}
          colorMode={colorMode}
          onToggleColorMode={() => handleToggleColorMode()}
          unlockedAchievementsCount={unlockedAchievementsCount}
          totalAchievementsCount={achievementSync.achievements.length}
          onOpenProfile={() => setIsProfileOpen(true)}
          onOpenWalkthrough={() => setIsWalkthroughOpen(true)}
          onStudySecondsTick={handlePomodoroStudySeconds}
          onFocusSessionComplete={handlePomodoroFocusComplete}
          onEarnCoins={handleEarnCoins}
          onOpenShop={() => {
            setActiveTab('shop');
            marioAudio.playCoin();
          }}
          onOpenDailyReward={() => setIsDailyRewardOpen(true)}
          onOpenExportProgress={() => setIsExportModalOpen(true)}
          onOpenGlobalSearch={() => setIsGlobalSearchOpen(true)}
          onOpenPrintGuide={() => setIsPrintGuideOpen(true)}
          showLegalCitations={showLegalCitations}
          setShowLegalCitations={handleSetShowLegalCitations}
        />
      </div>

      {/* Main Container with Mobile Bottom Nav Padding */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-3 sm:px-4 pt-4 sm:pt-6 md:pt-8 pb-24 lg:pb-8 overflow-x-hidden">
        {/* Tab 0: Super Mario World Overworld Interactive Map */}
        {activeTab === 'map' && (
          <div className="space-y-6">
            <WorldMap
              onSelectWorld={handleMapWorldSelect}
              onSelectTopic={(worldId, topicId) => {
                setActiveWorld(worldId);
                setActiveTab('modules');
                marioAudio.playPipe();
                setTimeout(() => {
                  const el = document.getElementById(`topic-card-${topicId}`);
                  el?.scrollIntoView({ behavior: 'smooth' });
                }, 150);
              }}
              activeWorld={activeWorld}
              fontSize={fontSize}
              equippedAvatar={equippedAvatar}
              setEquippedAvatar={setEquippedAvatar}
              completedTopicIds={completedTopicIds}
              onToggleTopicComplete={handleToggleTopicComplete}
              onOpenWalkthrough={() => setIsWalkthroughOpen(true)}
              onOpenProfile={() => setIsProfileOpen(true)}
              unlockedAchievementsCount={unlockedAchievementsCount}
            />

            {/* Quick Access Portal Banners — Equal Height & Aligned Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
              <button
                type="button"
                onClick={() => {
                  setActiveTab('modules');
                  setActiveWorld('all');
                  marioAudio.playTabSwitch();
                }}
                className="h-full text-left bg-white rounded-2xl p-4 border-4 border-slate-950 shadow-[4px_4px_0_#000] hover:-translate-y-1 transition-all cursor-pointer flex items-center justify-between gap-2"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-11 h-11 bg-red-100 border-2 border-red-700 rounded-xl flex items-center justify-center shrink-0">
                    <MarioMushroomIcon className="w-6 h-6" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-black text-slate-950 text-sm sm:text-base font-display truncate">All 6 Worlds</h3>
                    <p className="text-xs font-bold text-slate-600 truncate">Full statutory guide</p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-red-600 shrink-0" />
              </button>

              <button
                type="button"
                onClick={() => {
                  setActiveTab('holidays');
                  marioAudio.playTabSwitch();
                }}
                className="h-full text-left bg-white rounded-2xl p-4 border-4 border-slate-950 shadow-[4px_4px_0_#000] hover:-translate-y-1 transition-all cursor-pointer flex items-center justify-between gap-2"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-11 h-11 bg-rose-100 border-2 border-rose-700 rounded-xl flex items-center justify-center shrink-0">
                    <Calendar className="w-6 h-6 text-rose-700" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-black text-slate-950 text-sm sm:text-base font-display truncate">Holidays Hub</h3>
                    <p className="text-xs font-bold text-slate-600 truncate">12 Regular & Special</p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-rose-600 shrink-0" />
              </button>

              <button
                type="button"
                onClick={() => {
                  setActiveTab('shop');
                  marioAudio.playCoin();
                }}
                className="h-full text-left bg-white rounded-2xl p-4 border-4 border-slate-950 shadow-[4px_4px_0_#000] hover:-translate-y-1 transition-all cursor-pointer flex items-center justify-between gap-2"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-11 h-11 bg-emerald-100 border-2 border-emerald-600 rounded-xl flex items-center justify-center shrink-0">
                    <ShoppingBag className="w-6 h-6 text-emerald-800" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-black text-slate-950 text-sm sm:text-base font-display truncate">Toad&apos;s Shop</h3>
                    <p className="text-xs font-bold text-slate-600 truncate">All 24 Heroes</p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-emerald-600 shrink-0" />
              </button>

              <button
                type="button"
                onClick={() => {
                  setActiveTab('vault');
                  marioAudio.playCardAction();
                }}
                className="h-full text-left bg-white rounded-2xl p-4 border-4 border-slate-950 shadow-[4px_4px_0_#000] hover:-translate-y-1 transition-all cursor-pointer flex items-center justify-between gap-2"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-11 h-11 bg-amber-100 border-2 border-amber-600 rounded-xl flex items-center justify-center shrink-0">
                    <MarioStarIcon className="w-6 h-6" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-black text-slate-950 text-sm sm:text-base font-display truncate">Game Vault</h3>
                    <p className="text-xs font-bold text-slate-600 truncate">8 Arcade Games</p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-amber-600 shrink-0" />
              </button>

              <button
                type="button"
                onClick={() => {
                  setActiveTab('quiz');
                  marioAudio.playCardAction();
                }}
                className="h-full text-left bg-white rounded-2xl p-4 border-4 border-slate-950 shadow-[4px_4px_0_#000] hover:-translate-y-1 transition-all cursor-pointer flex items-center justify-between gap-2"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-11 h-11 bg-red-100 border-2 border-red-800 rounded-xl flex items-center justify-center shrink-0">
                    <Flame className="w-6 h-6 text-red-600" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-black text-slate-950 text-sm sm:text-base font-display truncate">Boss & Quiz</h3>
                    <p className="text-xs font-bold text-slate-600 truncate">95+ Bar Scenarios</p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-red-700 shrink-0" />
              </button>
            </div>
          </div>
        )}

        {/* Tab 1: All Unabridged Modules View */}
        {activeTab === 'modules' && (
          <div className="space-y-4 sm:space-y-6">
            {/* Breadcrumb Navigation Trail */}
            <nav
              aria-label="Module Breadcrumb Navigation"
              data-testid="modules-breadcrumb-nav"
              className="bg-white rounded-2xl border-3 border-slate-950 p-2 sm:p-2.5 shadow-[3px_3px_0_#000] flex items-center gap-1.5 sm:gap-2 flex-wrap text-xs font-black text-slate-800"
            >
              <button
                type="button"
                onClick={() => {
                  setActiveWorld('all');
                  marioAudio.playCoin();
                }}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                  activeWorld === 'all'
                    ? 'bg-amber-400 text-slate-950 border-2 border-black shadow-[0_1px_0_#000]'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                <MarioMushroomIcon className="w-3.5 h-3.5 shrink-0" />
                <span>Labor Standards (All)</span>
              </button>

              <span className="text-slate-400 font-bold select-none">/</span>

              <div className="flex items-center gap-1 sm:gap-1.5 flex-wrap">
                {WORLDS_METADATA.map((w) => (
                  <button
                    key={w.id}
                    type="button"
                    onClick={() => {
                      setActiveWorld(w.id);
                      marioAudio.playPipe();
                    }}
                    className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs transition-all cursor-pointer ${
                      activeWorld === w.id
                        ? 'bg-red-600 text-white border-2 border-black shadow-[0_1px_0_#000] font-black'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold'
                    }`}
                  >
                    <span>W{w.worldNumber}:</span>
                    <span className="truncate max-w-[100px] sm:max-w-none">{w.shortTitle}</span>
                  </button>
                ))}
              </div>
            </nav>

            {/* Visual Progress Bar with Equipped Avatar */}
            <StageProgressBar
              completedCount={completedTopicIds.length}
              totalTopics={ALL_LAW_TOPICS.length}
              onResetProgress={handleResetProgress}
              onMarkAllComplete={handleMarkAllComplete}
              fontSize={fontSize}
              avatar={equippedAvatar}
              onOpenExportProgress={() => setIsExportModalOpen(true)}
            />

            {/* Stage Select Banner */}
            <div className="bg-white rounded-3xl mario-card border-4 border-slate-950 p-4 sm:p-6 md:p-8 shadow-[6px_6px_0_#000]">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b-2 border-slate-200 pb-4 mb-4">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-red-600 text-white font-black rounded-lg border border-black text-[11px] uppercase mb-1.5 font-mario">
                    <MarioMushroomIcon className="w-3.5 h-3.5" />
                    <span>PHILIPPINE LABOR STANDARDS</span>
                  </div>
                  <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-950 tracking-tight font-display">
                    LABOR STANDARDS & PROTECTIVE LAWS
                  </h1>
                  <p className={`${bodyTextClass} text-slate-700 font-bold mt-1 max-w-2xl text-xs sm:text-sm`}>
                    100% Unabridged memory aid with zero omissions: statutory provisions, standards, exceptions, and wage formulas.
                  </p>
                </div>

                {/* Complexity Quick Switcher in Modules Header */}
                <div className="flex items-center gap-2 bg-slate-900 p-1.5 rounded-2xl border-2 border-black self-start md:self-auto">
                  <span className="text-[10px] font-black uppercase text-amber-400 font-mario pl-2">MODE:</span>
                  <button
                    onClick={() => handleSetComplexityMode('beginner')}
                    className={`flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-black transition-all cursor-pointer ${
                      complexityMode === 'beginner'
                        ? 'bg-amber-400 text-slate-950 shadow-[0_2px_0_#000]'
                        : 'text-slate-300 hover:text-white'
                    }`}
                  >
                    <MarioMushroomIcon className="w-3.5 h-3.5" />
                    <span>Beginner</span>
                  </button>
                  <button
                    onClick={() => handleSetComplexityMode('advanced')}
                    className={`flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-black transition-all cursor-pointer ${
                      complexityMode === 'advanced'
                        ? 'bg-red-600 text-white shadow-[0_2px_0_#000]'
                        : 'text-slate-300 hover:text-white'
                    }`}
                  >
                    <Flame className="w-3.5 h-3.5" />
                    <span>Advanced</span>
                  </button>
                </div>
              </div>

              {/* World Selector Stage Buttons - Mobile Responsive Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-2 sm:gap-2.5">
                <button
                  onClick={() => handleWorldSelect('all')}
                  className={`p-2.5 sm:p-3 rounded-2xl border-2 sm:border-3 border-black text-left transition-all cursor-pointer ${
                    activeWorld === 'all'
                      ? 'bg-amber-400 text-slate-950 shadow-[0_3px_0_#000] -translate-y-0.5'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-800'
                  }`}
                >
                  <span className="text-[10px] font-black uppercase text-slate-600 block font-mario">ALL WORLDS</span>
                  <span className="font-black text-xs sm:text-sm flex items-center justify-between mt-1">
                    <span>Complete View</span>
                    <MarioStarIcon className="w-4 h-4 flex-shrink-0" />
                  </span>
                </button>

                {WORLDS_METADATA.map((w) => (
                  <button
                    key={w.id}
                    onClick={() => handleWorldSelect(w.id)}
                    className={`p-2.5 sm:p-3 rounded-2xl border-2 sm:border-3 border-black text-left transition-all cursor-pointer ${
                      activeWorld === w.id
                        ? 'bg-amber-400 text-slate-950 shadow-[0_3px_0_#000] -translate-y-0.5'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-800'
                    }`}
                  >
                    <span className="text-[10px] font-black uppercase text-slate-600 block font-mario">
                      WORLD {w.worldNumber}
                    </span>
                    <span className="font-black text-xs sm:text-sm flex items-center justify-between mt-1">
                      <span className="truncate">{w.shortTitle}</span>
                      {renderWorldIcon(w.iconType, 'w-4 h-4 flex-shrink-0')}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Active World Spotlight Banner */}
            {activeWorld !== 'all' && (
              <div className="bg-[#1e293b] text-white rounded-2xl p-4 sm:p-5 border-3 border-black shadow-[4px_4px_0_#000] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-amber-400 rounded-xl border-2 border-black flex items-center justify-center flex-shrink-0">
                    {renderWorldIcon(
                      WORLDS_METADATA.find((w) => w.id === activeWorld)?.iconType || 'mushroom',
                      'w-6 h-6'
                    )}
                  </div>
                  <div>
                    <h2 className="text-lg sm:text-xl font-black text-amber-300 font-display">
                      {WORLDS_METADATA.find((w) => w.id === activeWorld)?.title}
                    </h2>
                    <p className="text-xs sm:text-sm font-semibold text-slate-300">
                      {WORLDS_METADATA.find((w) => w.id === activeWorld)?.description}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => handleWorldSelect('all')}
                  className="px-3 py-1.5 bg-white/20 hover:bg-white/30 text-white text-xs font-black rounded-xl border border-white/40 cursor-pointer self-end sm:self-auto flex-shrink-0"
                >
                  Show All Worlds
                </button>
              </div>
            )}

            {/* Topics Stream with Studied Tracking */}
            {displayedTopics.length > 0 ? (
              <div className="space-y-6">
                {displayedTopics.map((topic) => (
                  <TopicCard
                    key={topic.id}
                    topic={topic}
                    fontSize={fontSize}
                    searchQuery={searchQuery}
                    isCompleted={completedTopicIds.includes(topic.id)}
                    onToggleComplete={() => handleToggleTopicComplete(topic.id)}
                    complexityMode={complexityMode}
                    showLegalCitations={showLegalCitations}
                  />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-3xl mario-card border-4 border-slate-900 p-8 sm:p-12 text-center space-y-4">
                <div className="w-14 h-14 bg-red-100 rounded-full border-2 border-red-500 mx-auto flex items-center justify-center">
                  <MarioMushroomIcon className="w-8 h-8" />
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-slate-900 font-display">
                  No doctrines matched "{searchQuery}"
                </h3>
                <p className="text-slate-600 font-semibold max-w-md mx-auto text-sm">
                  Try searching for keywords like "overtime", "brownout", "kasambahay", "service charge", "lactation", or "distortion".
                </p>
                <button
                  onClick={() => setSearchQuery('')}
                  className="px-6 py-2.5 bg-amber-400 text-slate-950 font-black rounded-xl border-2 border-black cursor-pointer shadow-[0_2px_0_#000]"
                >
                  Clear Search
                </button>
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Toad's Item Shop */}
        {activeTab === 'shop' && (
          <ToadShop
            coins={coins}
            setCoins={setCoins}
            activeTheme={activeTheme}
            setActiveTheme={setActiveTheme}
            equippedAvatar={equippedAvatar}
            setEquippedAvatar={setEquippedAvatar}
          />
        )}

        {/* Tab 3: Warp Zone Multiplier & Wage Calculator */}
        {activeTab === 'calculator' && (
          <BenefitsCalculator fontSize={fontSize} />
        )}

        {/* Tab 4: Regional Wage Matrix */}
        {activeTab === 'wages_matrix' && (
          <RegionalWageMatrix fontSize={fontSize} />
        )}

        {/* Tab 5: [ ? ] Mystery Block Flashcards */}
        {activeTab === 'flashcards' && (
          <FlashcardsView
            fontSize={fontSize}
            onEarnCoin={handleEarnCoin}
            onEarnCoins={handleEarnCoins}
            studyDifficulty={studyDifficulty}
            setStudyDifficulty={handleSetStudyDifficulty}
            activeWorld={activeWorld}
          />
        )}

        {/* Tab 6: Mario Arcade Game Vault (Labor Kart GP, 2D Platformer, 3D Island) */}
        {(activeTab === 'vault' || activeTab === 'game2d' || activeTab === 'game3d') && (
          <GameVault
            equippedAvatar={equippedAvatar}
            setEquippedAvatar={setEquippedAvatar}
            coins={coins}
            setCoins={setCoins}
            fontSize={fontSize}
          />
        )}

        {/* Tab 7: Dedicated Philippine Holidays Hub */}
        {activeTab === 'holidays' && (
          <HolidaysView fontSize={fontSize} onEarnCoins={handleEarnCoins} />
        )}

        {/* Tab 8: Castle Quest & Boss Battle */}
        {activeTab === 'quiz' && (
          <BarQuizQuest
            fontSize={fontSize}
            onEarnCoins={handleEarnCoins}
            activeWorld={activeWorld}
            onChangeActiveWorld={setActiveWorld}
            studyDifficulty={studyDifficulty}
            setStudyDifficulty={handleSetStudyDifficulty}
            onQuizCompleted={handleQuizCompleted}
            onOpenProfile={() => setIsProfileOpen(true)}
            unlockedAchievementsCount={unlockedAchievementsCount}
          />
        )}
      </main>

      {/* Achievement Unlocked Celebration Toast */}
      {achievementBanner && (
        <div
          role="status"
          data-testid="achievement-unlocked-toast"
          className="fixed top-24 right-3 left-3 sm:left-auto sm:top-24 sm:right-6 z-40 sm:max-w-sm bg-[#0f172a] text-white rounded-2xl border-3 border-amber-400 shadow-[6px_6px_0_#000] p-3.5 flex items-start gap-3 print:hidden"
        >
          <div className="w-10 h-10 rounded-xl bg-amber-400 text-slate-950 border-2 border-black flex items-center justify-center shrink-0">
            <Award className="w-5 h-5" />
          </div>
          <div className="min-w-0 flex-1 space-y-0.5">
            <span className="text-[10px] font-black uppercase text-amber-400 font-mario block">
              ACHIEVEMENT UNLOCKED!
            </span>
            <p className="text-sm font-black text-white font-display truncate">
              {achievementBanner.title}
            </p>
            <p className="text-xs text-slate-300 font-semibold flex items-center gap-1.5">
              <span>{achievementBanner.milestoneLabel}</span>
              <span className="inline-flex items-center gap-0.5 text-amber-300 font-black">
                <MarioCoinIcon className="w-3 h-3" />+{achievementBanner.coinReward}
              </span>
            </p>
            <button
              type="button"
              onClick={() => {
                setAchievementBanner(null);
                setIsProfileOpen(true);
              }}
              className="text-xs font-black text-emerald-300 hover:text-emerald-200 pt-0.5 cursor-pointer"
            >
              View Profile Badges →
            </button>
          </div>
          <button
            type="button"
            onClick={() => setAchievementBanner(null)}
            aria-label="Dismiss Achievement Notification"
            className="text-slate-400 hover:text-white cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* User Profile & Milestone Achievements Modal */}
      <UserProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        stats={profileStats}
        onUpdatePlayerName={handleUpdatePlayerName}
        achievements={achievementSync.achievements}
        equippedAvatar={equippedAvatar}
        onSelectAvatar={handleSelectAvatarPersist}
        coins={coins}
        loginStreak={loginStreak}
        completedTopicsCount={completedTopicIds.length}
        totalTopicsCount={ALL_LAW_TOPICS.length}
        onNavigateAction={(tab, worldId) => {
          setActiveTab(tab);
          if (worldId) setActiveWorld(worldId);
          marioAudio.playTabSwitch();
        }}
        onOpenWalkthrough={() => setIsWalkthroughOpen(true)}
        onOpenExportScoreCard={() => setIsExportModalOpen(true)}
      />

      {/* First-Time & On-Demand Complete 10-Chapter App Walkthrough Guide */}
      <AppWalkthroughModal
        isOpen={isWalkthroughOpen}
        onClose={() => handleCompleteWalkthrough()}
        onCompleteWalkthrough={handleCompleteWalkthrough}
        colorMode={colorMode}
        onToggleColorMode={(m) => handleToggleColorMode(m)}
        studyDifficulty={studyDifficulty}
        onSelectDifficulty={handleSetStudyDifficulty}
        equippedAvatar={equippedAvatar}
        onSelectAvatar={handleSelectAvatarPersist}
        alreadyGraduated={profileStats.walkthroughCompleted}
      />

      {/* Daily Login Reward Modal */}
      <DailyRewardModal
        isOpen={isDailyRewardOpen}
        onClose={() => setIsDailyRewardOpen(false)}
        coins={coins}
        setCoins={setCoins}
        streak={loginStreak}
        isBonusClaimedToday={isBonusClaimedToday}
        onClaimSuccess={(updatedStreak) => {
          setLoginStreak(updatedStreak);
          setIsBonusClaimedToday(true);
        }}
      />

      {/* Export Player Score Card Modal */}
      <ExportProgressModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        completedTopicIds={completedTopicIds}
        coins={coins}
      />

      {/* Global Search Modal (Ctrl+K) */}
      <GlobalSearchModal
        isOpen={isGlobalSearchOpen}
        onClose={() => setIsGlobalSearchOpen(false)}
        onSelectResult={(tab, targetId) => {
          setActiveTab(tab);
          if (targetId) {
            setActiveWorld('all');
            setTimeout(() => {
              const el = document.getElementById(`topic-card-${targetId}`);
              el?.scrollIntoView({ behavior: 'smooth' });
            }, 150);
          }
        }}
        onOpenPrintGuide={() => setIsPrintGuideOpen(true)}
        onOpenShop={() => {
          setActiveTab('shop');
          marioAudio.playCoin();
        }}
      />

      {/* Print Study Guide & PDF Generator Modal */}
      <PrintStudyGuideModal
        isOpen={isPrintGuideOpen}
        onClose={() => setIsPrintGuideOpen(false)}
        completedTopicIds={completedTopicIds}
        coins={coins}
        studyNotes={studyNotes}
      />

      {/* World Completion 'Level Up' Celebration Modal */}
      <LevelUpModal
        worldId={levelUpCelebration.worldId}
        bonusCoins={levelUpCelebration.bonusCoins}
        onClose={() => setLevelUpCelebration({ worldId: null, bonusCoins: 0 })}
        onOpenWorldMap={() => {
          setActiveTab('map');
          marioAudio.playTabSwitch();
        }}
      />

      {/* Persistent Floating Right-Side 'Study Notes' Drawer */}
      <StudyNotesDrawer
        activeWorld={activeWorld}
        activeTab={activeTab}
        onNotesChange={setStudyNotes}
      />

      {/* PWA Offline Connectivity Indicator */}
      <OfflineIndicator />

      {/* Floating Auto-Scroll Speed Controller */}
      <AutoScrollController />

      {/* Mario Ground Footer with Group Members Credits */}
      <footer className="mt-16 bg-[#1e293b] border-t-4 border-black text-amber-100 py-8 px-4 shadow-[0_-4px_0_rgba(0,0,0,0.3)] print:hidden">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 font-bold text-sm border-b border-slate-700 pb-5">
            <div className="flex items-center gap-3">
              <MarioMushroomIcon className="w-6 h-6 flex-shrink-0" />
              <span className="text-white font-black text-sm sm:text-base font-display">
                SUPER MARIO LABOR ADVENTURE
              </span>
              <span className="text-amber-300 font-semibold hidden sm:inline">
                • Philippine Labor Standards Guide
              </span>
            </div>
            <div className="flex items-center gap-2 sm:gap-3 text-xs font-semibold text-slate-300 flex-wrap justify-center">
              <span>Hours of Work</span>
              <span>•</span>
              <span>Rest &amp; Holidays</span>
              <span>•</span>
              <span>Wages &amp; D.O. 174</span>
              <span>•</span>
              <span>Special Groups</span>
              <span>•</span>
              <span>Protective Laws</span>
              <span>•</span>
              <span>Statutory Leaves</span>
            </div>
          </div>

          {/* Group Members Roster in Global Footer */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-center md:justify-start gap-2 text-xs font-black uppercase text-amber-300 font-mario">
              <Users className="w-4 h-4 text-amber-400 shrink-0" />
              <span>GROUP MEMBERS</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 text-xs font-bold text-slate-100">
              {GROUP_MEMBERS.map((member) => (
                <div
                  key={member}
                  className="bg-slate-900/80 border border-slate-700 rounded-xl px-3 py-2 flex items-center gap-2"
                >
                  <span className="w-2 h-2 rounded-full bg-amber-400 shrink-0" />
                  <span className="truncate">{member}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </footer>

      {/* Ultra Mobile-Friendly Bottom Navigation Bar */}
      <nav
        aria-label="Mobile Bottom Navigation"
        data-testid="mobile-bottom-nav"
        className="fixed bottom-0 inset-x-0 z-40 bg-slate-950/95 border-t-3 border-amber-400 backdrop-blur-md px-2 py-1.5 flex items-center justify-around gap-1 lg:hidden shadow-[0_-4px_12px_rgba(0,0,0,0.6)] select-none print:hidden"
      >
        {[
          { id: 'map', label: 'Map', icon: <Compass className="w-5 h-5 shrink-0" /> },
          { id: 'modules', label: 'Modules', icon: <BookOpen className="w-5 h-5 shrink-0" /> },
          { id: 'flashcards', label: 'Cards', icon: <HelpCircle className="w-5 h-5 shrink-0" /> },
          { id: 'quiz', label: 'Boss Quest', icon: <Trophy className="w-5 h-5 shrink-0" /> },
          { id: 'vault', label: 'Arcade', icon: <Gamepad2 className="w-5 h-5 shrink-0" /> },
        ].map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => {
                setActiveTab(tab.id);
                marioAudio.playTabSwitch();
              }}
              className={`flex flex-col items-center justify-center flex-1 py-1 px-1 rounded-xl transition-all cursor-pointer ${
                isActive
                  ? 'bg-amber-400 text-slate-950 font-black shadow-[0_2px_0_#000]'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              {tab.icon}
              <span className="text-[10px] font-black uppercase font-mario mt-0.5 leading-none">
                {tab.label}
              </span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}
