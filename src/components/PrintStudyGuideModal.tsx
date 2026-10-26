import React, { useState } from 'react';
import {
  Printer,
  X,
  Award,
  NotebookPen,
  Users,
  Calendar,
  MapPin,
} from 'lucide-react';
import { ALL_LAW_TOPICS, WORLDS_METADATA } from '../data/laborLawData';
import { LABOR_BENEFITS_MULTIPLIER_LIST } from '../data/multiplierTable';
import {
  REGIONAL_MINIMUM_WAGES,
  KASAMBAHAY_MINIMUM_WAGES,
} from '../data/regionalWages';
import {
  GROUP_MEMBERS,
  StudyNoteItem,
  loadStudyNotes,
} from '../utils/engagementFeatures';
import { cleanRuleText } from '../utils/moduleFormatter';
import { marioAudio } from '../utils/audio';

interface PrintStudyGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  completedTopicIds: string[];
  coins: number;
  studyNotes?: StudyNoteItem[];
}

export const PrintStudyGuideModal: React.FC<PrintStudyGuideModalProps> = ({
  isOpen,
  onClose,
  completedTopicIds,
  studyNotes,
}) => {
  const [includeGroupMembers, setIncludeGroupMembers] = useState(true);
  const [includeProgress, setIncludeProgress] = useState(true);
  const [includeMultipliers, setIncludeMultipliers] = useState(true);
  const [includeRegionalWages, setIncludeRegionalWages] = useState(true);
  const [includePersonalNotes, setIncludePersonalNotes] = useState(true);
  const [selectedWorlds, setSelectedWorlds] = useState<string[]>([
    'world1',
    'world2',
    'world3',
    'world4',
    'world5',
  ]);

  if (!isOpen) return null;

  const resolvedNotes =
    studyNotes ??
    (typeof window !== 'undefined' ? loadStudyNotes(window.localStorage) : []);

  const totalTopics = ALL_LAW_TOPICS.length;
  const completedCount = completedTopicIds.length;
  const overallPercent = Math.min(100, Math.round((completedCount / totalTopics) * 100));

  const toggleWorld = (worldId: string) => {
    setSelectedWorlds((prev) =>
      prev.includes(worldId) ? prev.filter((id) => id !== worldId) : [...prev, worldId]
    );
  };

  const handlePrint = () => {
    marioAudio.playCoin();
    window.print();
  };

  const currentDate = new Date().toLocaleDateString('en-PH', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div
      id="print-guide-modal-backdrop"
      role="dialog"
      aria-label="Print Study Guide and PDF Generator"
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-xs select-none overflow-y-auto print:static print:p-0 print:bg-white print:overflow-visible"
    >
      <div className="bg-slate-900 text-white w-full max-w-5xl rounded-3xl border-4 border-slate-950 shadow-[0_16px_40px_rgba(0,0,0,0.9)] overflow-hidden my-auto flex flex-col max-h-[92vh] print:max-h-none print:max-w-full print:rounded-none print:border-0 print:shadow-none print:bg-white print:text-black print:overflow-visible">
        {/* Modal Top Bar (Hidden during window.print) */}
        <div className="bg-[#0f172a] p-4 sm:p-5 border-b-2 border-slate-700 flex flex-wrap items-center justify-between gap-3 flex-shrink-0 print:hidden">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-400 rounded-xl border-2 border-black flex items-center justify-center text-slate-950 shadow-[0_2px_0_#000] shrink-0">
              <Printer className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-black uppercase text-amber-400 font-mario block">
                PUBLICATION-GRADE PRINT &amp; PDF EXPORT
              </span>
              <h2 className="text-lg sm:text-xl font-black text-white font-display">
                UNABRIDGED LABOR LAW PRINT STUDY GUIDE
              </h2>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs sm:text-sm rounded-xl border-2 border-black shadow-[0_2px_0_#000] active:translate-y-0.5 cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Print / Save as PDF</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close Print Study Guide"
              className="w-9 h-9 rounded-xl bg-slate-800 hover:bg-slate-700 border-2 border-slate-600 flex items-center justify-center text-slate-300 hover:text-white cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Configuration Filters (Hidden during window.print) */}
        <div className="bg-slate-800/90 p-3 sm:p-4 border-b border-slate-700 space-y-2.5 text-xs font-bold print:hidden flex-shrink-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-amber-300 font-mario text-[10px] uppercase mr-1">
              Sections:
            </span>

            <label className="inline-flex items-center gap-1.5 cursor-pointer bg-slate-900 px-2.5 py-1.5 rounded-lg border border-slate-700">
              <input
                type="checkbox"
                checked={includeGroupMembers}
                onChange={(e) => setIncludeGroupMembers(e.target.checked)}
                className="accent-amber-400"
              />
              <span>Group Members</span>
            </label>

            <label className="inline-flex items-center gap-1.5 cursor-pointer bg-slate-900 px-2.5 py-1.5 rounded-lg border border-slate-700">
              <input
                type="checkbox"
                checked={includeProgress}
                onChange={(e) => setIncludeProgress(e.target.checked)}
                className="accent-amber-400"
              />
              <span>Progress Checklist</span>
            </label>

            <label className="inline-flex items-center gap-1.5 cursor-pointer bg-slate-900 px-2.5 py-1.5 rounded-lg border border-slate-700">
              <input
                type="checkbox"
                checked={includeMultipliers}
                onChange={(e) => setIncludeMultipliers(e.target.checked)}
                className="accent-amber-400"
              />
              <span>All Statutory Multipliers</span>
            </label>

            <label className="inline-flex items-center gap-1.5 cursor-pointer bg-slate-900 px-2.5 py-1.5 rounded-lg border border-slate-700">
              <input
                type="checkbox"
                checked={includeRegionalWages}
                onChange={(e) => setIncludeRegionalWages(e.target.checked)}
                className="accent-amber-400"
              />
              <span>17 Regions Minimum Wages</span>
            </label>

            <label className="inline-flex items-center gap-1.5 cursor-pointer bg-slate-900 px-2.5 py-1.5 rounded-lg border border-slate-700">
              <input
                type="checkbox"
                checked={includePersonalNotes}
                onChange={(e) => setIncludePersonalNotes(e.target.checked)}
                className="accent-amber-400"
              />
              <span>Study Notes ({resolvedNotes.length})</span>
            </label>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="text-amber-300 font-mario text-[10px] uppercase mr-1">
              Worlds:
            </span>
            {WORLDS_METADATA.map((w) => (
              <label
                key={w.id}
                className={`inline-flex items-center gap-1.5 cursor-pointer px-2.5 py-1 rounded-lg border text-[11px] transition-colors ${
                  selectedWorlds.includes(w.id)
                    ? 'bg-amber-400 text-slate-950 border-black font-black'
                    : 'bg-slate-900 text-slate-400 border-slate-700'
                }`}
              >
                <input
                  type="checkbox"
                  checked={selectedWorlds.includes(w.id)}
                  onChange={() => toggleWorld(w.id)}
                  className="hidden"
                />
                <span>
                  World {w.worldNumber}: {w.shortTitle}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Printable Document View (Crisp, Ink-Friendly Academic Legal Reviewer Format) */}
        <div className="overflow-y-auto flex-1 p-4 sm:p-8 bg-slate-950/40 print:overflow-visible print:p-0 print:bg-white select-text">
          <div
            id="printable-study-guide"
            className="bg-white text-slate-950 p-6 sm:p-10 rounded-2xl shadow-xl max-w-4xl mx-auto space-y-7 font-sans print:p-0 print:shadow-none print:max-w-full print:rounded-none"
          >
            {/* Formal Legal Header */}
            <header className="border-b-4 border-slate-950 pb-4 text-center space-y-1.5 break-inside-avoid">
              <span className="text-[11px] font-black uppercase tracking-widest text-slate-600 font-mono block">
                PHILIPPINE LABOR CODE (PRESIDENTIAL DECREE NO. 442, AS RENUMBERED &amp; AMENDED)
              </span>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight font-serif uppercase">
                Labor Standards &amp; Protective Welfare Laws Master Reviewer
              </h1>
              <p className="text-xs font-semibold text-slate-700 max-w-2xl mx-auto">
                100% Unabridged Statutory Memory Aid covering Hours of Work, Rest Periods, Regular &amp; Special Holidays, Service Charges, 13th Month Pay, Wages &amp; D.O. 174, Special Groups of Employees &amp; Protective Statutes
              </p>
              <div className="pt-1 flex flex-wrap items-center justify-center gap-3 text-[11px] font-bold text-slate-600">
                <span className="inline-flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" /> {currentDate}
                </span>
                <span>•</span>
                <span>DOLE Bureau of Working Conditions Handbook &amp; Labor Code Codal</span>
              </div>
            </header>

            {/* Group Members / Prepared By Block */}
            {includeGroupMembers && (
              <section className="border-2 border-slate-900 rounded-xl p-4 bg-slate-50 space-y-2.5 break-inside-avoid">
                <div className="flex items-center justify-between border-b border-slate-300 pb-1.5">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-slate-900" />
                    <h2 className="font-black text-xs sm:text-sm uppercase text-slate-950 font-serif">
                      Prepared By — Group Members
                    </h2>
                  </div>
                  <span className="text-[11px] font-mono font-bold text-slate-600">
                    Super Mario Labor Adventure Team
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-4 gap-y-1 text-xs font-bold text-slate-900">
                  {GROUP_MEMBERS.map((member, idx) => (
                    <div key={member} className="flex items-center gap-1.5">
                      <span className="font-mono text-[10px] text-slate-500 w-4">{idx + 1}.</span>
                      <span>{member}</span>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Candidate Progress Summary Strip */}
            {includeProgress && (
              <section className="bg-white border-2 border-slate-900 rounded-xl p-4 space-y-3 break-inside-avoid">
                <div className="flex items-center justify-between border-b border-slate-300 pb-2">
                  <div className="flex items-center gap-2">
                    <Award className="w-5 h-5 text-slate-900" />
                    <h2 className="font-black text-sm uppercase text-slate-950 font-serif">
                      Mastery Progress Checklist
                    </h2>
                  </div>
                  <span className="font-bold text-xs bg-slate-900 text-white px-2.5 py-0.5 rounded">
                    Completed: {completedCount} / {totalTopics} Modules ({overallPercent}%)
                  </span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs">
                  {WORLDS_METADATA.map((w) => {
                    const worldTopics = ALL_LAW_TOPICS.filter((t) => t.worldId === w.id);
                    const done = worldTopics.filter((t) => completedTopicIds.includes(t.id)).length;
                    return (
                      <div key={w.id} className="p-2 border border-slate-300 rounded bg-slate-50">
                        <span className="font-bold block text-slate-800">
                          W{w.worldNumber}: {w.shortTitle}
                        </span>
                        <span className="font-semibold text-slate-950">
                          {done}/{worldTopics.length} mastered
                        </span>
                      </div>
                    );
                  })}
                </div>
              </section>
            )}

            {/* Personal Study Notes (from Persistent Drawer) */}
            {includePersonalNotes && resolvedNotes.length > 0 && (
              <section className="space-y-3 break-inside-avoid">
                <div className="border-b-2 border-slate-900 pb-1 flex items-center gap-2">
                  <NotebookPen className="w-4 h-4 text-slate-900" />
                  <h2 className="text-base font-black text-slate-950 font-serif uppercase">
                    Personal Study Notes &amp; Doctrine Mnemonics ({resolvedNotes.length})
                  </h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {resolvedNotes.map((note) => (
                    <div
                      key={note.id}
                      className="border border-slate-400 rounded-lg p-3 bg-white break-inside-avoid space-y-1"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-bold text-xs text-slate-950">{note.title}</span>
                        <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 bg-slate-100 border border-slate-300 rounded text-slate-700">
                          {note.worldTag}
                        </span>
                      </div>
                      <p className="text-xs text-slate-800 whitespace-pre-wrap leading-relaxed">
                        {note.content}
                      </p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Complete Statutory Multipliers Table */}
            {includeMultipliers && (
              <section className="space-y-3">
                <div className="border-b-2 border-slate-900 pb-1">
                  <h2 className="text-base font-black text-slate-950 font-serif uppercase">
                    I. Complete Statutory Multiplier Reference Matrix (DOLE BWC)
                  </h2>
                </div>
                <div className="overflow-x-auto w-full">
                  <table className="w-full text-left text-xs border border-slate-900 border-collapse">
                    <thead>
                      <tr className="bg-slate-100 text-slate-950 font-black">
                        <th className="p-2 border border-slate-800 whitespace-nowrap">Benefit Category</th>
                        <th className="p-2 border border-slate-800 whitespace-nowrap">Scenario / Day Type</th>
                        <th className="p-2 border border-slate-800 whitespace-nowrap">Rate</th>
                        <th className="p-2 border border-slate-800 whitespace-nowrap">Statutory Formula</th>
                      </tr>
                    </thead>
                    <tbody>
                      {LABOR_BENEFITS_MULTIPLIER_LIST.map((row, idx) => (
                        <tr
                          key={idx}
                          className={`break-inside-avoid ${idx % 2 === 0 ? 'bg-white' : 'bg-slate-50'}`}
                        >
                          <td className="p-2 border border-slate-400 font-bold text-slate-950 whitespace-nowrap">
                            {row.benefit}
                          </td>
                          <td className="p-2 border border-slate-400 font-medium text-slate-900 whitespace-normal break-normal">
                            {row.scenario}
                          </td>
                          <td className="p-2 border border-slate-400 font-mono font-bold text-slate-950 whitespace-nowrap">
                            {(row.multiplierDecimal * 100).toFixed(1).replace(/\.0$/, '')}%
                          </td>
                          <td className="p-2 border border-slate-400 font-mono text-[11px] text-slate-800 whitespace-normal break-normal">
                            {row.formula}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            )}

            {/* 17 Regions Minimum Wage & Kasambahay Matrix */}
            {includeRegionalWages && (
              <section className="space-y-3">
                <div className="border-b-2 border-slate-900 pb-1 flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-slate-900" />
                  <h2 className="text-base font-black text-slate-950 font-serif uppercase">
                    II. 17 Regions Daily Minimum Wage &amp; Kasambahay Monthly Rates
                  </h2>
                </div>
                <div className="overflow-x-auto w-full">
                  <table className="w-full text-left text-xs border border-slate-900 border-collapse">
                    <thead>
                      <tr className="bg-slate-100 text-slate-950 font-black">
                        <th className="p-2 border border-slate-800 whitespace-nowrap">Region</th>
                        <th className="p-2 border border-slate-800 whitespace-nowrap">Effectivity</th>
                        <th className="p-2 border border-slate-800 whitespace-nowrap">Non-Agriculture</th>
                        <th className="p-2 border border-slate-800 whitespace-nowrap">Agriculture</th>
                        <th className="p-2 border border-slate-800 whitespace-nowrap">Kasambahay</th>
                      </tr>
                    </thead>
                    <tbody>
                      {REGIONAL_MINIMUM_WAGES.map((rw, idx) => {
                        const kas = KASAMBAHAY_MINIMUM_WAGES[idx];
                        return (
                          <tr
                            key={rw.region}
                            className={`break-inside-avoid ${idx % 2 === 0 ? 'bg-white' : 'bg-slate-50'}`}
                          >
                            <td className="p-1.5 border border-slate-400 font-bold text-slate-950 whitespace-nowrap">
                              {rw.region}
                            </td>
                            <td className="p-1.5 border border-slate-400 font-mono text-[11px] text-slate-700 whitespace-nowrap">
                              {rw.effectivity}
                            </td>
                            <td className="p-1.5 border border-slate-400 font-mono font-bold text-slate-950 whitespace-nowrap">
                              {rw.nonAgri}
                            </td>
                            <td className="p-1.5 border border-slate-400 font-mono text-slate-800 whitespace-nowrap">
                              {rw.agri}
                            </td>
                            <td className="p-1.5 border border-slate-400 font-mono text-slate-800 whitespace-nowrap">
                              {kas ? kas.minimumWage : '—'}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </section>
            )}

            {/* Complete Unabridged Modules Breakdown */}
            {selectedWorlds.length > 0 && (
              <section className="space-y-6">
                <div className="border-b-2 border-slate-900 pb-1">
                  <h2 className="text-base font-black text-slate-950 font-serif uppercase">
                    III. Unabridged Codified Provisions, Doctrines &amp; Statutory Exceptions
                  </h2>
                </div>

                {WORLDS_METADATA.filter((w) => selectedWorlds.includes(w.id)).map((world) => {
                  const worldTopics = ALL_LAW_TOPICS.filter((t) => t.worldId === world.id);
                  return (
                    <div key={world.id} className="space-y-4">
                      <div className="bg-slate-100 p-3 border-l-4 border-slate-950 rounded-r break-inside-avoid">
                        <h3 className="font-black text-sm uppercase text-slate-950 font-serif">
                          World {world.worldNumber}: {world.title}
                        </h3>
                        <p className="text-xs text-slate-700 font-medium">{world.description}</p>
                      </div>

                      <div className="space-y-4">
                        {worldTopics.map((topic) => {
                          const isDone = completedTopicIds.includes(topic.id);
                          return (
                            <article
                              key={topic.id}
                              className="border border-slate-400 p-4 rounded-xl space-y-3 bg-white"
                            >
                              <div className="flex items-start justify-between gap-2 border-b border-slate-300 pb-2 break-inside-avoid">
                                <div>
                                  <span className="font-mono text-[10px] font-black uppercase px-1.5 py-0.5 bg-slate-200 text-slate-900 rounded mr-2">
                                    {topic.badge}
                                  </span>
                                  <h4 className="font-black text-sm text-slate-950 inline">
                                    {topic.title}
                                  </h4>
                                </div>
                                <span className="text-[11px] font-mono text-slate-700 flex-shrink-0">
                                  [{isDone ? '✓ MASTERED' : '  TO STUDY'}]
                                </span>
                              </div>

                              <p className="text-xs text-slate-900 leading-relaxed font-serif">
                                <strong>Summary:</strong> {topic.summary}
                              </p>

                              {topic.keyDoctrines && topic.keyDoctrines.length > 0 && (
                                <div className="bg-slate-50 p-2.5 rounded border border-slate-300 space-y-1 text-xs break-inside-avoid">
                                  <span className="font-black text-slate-950 block text-[11px] uppercase">
                                    Core Labor Doctrines:
                                  </span>
                                  <ul className="list-disc pl-4 space-y-0.5 text-slate-900">
                                    {topic.keyDoctrines.map((d, dIdx) => (
                                      <li key={dIdx}>{cleanRuleText(d)}</li>
                                    ))}
                                  </ul>
                                </div>
                              )}

                              {/* Complete Unabridged Rules, Subsections & Tables */}
                              <div className="space-y-2.5 text-xs">
                                {topic.rules.map((rule, rIdx) => (
                                  <div key={rIdx} className="space-y-1 break-inside-avoid">
                                    <span className="font-black text-slate-950 text-xs block">
                                      • {rule.heading}
                                    </span>
                                    {rule.description && (
                                      <p className="text-slate-800 pl-3">{rule.description}</p>
                                    )}
                                    {rule.items && rule.items.length > 0 && (
                                      <ul className="list-disc pl-5 space-y-0.5 text-slate-800">
                                        {rule.items.map((item, iIdx) => (
                                          <li key={iIdx}>{cleanRuleText(item)}</li>
                                        ))}
                                      </ul>
                                    )}
                                    {rule.subSections &&
                                      rule.subSections.map((sub, sIdx) => (
                                        <div key={sIdx} className="pl-4 pt-1 space-y-0.5">
                                          <span className="font-bold text-slate-900 block">
                                            {sub.title}
                                          </span>
                                          <ul className="list-circle pl-4 space-y-0.5 text-slate-800">
                                            {sub.items.map((si, siIdx) => (
                                              <li key={siIdx}>{cleanRuleText(si)}</li>
                                            ))}
                                          </ul>
                                        </div>
                                      ))}
                                    {rule.tableData && (
                                      <table className="w-full text-left text-[11px] border border-slate-600 border-collapse mt-1.5">
                                        <thead>
                                          <tr className="bg-slate-100 font-bold">
                                            {rule.tableData.headers.map((h, hIdx) => (
                                              <th key={hIdx} className="p-1.5 border border-slate-500">
                                                {h}
                                              </th>
                                            ))}
                                          </tr>
                                        </thead>
                                        <tbody>
                                          {rule.tableData.rows.map((rRow, rrIdx) => (
                                            <tr key={rrIdx}>
                                              {rRow.map((cell, cIdx) => (
                                                <td key={cIdx} className="p-1.5 border border-slate-400">
                                                  {cell}
                                                </td>
                                              ))}
                                            </tr>
                                          ))}
                                        </tbody>
                                      </table>
                                    )}
                                  </div>
                                ))}
                              </div>

                              {/* Statutory Exceptions */}
                              {topic.exceptions && topic.exceptions.length > 0 && (
                                <div className="bg-slate-50 p-2.5 rounded border border-slate-300 space-y-1.5 text-xs break-inside-avoid">
                                  <span className="font-black text-slate-950 block text-[11px] uppercase">
                                    General Rule &amp; Statutory Exceptions:
                                  </span>
                                  {topic.exceptions.map((ex, exIdx) => (
                                    <div key={exIdx} className="space-y-1">
                                      <p className="font-bold text-slate-900">
                                        General Rule: {ex.generalRule}
                                      </p>
                                      <ul className="list-disc pl-5 space-y-0.5 text-slate-800">
                                        {ex.exceptions.map((eItem, eiIdx) => (
                                          <li key={eiIdx}>{cleanRuleText(eItem)}</li>
                                        ))}
                                      </ul>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </article>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </section>
            )}

            {/* Document Footer */}
            <footer className="border-t-2 border-slate-950 pt-3 flex flex-wrap items-center justify-between gap-2 text-[10px] text-slate-600 font-mono break-inside-avoid">
              <span>Super Mario Labor Adventure • Philippine Labor Standards Guide</span>
              <span>Unabridged Academic &amp; Bar Review Reference</span>
            </footer>
          </div>
        </div>
      </div>
    </div>
  );
};
