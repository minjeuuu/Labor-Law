import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { MarioAvatar } from '../types/laborLaw';
import { getHeroMeta } from '../data/heroesData';
import { marioAudio } from '../utils/audio';
import {
  MarioCharacterAvatar,
  MarioCoinIcon,
  MarioStarIcon,
  MarioBowserIcon,
  MarioFireballIcon,
  MarioAxeIcon,
  MarioQuestionBlockIcon,
} from './MarioIcons';
import {
  Play,
  RotateCcw,
  Hammer,
  Grid,
  ShieldCheck,
  ShieldAlert,
  Flame,
  Trophy,
  Clock,
  Heart,
  CheckCircle2,
  XCircle,
  Sparkles,
  ArrowDown,
} from 'lucide-react';

interface MiniGameProps {
  equippedAvatar: MarioAvatar;
  onEarnCoins: (amount: number) => void;
}

/* ============================================================================
   GAME 4: WHACK-A-GOOMBA: ILLEGAL DEDUCTION SMASHER (Art. 113-116)
   ============================================================================ */
interface PipeTarget {
  label: string;
  isIllegal: boolean;
  ruleNote: string;
}

const DEDUCTION_TARGETS: PipeTarget[] = [
  { label: '5% Cash Shortage Reserve (No Hearing)', isIllegal: true, ruleNote: 'Illegal under Art. 114 without proving fault & due process!' },
  { label: 'Forced Company Store Grocery Cut', isIllegal: true, ruleNote: 'Prohibited by Art. 112 (Non-Interference in Disposal of Wages)!' },
  { label: 'Promissory Chits / Bowser Tokens', isIllegal: true, ruleNote: 'Void under Art. 102 — wages must be paid in legal tender!' },
  { label: 'Rice & Ham Deducted from 13th Month', isIllegal: true, ruleNote: 'Substitute payment for 13th Month Pay is void under P.D. 851!' },
  { label: '15% Management Cut from Service Charge', isIllegal: true, ruleNote: 'Illegal! R.A. 11360 mandates 100% distribution to rank-and-file!' },
  { label: 'Deducting 30-Min Coffee Break (2x15m)', isIllegal: true, ruleNote: 'Short breaks (5–20 mins) are compensable hours worked!' },
  { label: 'Offsetting Undertime Against Overtime', isIllegal: true, ruleNote: 'Strictly prohibited by Article 88 of the Labor Code!' },
  { label: '50% Weekly Deduction for Lost Tool', isIllegal: true, ruleNote: 'Exceeds the 20% weekly wage deduction ceiling!' },
  { label: 'SSS, PhilHealth & Pag-IBIG Contributions', isIllegal: false, ruleNote: 'Lawful statutory deduction mandated by law!' },
  { label: 'Union Dues with Written Check-Off', isIllegal: false, ruleNote: 'Lawful deduction expressly authorized under Art. 113(b)!' },
  { label: 'Insurance Premium (Employee Written Consent)', isIllegal: false, ruleNote: 'Lawful deduction authorized under Art. 113(a)!' },
  { label: 'BIR Withholding Income Tax', isIllegal: false, ruleNote: 'Lawful statutory tax withholding!' },
];

export const WhackAGoombaGame: React.FC<MiniGameProps> = ({ equippedAvatar, onEarnCoins }) => {
  const hero = getHeroMeta(equippedAvatar);
  const [phase, setPhase] = useState<'title' | 'playing' | 'done'>('title');
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [timeLeft, setTimeLeft] = useState(35);
  const [activePipes, setActivePipes] = useState<(PipeTarget | null)[]>(Array(9).fill(null));
  const [feedback, setFeedback] = useState<string>('Smash RED Goombas (Illegal Practices) — Spare GREEN Toads (Lawful Art. 113 Deductions)!');

  useEffect(() => {
    if (phase !== 'playing') return;

    const spawnInterval = setInterval(() => {
      setActivePipes(() => {
        const next: (PipeTarget | null)[] = Array(9).fill(null);
        const count = 2 + Math.floor(Math.random() * 2);
        const chosenIndices = new Set<number>();
        while (chosenIndices.size < count) {
          chosenIndices.add(Math.floor(Math.random() * 9));
        }
        chosenIndices.forEach((idx) => {
          next[idx] = DEDUCTION_TARGETS[Math.floor(Math.random() * DEDUCTION_TARGETS.length)];
        });
        return next;
      });
    }, 1450);

    const clockInterval = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          setPhase('done');
          marioAudio.playQuizComplete();
          return 0;
        }
        return t - 1;
      });
    }, 1000);

    return () => {
      clearInterval(spawnInterval);
      clearInterval(clockInterval);
    };
  }, [phase]);

  const startRound = () => {
    setScore(0);
    setLives(3);
    setTimeLeft(35);
    setActivePipes(Array(9).fill(null));
    setFeedback('Smash Illegal Deductions! Do NOT hit Lawful Statutory Deductions!');
    setPhase('playing');
    marioAudio.playPowerUp();
  };

  const handleWhack = (idx: number) => {
    const target = activePipes[idx];
    if (!target || phase !== 'playing') return;

    const updated = [...activePipes];
    updated[idx] = null;
    setActivePipes(updated);

    if (target.isIllegal) {
      setScore((s) => s + 150);
      onEarnCoins(2);
      setFeedback(`SMASHED! +2 Coins — ${target.ruleNote}`);
      marioAudio.playStomp();
      marioAudio.playCoin();
    } else {
      setFeedback(`OOPS! That was LAWFUL: ${target.ruleNote}`);
      marioAudio.playBowserHit();
      setLives((l) => {
        const nextL = l - 1;
        if (nextL <= 0) setPhase('done');
        return nextL;
      });
    }
  };

  return (
    <div className="bg-[#1e293b] rounded-3xl mario-card border-4 border-slate-950 p-4 sm:p-6 text-white space-y-4 max-w-4xl mx-auto">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b-2 border-slate-700 pb-3">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 bg-amber-400 rounded-xl border-2 border-black flex items-center justify-center shrink-0">
            <MarioCharacterAvatar character={equippedAvatar} className="w-7 h-7" />
          </div>
          <div>
            <span className="text-[10px] font-black uppercase text-amber-400 font-mario block">
              ARTICLES 102 & 112–116 • {hero.name.toUpperCase()}
            </span>
            <h2 className="text-xl sm:text-2xl font-black font-display text-white">
              WHACK-A-GOOMBA: DEDUCTION SMASHER
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-3 bg-slate-900 px-3.5 py-2 rounded-xl border-2 border-slate-700 tabular-nums">
          <span className="font-mario text-xs text-amber-300 flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" /> {timeLeft}s
          </span>
          <span className="font-mario text-xs text-emerald-400">PTS: {score}</span>
          <div className="flex items-center gap-0.5">
            {[1, 2, 3].map((h) => (
              <Heart
                key={h}
                className={`w-4 h-4 ${h <= lives ? 'text-rose-500 fill-rose-500' : 'text-slate-600'}`}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="bg-amber-400 text-slate-950 px-3.5 py-2.5 rounded-xl border-2 border-black font-bold text-xs sm:text-sm flex items-center gap-2">
        <Hammer className="w-4 h-4 shrink-0 text-red-700" />
        <span className="truncate">{feedback}</span>
      </div>

      {phase === 'title' && (
        <div className="bg-slate-900 rounded-2xl border-3 border-black p-8 text-center space-y-4">
          <Hammer className="w-12 h-12 text-amber-400 mx-auto" />
          <h3 className="text-2xl sm:text-3xl font-black font-display">SMASH ILLEGAL WAGE DEDUCTIONS!</h3>
          <p className="text-xs sm:text-sm text-slate-300 max-w-lg mx-auto font-semibold">
            Goombas pop out of 9 Warp Pipes carrying illegal wage deductions (cashier reserves without hearing, forced grocery cuts, undertime offsets). Smash them for +2 Coins, and spare green lawful Art. 113 deductions!
          </p>
          <button
            type="button"
            onClick={startRound}
            className="h-11 px-8 inline-flex items-center justify-center gap-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black rounded-xl border-3 border-black shadow-[0_4px_0_#000] cursor-pointer font-mario text-xs leading-none whitespace-nowrap"
          >
            <Play className="w-4 h-4 fill-current shrink-0" />
            <span>START SMASHING</span>
          </button>
        </div>
      )}

      {phase === 'playing' && (
        <div className="grid grid-cols-3 gap-3 sm:gap-4 bg-slate-950 p-4 rounded-2xl border-3 border-black">
          {activePipes.map((item, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleWhack(idx)}
              className={`h-32 sm:h-36 rounded-2xl border-3 border-black p-2.5 flex flex-col items-center justify-between transition-all cursor-pointer ${
                item
                  ? item.isIllegal
                    ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-[0_4px_0_#000] -translate-y-1'
                    : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-[0_4px_0_#000] -translate-y-1'
                  : 'bg-slate-900 text-slate-500'
              }`}
            >
              {item ? (
                <>
                  <span className="text-[9px] font-black font-mario uppercase px-2 py-0.5 rounded bg-black/40">
                    {item.isIllegal ? 'SMASH GOOMBA!' : 'LAWFUL • SPARE!'}
                  </span>
                  <span className="text-xs sm:text-sm font-black leading-snug text-center line-clamp-3">
                    {item.label}
                  </span>
                  <div className="w-full h-3 mario-green-pipe rounded-md" />
                </>
              ) : (
                <>
                  <span className="text-[10px] font-mario text-slate-600 mt-3">PIPE {idx + 1}</span>
                  <div className="w-full h-6 mario-green-pipe rounded-lg" />
                </>
              )}
            </button>
          ))}
        </div>
      )}

      {phase === 'done' && (
        <div className="bg-slate-900 rounded-2xl border-3 border-amber-400 p-8 text-center space-y-4">
          <Trophy className="w-12 h-12 text-amber-400 mx-auto" />
          <h3 className="text-2xl font-black font-display text-amber-300">SHIFT COMPLETE!</h3>
          <p className="text-sm font-bold text-slate-200">
            Final Deduction Audit Score: <span className="text-emerald-400 font-black">{score} PTS</span>
          </p>
          <button
            type="button"
            onClick={startRound}
            className="h-11 px-7 inline-flex items-center justify-center gap-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black rounded-xl border-3 border-black shadow-[0_4px_0_#000] cursor-pointer font-mario text-xs leading-none whitespace-nowrap"
          >
            <RotateCcw className="w-4 h-4 shrink-0" />
            <span>PLAY AGAIN</span>
          </button>
        </div>
      )}
    </div>
  );
};

/* ============================================================================
   GAME 5: MARIO PARTY: MULTIPLIER MEMORY MATCH (16 Flipping [?] Blocks)
   ============================================================================ */
interface MemoryCard {
  uid: string;
  pairId: string;
  text: string;
  kind: 'scenario' | 'rate';
}

const MEMORY_PAIRS = [
  { id: 'p1', scenario: 'Ordinary Day Overtime', rate: '125% Hourly' },
  { id: 'p2', scenario: 'Worked Special Non-Working Day', rate: '130% Daily' },
  { id: 'p3', scenario: 'Special Day + Rest Day', rate: '150% Daily' },
  { id: 'p4', scenario: 'Worked Regular Holiday', rate: '200% Daily' },
  { id: 'p5', scenario: 'Regular Holiday + Rest Day', rate: '260% Daily' },
  { id: 'p6', scenario: 'Worked Double Regular Holiday', rate: '300% Daily' },
  { id: 'p7', scenario: 'Double Holiday + Rest Day', rate: '390% Daily' },
  { id: 'p8', scenario: 'Night Shift Differential (10PM–6AM)', rate: '+10% Hourly' },
];

export const MultiplierMemoryGame: React.FC<MiniGameProps> = ({ equippedAvatar, onEarnCoins }) => {
  const [deck, setDeck] = useState<MemoryCard[]>([]);
  const [flipped, setFlipped] = useState<number[]>([]);
  const [matchedPairIds, setMatchedPairIds] = useState<string[]>([]);
  const [moves, setMoves] = useState(0);
  const lockRef = useRef(false);

  const initDeck = () => {
    const raw: MemoryCard[] = [];
    MEMORY_PAIRS.forEach((p) => {
      raw.push({ uid: `${p.id}-s`, pairId: p.id, text: p.scenario, kind: 'scenario' });
      raw.push({ uid: `${p.id}-r`, pairId: p.id, text: p.rate, kind: 'rate' });
    });
    for (let i = raw.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [raw[i], raw[j]] = [raw[j], raw[i]];
    }
    setDeck(raw);
    setFlipped([]);
    setMatchedPairIds([]);
    setMoves(0);
    lockRef.current = false;
  };

  useEffect(() => {
    initDeck();
  }, []);

  const handleCardFlip = (idx: number) => {
    if (lockRef.current) return;
    if (flipped.includes(idx)) return;
    const card = deck[idx];
    if (!card || matchedPairIds.includes(card.pairId)) return;

    marioAudio.playJump();
    const nextFlipped = [...flipped, idx];
    setFlipped(nextFlipped);

    if (nextFlipped.length === 2) {
      setMoves((m) => m + 1);
      const [firstIdx, secondIdx] = nextFlipped;
      const first = deck[firstIdx];
      const second = deck[secondIdx];

      if (first.pairId === second.pairId) {
        const updatedMatches = [...matchedPairIds, first.pairId];
        setMatchedPairIds(updatedMatches);
        setFlipped([]);
        onEarnCoins(3);
        marioAudio.playCoin();
        if (updatedMatches.length === MEMORY_PAIRS.length) {
          onEarnCoins(20);
          marioAudio.playQuizComplete();
          try {
            confetti({ particleCount: 70, spread: 70, origin: { y: 0.6 } });
          } catch {
            // ignore
          }
        }
      } else {
        lockRef.current = true;
        setTimeout(() => {
          setFlipped([]);
          lockRef.current = false;
        }, 780);
      }
    }
  };

  const allCleared = matchedPairIds.length === MEMORY_PAIRS.length && deck.length > 0;

  return (
    <div className="bg-[#1e293b] rounded-3xl mario-card border-4 border-slate-950 p-4 sm:p-6 text-white space-y-4 max-w-4xl mx-auto">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b-2 border-slate-700 pb-3">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 bg-amber-400 rounded-xl border-2 border-black flex items-center justify-center shrink-0">
            <MarioCharacterAvatar character={equippedAvatar} className="w-7 h-7" />
          </div>
          <div>
            <span className="text-[10px] font-black uppercase text-amber-400 font-mario block">
              MARIO PARTY MEMORY TABLE • DOLE MULTIPLIERS
            </span>
            <h2 className="text-xl sm:text-2xl font-black font-display text-white">
              MULTIPLIER MEMORY MATCH
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-slate-900 px-3.5 py-2 rounded-xl border-2 border-slate-700 font-mario text-xs tabular-nums flex items-center gap-3">
            <span className="text-amber-300">PAIRS: {matchedPairIds.length}/8</span>
            <span className="text-cyan-300">MOVES: {moves}</span>
          </div>
          <button
            type="button"
            onClick={() => {
              initDeck();
              marioAudio.playPowerUp();
            }}
            className="h-10 px-4 inline-flex items-center justify-center gap-1.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black rounded-xl border-2 border-black shadow-[0_3px_0_#000] cursor-pointer text-xs leading-none whitespace-nowrap"
          >
            <RotateCcw className="w-3.5 h-3.5 shrink-0" />
            <span>Shuffle</span>
          </button>
        </div>
      </div>

      {allCleared && (
        <div className="bg-emerald-900/90 border-3 border-amber-400 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <MarioStarIcon className="w-8 h-8 shrink-0" />
            <div>
              <h3 className="font-black text-amber-300 font-display text-lg">ALL 8 STATUTORY MULTIPLIERS MATCHED!</h3>
              <p className="text-xs font-bold text-emerald-100">Completed in {moves} moves • +20 Bonus Mario Coins awarded!</p>
            </div>
          </div>
          <button
            type="button"
            onClick={initDeck}
            className="h-10 px-5 inline-flex items-center justify-center gap-1.5 bg-amber-400 text-slate-950 font-black rounded-xl border-2 border-black cursor-pointer font-mario text-xs leading-none whitespace-nowrap"
          >
            NEW BOARD
          </button>
        </div>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {deck.map((card, idx) => {
          const isRevealed = flipped.includes(idx) || matchedPairIds.includes(card.pairId);
          const isMatched = matchedPairIds.includes(card.pairId);
          return (
            <button
              key={card.uid}
              type="button"
              onClick={() => handleCardFlip(idx)}
              className={`h-24 sm:h-28 rounded-2xl border-3 border-black p-3 flex flex-col items-center justify-center text-center transition-all cursor-pointer ${
                isMatched
                  ? 'bg-emerald-500 text-slate-950 shadow-[0_3px_0_#000]'
                  : isRevealed
                  ? card.kind === 'rate'
                    ? 'bg-amber-300 text-slate-950 shadow-[0_3px_0_#000]'
                    : 'bg-white text-slate-950 shadow-[0_3px_0_#000]'
                  : 'mario-question-block text-slate-950 hover:-translate-y-0.5'
              }`}
            >
              {isRevealed ? (
                <>
                  <span className="text-[9px] font-black font-mario uppercase opacity-75 mb-1">
                    {card.kind === 'rate' ? 'MULTIPLIER' : 'DAY SCENARIO'}
                  </span>
                  <span className="text-xs sm:text-sm font-black leading-tight">{card.text}</span>
                </>
              ) : (
                <span className="font-mario text-2xl font-black text-slate-950">?</span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

/* ============================================================================
   GAME 6: LUIGI'S MANSION: CONTRACTOR BUSTER (DOLE D.O. 174-17 Inspector)
   ============================================================================ */
interface ContractorCase {
  agencyName: string;
  capital: string;
  controlHolder: string;
  workRelation: string;
  registration: string;
  isLaborOnly: boolean;
  verdictNote: string;
}

const CONTRACTOR_CASES: ContractorCase[] = [
  {
    agencyName: 'Boo Ghost Manpower Services',
    capital: '₱850,000 Paid-Up Capital',
    controlHolder: 'Principal factory supervisor dictates assembly methods & discipline',
    workRelation: 'Directly related to principal assembly line',
    registration: 'Unregistered with DOLE',
    isLaborOnly: true,
    verdictNote: 'LABOR-ONLY CONTRACTING! Capital is below ₱5M, unregistered, and principal exercises direct control.',
  },
  {
    agencyName: 'Toadstool Tech IT Solutions Inc.',
    capital: '₱12,000,000 Paid-Up Capital + Own Servers & Laptops',
    controlHolder: 'Toadstool IT Project Lead supervises methods; Principal checks final deliverables only',
    workRelation: 'Specialized cloud software maintenance',
    registration: 'Valid DOLE D.O. 174 Certificate of Registration',
    isLaborOnly: false,
    verdictNote: 'LEGITIMATE JOB CONTRACTING! Exceeds ₱5M substantial capital, registered, and retains free control over means & methods.',
  },
  {
    agencyName: 'Koopa Shell Merchandising Co.',
    capital: '₱1,500,000 Net Worth (No tools or equipment)',
    controlHolder: 'Department store manager assigns schedules and store rules',
    workRelation: 'Cashiers & sales clerks performing core retail operations',
    registration: 'Expired DOLE Registration',
    isLaborOnly: true,
    verdictNote: 'LABOR-ONLY CONTRACTING! Lacks ₱5M substantial capital/investment and workers perform core business under principal control.',
  },
  {
    agencyName: 'Starlight Shield Security Agency',
    capital: '₱8,500,000 Paid-Up Capital + Licensed Firearms & Radios',
    controlHolder: 'Agency Detachment Commander controls guard deployment & SOPs',
    workRelation: 'Perimeter facility security services',
    registration: 'Active DOLE D.O. 174 & SOSIA Registration',
    isLaborOnly: false,
    verdictNote: 'LEGITIMATE CONTRACTING! Substantial capital >= ₱5M, distinct equipment, and independent control.',
  },
  {
    agencyName: 'Shy Guy In-House Placement Corp.',
    capital: '₱6,000,000 Capital (In-House Agency created by Principal)',
    controlHolder: 'Managed by Principal HR Director exclusively for Principal’s own plant',
    workRelation: 'Plant machine operators',
    registration: 'Registered, but operates as an In-House Agency',
    isLaborOnly: true,
    verdictNote: 'ILLEGAL UNDER D.O. 174 Sec. 6! In-house agencies operating exclusively for the principal are strictly prohibited!',
  },
  {
    agencyName: 'Yoshi Express Logistics & Fleet Corp.',
    capital: '₱18,000,000 Paid-Up Capital + 24 Refrigerated Trucks',
    controlHolder: 'Yoshi Fleet Dispatchers control driver routes & safety protocols',
    workRelation: 'Multi-client cold-chain delivery across Luzon',
    registration: 'Active DOLE D.O. 174 Registration',
    isLaborOnly: false,
    verdictNote: 'LEGITIMATE JOB CONTRACTING! Independent business, >= ₱5M capital, owns fleet, serves multiple clients.',
  },
];

export const ContractorBusterGame: React.FC<MiniGameProps> = ({ equippedAvatar, onEarnCoins }) => {
  const [idx, setIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState<null | { correct: boolean; message: string }>(null);
  const [completed, setCompleted] = useState(false);

  const current = CONTRACTOR_CASES[idx];

  const handleInspect = (declareLaborOnly: boolean) => {
    if (answered) return;
    const isCorrect = declareLaborOnly === current.isLaborOnly;
    if (isCorrect) {
      setScore((s) => s + 1);
      onEarnCoins(5);
      marioAudio.playCoin();
    } else {
      marioAudio.playBowserHit();
    }
    setAnswered({ correct: isCorrect, message: current.verdictNote });
  };

  const nextCase = () => {
    if (idx < CONTRACTOR_CASES.length - 1) {
      setIdx((i) => i + 1);
      setAnswered(null);
      marioAudio.playPipe();
    } else {
      setCompleted(true);
      onEarnCoins(15);
      marioAudio.playQuizComplete();
    }
  };

  const resetCases = () => {
    setIdx(0);
    setScore(0);
    setAnswered(null);
    setCompleted(false);
    marioAudio.playPowerUp();
  };

  return (
    <div className="bg-[#1e293b] rounded-3xl mario-card border-4 border-slate-950 p-4 sm:p-6 text-white space-y-4 max-w-4xl mx-auto">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b-2 border-slate-700 pb-3">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 bg-emerald-400 rounded-xl border-2 border-black flex items-center justify-center shrink-0">
            <MarioCharacterAvatar character={equippedAvatar} className="w-7 h-7" />
          </div>
          <div>
            <span className="text-[10px] font-black uppercase text-emerald-400 font-mario block">
              DOLE D.O. 174-17 • POLTERGUST AUDIT
            </span>
            <h2 className="text-xl sm:text-2xl font-black font-display text-white">
              LUIGI&apos;S MANSION: CONTRACTOR BUSTER
            </h2>
          </div>
        </div>

        <div className="bg-slate-900 px-3.5 py-2 rounded-xl border-2 border-slate-700 font-mario text-xs tabular-nums">
          CASE {idx + 1}/{CONTRACTOR_CASES.length} • SCORE: <span className="text-emerald-400">{score}</span>
        </div>
      </div>

      {!completed ? (
        <div className="space-y-4">
          <div className="bg-slate-900 rounded-2xl border-3 border-emerald-500/60 p-5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mario text-emerald-300 uppercase">DOLE INSPECTION DOCKET #{idx + 101}</span>
              <span className="text-xs font-bold text-amber-300">₱5,000,000 Capital Rule</span>
            </div>
            <h3 className="text-xl font-black font-display text-white">{current.agencyName}</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                <span className="text-slate-400 font-bold block">Capital & Equipment:</span>
                <span className="text-white font-black">{current.capital}</span>
              </div>
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                <span className="text-slate-400 font-bold block">DOLE Registry Status:</span>
                <span className="text-white font-black">{current.registration}</span>
              </div>
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                <span className="text-slate-400 font-bold block">Right of Control:</span>
                <span className="text-white font-black">{current.controlHolder}</span>
              </div>
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                <span className="text-slate-400 font-bold block">Nature of Work:</span>
                <span className="text-white font-black">{current.workRelation}</span>
              </div>
            </div>
          </div>

          {!answered ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => handleInspect(true)}
                className="h-12 px-5 inline-flex items-center justify-center gap-2 bg-rose-600 hover:bg-rose-500 text-white font-black rounded-xl border-3 border-black shadow-[0_4px_0_#000] cursor-pointer text-xs sm:text-sm leading-none whitespace-nowrap"
              >
                <ShieldAlert className="w-5 h-5 shrink-0" />
                <span>BUST GHOST! (Labor-Only / Prohibited)</span>
              </button>
              <button
                type="button"
                onClick={() => handleInspect(false)}
                className="h-12 px-5 inline-flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black rounded-xl border-3 border-black shadow-[0_4px_0_#000] cursor-pointer text-xs sm:text-sm leading-none whitespace-nowrap"
              >
                <ShieldCheck className="w-5 h-5 shrink-0" />
                <span>CERTIFY VALID (Legitimate D.O. 174)</span>
              </button>
            </div>
          ) : (
            <div className={`p-4 rounded-2xl border-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${
              answered.correct ? 'bg-emerald-950 border-emerald-400' : 'bg-rose-950 border-rose-500'
            }`}>
              <div className="space-y-1">
                <span className="font-mario text-xs text-amber-300 block">
                  {answered.correct ? 'ACCURATE INSPECTION! +5 COINS' : 'INSPECTION ERROR!'}
                </span>
                <p className="text-xs sm:text-sm font-bold text-white">{answered.message}</p>
              </div>
              <button
                type="button"
                onClick={nextCase}
                className="h-10 px-5 inline-flex items-center justify-center gap-1.5 bg-amber-400 text-slate-950 font-black rounded-xl border-2 border-black cursor-pointer font-mario text-xs shrink-0 leading-none whitespace-nowrap"
              >
                <span>NEXT DOCKET</span>
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-slate-900 rounded-2xl border-3 border-emerald-400 p-8 text-center space-y-4">
          <Trophy className="w-12 h-12 text-amber-400 mx-auto" />
          <h3 className="text-2xl font-black font-display text-emerald-300">MANSION CLEARED!</h3>
          <p className="text-sm font-bold text-slate-200">
            You accurately adjudicated {score} of {CONTRACTOR_CASES.length} D.O. 174 contracting dockets! +15 Bonus Coins!
          </p>
          <button
            type="button"
            onClick={resetCases}
            className="h-11 px-7 inline-flex items-center justify-center gap-2 bg-amber-400 text-slate-950 font-black rounded-xl border-3 border-black shadow-[0_4px_0_#000] cursor-pointer font-mario text-xs leading-none whitespace-nowrap"
          >
            <RotateCcw className="w-4 h-4 shrink-0" />
            <span>INSPECT AGAIN</span>
          </button>
        </div>
      )}
    </div>
  );
};

/* ============================================================================
   GAME 7: BOWSER'S BRIDGE: DOCTRINE RESCUE (Statutory Term Decoder)
   ============================================================================ */
const BRIDGE_PUZZLES = [
  { word: 'KASAMBAHAY', clue: 'Domestic worker entitled to 5 days SIL after 1 year under R.A. 10361' },
  { word: 'DISTORTION', clue: 'Severe contraction of intentional quantitative wage differences between pay groups (Art. 124)' },
  { word: 'FACILITIES', clue: 'Articles/services for worker & family subsistence deductible only with written consent' },
  { word: 'SUPPLEMENTS', clue: 'Extra conveniences furnished for employer benefit — NEVER deductible from wages' },
  { word: 'LACTATION', clue: 'Compensable nursing break of not less than 40 minutes per 8-hour shift (R.A. 10028)' },
  { word: 'PATERNITY', clue: 'Seven calendar days full-pay leave for first 4 deliveries of lawful cohabiting spouse' },
  { word: 'TELECOMMUTING', clue: 'Work-from-home arrangement governed by Fair Treatment parity under R.A. 11165' },
  { word: 'UNDERTIME', clue: 'Cannot be offset by overtime rendered on another day under Article 88' },
];

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

export const BowsersBridgeGame: React.FC<MiniGameProps> = ({ equippedAvatar, onEarnCoins }) => {
  const [puzzleIdx, setPuzzleIdx] = useState(0);
  const [guessed, setGuessed] = useState<string[]>([]);
  const [mistakes, setMistakes] = useState(0);
  const maxMistakes = 6;

  const puzzle = BRIDGE_PUZZLES[puzzleIdx % BRIDGE_PUZZLES.length];
  const letters = puzzle.word.split('');
  const isSolved = letters.every((ch) => guessed.includes(ch));
  const isLost = mistakes >= maxMistakes;

  const handleGuess = (letter: string) => {
    if (guessed.includes(letter) || isSolved || isLost) return;
    const next = [...guessed, letter];
    setGuessed(next);
    if (puzzle.word.includes(letter)) {
      marioAudio.playJump();
      if (letters.every((ch) => next.includes(ch))) {
        onEarnCoins(8);
        marioAudio.playQuizComplete();
      }
    } else {
      setMistakes((m) => m + 1);
      marioAudio.playBowserHit();
    }
  };

  const nextPuzzle = () => {
    setPuzzleIdx((i) => i + 1);
    setGuessed([]);
    setMistakes(0);
    marioAudio.playPowerUp();
  };

  return (
    <div className="bg-[#1e293b] rounded-3xl mario-card border-4 border-slate-950 p-4 sm:p-6 text-white space-y-4 max-w-4xl mx-auto">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b-2 border-slate-700 pb-3">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 bg-red-500 rounded-xl border-2 border-black flex items-center justify-center shrink-0">
            <MarioCharacterAvatar character={equippedAvatar} className="w-7 h-7" />
          </div>
          <div>
            <span className="text-[10px] font-black uppercase text-amber-400 font-mario block">
              CASTLE LAVA BRIDGE • STATUTORY DECODER
            </span>
            <h2 className="text-xl sm:text-2xl font-black font-display text-white">
              BOWSER&apos;S BRIDGE: DOCTRINE RESCUE
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-3 bg-slate-900 px-3.5 py-2 rounded-xl border-2 border-slate-700 font-mario text-xs tabular-nums">
          <MarioBowserIcon className="w-5 h-5 shrink-0" />
          <span className="text-rose-400">BRIDGE INTEGRITY: {maxMistakes - mistakes}/{maxMistakes}</span>
        </div>
      </div>

      {/* Bridge Visual Meter */}
      <div className="bg-slate-950 rounded-2xl border-3 border-black p-4 space-y-3">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 flex-1">
            {Array.from({ length: maxMistakes }).map((_, i) => (
              <div
                key={i}
                className={`h-4 flex-1 rounded border-2 border-black transition-all ${
                  i < maxMistakes - mistakes ? 'bg-amber-500' : 'bg-red-950 opacity-35'
                }`}
              />
            ))}
          </div>
          <MarioAxeIcon className="w-7 h-7 shrink-0" />
        </div>

        <div className="bg-slate-900 border-2 border-slate-700 rounded-xl p-3.5 text-center space-y-2">
          <span className="text-[10px] font-mario text-amber-400 uppercase block">STATUTORY CLUE:</span>
          <p className="text-xs sm:text-sm font-bold text-slate-100">{puzzle.clue}</p>
        </div>

        {/* Letter Slots */}
        <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 py-2">
          {letters.map((ch, idx) => {
            const show = guessed.includes(ch) || isLost;
            return (
              <div
                key={idx}
                className={`w-8 h-10 sm:w-10 sm:h-12 rounded-xl border-2 border-black flex items-center justify-center font-mario text-sm sm:text-base font-black ${
                  show ? 'bg-amber-400 text-slate-950' : 'bg-slate-800 text-slate-400'
                }`}
              >
                {show ? ch : '_'}
              </div>
            );
          })}
        </div>
      </div>

      {(isSolved || isLost) && (
        <div className={`p-4 rounded-2xl border-3 flex flex-wrap items-center justify-between gap-3 ${
          isSolved ? 'bg-emerald-950 border-amber-400' : 'bg-rose-950 border-rose-500'
        }`}>
          <span className="font-bold text-xs sm:text-sm">
            {isSolved
              ? `BRIDGE AXE ACTIVATED! You decoded "${puzzle.word}"! +8 Mario Coins!`
              : `BRIDGE COLLAPSED! The statutory term was "${puzzle.word}".`}
          </span>
          <button
            type="button"
            onClick={nextPuzzle}
            className="h-10 px-5 inline-flex items-center justify-center gap-1.5 bg-amber-400 text-slate-950 font-black rounded-xl border-2 border-black cursor-pointer font-mario text-xs leading-none whitespace-nowrap"
          >
            <span>NEXT BRIDGE</span>
          </button>
        </div>
      )}

      {/* Keyboard */}
      <div className="grid grid-cols-7 sm:grid-cols-9 gap-1.5">
        {ALPHABET.map((letter) => {
          const used = guessed.includes(letter);
          const hit = used && puzzle.word.includes(letter);
          return (
            <button
              key={letter}
              type="button"
              disabled={used || isSolved || isLost}
              onClick={() => handleGuess(letter)}
              className={`h-10 rounded-xl border-2 border-black font-mario text-xs font-black inline-flex items-center justify-center transition-all cursor-pointer ${
                used
                  ? hit
                    ? 'bg-emerald-500 text-slate-950'
                    : 'bg-slate-800 text-slate-600 opacity-50'
                  : 'bg-white hover:bg-amber-300 text-slate-950 shadow-[0_2px_0_#000]'
              }`}
            >
              {letter}
            </button>
          );
        })}
      </div>
    </div>
  );
};

/* ============================================================================
   GAME 8: DR. MARIO: HOLIDAY & WAGE PIPE SORTER
   ============================================================================ */
interface SortCapsule {
  title: string;
  bucket: 'base100' | 'special130' | 'regular200';
  note: string;
}

const SORT_CAPSULES: SortCapsule[] = [
  { title: 'Worked Special Working Day (e.g., EDSA / Regular Working Day)', bucket: 'base100', note: 'Special Working Days are paid 100% regular daily wage!' },
  { title: 'Unworked Regular Holiday (Present Day Before)', bucket: 'base100', note: 'Unworked Regular Holiday pays 100% daily wage!' },
  { title: 'Worked Scheduled Weekly Rest Day (8 hrs)', bucket: 'special130', note: 'Worked Rest Day pays 130% of basic daily rate!' },
  { title: 'Worked Ninoy Aquino Day (Special Non-Working)', bucket: 'special130', note: 'Worked Special Non-Working Day pays 130%!' },
  { title: 'Worked Special Non-Working Day + Rest Day', bucket: 'special130', note: 'Special Non-Working Day + Rest Day pays 150%!' },
  { title: 'Worked Bonifacio Day (Nov 30 Regular Holiday)', bucket: 'regular200', note: 'Worked Regular Holiday pays 200% for first 8 hours!' },
  { title: 'Worked Rizal Day Falling on Rest Day', bucket: 'regular200', note: 'Worked Regular Holiday + Rest Day pays 260%!' },
  { title: 'Worked Double Regular Holiday (Araw ng Kagitingan + Maundy Thursday)', bucket: 'regular200', note: 'Worked Double Regular Holiday pays 300% (or 390% on Rest Day)!' },
];

export const HolidayWageSorterGame: React.FC<MiniGameProps> = ({ equippedAvatar, onEarnCoins }) => {
  const [capsuleIdx, setCapsuleIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [statusMsg, setStatusMsg] = useState('Route each Payroll Capsule into the matching Statutory Warp Pipe!');
  const [finished, setFinished] = useState(false);

  const capsule = SORT_CAPSULES[capsuleIdx];

  const handleSort = (chosen: SortCapsule['bucket']) => {
    if (finished) return;
    if (chosen === capsule.bucket) {
      const nextStreak = streak + 1;
      setStreak(nextStreak);
      setScore((s) => s + 100 + nextStreak * 20);
      onEarnCoins(3);
      setStatusMsg(`CORRECT PIPE! +3 Coins — ${capsule.note}`);
      marioAudio.playCoin();
    } else {
      setStreak(0);
      setStatusMsg(`WRONG PIPE! ${capsule.note}`);
      marioAudio.playBowserHit();
    }

    if (capsuleIdx < SORT_CAPSULES.length - 1) {
      setCapsuleIdx((i) => i + 1);
    } else {
      setFinished(true);
      onEarnCoins(15);
      marioAudio.playQuizComplete();
    }
  };

  const restartSorter = () => {
    setCapsuleIdx(0);
    setScore(0);
    setStreak(0);
    setFinished(false);
    setStatusMsg('Route each Payroll Capsule into the matching Statutory Warp Pipe!');
    marioAudio.playPowerUp();
  };

  return (
    <div className="bg-[#1e293b] rounded-3xl mario-card border-4 border-slate-950 p-4 sm:p-6 text-white space-y-4 max-w-4xl mx-auto">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b-2 border-slate-700 pb-3">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 bg-cyan-400 rounded-xl border-2 border-black flex items-center justify-center shrink-0">
            <MarioCharacterAvatar character={equippedAvatar} className="w-7 h-7" />
          </div>
          <div>
            <span className="text-[10px] font-black uppercase text-cyan-300 font-mario block">
              DR. MARIO PAYROLL CLINIC • HOLIDAY & REST PIPES
            </span>
            <h2 className="text-xl sm:text-2xl font-black font-display text-white">
              HOLIDAY & WAGE PIPE SORTER
            </h2>
          </div>
        </div>

        <div className="bg-slate-900 px-3.5 py-2 rounded-xl border-2 border-slate-700 font-mario text-xs tabular-nums flex items-center gap-3">
          <span className="text-amber-300">CAPSULE {Math.min(SORT_CAPSULES.length, capsuleIdx + 1)}/{SORT_CAPSULES.length}</span>
          <span className="text-emerald-400">SCORE: {score}</span>
        </div>
      </div>

      <div className="bg-slate-900 border-2 border-slate-700 rounded-xl px-4 py-2.5 text-xs sm:text-sm font-bold text-amber-200">
        {statusMsg}
      </div>

      {!finished ? (
        <div className="space-y-4">
          <div className="bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-400 text-slate-950 rounded-2xl border-3 border-black p-6 text-center space-y-2 shadow-[0_4px_0_#000]">
            <span className="text-[10px] font-mario uppercase bg-black text-amber-300 px-2.5 py-1 rounded inline-block">
              INCOMING PAYROLL CAPSULE
            </span>
            <h3 className="text-lg sm:text-xl font-black font-display">{capsule.title}</h3>
            <p className="text-xs font-bold text-slate-800 flex items-center justify-center gap-1">
              <ArrowDown className="w-4 h-4" /> Drop into the correct statutory multiplier pipe below:
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <button
              type="button"
              onClick={() => handleSort('base100')}
              className="h-24 rounded-2xl border-3 border-black bg-sky-500 hover:bg-sky-400 text-slate-950 p-3 flex flex-col items-center justify-between font-black shadow-[0_4px_0_#000] cursor-pointer"
            >
              <span className="font-mario text-xs">PIPE A • 100%</span>
              <span className="text-xs font-extrabold">100% Basic Daily Rate</span>
              <div className="w-full h-3 mario-green-pipe rounded" />
            </button>

            <button
              type="button"
              onClick={() => handleSort('special130')}
              className="h-24 rounded-2xl border-3 border-black bg-amber-400 hover:bg-amber-300 text-slate-950 p-3 flex flex-col items-center justify-between font-black shadow-[0_4px_0_#000] cursor-pointer"
            >
              <span className="font-mario text-xs">PIPE B • 130%–150%</span>
              <span className="text-xs font-extrabold">Rest / Special Non-Working</span>
              <div className="w-full h-3 mario-green-pipe rounded" />
            </button>

            <button
              type="button"
              onClick={() => handleSort('regular200')}
              className="h-24 rounded-2xl border-3 border-black bg-rose-500 hover:bg-rose-400 text-white p-3 flex flex-col items-center justify-between font-black shadow-[0_4px_0_#000] cursor-pointer"
            >
              <span className="font-mario text-xs">PIPE C • 200%–390%</span>
              <span className="text-xs font-extrabold">Regular / Double Holiday</span>
              <div className="w-full h-3 mario-green-pipe rounded" />
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-slate-900 rounded-2xl border-3 border-cyan-400 p-8 text-center space-y-4">
          <Trophy className="w-12 h-12 text-amber-400 mx-auto" />
          <h3 className="text-2xl font-black font-display text-cyan-300">ALL CAPSULES SORTED!</h3>
          <p className="text-sm font-bold text-slate-200">
            Total Clinic Score: <span className="text-emerald-400">{score} PTS</span> • +15 Bonus Coins!
          </p>
          <button
            type="button"
            onClick={restartSorter}
            className="h-11 px-7 inline-flex items-center justify-center gap-2 bg-amber-400 text-slate-950 font-black rounded-xl border-3 border-black shadow-[0_4px_0_#000] cursor-pointer font-mario text-xs leading-none whitespace-nowrap"
          >
            <RotateCcw className="w-4 h-4 shrink-0" />
            <span>SORT AGAIN</span>
          </button>
        </div>
      )}
    </div>
  );
};
