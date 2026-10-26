import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Search,
  BookOpen,
  Calculator,
  Grid,
  HelpCircle,
  Trophy,
  Gamepad2,
  ShoppingBag,
  Printer,
  ChevronRight,
  X,
  Sparkles,
  Command,
  Calendar,
} from 'lucide-react';
import { ALL_LAW_TOPICS } from '../data/laborLawData';
import { marioAudio } from '../utils/audio';

export interface SearchResultItem {
  id: string;
  title: string;
  subtitle: string;
  category: 'Topic' | 'Calculator' | 'Quiz' | 'Game' | 'Tool';
  tab: string;
  targetId?: string;
  badge?: string;
  icon: React.ReactNode;
}

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectResult: (tab: string, targetId?: string) => void;
  onOpenPrintGuide?: () => void;
  onOpenShop?: () => void;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({
  isOpen,
  onClose,
  onSelectResult,
  onOpenPrintGuide,
  onOpenShop,
}) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const listRef = useRef<HTMLDivElement | null>(null);

  // Pre-compiled search items
  const allItems: SearchResultItem[] = useMemo(() => {
    const list: SearchResultItem[] = [];

    // 1. Labor Law Topics
    ALL_LAW_TOPICS.forEach((t) => {
      list.push({
        id: `topic-${t.id}`,
        title: `${t.badge}: ${t.title}`,
        subtitle: t.summary.slice(0, 95) + '...',
        category: 'Topic',
        tab: 'modules',
        targetId: t.id,
        badge: t.badge,
        icon: <BookOpen className="w-4 h-4 text-amber-400" />,
      });
    });

    // 2. Calculator & Multipliers
    list.push(
      {
        id: 'calc-ot',
        title: 'Overtime & Premium Calculator',
        subtitle: 'Compute exact pesos for 125%, 130%, 150%, 169%, 200%, 260%, 300% rates',
        category: 'Calculator',
        tab: 'calculator',
        badge: 'Formula',
        icon: <Calculator className="w-4 h-4 text-cyan-400" />,
      },
      {
        id: 'calc-13th',
        title: '13th Month Pay Calculator (P.D. 851)',
        subtitle: 'Pro-rated statutory 13th month computation using actual basic salary',
        category: 'Calculator',
        tab: 'calculator',
        badge: 'P.D. 851',
        icon: <Calculator className="w-4 h-4 text-cyan-400" />,
      },
      {
        id: 'calc-distortion',
        title: 'Wage Distortion Formula Calculator',
        subtitle: 'Art. 124 Pineda doctrine formula to restore wage hierarchy',
        category: 'Calculator',
        tab: 'calculator',
        badge: 'Art. 124',
        icon: <Calculator className="w-4 h-4 text-cyan-400" />,
      },
      {
        id: 'calc-matrix',
        title: 'Complete Multiplier Reference Table',
        subtitle: 'Unabridged DOLE labor multipliers for all 18 day types',
        category: 'Calculator',
        tab: 'calculator',
        badge: 'Table',
        icon: <Calculator className="w-4 h-4 text-cyan-400" />,
      }
    );

    // 3. Dedicated Holidays Hub & Regional Wages
    list.push(
      {
        id: 'tool-holidays',
        title: 'Philippine Holidays Hub (12 Regular & Special Days)',
        subtitle: 'Complete Regular Holidays, Special Non-Working/Working Days, Double Holidays (300%/390%), Pay Simulator & Quiz',
        category: 'Topic',
        tab: 'holidays',
        badge: 'Holidays Tab',
        icon: <Calendar className="w-4 h-4 text-rose-400" />,
      },
      {
        id: 'tool-wages',
        title: '17 Regions Minimum Wage Matrix',
        subtitle: 'Official RTWPB wage rates across NCR, Region IV-A, Region VII, BARMM, etc.',
        category: 'Tool',
        tab: 'wages_matrix',
        badge: '17 Regions',
        icon: <Grid className="w-4 h-4 text-blue-400" />,
      }
    );

    // 4. Flashcards & Quizzes
    list.push(
      {
        id: 'tool-flashcards',
        title: '[ ? ] Mystery Block Flashcards (110 Cards)',
        subtitle: 'Rapid active-recall memory cards across all 5 Worlds + Dedicated Holidays Deck',
        category: 'Quiz',
        tab: 'flashcards',
        badge: '110 Cards',
        icon: <HelpCircle className="w-4 h-4 text-yellow-400" />,
      },
      {
        id: 'tool-quiz',
        title: 'Castle Quest (65 Qs) & Bowser Boss Battle (30 Qs)',
        subtitle: '95+ Bar-exam scenario questions with topic filters and Mega Bowser boss mode',
        category: 'Quiz',
        tab: 'quiz',
        badge: '95+ Scenarios',
        icon: <Trophy className="w-4 h-4 text-amber-400" />,
      }
    );

    // 5. Game Vault (All 8 Games)
    list.push(
      {
        id: 'game-3d',
        title: '3D Mario Coin Island (Three.js 3D Arena)',
        subtitle: 'Full 3D Mushroom Kingdom island with solid AABB bounding-box collisions & Castle keep',
        category: 'Game',
        tab: 'vault',
        badge: '3D Island',
        icon: <Gamepad2 className="w-4 h-4 text-emerald-400" />,
      },
      {
        id: 'game-kart',
        title: 'Labor Kart GP (Arcade Racer)',
        subtitle: 'Race Mushroom Circuit and hit [?] item boxes for quiz turbo boosts',
        category: 'Game',
        tab: 'vault',
        badge: 'Kart GP',
        icon: <Gamepad2 className="w-4 h-4 text-emerald-400" />,
      },
      {
        id: 'game-2d',
        title: 'Super Mario Legal Run (2D Platformer)',
        subtitle: 'Jump, stomp Goombas, and smash [?] blocks to reveal Labor Doctrines',
        category: 'Game',
        tab: 'vault',
        badge: '2D Run',
        icon: <Gamepad2 className="w-4 h-4 text-emerald-400" />,
      },
      {
        id: 'game-whack',
        title: 'Whack-a-Goomba: Illegal Deduction Smasher',
        subtitle: 'Smash unlawful wage deductions across 9 warp pipes while sparing Art. 113 deductions',
        category: 'Game',
        tab: 'vault',
        badge: 'Arcade',
        icon: <Gamepad2 className="w-4 h-4 text-emerald-400" />,
      },
      {
        id: 'game-memory',
        title: 'Mario Party: Multiplier Memory Match',
        subtitle: 'Flip 16 [?] blocks to match work scenarios with 125%–390% statutory multipliers',
        category: 'Game',
        tab: 'vault',
        badge: 'Memory',
        icon: <Gamepad2 className="w-4 h-4 text-emerald-400" />,
      },
      {
        id: 'game-mansion',
        title: "Luigi's Mansion: Contractor Buster (D.O. 174)",
        subtitle: 'Bust prohibited Labor-Only Ghost Agencies and certify valid ₱5M contractors',
        category: 'Game',
        tab: 'vault',
        badge: 'D.O. 174',
        icon: <Gamepad2 className="w-4 h-4 text-emerald-400" />,
      },
      {
        id: 'game-bridge',
        title: "Bowser's Bridge: Doctrine Rescue",
        subtitle: 'Decode statutory terms letter-by-letter before Bowser drops the bridge',
        category: 'Game',
        tab: 'vault',
        badge: 'Decoder',
        icon: <Gamepad2 className="w-4 h-4 text-emerald-400" />,
      },
      {
        id: 'game-sorter',
        title: 'Dr. Mario: Holiday & Wage Pipe Sorter',
        subtitle: 'Sort incoming payroll capsules into 100%, 130%–150%, or 200%–390% pipes',
        category: 'Game',
        tab: 'vault',
        badge: 'Sorter',
        icon: <Gamepad2 className="w-4 h-4 text-emerald-400" />,
      }
    );

    // 6. Shop & Print
    list.push(
      {
        id: 'tool-shop',
        title: "Toad's Arcade Item Shop (All 24 Heroes)",
        subtitle: 'Unlock all 24 Mario Universe Heroes (Rosalina, Pauline, Diddy Kong, Bowser Jr., Kamek, etc.) & UI Themes',
        category: 'Tool',
        tab: 'shop',
        badge: '24 Heroes',
        icon: <ShoppingBag className="w-4 h-4 text-pink-400" />,
      },
      {
        id: 'tool-print',
        title: 'Print Study Guide & Offline PDF Export',
        subtitle: 'Clean, printer-friendly summary of user progress and key statutory doctrines',
        category: 'Tool',
        tab: 'print_guide',
        badge: 'Print / PDF',
        icon: <Printer className="w-4 h-4 text-purple-400" />,
      }
    );

    return list;
  }, []);

  // Filter items
  const filteredItems = useMemo(() => {
    if (!query.trim()) return allItems.slice(0, 15);
    const q = query.toLowerCase().trim();
    return allItems
      .filter((item) => {
        return (
          item.title.toLowerCase().includes(q) ||
          item.subtitle.toLowerCase().includes(q) ||
          (item.badge && item.badge.toLowerCase().includes(q)) ||
          item.category.toLowerCase().includes(q)
        );
      })
      .slice(0, 20);
  }, [allItems, query]);

  // Focus input on open
  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
    }
  }, [isOpen]);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev < filteredItems.length - 1 ? prev + 1 : 0));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : filteredItems.length - 1));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (filteredItems[selectedIndex]) {
          executeSelection(filteredItems[selectedIndex]);
        }
      } else if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, filteredItems, selectedIndex]);

  const executeSelection = (item: SearchResultItem) => {
    marioAudio.playPipe();
    onClose();
    if (item.tab === 'print_guide') {
      if (onOpenPrintGuide) onOpenPrintGuide();
    } else if (item.tab === 'shop') {
      if (onOpenShop) onOpenShop();
      else onSelectResult('shop');
    } else {
      onSelectResult(item.tab, item.targetId);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-12 sm:pt-20 px-3 bg-black/75 backdrop-blur-xs select-none">
      <div className="bg-[#1e293b] text-white w-full max-w-2xl rounded-3xl border-4 border-slate-950 shadow-[0_12px_36px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col max-h-[80vh]">
        {/* Search Header Bar */}
        <div className="p-3 sm:p-4 bg-[#0f172a] border-b-2 border-slate-700 flex items-center gap-3">
          <Search className="w-5 h-5 text-amber-400 flex-shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            placeholder="Search labor doctrines, articles, calculators, or games... (Ctrl+K)"
            className="w-full bg-transparent text-white placeholder-slate-400 font-bold text-sm sm:text-base outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-slate-400 hover:text-white p-1"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <kbd className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-[10px] font-mono text-slate-300">
            ESC
          </kbd>
        </div>

        {/* Results List */}
        <div
          ref={listRef}
          className="overflow-y-auto p-2 sm:p-3 space-y-1.5 flex-1"
        >
          {filteredItems.length === 0 ? (
            <div className="py-12 text-center text-slate-400 space-y-2">
              <Search className="w-8 h-8 mx-auto text-slate-500 opacity-60" />
              <p className="font-bold text-sm">No labor doctrines or tools found</p>
              <p className="text-xs text-slate-500">Try searching for &quot;Overtime&quot;, &quot;13th Month&quot;, &quot;Art. 82&quot;, or &quot;Kart&quot;</p>
            </div>
          ) : (
            filteredItems.map((item, idx) => {
              const isSelected = idx === selectedIndex;
              return (
                <div
                  key={item.id}
                  onClick={() => executeSelection(item)}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`flex items-center justify-between p-2.5 sm:p-3 rounded-2xl cursor-pointer transition-all border ${
                    isSelected
                      ? 'bg-amber-400 text-slate-950 border-black shadow-[0_2px_0_#000] scale-[1.01]'
                      : 'bg-slate-900/80 hover:bg-slate-800/90 text-white border-slate-700/60'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0 pr-2">
                    <div
                      className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 border ${
                        isSelected ? 'bg-slate-950 text-amber-400 border-black' : 'bg-slate-800 border-slate-700'
                      }`}
                    >
                      {item.icon}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span
                          className={`font-black text-sm truncate ${
                            isSelected ? 'text-slate-950 font-display' : 'text-slate-100 font-display'
                          }`}
                        >
                          {item.title}
                        </span>
                        {item.badge && (
                          <span
                            className={`text-[10px] font-black uppercase px-1.5 py-0.2 rounded font-mario flex-shrink-0 ${
                              isSelected
                                ? 'bg-black text-amber-300'
                                : 'bg-amber-400/20 text-amber-300 border border-amber-400/30'
                            }`}
                          >
                            {item.badge}
                          </span>
                        )}
                      </div>
                      <p
                        className={`text-xs truncate font-medium ${
                          isSelected ? 'text-slate-800' : 'text-slate-400'
                        }`}
                      >
                        {item.subtitle}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 flex-shrink-0">
                    <span
                      className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                        isSelected
                          ? 'bg-slate-950/10 text-slate-950'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {item.category}
                    </span>
                    <ChevronRight
                      className={`w-4 h-4 ${isSelected ? 'text-slate-950' : 'text-slate-500'}`}
                    />
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer info bar */}
        <div className="p-2.5 sm:p-3 bg-[#0f172a] border-t border-slate-700 flex items-center justify-between text-[11px] font-semibold text-slate-400">
          <div className="flex items-center gap-2">
            <span>Navigate:</span>
            <kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-[10px] font-mono">↑</kbd>
            <kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-[10px] font-mono">↓</kbd>
            <span className="ml-1">Select:</span>
            <kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-[10px] font-mono">↵ Enter</kbd>
          </div>
          <span className="hidden sm:inline font-mario text-[10px] text-amber-400">
            SUPER MARIO SPOTLIGHT
          </span>
        </div>
      </div>
    </div>
  );
};
