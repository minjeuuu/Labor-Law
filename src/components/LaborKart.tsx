import React, { useRef, useEffect, useState } from 'react';
import { marioAudio } from '../utils/audio';
import { MarioAvatar } from '../types/laborLaw';
import { getHeroMeta } from '../data/heroesData';
import { MarioCharacterAvatar, MarioCoinIcon, MarioStarIcon, MarioFireballIcon } from './MarioIcons';
import { Play, RotateCcw, Zap, Trophy, Shield, HelpCircle, Check, X } from 'lucide-react';
import confetti from 'canvas-confetti';

interface LaborKartProps {
  equippedAvatar: MarioAvatar;
  onEarnCoins: (amount: number) => void;
}

interface KartRival {
  id: string;
  name: string;
  character: MarioAvatar;
  distance: number;
  speed: number;
  x: number;
  color: string;
}

interface ItemQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  boostReward: string;
}

const QUICK_KART_QUESTIONS: ItemQuestion[] = [
  {
    question: 'What is the minimum overtime pay rate for work rendered on an ordinary working day?',
    options: ['125% of hourly rate', '130% of hourly rate', '150% of hourly rate', '200% of hourly rate'],
    correctIndex: 0,
    boostReward: 'SUPER MUSHROOM TURBO BOOST!',
  },
  {
    question: 'Between what hours does the 10% Night Shift Differential legally apply?',
    options: ['8:00 PM to 4:00 AM', '10:00 PM to 6:00 AM', '12:00 MN to 8:00 AM', '11:00 PM to 7:00 AM'],
    correctIndex: 1,
    boostReward: 'RED SHELL TARGET LOCK!',
  },
  {
    question: 'Under R.A. 11360, what percentage of collected service charges goes to rank-and-file workers?',
    options: ['85%', '90%', '100%', '75%'],
    correctIndex: 2,
    boostReward: 'INVINCIBILITY STAR SPEED!',
  },
  {
    question: 'On or before what date must the statutory 13th-month pay be disbursed to employees?',
    options: ['December 15', 'December 24', 'December 31', 'January 15'],
    correctIndex: 1,
    boostReward: 'SUPER MUSHROOM TURBO BOOST!',
  },
  {
    question: 'How many days of paid Service Incentive Leave (SIL) are granted after 1 year of service?',
    options: ['3 days', '5 days', '7 days', '10 days'],
    correctIndex: 1,
    boostReward: 'TRIPLE GREEN SHELLS!',
  },
  {
    question: 'Can an employer offset Monday’s undertime with Tuesday’s overtime work?',
    options: ['Yes, if agreed in writing', 'No, strictly prohibited by Art. 88', 'Yes, during emergency repairs', 'Yes, for managerial staff'],
    correctIndex: 1,
    boostReward: 'GOLDEN DASH MUSHROOM!',
  },
  {
    question: 'What is the daily rate for work rendered on a Regular Holiday that falls on a Rest Day?',
    options: ['200%', '230%', '260%', '300%'],
    correctIndex: 2,
    boostReward: 'LIGHTNING BOLT OVERTAKE!',
  },
  {
    question: 'What is the paid leave duration for victims under the Anti-VAWC Act (R.A. 9262)?',
    options: ['5 days', '7 days', '10 days (extendible)', '15 days'],
    correctIndex: 2,
    boostReward: 'SUPER STAR HYPERSPEED!',
  },
];

export const LaborKart: React.FC<LaborKartProps> = ({ equippedAvatar, onEarnCoins }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [gameState, setGameState] = useState<'menu' | 'racing' | 'question' | 'gameover' | 'victory'>('menu');
  const [currentLap, setCurrentLap] = useState<number>(1);
  const [position, setPosition] = useState<number>(2);
  const [speedMph, setSpeedMph] = useState<number>(0);
  const [activeItem, setActiveItem] = useState<string | null>(null);
  const [activeQuestion, setActiveQuestion] = useState<ItemQuestion | null>(null);
  const [coinsGathered, setCoinsGathered] = useState<number>(0);
  const [engineClass, setEngineClass] = useState<'50cc' | '100cc' | '150cc'>('100cc');
  const [inventoryItem, setInventoryItem] = useState<'mushroom' | 'star' | 'greenshell' | 'redshell' | 'banana' | null>('mushroom');

  // Keyboard controls
  const keysRef = useRef<{ left: boolean; right: boolean; accel: boolean; brake: boolean }>({
    left: false,
    right: false,
    accel: false,
    brake: false,
  });

  // Track & Racing State refs for 60fps loop
  const raceRef = useRef<{
    playerDist: number;
    playerX: number;
    playerSpeed: number;
    boostRemaining: number;
    spinoutRemaining: number;
    invincibleRemaining: number;
    lap: number;
    lapLength: number;
    rivals: (KartRival & { spinout: number })[];
    itemBoxes: { dist: number; x: number; hit: boolean }[];
    coins: { dist: number; x: number; hit: boolean }[];
    totalCoins: number;
    shells: { dist: number; x: number; targetBowser?: boolean; homing?: boolean }[];
    bananas: { dist: number; x: number }[];
  }>({
    playerDist: 0,
    playerX: 0, // -1 (left road edge) to +1 (right road edge)
    playerSpeed: 0,
    boostRemaining: 0,
    spinoutRemaining: 0,
    invincibleRemaining: 0,
    lap: 1,
    lapLength: 3600,
    rivals: [
      { id: 'bowser', name: 'Bowser', character: 'bowser', distance: 100, speed: 15.0, x: 0.2, color: '#dc2626', spinout: 0 },
      { id: 'dk', name: 'Donkey Kong', character: 'donkeykong', distance: 50, speed: 14.5, x: -0.3, color: '#78350f', spinout: 0 },
      { id: 'wario', name: 'Wario', character: 'wario', distance: 20, speed: 14.0, x: 0.1, color: '#facc15', spinout: 0 },
    ],
    itemBoxes: [
      { dist: 600, x: -0.3, hit: false },
      { dist: 600, x: 0.3, hit: false },
      { dist: 1500, x: -0.4, hit: false },
      { dist: 1500, x: 0.4, hit: false },
      { dist: 2400, x: 0.0, hit: false },
      { dist: 3100, x: -0.2, hit: false },
      { dist: 3100, x: 0.2, hit: false },
    ],
    coins: [
      { dist: 300, x: -0.2, hit: false },
      { dist: 350, x: -0.2, hit: false },
      { dist: 1000, x: 0.2, hit: false },
      { dist: 1050, x: 0.2, hit: false },
      { dist: 1900, x: -0.1, hit: false },
      { dist: 1950, x: -0.1, hit: false },
      { dist: 2800, x: 0.3, hit: false },
    ],
    totalCoins: 0,
    shells: [],
    bananas: [],
  });

  const useInventoryItem = () => {
    if (!inventoryItem) return;
    const race = raceRef.current;

    if (inventoryItem === 'mushroom') {
      race.boostRemaining = 180;
      setActiveItem('TURBO DASH MUSHROOM!');
      marioAudio.playFireball();
      marioAudio.playPowerUp();
    } else if (inventoryItem === 'star') {
      race.invincibleRemaining = 240;
      race.boostRemaining = 240;
      setActiveItem('INVINCIBLE STAR HYPERSPEED!');
      marioAudio.playStarTheme();
    } else if (inventoryItem === 'greenshell') {
      // Find closest rival ahead
      const ahead = race.rivals.filter(r => r.distance > race.playerDist).sort((a, b) => a.distance - b.distance)[0];
      if (ahead) {
        ahead.spinout = 90;
        ahead.distance -= 60;
        setActiveItem(`GREEN SHELL SNIPED ${ahead.name.toUpperCase()}!`);
      } else {
        setActiveItem('GREEN SHELL LAUNCHED!');
      }
      marioAudio.playBowserHit();
    } else if (inventoryItem === 'redshell') {
      // Direct homing missile to 1st place rival
      const leader = [...race.rivals].sort((a, b) => b.distance - a.distance)[0];
      if (leader && leader.distance > race.playerDist) {
        leader.spinout = 120;
        leader.distance -= 100;
        setActiveItem(`RED SHELL HIT LEADER ${leader.name.toUpperCase()}!`);
      } else {
        setActiveItem('RED SHELL SECURED 1ST PLACE!');
      }
      marioAudio.playBowserHit();
    } else if (inventoryItem === 'banana') {
      // Drop banana behind
      const behind = race.rivals.filter(r => r.distance < race.playerDist).sort((a, b) => b.distance - a.distance)[0];
      if (behind) {
        behind.spinout = 90;
        behind.distance -= 50;
      }
      setActiveItem('BANANA PEEL DROPPED BEHIND!');
      marioAudio.playPipe();
    }

    setInventoryItem(null);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['ArrowLeft', 'KeyA'].includes(e.code)) keysRef.current.left = true;
      if (['ArrowRight', 'KeyD'].includes(e.code)) keysRef.current.right = true;
      if (['ArrowUp', 'KeyW'].includes(e.code)) keysRef.current.accel = true;
      if (['ArrowDown', 'KeyS'].includes(e.code)) keysRef.current.brake = true;
      if (e.code === 'Space') {
        e.preventDefault();
        useInventoryItem();
      }
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      if (['ArrowLeft', 'KeyA'].includes(e.code)) keysRef.current.left = false;
      if (['ArrowRight', 'KeyD'].includes(e.code)) keysRef.current.right = false;
      if (['ArrowUp', 'KeyW'].includes(e.code)) keysRef.current.accel = false;
      if (['ArrowDown', 'KeyS'].includes(e.code)) keysRef.current.brake = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [inventoryItem]);

  const triggerLaborQuestion = () => {
    setGameState('question');
    const randomQ = QUICK_KART_QUESTIONS[Math.floor(Math.random() * QUICK_KART_QUESTIONS.length)];
    setActiveQuestion(randomQ);
    marioAudio.playQuestionBlock();
  };

  const handleAnswerQuestion = (selectedIdx: number) => {
    if (!activeQuestion) return;

    if (selectedIdx === activeQuestion.correctIndex) {
      // Correct! Massive Super Boost + Give Item
      raceRef.current.boostRemaining = 160;
      setActiveItem(activeQuestion.boostReward);
      marioAudio.playPowerUp();
      marioAudio.playFireball();
      onEarnCoins(5);
      raceRef.current.totalCoins += 5;
      setCoinsGathered(raceRef.current.totalCoins);

      const items: ('mushroom' | 'star' | 'redshell' | 'greenshell')[] = ['mushroom', 'star', 'redshell', 'greenshell'];
      setInventoryItem(items[Math.floor(Math.random() * items.length)]);

      try {
        confetti({ particleCount: 30, spread: 60, origin: { y: 0.7 } });
      } catch {
        // ignore
      }
    } else {
      // Wrong! Slight spinout penalty
      raceRef.current.spinoutRemaining = 60;
      setActiveItem('SLIPPED ON OIL SLICK!');
      marioAudio.playBowserHit();
    }

    setGameState('racing');
    setActiveQuestion(null);
  };

  // Main 60 FPS Render Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId = 0;

    const loop = () => {
      const race = raceRef.current;

      if (gameState === 'racing') {
        // 1. Acceleration / Steering Physics
        const maxNormalSpeed = engineClass === '50cc' ? 20.0 : engineClass === '100cc' ? 22.0 : 25.0;
        const maxBoostSpeed = engineClass === '50cc' ? 28.0 : engineClass === '100cc' ? 30.0 : 33.0;
        const accelRate = 0.55;
        const dragRate = 0.12;

        if (race.spinoutRemaining > 0) {
          race.spinoutRemaining -= 1;
          race.playerSpeed = Math.max(0, race.playerSpeed - 0.5);
        } else if (race.boostRemaining > 0) {
          race.boostRemaining -= 1;
          race.playerSpeed = Math.min(maxBoostSpeed, race.playerSpeed + 0.9);
        } else if (keysRef.current.accel) {
          race.playerSpeed = Math.min(maxNormalSpeed, race.playerSpeed + accelRate);
        } else if (keysRef.current.brake) {
          race.playerSpeed = Math.max(0, race.playerSpeed - 0.6);
        } else {
          race.playerSpeed = Math.max(0, race.playerSpeed - dragRate);
        }

        // Steering (proportional to current forward velocity)
        const turnSpeed = 0.038 * (race.playerSpeed / maxNormalSpeed);
        if (keysRef.current.left) {
          race.playerX = Math.max(-1.1, race.playerX - turnSpeed);
        }
        if (keysRef.current.right) {
          race.playerX = Math.min(1.1, race.playerX + turnSpeed);
        }

        // Off-road friction penalty
        if (Math.abs(race.playerX) > 0.85) {
          race.playerSpeed = Math.min(9.0, race.playerSpeed);
        }

        // Advance distance
        race.playerDist += race.playerSpeed;

        // Check Lap Progression (3 Laps to win!)
        const currentLapNum = Math.floor(race.playerDist / race.lapLength) + 1;
        if (currentLapNum > race.lap) {
          race.lap = currentLapNum;
          setCurrentLap(currentLapNum);
          marioAudio.playOneUp();
          if (currentLapNum > 3) {
            setGameState('victory');
            marioAudio.playQuizComplete();
            onEarnCoins(50);
            return;
          }
        }

        // Advance Rivals with dynamic rubberbanding
        const rivalBaseSpeed = engineClass === '50cc' ? 12.5 : engineClass === '100cc' ? 14.8 : 16.5;
        const myTotalDist = race.playerDist;

        race.rivals.forEach((rival) => {
          if (rival.spinout > 0) {
            rival.spinout--;
            rival.distance += 4.0; // slowed during spinout
            return;
          }
          // Catchup mechanic: if rival is ahead of player, ease off so player can overtake
          const distDiff = rival.distance - myTotalDist;
          let factor = 1.0;
          if (distDiff > 120) {
            factor = 0.82; // catch up
          } else if (distDiff < -140) {
            factor = 1.08; // keep race exciting
          }
          rival.distance += (rivalBaseSpeed * factor) + (Math.sin(race.playerDist * 0.001) * 0.4);
          rival.x += (Math.sin(rival.distance * 0.01) * 0.005);
        });

        // Compute Live Placement
        let place = 1;
        race.rivals.forEach((r) => {
          if (r.distance > myTotalDist) place += 1;
        });
        setPosition(place);
        setSpeedMph(Math.round(race.playerSpeed * 4.2));

        // 2. Collision with Item Boxes
        const playerRelativeDist = race.playerDist % race.lapLength;
        race.itemBoxes.forEach((box) => {
          if (!box.hit && Math.abs(playerRelativeDist - box.dist) < 50 && Math.abs(race.playerX - box.x) < 0.3) {
            box.hit = true;
            triggerLaborQuestion();
          }
        });

        // 3. Collision with Road Coins
        race.coins.forEach((c) => {
          if (!c.hit && Math.abs(playerRelativeDist - c.dist) < 50 && Math.abs(race.playerX - c.x) < 0.25) {
            c.hit = true;
            race.totalCoins += 1;
            setCoinsGathered(race.totalCoins);
            onEarnCoins(1);
            marioAudio.playCoin();
          }
        });
      }

      // 4. RENDERING RETRO PSEUDO-3D KART CANVAS
      const w = canvas.width;
      const h = canvas.height;

      // Sky & Horizon
      const skyGrad = ctx.createLinearGradient(0, 0, 0, h * 0.45);
      skyGrad.addColorStop(0, '#0284c7');
      skyGrad.addColorStop(1, '#7dd3fc');
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, w, h * 0.45);

      // Clouds
      ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
      const cloudOffset = (race.playerDist * 0.05) % w;
      for (let i = -1; i <= 2; i++) {
        const cx = i * 280 + cloudOffset;
        ctx.beginPath();
        ctx.arc(cx, 40, 20, 0, Math.PI * 2);
        ctx.arc(cx + 25, 34, 25, 0, Math.PI * 2);
        ctx.arc(cx + 50, 40, 18, 0, Math.PI * 2);
        ctx.fill();
      }

      // Distant Peach Castle & Mountains
      ctx.fillStyle = '#15803d';
      ctx.beginPath();
      ctx.ellipse(w * 0.3, h * 0.45, w * 0.25, 45, 0, Math.PI, 0, true);
      ctx.fill();
      ctx.fillStyle = '#16a34a';
      ctx.beginPath();
      ctx.ellipse(w * 0.75, h * 0.45, w * 0.35, 55, 0, Math.PI, 0, true);
      ctx.fill();

      // Pseudo-3D Ground / Road Strips (Scanning from horizon down to bottom)
      const horizonY = h * 0.45;
      const roadBottomY = h;

      for (let y = horizonY; y < roadBottomY; y += 3) {
        const perspective = (y - horizonY) / (roadBottomY - horizonY); // 0 at horizon, 1 at bottom
        const curve = Math.sin((race.playerDist + (1 - perspective) * 500) * 0.002) * (1 - perspective) * 120;

        // Road Width increases with perspective
        const roadWidth = (w * 0.15) + (w * 0.65 * perspective);
        const roadCenterX = (w * 0.5) + curve - (race.playerX * (w * 0.35) * perspective);

        // Grass Colors (Alternating light and dark green stripes)
        const stripe = Math.sin((race.playerDist * 0.05) + (y * 0.15)) > 0;
        ctx.fillStyle = stripe ? '#22c55e' : '#16a34a';
        ctx.fillRect(0, y, w, 3);

        // Curbs / Rumble Strips (Red and White)
        const curbWidth = 14 * perspective + 4;
        ctx.fillStyle = stripe ? '#dc2626' : '#ffffff';
        ctx.fillRect(roadCenterX - roadWidth / 2 - curbWidth, y, curbWidth, 3);
        ctx.fillRect(roadCenterX + roadWidth / 2, y, curbWidth, 3);

        // Asphalt Road (Grey with dashed center line)
        ctx.fillStyle = stripe ? '#334155' : '#1e293b';
        ctx.fillRect(roadCenterX - roadWidth / 2, y, roadWidth, 3);

        // Center Yellow Dash
        if (stripe) {
          ctx.fillStyle = '#facc15';
          const dashWidth = 8 * perspective + 2;
          ctx.fillRect(roadCenterX - dashWidth / 2, y, dashWidth, 3);
        }
      }

      // 5. Draw Road Items (Mystery [?] Boxes and Coins)
      const playerRel = race.playerDist % race.lapLength;

      // Item Boxes
      race.itemBoxes.forEach((box) => {
        const distFromPlayer = box.dist - playerRel;
        if (distFromPlayer > 0 && distFromPlayer < 1200) {
          const depth = 1 - (distFromPlayer / 1200); // 0 at horizon, 1 near
          const boxY = horizonY + (roadBottomY - horizonY) * (depth * depth);
          const roadWidth = (w * 0.15) + (w * 0.65 * depth);
          const curve = Math.sin((race.playerDist + (1 - depth) * 500) * 0.002) * (1 - depth) * 120;
          const roadCenterX = (w * 0.5) + curve - (race.playerX * (w * 0.35) * depth);
          const boxX = roadCenterX + (box.x * (roadWidth / 2));
          const boxSize = 14 + (28 * depth);

          // Golden Question Box
          ctx.fillStyle = '#f59e0b';
          ctx.fillRect(boxX - boxSize / 2, boxY - boxSize, boxSize, boxSize);
          ctx.strokeStyle = '#000000';
          ctx.lineWidth = 2;
          ctx.strokeRect(boxX - boxSize / 2, boxY - boxSize, boxSize, boxSize);
          ctx.fillStyle = '#ffffff';
          ctx.font = `bold ${Math.max(10, Math.round(boxSize * 0.65))}px monospace`;
          ctx.fillText('?', boxX - boxSize * 0.22, boxY - boxSize * 0.25);
        }
      });

      // 6. Draw Rival Karts Ahead
      race.rivals.forEach((rival) => {
        const distFromPlayer = rival.distance - race.playerDist;
        if (distFromPlayer > 0 && distFromPlayer < 1200) {
          const depth = 1 - (distFromPlayer / 1200);
          const rivalY = horizonY + (roadBottomY - horizonY) * (depth * depth);
          const roadWidth = (w * 0.15) + (w * 0.65 * depth);
          const curve = Math.sin((race.playerDist + (1 - depth) * 500) * 0.002) * (1 - depth) * 120;
          const roadCenterX = (w * 0.5) + curve - (race.playerX * (w * 0.35) * depth);
          const rivalX = roadCenterX + (rival.x * (roadWidth / 2));
          const kartScale = 0.5 + (depth * 0.7);

          // Kart Body
          ctx.fillStyle = rival.color;
          ctx.fillRect(rivalX - 22 * kartScale, rivalY - 18 * kartScale, 44 * kartScale, 18 * kartScale);
          // Wheels
          ctx.fillStyle = '#0f172a';
          ctx.fillRect(rivalX - 26 * kartScale, rivalY - 12 * kartScale, 8 * kartScale, 14 * kartScale);
          ctx.fillRect(rivalX + 18 * kartScale, rivalY - 12 * kartScale, 8 * kartScale, 14 * kartScale);
          // Rival Name Tag
          ctx.fillStyle = '#000000';
          ctx.font = `bold ${Math.max(9, Math.round(11 * kartScale))}px "Press Start 2P", monospace`;
          ctx.fillText(rival.name, rivalX - 24 * kartScale, rivalY - 24 * kartScale);
        }
      });

      // 7. Draw Player's Own Kart at Foreground Center
      const playerScreenX = w * 0.5;
      const playerScreenY = h * 0.86;

      // Exhaust Boost Flames
      if (race.boostRemaining > 0) {
        ctx.fillStyle = '#f59e0b';
        ctx.beginPath();
        ctx.arc(playerScreenX - 20, playerScreenY + 14, 12 + Math.random() * 8, 0, Math.PI * 2);
        ctx.arc(playerScreenX + 20, playerScreenY + 14, 12 + Math.random() * 8, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#ef4444';
        ctx.beginPath();
        ctx.arc(playerScreenX - 20, playerScreenY + 14, 7, 0, Math.PI * 2);
        ctx.arc(playerScreenX + 20, playerScreenY + 14, 7, 0, Math.PI * 2);
        ctx.fill();
      }

      // Kart Wheels (Black rubber with silver hub)
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(playerScreenX - 44, playerScreenY + 2, 16, 26);
      ctx.fillRect(playerScreenX + 28, playerScreenY + 2, 16, 26);
      ctx.fillStyle = '#94a3b8';
      ctx.fillRect(playerScreenX - 40, playerScreenY + 8, 8, 14);
      ctx.fillRect(playerScreenX + 32, playerScreenY + 8, 8, 14);

      // Kart Chassis (Tinted to Equipped Hero!)
      const heroPalette = getHeroMeta(equippedAvatar);
      ctx.fillStyle = heroPalette.primaryColor;
      ctx.fillRect(playerScreenX - 32, playerScreenY - 6, 64, 28);
      ctx.strokeStyle = '#0f172a';
      ctx.lineWidth = 3;
      ctx.strokeRect(playerScreenX - 32, playerScreenY - 6, 64, 28);

      // Rear Spoiler
      ctx.fillStyle = heroPalette.secondaryColor;
      ctx.fillRect(playerScreenX - 36, playerScreenY + 16, 72, 8);
      ctx.strokeRect(playerScreenX - 36, playerScreenY + 16, 72, 8);

      // Steering Wheel
      ctx.fillStyle = '#0f172a';
      ctx.beginPath();
      ctx.arc(playerScreenX, playerScreenY - 6, 12, 0, Math.PI);
      ctx.stroke();

      // Driver Head / Cap
      ctx.fillStyle = heroPalette.primaryColor;
      ctx.beginPath();
      ctx.arc(playerScreenX, playerScreenY - 22, 18, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = '#fed7aa';
      ctx.fillRect(playerScreenX - 12, playerScreenY - 18, 24, 12);
      ctx.fillStyle = '#451a03';
      ctx.fillRect(playerScreenX - 10, playerScreenY - 10, 20, 5);

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, [gameState, equippedAvatar]);

  const handleStartRace = () => {
    raceRef.current.playerDist = 0;
    raceRef.current.playerSpeed = 0;
    raceRef.current.lap = 1;
    raceRef.current.rivals[0].distance = 40;
    raceRef.current.rivals[1].distance = 25;
    raceRef.current.rivals[2].distance = 10;
    raceRef.current.rivals.forEach((r) => (r.spinout = 0));
    raceRef.current.itemBoxes.forEach((b) => (b.hit = false));
    raceRef.current.coins.forEach((c) => (c.hit = false));
    setCurrentLap(1);
    setGameState('racing');
    marioAudio.playPowerUp();
  };

  return (
    <div className="space-y-4 max-w-4xl mx-auto">
      {/* Top Retro HUD */}
      <div className="bg-[#1e293b] rounded-3xl p-4 sm:p-5 border-4 border-slate-950 shadow-[6px_6px_0_#000] text-white">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b-2 border-slate-700 pb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-400 rounded-xl border-2 border-black flex items-center justify-center flex-shrink-0">
              <MarioCharacterAvatar character={equippedAvatar} className="w-7 h-7" />
            </div>
            <div>
              <span className="text-[10px] font-black uppercase text-amber-400 tracking-wider font-mario block">
                LABOR KART GP • GRAND PRIX
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-white font-display">
                MUSHROOM CIRCUIT
              </h2>
            </div>
          </div>

          {/* Race Telemetry Strip */}
          <div className="flex items-center gap-2 sm:gap-4 bg-slate-900/90 px-3 py-1.5 rounded-2xl border-2 border-slate-700 flex-wrap w-full sm:w-auto justify-between sm:justify-start">
            <div className="flex items-center gap-1 font-mario text-[10px] sm:text-xs text-amber-300">
              <MarioCoinIcon className="w-4 h-4 shrink-0" />
              <span>x{coinsGathered.toString().padStart(2, '0')}</span>
            </div>
            <div className="font-mario text-[10px] sm:text-xs text-white">
              LAP: <span className="text-emerald-400">{Math.min(3, currentLap)}/3</span>
            </div>
            <div className="font-mario text-[10px] sm:text-xs text-amber-400">
              POS: <span className={position === 1 ? 'text-emerald-400' : 'text-amber-300'}>{position}ST</span>
            </div>
            <div className="font-mario text-[10px] sm:text-xs text-cyan-300">
              {speedMph} MPH
            </div>
          </div>
        </div>

        {/* Item Banner Notice */}
        {activeItem && (
          <div className="mt-3 bg-amber-400 text-slate-950 px-3 py-1.5 rounded-xl border-2 border-black font-mario text-xs flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Zap className="w-4 h-4 fill-current text-red-600" />
              <span>{activeItem}</span>
            </span>
            <span className="text-[10px] bg-red-600 text-white px-2 py-0.5 rounded font-bold">
              ACTIVE
            </span>
          </div>
        )}

        {/* Game Canvas Viewport */}
        <div className="relative mt-4 rounded-2xl border-4 border-slate-950 overflow-hidden bg-slate-950 shadow-2xl h-[360px] sm:h-[420px]">
          <canvas
            ref={canvasRef}
            width={760}
            height={420}
            className="w-full h-full block object-cover"
          />

          {/* Start Menu Overlay */}
          {gameState === 'menu' && (
            <div className="absolute inset-0 bg-slate-950/88 flex flex-col items-center justify-center text-center p-6 space-y-4 text-white">
              <span className="font-mario text-amber-400 text-xs tracking-wider">
                WORLD CIRCUIT • PHILIPPINE LABOR STANDARDS
              </span>
              <h3 className="text-3xl sm:text-4xl font-black font-display text-white">
                LABOR KART GP
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 max-w-md font-semibold leading-relaxed">
                Drive {getHeroMeta(equippedAvatar).name} across 3 laps! Hit mystery [?] boxes on track to answer Labor Law questions for Super Mushroom boosts and Red Shells to beat Bowser and win the Grand Prix!
              </p>
              <button
                onClick={handleStartRace}
                className="flex items-center gap-2 px-8 py-3.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black rounded-xl border-3 border-black shadow-[0_4px_0_#000] active:translate-y-0.5 text-base cursor-pointer font-mario"
              >
                <Play className="w-5 h-5 fill-current" />
                <span>START RACE</span>
              </button>
            </div>
          )}

          {/* Quick-Fire Item Box Labor Law Question Modal */}
          {gameState === 'question' && activeQuestion && (
            <div className="absolute inset-0 bg-slate-950/92 flex flex-col items-center justify-center p-5 text-white z-30">
              <div className="bg-slate-900 border-4 border-amber-400 rounded-3xl p-5 sm:p-6 max-w-lg w-full space-y-4 shadow-2xl">
                <div className="flex items-center justify-between border-b-2 border-slate-700 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-amber-400 font-mario text-sm">[ ? ] ITEM BOX CHALLENGE</span>
                  </div>
                  <span className="text-xs bg-red-600 text-white font-black px-2 py-0.5 rounded font-mario">
                    RAPID BOOST
                  </span>
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] text-amber-400 font-mario uppercase">
                    ANSWER CORRECTLY FOR: {activeQuestion.boostReward}
                  </span>
                  <p className="text-sm sm:text-base font-extrabold text-white leading-snug">
                    {activeQuestion.question}
                  </p>
                </div>

                <div className="space-y-2">
                  {activeQuestion.options.map((opt, oIdx) => (
                    <button
                      key={oIdx}
                      onClick={() => handleAnswerQuestion(oIdx)}
                      className="w-full text-left p-3 rounded-xl bg-slate-800 hover:bg-amber-400 hover:text-slate-950 text-white text-xs sm:text-sm font-bold border-2 border-slate-600 transition-all flex items-center gap-2.5 cursor-pointer"
                    >
                      <span className="inline-flex items-center justify-center w-6 h-6 rounded-lg bg-black text-amber-400 text-xs font-black font-mario flex-shrink-0">
                        {String.fromCharCode(65 + oIdx)}
                      </span>
                      <span>{opt}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Victory Podium Overlay */}
          {gameState === 'victory' && (
            <div className="absolute inset-0 bg-emerald-950/90 flex flex-col items-center justify-center text-center p-6 space-y-4 text-white">
              <Trophy className="w-16 h-16 text-amber-300 animate-bounce" />
              <h3 className="text-3xl sm:text-4xl font-black font-display text-white">
                1ST PLACE GRAND PRIX CHAMPION!
              </h3>
              <p className="text-sm text-slate-200 font-bold max-w-md">
                You mastered the Labor Law questions and took 1st place in the Labor Kart Grand Prix! +50 Mario Coins earned!
              </p>
              <button
                onClick={handleStartRace}
                className="flex items-center gap-2 px-6 py-3 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black rounded-xl border-3 border-black shadow-[0_4px_0_#000] cursor-pointer font-mario text-xs"
              >
                <RotateCcw className="w-4 h-4" />
                <span>RACE AGAIN</span>
              </button>
            </div>
          )}
        </div>

        {/* On-Screen Virtual Controls */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-3">
          <div className="flex items-center gap-2">
            <button
              onMouseDown={() => (keysRef.current.left = true)}
              onMouseUp={() => (keysRef.current.left = false)}
              onTouchStart={() => (keysRef.current.left = true)}
              onTouchEnd={() => (keysRef.current.left = false)}
              aria-label="Steer Left"
              className="min-h-[44px] px-3 py-2.5 bg-slate-800 active:bg-amber-400 active:text-black rounded-xl border-2 border-slate-600 font-black font-mario text-[10px] sm:text-xs whitespace-nowrap"
            >
              <span className="sm:hidden">◀ LEFT</span>
              <span className="hidden sm:inline">◀ STEER LEFT</span>
            </button>
            <button
              onMouseDown={() => (keysRef.current.right = true)}
              onMouseUp={() => (keysRef.current.right = false)}
              onTouchStart={() => (keysRef.current.right = true)}
              onTouchEnd={() => (keysRef.current.right = false)}
              aria-label="Steer Right"
              className="min-h-[44px] px-3 py-2.5 bg-slate-800 active:bg-amber-400 active:text-black rounded-xl border-2 border-slate-600 font-black font-mario text-[10px] sm:text-xs whitespace-nowrap"
            >
              <span className="sm:hidden">RIGHT ▶</span>
              <span className="hidden sm:inline">STEER RIGHT ▶</span>
            </button>
          </div>

          <div className="text-xs text-slate-400 font-semibold hidden md:block">
            Controls: WASD or Arrow Keys (Up = Accelerate, Down = Brake, Left/Right = Steer)
          </div>

          <div className="flex items-center gap-2">
            {inventoryItem ? (
              <button
                onClick={useInventoryItem}
                aria-label={`Use ${inventoryItem}`}
                className="min-h-[44px] px-4 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black rounded-xl border-3 border-black shadow-[0_3px_0_#000] active:translate-y-0.5 font-mario text-[10px] sm:text-xs cursor-pointer whitespace-nowrap animate-pulse"
              >
                ★ USE {inventoryItem.toUpperCase()} (SPACE)
              </button>
            ) : (
              <div className="hidden sm:inline-flex items-center gap-1 bg-slate-950 px-2.5 py-1.5 rounded-xl border border-slate-700 text-[10px] font-mario text-slate-500">
                NO ITEM
              </div>
            )}

            <button
              onMouseDown={() => (keysRef.current.accel = true)}
              onMouseUp={() => (keysRef.current.accel = false)}
              onTouchStart={() => (keysRef.current.accel = true)}
              onTouchEnd={() => (keysRef.current.accel = false)}
              aria-label="Accelerate"
              className="min-h-[44px] px-5 sm:px-6 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black rounded-xl border-3 border-black shadow-[0_3px_0_#000] active:translate-y-0.5 font-mario text-[10px] sm:text-xs cursor-pointer whitespace-nowrap"
            >
              GAS ▲
            </button>
          </div>
        </div>

        {/* Engine Class Selector Bar */}
        <div className="mt-3 pt-2.5 border-t border-slate-800 flex items-center justify-between gap-2 flex-wrap text-xs">
          <span className="text-[10px] font-black uppercase text-slate-400 font-mario">
            SPEED CLASS:
          </span>
          <div className="flex items-center gap-1.5">
            {(['50cc', '100cc', '150cc'] as const).map((cc) => (
              <button
                key={cc}
                onClick={() => {
                  setEngineClass(cc);
                  marioAudio.playCoin();
                }}
                className={`px-3 py-1 rounded-lg font-mario text-[10px] font-black border transition-all cursor-pointer ${
                  engineClass === cc
                    ? 'bg-amber-400 text-slate-950 border-black shadow-[0_2px_0_#000]'
                    : 'bg-slate-800 text-slate-300 border-slate-700 hover:text-white'
                }`}
              >
                {cc}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
