import React, { useState } from 'react';
import {
  MarioTheme,
  MarioAvatar,
  ShopItem,
} from '../types/laborLaw';
import { HERO_ROSTER } from '../data/heroesData';
import {
  MarioCoinIcon,
  MarioMushroomIcon,
  MarioCharacterAvatar,
  MarioStarIcon,
  Mario1UpIcon,
  MarioFireFlowerIcon,
  MarioPeachCrownIcon,
  MarioLakituCloudIcon,
  MarioIceFlowerIcon,
  MarioBowserIcon,
} from './MarioIcons';
import { marioAudio } from '../utils/audio';
import confetti from 'canvas-confetti';
import {
  ShoppingBag,
  Palette,
  User,
  Zap,
  X,
  Users,
  Volume2,
  Crown,
  FileCheck2,
  Sparkles,
  HelpCircle,
  Printer,
  ShieldCheck,
  Check,
} from 'lucide-react';

interface ToadShopProps {
  coins: number;
  setCoins: React.Dispatch<React.SetStateAction<number>>;
  activeTheme: MarioTheme;
  setActiveTheme: (theme: MarioTheme) => void;
  equippedAvatar: MarioAvatar;
  setEquippedAvatar: (avatar: MarioAvatar) => void;
  onClose?: () => void;
  isModal?: boolean;
}

export const THEME_ITEMS: ShopItem[] = [
  {
    id: 'theme_overworld',
    name: 'Overworld Classic',
    category: 'theme',
    themeId: 'overworld',
    price: 0,
    description: 'Iconic Mario green pipes, bright sky clouds, and golden sunlight.',
    previewColor: '#0f172a',
  },
  {
    id: 'theme_underground',
    name: 'Underground Cavern',
    category: 'theme',
    themeId: 'underground',
    price: 20,
    description: 'Deep subterranean cobalt caves with glowing cyan mushroom crystals.',
    previewColor: '#070e1b',
  },
  {
    id: 'theme_castle',
    name: "Bowser's Castle",
    category: 'theme',
    themeId: 'castle',
    price: 35,
    description: 'Dark obsidian lava keep with bubbling volcanic magma orange accents.',
    previewColor: '#450a0a',
  },
  {
    id: 'theme_galaxy',
    name: 'Starry Galaxy',
    category: 'theme',
    themeId: 'galaxy',
    price: 45,
    description: 'Cosmic deep space navy with glimmering golden nebula dust.',
    previewColor: '#1e1b4b',
  },
  {
    id: 'theme_rainbow',
    name: 'Rainbow Road',
    category: 'theme',
    themeId: 'rainbow',
    price: 60,
    description: 'Vibrant prism road skyline with luminous arcade pastel energy.',
    previewColor: '#3b0764',
  },
  {
    id: 'theme_bowser_lava',
    name: 'Bowser Magma Keep',
    category: 'theme',
    themeId: 'bowser_lava',
    price: 75,
    description: 'Intense boiling molten rock, fiery obsidian fortresses and brimstone ash.',
    previewColor: '#5c0a0a',
  },
  {
    id: 'theme_retro_nes',
    name: 'NES 1985 Retro 8-Bit',
    category: 'theme',
    themeId: 'retro_nes',
    price: 50,
    description: 'Nostalgic CRT raster glow, vintage brown clay bricks, and retro pixel sky.',
    previewColor: '#1b1b1b',
  },
  {
    id: 'theme_neon_synth',
    name: 'Neon Synth Arcade',
    category: 'theme',
    themeId: 'neon_synth',
    price: 65,
    description: 'Electric cyber violet, glowing cyan laser wireframes, and hot magenta beams.',
    previewColor: '#2b0938',
  },
  {
    id: 'theme_desert_oasis',
    name: 'Koopa Desert Oasis',
    category: 'theme',
    themeId: 'desert_oasis',
    price: 40,
    description: 'Sun-drenched golden pyramid sands, gentle turquoise mirages, and sunset warmth.',
    previewColor: '#2a1a08',
  },
  {
    id: 'theme_aurora',
    name: 'Boreal Star Aurora',
    category: 'theme',
    themeId: 'aurora',
    price: 80,
    description: 'Magical emerald northern polar lights shimmering across deep alpine starlight.',
    previewColor: '#052328',
  },
];

export const AVATAR_ITEMS: ShopItem[] = HERO_ROSTER.map((hero) => ({
  id: `avatar_${hero.id}`,
  name: hero.name,
  category: 'avatar',
  avatarId: hero.id,
  price: hero.shopPrice,
  description: hero.description,
  faction: hero.faction,
}));

export const PERK_ITEMS: ShopItem[] = [
  {
    id: 'perk_life',
    name: '1-Up Life Ring',
    category: 'perk',
    price: 30,
    description: 'Grants 1 extra heart in the Bowser Boss Battle combat mode.',
    badge: 'Extra Life',
    perkEffect: '+1 Heart in Boss Fight',
  },
  {
    id: 'perk_star',
    name: 'Star Shield',
    category: 'perk',
    price: 35,
    description: 'Survives 1 round timeout in the Boss Battle without taking damage.',
    badge: 'Invincible',
    perkEffect: 'Timeout Protection',
  },
  {
    id: 'perk_double',
    name: 'Double Coin Mushroom',
    category: 'perk',
    price: 40,
    description: 'Doubles coins earned from practicing flashcards and quizzes.',
    badge: '2x Coins',
    perkEffect: 'x2 Coin Multiplier',
  },
  {
    id: 'perk_lakitu_glasses',
    name: 'Lakitu 50/50 Glasses',
    category: 'perk',
    price: 45,
    description: 'Eliminates 2 incorrect answer choices during tough Bar Exam multiple-choice quizzes.',
    badge: '50/50 MCQ',
    perkEffect: 'Cross out 2 Wrong Answers',
  },
  {
    id: 'perk_streak_freeze',
    name: 'Ice Flower Streak Freeze',
    category: 'perk',
    price: 50,
    description: 'Shields your daily study streak from resetting if you miss a study day.',
    badge: 'Streak Shield',
    perkEffect: '1-Day Streak Protection',
  },
  {
    id: 'perk_golden_fireball',
    name: 'Golden Fireball 3x',
    category: 'perk',
    price: 55,
    description: 'Unleashes radiant golden flame that triples all Boss Battle coin rewards.',
    badge: '3x Reward',
    perkEffect: '3x Boss Battle Coins',
  },
  {
    id: 'perk_chrono_watch',
    name: 'Chrono Pocket Watch',
    category: 'perk',
    price: 60,
    description: 'Adds +15 seconds of bonus thinking time on all timed Boss Battle combat questions.',
    badge: '+15s Clock',
    perkEffect: '+15s Boss Timer',
  },
  {
    id: 'perk_espresso_mushroom',
    name: 'Espresso Power Mushroom',
    category: 'perk',
    price: 25,
    description: 'Instant turbo booster that plays a joyful Mario fanfare and grants +10 instant focus boost.',
    badge: 'Focus Boost',
    perkEffect: 'Instant Fanfare & Alertness',
  },
];

export const PRESTIGE_ITEMS: ShopItem[] = [
  {
    id: 'title_supreme_arbiter',
    name: 'Supreme Labor Arbiter',
    category: 'title',
    price: 100,
    description: 'Elite honorary title displayed across your User Profile & Score Card.',
    badge: '⚖️ NLRC Sovereign',
  },
  {
    id: 'title_kasambahay_champion',
    name: 'Kasambahay Champion',
    category: 'title',
    price: 75,
    description: 'Commemorates mastery of R.A. 10361 Domestic Workers statutory rights.',
    badge: '🛡️ R.A. 10361 Guardian',
  },
  {
    id: 'title_codal_sovereign',
    name: 'Invincible Codal Sovereign',
    category: 'title',
    price: 150,
    description: 'Badge of honor for mastering every single unabridged article in the Labor Code.',
    badge: '🌟 100% Codal',
  },
  {
    id: 'title_undersecretary',
    name: 'Undersecretary of Labor Standards',
    category: 'title',
    price: 200,
    description: 'High-ranking executive title certifying supreme knowledge of DOLE issuances.',
    badge: '📜 DOLE Bureau',
  },
  {
    id: 'title_dean_jurisprudence',
    name: 'Dean of Philippine Jurisprudence',
    category: 'title',
    price: 300,
    description: 'The pinnacle of achievement in Philippine Labor Standards and Social Legislation.',
    badge: '👑 Juris Doctor',
  },
];

export const SOUNDPACK_ITEMS: ShopItem[] = [
  {
    id: 'sound_nes_8bit',
    name: 'NES 8-Bit Chiptune Pack',
    category: 'soundpack',
    price: 30,
    description: 'Crisp square-wave and triangle-wave sound effects inspired by the 1985 NES original.',
    badge: '8-Bit Synth',
  },
  {
    id: 'sound_snes_16bit',
    name: 'SNES 16-Bit Super Chime',
    category: 'soundpack',
    price: 45,
    description: 'Rich stereo brass, crystal bells, and orchestra hits from the 1990 Super Mario World era.',
    badge: '16-Bit Super',
  },
  {
    id: 'sound_zen_lofi',
    name: 'Zen Lofi Study Chimes',
    category: 'soundpack',
    price: 50,
    description: 'Gentle kalimba tones and warm vinyl crackle for soothing deep-focus Bar review sessions.',
    badge: 'Zen Study',
  },
];

export const CERTIFICATE_ITEM: ShopItem = {
  id: 'cert_mastery',
  name: 'Official Certificate of Labor Standards Mastery',
  category: 'certificate',
  price: 50,
  description: 'Unlocks a high-resolution, printable diploma certifying your mastery of Philippine Labor Standards with the Mushroom Kingdom Gold Seal!',
  badge: 'Printable Diploma',
};

export const ToadShop: React.FC<ToadShopProps> = ({
  coins,
  setCoins,
  activeTheme,
  setActiveTheme,
  equippedAvatar,
  setEquippedAvatar,
  onClose,
  isModal = false,
}) => {
  const [activeCategory, setActiveCategory] = useState<
    'avatars' | 'themes' | 'perks' | 'prestige' | 'soundpacks' | 'mystery' | 'certificate'
  >('avatars');
  const [selectedFaction, setSelectedFaction] = useState<string>('All');
  const [mysteryResult, setMysteryResult] = useState<string | null>(null);
  const [isRollingMystery, setIsRollingMystery] = useState<boolean>(false);
  const [showCertPreview, setShowCertPreview] = useState<boolean>(false);
  const [certRecipientName, setCertRecipientName] = useState<string>(() => {
    try {
      const savedStats = localStorage.getItem('mario_player_profile_stats');
      if (savedStats) {
        const parsed = JSON.parse(savedStats);
        if (parsed.playerName) return parsed.playerName;
      }
    } catch {
      // ignore
    }
    return 'Mario Bar Candidate';
  });

  const [equippedTitle, setEquippedTitle] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('mario_equipped_title') || '';
    }
    return '';
  });

  const [unlockedItemIds, setUnlockedItemIds] = useState<string[]>(() => {
    const defaults = ['theme_overworld', 'avatar_mario', 'avatar_luigi', 'avatar_peach'];
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('mario_unlocked_items');
        if (saved) {
          const parsed = JSON.parse(saved) as string[];
          return Array.from(new Set([...defaults, ...parsed]));
        }
        return defaults;
      } catch {
        return defaults;
      }
    }
    return defaults;
  });

  const handleBuyItem = (item: ShopItem) => {
    if (coins < item.price) {
      marioAudio.playStomp();
      return;
    }

    const nextCoins = coins - item.price;
    setCoins(nextCoins);
    marioAudio.playPowerUp();

    try {
      confetti({
        particleCount: 60,
        spread: 75,
        origin: { y: 0.6 },
        colors: ['#f59e0b', '#10b981', '#ef4444', '#3b82f6', '#8b5cf6'],
      });
    } catch {
      // ignore
    }

    const updated = Array.from(new Set([...unlockedItemIds, item.id]));
    setUnlockedItemIds(updated);

    try {
      localStorage.setItem('mario_unlocked_items', JSON.stringify(updated));
    } catch {
      // fallback
    }

    if (item.category === 'theme' && item.themeId) {
      handleEquipTheme(item.themeId);
    } else if (item.category === 'avatar' && item.avatarId) {
      handleEquipAvatar(item.avatarId);
    } else if (item.category === 'title') {
      handleEquipTitle(item.name);
    } else if (item.category === 'certificate') {
      setShowCertPreview(true);
    }
  };

  const handleEquipTheme = (themeId: MarioTheme) => {
    setActiveTheme(themeId);
    marioAudio.playPipe();
    try {
      localStorage.setItem('mario_active_theme', themeId);
    } catch {
      // fallback
    }
  };

  const handleEquipAvatar = (avatarId: MarioAvatar) => {
    setEquippedAvatar(avatarId);
    marioAudio.playJump();
    try {
      localStorage.setItem('mario_equipped_avatar', avatarId);
    } catch {
      // fallback
    }
  };

  const handleEquipTitle = (title: string) => {
    setEquippedTitle(title);
    marioAudio.playLevelUp();
    try {
      localStorage.setItem('mario_equipped_title', title);
    } catch {
      // fallback
    }
  };

  const handleRollMysteryBox = () => {
    const cost = 15;
    if (coins < cost || isRollingMystery) {
      marioAudio.playStomp();
      return;
    }

    setCoins((prev) => prev - cost);
    setIsRollingMystery(true);
    setMysteryResult(null);
    marioAudio.playCoin();

    setTimeout(() => {
      // Payout chances:
      // 40% -> 25 coins (+10 net gain)
      // 25% -> 35 coins (+20 net gain)
      // 15% -> 50 coins Jackpot!
      // 20% -> 10 coins consolation + Lucky Star
      const rand = Math.random();
      let payoutCoins = 25;
      let msg = '';

      if (rand < 0.15) {
        payoutCoins = 50;
        msg = 'JACKPOT! You struck a golden vein and won 50 Coins! ⭐';
        marioAudio.playStarTheme();
      } else if (rand < 0.40) {
        payoutCoins = 35;
        msg = 'SUPER LUCKY! 35 Golden Coins popped out of the ? Block!';
        marioAudio.playPowerUp();
      } else if (rand < 0.80) {
        payoutCoins = 25;
        msg = 'WINNER! You hit 25 Coins! (+10 profit)';
        marioAudio.playCoin();
      } else {
        payoutCoins = 10;
        msg = 'Good attempt! 10 Coins returned + 1-Up Mushroom blessing!';
        marioAudio.playCoin();
      }

      setCoins((prev) => prev + payoutCoins);
      setMysteryResult(msg);
      setIsRollingMystery(false);

      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.65 },
          colors: ['#eab308', '#ec4899', '#3b82f6', '#10b981'],
        });
      } catch {
        // ignore
      }
    }, 700);
  };

  const factions = [
    'All',
    'Mushroom Heroes',
    'Royal Court',
    'Kong & Dino Crew',
    'Rivals & Villains',
    'Special Legends',
  ];

  const displayedAvatars =
    selectedFaction === 'All'
      ? AVATAR_ITEMS
      : AVATAR_ITEMS.filter((item) => item.faction === selectedFaction);

  const isCertUnlocked = unlockedItemIds.includes(CERTIFICATE_ITEM.id);

  return (
    <div className={`space-y-6 ${isModal ? 'max-w-4xl mx-auto' : 'max-w-6xl mx-auto'}`}>
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-red-600 via-amber-500 to-red-700 text-slate-950 rounded-3xl p-5 sm:p-7 mario-card border-4 border-slate-950 shadow-[6px_6px_0_#000] relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative z-10">
          <div className="flex items-center gap-3.5">
            <div className="w-14 h-14 bg-white rounded-2xl border-3 border-black flex items-center justify-center shadow-[0_3px_0_#000] shrink-0">
              <MarioCharacterAvatar character={equippedAvatar} className="w-10 h-10" />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-black text-amber-300 font-black rounded-lg text-[10px] uppercase font-mario leading-none">
                <ShoppingBag className="w-3.5 h-3.5 shrink-0" />
                <span>TOAD&apos;S HERO ROSTER &amp; GRAND BAZAAR</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-white font-display tracking-tight mt-1">
                COIN VAULT, HEROES &amp; STUDY UPGRADES
              </h1>
              <p className="text-xs sm:text-sm font-bold text-amber-100 max-w-xl">
                Spend your earned study coins on 24 heroes, 10 vibrant UI themes, combat boosters, prestige titles, and the official printable certificate!
              </p>
              {equippedTitle && (
                <div className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-950/80 border border-amber-400 text-amber-300 text-xs font-black font-mario">
                  <Crown className="w-3.5 h-3.5" />
                  <span>Equipped Title: {equippedTitle}</span>
                </div>
              )}
            </div>
          </div>

          {/* Current Coin Wallet Pill */}
          <div className="flex items-center gap-3 bg-black/85 border-3 border-amber-400 rounded-2xl px-4 py-2.5 shadow-[0_3px_0_#000] self-start sm:self-center shrink-0">
            <MarioCoinIcon className="w-7 h-7 shrink-0" />
            <div>
              <span className="text-[10px] font-black uppercase text-amber-400 block font-mario leading-none">
                YOUR COIN BALANCE
              </span>
              <span className="text-lg sm:text-xl font-black text-white font-mario mt-1 block leading-none">
                x{coins.toString().padStart(2, '0')} Coins
              </span>
            </div>
          </div>
        </div>

        {isModal && onClose && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-9 h-9 rounded-xl bg-black/60 hover:bg-black text-white inline-flex items-center justify-center border-2 border-white/50 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Category Tabs: Roster, Themes, Perks, Prestige Titles, Soundpacks, Mystery Gacha, Certificate */}
      <div className="flex flex-wrap items-center gap-2 bg-[#1e293b] p-2 rounded-2xl border-3 border-slate-950 shadow-[4px_4px_0_#000]">
        <button
          onClick={() => {
            setActiveCategory('avatars');
            marioAudio.playJump();
          }}
          className={`h-10 inline-flex items-center justify-center gap-1.5 px-3.5 rounded-xl text-xs sm:text-sm font-black transition-all cursor-pointer whitespace-nowrap ${
            activeCategory === 'avatars'
              ? 'bg-amber-400 text-slate-950 border-2 border-black shadow-[0_2px_0_#000]'
              : 'bg-slate-800/80 text-slate-200 hover:bg-slate-700 hover:text-white border-2 border-transparent'
          }`}
        >
          <User className="w-4 h-4 shrink-0" />
          <span>Heroes ({AVATAR_ITEMS.length})</span>
        </button>

        <button
          onClick={() => {
            setActiveCategory('themes');
            marioAudio.playPipe();
          }}
          className={`h-10 inline-flex items-center justify-center gap-1.5 px-3.5 rounded-xl text-xs sm:text-sm font-black transition-all cursor-pointer whitespace-nowrap ${
            activeCategory === 'themes'
              ? 'bg-amber-400 text-slate-950 border-2 border-black shadow-[0_2px_0_#000]'
              : 'bg-slate-800/80 text-slate-200 hover:bg-slate-700 hover:text-white border-2 border-transparent'
          }`}
        >
          <Palette className="w-4 h-4 shrink-0" />
          <span>UI Themes ({THEME_ITEMS.length})</span>
        </button>

        <button
          onClick={() => {
            setActiveCategory('perks');
            marioAudio.playCoin();
          }}
          className={`h-10 inline-flex items-center justify-center gap-1.5 px-3.5 rounded-xl text-xs sm:text-sm font-black transition-all cursor-pointer whitespace-nowrap ${
            activeCategory === 'perks'
              ? 'bg-amber-400 text-slate-950 border-2 border-black shadow-[0_2px_0_#000]'
              : 'bg-slate-800/80 text-slate-200 hover:bg-slate-700 hover:text-white border-2 border-transparent'
          }`}
        >
          <Zap className="w-4 h-4 shrink-0" />
          <span>Study Boosters ({PERK_ITEMS.length})</span>
        </button>

        <button
          onClick={() => {
            setActiveCategory('prestige');
            marioAudio.playLevelUp();
          }}
          className={`h-10 inline-flex items-center justify-center gap-1.5 px-3.5 rounded-xl text-xs sm:text-sm font-black transition-all cursor-pointer whitespace-nowrap ${
            activeCategory === 'prestige'
              ? 'bg-amber-400 text-slate-950 border-2 border-black shadow-[0_2px_0_#000]'
              : 'bg-slate-800/80 text-slate-200 hover:bg-slate-700 hover:text-white border-2 border-transparent'
          }`}
        >
          <Crown className="w-4 h-4 shrink-0" />
          <span>Prestige Titles ({PRESTIGE_ITEMS.length})</span>
        </button>

        <button
          onClick={() => {
            setActiveCategory('soundpacks');
            marioAudio.playPowerUp();
          }}
          className={`h-10 inline-flex items-center justify-center gap-1.5 px-3.5 rounded-xl text-xs sm:text-sm font-black transition-all cursor-pointer whitespace-nowrap ${
            activeCategory === 'soundpacks'
              ? 'bg-amber-400 text-slate-950 border-2 border-black shadow-[0_2px_0_#000]'
              : 'bg-slate-800/80 text-slate-200 hover:bg-slate-700 hover:text-white border-2 border-transparent'
          }`}
        >
          <Volume2 className="w-4 h-4 shrink-0" />
          <span>Audio Packs ({SOUNDPACK_ITEMS.length})</span>
        </button>

        <button
          onClick={() => {
            setActiveCategory('mystery');
            marioAudio.playCoin();
          }}
          className={`h-10 inline-flex items-center justify-center gap-1.5 px-3.5 rounded-xl text-xs sm:text-sm font-black transition-all cursor-pointer whitespace-nowrap ${
            activeCategory === 'mystery'
              ? 'bg-amber-400 text-slate-950 border-2 border-black shadow-[0_2px_0_#000]'
              : 'bg-slate-800/80 text-slate-200 hover:bg-slate-700 hover:text-white border-2 border-transparent'
          }`}
        >
          <HelpCircle className="w-4 h-4 shrink-0" />
          <span>? Block Mystery</span>
        </button>

        <button
          onClick={() => {
            setActiveCategory('certificate');
            marioAudio.playStarTheme();
          }}
          className={`h-10 inline-flex items-center justify-center gap-1.5 px-3.5 rounded-xl text-xs sm:text-sm font-black transition-all cursor-pointer whitespace-nowrap ${
            activeCategory === 'certificate'
              ? 'bg-amber-400 text-slate-950 border-2 border-black shadow-[0_2px_0_#000]'
              : 'bg-slate-800/80 text-slate-200 hover:bg-slate-700 hover:text-white border-2 border-transparent'
          }`}
        >
          <FileCheck2 className="w-4 h-4 shrink-0" />
          <span>Master Diploma</span>
        </button>
      </div>

      {/* Avatars Roster View */}
      {activeCategory === 'avatars' && (
        <div className="space-y-4">
          {/* Faction Filter Bar */}
          <div className="bg-white rounded-2xl border-3 border-slate-950 p-3 shadow-[4px_4px_0_#000] flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 text-xs font-black uppercase font-mario text-slate-700 px-2">
              <Users className="w-4 h-4 text-red-600 shrink-0" />
              <span>FACTION:</span>
            </span>
            {factions.map((fac) => (
              <button
                key={fac}
                onClick={() => {
                  setSelectedFaction(fac);
                  marioAudio.playTabSwitch();
                }}
                className={`h-8 inline-flex items-center justify-center px-3 rounded-xl text-xs font-black border-2 border-black transition-all cursor-pointer whitespace-nowrap ${
                  selectedFaction === fac
                    ? 'bg-amber-400 text-slate-950 shadow-[0_2px_0_#000]'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {fac}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-stretch">
            {displayedAvatars.map((item) => {
              const heroMeta = HERO_ROSTER.find((h) => h.id === item.avatarId);
              const isUnlocked = unlockedItemIds.includes(item.id) || item.price === 0;
              const isEquipped = equippedAvatar === item.avatarId;

              return (
                <div
                  key={item.id}
                  className={`bg-white rounded-2xl mario-card border-4 border-slate-950 p-4 flex flex-col justify-between h-full transition-all ${
                    isEquipped ? 'ring-4 ring-amber-400 bg-amber-50/50' : ''
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-md bg-slate-900 text-amber-300 border border-black truncate">
                        {heroMeta?.title || item.faction}
                      </span>
                      {isEquipped && (
                        <span className="text-[9px] font-black uppercase text-emerald-900 bg-emerald-200 px-2 py-0.5 rounded-md border border-emerald-600 font-mario shrink-0">
                          ACTIVE
                        </span>
                      )}
                    </div>

                    <div className="w-16 h-16 bg-amber-100 rounded-2xl border-3 border-black mx-auto flex items-center justify-center shadow-[0_3px_0_#000]">
                      {item.avatarId && (
                        <MarioCharacterAvatar character={item.avatarId} className="w-11 h-11" />
                      )}
                    </div>

                    <div className="text-center">
                      <h3 className="font-black text-slate-950 text-base sm:text-lg font-display leading-tight">
                        {item.name}
                      </h3>
                      <p className="text-xs font-semibold text-slate-600 mt-1 leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </div>

                  {/* Card Footer */}
                  <div className="pt-3 border-t-2 border-slate-200 mt-4 flex items-center justify-between gap-2">
                    <div className="inline-flex items-center gap-1.5 font-black text-xs sm:text-sm text-slate-950 whitespace-nowrap">
                      <MarioCoinIcon className="w-4 h-4 shrink-0" />
                      <span>{item.price === 0 ? 'Free' : `${item.price}c`}</span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      {!isUnlocked && coins >= item.price && (
                        <button
                          onClick={() => handleBuyItem(item)}
                          className="h-9 inline-flex items-center justify-center px-3 rounded-xl font-black text-xs bg-red-600 hover:bg-red-500 text-white border-2 border-black shadow-[0_2px_0_#000] active:translate-y-0.5 cursor-pointer whitespace-nowrap"
                        >
                          Unlock
                        </button>
                      )}
                      <button
                        onClick={() => item.avatarId && handleEquipAvatar(item.avatarId)}
                        disabled={isEquipped}
                        className={`h-9 inline-flex items-center justify-center px-3.5 rounded-xl font-black text-xs border-2 border-black transition-all cursor-pointer whitespace-nowrap ${
                          isEquipped
                            ? 'bg-emerald-500 text-slate-950 cursor-default'
                            : 'bg-amber-400 hover:bg-amber-300 text-slate-950 shadow-[0_2px_0_#000] active:translate-y-0.5'
                        }`}
                      >
                        {isEquipped ? 'Equipped' : 'Select Hero'}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Themes Grid */}
      {activeCategory === 'themes' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 items-stretch">
          {THEME_ITEMS.map((item) => {
            const isUnlocked = unlockedItemIds.includes(item.id) || item.price === 0;
            const isEquipped = activeTheme === item.themeId;

            return (
              <div
                key={item.id}
                className={`bg-white rounded-2xl mario-card border-4 border-slate-950 p-4 sm:p-5 flex flex-col justify-between h-full transition-all ${
                  isEquipped ? 'ring-4 ring-amber-400 bg-amber-50/40' : ''
                }`}
              >
                <div className="space-y-3">
                  <div
                    className="w-full h-20 rounded-xl border-2 border-black shadow-inner flex items-center justify-center relative overflow-hidden"
                    style={{ backgroundColor: item.previewColor }}
                  >
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-black/70 rounded-lg border border-white/25 text-white text-xs font-black font-mario">
                      <Palette className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      <span>{item.name}</span>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="font-black text-slate-950 text-base sm:text-lg font-display">
                        {item.name}
                      </h3>
                      {isEquipped && (
                        <span className="text-[10px] font-black uppercase text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded border border-emerald-400 font-mario">
                          EQUIPPED
                        </span>
                      )}
                    </div>
                    <p className="text-xs font-semibold text-slate-600 mt-1 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>

                <div className="pt-4 border-t-2 border-slate-200 mt-4 flex items-center justify-between gap-2">
                  <div className="inline-flex items-center gap-1.5 font-black text-sm text-slate-950">
                    <MarioCoinIcon className="w-4 h-4 shrink-0" />
                    <span>{item.price === 0 ? 'Free' : `${item.price} Coins`}</span>
                  </div>

                  {isUnlocked ? (
                    <button
                      onClick={() => item.themeId && handleEquipTheme(item.themeId)}
                      disabled={isEquipped}
                      className={`h-9 inline-flex items-center justify-center px-4 rounded-xl font-black text-xs border-2 border-black transition-all cursor-pointer ${
                        isEquipped
                          ? 'bg-emerald-500 text-slate-950 opacity-90 cursor-default'
                          : 'bg-amber-400 hover:bg-amber-300 text-slate-950 shadow-[0_2px_0_#000] active:translate-y-0.5'
                      }`}
                    >
                      {isEquipped ? 'Active' : 'Equip Theme'}
                    </button>
                  ) : (
                    <button
                      onClick={() => handleBuyItem(item)}
                      disabled={coins < item.price}
                      className="h-9 inline-flex items-center justify-center px-4 rounded-xl font-black text-xs bg-red-600 hover:bg-red-500 disabled:opacity-40 text-white border-2 border-black shadow-[0_2px_0_#000] active:translate-y-0.5 cursor-pointer"
                    >
                      Unlock Theme
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Perks / Boosters Grid */}
      {activeCategory === 'perks' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-stretch">
          {PERK_ITEMS.map((item) => {
            const isUnlocked = unlockedItemIds.includes(item.id);

            const renderPerkIcon = (id: string) => {
              switch (id) {
                case 'perk_life':
                  return <Mario1UpIcon className="w-9 h-9" />;
                case 'perk_star':
                  return <MarioStarIcon className="w-9 h-9" />;
                case 'perk_double':
                  return <MarioMushroomIcon className="w-9 h-9" />;
                case 'perk_lakitu_glasses':
                  return <MarioLakituCloudIcon className="w-9 h-9" />;
                case 'perk_streak_freeze':
                  return <MarioIceFlowerIcon className="w-9 h-9" />;
                case 'perk_golden_fireball':
                  return <MarioFireFlowerIcon className="w-9 h-9" />;
                case 'perk_chrono_watch':
                  return <MarioPeachCrownIcon className="w-9 h-9" />;
                case 'perk_espresso_mushroom':
                default:
                  return <MarioMushroomIcon className="w-9 h-9" />;
              }
            };

            return (
              <div
                key={item.id}
                className="bg-white rounded-2xl mario-card border-4 border-slate-950 p-4 sm:p-5 flex flex-col justify-between h-full"
              >
                <div className="space-y-3">
                  <div className="w-16 h-16 bg-amber-50 rounded-2xl border-3 border-black mx-auto flex items-center justify-center shadow-[0_3px_0_#000]">
                    {renderPerkIcon(item.id)}
                  </div>

                  <div className="text-center">
                    <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-md bg-amber-100 text-amber-900 border border-amber-300 inline-block mb-1">
                      {item.badge}
                    </span>
                    <h3 className="font-black text-slate-950 text-base font-display">
                      {item.name}
                    </h3>
                    <p className="text-xs font-semibold text-slate-600 mt-1 leading-relaxed">
                      {item.description}
                    </p>
                    {item.perkEffect && (
                      <div className="mt-2 text-[11px] font-black text-emerald-700 bg-emerald-50 rounded-lg p-1 border border-emerald-200">
                        {item.perkEffect}
                      </div>
                    )}
                  </div>
                </div>

                <div className="pt-4 border-t-2 border-slate-200 mt-4 flex items-center justify-between gap-2">
                  <div className="inline-flex items-center gap-1.5 font-black text-sm text-slate-950">
                    <MarioCoinIcon className="w-4 h-4 shrink-0" />
                    <span>{item.price} Coins</span>
                  </div>

                  {isUnlocked ? (
                    <span className="h-9 inline-flex items-center justify-center px-3 rounded-xl font-black text-xs bg-emerald-100 text-emerald-950 border-2 border-emerald-500">
                      Active Perk
                    </span>
                  ) : (
                    <button
                      onClick={() => handleBuyItem(item)}
                      disabled={coins < item.price}
                      className="h-9 inline-flex items-center justify-center px-4 rounded-xl font-black text-xs bg-amber-400 hover:bg-amber-300 disabled:opacity-40 text-slate-950 border-2 border-black shadow-[0_2px_0_#000] active:translate-y-0.5 cursor-pointer"
                    >
                      Acquire Perk
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Prestige Titles Grid */}
      {activeCategory === 'prestige' && (
        <div className="space-y-4">
          <div className="bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 p-4 rounded-2xl border-3 border-black shadow-[3px_3px_0_#000] flex items-center gap-3">
            <Crown className="w-8 h-8 text-slate-950 shrink-0" />
            <div>
              <h3 className="font-black text-base uppercase font-display">
                PRESTIGE TITLES &amp; LEGAL HONORS
              </h3>
              <p className="text-xs font-bold text-slate-900">
                Unlock and equip honorary titles certifying your expertise in Philippine Labor Jurisprudence. These badges are featured in your User Profile and Export Score Card!
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 items-stretch">
            {PRESTIGE_ITEMS.map((item) => {
              const isUnlocked = unlockedItemIds.includes(item.id);
              const isEquipped = equippedTitle === item.name;

              return (
                <div
                  key={item.id}
                  className={`bg-white rounded-2xl mario-card border-4 border-slate-950 p-4 sm:p-5 flex flex-col justify-between h-full transition-all ${
                    isEquipped ? 'ring-4 ring-amber-400 bg-amber-50/50' : ''
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-md bg-slate-900 text-amber-300 border border-black">
                        {item.badge}
                      </span>
                      {isEquipped && (
                        <span className="text-[9px] font-black uppercase text-emerald-900 bg-emerald-200 px-2 py-0.5 rounded-md border border-emerald-600 font-mario shrink-0">
                          EQUIPPED
                        </span>
                      )}
                    </div>

                    <div className="w-14 h-14 bg-amber-100 rounded-2xl border-3 border-black mx-auto flex items-center justify-center shadow-[0_3px_0_#000]">
                      <Crown className="w-8 h-8 text-amber-700" />
                    </div>

                    <div className="text-center">
                      <h3 className="font-black text-slate-950 text-base font-display">
                        {item.name}
                      </h3>
                      <p className="text-xs font-semibold text-slate-600 mt-1 leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </div>

                  <div className="pt-4 border-t-2 border-slate-200 mt-4 flex items-center justify-between gap-2">
                    <div className="inline-flex items-center gap-1.5 font-black text-sm text-slate-950">
                      <MarioCoinIcon className="w-4 h-4 shrink-0" />
                      <span>{item.price} Coins</span>
                    </div>

                    {isUnlocked ? (
                      <button
                        onClick={() => handleEquipTitle(item.name)}
                        disabled={isEquipped}
                        className={`h-9 inline-flex items-center justify-center px-4 rounded-xl font-black text-xs border-2 border-black transition-all cursor-pointer ${
                          isEquipped
                            ? 'bg-emerald-500 text-slate-950 cursor-default'
                            : 'bg-amber-400 hover:bg-amber-300 text-slate-950 shadow-[0_2px_0_#000] active:translate-y-0.5'
                        }`}
                      >
                        {isEquipped ? 'Active' : 'Equip Title'}
                      </button>
                    ) : (
                      <button
                        onClick={() => handleBuyItem(item)}
                        disabled={coins < item.price}
                        className="h-9 inline-flex items-center justify-center px-4 rounded-xl font-black text-xs bg-red-600 hover:bg-red-500 disabled:opacity-40 text-white border-2 border-black shadow-[0_2px_0_#000] active:translate-y-0.5 cursor-pointer"
                      >
                        Claim Title
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Sound Packs */}
      {activeCategory === 'soundpacks' && (
        <div className="space-y-4">
          <div className="bg-slate-900 text-white p-4 rounded-2xl border-3 border-black shadow-[3px_3px_0_#000] flex items-center gap-3">
            <Volume2 className="w-8 h-8 text-amber-400 shrink-0" />
            <div>
              <h3 className="font-black text-base uppercase font-display text-amber-300">
                CHIPTUNE &amp; AUDIO PACKS
              </h3>
              <p className="text-xs font-semibold text-slate-300">
                Enhance your study ambiance with custom retro audio packs designed to keep your mind stimulated during lengthy statutory reading sessions.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-stretch">
            {SOUNDPACK_ITEMS.map((item) => {
              const isUnlocked = unlockedItemIds.includes(item.id);

              return (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl mario-card border-4 border-slate-950 p-4 sm:p-5 flex flex-col justify-between h-full"
                >
                  <div className="space-y-3">
                    <div className="w-14 h-14 bg-indigo-50 rounded-2xl border-3 border-black mx-auto flex items-center justify-center shadow-[0_3px_0_#000]">
                      <Volume2 className="w-8 h-8 text-indigo-600" />
                    </div>

                    <div className="text-center">
                      <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-md bg-indigo-100 text-indigo-900 border border-indigo-300 inline-block mb-1">
                        {item.badge}
                      </span>
                      <h3 className="font-black text-slate-950 text-base font-display">
                        {item.name}
                      </h3>
                      <p className="text-xs font-semibold text-slate-600 mt-1 leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </div>

                  <div className="pt-4 border-t-2 border-slate-200 mt-4 flex items-center justify-between gap-2">
                    <div className="inline-flex items-center gap-1.5 font-black text-sm text-slate-950">
                      <MarioCoinIcon className="w-4 h-4 shrink-0" />
                      <span>{item.price} Coins</span>
                    </div>

                    {isUnlocked ? (
                      <span className="h-9 inline-flex items-center justify-center px-3 rounded-xl font-black text-xs bg-emerald-100 text-emerald-950 border-2 border-emerald-500">
                        Unlocked
                      </span>
                    ) : (
                      <button
                        onClick={() => handleBuyItem(item)}
                        disabled={coins < item.price}
                        className="h-9 inline-flex items-center justify-center px-4 rounded-xl font-black text-xs bg-amber-400 hover:bg-amber-300 disabled:opacity-40 text-slate-950 border-2 border-black shadow-[0_2px_0_#000] active:translate-y-0.5 cursor-pointer"
                      >
                        Acquire Pack
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ? Block Mystery Gacha */}
      {activeCategory === 'mystery' && (
        <div className="bg-slate-900 text-white rounded-3xl p-6 border-4 border-slate-950 shadow-[6px_6px_0_#000] space-y-6 text-center max-w-xl mx-auto">
          <div className="space-y-2">
            <span className="text-[10px] font-black uppercase px-3 py-1 rounded-full bg-amber-400 text-slate-950 font-mario inline-block">
              LUCKY QUESTION BLOCK
            </span>
            <h2 className="text-2xl sm:text-3xl font-black font-display text-white">
              MYSTERY BLOCK GACHA
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 font-semibold max-w-md mx-auto">
              Hit the iconic Mario ? Block for 15 Coins! You can win up to a 50-Coin Jackpot, extra bonus mushrooms, and rare study charms!
            </p>
          </div>

          <div className="py-4">
            <button
              onClick={handleRollMysteryBox}
              disabled={coins < 15 || isRollingMystery}
              className={`w-28 h-28 mx-auto rounded-3xl bg-amber-400 border-4 border-black flex items-center justify-center shadow-[0_8px_0_#000] active:translate-y-2 cursor-pointer transition-transform ${
                isRollingMystery ? 'animate-bounce scale-110' : 'hover:scale-105'
              }`}
            >
              <span className="text-5xl font-black font-mario text-slate-950 select-none">?</span>
            </button>
          </div>

          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-950 rounded-2xl border-2 border-slate-700">
              <span className="text-xs font-bold text-slate-300">Cost:</span>
              <MarioCoinIcon className="w-5 h-5" />
              <span className="text-sm font-black text-amber-400">15 Coins per Hit</span>
            </div>

            {mysteryResult && (
              <div className="p-4 bg-amber-400/20 border-2 border-amber-400 rounded-2xl text-amber-200 text-sm font-black animate-fade-in">
                {mysteryResult}
              </div>
            )}

            <p className="text-[11px] text-slate-400 font-medium">
              Payout odds: 15% 50-Coin Jackpot ⭐ · 25% 35-Coin Super Win · 40% 25-Coin Win · 20% Consolation 10 Coins
            </p>
          </div>
        </div>
      )}

      {/* Official Master Diploma / Certificate */}
      {activeCategory === 'certificate' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl border-4 border-slate-950 p-6 shadow-[6px_6px_0_#000] text-slate-950 space-y-5">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b-2 border-slate-200 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-amber-400 border-2 border-black flex items-center justify-center shadow-[0_2px_0_#000]">
                  <FileCheck2 className="w-7 h-7 text-slate-950" />
                </div>
                <div>
                  <h2 className="text-xl font-black font-display">
                    OFFICIAL CERTIFICATE OF LABOR MASTERY
                  </h2>
                  <p className="text-xs font-bold text-slate-600">
                    High-Resolution Commemorative Diploma with Mario Kingdom Gold Seal &amp; Statutory Seal of Labor Standards
                  </p>
                </div>
              </div>

              {!isCertUnlocked ? (
                <button
                  onClick={() => handleBuyItem(CERTIFICATE_ITEM)}
                  disabled={coins < CERTIFICATE_ITEM.price}
                  className="h-10 px-5 rounded-xl bg-red-600 hover:bg-red-500 disabled:opacity-40 text-white font-black text-xs border-2 border-black shadow-[0_2px_0_#000] inline-flex items-center gap-2 cursor-pointer"
                >
                  <MarioCoinIcon className="w-4 h-4" />
                  <span>Unlock for 50 Coins</span>
                </button>
              ) : (
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 bg-emerald-100 text-emerald-950 border border-emerald-400 font-black text-xs rounded-xl">
                    ✓ Certificate Unlocked
                  </span>
                  <button
                    onClick={() => window.print()}
                    className="h-9 px-3.5 rounded-xl bg-slate-900 text-white hover:bg-slate-800 font-black text-xs border-2 border-black inline-flex items-center gap-1.5 cursor-pointer"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Print Certificate</span>
                  </button>
                </div>
              )}
            </div>

            {/* Recipient Customization */}
            <div className="flex flex-wrap items-center gap-3 bg-slate-50 p-3 rounded-2xl border-2 border-slate-200">
              <label htmlFor="cert-name" className="text-xs font-black uppercase text-slate-700">
                Recipient Name on Diploma:
              </label>
              <input
                id="cert-name"
                type="text"
                value={certRecipientName}
                onChange={(e) => setCertRecipientName(e.target.value)}
                maxLength={40}
                className="px-3 py-1.5 bg-white border-2 border-black rounded-xl font-bold text-sm text-slate-900 flex-1 min-w-[200px]"
                placeholder="e.g., Atty. Juan Dela Cruz"
              />
            </div>

            {/* Live Interactive Diploma Canvas / Card */}
            <div className="p-6 sm:p-10 bg-gradient-to-br from-amber-50 via-white to-amber-50/50 border-8 border-amber-500 rounded-3xl shadow-inner relative overflow-hidden text-center space-y-4">
              <div className="absolute top-4 left-4 w-12 h-12 border-t-4 border-l-4 border-amber-600" />
              <div className="absolute top-4 right-4 w-12 h-12 border-t-4 border-r-4 border-amber-600" />
              <div className="absolute bottom-4 left-4 w-12 h-12 border-b-4 border-l-4 border-amber-600" />
              <div className="absolute bottom-4 right-4 w-12 h-12 border-b-4 border-r-4 border-amber-600" />

              <div className="flex items-center justify-center gap-2">
                <MarioStarIcon className="w-6 h-6" />
                <span className="text-xs font-black tracking-widest uppercase text-amber-800 font-mario">
                  MUSHROOM KINGDOM · HIGH ACADEMY OF SOCIAL LEGISLATION
                </span>
                <MarioStarIcon className="w-6 h-6" />
              </div>

              <h1 className="text-2xl sm:text-4xl font-black font-display text-slate-900 tracking-tight">
                CERTIFICATE OF LABOR MASTERY
              </h1>
              <p className="text-xs sm:text-sm font-semibold text-slate-600 italic">
                This certifies that the esteemed Bar Review Candidate
              </p>

              <div className="text-xl sm:text-3xl font-black text-red-600 font-display underline decoration-amber-400 decoration-wavy decoration-2 underline-offset-8 py-2">
                {certRecipientName || 'Mario Bar Candidate'}
              </div>

              <p className="text-xs sm:text-sm font-medium text-slate-700 max-w-xl mx-auto leading-relaxed">
                has with distinction completed the comprehensive syllabus on Philippine Labor Standards (Articles 82–155, Book III Labor Code, R.A. 11360 Service Charges, R.A. 10361 Batas Kasambahay, and D.O. 174 Contracting Framework).
              </p>

              <div className="pt-6 flex flex-col sm:flex-row items-center justify-around gap-6">
                <div className="text-center">
                  <div className="w-36 border-b-2 border-black mx-auto mb-1 font-bold text-xs">
                    {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                  </div>
                  <span className="text-[10px] font-black uppercase text-slate-500 font-mario">
                    DATE OF CONFERMENT
                  </span>
                </div>

                <div className="w-20 h-20 rounded-full bg-amber-400 border-4 border-black flex flex-col items-center justify-center shadow-[0_4px_0_#000] rotate-12">
                  <MarioStarIcon className="w-8 h-8" />
                  <span className="text-[8px] font-black uppercase text-slate-950 font-mario">
                    GOLD SEAL
                  </span>
                </div>

                <div className="text-center">
                  <div className="w-36 border-b-2 border-black mx-auto mb-1 font-black text-xs">
                    Chief Arbiter Toad, LL.M.
                  </div>
                  <span className="text-[10px] font-black uppercase text-slate-500 font-mario">
                    COMMISSIONER OF STANDARDS
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
