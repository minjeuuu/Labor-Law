import React, { useState } from 'react';
import { MarioAvatar } from '../types/laborLaw';
import { HERO_ROSTER, getHeroMeta } from '../data/heroesData';
import { LaborKart } from './LaborKart';
import { Game2D } from './Game2D';
import { Game3D } from './Game3D';
import {
  WhackAGoombaGame,
  MultiplierMemoryGame,
  ContractorBusterGame,
  BowsersBridgeGame,
  HolidayWageSorterGame,
} from './ArcadeMiniGames';
import {
  MarioCharacterAvatar,
  MarioMushroomIcon,
  MarioQuestionBlockIcon,
  MarioStarIcon,
  MarioAxeIcon,
} from './MarioIcons';
import { marioAudio } from '../utils/audio';
import {
  Gamepad2,
  Sparkles,
  ArrowRight,
  Hammer,
  ShieldCheck,
  Layers,
  Box,
  Users,
} from 'lucide-react';

interface GameVaultProps {
  equippedAvatar: MarioAvatar;
  setEquippedAvatar: (avatar: MarioAvatar) => void;
  coins: number;
  setCoins: React.Dispatch<React.SetStateAction<number>>;
  fontSize: 'normal' | 'large' | 'xlarge';
}

export type VaultGameId =
  | 'kart'
  | 'run2d'
  | 'island3d'
  | 'whack'
  | 'memory'
  | 'mansion'
  | 'bridge'
  | 'sorter';

export const GameVault: React.FC<GameVaultProps> = ({
  equippedAvatar,
  setEquippedAvatar,
  setCoins,
}) => {
  const [activeGame, setActiveGame] = useState<VaultGameId>('island3d');
  const [showHeroPicker, setShowHeroPicker] = useState(false);

  const heroMeta = getHeroMeta(equippedAvatar);

  const handleEarnCoins = (amount: number) => {
    setCoins((prev) => prev + amount);
    marioAudio.playCoin();
  };

  const games: {
    id: VaultGameId;
    title: string;
    genre: string;
    desc: string;
    badge: string;
    icon: React.ReactNode;
  }[] = [
    {
      id: 'island3d',
      title: '3D Mario Coin Island',
      genre: '3D Spatial Platformer',
      desc: 'Explore the 3D Mushroom Kingdom island with solid AABB pipe/block collisions, stepping stones, and Castle keep!',
      badge: '3D COLLISIONS',
      icon: <Box className="w-6 h-6 text-indigo-600" />,
    },
    {
      id: 'kart',
      title: 'Labor Kart GP',
      genre: 'Retro Mode-7 Racer',
      desc: 'Race 3 laps on Mushroom Circuit and hit [?] Item Boxes for Labor Law turbo boosts!',
      badge: 'KART RACER',
      icon: <MarioStarIcon className="w-6 h-6" />,
    },
    {
      id: 'run2d',
      title: 'Super Mario Legal Run',
      genre: '2D Side-Scroller',
      desc: 'Stomp Goombas, jump warp pipes, and bonk [?] blocks to unlock statutory doctrines!',
      badge: '2D RUNNER',
      icon: <MarioMushroomIcon className="w-6 h-6" />,
    },
    {
      id: 'whack',
      title: 'Whack-a-Goomba Audit',
      genre: 'Reflex Pipe Smasher',
      desc: 'Smash illegal wage deductions popping from 9 pipes while sparing lawful Art. 113 deductions!',
      badge: 'ART. 113–116',
      icon: <Hammer className="w-6 h-6 text-rose-600" />,
    },
    {
      id: 'memory',
      title: 'Multiplier Memory Match',
      genre: 'Mario Party Flip Board',
      desc: 'Flip 16 Mystery [?] Blocks to pair work scenarios with statutory rates (125% to 390%)!',
      badge: '16 [?] BLOCKS',
      icon: <MarioQuestionBlockIcon className="w-6 h-6" />,
    },
    {
      id: 'mansion',
      title: 'Contractor Buster',
      genre: 'DOLE D.O. 174 Inspector',
      desc: 'Bust prohibited Labor-Only Ghost Agencies and certify valid ₱5M independent contractors!',
      badge: 'D.O. 174-17',
      icon: <ShieldCheck className="w-6 h-6 text-emerald-600" />,
    },
    {
      id: 'bridge',
      title: "Bowser's Bridge Rescue",
      genre: 'Statutory Term Decoder',
      desc: 'Decode Labor Code doctrines letter-by-letter to trigger the golden axe before the bridge falls!',
      badge: 'WORD AXE',
      icon: <MarioAxeIcon className="w-6 h-6" />,
    },
    {
      id: 'sorter',
      title: 'Dr. Mario Wage Sorter',
      genre: 'Holiday & Payroll Clinic',
      desc: 'Sort incoming Holiday & Rest Day payroll capsules into 100%, 130%–150%, or 200%–390% pipes!',
      badge: 'HOLIDAY PIPES',
      icon: <Layers className="w-6 h-6 text-cyan-600" />,
    },
  ];

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Game Vault Hero Banner */}
      <div className="bg-[#1e293b] text-white rounded-3xl p-5 sm:p-7 mario-card border-4 border-slate-950 shadow-[6px_6px_0_#000]">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 bg-amber-400 rounded-2xl border-3 border-black flex items-center justify-center shadow-[0_3px_0_#000] shrink-0">
              <Gamepad2 className="w-7 h-7 text-slate-950" />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-red-600 text-white font-black rounded-lg border border-black text-[10px] uppercase font-mario mb-1">
                <Sparkles className="w-3 h-3 text-amber-300 shrink-0" />
                <span>8 PLAYABLE ARCADE GAMES • 24 HEROES</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-white font-display tracking-tight">
                MARIO LABOR LAW GAME VAULT
              </h1>
              <p className="text-xs sm:text-sm font-bold text-slate-300 max-w-xl">
                Choose from 8 interactive arcade games powered by Philippine Labor Standards and play as any of the 24 Mushroom Kingdom heroes!
              </p>
            </div>
          </div>

          {/* Equipped Hero Quick Switcher */}
          <div className="flex items-center justify-between md:justify-start gap-2.5 bg-slate-900 border-2 border-amber-400 rounded-2xl p-2.5 w-full md:w-auto shrink-0">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-10 h-10 bg-amber-400 rounded-xl border-2 border-black flex items-center justify-center shrink-0">
                <MarioCharacterAvatar character={equippedAvatar} className="w-7 h-7" />
              </div>
              <div className="pr-1 min-w-0">
                <span className="text-[9px] font-black font-mario text-amber-400 uppercase block">
                  ACTIVE HERO
                </span>
                <span className="text-xs font-black font-display text-white block truncate">
                  {heroMeta.name}
                </span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                setShowHeroPicker((v) => !v);
                marioAudio.playJump();
              }}
              className="min-h-[38px] px-3 inline-flex items-center justify-center gap-1.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black rounded-xl border-2 border-black text-xs cursor-pointer leading-none whitespace-nowrap shrink-0"
            >
              <Users className="w-3.5 h-3.5 shrink-0" />
              <span>{showHeroPicker ? 'Close' : '24 Heroes'}</span>
            </button>
          </div>
        </div>

        {/* Instant 24-Hero Picker Drawer */}
        {showHeroPicker && (
          <div className="mt-4 pt-4 border-t-2 border-slate-700 grid grid-cols-3 sm:grid-cols-6 md:grid-cols-8 gap-2">
            {HERO_ROSTER.map((h) => {
              const active = equippedAvatar === h.id;
              return (
                <button
                  key={h.id}
                  type="button"
                  onClick={() => {
                    setEquippedAvatar(h.id);
                    try {
                      localStorage.setItem('mario_equipped_avatar', h.id);
                    } catch {
                      // ignore
                    }
                    marioAudio.playCoin();
                  }}
                  className={`h-16 p-1.5 rounded-xl border-2 flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
                    active
                      ? 'bg-amber-400 text-slate-950 border-black shadow-[0_2px_0_#000]'
                      : 'bg-slate-900 hover:bg-slate-800 text-slate-200 border-slate-700'
                  }`}
                >
                  <MarioCharacterAvatar character={h.id} className="w-6 h-6 shrink-0" />
                  <span className="text-[10px] font-black truncate max-w-full">{h.shortName}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* 8-Game Selection Shelf — Equal Height Aligned Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {games.map((g) => {
          const isSelected = activeGame === g.id;
          return (
            <button
              key={g.id}
              type="button"
              onClick={() => {
                setActiveGame(g.id);
                marioAudio.playPipe();
              }}
              className={`h-full text-left p-4 rounded-2xl border-4 transition-all cursor-pointer flex flex-col justify-between ${
                isSelected
                  ? 'bg-amber-400 border-slate-950 text-slate-950 shadow-[4px_4px_0_#000] -translate-y-0.5'
                  : 'bg-white border-slate-950 text-slate-900 hover:bg-amber-50 shadow-[3px_3px_0_#000]'
              }`}
            >
              <div className="space-y-2.5">
                <div className="flex items-center justify-between gap-2">
                  <div className="w-10 h-10 rounded-xl bg-slate-100 border-2 border-black flex items-center justify-center shrink-0">
                    {g.icon}
                  </div>
                  <span
                    className={`text-[9px] font-black font-mario px-2 py-1 rounded-lg uppercase leading-none whitespace-nowrap ${
                      isSelected ? 'bg-slate-950 text-amber-300' : 'bg-slate-900 text-amber-300'
                    }`}
                  >
                    {g.badge}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-600 block">
                    {g.genre}
                  </span>
                  <h3 className="font-black text-base font-display text-slate-950 leading-snug">
                    {g.title}
                  </h3>
                  <p className="text-xs font-semibold leading-relaxed mt-1 text-slate-700">
                    {g.desc}
                  </p>
                </div>
              </div>

              <div className="pt-3 mt-3 border-t-2 border-slate-950/15 flex items-center justify-between text-[11px] font-black font-mario">
                <span>{isSelected ? 'NOW PLAYING' : 'PLAY GAME'}</span>
                <ArrowRight className="w-4 h-4 shrink-0" />
              </div>
            </button>
          );
        })}
      </div>

      {/* Active Game Surface */}
      <div>
        {activeGame === 'kart' && (
          <LaborKart equippedAvatar={equippedAvatar} onEarnCoins={handleEarnCoins} />
        )}
        {activeGame === 'run2d' && (
          <Game2D equippedAvatar={equippedAvatar} onEarnCoins={handleEarnCoins} />
        )}
        {activeGame === 'island3d' && (
          <Game3D equippedAvatar={equippedAvatar} onEarnCoins={handleEarnCoins} />
        )}
        {activeGame === 'whack' && (
          <WhackAGoombaGame equippedAvatar={equippedAvatar} onEarnCoins={handleEarnCoins} />
        )}
        {activeGame === 'memory' && (
          <MultiplierMemoryGame equippedAvatar={equippedAvatar} onEarnCoins={handleEarnCoins} />
        )}
        {activeGame === 'mansion' && (
          <ContractorBusterGame equippedAvatar={equippedAvatar} onEarnCoins={handleEarnCoins} />
        )}
        {activeGame === 'bridge' && (
          <BowsersBridgeGame equippedAvatar={equippedAvatar} onEarnCoins={handleEarnCoins} />
        )}
        {activeGame === 'sorter' && (
          <HolidayWageSorterGame equippedAvatar={equippedAvatar} onEarnCoins={handleEarnCoins} />
        )}
      </div>
    </div>
  );
};
