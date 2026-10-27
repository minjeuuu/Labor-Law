import React, { useState, useEffect, useRef } from 'react';
import { LawTopic, ComplexityMode } from '../types/laborLaw';
import {
  cleanRuleText,
  formatModuleRuleItems,
  FormattedModuleItem,
  SubClauseItem,
} from '../utils/moduleFormatter';
import {
  ChevronDown,
  ChevronUp,
  Copy,
  Check,
  CheckCircle2,
  ShieldCheck,
  Volume2,
  Play,
  Pause,
  Square,
  Table as TableIcon,
  LayoutGrid,
  Clock,
  Coins,
  BookOpen,
  Scale,
  AlertTriangle,
  Calculator,
  Layers,
} from 'lucide-react';
import {
  MarioMushroomIcon,
  MarioFireFlowerIcon,
  MarioStarIcon,
  Mario1UpIcon,
  MarioCoinIcon,
  MarioQuestionBlockIcon,
} from './MarioIcons';
import { marioAudio } from '../utils/audio';

interface TopicCardProps {
  topic: LawTopic;
  fontSize: 'normal' | 'large' | 'xlarge';
  searchQuery?: string;
  isCompleted?: boolean;
  onToggleComplete?: () => void;
  complexityMode?: ComplexityMode;
  showLegalCitations?: boolean;
}

export const TopicCard: React.FC<TopicCardProps> = ({
  topic,
  fontSize,
  searchQuery = '',
  isCompleted = false,
  onToggleComplete,
  complexityMode = 'beginner',
  showLegalCitations = true,
}) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [copied, setCopied] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1.0);
  const [showSpeedControls, setShowSpeedControls] = useState(false);
  const [viewTab, setViewTab] = useState<'all' | 'cards' | 'tables'>('all');
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const activeChunksRef = useRef<string[]>([]);
  const chunkIndexRef = useRef<number>(0);
  const isCancelledRef = useRef<boolean>(false);

  const stopAllSpeech = () => {
    isCancelledRef.current = true;
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsSpeaking(false);
    setIsPaused(false);
    activeChunksRef.current = [];
    chunkIndexRef.current = 0;
  };

  useEffect(() => {
    return () => {
      stopAllSpeech();
    };
  }, []);

  const bodyTextClass =
    fontSize === 'xlarge'
      ? 'text-xl leading-relaxed'
      : fontSize === 'large'
      ? 'text-lg leading-relaxed'
      : 'text-sm sm:text-base leading-relaxed';

  const headingTextClass =
    fontSize === 'xlarge'
      ? 'text-xl font-black'
      : fontSize === 'large'
      ? 'text-lg font-extrabold'
      : 'text-base font-black';

  const handleCopy = () => {
    const textContent =
      `${topic.title} (${topic.badge})\n\nSummary:\n${topic.summary}\n\nKey Doctrines:\n${topic.keyDoctrines
        .map((d) => `- ${cleanRuleText(d)}`)
        .join('\n')}\n\nRules:\n` +
      topic.rules
        .map((r) => `${r.heading}\n${r.items ? r.items.map((i) => cleanRuleText(i)).join('\n') : ''}`)
        .join('\n\n');
    navigator.clipboard.writeText(textContent);
    setCopied(true);
    marioAudio.playCoin();
    setTimeout(() => setCopied(false), 2000);
  };

  const speakChunkAtIndex = (index: number) => {
    if (isCancelledRef.current) return;
    if (index >= activeChunksRef.current.length) {
      setIsSpeaking(false);
      setIsPaused(false);
      marioAudio.playCoin();
      return;
    }

    const chunkText = activeChunksRef.current[index];
    if (!chunkText || !chunkText.trim()) {
      chunkIndexRef.current = index + 1;
      speakChunkAtIndex(index + 1);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(chunkText);
    utterance.rate = playbackSpeed;
    utterance.pitch = 1.0;

    try {
      const voices = window.speechSynthesis.getVoices();
      if (voices && voices.length > 0) {
        const enVoice = voices.find((v) => v.lang.startsWith('en')) || voices[0];
        if (enVoice) utterance.voice = enVoice;
      }
    } catch {}

    utterance.onend = () => {
      if (!isCancelledRef.current) {
        chunkIndexRef.current = index + 1;
        speakChunkAtIndex(index + 1);
      }
    };

    utterance.onerror = (e) => {
      console.warn('Speech chunk handled:', e);
      if (!isCancelledRef.current) {
        chunkIndexRef.current = index + 1;
        speakChunkAtIndex(index + 1);
      }
    };

    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  };

  const handleToggleSpeech = () => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      return;
    }

    if (isSpeaking) {
      if (isPaused) {
        window.speechSynthesis.resume();
        setIsPaused(false);
        marioAudio.playJump();
      } else {
        window.speechSynthesis.pause();
        setIsPaused(true);
        marioAudio.playPipe();
      }
      return;
    }

    stopAllSpeech();
    isCancelledRef.current = false;

    const summaryText =
      complexityMode === 'beginner'
        ? topic.beginnerSummary || topic.summary
        : topic.summary;

    const doctrinesText = topic.keyDoctrines?.length
      ? `Core Doctrines: ${topic.keyDoctrines.map((d) => cleanRuleText(d)).join('. ')}`
      : '';

    const rulesText = (topic.rules || [])
      .map((r) => {
        const items = r.items ? r.items.map((i) => cleanRuleText(i)).join('. ') : '';
        const subs = r.subSections
          ? r.subSections
              .map((s) => `${s.title}: ${s.items.map((si) => cleanRuleText(si)).join('. ')}`)
              .join('. ')
          : '';
        return `${r.heading}. ${r.description || ''}. ${items}. ${subs}`;
      })
      .join('. ');

    const fullText = `${topic.title}. Statutory reference: ${topic.badge}. Summary: ${summaryText}. ${doctrinesText}. Detailed Provisions: ${rulesText}.`;

    // Split into speech chunks (~160 chars) so Blink/WebKit audio never stalls
    const sentences = fullText.match(/[^.?!;:]+[.?!;:]+/g) || [fullText];
    const chunks: string[] = [];
    let current = '';

    for (const s of sentences) {
      const clean = s.trim();
      if (!clean) continue;
      if ((current + ' ' + clean).trim().length <= 160) {
        current = (current + ' ' + clean).trim();
      } else {
        if (current) chunks.push(current);
        if (clean.length > 160) {
          const words = clean.split(/\s+/);
          let sub = '';
          for (const w of words) {
            if ((sub + ' ' + w).trim().length <= 160) {
              sub = (sub + ' ' + w).trim();
            } else {
              if (sub) chunks.push(sub);
              sub = w;
            }
          }
          if (sub) current = sub;
          else current = '';
        } else {
          current = clean;
        }
      }
    }
    if (current) chunks.push(current);

    activeChunksRef.current = chunks;
    chunkIndexRef.current = 0;

    marioAudio.playPowerUp();
    setIsSpeaking(true);
    setIsPaused(false);
    speakChunkAtIndex(0);
  };

  const handleStopSpeech = () => {
    stopAllSpeech();
    marioAudio.playPipe();
  };

  const handleSpeedSelect = (speed: number) => {
    setPlaybackSpeed(speed);
    setShowSpeedControls(false);
    marioAudio.playJump();
    if (isSpeaking && utteranceRef.current) {
      handleStopSpeech();
    }
  };

  const highlightMatch = (text: string) => {
    if (!searchQuery.trim() || !text) return text;
    const escaped = searchQuery.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const parts = text.split(new RegExp(`(${escaped})`, 'gi'));
    return (
      <>
        {parts.map((part, i) =>
          part.toLowerCase() === searchQuery.toLowerCase() ? (
            <mark key={i} className="bg-amber-300 text-red-950 font-black px-1 rounded-sm">
              {part}
            </mark>
          ) : (
            part
          )
        )}
      </>
    );
  };

  const renderSubClauses = (subClauses?: SubClauseItem[]) => {
    if (!subClauses || subClauses.length === 0) return null;
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2">
        {subClauses.map((sc, idx) => (
          <div
            key={idx}
            className="flex items-start gap-2 p-2.5 rounded-xl bg-white border border-slate-200 text-xs sm:text-sm font-semibold text-slate-800 shadow-2xs"
          >
            <span className="inline-flex items-center justify-center min-w-5 h-5 px-1 rounded-md bg-slate-900 text-amber-300 text-[10px] font-black font-mono shrink-0 mt-0.5">
              ({sc.marker})
            </span>
            <span className="leading-snug">{highlightMatch(sc.text)}</span>
          </div>
        ))}
      </div>
    );
  };

  const renderFormattedItem = (item: FormattedModuleItem, idx: number) => {
    // 1. Section / Group Header (Unnumbered!)
    if (item.kind === 'group_header') {
      return (
        <div
          key={idx}
          className="pt-2 pb-1 border-b-2 border-amber-400/70 flex items-center gap-2"
        >
          <span className="w-2.5 h-2.5 rounded-xs bg-amber-500 border border-black shrink-0" />
          <span className="text-xs sm:text-sm font-black uppercase tracking-wide text-slate-900 font-display">
            {highlightMatch(item.body)}
          </span>
        </div>
      );
    }

    // 2. Definition Card (NEVER numbered!)
    if (item.kind === 'definition') {
      return (
        <div
          key={idx}
          className="p-3.5 rounded-xl bg-indigo-50/90 dark:bg-indigo-950/60 border-2 border-indigo-300 dark:border-indigo-700 space-y-1.5"
        >
          <div className="flex items-center gap-2 flex-wrap">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-indigo-700 text-white text-[10px] font-black uppercase tracking-wider font-mario leading-none">
              <BookOpen className="w-3 h-3 shrink-0" />
              <span>{item.badgeLabel || 'DEFINITION'}</span>
            </span>
            {item.title && (
              <span className="font-black text-indigo-950 dark:text-indigo-200 text-sm sm:text-base font-display">
                {highlightMatch(item.title)}
              </span>
            )}
          </div>
          {item.body && (
            <p className={`${bodyTextClass} text-slate-900 dark:text-slate-100 font-semibold`}>
              {highlightMatch(item.body)}
            </p>
          )}
          {renderSubClauses(item.subClauses)}
        </div>
      );
    }

    // 3. Semantic Callout / Provision Row (NEVER numbered!)
    if (item.kind === 'callout') {
      const toneStyles =
        item.tone === 'exception'
          ? {
              wrap: 'bg-rose-50/80 dark:bg-rose-950/50 border-rose-300 dark:border-rose-700',
              badge: 'bg-rose-700 text-white',
              title: 'text-rose-950 dark:text-rose-200',
              icon: <AlertTriangle className="w-3 h-3 shrink-0" />,
            }
          : item.tone === 'formula'
          ? {
              wrap: 'bg-emerald-50/80 dark:bg-emerald-950/50 border-emerald-300 dark:border-emerald-700',
              badge: 'bg-emerald-700 text-white',
              title: 'text-emerald-950 dark:text-emerald-200',
              icon: <Calculator className="w-3 h-3 shrink-0" />,
            }
          : item.tone === 'rule' || item.tone === 'doctrine'
          ? {
              wrap: 'bg-amber-50/80 dark:bg-amber-950/45 border-amber-300 dark:border-amber-700',
              badge: 'bg-slate-900 text-amber-300',
              title: 'text-slate-950 dark:text-amber-200',
              icon: <Scale className="w-3 h-3 shrink-0" />,
            }
          : {
              wrap: 'bg-slate-50 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700',
              badge: 'bg-slate-700 text-white',
              title: 'text-slate-950 dark:text-slate-100',
              icon: null,
            };

      return (
        <div
          key={idx}
          className={`p-3 rounded-xl border-2 space-y-1.5 ${toneStyles.wrap}`}
        >
          <div className="flex items-center gap-2 flex-wrap">
            {item.tone !== 'concept' && (
              <span
                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-wider font-mario leading-none ${toneStyles.badge}`}
              >
                {toneStyles.icon}
                <span>{item.badgeLabel}</span>
              </span>
            )}
            {item.title && (
              <span className={`font-black text-sm sm:text-base font-display ${toneStyles.title}`}>
                {highlightMatch(item.title)}
              </span>
            )}
          </div>
          {item.body && (
            <p className={`${bodyTextClass} text-slate-800 dark:text-slate-100 font-semibold`}>
              {highlightMatch(item.body)}
            </p>
          )}
          {renderSubClauses(item.subClauses)}
        </div>
      );
    }

    // 4. Genuinely Numbered List Item (`1.`, `2.`, etc.)
    if (item.kind === 'numbered') {
      return (
        <div
          key={idx}
          className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-2 shadow-2xs"
        >
          <div className="flex items-start gap-2.5">
            <span className="inline-flex items-center justify-center min-w-6 h-6 px-1.5 rounded-lg bg-amber-400 text-slate-950 border border-black text-xs font-black font-mario shrink-0 mt-0.5 shadow-[0_1px_0_#000]">
              {String(item.number ?? 1).padStart(2, '0')}
            </span>
            <div className={`${bodyTextClass} text-slate-900 font-semibold flex-1`}>
              {item.title && (
                <span className="font-black text-slate-950 mr-1.5">
                  {highlightMatch(item.title)}:
                </span>
              )}
              <span>{highlightMatch(item.body)}</span>
            </div>
          </div>
          {item.subClauses && <div className="pl-8">{renderSubClauses(item.subClauses)}</div>}
        </div>
      );
    }

    // 5. Unnumbered Bullet / Principle Item
    return (
      <div
        key={idx}
        className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5 shadow-2xs"
      >
        <div className="flex items-start gap-2.5">
          <span className="w-2.5 h-2.5 rounded-full bg-red-600 border border-black shrink-0 mt-2" />
          <div className={`${bodyTextClass} text-slate-900 font-semibold flex-1`}>
            {item.title && (
              <span className="font-black text-slate-950 mr-1.5">
                {highlightMatch(item.title)}:
              </span>
            )}
            <span>{highlightMatch(item.body)}</span>
          </div>
        </div>
        {item.subClauses && <div className="pl-5">{renderSubClauses(item.subClauses)}</div>}
      </div>
    );
  };

  const hasCustomDiagramOrTable = [
    'm1-coverage',
    'm1-hours-worked',
    'm1-fwa-cww-meals-ot',
    'm2-holiday-pay',
    'm2-13th-month',
    'm3-wage-principles',
    'm3-payment-contracting-distortion',
    'm4-minors-kasambahay-homework',
    'm5-harassment-safe-spaces',
  ].includes(topic.id);

  const showDiagrams = viewTab === 'all' || viewTab === 'tables';
  const showRuleCards = viewTab === 'all' || viewTab === 'cards';

  return (
    <article
      id={`topic-card-${topic.id}`}
      className={`mario-card rounded-3xl transition-all duration-300 overflow-hidden ${
        isCompleted
          ? 'border-emerald-600 bg-white ring-2 ring-emerald-400'
          : 'border-slate-900 bg-white'
      }`}
    >
      {/* Perfectly Aligned Header Banner */}
      <header className="bg-slate-900 text-white p-4 sm:p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b-4 border-slate-950">
        <div className="flex items-center gap-3.5 min-w-0">
          <div className="w-11 h-11 rounded-2xl bg-amber-400 border-2 border-black flex items-center justify-center flex-shrink-0 shadow-[0_2px_0_#000]">
            <MarioQuestionBlockIcon className="w-6 h-6 text-slate-950" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              {showLegalCitations ? (
                <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-amber-400 text-slate-950 text-[11px] font-black uppercase font-mario tracking-wider border border-black shadow-[0_1px_0_#000] leading-none">
                  {topic.badge}
                </span>
              ) : (
                <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-slate-700 text-amber-200 text-[11px] font-black uppercase font-mario tracking-wider border border-slate-600 leading-none">
                  STATUTORY STANDARD
                </span>
              )}
              <span className="text-[11px] font-bold text-slate-400 uppercase font-mono">
                {complexityMode === 'beginner' ? 'Mushroom Kingdom Mode' : 'Bowser Castle Codified'}
              </span>
            </div>
            <h3 className="text-lg sm:text-xl md:text-2xl font-black text-white font-display mt-1 leading-tight">
              {highlightMatch(topic.title)}
            </h3>
          </div>
        </div>

        {/* Uniform h-9 Action Buttons Toolbar */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="relative h-9 inline-flex items-center bg-slate-800 rounded-xl border-2 border-slate-700 px-1">
            <button
              onClick={handleToggleSpeech}
              title={isSpeaking ? (isPaused ? 'Resume reading' : 'Pause reading') : 'Read aloud'}
              className={`h-7 inline-flex items-center justify-center gap-1.5 px-2.5 rounded-lg text-xs font-black font-mario cursor-pointer transition-colors leading-none ${
                isSpeaking
                  ? 'bg-amber-400 text-slate-950'
                  : 'text-slate-200 hover:text-white hover:bg-slate-700'
              }`}
            >
              {isSpeaking ? (
                isPaused ? (
                  <Play className="w-3.5 h-3.5 fill-current shrink-0" />
                ) : (
                  <Pause className="w-3.5 h-3.5 fill-current shrink-0" />
                )
              ) : (
                <Volume2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              )}
              <span>AUDIO</span>
            </button>

            {isSpeaking && (
              <button
                onClick={handleStopSpeech}
                title="Stop reading"
                className="h-7 w-7 inline-flex items-center justify-center text-red-400 hover:text-red-300 hover:bg-slate-700 rounded cursor-pointer"
              >
                <Square className="w-3 h-3 fill-current" />
              </button>
            )}

            <button
              onClick={() => setShowSpeedControls(!showSpeedControls)}
              title="Adjust playback speed"
              className="h-7 inline-flex items-center justify-center px-2 text-[11px] font-mono font-bold text-amber-300 hover:bg-slate-700 rounded cursor-pointer border-l border-slate-700"
            >
              {playbackSpeed}x
            </button>

            {showSpeedControls && (
              <div className="absolute right-0 top-full mt-1 z-30 bg-slate-900 border-2 border-slate-700 rounded-xl p-1 shadow-xl flex gap-1">
                {[0.75, 1.0, 1.25, 1.5, 2.0].map((spd) => (
                  <button
                    key={spd}
                    onClick={() => handleSpeedSelect(spd)}
                    className={`px-2 py-1 rounded text-xs font-mono font-bold cursor-pointer ${
                      playbackSpeed === spd
                        ? 'bg-amber-400 text-slate-950 font-black'
                        : 'text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    {spd}x
                  </button>
                ))}
              </div>
            )}
          </div>

          {onToggleComplete && (
            <button
              onClick={onToggleComplete}
              title="Mark topic as studied / mastered"
              className={`h-9 inline-flex items-center justify-center gap-1.5 px-3 rounded-xl font-black text-xs border-2 cursor-pointer transition-all whitespace-nowrap leading-none ${
                isCompleted
                  ? 'bg-emerald-500 text-slate-950 border-black shadow-[0_2px_0_#000]'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
              <span>{isCompleted ? 'Mastered' : 'Mark Studied'}</span>
            </button>
          )}

          <button
            onClick={handleCopy}
            title="Copy law provisions"
            className="h-9 inline-flex items-center justify-center gap-1.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border-2 border-slate-700 text-xs font-bold cursor-pointer whitespace-nowrap leading-none"
          >
            {copied ? (
              <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            ) : (
              <Copy className="w-3.5 h-3.5 shrink-0" />
            )}
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </button>

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            title={isExpanded ? 'Collapse topic' : 'Expand topic'}
            className="h-9 inline-flex items-center justify-center gap-1.5 px-3.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs border-2 border-black shadow-[0_2px_0_#000] cursor-pointer whitespace-nowrap leading-none"
          >
            <span>{isExpanded ? 'Collapse' : 'Expand'}</span>
            {isExpanded ? (
              <ChevronUp className="w-4 h-4 stroke-[3] shrink-0" />
            ) : (
              <ChevronDown className="w-4 h-4 stroke-[3] shrink-0" />
            )}
          </button>
        </div>
      </header>

      {/* Card Body */}
      {isExpanded && (
        <div className="p-4 sm:p-6 md:p-8 space-y-6 bg-[#fcfbf7] dark:bg-slate-900/95">
          {/* Summary Callout */}
          {complexityMode === 'beginner' ? (
            <div className="bg-emerald-50 dark:bg-emerald-950/60 border-3 border-emerald-500 dark:border-emerald-600 rounded-2xl p-4 sm:p-5 shadow-sm space-y-2">
              <div className="flex items-center gap-2">
                <MarioMushroomIcon className="w-5 h-5 flex-shrink-0" />
                <span className="text-xs font-black uppercase tracking-wider text-emerald-900 dark:text-emerald-300 font-mario">
                  MUSHROOM KINGDOM • PRACTICAL SUMMARY
                </span>
              </div>
              <p className={`${bodyTextClass} text-emerald-950 dark:text-emerald-50 font-bold`}>
                {highlightMatch(topic.beginnerSummary || topic.summary)}
              </p>
              <div className="pt-1 flex items-center gap-2 text-xs font-bold text-emerald-800 dark:text-emerald-300">
                <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                <span>Definitions, rules, exceptions, and statutory enumerations are cleanly separated below.</span>
              </div>
            </div>
          ) : (
            <div className="bg-amber-50/90 dark:bg-amber-950/50 border-3 border-amber-400/90 dark:border-amber-600 rounded-2xl p-4 sm:p-5 shadow-sm flex items-start gap-3">
              <MarioStarIcon className="w-6 h-6 flex-shrink-0 mt-0.5" />
              <div className="space-y-1">
                <span className="text-[11px] font-black uppercase text-amber-800 dark:text-amber-300 font-mario block">
                  BOWSER CASTLE • CODIFIED STATUTORY SUMMARY
                </span>
                <p className={`${bodyTextClass} text-slate-900 dark:text-slate-100 font-bold`}>
                  {highlightMatch(topic.summary)}
                </p>
              </div>
            </div>
          )}

          {/* Core Labor Doctrines Highlight Strip */}
          {topic.keyDoctrines && topic.keyDoctrines.length > 0 && (
            <section className="bg-slate-100 border-3 border-slate-900 rounded-2xl p-4 sm:p-6 shadow-sm space-y-3">
              <div className="flex items-center gap-2 text-slate-950 font-black text-base sm:text-lg">
                <Mario1UpIcon className="w-5 h-5 flex-shrink-0" />
                <h4 className="font-display">CORE LABOR DOCTRINES &amp; STATUTORY PRECEPTS</h4>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                {topic.keyDoctrines.map((doc, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-3 bg-white p-3.5 rounded-xl border border-slate-300 shadow-2xs h-full"
                  >
                    <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-emerald-600 text-white text-xs font-black mt-0.5 flex-shrink-0">
                      <Check className="w-3 h-3 stroke-[3]" />
                    </span>
                    <span className={`${bodyTextClass} text-slate-900 font-bold`}>
                      {highlightMatch(cleanRuleText(doc))}
                    </span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* View Mode Filter Bar when Diagrams/Tables exist */}
          {hasCustomDiagramOrTable && (
            <div className="flex flex-wrap items-center justify-between gap-2 bg-slate-900 text-white px-4 py-2.5 rounded-2xl border-2 border-black">
              <span className="text-xs font-black uppercase text-amber-300 font-mario">
                MODULE LAYOUT FILTER:
              </span>
              <div className="flex items-center gap-1.5 flex-wrap">
                <button
                  onClick={() => setViewTab('all')}
                  className={`h-8 inline-flex items-center justify-center gap-1.5 px-3 rounded-xl text-xs font-black cursor-pointer transition-colors ${
                    viewTab === 'all' ? 'bg-amber-400 text-slate-950' : 'bg-slate-800 text-slate-300 hover:text-white'
                  }`}
                >
                  <Layers className="w-3.5 h-3.5 shrink-0" />
                  <span>Complete View</span>
                </button>
                <button
                  onClick={() => setViewTab('cards')}
                  className={`h-8 inline-flex items-center justify-center gap-1.5 px-3 rounded-xl text-xs font-black cursor-pointer transition-colors ${
                    viewTab === 'cards' ? 'bg-amber-400 text-slate-950' : 'bg-slate-800 text-slate-300 hover:text-white'
                  }`}
                >
                  <LayoutGrid className="w-3.5 h-3.5 shrink-0" />
                  <span>Provisions Only</span>
                </button>
                <button
                  onClick={() => setViewTab('tables')}
                  className={`h-8 inline-flex items-center justify-center gap-1.5 px-3 rounded-xl text-xs font-black cursor-pointer transition-colors ${
                    viewTab === 'tables' ? 'bg-amber-400 text-slate-950' : 'bg-slate-800 text-slate-300 hover:text-white'
                  }`}
                >
                  <TableIcon className="w-3.5 h-3.5 shrink-0" />
                  <span>Diagrams &amp; Matrices</span>
                </button>
              </div>
            </div>
          )}

          {/* Topic-Specific Visual Diagrams & Comparative Matrices (Fixed IDs!) */}
          {showDiagrams && (
            <>
              {(topic.id === 'm1-coverage' || topic.id === 'm1-hours-worked') && (
                <div className="bg-amber-50 border-3 border-amber-500 rounded-2xl p-4 sm:p-6 space-y-3 shadow-sm">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div className="flex items-center gap-2 text-amber-950 font-black text-sm sm:text-base font-display">
                      <MarioStarIcon className="w-5 h-5 shrink-0" />
                      <span>DIAGRAM: THE FOUR-FOLD TEST OF EMPLOYER-EMPLOYEE RELATIONSHIP</span>
                    </div>
                    <span className="text-[10px] font-black uppercase px-2.5 py-1 bg-amber-400 text-slate-950 rounded-md border border-black font-mario leading-none">
                      Supreme Court Doctrine
                    </span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-2.5 pt-1">
                    {[
                      { num: '01', title: 'Selection & Hiring', desc: 'Power to hire and select the specific individual' },
                      { num: '02', title: 'Payment of Wages', desc: 'Compensation paid directly as wages for labor' },
                      { num: '03', title: 'Power of Dismissal', desc: 'Authority to discipline, suspend, or terminate' },
                      {
                        num: '04',
                        title: 'Power of Control',
                        desc: 'Control over NOT ONLY the result, but MEANS and METHODS (Decisive!)',
                        highlight: true,
                      },
                    ].map((step) => (
                      <div
                        key={step.num}
                        className={`p-3.5 rounded-xl border-2 flex flex-col justify-between h-full ${
                          step.highlight
                            ? 'bg-amber-400 border-black text-slate-950 shadow-[0_2px_0_#000]'
                            : 'bg-white border-amber-300 text-slate-900'
                        }`}
                      >
                        <div>
                          <span className="text-xs font-black font-mario block mb-1">ELEMENT {step.num}</span>
                          <h6 className="font-black text-sm font-display">{step.title}</h6>
                        </div>
                        <p className="text-xs font-semibold mt-1.5 leading-snug">{step.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {topic.id === 'm1-fwa-cww-meals-ot' && (
                <div className="bg-indigo-50 border-3 border-indigo-500 rounded-2xl p-4 sm:p-6 space-y-3 shadow-sm">
                  <div className="flex items-center gap-2 text-indigo-950 font-black text-sm sm:text-base font-display">
                    <Clock className="w-5 h-5 text-indigo-600 shrink-0" />
                    <span>TIMELINE DIAGRAM: STATUTORY NIGHT SHIFT WINDOW (ART. 86)</span>
                  </div>
                  <div className="p-3 sm:p-4 bg-slate-900 rounded-xl text-white space-y-2.5">
                    <div className="flex items-center justify-between gap-1 text-[10px] sm:text-xs font-mono font-bold text-slate-300">
                      <span>6PM</span>
                      <span className="text-amber-400 font-mario text-[8px] sm:text-[10px]">
                        <span className="sm:hidden">10PM</span>
                        <span className="hidden sm:inline">10:00 PM (START)</span>
                      </span>
                      <span className="text-amber-400 font-mario text-[8px] sm:text-[10px]">
                        <span className="sm:hidden">6AM</span>
                        <span className="hidden sm:inline">6:00 AM (END)</span>
                      </span>
                      <span>12NN</span>
                    </div>
                    <div className="relative h-7 bg-slate-800 rounded-lg overflow-hidden flex">
                      <div className="w-1/4 bg-slate-700/60 flex items-center justify-center text-[10px] sm:text-[11px] font-bold text-slate-300">
                        Day
                      </div>
                      <div className="w-2/4 bg-indigo-600 flex items-center justify-center text-[9px] sm:text-xs font-black text-amber-300 font-mario tracking-wider border-x-2 border-amber-400 text-center px-1">
                        <span className="sm:hidden">+10% NSD</span>
                        <span className="hidden sm:inline">+10% NIGHT DIFFERENTIAL</span>
                      </div>
                      <div className="w-1/4 bg-slate-700/60 flex items-center justify-center text-[10px] sm:text-[11px] font-bold text-slate-300">
                        Day
                      </div>
                    </div>
                    <p className="text-xs font-semibold text-slate-300 text-center">
                      Regular hourly rate × 110% for every hour worked between 10:00 PM and 6:00 AM (exempt: retail/service &le; 5 workers).
                    </p>
                  </div>
                </div>
              )}

              {topic.id === 'm2-holiday-pay' && (
                <div className="bg-slate-900 text-white rounded-2xl p-4 sm:p-6 space-y-3 border-4 border-slate-950">
                  <div className="flex items-center gap-2 font-black text-sm sm:text-base font-display text-amber-400">
                    <TableIcon className="w-5 h-5 shrink-0" />
                    <span>QUICK MATRIX: HOLIDAY PAY STATUTORY MULTIPLIERS (ART. 93–94)</span>
                  </div>
                  <div className="overflow-x-auto w-full">
                    <table className="w-full text-left text-xs border-collapse min-w-[620px]">
                      <thead>
                        <tr className="border-b-2 border-slate-700 text-amber-300 font-mario text-[10px]">
                          <th className="p-2.5 whitespace-nowrap min-w-[180px]">Holiday Category</th>
                          <th className="p-2.5 whitespace-nowrap min-w-[90px]">Unworked</th>
                          <th className="p-2.5 whitespace-nowrap min-w-[130px]">Worked (First 8h)</th>
                          <th className="p-2.5 whitespace-nowrap min-w-[140px]">Worked on Rest Day</th>
                          <th className="p-2.5 whitespace-nowrap min-w-[160px]">OT Multiplier</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800 text-slate-200 font-semibold">
                        <tr>
                          <td className="p-2.5 font-black text-white whitespace-nowrap">Regular Holiday (12 Days)</td>
                          <td className="p-2.5 text-emerald-300 font-bold whitespace-nowrap">100%</td>
                          <td className="p-2.5 text-amber-300 font-bold whitespace-nowrap">200%</td>
                          <td className="p-2.5 text-amber-300 font-bold whitespace-nowrap">260%</td>
                          <td className="p-2.5 whitespace-nowrap">+30% of day&apos;s hourly rate</td>
                        </tr>
                        <tr>
                          <td className="p-2.5 font-black text-white whitespace-nowrap">Special Non-Working Day</td>
                          <td className="p-2.5 text-slate-400 whitespace-nowrap">0% (No work, no pay)</td>
                          <td className="p-2.5 text-cyan-300 font-bold whitespace-nowrap">130%</td>
                          <td className="p-2.5 text-cyan-300 font-bold whitespace-nowrap">150%</td>
                          <td className="p-2.5 whitespace-nowrap">+30% of day&apos;s hourly rate</td>
                        </tr>
                        <tr>
                          <td className="p-2.5 font-black text-white whitespace-nowrap">Double Regular Holiday</td>
                          <td className="p-2.5 text-emerald-300 font-bold whitespace-nowrap">200%</td>
                          <td className="p-2.5 text-rose-300 font-bold whitespace-nowrap">300%</td>
                          <td className="p-2.5 text-rose-300 font-bold whitespace-nowrap">390%</td>
                          <td className="p-2.5 whitespace-nowrap">+30% of day&apos;s hourly rate</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {topic.id === 'm2-13th-month' && (
                <div className="bg-amber-50 border-3 border-amber-500 rounded-2xl p-4 sm:p-6 space-y-4 shadow-sm">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div className="flex items-center gap-2 text-amber-950 font-black text-sm sm:text-base font-display">
                      <Coins className="w-5 h-5 text-amber-600 shrink-0" />
                      <span>VISUAL FORMULA: STATUTORY 13TH-MONTH PAY (P.D. 851)</span>
                    </div>
                    <span className="text-xs font-mono font-black bg-red-600 text-white px-2.5 py-1 rounded-md border border-black leading-none">
                      ON OR BEFORE DEC 24
                    </span>
                  </div>
                  <div className="bg-white p-4 rounded-xl border-2 border-slate-900 shadow-[0_2px_0_#000] text-center space-y-1">
                    <span className="text-xs font-mono font-bold text-slate-500 uppercase">
                      Statutory Computation Formula
                    </span>
                    <div className="text-base sm:text-xl font-black text-slate-950 font-display">
                      13th Month Pay = Total Basic Salary Earned During the Calendar Year &divide; 12
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div className="p-3.5 rounded-xl bg-emerald-50 border-2 border-emerald-400 space-y-1.5">
                      <span className="font-black text-emerald-900 font-mario text-[10px] block">
                        INCLUDED IN BASIC SALARY:
                      </span>
                      <ul className="list-disc pl-4 space-y-1 text-emerald-950 font-semibold">
                        <li>Basic daily/monthly wage actually earned</li>
                        <li>COLA only when formally integrated into basic wage</li>
                        <li>Paid sick and vacation leaves actually taken</li>
                      </ul>
                    </div>
                    <div className="p-3.5 rounded-xl bg-red-50 border-2 border-red-400 space-y-1.5">
                      <span className="font-black text-red-900 font-mario text-[10px] block">
                        STRICTLY EXCLUDED:
                      </span>
                      <ul className="list-disc pl-4 space-y-1 text-red-950 font-semibold">
                        <li>Overtime pay &amp; Night shift differentials</li>
                        <li>Premium pay for rest days and holidays</li>
                        <li>Unused SIL/VL/SL cash conversion equivalents</li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {topic.id === 'm3-wage-principles' && (
                <div className="bg-slate-900 text-white rounded-2xl p-4 sm:p-6 space-y-3 border-4 border-slate-950">
                  <div className="flex items-center gap-2 font-black text-sm sm:text-base font-display text-amber-400">
                    <TableIcon className="w-5 h-5 shrink-0" />
                    <span>COMPARISON MATRIX: FACILITIES VS. SUPPLEMENTS &amp; RETAIL HEADCOUNT THRESHOLDS</span>
                  </div>
                  <div className="overflow-x-auto w-full">
                    <table className="w-full text-left text-xs border-collapse min-w-[620px]">
                      <thead>
                        <tr className="border-b-2 border-slate-700 text-amber-300 font-mario text-[10px]">
                          <th className="p-2.5 whitespace-nowrap min-w-[150px]">Criterion</th>
                          <th className="p-2.5 text-emerald-400 whitespace-nowrap min-w-[230px]">Facilities (Deductible)</th>
                          <th className="p-2.5 text-cyan-400 whitespace-nowrap min-w-[240px]">Supplements (Non-Deductible)</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800 text-slate-200 font-semibold">
                        <tr>
                          <td className="p-2.5 font-bold text-white whitespace-nowrap">Purpose / Benefit</td>
                          <td className="p-2.5 whitespace-normal break-normal">Necessary for worker &amp; family subsistence (meals, housing)</td>
                          <td className="p-2.5 whitespace-normal break-normal">Extra privilege or for employer&apos;s business convenience/tools</td>
                        </tr>
                        <tr>
                          <td className="p-2.5 font-bold text-white whitespace-nowrap">Part of Basic Wage?</td>
                          <td className="p-2.5 text-emerald-300 font-bold whitespace-normal break-normal">YES — fair value forms part of wage</td>
                          <td className="p-2.5 text-rose-300 font-bold whitespace-normal break-normal">NO — independent of basic wage</td>
                        </tr>
                        <tr>
                          <td className="p-2.5 font-bold text-white whitespace-nowrap">Deductibility Rule</td>
                          <td className="p-2.5 whitespace-normal break-normal">Deductible ONLY if customary + written consent + fair value</td>
                          <td className="p-2.5 whitespace-normal break-normal">NEVER deductible from employee wages</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {topic.id === 'm3-payment-contracting-distortion' && (
                <div className="bg-slate-900 text-white rounded-2xl p-4 sm:p-6 space-y-3 border-4 border-slate-950 shadow-sm">
                  <div className="flex items-center gap-2 font-black text-sm sm:text-base font-display text-amber-400">
                    <TableIcon className="w-5 h-5 shrink-0" />
                    <span>COMPARISON MATRIX: LEGITIMATE JOB CONTRACTING VS PROHIBITED LABOR-ONLY (D.O. 174)</span>
                  </div>
                  <div className="overflow-x-auto w-full">
                    <table className="w-full text-left text-xs border-collapse min-w-[640px]">
                      <thead>
                        <tr className="border-b-2 border-slate-700 text-slate-300 font-mario text-[10px]">
                          <th className="p-2.5 whitespace-nowrap min-w-[150px]">Criteria</th>
                          <th className="p-2.5 text-emerald-400 whitespace-nowrap min-w-[240px]">Legitimate Contractor (Allowed)</th>
                          <th className="p-2.5 text-red-400 whitespace-nowrap min-w-[250px]">Labor-Only Contractor (Prohibited)</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800 text-slate-200 font-semibold">
                        <tr>
                          <td className="p-2.5 font-bold text-white whitespace-nowrap">Substantial Capital</td>
                          <td className="p-2.5 text-emerald-300 whitespace-normal break-normal font-bold">At least ₱5,000,000 paid-up capital / net worth</td>
                          <td className="p-2.5 text-red-300 whitespace-normal break-normal">Lacks substantial capital or tools/premises</td>
                        </tr>
                        <tr>
                          <td className="p-2.5 font-bold text-white whitespace-nowrap">Right of Control</td>
                          <td className="p-2.5 text-emerald-300 whitespace-normal break-normal font-bold">Contractor controls means and methods</td>
                          <td className="p-2.5 text-red-300 whitespace-normal break-normal">Principal controls worker performance</td>
                        </tr>
                        <tr>
                          <td className="p-2.5 font-bold text-white whitespace-nowrap">Legal Consequence</td>
                          <td className="p-2.5 text-emerald-300 whitespace-normal break-normal">Solidarily liable ONLY for unpaid wages</td>
                          <td className="p-2.5 text-red-300 whitespace-normal break-normal font-bold">Principal is DIRECT EMPLOYER for all purposes</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {topic.id === 'm4-minors-kasambahay-homework' && (
                <div className="bg-slate-900 text-white rounded-2xl p-4 sm:p-6 space-y-3 border-4 border-slate-950">
                  <div className="flex items-center gap-2 font-black text-sm sm:text-base font-display text-amber-400">
                    <TableIcon className="w-5 h-5 shrink-0" />
                    <span>MATRIX: WORKING HOURS &amp; NIGHT WORK BAN FOR MINORS (R.A. 9231)</span>
                  </div>
                  <div className="overflow-x-auto w-full">
                    <table className="w-full text-left text-xs border-collapse min-w-[600px]">
                      <thead>
                        <tr className="border-b-2 border-slate-700 text-amber-300 font-mario text-[10px]">
                          <th className="p-2.5 whitespace-nowrap min-w-[170px]">Age Bracket</th>
                          <th className="p-2.5 whitespace-nowrap min-w-[130px]">Max Daily Hours</th>
                          <th className="p-2.5 whitespace-nowrap min-w-[140px]">Max Weekly Hours</th>
                          <th className="p-2.5 whitespace-nowrap min-w-[180px]">Prohibited Night Window</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800 text-slate-200 font-semibold">
                        <tr>
                          <td className="p-2.5 font-bold text-white whitespace-nowrap">Below 15 Years Old</td>
                          <td className="p-2.5 text-amber-300 font-bold whitespace-nowrap">4 hours / day</td>
                          <td className="p-2.5 text-amber-300 font-bold whitespace-nowrap">20 hours / week</td>
                          <td className="p-2.5 text-rose-300 font-bold whitespace-nowrap">8:00 PM to 6:00 AM (10 hrs)</td>
                        </tr>
                        <tr>
                          <td className="p-2.5 font-bold text-white whitespace-nowrap">15 to Under 18 Years Old</td>
                          <td className="p-2.5 text-emerald-300 font-bold whitespace-nowrap">8 hours / day</td>
                          <td className="p-2.5 text-emerald-300 font-bold whitespace-nowrap">40 hours / week</td>
                          <td className="p-2.5 text-rose-300 font-bold whitespace-nowrap">10:00 PM to 6:00 AM (8 hrs)</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {topic.id === 'm5-harassment-safe-spaces' && (
                <div className="bg-slate-900 text-white rounded-2xl p-4 sm:p-6 space-y-3 border-4 border-slate-950">
                  <div className="flex items-center gap-2 font-black text-sm sm:text-base font-display text-amber-400">
                    <TableIcon className="w-5 h-5 shrink-0" />
                    <span>DISTINCTION MATRIX: R.A. 7877 VS. SAFE SPACES ACT (R.A. 11313)</span>
                  </div>
                  <div className="overflow-x-auto w-full">
                    <table className="w-full text-left text-xs border-collapse min-w-[620px]">
                      <thead>
                        <tr className="border-b-2 border-slate-700 text-amber-300 font-mario text-[10px]">
                          <th className="p-2.5 whitespace-nowrap min-w-[170px]">Element</th>
                          <th className="p-2.5 text-cyan-300 whitespace-nowrap min-w-[220px]">R.A. 7877 (1995 Law)</th>
                          <th className="p-2.5 text-emerald-300 whitespace-nowrap min-w-[230px]">R.A. 11313 (Safe Spaces Act)</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800 text-slate-200 font-semibold">
                        <tr>
                          <td className="p-2.5 font-bold text-white whitespace-nowrap">Authority / Ascendancy</td>
                          <td className="p-2.5 whitespace-normal break-normal">REQUIRED (superior over subordinate/student)</td>
                          <td className="p-2.5 whitespace-normal break-normal font-bold text-emerald-300">NOT REQUIRED (covers peers &amp; subordinate-to-superior)</td>
                        </tr>
                        <tr>
                          <td className="p-2.5 font-bold text-white whitespace-nowrap">Covered Venues</td>
                          <td className="p-2.5 whitespace-normal break-normal">Work, Education &amp; Training only</td>
                          <td className="p-2.5 whitespace-normal break-normal">Streets, Public Spaces, PUVs, Online, Workplaces &amp; Schools</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </>
          )}

          {/* Statutory Rules & Implementing Provisions Grid */}
          {showRuleCards && (
            <section className="space-y-4">
              <div className="flex items-center gap-2">
                <MarioFireFlowerIcon className="w-5 h-5 flex-shrink-0" />
                <h4 className="text-base sm:text-lg font-black text-slate-950 font-display uppercase tracking-wide">
                  STATUTORY RULES, DEFINITIONS &amp; IMPLEMENTING PROVISIONS
                </h4>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-stretch">
                {topic.rules.map((rule, rIdx) => {
                  const formattedItems = rule.items ? formatModuleRuleItems(rule.items) : [];

                  return (
                    <div
                      key={rIdx}
                      className="bg-white border-2 border-slate-300 rounded-2xl p-4 sm:p-5 shadow-sm hover:border-slate-800 transition-colors space-y-3.5 flex flex-col justify-between h-full"
                    >
                      <div className="space-y-3">
                        <div className="flex items-center gap-2.5 pb-2.5 border-b-2 border-slate-200">
                          <div className="w-3.5 h-3.5 bg-red-600 border border-black rounded-xs flex-shrink-0" />
                          <h5 className={`${headingTextClass} text-red-700 font-display tracking-tight leading-snug`}>
                            {highlightMatch(rule.heading)}
                          </h5>
                        </div>

                        {rule.description && (
                          <p className={`${bodyTextClass} text-slate-800 font-bold`}>
                            {highlightMatch(rule.description)}
                          </p>
                        )}

                        {formattedItems.length > 0 && (
                          <div className="space-y-2.5">
                            {formattedItems.map((item, iIdx) => renderFormattedItem(item, iIdx))}
                          </div>
                        )}

                        {rule.subSections && (
                          <div className="pt-1 space-y-3">
                            {rule.subSections.map((sub, sIdx) => {
                              const formattedSubItems = formatModuleRuleItems(sub.items);
                              return (
                                <div
                                  key={sIdx}
                                  className="bg-amber-50/70 border-2 border-amber-300 rounded-xl p-3.5 sm:p-4 space-y-2.5"
                                >
                                  <h6 className={`${bodyTextClass} font-black text-slate-950 flex items-center gap-2`}>
                                    <MarioCoinIcon className="w-4 h-4 flex-shrink-0" />
                                    <span>{highlightMatch(sub.title)}</span>
                                  </h6>
                                  <div className="space-y-2">
                                    {formattedSubItems.map((subItem, siIdx) =>
                                      renderFormattedItem(subItem, siIdx)
                                    )}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {/* Power-Up Box: Critical Statutory Checkpoints */}
          {(topic.barTips || topic.keyTips) && (
            <div className="mario-question-block rounded-2xl p-4 sm:p-6 text-slate-950 font-bold space-y-3 shadow-md">
              <div className="flex items-center gap-2">
                <MarioStarIcon className="w-6 h-6 flex-shrink-0" />
                <span className="font-black text-base sm:text-lg uppercase tracking-wide text-red-950 font-display">
                  POWER-UP: KEY STATUTORY CHECKPOINTS &amp; BAR DISTINCTIONS
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                {(topic.keyTips || topic.barTips || []).map((tip, tIdx) => (
                  <div
                    key={tIdx}
                    className="flex items-start gap-3 bg-white/95 p-3.5 rounded-xl border border-amber-700/40 text-slate-950 shadow-xs h-full"
                  >
                    <span className="inline-flex items-center justify-center w-6 h-6 rounded-lg bg-amber-500 border border-black text-slate-950 text-xs font-black flex-shrink-0 mt-0.5">
                      ★
                    </span>
                    <span className={`${bodyTextClass} font-bold`}>
                      {highlightMatch(cleanRuleText(tip))}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </article>
  );
};
