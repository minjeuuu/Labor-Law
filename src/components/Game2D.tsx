import React, { useRef, useEffect, useState } from 'react';
import { marioAudio } from '../utils/audio';
import { MarioAvatar } from '../types/laborLaw';
import { getHeroMeta } from '../data/heroesData';
import { MarioCharacterAvatar, MarioCoinIcon, MarioStarIcon } from './MarioIcons';
import { Play, RotateCcw, ArrowLeft, ArrowRight, ArrowUp, Zap, HelpCircle } from 'lucide-react';
import confetti from 'canvas-confetti';

interface Game2DProps {
  fontSize?: 'normal' | 'large' | 'xlarge';
  equippedAvatar?: MarioAvatar;
  onEarnCoins: (amount: number) => void;
}

export const Game2D: React.FC<Game2DProps> = ({ equippedAvatar = 'mario', onEarnCoins }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [gameState, setGameState] = useState<'start' | 'playing' | 'gameover' | 'victory'>('start');
  const [score, setScore] = useState(0);
  const [coins, setCoins] = useState(0);
  const [lives, setLives] = useState(3);
  const [latestFact, setLatestFact] = useState<string>('Hit [?] blocks from below to collect coins and legal doctrines!');

  // Keys state
  const keysRef = useRef<{ left: boolean; right: boolean; jump: boolean }>({
    left: false,
    right: false,
    jump: false,
  });

  const doctrines = [
    'Coverage for statutory benefits starts on Day 1 of employment!',
    'Field personnel test: actual hours of work in field cannot be determined with reasonable certainty.',
    'Brownouts of 20 minutes or less are compensable working hours!',
    'Worked Regular Holiday = 200% daily wage for the first 8 hours.',
    '100% of service charges go to rank-and-file under R.A. 11360.',
    'Substitute payment in food/electricity for 13th month pay is ILLEGAL.',
    'Undertime cannot be offset by overtime on another day.',
    'Kasambahay: 3 adequate meals a day and 5 days SIL after 1 year.',
    'Safe Spaces Act covers peer-to-peer workplace sexual harassment.',
    'VAWC cases: intoxication or drugs is NEVER an admissible defense.',
    'Retirement pay: 22.5 days of salary per year of service.',
    'Magna Carta for Women: 2 months special leave with full pay for gynecological surgery.',
  ];

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['ArrowLeft', 'KeyA'].includes(e.code)) keysRef.current.left = true;
      if (['ArrowRight', 'KeyD'].includes(e.code)) keysRef.current.right = true;
      if (['ArrowUp', 'KeyW', 'Space'].includes(e.code)) {
        keysRef.current.jump = true;
        e.preventDefault();
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (['ArrowLeft', 'KeyA'].includes(e.code)) keysRef.current.left = false;
      if (['ArrowRight', 'KeyD'].includes(e.code)) keysRef.current.right = false;
      if (['ArrowUp', 'KeyW', 'Space'].includes(e.code)) keysRef.current.jump = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId = 0;
    let lastTime = performance.now();

    // High performance player object
    const player = {
      x: 60,
      y: 280,
      width: 28,
      height: 38,
      vx: 0,
      vy: 0,
      speed: 4.8,
      jumpForce: -12.0,
      grounded: false,
      direction: 1, // 1: right, -1: left
    };

    const gravity = 0.58;
    const groundY = 330;
    const flagpoleX = 2100;

    // Blocks
    const blocks = [
      { x: 180, y: 230, w: 36, h: 36, type: 'q', hit: false },
      { x: 216, y: 230, w: 36, h: 36, type: 'brick' },
      { x: 252, y: 230, w: 36, h: 36, type: 'q', hit: false },
      { x: 400, y: 200, w: 36, h: 36, type: 'q', hit: false },
      { x: 436, y: 200, w: 36, h: 36, type: 'brick' },
      { x: 600, y: 230, w: 36, h: 36, type: 'brick' },
      { x: 636, y: 230, w: 36, h: 36, type: 'q', hit: false },
      { x: 820, y: 200, w: 36, h: 36, type: 'q', hit: false },
      { x: 856, y: 200, w: 36, h: 36, type: 'brick' },
      { x: 892, y: 200, w: 36, h: 36, type: 'q', hit: false },
      { x: 1100, y: 220, w: 36, h: 36, type: 'q', hit: false },
      { x: 1300, y: 200, w: 36, h: 36, type: 'q', hit: false },
      { x: 1500, y: 220, w: 36, h: 36, type: 'q', hit: false },
      { x: 1750, y: 190, w: 36, h: 36, type: 'q', hit: false },
    ];

    // Pipes
    const pipes = [
      { x: 320, y: 270, w: 46, h: 60 },
      { x: 720, y: 250, w: 46, h: 80 },
      { x: 1200, y: 260, w: 46, h: 70 },
      { x: 1600, y: 250, w: 46, h: 80 },
    ];

    // Coins
    const airCoins = [
      { x: 140, y: 280, collected: false },
      { x: 480, y: 270, collected: false },
      { x: 510, y: 270, collected: false },
      { x: 780, y: 270, collected: false },
      { x: 960, y: 270, collected: false },
      { x: 1400, y: 270, collected: false },
      { x: 1900, y: 270, collected: false },
    ];

    // Enemies (Goombas)
    const enemies = [
      { x: 480, y: 304, w: 26, h: 26, vx: -1.2, alive: true },
      { x: 880, y: 304, w: 26, h: 26, vx: -1.2, alive: true },
      { x: 1350, y: 304, w: 26, h: 26, vx: -1.2, alive: true },
      { x: 1700, y: 304, w: 26, h: 26, vx: -1.2, alive: true },
    ];

    let cameraX = 0;
    let localScore = score;
    let localCoins = coins;
    let coyoteTimer = 0;
    let jumpBufferTimer = 0;

    const gameLoop = (currentTime: number) => {
      const dt = Math.min(32, currentTime - lastTime);
      lastTime = currentTime;

      if (gameState === 'playing') {
        // Horizontal Movement
        if (keysRef.current.left) {
          player.vx = -player.speed;
          player.direction = -1;
        } else if (keysRef.current.right) {
          player.vx = player.speed;
          player.direction = 1;
        } else {
          player.vx = 0;
        }

        // Coyote Time & Jump Buffering
        if (player.grounded) {
          coyoteTimer = 7;
        } else if (coyoteTimer > 0) {
          coyoteTimer--;
        }

        if (keysRef.current.jump) {
          jumpBufferTimer = 6;
        } else if (jumpBufferTimer > 0) {
          jumpBufferTimer--;
        }

        // Trigger Jump if buffer active and player is grounded (or in coyote window)
        if (jumpBufferTimer > 0 && (player.grounded || coyoteTimer > 0)) {
          player.vy = player.jumpForce;
          player.grounded = false;
          coyoteTimer = 0;
          jumpBufferTimer = 0;
          marioAudio.playJump();
        }

        // Variable Jump Height Cut: Early release dampens upward velocity
        if (!keysRef.current.jump && player.vy < -2.5) {
          player.vy *= 0.52;
        }

        // Physics
        player.vy += gravity;
        player.x += player.vx;
        player.y += player.vy;

        // Camera Left Bound Guard
        if (player.x < cameraX) player.x = cameraX;

        // Ground landing
        if (player.y + player.height >= groundY) {
          player.y = groundY - player.height;
          player.vy = 0;
          player.grounded = true;
        }

        // Block Collisions
        blocks.forEach((block) => {
          // Bottom head bump
          if (
            player.x + player.width > block.x + 2 &&
            player.x < block.x + block.w - 2 &&
            player.y <= block.y + block.h &&
            player.y >= block.y + block.h - 14 &&
            player.vy < 0
          ) {
            player.y = block.y + block.h;
            player.vy = 0;
            if (block.type === 'q' && !block.hit) {
              block.hit = true;
              localCoins += 1;
              localScore += 200;
              setCoins(localCoins);
              setScore(localScore);
              onEarnCoins(1);
              marioAudio.playCoin();
              const fact = doctrines[Math.floor(Math.random() * doctrines.length)];
              setLatestFact(fact);
            } else {
              marioAudio.playJump();
            }
          }

          // Top landing
          if (
            player.x + player.width > block.x + 4 &&
            player.x < block.x + block.w - 4 &&
            player.y + player.height >= block.y &&
            player.y + player.height <= block.y + 14 &&
            player.vy >= 0
          ) {
            player.y = block.y - player.height;
            player.vy = 0;
            player.grounded = true;
          }
        });

        // Pipe Collisions
        pipes.forEach((pipe) => {
          if (
            player.x + player.width > pipe.x &&
            player.x < pipe.x + pipe.w &&
            player.y + player.height > pipe.y
          ) {
            // Landing on pipe
            if (player.y + player.height - player.vy <= pipe.y + 10 && player.vy >= 0) {
              player.y = pipe.y - player.height;
              player.vy = 0;
              player.grounded = true;
            } else {
              // Side obstruction
              if (player.direction === 1) {
                player.x = pipe.x - player.width;
              } else {
                player.x = pipe.x + pipe.w;
              }
            }
          }
        });

        // Air Coins
        airCoins.forEach((c) => {
          if (!c.collected && Math.hypot(player.x - c.x, player.y - c.y) < 32) {
            c.collected = true;
            localCoins += 1;
            localScore += 100;
            setCoins(localCoins);
            setScore(localScore);
            onEarnCoins(1);
            marioAudio.playCoin();
          }
        });

        // Enemies Update
        enemies.forEach((enemy) => {
          if (!enemy.alive) return;
          enemy.x += enemy.vx;
          if (enemy.x < cameraX - 80) enemy.alive = false;

          // Collision with player
          if (
            player.x + player.width > enemy.x &&
            player.x < enemy.x + enemy.w &&
            player.y + player.height > enemy.y &&
            player.y < enemy.y + enemy.h
          ) {
            // Top Stomp
            if (player.vy > 0 && player.y + player.height - player.vy <= enemy.y + 14) {
              enemy.alive = false;
              player.vy = -8;
              localScore += 300;
              setScore(localScore);
              marioAudio.playPowerUp();
            } else {
              // Hurt player
              marioAudio.playPipe();
              setLives((l) => {
                const next = l - 1;
                if (next <= 0) {
                  setGameState('gameover');
                } else {
                  player.x = Math.max(0, player.x - 80);
                  player.y = groundY - player.height;
                }
                return next;
              });
            }
          }
        });

        // Flagpole Victory Check
        if (player.x >= flagpoleX) {
          marioAudio.playOneUp();
          setGameState('victory');
          onEarnCoins(20);
          try {
            confetti({ particleCount: 100, spread: 80, origin: { y: 0.6 } });
          } catch {
            // ignore
          }
          return;
        }

        // Smooth camera follow
        if (player.x - cameraX > 320) {
          cameraX = player.x - 320;
        }
      }

      // RENDER
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Sky Blue
      const skyGrad = ctx.createLinearGradient(0, 0, 0, groundY);
      skyGrad.addColorStop(0, '#38bdf8');
      skyGrad.addColorStop(1, '#93c5fd');
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, canvas.width, groundY);

      // Ground (Brown Brick pattern)
      ctx.fillStyle = '#7c2d12';
      ctx.fillRect(0, groundY, canvas.width, canvas.height - groundY);
      ctx.fillStyle = '#16a34a'; // Grass line
      ctx.fillRect(0, groundY, canvas.width, 8);

      ctx.save();
      ctx.translate(-cameraX, 0);

      // Clouds
      ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
      [120, 500, 950, 1400, 1850].forEach((cx) => {
        ctx.beginPath();
        ctx.arc(cx, 60, 22, 0, Math.PI * 2);
        ctx.arc(cx + 22, 54, 26, 0, Math.PI * 2);
        ctx.arc(cx + 46, 60, 20, 0, Math.PI * 2);
        ctx.fill();
      });

      // Flagpole
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(flagpoleX + 12, 110, 6, 220);
      ctx.fillStyle = '#f59e0b';
      ctx.beginPath();
      ctx.arc(flagpoleX + 15, 110, 8, 0, Math.PI * 2);
      ctx.fill();
      // Flag banner
      ctx.fillStyle = '#dc2626';
      ctx.beginPath();
      ctx.moveTo(flagpoleX + 12, 115);
      ctx.lineTo(flagpoleX - 35, 130);
      ctx.lineTo(flagpoleX + 12, 145);
      ctx.fill();

      // Pipes
      pipes.forEach((p) => {
        ctx.fillStyle = '#15803d';
        ctx.fillRect(p.x, p.y, p.w, p.h);
        ctx.fillStyle = '#22c55e';
        ctx.fillRect(p.x + 6, p.y, 6, p.h);
        ctx.strokeStyle = '#0f172a';
        ctx.lineWidth = 3;
        ctx.strokeRect(p.x, p.y, p.w, p.h);
        // Top Rim
        ctx.fillStyle = '#16a34a';
        ctx.fillRect(p.x - 4, p.y, p.w + 8, 14);
        ctx.strokeRect(p.x - 4, p.y, p.w + 8, 14);
      });

      // Blocks
      blocks.forEach((b) => {
        if (b.type === 'q') {
          ctx.fillStyle = b.hit ? '#94a3b8' : '#f59e0b';
          ctx.fillRect(b.x, b.y, b.w, b.h);
          ctx.strokeStyle = '#0f172a';
          ctx.lineWidth = 3;
          ctx.strokeRect(b.x, b.y, b.w, b.h);
          ctx.fillStyle = '#0f172a';
          ctx.font = 'bold 20px monospace';
          ctx.fillText(b.hit ? '•' : '?', b.x + 11, b.y + 26);
        } else {
          ctx.fillStyle = '#9a3412';
          ctx.fillRect(b.x, b.y, b.w, b.h);
          ctx.strokeStyle = '#0f172a';
          ctx.lineWidth = 3;
          ctx.strokeRect(b.x, b.y, b.w, b.h);
          ctx.fillStyle = '#431407';
          ctx.fillRect(b.x + 4, b.y + 16, b.w - 8, 3);
        }
      });

      // Air Coins
      airCoins.forEach((c) => {
        if (c.collected) return;
        ctx.fillStyle = '#f59e0b';
        ctx.beginPath();
        ctx.ellipse(c.x, c.y, 8, 12, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#0f172a';
        ctx.lineWidth = 2;
        ctx.stroke();
      });

      // Enemies
      enemies.forEach((e) => {
        if (!e.alive) return;
        ctx.fillStyle = '#854d0e';
        ctx.beginPath();
        ctx.arc(e.x + 13, e.y + 13, 13, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#0f172a';
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(e.x + 6, e.y + 6, 4, 6);
        ctx.fillRect(e.x + 16, e.y + 6, 4, 6);
        ctx.fillStyle = '#000000';
        ctx.fillRect(e.x + 7, e.y + 8, 2, 4);
        ctx.fillRect(e.x + 17, e.y + 8, 2, 4);
      });

      // Player Character (Dynamic Color for all 24 equipped heroes!)
      const heroColors = getHeroMeta(equippedAvatar);
      const capColor = heroColors.primaryColor;
      const overallsColor = heroColors.secondaryColor;

      ctx.fillStyle = capColor;
      ctx.fillRect(player.x, player.y, player.width, player.height * 0.4);
      // Brim
      ctx.fillRect(player.direction === 1 ? player.x + 8 : player.x - 4, player.y + 4, 20, 6);
      // Face
      ctx.fillStyle = '#fed7aa';
      ctx.fillRect(player.x + 4, player.y + 12, player.width - 8, 12);
      // Mustache
      ctx.fillStyle = '#451a03';
      ctx.fillRect(player.direction === 1 ? player.x + 12 : player.x + 4, player.y + 18, 10, 4);
      // Overalls
      ctx.fillStyle = overallsColor;
      ctx.fillRect(player.x + 2, player.y + 22, player.width - 4, player.height - 22);
      ctx.fillStyle = '#facc15';
      ctx.fillRect(player.x + 6, player.y + 24, 3, 3);
      ctx.fillRect(player.x + player.width - 9, player.y + 24, 3, 3);

      ctx.restore();

      animId = requestAnimationFrame(gameLoop);
    };

    animId = requestAnimationFrame(gameLoop);
    return () => cancelAnimationFrame(animId);
  }, [gameState, equippedAvatar]);

  const startGame = () => {
    setGameState('playing');
    setLives(3);
    setScore(0);
    setCoins(0);
    setLatestFact('Hit [?] blocks to reveal Labor Law doctrines!');
    marioAudio.playPowerUp();
  };

  return (
    <div className="space-y-4 max-w-4xl mx-auto">
      <div className="bg-[#1e293b] rounded-3xl mario-card border-4 border-slate-950 p-4 sm:p-6 text-white space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b-2 border-slate-700 pb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-400 rounded-xl border-2 border-black flex items-center justify-center flex-shrink-0">
              <MarioCharacterAvatar character={equippedAvatar} className="w-7 h-7" />
            </div>
            <div>
              <span className="text-[10px] font-black uppercase text-amber-400 tracking-wider font-mario block">
                2D RETRO PLATFORMER
              </span>
              <h2 className="text-xl sm:text-2xl font-black font-display text-white">
                SUPER MARIO LABOR RUNNER
              </h2>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between sm:justify-start gap-2.5 sm:gap-4 bg-slate-900/90 px-3 py-1.5 rounded-2xl border-2 border-slate-700 w-full sm:w-auto">
            <div className="flex items-center gap-1 font-mario text-[10px] sm:text-xs text-amber-300">
              <MarioCoinIcon className="w-4 h-4 shrink-0" />
              <span>x{coins.toString().padStart(2, '0')}</span>
            </div>
            <div className="font-mario text-[10px] sm:text-xs text-white">
              SCORE: <span className="text-emerald-400">{score.toString().padStart(5, '0')}</span>
            </div>
            <div className="font-mario text-[10px] sm:text-xs text-rose-400">
              LIVES: {Array(Math.max(0, lives)).fill('♥').join(' ')}
            </div>
          </div>
        </div>

        {/* Fact Banner */}
        <div className="bg-amber-400 text-slate-950 p-3 rounded-xl border-2 border-black font-bold text-xs sm:text-sm shadow-sm flex items-center gap-2">
          <span className="font-mario text-[10px] bg-red-600 text-white px-2 py-0.5 rounded">
            DOCTRINE:
          </span>
          <span className="font-black truncate">{latestFact}</span>
        </div>

        {/* Canvas Display */}
        <div className="relative rounded-2xl border-4 border-slate-950 overflow-hidden bg-slate-950 shadow-2xl h-[360px] sm:h-[380px]">
          <canvas
            ref={canvasRef}
            width={760}
            height={380}
            className="w-full h-full block object-cover"
          />

          {gameState === 'start' && (
            <div className="absolute inset-0 bg-slate-950/88 flex flex-col items-center justify-center text-center p-6 space-y-4 text-white">
              <span className="font-mario text-amber-400 text-xs tracking-wider">
                STAGE 1-1 • PHILIPPINE LABOR STANDARDS
              </span>
              <h3 className="text-3xl sm:text-4xl font-black font-display text-white">
                SUPER MARIO RUN
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 max-w-md font-semibold leading-relaxed">
                Run and jump with Arrow keys or WASD. Hit [?] blocks from underneath to collect Labor Law doctrines and coins! Avoid or stomp Goombas, and touch the Flagpole to clear the course!
              </p>
              <button
                onClick={startGame}
                className="flex items-center gap-2 px-8 py-3.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black rounded-xl border-3 border-black shadow-[0_4px_0_#000] active:translate-y-0.5 text-base cursor-pointer font-mario"
              >
                <Play className="w-5 h-5 fill-current" />
                <span>START RUN</span>
              </button>
            </div>
          )}

          {gameState === 'gameover' && (
            <div className="absolute inset-0 bg-red-950/90 flex flex-col items-center justify-center text-center p-6 space-y-4 text-white">
              <span className="font-mario text-amber-400 text-lg">GAME OVER</span>
              <p className="text-sm text-slate-200 font-bold">
                Final Score: {score} • Coins: {coins}
              </p>
              <button
                onClick={startGame}
                className="flex items-center gap-2 px-6 py-3 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black rounded-xl border-3 border-black shadow-[0_4px_0_#000] cursor-pointer font-mario text-xs"
              >
                <RotateCcw className="w-4 h-4" />
                <span>TRY AGAIN</span>
              </button>
            </div>
          )}

          {gameState === 'victory' && (
            <div className="absolute inset-0 bg-emerald-950/90 flex flex-col items-center justify-center text-center p-6 space-y-4 text-white">
              <span className="font-mario text-amber-300 text-xl font-mario">COURSE CLEARED!</span>
              <div className="bg-amber-400 text-slate-950 p-4 rounded-2xl border-3 border-black max-w-md space-y-1">
                <span className="font-black text-base sm:text-lg block">SUPER JURIS DOCTOR RANK!</span>
                <p className="text-xs sm:text-sm font-bold">
                  You conquered the labor standards platformer with {score} points! +20 Coins earned!
                </p>
              </div>
              <button
                onClick={startGame}
                className="flex items-center gap-2 px-6 py-3 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black rounded-xl border-3 border-black shadow-[0_4px_0_#000] cursor-pointer font-mario text-xs"
              >
                <RotateCcw className="w-4 h-4" />
                <span>PLAY AGAIN</span>
              </button>
            </div>
          )}
        </div>

        {/* On-Screen Mobile / Virtual Controls */}
        <div className="flex items-center justify-between gap-4 pt-2">
          <div className="flex items-center gap-2">
            <button
              onMouseDown={() => (keysRef.current.left = true)}
              onMouseUp={() => (keysRef.current.left = false)}
              onTouchStart={() => (keysRef.current.left = true)}
              onTouchEnd={() => (keysRef.current.left = false)}
              className="p-3 bg-slate-800 active:bg-amber-400 active:text-black rounded-xl border-2 border-slate-600 font-black"
              title="Move Left"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <button
              onMouseDown={() => (keysRef.current.right = true)}
              onMouseUp={() => (keysRef.current.right = false)}
              onTouchStart={() => (keysRef.current.right = true)}
              onTouchEnd={() => (keysRef.current.right = false)}
              className="p-3 bg-slate-800 active:bg-amber-400 active:text-black rounded-xl border-2 border-slate-600 font-black"
              title="Move Right"
            >
              <ArrowRight className="w-6 h-6" />
            </button>
          </div>

          <div className="text-xs text-slate-400 font-semibold hidden sm:block">
            Keyboard: WASD / Arrow Keys + Space to Jump
          </div>

          <button
            onMouseDown={() => (keysRef.current.jump = true)}
            onMouseUp={() => (keysRef.current.jump = false)}
            onTouchStart={() => (keysRef.current.jump = true)}
            onTouchEnd={() => (keysRef.current.jump = false)}
            className="min-h-[48px] px-6 py-3 bg-amber-400 active:bg-amber-300 text-slate-950 font-black rounded-xl border-3 border-black shadow-[0_3px_0_#000] active:translate-y-0.5 flex items-center gap-1.5 cursor-pointer font-mario text-xs"
          >
            <ArrowUp className="w-5 h-5 stroke-[3]" />
            <span>JUMP</span>
          </button>
        </div>
      </div>
    </div>
  );
};
