export interface QuizQuestion {
  id: number;
  world: string;
  worldCode: 'w1' | 'w2' | 'w3' | 'w4' | 'w5' | 'w6' | 'holidays';
  scenario: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  legalBasis: string;
}

export const PRACTICE_QUESTIONS: QuizQuestion[] = [
  // ================= WORLD 1: HOURS OF WORK (14 Questions) =================
  {
    id: 1,
    world: 'World 1: Hours of Work',
    worldCode: 'w1',
    scenario:
      'Due to an unexpected power outage, a garment factory experiences a brownout lasting 18 minutes. Management instructs workers to stay at their stations. Is the 18-minute outage compensable?',
    options: [
      'No, because the sewing machines were idle.',
      'Yes, brownouts of short duration not exceeding 20 minutes are treated as hours worked whether used productively or not.',
      'No, brownouts are fortuitous events.',
      'Yes, only if workers swept the floor during the outage.',
    ],
    correctIndex: 1,
    explanation:
      'Brownouts not exceeding twenty (20) minutes are compensable hours worked regardless of whether employees perform productive tasks.',
    legalBasis: 'DOLE Policy Instruction & Omnibus Rules Book III',
  },
  {
    id: 2,
    world: 'World 1: Hours of Work',
    worldCode: 'w1',
    scenario:
      'A power brownout lasts 90 minutes. The supervisor forbids employees from leaving the factory floor because electricity "might return any minute." Are the 90 minutes compensable?',
    options: [
      'No, because it exceeded 20 minutes.',
      'Yes, brownouts exceeding 20 minutes are non-compensable ONLY if employees can leave the premises and use the time effectively for their own interest.',
      'Only the first 20 minutes are paid.',
      'Half of the 90 minutes is compensable.',
    ],
    correctIndex: 1,
    explanation:
      'For brownouts exceeding 20 minutes to be excluded from hours worked, employees must be allowed to leave the workplace and use the time freely for their own interest.',
    legalBasis: 'DOLE Brownout Rules & Art. 84, Labor Code',
  },
  {
    id: 3,
    world: 'World 1: Hours of Work',
    worldCode: 'w1',
    scenario:
      'A private hospital in Quezon City (population > 1M, 250 beds) requires its nurses to work 6 days (48 hours) in a week. What compensation is due for the 6th day?',
    options: [
      'Ordinary 100% daily pay because 48 hours is the standard workweek.',
      'Regular 5-day (40-hour) workweek applies; work on the 6th day entitles health personnel to an additional 30% of regular wage.',
      '200% double pay.',
      'No extra pay if granted free hospital meals.',
    ],
    correctIndex: 1,
    explanation:
      'Under Article 83, health personnel in cities >= 1M population or hospitals >= 100 beds have a normal 8-hour, 5-day (40-hour) workweek. Working the 6th day requires at least +30% additional pay.',
    legalBasis: 'Article 83, Labor Code of the Philippines',
  },
  {
    id: 4,
    world: 'World 1: Hours of Work',
    worldCode: 'w1',
    scenario:
      'A hospital requires resident physicians to render continuous 24-hour duty shifts, invoking "customary medical practice." Is this valid?',
    options: [
      'Valid because resident doctors are trainees.',
      'Invalid; customary practice of requiring resident physicians to work 24 hours a day violates statutory normal hours of work.',
      'Valid if approved by the Hospital Board.',
      'Valid during their first year of residency.',
    ],
    correctIndex: 1,
    explanation:
      'Statutory limitations on normal hours of work prevail over contrary customary hospital practices.',
    legalBasis: 'Article 83, Labor Code & University of Pangasinan Jurisprudence',
  },
  {
    id: 5,
    world: 'World 1: Hours of Work',
    worldCode: 'w1',
    scenario:
      'Delivery drivers report to the depot at 7:00 AM, follow fixed GPS-monitored routes, check in with dispatch hourly, and return by 5:00 PM. Management denies them overtime claiming they are "Field Personnel." Decide.',
    options: [
      'Valid, because they work outside the office.',
      'Invalid; because their time and performance are constantly supervised and determinable with reasonable certainty, they are NOT field personnel.',
      'Valid if they are paid per trip.',
      'Invalid only if they drive refrigerated trucks.',
    ],
    correctIndex: 1,
    explanation:
      'Under Auto Bus Transport v. Bautista, employees whose time and performance are constantly supervised in the field are regular rank-and-file covered by Title I benefits, not field personnel.',
    legalBasis: 'Article 82, Labor Code & Auto Bus Transport v. Bautista',
  },
  {
    id: 6,
    world: 'World 1: Hours of Work',
    worldCode: 'w1',
    scenario:
      'An employee travels from 7:00 PM to 11:00 PM on Sunday night to Cebu for a mandatory Monday 8:00 AM seminar. Her normal work shift is 8:00 AM to 5:00 PM. Is her Sunday night travel compensable?',
    options: [
      'Yes, all overnight travel away from home is compensable.',
      'No, travel away from home is compensable only when it cuts across the employee’s regular working hours (even on non-working days like 8 AM–5 PM Sunday).',
      'Yes, at 130% rest day rate.',
      'Yes, if she traveled by ferry.',
    ],
    correctIndex: 1,
    explanation:
      'Travel away from home counts as hours worked when it cuts across the employee’s normal working hours (e.g., 8 AM–5 PM), including corresponding hours on non-working days, but not outside those hours unless working while traveling.',
    legalBasis: 'Sec. 4(c), Rule I, Book III, Omnibus Rules',
  },
  {
    id: 7,
    world: 'World 1: Hours of Work',
    worldCode: 'w1',
    scenario:
      'HR gives employees two 15-minute coffee breaks daily and deducts 30 minutes per day from their paid hours. Is the deduction valid?',
    options: [
      'Valid because coffee breaks are non-productive.',
      'Unlawful; rest periods of short duration (5 to 20 minutes) are mandatorily counted as compensable hours worked.',
      'Valid if written in the employment contract.',
      'Unlawful only for minimum wage earners.',
    ],
    correctIndex: 1,
    explanation:
      'Short rest periods or coffee breaks lasting from 5 to 20 minutes are counted as compensable working time.',
    legalBasis: 'Article 84 & Sec. 7, Rule I, Book III, Omnibus Rules',
  },
  {
    id: 8,
    world: 'World 1: Hours of Work',
    worldCode: 'w1',
    scenario:
      'In a continuous-operation glass plant, workers’ regular 60-minute lunch break is shortened to 25 minutes so furnaces are never left untended. How must the 25-minute meal break be treated?',
    options: [
      'Unpaid because meal breaks are never compensable.',
      'Fully compensable as working time because meal breaks shortened to less than 60 minutes (minimum 20 minutes) must be paid.',
      'Half-paid at 50%.',
      'Illegal; meal breaks can never be less than 60 minutes under any circumstance.',
    ],
    correctIndex: 1,
    explanation:
      'Under Omnibus Rules Book III, Rule I, Sec. 7, a meal period may be shortened to not less than 20 minutes in continuous non-manual work or urgent cases, provided the shortened meal period is credited as compensable hours worked.',
    legalBasis: 'Article 85 & Sec. 7, Rule I, Book III, Omnibus Rules',
  },
  {
    id: 9,
    world: 'World 1: Hours of Work',
    worldCode: 'w1',
    scenario:
      'Toad arrived 1 hour late on Tuesday (undertime) and worked 1 hour extra on Wednesday (overtime). Payroll offsets the two and pays him straight basic salary. Is this legal?',
    options: [
      'Legal because total weekly hours equal 40.',
      'Illegal; Article 88 strictly prohibits offsetting undertime on one day by overtime work on another day.',
      'Legal if Toad requested the offset.',
      'Legal for monthly-paid employees.',
    ],
    correctIndex: 1,
    explanation:
      'Permitting undertime to be offset by overtime would deprive the employee of the statutory overtime premium (+25% / +30%) earned on the overtime hours.',
    legalBasis: 'Article 88, Labor Code of the Philippines',
  },
  {
    id: 10,
    world: 'World 1: Hours of Work',
    worldCode: 'w1',
    scenario:
      'Yoshi works a graveyard shift from 10:00 PM to 6:00 AM on an ordinary Tuesday. His regular hourly rate is ₱100. How much total pay does he earn for the 8-hour shift?',
    options: [
      '₱800',
      '₱880 (₱800 basic + ₱80 Night Shift Differential at 10%)',
      '₱1,000',
      '₱960',
    ],
    correctIndex: 1,
    explanation:
      'Every covered employee receives not less than 10% Night Shift Differential for each hour worked between 10:00 PM and 6:00 AM (8 hrs × ₱100 × 1.10 = ₱880).',
    legalBasis: 'Article 86, Labor Code of the Philippines',
  },
  {
    id: 11,
    world: 'World 1: Hours of Work',
    worldCode: 'w1',
    scenario:
      'A retail store regularly employing only four (4) salesclerks operates from 9:00 PM to 5:00 AM. Are the salesclerks entitled to Night Shift Differential?',
    options: [
      'Yes, all private workers get NSD.',
      'No; retail and service establishments regularly employing not more than five (5) workers are statutorily exempt from Night Shift Differential.',
      'Yes, at half rate (5%).',
      'Only on weekends.',
    ],
    correctIndex: 1,
    explanation:
      'Under Omnibus Rules Book III, Rule II, Sec. 1(e), retail and service establishments regularly employing not more than five (5) workers are exempt from NSD.',
    legalBasis: 'Rule II, Sec. 1(e), Book III, Omnibus Rules',
  },
  {
    id: 12,
    world: 'World 1: Hours of Work',
    worldCode: 'w1',
    scenario:
      'Seamen aboard a cargo vessel have off-duty cabins on the ship but remain subject to emergency call if rough seas hit. Is their routine uninterrupted sleeping time in their cabins compensable overtime?',
    options: [
      'Yes, 24 hours a day because they cannot leave the ship.',
      'No; seamen are not paid overtime simply because they cannot leave the ship; they are entitled to OT only when actually required to perform work beyond 8 hours.',
      'Yes, at 50% standby pay.',
      'Only when sailing in international waters.',
    ],
    correctIndex: 1,
    explanation:
      'Under settled Supreme Court jurisprudence (National Shipyards /PCL Shipping), the criterion for seamen is whether they actually rendered work in excess of 8 hours, not mere presence aboard the vessel.',
    legalBasis: 'National Shipyards & Steel Corp. v. CIR',
  },
  {
    id: 13,
    world: 'World 1: Hours of Work',
    worldCode: 'w1',
    scenario:
      'Employees attend a voluntary after-hours photography hobby club sponsored by HR with zero relation to their accounting jobs and no attendance penalty. Is club time compensable?',
    options: [
      'Yes, because HR sponsored the snacks.',
      'No; attendance at lectures/meetings is non-compensable when outside regular hours, genuinely voluntary, and the employee performs no productive work.',
      'Yes, up to 2 hours.',
      'Yes, if held inside the conference room.',
    ],
    correctIndex: 1,
    explanation:
      'Under Sec. 6, Rule I, Book III, lectures, meetings, and training programs are not counted as working time if outside regular hours, voluntary, and no productive work is performed.',
    legalBasis: 'Sec. 6, Rule I, Book III, Omnibus Rules',
  },
  {
    id: 14,
    world: 'World 1: Hours of Work',
    worldCode: 'w1',
    scenario:
      'Under DOLE Advisory No. 02-04, what are the strict hour caps for a valid Compressed Work Week (CWW) where daily hours beyond 8 do not trigger overtime pay?',
    options: [
      'Up to 14 hours/day and 56 hours/week.',
      'Not exceeding 12 hours/day and 48 hours/week, with voluntary employee consent and DOLE notice.',
      'Up to 10 hours/day and 40 hours/week only.',
      'Any schedule unilaterally ordered by management.',
    ],
    correctIndex: 1,
    explanation:
      'A valid CWW requires voluntary majority employee agreement, prior DOLE notice, no diminution of weekly pay, and caps of 12 hours/day and 48 hours/week.',
    legalBasis: 'DOLE Department Advisory No. 02, Series of 2004',
  },

  // ================= WORLD 2: REST, SIL, SERVICE CHARGE & 13TH MONTH (11 Questions) =================
  {
    id: 15,
    world: 'World 2: Rest & 13th Month',
    worldCode: 'w2',
    scenario:
      'An employee requests Saturday as her weekly rest day based on Seventh-day Adventist religious grounds. Can the employer force her to take Tuesday instead when Saturday causes no serious business prejudice?',
    options: [
      'Yes, scheduling rest days is absolute management prerogative.',
      'No; under Article 91, the employer MUST respect the employee’s weekly rest day preference when based on religious grounds.',
      'Yes, unless 100% of employees share the same religion.',
      'Only if she takes a 10% wage cut.',
    ],
    correctIndex: 1,
    explanation:
      'While the employer schedules weekly rest days, Article 91 obligates the employer to respect an employee’s preference when grounded on religious beliefs (or grant at least 2 days per month of choice if serious obstruction occurs).',
    legalBasis: 'Article 91, Labor Code & Omnibus Rules',
  },
  {
    id: 16,
    world: 'World 2: Rest & 13th Month',
    worldCode: 'w2',
    scenario:
      'Under Republic Act No. 11360, a hotel collects ₱500,000 in service charges. Management retains 15% for breakages and gives 5% to hotel directors. Is this valid?',
    options: [
      'Valid under the old 85%-15% rule.',
      'Illegal; R.A. 11360 mandates 100% equal distribution of all collected service charges to covered non-managerial employees.',
      'Valid if breakages exceeded ₱50,000.',
      'Valid if approved by majority vote.',
    ],
    correctIndex: 1,
    explanation:
      'R.A. 11360 amended Article 96 so 100% of service charges go completely and equally to covered rank-and-file/supervisory non-managerial workers, with 0% to management.',
    legalBasis: 'Republic Act No. 11360 (Amended Art. 96, Labor Code)',
  },
  {
    id: 17,
    world: 'World 2: Rest & 13th Month',
    worldCode: 'w2',
    scenario:
      'How frequently must collected service charges be distributed to covered hotel and restaurant workers under R.A. 11360 IRR?',
    options: [
      'Once a year in December.',
      'Completely and equally at least once every two (2) weeks or twice a month at intervals not exceeding 16 days.',
      'Quarterly.',
      'Upon resignation.',
    ],
    correctIndex: 1,
    explanation:
      'DOLE D.O. 206-19 requires service charges to be distributed completely and equally based on actual hours/days worked at least twice a month (intervals <= 16 days).',
    legalBasis: 'DOLE Department Order No. 206, Series of 2019',
  },
  {
    id: 18,
    world: 'World 2: Rest & 13th Month',
    worldCode: 'w2',
    scenario:
      'Luigi worked for 10 years without using his 5-day annual Service Incentive Leave (SIL). Upon retirement, he claims 50 days of commuted SIL. Management argues years 1–7 prescribed under the 3-year money-claim bar. Who wins?',
    options: [
      'Management; SIL prescribes every December 31.',
      'Luigi; under Auto Bus Transport v. Bautista, the 3-year prescriptive period for unused SIL starts ONLY upon separation or demand refusal.',
      'SIL is forfeited if unused each year.',
      'Luigi gets only 15 days.',
    ],
    correctIndex: 1,
    explanation:
      'Because the employee has the option to commute SIL upon separation, the cause of action accrues—and the 3-year prescriptive clock starts—only upon termination of employment.',
    legalBasis: 'Auto Bus Transport Systems v. Bautista (G.R. No. 156367)',
  },
  {
    id: 19,
    world: 'World 2: Rest & 13th Month',
    worldCode: 'w2',
    scenario:
      'Which employee is NOT entitled to statutory 5-day Service Incentive Leave under Article 95?',
    options: [
      'A probationary clerk after completing 12 months of total service.',
      'An employee already enjoying at least 5 days of vacation leave with pay under company policy.',
      'A piece-rate factory worker supervised daily.',
      'A part-time cashier who completed 1 year of service.',
    ],
    correctIndex: 1,
    explanation:
      'Employees already enjoying vacation leave with pay of at least five (5) days are expressly exempt from statutory SIL duplication.',
    legalBasis: 'Article 95, Labor Code & Omnibus Rules',
  },
  {
    id: 20,
    world: 'World 2: Rest & 13th Month',
    worldCode: 'w2',
    scenario:
      'Peach earned ₱240,000 total basic salary, ₱24,000 overtime pay, and ₱12,000 night differential during the calendar year. What is her statutory minimum 13th-month pay under P.D. 851?',
    options: [
      '₱23,000 (1/12 of gross earnings)',
      '₱20,000 (1/12 of ₱240,000 basic salary only, excluding OT and NSD)',
      '₱22,000',
      '₱18,000',
    ],
    correctIndex: 1,
    explanation:
      'Under P.D. 851 and San Miguel Corp. v. Inciong, "basic salary" for 13th-month pay excludes overtime, night differential, holiday premium, and COLA unless integrated by CBA/practice.',
    legalBasis: 'P.D. No. 851 & Revised Guidelines on 13th Month Pay',
  },
  {
    id: 21,
    world: 'World 2: Rest & 13th Month',
    worldCode: 'w2',
    scenario:
      'Wario worked from January 1 to April 30 (4 months) at ₱18,000/month basic salary, then resigned voluntarily. Is he entitled to 13th-month pay?',
    options: [
      'No, because he resigned before December 24.',
      'Yes, pro-rated 13th-month pay of ₱6,000 (₱72,000 ÷ 12) because he worked at least one (1) month during the calendar year.',
      'Only if he worked at least 6 months.',
      'No, resignation forfeits P.D. 851 benefits.',
    ],
    correctIndex: 1,
    explanation:
      'Any rank-and-file employee who has worked at least one (1) month during the calendar year is entitled to proportionate 13th-month pay regardless of resignation or dismissal.',
    legalBasis: 'Revised Guidelines on the Implementation of P.D. 851',
  },
  {
    id: 22,
    world: 'World 2: Rest & 13th Month',
    worldCode: 'w2',
    scenario:
      'An employer distributes sacks of rice and grocery vouchers in December and deducts their cost from the workers’ 13th-month pay. Is this valid?',
    options: [
      'Valid if the workers accepted the rice.',
      'Void; non-cash benefits in food, commodities, or electricity cannot substitute for cash 13th-month pay.',
      'Valid up to 50%.',
      'Valid if rice prices rose.',
    ],
    correctIndex: 1,
    explanation:
      '13th-month pay must be paid in legal tender on or before December 24; payment in kind/groceries is prohibited.',
    legalBasis: 'Presidential Decree No. 851 & Kamaya Point Hotel v. NLRC',
  },
  {
    id: 23,
    world: 'World 2: Rest & 13th Month',
    worldCode: 'w2',
    scenario:
      'Are rank-and-file public school teachers employed by the Department of Education covered by P.D. 851 (Labor Code 13th-Month Pay)?',
    options: [
      'Yes, all teachers are covered by P.D. 851.',
      'No; government employees are excluded from P.D. 851 and instead receive year-end bonuses under Civil Service / DBM statutes.',
      'Only if they teach night classes.',
      'Yes, at 50% rate.',
    ],
    correctIndex: 1,
    explanation:
      'The government and its political subdivisions (including GOCCs with original charters) are exempt from P.D. 851 because public sector compensation is governed by R.A. 6686 / SSL.',
    legalBasis: 'Sec. 3(b), Rules Implementing P.D. 851',
  },
  {
    id: 24,
    world: 'World 2: Rest & 13th Month',
    worldCode: 'w2',
    scenario:
      'Daisy worked 8 hours on her scheduled Sunday rest day (not a holiday). Her daily rate is ₱1,000. How much is her total pay for that day?',
    options: [
      '₱1,000 (100%)',
      '₱1,250 (125%)',
      '₱1,300 (130%)',
      '₱2,000 (200%)',
    ],
    correctIndex: 2,
    explanation:
      'Under Article 93(a), work performed on an employee’s scheduled rest day is compensated at regular wage plus at least 30% premium = 130% (₱1,300).',
    legalBasis: 'Article 93(a), Labor Code of the Philippines',
  },
  {
    id: 25,
    world: 'World 2: Rest & 13th Month',
    worldCode: 'w2',
    scenario:
      'What is the overtime hourly multiplier when an employee works beyond 8 hours on a scheduled Rest Day?',
    options: [
      'Hourly basic rate × 1.25',
      'Hourly basic rate × 1.30 × 1.30 (169% of basic hourly rate)',
      'Hourly basic rate × 2.00',
      'Hourly basic rate × 1.50',
    ],
    correctIndex: 1,
    explanation:
      'Overtime on a Rest Day or Special Non-Working Day carries an additional 30% on top of the 130% hourly rate: 1.30 × 1.30 = 1.69 (169%).',
    legalBasis: 'Article 87 & Art. 93, Labor Code',
  },

  // ================= DEDICATED HOLIDAYS QUESTIONS (12 Questions) =================
  {
    id: 26,
    world: 'Holidays: Statutory Rules',
    worldCode: 'holidays',
    scenario:
      'Mario worked 8 hours on December 30 (Rizal Day, a Regular Holiday) which also fell on his scheduled weekly rest day. Daily wage is ₱1,000. Compute his pay.',
    options: [
      '₱2,000 (200%)',
      '₱2,300 (230%)',
      '₱2,600 (260%)',
      '₱3,000 (300%)',
    ],
    correctIndex: 2,
    explanation:
      'Regular Holiday (200%) falling on a Rest Day (+30% of 200% = +60%) equals 260% of basic daily wage (₱2,600).',
    legalBasis: 'Article 94, Labor Code & DOLE Handbook',
  },
  {
    id: 27,
    world: 'Holidays: Statutory Rules',
    worldCode: 'holidays',
    scenario:
      'Araw ng Kagitingan (April 9) coincides with Maundy Thursday (Double Regular Holiday). Luigi did NOT work on that day, and he was present the workday before. If his daily wage is ₱900, how much does he receive?',
    options: [
      '₱0 (No work, no pay)',
      '₱900 (100%)',
      '₱1,800 (200% for unworked Double Regular Holiday)',
      '₱2,700 (300%)',
    ],
    correctIndex: 2,
    explanation:
      'When two Regular Holidays fall on the same date, an eligible employee who does NOT work receives 200% of the daily wage (100% for each regular holiday).',
    legalBasis: 'DOLE Explanatory Bulletin on Double Holidays & Asian Transmission v. CA',
  },
  {
    id: 28,
    world: 'Holidays: Statutory Rules',
    worldCode: 'holidays',
    scenario:
      'Using the same Double Regular Holiday (April 9 + Maundy Thursday), Rosalina WORKED 8 hours, and it was ALSO her scheduled weekly Rest Day! What percentage of her daily wage must she receive?',
    options: [
      '260%',
      '300%',
      '330%',
      '390% (300% Double Holiday + 30% of 300% Rest Day premium)',
    ],
    correctIndex: 3,
    explanation:
      'Worked Double Regular Holiday (300%) + 30% Rest Day premium on 300% (+90%) = 390% total daily pay.',
    legalBasis: 'DOLE Statutory Multiplier Table',
  },
  {
    id: 29,
    world: 'Holidays: Statutory Rules',
    worldCode: 'holidays',
    scenario:
      'Pauline is absent WITHOUT pay on Wednesday, the workday immediately preceding Maundy Thursday and Good Friday (successive Regular Holidays). She does not work on Thursday or Friday either. What holiday pay does she get?',
    options: [
      '100% for both Maundy Thursday and Good Friday.',
      '0% — she forfeits holiday pay for BOTH Maundy Thursday and Good Friday unless she works on Maundy Thursday (which restores Good Friday).',
      '50% for each.',
      '0% for Thursday, 100% for Friday automatically.',
    ],
    correctIndex: 1,
    explanation:
      'Where there are two successive regular holidays, an employee absent without pay on the day immediately preceding the first holiday is not entitled to holiday pay for BOTH, unless they work on the first regular holiday (which entitles them to holiday pay on the second).',
    legalBasis: 'Sec. 10, Rule IV, Book III, Omnibus Rules Implementing the Labor Code',
  },
  {
    id: 30,
    world: 'Holidays: Statutory Rules',
    worldCode: 'holidays',
    scenario:
      'Toadette was on approved Sick Leave WITH PAY on Wednesday before a Thursday Regular Holiday. She did not work on Thursday. Is she entitled to 100% Holiday Pay for Thursday?',
    options: [
      'No, she must physically clock in on Wednesday.',
      'Yes; an employee on leave of absence WITH PAY on the workday immediately preceding a regular holiday is entitled to 100% holiday pay.',
      'Only 50%.',
      'Only if she works Friday.',
    ],
    correctIndex: 1,
    explanation:
      'Presence or leave of absence WITH pay on the workday immediately preceding a regular holiday preserves full 100% unworked regular holiday pay.',
    legalBasis: 'Sec. 6, Rule IV, Book III, Omnibus Rules',
  },
  {
    id: 31,
    world: 'Holidays: Statutory Rules',
    worldCode: 'holidays',
    scenario:
      'August 21 (Ninoy Aquino Day) is a Special Non-Working Day. Birdo did not report for work. No CBA or company policy grants unworked special day pay. How much is Birdo paid (daily-paid worker)?',
    options: [
      '100% basic wage',
      '0% under the "No work, no pay" principle',
      '30% standby pay',
      '130% basic wage',
    ],
    correctIndex: 1,
    explanation:
      'On Special Non-Working Days, the statutory rule is "No work, no pay" unless there is a favorable company policy, practice, or CBA.',
    legalBasis: 'DOLE Labor Advisory on Special Non-Working Days',
  },
  {
    id: 32,
    world: 'Holidays: Statutory Rules',
    worldCode: 'holidays',
    scenario:
      'Donkey Kong worked 8 hours on November 1 (All Saints’ Day, a Special Non-Working Day) which also fell on his scheduled Rest Day. Daily wage is ₱800. How much is his pay?',
    options: [
      '₱1,040 (130%)',
      '₱1,200 (150% of daily rate)',
      '₱1,600 (200%)',
      '₱800 (100%)',
    ],
    correctIndex: 1,
    explanation:
      'Work performed on a Special Non-Working Day that falls on a scheduled Rest Day is paid 150% of basic daily wage (₱800 × 1.50 = ₱1,200).',
    legalBasis: 'Article 93(c), Labor Code & DOLE Multiplier Matrix',
  },
  {
    id: 33,
    world: 'Holidays: Statutory Rules',
    worldCode: 'holidays',
    scenario:
      'Proclamation declares a date as a "Special Working Day." Diddy Kong works 8 hours on that day (an ordinary weekday for him). What rate applies?',
    options: [
      '130% special rate',
      '100% regular daily wage (no statutory premium for the first 8 hours)',
      '150% rate',
      '200% rate',
    ],
    correctIndex: 1,
    explanation:
      'On a Special Working Day, work performed is treated as an ordinary working day paid at 100% basic daily wage for the first 8 hours (125% for overtime).',
    legalBasis: 'DOLE Labor Advisory on Special Working Days',
  },
  {
    id: 34,
    world: 'Holidays: Statutory Rules',
    worldCode: 'holidays',
    scenario:
      'A neighborhood bakery regularly employs 8 workers. Are its bakers statutorily entitled to Regular Holiday Pay under Article 94?',
    options: [
      'Yes, all bakeries are manufacturing.',
      'No; retail and service establishments regularly employing LESS THAN ten (< 10) workers are exempt from Holiday Pay under Article 94(b).',
      'Yes, at 150% rate.',
      'Only on Christmas and New Year.',
    ],
    correctIndex: 1,
    explanation:
      'Article 94(b) exempts retail and service establishments regularly employing less than ten (10) workers from mandatory holiday pay.',
    legalBasis: 'Article 94(b), Labor Code of the Philippines',
  },
  {
    id: 35,
    world: 'Holidays: Statutory Rules',
    worldCode: 'holidays',
    scenario:
      'How is unworked Regular Holiday Pay computed for a supervised piece-rate worker (e.g., garment sewer paid per shirt inside the factory)?',
    options: [
      'Piece-rate workers are never entitled to holiday pay.',
      'Not less than their average daily earnings for the last seven (7) actual working days preceding the regular holiday (never below statutory minimum wage).',
      'Fixed ₱200 flat allowance.',
      'Average earnings over the last 12 months.',
    ],
    correctIndex: 1,
    explanation:
      'Supervised piece-rate workers receive holiday pay equal to at least their average daily earnings for the last 7 actual workdays immediately preceding the regular holiday, provided it is not less than the applicable statutory minimum wage.',
    legalBasis: 'Sec. 8(b), Rule IV, Book III, Omnibus Rules',
  },
  {
    id: 36,
    world: 'Holidays: Statutory Rules',
    worldCode: 'holidays',
    scenario:
      'How are private school faculty paid per lecture hour ("no class, no pay") treated during unworked Regular Holidays vs semestral vacations?',
    options: [
      'Paid during both regular holidays and semestral breaks.',
      'Not entitled during semestral vacations, EXCEPT they MUST be paid during regular holidays and unexpected class suspensions (Jose Rizal College doctrine).',
      'Never entitled to any holiday pay.',
      'Paid 200% even when unworked.',
    ],
    correctIndex: 1,
    explanation:
      'Under Jose Rizal College v. NLRC, hourly-paid private school faculty are entitled to regular holiday pay during expected regular holidays and class suspensions (e.g. typhoons), though not during scheduled semestral breaks.',
    legalBasis: 'Jose Rizal College v. NLRC & Sec. 8(a), Rule IV, Book III',
  },
  {
    id: 37,
    world: 'Holidays: Statutory Rules',
    worldCode: 'holidays',
    scenario:
      'Waluigi works 10 hours (2 hours overtime) on a Regular Holiday (ordinary workday). His daily rate is ₱800 (₱100/hr). Compute his total pay for the 10 hours.',
    options: [
      '₱2,000',
      '₱2,120 (₱1,600 for first 8 hrs + ₱520 for 2 OT hrs at ₱100 × 2.0 × 1.30 = ₱260/hr)',
      '₱2,200',
      '₱1,850',
    ],
    correctIndex: 1,
    explanation:
      'First 8 hours = ₱800 × 200% = ₱1,600. Overtime on Regular Holiday = ₱100 × 200% × 130% = ₱260/hr × 2 hrs = ₱520. Total = ₱2,120.',
    legalBasis: 'Articles 87 & 94, Labor Code',
  },

  // ================= WORLD 3: WAGES, DEDUCTIONS & CONTRACTING (10 Questions) =================
  {
    id: 38,
    world: 'World 3: Wages & Contracting',
    worldCode: 'w3',
    scenario:
      'Under DOLE D.O. 174-17, what is the minimum substantial capital required for a corporation or partnership to qualify as a legitimate contractor?',
    options: [
      '₱1,000,000 paid-up capital',
      '₱3,000,000 paid-up capital',
      '₱5,000,000 paid-up capital',
      '₱10,000,000 authorized capital',
    ],
    correctIndex: 2,
    explanation:
      'Section 3(l) of DOLE D.O. 174-17 defines substantial capital as paid-up capital stock/shares of at least ₱5,000,000 for corporations/partnerships/cooperatives, or net worth of at least ₱5,000,000 for single proprietorships.',
    legalBasis: 'DOLE Department Order No. 174, Series of 2017',
  },
  {
    id: 39,
    world: 'World 3: Wages & Contracting',
    worldCode: 'w3',
    scenario:
      'A legitimate contractor with ₱8M capital fails to pay two months of wages to guards assigned to Peach Bank. Is Peach Bank liable for the unpaid wages?',
    options: [
      'No, because the contractor is legitimate and independent.',
      'Yes; under Articles 106, 107, and 109, the principal is SOLIDARILY liable with the legitimate contractor for unpaid wages to the extent of work performed under the contract.',
      'Peach Bank becomes their permanent employer.',
      'Only up to 10% of the contract fee.',
    ],
    correctIndex: 1,
    explanation:
      'Even in legitimate job contracting, the principal is solidarily liable with the contractor for unpaid wages for work performed (without prejudice to reimbursement from the contractor). In labor-only contracting, the principal becomes the direct employer for ALL purposes.',
    legalBasis: 'Articles 106–109, Labor Code of the Philippines',
  },
  {
    id: 40,
    world: 'World 3: Wages & Contracting',
    worldCode: 'w3',
    scenario:
      'A company provides free specialized flame-retardant uniforms to foundry welders for OSHA compliance and deducts ₱300/month from their minimum wage as a "facility." Valid?',
    options: [
      'Valid if the welders signed a consent form.',
      'Invalid; protective gear and company uniforms are SUPPLEMENTS for the employer’s benefit/business, NEVER deductible from wages.',
      'Valid up to 50% of cost.',
      'Valid after 6 months.',
    ],
    correctIndex: 1,
    explanation:
      'Under Mabeza v. NLRC and Atok-Big Wedge, items primarily for the benefit or convenience of the employer are "supplements" (non-deductible), unlike "facilities" for employee subsistence (which require voluntary written consent + DOLE fair-value evaluation).',
    legalBasis: 'Mabeza v. NLRC & Sec. 5, Rule VII-A, Book III',
  },
  {
    id: 41,
    world: 'World 3: Wages & Contracting',
    worldCode: 'w3',
    scenario:
      'What are the three mandatory legal requisites before an employer may deduct the value of Meals or Lodging ("Facilities") from a minimum-wage employee’s salary?',
    options: [
      'Oral notice to the employee is enough.',
      '1) Proof such facilities are customarily furnished in the trade; 2) Voluntary written acceptance by the employee; and 3) Fair and reasonable value (without profit) charged.',
      'Union vote only.',
      'Barangay clearance.',
    ],
    correctIndex: 1,
    explanation:
      'In Mabeza v. NLRC, the Supreme Court established the strict 3-part test: customary in the trade, voluntary written authorization by the employee, and fair/reasonable value without employer profit.',
    legalBasis: 'Mabeza v. NLRC (G.R. No. 118506)',
  },
  {
    id: 42,
    world: 'World 3: Wages & Contracting',
    worldCode: 'w3',
    scenario:
      'In an UNORGANIZED establishment (no union / no CBA), a regional Wage Order causes a wage distortion. If employer and workers fail to settle it within 10 calendar days before the NCMB, who resolves it?',
    options: [
      'Voluntary Arbitrator.',
      'National Labor Relations Commission (NLRC) through compulsory arbitration.',
      'Supreme Court directly.',
      'RTWPB.',
    ],
    correctIndex: 1,
    explanation:
      'Under Article 124: Organized establishments -> Grievance Machinery -> Voluntary Arbitration. Unorganized establishments -> NCMB conciliation (10 days) -> NLRC compulsory arbitration.',
    legalBasis: 'Article 124, Labor Code of the Philippines',
  },
  {
    id: 43,
    world: 'World 3: Wages & Contracting',
    worldCode: 'w3',
    scenario:
      'A union strikes because management refused to adjust Supervisor wages immediately after a Wage Order raised minimum wages. Is the strike over Wage Distortion legal?',
    options: [
      'Legal, wage distortion is an unfair labor practice.',
      'Illegal; legislative/jurisprudential policy (Ilaw at Buklod ng Manggagawa) prohibits strikes or lockouts over wage distortion disputes, which must follow Art. 124 arbitration.',
      'Legal if 30-day strike notice was filed.',
      'Legal in unorganized firms.',
    ],
    correctIndex: 1,
    explanation:
      'In Ilaw at Buklod ng Manggagawa v. NLRC, the Supreme Court held that strikes/lockouts are prohibited as a means of resolving wage distortion; Art. 124’s grievance/arbitration procedure is exclusive.',
    legalBasis: 'Article 124, Labor Code & Ilaw at Buklod ng Manggagawa v. NLRC',
  },
  {
    id: 44,
    world: 'World 3: Wages & Contracting',
    worldCode: 'w3',
    scenario:
      'Under Article 110, when an employer goes bankrupt and undergoes liquidation, what preference do workers’ unpaid wages enjoy?',
    options: [
      'Subordinate to commercial bank mortgages.',
      'First preference as regards wages and monetary claims over other creditors (after government taxes), subject to formal insolvency/liquidation proceedings.',
      'Last in line after shareholders.',
      'Automatic seizure without court liquidation.',
    ],
    correctIndex: 1,
    explanation:
      'Article 110 grants workers first preference in unpaid wages and monetary claims in case of bankruptcy or liquidation, enforceable within formal insolvency/liquidation proceedings (DBP v. NLRC).',
    legalBasis: 'Article 110, Labor Code & Republic v. Peralta',
  },
  {
    id: 45,
    world: 'World 3: Wages & Contracting',
    worldCode: 'w3',
    scenario:
      'Because of a payroll clerk’s clear mathematical misreading of a new tax circular, employees were overpaid ₱1,500 for two paydays. Management corrects the error on the third payday. Does this violate Non-Diminution of Benefits (Art. 100)?',
    options: [
      'Yes, once paid twice it is vested.',
      'No; correction of an error in the construction or application of a doubtful or difficult question of law (or clear clerical mistake discovered promptly) does not violate Art. 100.',
      'Yes, unless DOLE issues an exemption.',
      'Only new hires can be corrected.',
    ],
    correctIndex: 1,
    explanation:
      'Non-diminution applies only to long, consistent, deliberate, and voluntary grants—not to good-faith mistakes or erroneous legal interpretations corrected promptly (Globe Mackay v. NLRC).',
    legalBasis: 'Article 100, Labor Code & Globe Mackay Cable v. NLRC',
  },
  {
    id: 46,
    world: 'World 3: Wages & Contracting',
    worldCode: 'w3',
    scenario:
      'Where must wages be paid as a general rule under Article 104 of the Labor Code, and where is payment strictly prohibited?',
    options: [
      'Anywhere convenient, including bars if near the office.',
      'At or near the place of undertaking (or via compliant ATM/bank payroll); payment in bars, night/day clubs, drinking establishments, massage clinics, or casinos is prohibited (except for their own employees).',
      'Only at the Barangay Hall.',
      'Only in cash envelopes.',
    ],
    correctIndex: 1,
    explanation:
      'Wages must be paid at/near the workplace (or authorized bank ATM facility), and R.A. 6727 / Labor Code rules prohibit wage payment inside bars, clubs, casinos, or gambling places except for persons employed therein.',
    legalBasis: 'Article 104, Labor Code & Sec. 4, Rule VIII, Book III',
  },
  {
    id: 47,
    world: 'World 3: Wages & Contracting',
    worldCode: 'w3',
    scenario:
      'A factory worker accidentally breaks a ₱4,000 tool due to proven gross negligence after a formal hearing. His weekly wage is ₱3,000. What is the MAXIMUM weekly deduction allowed under Omnibus Rules?',
    options: [
      '₱3,000 (100% of weekly wage)',
      '₱600 (cannot exceed 20% of the employee’s wages in a week)',
      '₱1,500 (50% of weekly wage)',
      '₱0; damage deductions are always banned.',
    ],
    correctIndex: 1,
    explanation:
      'Once employee fault and due process are satisfied under Art. 114, Sec. 11, Rule VIII, Book III caps weekly deductions for loss/damage at 20% of the employee’s weekly wage.',
    legalBasis: 'Art. 114 & Sec. 11, Rule VIII, Book III, Omnibus Rules',
  },

  // ================= WORLD 4: SPECIAL GROUPS OF EMPLOYEES (9 Questions) =================
  {
    id: 48,
    world: 'World 4: Special Groups',
    worldCode: 'w4',
    scenario:
      'An airline Flight Attendant handbook states that female cabin crew who get pregnant or marry shall automatically be considered resigned. Valid?',
    options: [
      'Valid due to cabin safety requirements.',
      'Void and illegal under Articles 134 & 135 (renumbered 136–137), which prohibit stipulations against marriage and dismissal on account of pregnancy.',
      'Valid if signed voluntarily.',
      'Valid for international flights only.',
    ],
    correctIndex: 1,
    explanation:
      'Stipulations against marriage (Art. 136) and discharge on account of pregnancy (Art. 137) violate statutory public policy (PT&T v. NLRC; Saudia v. Moradas).',
    legalBasis: 'Articles 136–137, Labor Code & PT&T v. NLRC',
  },
  {
    id: 49,
    world: 'World 4: Special Groups',
    worldCode: 'w4',
    scenario:
      'Star Paper Corp. enforces a blanket rule banning employees from marrying ANY co-employee, firing an employee who married a coworker in a completely unrelated department without showing business necessity. Valid?',
    options: [
      'Valid management prerogative.',
      'Invalid; under Star Paper Corp. v. Simbol, a no-spouse policy among coworkers is void unless the employer proves a Bona Fide Occupational Qualification (BFOQ) / reasonable business necessity.',
      'Always valid in manufacturing.',
      'Valid if the husband resigns instead of the wife.',
    ],
    correctIndex: 1,
    explanation:
      'Unlike competitor-conflict policies (Glaxo), a blanket ban on marrying co-employees is struck down unless justified by a genuine Bona Fide Occupational Qualification (BFOQ).',
    legalBasis: 'Star Paper Corp. v. Simbol (G.R. No. 164774)',
  },
  {
    id: 50,
    world: 'World 4: Special Groups',
    worldCode: 'w4',
    scenario:
      'Under R.A. 9231, a 13-year-old child actor works on a TV commercial with a valid DOLE Child Working Permit. What are the strict hour limits and night-work curfew?',
    options: [
      '8 hrs/day, 40 hrs/week; no work 10 PM–6 AM.',
      'Not more than 4 hours/day and 20 hours/week; strictly NO work between 8:00 PM and 6:00 AM.',
      '6 hrs/day, 30 hrs/week.',
      '2 hrs/day only.',
    ],
    correctIndex: 1,
    explanation:
      'Children below 15 years old (when allowed under permit) may work max 4 hours/day, 20 hours/week, and never between 8:00 PM and 6:00 AM.',
    legalBasis: 'Section 12-A, Republic Act No. 9231',
  },
  {
    id: 51,
    world: 'World 4: Special Groups',
    worldCode: 'w4',
    scenario:
      'For a working child under R.A. 9231, how may the child’s wages be used by parents, and how much must go into a Trust Fund?',
    options: [
      'Parents own 100% of a minor’s earnings.',
      'At least 30% must be deposited in a Trust Fund in the child’s name, and at most 20% may be used for the collective needs of the family if the child’s needs are first met.',
      '50% to parents, 50% to school.',
      '10% Trust Fund.',
    ],
    correctIndex: 1,
    explanation:
      'R.A. 9231 Sec. 12-B protects the child’s income: collective family needs cannot exceed 20%, and at least 30% must be preserved in a bank trust fund for the child’s education/future.',
    legalBasis: 'Section 12-B, Republic Act No. 9231',
  },
  {
    id: 52,
    world: 'World 4: Special Groups',
    worldCode: 'w4',
    scenario:
      'Under Batas Kasambahay (R.A. 10361), a domestic helper earns ₱4,500/month in a chartered city outside NCR. Who pays the monthly SSS, PhilHealth, and Pag-IBIG contributions?',
    options: [
      'Split 50–50 between employer and Kasambahay.',
      '100% shouldered by the EMPLOYER because the Kasambahay’s monthly wage is less than ₱5,000.',
      '100% deducted from the Kasambahay.',
      'Social coverage is optional.',
    ],
    correctIndex: 1,
    explanation:
      'Under Section 30 of R.A. 10361, if the Kasambahay receives a wage of less than ₱5,000/month, the employer pays the entire SSS, PhilHealth, and Pag-IBIG premium without deducting an employee share.',
    legalBasis: 'Section 30, Republic Act No. 10361 (Batas Kasambahay)',
  },
  {
    id: 53,
    world: 'World 4: Special Groups',
    worldCode: 'w4',
    scenario:
      'Can a Kasambahay’s unused 5-day annual Service Incentive Leave (SIL) be accumulated from year to year and converted to cash upon resignation like industrial SIL?',
    options: [
      'Yes, identical to Article 95.',
      'No; under Section 29 of R.A. 10361, any unused portion of a Kasambahay’s 5-day SIL shall NOT be cumulative or carried over to succeeding years, and unused SIL is not convertible to cash.',
      'Convertible at 50%.',
      'Cumulative up to 30 days.',
    ],
    correctIndex: 1,
    explanation:
      'Critical Bar exam distinction! Industrial SIL (Art. 95) IS cumulative and commutable to cash, whereas Kasambahay SIL (Sec. 29, R.A. 10361) is NOT cumulative and NOT convertible to cash!',
    legalBasis: 'Section 29, Republic Act No. 10361',
  },
  {
    id: 54,
    world: 'World 4: Special Groups',
    worldCode: 'w4',
    scenario:
      'Under R.A. 10151 (Night Workers Law), a pregnant night-shift call center agent presents a medical certificate stating she is unfit for night work for 10 weeks before childbirth. What must the employer do?',
    options: [
      'Terminate her with separation pay.',
      'Transfer her to a similar daytime job if practicable, or extend maternity/social security benefits; she CANNOT be dismissed on account of night-work unfitness due to pregnancy.',
      'Cut her pay by 50%.',
      'Force her to sign a quitclaim.',
    ],
    correctIndex: 1,
    explanation:
      'Under R.A. 10151 (Art. 158), pregnant and nursing night workers must be provided alternatives to night work (transfer to day shift or benefit extension for at least 16 weeks before/after childbirth) and enjoy protection against dismissal.',
    legalBasis: 'Republic Act No. 10151 (Art. 158, Labor Code)',
  },
  {
    id: 55,
    world: 'World 4: Special Groups',
    worldCode: 'w4',
    scenario:
      'Who is NOT classified as a "Kasambahay" under R.A. 10361?',
    options: [
      'A live-in family yaya.',
      'A family driver or children under foster family arrangement.',
      'A household laundrywoman.',
      'A live-in gardener.',
    ],
    correctIndex: 1,
    explanation:
      'Section 3(d) & Sec. 4 of R.A. 10361 expressly exclude service providers, family drivers, children under foster family arrangement, and persons who perform work occasionally/sporadically.',
    legalBasis: 'Section 4, Republic Act No. 10361',
  },
  {
    id: 56,
    world: 'World 4: Special Groups',
    worldCode: 'w4',
    scenario:
      'Under R.A. 10917 (amending R.A. 9547 on SPES), what age range of poor but deserving students or out-of-school youth is eligible for the Special Program for Employment of Students?',
    options: [
      '12 to 18 years old',
      '15 to 30 years old',
      '18 to 25 years old',
      '21 to 35 years old',
    ],
    correctIndex: 1,
    explanation:
      'R.A. 10917 expanded SPES eligibility to students and out-of-school youth aged 15 to 30 years old, with employers paying 60% in cash and DOLE paying 40%.',
    legalBasis: 'Republic Act No. 10917 (Amended SPES Law)',
  },

  // ================= WORLD 5: SPECIAL PROTECTIVE LAWS (9 Questions) =================
  {
    id: 57,
    world: 'World 5: Protective Laws',
    worldCode: 'w5',
    scenario:
      'Under the 105-Day Expanded Maternity Leave Law (R.A. 11210), an unmarried solo-parent employee gives birth via normal delivery. How many total days of PAID maternity leave is she entitled to?',
    options: [
      '60 days',
      '105 days',
      '120 days (105 days base + 15 days additional paid leave for qualified Solo Parents under R.A. 8972)',
      '90 days',
    ],
    correctIndex: 2,
    explanation:
      'R.A. 11210 grants 105 days paid maternity leave regardless of civil status or delivery mode (normal/caesarean), plus an additional 15 days with full pay if she qualifies as a Solo Parent = 120 paid days!',
    legalBasis: 'Section 3, Republic Act No. 11210',
  },
  {
    id: 58,
    world: 'World 5: Protective Laws',
    worldCode: 'w5',
    scenario:
      'Under R.A. 11210, how many days of paid maternity leave are granted in case of miscarriage or emergency termination of pregnancy?',
    options: [
      '30 days',
      '60 days with full pay',
      '78 days',
      '105 days',
    ],
    correctIndex: 1,
    explanation:
      'For miscarriage or emergency termination of pregnancy, R.A. 11210 grants sixty (60) days of maternity leave with full pay.',
    legalBasis: 'Section 3, Republic Act No. 11210',
  },
  {
    id: 59,
    world: 'World 5: Protective Laws',
    worldCode: 'w5',
    scenario:
      'A junior intern sends unwanted sexually explicit messages and lewd gestures to his female department supervisor. Under the Safe Spaces Act (R.A. 11313), is he liable for workplace gender-based sexual harassment?',
    options: [
      'No, because a subordinate lacks moral ascendancy over a supervisor.',
      'Yes; R.A. 11313 expressly penalizes workplace sexual harassment committed between peers AND by a subordinate to a superior.',
      'Only civilly liable for damages.',
      'Only if committed outside office hours.',
    ],
    correctIndex: 1,
    explanation:
      'Unlike R.A. 7877, the Safe Spaces Act (R.A. 11313, Sec. 16) eliminates the requirement of moral ascendancy, covering peer-to-peer and subordinate-to-superior harassment including online messages.',
    legalBasis: 'Section 16, Republic Act No. 11313 (Safe Spaces Act)',
  },
  {
    id: 60,
    world: 'World 5: Protective Laws',
    worldCode: 'w5',
    scenario:
      'Under R.A. 9710 (Magna Carta for Women), a female employee with 8 months aggregate service undergoes surgical hysterectomy. How long is her Special Leave Benefit, and is unused leave convertible to cash?',
    options: [
      '30 days, convertible to cash.',
      'Up to two (2) months with full pay based on gross monthly compensation; non-cumulative and NOT convertible to cash.',
      '60 days unpaid.',
      '15 days, cumulative.',
    ],
    correctIndex: 1,
    explanation:
      'Section 18 of R.A. 9710 grants up to 2 months special leave with full pay following surgery caused by gynecological disorders (after >=6 months aggregate service in the last 12 months), non-cumulative and non-convertible to cash.',
    legalBasis: 'Section 18, Republic Act No. 9710',
  },
  {
    id: 61,
    world: 'World 5: Protective Laws',
    worldCode: 'w5',
    scenario:
      'Under the Expanded Solo Parents Welfare Act (R.A. 11861 amending R.A. 8972), what is the minimum service requirement to avail of the 7-day forfeitable/non-cumulative paid Parental Leave?',
    options: [
      '1 year of continuous service',
      'At least six (6) months of service (reduced from 1 year by R.A. 11861!)',
      '2 years of service',
      'Day 1 of employment',
    ],
    correctIndex: 1,
    explanation:
      'R.A. 11861 reduced the service qualification for the 7-day paid Solo Parent Leave from 1 year down to at least six (6) months of service regardless of employment status!',
    legalBasis: 'Section 8, R.A. 8972 as amended by R.A. 11861',
  },
  {
    id: 62,
    world: 'World 5: Protective Laws',
    worldCode: 'w5',
    scenario:
      'Under R.A. 10911 (Anti-Age Discrimination in Employment Act), an employer publishes a job ad: "Wanted: Bookkeeper, must be 22–28 years old." Valid?',
    options: [
      'Valid freedom of commercial speech.',
      'Unlawful; R.A. 10911 strictly prohibits publishing job notices suggesting age preference/limitation unless age is a proven Bona Fide Occupational Qualification (BFOQ).',
      'Valid if salary is above minimum wage.',
      'Valid for private corporations.',
    ],
    correctIndex: 1,
    explanation:
      'Section 5(a) of R.A. 10911 prohibits printing or publishing any notice or advertisement relating to employment suggesting preferences, limitations, specifications, or discrimination based on age.',
    legalBasis: 'Section 5, Republic Act No. 10911',
  },
  {
    id: 63,
    world: 'World 5: Protective Laws',
    worldCode: 'w5',
    scenario:
      'Under R.A. 7277 (Magna Carta for Persons with Disabilities), what tax incentive is granted to private entities that employ qualified PWDs as regular, apprentice, or learner employees?',
    options: [
      'Full income tax holiday for 5 years.',
      'Additional deduction from gross income equivalent to 25% of the total amount paid as salaries and wages to Persons with Disability.',
      '50% VAT exemption.',
      'Zero local business tax.',
    ],
    correctIndex: 1,
    explanation:
      'Section 8(b) of R.A. 7277 rewards private employers who hire PWDs with an additional deduction from gross income equal to 25% of total salaries/wages paid to PWDs (plus 50% deduction for physical facility modifications).',
    legalBasis: 'Section 8, Republic Act No. 7277',
  },
  {
    id: 64,
    world: 'World 5: Protective Laws',
    worldCode: 'w5',
    scenario:
      'Under R.A. 11165 (Telecommuting Act), a work-from-home software engineer renders authorized work from 10:00 PM to 2:00 AM. Management refuses Night Shift Differential claiming she was "comfortably at home." Decide.',
    options: [
      'Management is right; NSD applies only to physical offices.',
      'Unlawful; under the Fair Treatment standard of R.A. 11165, telecommuting workers are entitled to the exact same rate of pay, overtime, and Night Shift Differential as comparable on-site workers.',
      'She gets half NSD (5%).',
      'Telecommuting waives all Title I rights.',
    ],
    correctIndex: 1,
    explanation:
      'Section 4 (Fair Treatment) of R.A. 11165 guarantees telecommuting employees no less than minimum labor standards, including overtime, holiday pay, and Night Shift Differential.',
    legalBasis: 'Section 4, Republic Act No. 11165 (Telecommuting Act)',
  },
  {
    id: 65,
    world: 'World 5: Protective Laws',
    worldCode: 'w5',
    scenario:
      'Under R.A. 10754 & R.A. 7277, how many positions must government agencies reserve for Persons with Disability (PWDs), and what is encouraged for private corporations with >100 employees?',
    options: [
      '5% for both.',
      'At least 1% of all positions in government agencies; private corporations with more than 100 employees are encouraged to reserve at least 1% of all positions for PWDs.',
      '10% for government.',
      '2% mandatory quota for small shops.',
    ],
    correctIndex: 1,
    explanation:
      'R.A. 10524 (amending Sec. 5 of R.A. 7277) mandates at least 1% reservation of positions in government agencies and encourages private corporations with >100 employees to reserve at least 1%.',
    legalBasis: 'Republic Act No. 10524 (Amending Sec. 5, R.A. 7277)',
  },
];

// ================= 30 RAPID-FIRE BOWSER BOSS QUESTIONS =================
export const BOWSER_BOSS_QUESTIONS: QuizQuestion[] = [
  {
    id: 101,
    world: 'Bowser Keep • CWW',
    worldCode: 'w1',
    scenario:
      'Bowser Corp. institutes a 4-day Compressed Work Week (12 hrs/day = 48 hrs) unilaterally without employee consent. Must Bowser pay daily overtime beyond 8 hours?',
    options: [
      'No, because weekly hours do not exceed 48.',
      'Yes! Without voluntary employee agreement and DOLE notice, the CWW is invalid and hours beyond 8/day require overtime pay.',
      'No, if lunch is free.',
      'Only on Fridays.',
    ],
    correctIndex: 1,
    explanation:
      'Voluntary employee consent and DOLE notification are indispensable for a valid CWW waiver of daily overtime.',
    legalBasis: 'DOLE Advisory No. 02-04 & Bisig Manggagawa sa Tryco v. NLRC',
  },
  {
    id: 102,
    world: 'Bowser Keep • Double Holiday',
    worldCode: 'holidays',
    scenario:
      'Koopa works 8 hours on a Double Regular Holiday that ALSO falls on his scheduled Rest Day! Daily wage is ₱1,000. Compute statutory pay!',
    options: ['₱2,600 (260%)', '₱3,000 (300%)', '₱3,600 (360%)', '₱3,900 (390%)'],
    correctIndex: 3,
    explanation: '300% Double Regular Holiday + 30% of 300% (90%) Rest Day premium = 390% (₱3,900).',
    legalBasis: 'DOLE Statutory Multiplier Matrix',
  },
  {
    id: 103,
    world: 'Bowser Keep • Art. 88',
    worldCode: 'w1',
    scenario:
      'Shy Guy is 45 minutes late on Monday, so Bowser makes him work 45 minutes overtime on Wednesday at straight pay. Valid?',
    options: [
      'Valid net balance.',
      'Invalid! Article 88 strictly forbids offsetting undertime with overtime.',
      'Valid if Shy Guy agrees.',
      'Valid once a month.',
    ],
    correctIndex: 1,
    explanation: 'Article 88 prohibits offsetting undertime on any day by overtime on another day.',
    legalBasis: 'Article 88, Labor Code',
  },
  {
    id: 104,
    world: 'Bowser Keep • Wage Distortion',
    worldCode: 'w3',
    scenario:
      'A Wage Order compresses the intentional pay gap between Rank 1 and Rank 2 workers in a unionized factory. What is the mandatory remedy?',
    options: [
      'Immediate union strike.',
      'CBA Grievance Machinery, and if unresolved, Voluntary Arbitration under Article 124.',
      'Criminal lawsuit.',
      'No remedy exists.',
    ],
    correctIndex: 1,
    explanation: 'Organized establishments must use CBA Grievance Machinery -> Voluntary Arbitration under Art. 124.',
    legalBasis: 'Article 124, Labor Code',
  },
  {
    id: 105,
    world: 'Bowser Keep • Lactation',
    worldCode: 'w5',
    scenario:
      'Under R.A. 10028, what is the minimum compensable lactation break per 8-hour shift for nursing employees?',
    options: [
      '15 minutes unpaid',
      'Not less than 40 minutes total, counted as compensable hours worked',
      '60 minutes unpaid',
      '20 minutes unpaid',
    ],
    correctIndex: 1,
    explanation: 'Section 12 of R.A. 10028 grants at least 40 minutes compensable lactation time per 8-hour shift.',
    legalBasis: 'Section 12, R.A. 10028',
  },
  {
    id: 106,
    world: 'Bowser Keep • VAWC Leave',
    worldCode: 'w5',
    scenario:
      'Bowser fires an employee for taking her 10-day paid VAWC leave supported by a Barangay Protection Order. Consequence?',
    options: [
      '₱500 fine only.',
      'Illegal dismissal + criminal liability/contempt under Section 43 of R.A. 9262!',
      'Valid management prerogative.',
      'Deductible from salary.',
    ],
    correctIndex: 1,
    explanation: 'Penalizing or dismissing a VAWC victim-employee for availing 10-day leave violates Sec. 43 of R.A. 9262.',
    legalBasis: 'Section 43, R.A. 9262',
  },
  {
    id: 107,
    world: 'Bowser Keep • Retirement',
    worldCode: 'w5',
    scenario:
      'Under Article 302, how many days of pay per year of service comprise statutory "one-half month salary" retirement pay?',
    options: ['15 days', '22.5 days (15 basic + 2.5 13th mo. + 5 SIL)', '30 days', '20 days'],
    correctIndex: 1,
    explanation: 'Statutory 1/2 month retirement salary equals 22.5 days per year of service (>=6 months counts as 1 full year).',
    legalBasis: 'Article 302, Labor Code & Elegance Textile Doctrine',
  },
  {
    id: 108,
    world: 'Bowser Keep • Legal Tender',
    worldCode: 'w3',
    scenario:
      'Bowser pays workers half in cash and half in "Bowser Mart Coupons." Does this violate the Labor Code?',
    options: [
      'No, if Bowser Mart sells rice.',
      'Yes! Article 102 outlaws payment of wages in tokens, chits, coupons, or promissory notes (criminal offense under Art. 303!).',
      'No, if workers sign waivers.',
      'Only illegal for supervisors.',
    ],
    correctIndex: 1,
    explanation: 'Article 102 mandates legal tender even if employees expressly request tokens/coupons.',
    legalBasis: 'Article 102, Labor Code & Congson v. NLRC',
  },
  {
    id: 109,
    world: 'Bowser Keep • Underground Miners',
    worldCode: 'w5',
    scenario:
      'Under R.A. 10741 (Underground Mine Workers Retirement Law), what are the optional and compulsory retirement ages for underground miners with >=5 years service?',
    options: [
      '60 optional / 65 compulsory',
      '50 optional / 60 compulsory',
      '45 optional / 55 compulsory',
      '55 optional / 65 compulsory',
    ],
    correctIndex: 1,
    explanation: 'Underground and surface mine workers enjoy lowered retirement ages: 50 optional and 60 compulsory!',
    legalBasis: 'Republic Act No. 10741 (Amending Art. 302)',
  },
  {
    id: 110,
    world: 'Bowser Keep • Racehorse Jockeys',
    worldCode: 'w5',
    scenario:
      'Under R.A. 10789, what is the compulsory retirement age for professional Racehorse Jockeys?',
    options: ['50 years old', '55 years old (with 5 years minimum service)', '60 years old', '65 years old'],
    correctIndex: 1,
    explanation: 'R.A. 10789 sets compulsory retirement for professional racehorse jockeys at age 55.',
    legalBasis: 'Republic Act No. 10789',
  },
  {
    id: 111,
    world: 'Bowser Keep • Service Charge',
    worldCode: 'w2',
    scenario:
      'If Bowser’s Castle Hotel completely abolishes its 10% service charge, what happens to the employees’ historical average share?',
    options: [
      'Lost forever.',
      'Must be considered integrated into the covered employees’ basic wages based on their average share for the past 12 months!',
      'Converted to gift checks.',
      'Paid once at 50%.',
    ],
    correctIndex: 1,
    explanation: 'When service charges are abolished, the 12-month average share of covered workers must be integrated into basic wages.',
    legalBasis: 'Article 96, Labor Code & R.A. 11360 IRR',
  },
  {
    id: 112,
    world: 'Bowser Keep • Exemption Trap',
    worldCode: 'w3',
    scenario:
      'A retail shop regularly employs EXACTLY ten (10) workers. Which exemption can it apply for, and which can it NOT claim?',
    options: [
      'Exempt from Holiday Pay, SIL, and Minimum Wage.',
      'May apply for Minimum Wage exemption (<= 10 workers), but is NOT exempt from Holiday Pay or SIL (which require < 10 workers, i.e., 9 or fewer)!',
      'Exempt from NSD (<= 5).',
      'Exempt from 13th Month Pay.',
    ],
    correctIndex: 1,
    explanation: 'Classic Bar Exam trap! Minimum Wage exemption = "not more than 10" (<=10); Holiday Pay & SIL = "less than 10" (<10); NSD = "not more than 5" (<=5).',
    legalBasis: 'R.A. 6727 vs. Art. 94(b) & Art. 95(b), Labor Code',
  },
  {
    id: 113,
    world: 'Bowser Keep • Paternity Allocation',
    worldCode: 'w5',
    scenario:
      'Under R.A. 11210 + R.A. 8187, up to how many TOTAL paid days can a married father enjoy upon his wife’s 2nd childbirth if she allocates maximum transferable maternity days to him?',
    options: [
      '7 days total',
      '14 days total (7 days Paternity Leave under R.A. 8187 + 7 allocated days from the mother’s 105-day Maternity Leave under R.A. 11210)',
      '21 days total',
      '30 days total',
    ],
    correctIndex: 1,
    explanation: 'Up to 7 days of the mother’s 105-day maternity leave can be allocated to the child’s father on top of his 7-day Paternity Leave = 14 days!',
    legalBasis: 'Section 6, R.A. 11210 & R.A. 8187',
  },
  {
    id: 114,
    world: 'Bowser Keep • Cabo System',
    worldCode: 'w3',
    scenario:
      'What is the "Cabo System" under DOLE D.O. 174-17?',
    options: [
      'A valid maritime union.',
      'A person or group/labor organization that, under the guise of a labor organization or cooperative, supplies workers to an employer — strictly PROHIBITED!',
      'A legitimate stevedoring corporation with ₱10M capital.',
      'A wage formula.',
    ],
    correctIndex: 1,
    explanation: 'Supplying workers under the guise of a labor union or "cabo" is unconditionally prohibited.',
    legalBasis: 'Section 3(b) & Sec. 6, DOLE D.O. 174-17',
  },
  {
    id: 115,
    world: 'Bowser Keep • Kasambahay Debt',
    worldCode: 'w4',
    scenario:
      'Bowser lends a Kasambahay ₱10,000 and forces her to sign a pledge not to resign until the loan is fully paid off. Valid?',
    options: [
      'Valid civil contract.',
      'Void and illegal Debt Bondage under Section 15 of R.A. 10361 (Batas Kasambahay)!',
      'Valid up to 1 year.',
      'Valid if notarized.',
    ],
    correctIndex: 1,
    explanation: 'Section 15 of R.A. 10361 strictly outlaws debt bondage—using an advance/loan as collateral to keep a Kasambahay from leaving employment.',
    legalBasis: 'Section 15, R.A. 10361',
  },
  {
    id: 116,
    world: 'Bowser Keep • Kasambahay Min Age',
    worldCode: 'w4',
    scenario:
      'What is the minimum employable age for a Kasambahay under R.A. 10361 & R.A. 9231?',
    options: ['12 years old', '14 years old', '15 years old', '18 years old'],
    correctIndex: 2,
    explanation: 'Under Sec. 16 of R.A. 10361, it is unlawful to employ any person below fifteen (15) years of age as a domestic worker.',
    legalBasis: 'Section 16, R.A. 10361',
  },
  {
    id: 117,
    world: 'Bowser Keep • Muslim Eid Holidays',
    worldCode: 'holidays',
    scenario:
      'Are Christian and non-Muslim employees nationwide entitled to Regular Holiday Pay on Eid’l Fitr and Eid’l Adha?',
    options: [
      'No, only Muslim employees in BARMM.',
      'Yes! Under R.A. 9177 and R.A. 9849, Eid’l Fitr and Eid’l Adha are NATIONAL Regular Holidays enjoyed by ALL covered workers regardless of religion!',
      'Only as Special Working Days.',
      'Only at 130%.',
    ],
    correctIndex: 1,
    explanation: 'Both Eid’l Fitr and Eid’l Adha are national Regular Holidays (200% worked / 100% unworked) for all covered employees nationwide.',
    legalBasis: 'R.A. 9177, R.A. 9849 & DOLE Advisories',
  },
  {
    id: 118,
    world: 'Bowser Keep • NSD on Regular Holiday',
    worldCode: 'holidays',
    scenario:
      'Kamek works from 10:00 PM to 6:00 AM on a Regular Holiday (ordinary workday). Hourly basic rate = ₱100. What is his hourly rate during those night hours?',
    options: [
      '₱210/hr (200% + 10%)',
      '₱220/hr (₱100 × 200% Regular Holiday × 1.10 NSD = 220% of basic hourly rate)',
      '₱260/hr',
      '₱200/hr',
    ],
    correctIndex: 1,
    explanation: 'Night Shift Differential on a holiday is 10% of the wage rate FOR THAT DAY: ₱100 × 2.00 × 1.10 = ₱220/hr (220%).',
    legalBasis: 'DOLE Handbook on Workers’ Statutory Monetary Benefits',
  },
  {
    id: 119,
    world: 'Bowser Keep • Emergency OT',
    worldCode: 'w1',
    scenario:
      'A typhoon floods the warehouse, threatening perishable rice stocks. Dry Bones refuses to render 2 hours of overtime to move the sacks. Can management compel overtime?',
    options: [
      'Never; all overtime is voluntary.',
      'Yes; Article 89 authorizes compulsory emergency overtime to prevent loss or damage to perishable goods or due to imminent calamity/typhoon (with full OT pay).',
      'Yes, without paying OT.',
      'Only with a court order.',
    ],
    correctIndex: 1,
    explanation: 'Article 89 enumerates the specific instances (war/calamity, urgent machine repair, perishable goods, necessary completion of started work) where emergency overtime is mandatory.',
    legalBasis: 'Article 89, Labor Code',
  },
  {
    id: 120,
    world: 'Bowser Keep • Wage Withholding',
    worldCode: 'w3',
    scenario:
      'An employee resigns, and Bowser withholds her final 2 months of earned basic salary for 9 months because she hasn’t returned an old ID lanyard worth ₱50. Lawful?',
    options: [
      'Lawful unlimited clearance hold.',
      'Unlawful under Article 116 (Withholding of Wages) & DOLE Labor Advisory 06-20 (Final Pay must be released within 30 days, subject only to proved commensurate accountability).',
      'Lawful up to 2 years.',
      'Forfeits all backpay.',
    ],
    correctIndex: 1,
    explanation: 'While reasonable clearance procedures are valid (Milan v. NLRC), withholding disproportionate earned wages indefinitely violates Art. 116 and DOLE LA 06-20 (30-day final pay rule).',
    legalBasis: 'Article 116, Labor Code, Milan v. NLRC & DOLE LA 06-20',
  },
  {
    id: 121,
    world: 'Bowser Keep • Commission & 13th Mo',
    worldCode: 'w2',
    scenario:
      'Are "overriding commissions" of a sales manager (not tied to personal direct sales productivity) included in basic salary for 13th-month pay?',
    options: [
      'Yes, all commissions are basic pay.',
      'No; first, managers are excluded from P.D. 851, and second, overriding/profit-bonus commissions not forming direct wage-for-work are excluded (Boie-Takeda / Philippine Duplicators doctrine).',
      'Yes, at 50%.',
      'Only in leap years.',
    ],
    correctIndex: 1,
    explanation: 'Under Philippine Duplicators v. NLRC, direct sales commissions integrated into basic pay of rank-and-file salesmen count, whereas productivity/overriding bonuses and managerial staff do not.',
    legalBasis: 'Philippine Duplicators v. NLRC & P.D. 851',
  },
  {
    id: 122,
    world: 'Bowser Keep • Apprentice Wage',
    worldCode: 'w5',
    scenario:
      'Bowser hires "apprentices" at 75% minimum wage WITHOUT prior TESDA approval of the apprenticeship program. What is their legal status?',
    options: [
      'Valid trainees for 6 months.',
      'They become REGULAR EMPLOYEES from Day 1 entitled to 100% full statutory minimum wage!',
      'Probationary workers at 80% pay.',
      'Volunteers.',
    ],
    correctIndex: 1,
    explanation: 'Prior TESDA registration/approval is a sine qua non condition; without it, putative apprentices are regular employees entitled to 100% minimum wage (Nitto Enterprises v. NLRC).',
    legalBasis: 'Article 61, Labor Code & Nitto Enterprises v. NLRC',
  },
  {
    id: 123,
    world: 'Bowser Keep • Learner Commit-to-Hire',
    worldCode: 'w5',
    scenario:
      'What distinguishes a "Learnerhip Agreement" (Art. 75) from an "Apprenticeship" regarding regularization?',
    options: [
      'Learners are unpaid.',
      'A Learnership Agreement MUST contain an express commitment by the employer to employ the learners as REGULAR employees if they so desire upon completion of the learnership (max 3 months)!',
      'Learnership lasts 2 years.',
      'Learners can be aged 12.',
    ],
    correctIndex: 1,
    explanation: 'Learnership covers semi-skilled/non-apprenticeable occupations (<= 3 months) and requires a mandatory commitment to hire as regular upon completion; learners dismissed after 2 months without fault are deemed regular!',
    legalBasis: 'Article 75, Labor Code of the Philippines',
  },
  {
    id: 124,
    world: 'Bowser Keep • CODI Duty',
    worldCode: 'w5',
    scenario:
      'Bowser Corp. ignores a written sexual harassment complaint and has no Committee on Decorum and Investigation (CODI). What is Bowser Corp.’s liability?',
    options: [
      'None, harassment is purely personal to the offender.',
      'Solidarily liable for damages arising from the acts of sexual harassment + administrative fines under R.A. 7877 and R.A. 11313!',
      'Verbal warning only.',
      'Union pays the fine.',
    ],
    correctIndex: 1,
    explanation: 'Under Sec. 5 of R.A. 7877 and Sec. 19 of R.A. 11313, the employer is solidarily liable for damages if informed of the harassment and no immediate action is taken.',
    legalBasis: 'R.A. 7877 Sec. 5 & R.A. 11313 Sec. 19',
  },
  {
    id: 125,
    world: 'Bowser Keep • Mental Health',
    worldCode: 'w5',
    scenario:
      'Under R.A. 11036 (Mental Health Act) & DOLE D.O. 208-20, can an employer reject a qualified job applicant solely due to a history of managed clinical depression?',
    options: [
      'Yes, to avoid sick leaves.',
      'No; employers must formulate workplace mental health policies and are prohibited from discriminating against workers/applicants with mental health conditions.',
      'Yes, in BPO firms.',
      'Only if under age 25.',
    ],
    correctIndex: 1,
    explanation: 'R.A. 11036 Sec. 25 and DOLE D.O. 208-20 mandate non-discrimination and reasonable accommodation for workers with mental health conditions.',
    legalBasis: 'Section 25, R.A. 11036 & DOLE D.O. 208-20',
  },
  {
    id: 126,
    world: 'Bowser Keep • HIV Non-Discrimination',
    worldCode: 'w5',
    scenario:
      'Under R.A. 11166 (Philippine HIV and AIDS Policy Act), can Bowser require mandatory HIV testing as a pre-employment condition for office clerks?',
    options: [
      'Yes, part of standard medical exam.',
      'Strictly UNLAWFUL! Compulsory HIV testing as a precondition to employment and termination based on actual/perceived HIV status are criminal offenses under R.A. 11166.',
      'Yes, if Bowser pays for the lab test.',
      'Allowed for probationary staff.',
    ],
    correctIndex: 1,
    explanation: 'R.A. 11166 prohibits compulsory HIV testing and any workplace discrimination from hiring to promotion/termination based on HIV status.',
    legalBasis: 'Sections 29 & 49, Republic Act No. 11166',
  },
  {
    id: 127,
    world: 'Bowser Keep • First Aid / OSH',
    worldCode: 'w5',
    scenario:
      'Under R.A. 11058 (OSH Law), a scaffold starts collapsing with imminent danger of death. Workers halt work and step off. Can Bowser fire them for insubordination?',
    options: [
      'Yes, refusal to work is abandonment.',
      'No! Section 6 of R.A. 11058 grants workers the statutory Right to Refuse Unsafe Work without threat or reprisal when imminent danger exists!',
      'Yes, unless DOLE arrives first.',
      'They lose 1 month pay.',
    ],
    correctIndex: 1,
    explanation: 'Workers have the statutory right to refuse unsafe work in situations of imminent danger, and administrative fines up to ₱100,000/day apply to willful OSH violations.',
    legalBasis: 'Section 6, Republic Act No. 11058 (OSH Law)',
  },
  {
    id: 128,
    world: 'Bowser Keep • PPE Cost',
    worldCode: 'w5',
    scenario:
      'Under R.A. 11058, who bears the cost of Personal Protective Equipment (hard hats, harnesses, respirators) on a construction site?',
    options: [
      'Deducted at 10% per week from workers.',
      '100% FREE OF CHARGE provided by the employer!',
      '50–50 cost share.',
      'Union funds.',
    ],
    correctIndex: 1,
    explanation: 'Section 8 of R.A. 11058 mandates that every employer shall provide workers their PPE FREE OF CHARGE.',
    legalBasis: 'Section 8, Republic Act No. 11058',
  },
  {
    id: 129,
    world: 'Bowser Keep • Temporary Closure Holiday',
    worldCode: 'holidays',
    scenario:
      'Bowser temporarily suspends factory operations for 3 weeks of annual inventory/maintenance. Christmas Day and Rizal Day fall during that shutdown. Are regular workers entitled to Holiday Pay?',
    options: [
      'No, because the plant was closed.',
      'Yes! Under Omnibus Rules Book III, Rule IV, Sec. 7(a), in cases of temporary or periodic shutdown/cessation of work (inventory, repair), regular holidays falling within the period MUST still be compensated!',
      'Only 50%.',
      'Only if the shutdown lasted 2 days.',
    ],
    correctIndex: 1,
    explanation: 'Temporary/periodic shutdowns for inventory or repairs do NOT excuse the employer from paying regular holidays; only cessation due to business reverses authorized by the DOLE Secretary suspends holiday pay.',
    legalBasis: 'Sec. 7, Rule IV, Book III, Omnibus Rules',
  },
  {
    id: 130,
    world: 'Bowser Keep • Monthly-Paid Holiday',
    worldCode: 'holidays',
    scenario:
      'A monthly-paid employee whose monthly salary uses a 365-day factor does NOT work on Labor Day (May 1). Does she receive an extra 100% on top of her monthly pay?',
    options: [
      'Yes, extra 100%.',
      'No extra pay if unworked, because a 365-day monthly factor ALREADY includes payment for all 12 unworked Regular Holidays and rest days (if she works on May 1, she gets an extra 100% to reach 200%)!',
      'Monthly employees are exempt from holidays.',
      'She gets 300%.',
    ],
    correctIndex: 1,
    explanation: 'Monthly-paid employees paid for all days of the year (365 factor) already have 100% of regular holidays built into their monthly salary; working on a regular holiday adds +100% (total 200%).',
    legalBasis: 'Insular Bank of Asia & America Employees’ Union v. Inciong',
  },
  // ================= WORLD 6: STATUTORY LEAVES & WELFARE (25 Questions) =================
  {
    id: 131,
    world: 'World 6: Statutory Leaves',
    worldCode: 'w6',
    scenario:
      'Pedro has completed 12 months of service with Bowser Mining. He has not taken any leave during the year. How many days of Service Incentive Leave (SIL) is he entitled to, and what happens if unused by year end?',
    options: [
      '5 days; if unused, it is forfeited to company operational funds.',
      '5 days; unused SIL must be converted to cash at the end of the year based on his salary rate at conversion.',
      '15 days; convertible to cash only upon resignation.',
      '10 days; half converted to cash and half carried over.',
    ],
    correctIndex: 1,
    explanation:
      'Every employee who has rendered at least 1 year of service is entitled to 5 days yearly SIL with pay, and unused SIL at year-end must be converted to cash.',
    legalBasis: 'Article 95, Labor Code & Implementing Rules',
  },
  {
    id: 132,
    world: 'World 6: Statutory Leaves',
    worldCode: 'w6',
    scenario:
      'Toad Bakery regularly employs only eight (8) bakers and staff. Toad demands 5 days of paid SIL from the owner. Is the bakery legally required to grant it?',
    options: [
      'Yes, SIL is mandatory for all private employers regardless of size.',
      'No, establishments regularly employing fewer than ten (10) employees are legally exempt from the mandatory grant of SIL.',
      'Yes, provided Toad has worked there for 3 years.',
      'Only 3 days of SIL are required for small bakeries.',
    ],
    correctIndex: 1,
    explanation:
      'Establishments with less than 10 employees, as shown by evidence, are not legally bound to give the five days of SIL unless obliged by contract, policy, or practice.',
    legalBasis: 'Article 95(b), Labor Code',
  },
  {
    id: 133,
    world: 'World 6: Statutory Leaves',
    worldCode: 'w6',
    scenario:
      'An employer already provides all employees with seven (7) days of paid Vacation Leave (VL) annually under company policy. Can an employee demand an additional five (5) days of SIL under Art. 95?',
    options: [
      'Yes, SIL is statutory while VL is voluntary.',
      'No, employees already enjoying vacation leave with pay of at least five (5) days are excluded from the coverage of statutory SIL.',
      'Yes, but only 2 additional days.',
      'Only if the union files a formal grievance.',
    ],
    correctIndex: 1,
    explanation:
      'Those enjoying vacation leave with pay of at least five (5) days are explicitly excluded from SIL entitlement as the statutory purpose is already satisfied.',
    legalBasis: 'Article 95(b), Labor Code & Omnibus Rules',
  },
  {
    id: 134,
    world: 'World 6: Statutory Leaves',
    worldCode: 'w6',
    scenario:
      'Under R.A. 11210 (105-Day Expanded Maternity Leave Law), how many days of paid maternity leave are granted to covered female workers for live childbirth, regardless of civil status or legitimacy of the child?',
    options: [
      '60 days',
      '78 days',
      '105 days with full pay',
      '120 days standard',
    ],
    correctIndex: 2,
    explanation:
      'All covered female workers in government and private sectors, including informal economy, regardless of civil status or legitimacy, shall be granted 105 days maternity leave with full pay.',
    legalBasis: 'Section 3, Republic Act No. 11210',
  },
  {
    id: 135,
    world: 'World 6: Statutory Leaves',
    worldCode: 'w6',
    scenario:
      'Princess Peach experiences an unfortunate miscarriage at 4 months of pregnancy. How many days of paid maternity leave is she legally entitled to receive under R.A. 11210?',
    options: [
      '30 days with full pay.',
      '45 days with half pay.',
      '60 days maternity leave with full pay.',
      '105 days with full pay.',
    ],
    correctIndex: 2,
    explanation:
      'For cases of miscarriage or emergency termination of pregnancy, sixty (60) days maternity leave with full pay shall be granted.',
    legalBasis: 'Section 3, Republic Act No. 11210',
  },
  {
    id: 136,
    world: 'World 6: Statutory Leaves',
    worldCode: 'w6',
    scenario:
      'Daisy is a certified solo parent under R.A. 8972 / R.A. 11861 who gives birth to a baby girl. How many total days of paid maternity leave does she receive under R.A. 11210?',
    options: [
      '105 days',
      '115 days',
      '120 days (105 days standard + 15 days additional solo parent benefit)',
      '135 days',
    ],
    correctIndex: 2,
    explanation:
      'In case the female employee qualifies as a solo parent under R.A. 8972 / R.A. 11861, she shall be paid an additional maternity benefit of fifteen (15) days, totaling 120 days with full pay.',
    legalBasis: 'Section 3, Republic Act No. 11210',
  },
  {
    id: 137,
    world: 'World 6: Statutory Leaves',
    worldCode: 'w6',
    scenario:
      'Can an expectant mother choose to defer her 105-day maternity leave until 6 months after childbirth so she can use it during her child’s first birthday?',
    options: [
      'Yes, with employer consent.',
      'No. Enjoyment of maternity leave cannot be deferred; it must be availed of either before or after actual delivery in a continuous and uninterrupted manner.',
      'Yes, under the Civil Code freedom of contract.',
      'Only the postnatal 60 days can be deferred.',
    ],
    correctIndex: 1,
    explanation:
      'Enjoyment of maternity leave cannot be deferred but should be availed of either before or after the actual period of delivery in a continuous and uninterrupted manner.',
    legalBasis: 'Section 3, R.A. 11210 & IRR Section 5',
  },
  {
    id: 138,
    world: 'World 6: Statutory Leaves',
    worldCode: 'w6',
    scenario:
      'A female worker giving birth wishes to allocate a portion of her 105-day maternity leave benefits to the child’s father. How many days may she allocate, and does the law require that they be legally married?',
    options: [
      'Up to 15 days, but only if legally married.',
      'Up to 7 days of said benefits to the child’s father, whether or not the same is married to the female worker.',
      'Up to 30 days upon mutual agreement.',
      'Zero days; leave is strictly non-transferable.',
    ],
    correctIndex: 1,
    explanation:
      'Any female worker entitled to maternity leave may, at her option, allocate up to seven (7) days of said benefits to the child’s father, whether or not married to the female worker.',
    legalBasis: 'Section 6, Republic Act No. 11210',
  },
  {
    id: 139,
    world: 'World 6: Statutory Leaves',
    worldCode: 'w6',
    scenario:
      'If the father of the child is absent, deceased, or incapacitated, to whom may the mother allocate her 7 days of maternity leave benefits?',
    options: [
      'Only to an SSS accredited social worker.',
      'To an alternate caregiver who may be a relative within the 4th degree of consanguinity or current partner sharing the same household.',
      'The 7 days are permanently forfeited.',
      'To her department supervisor.',
    ],
    correctIndex: 1,
    explanation:
      'In the death, absence, or incapacity of the father, the benefit may be allocated to an alternate caregiver: a relative within the 4th degree of consanguinity or current partner sharing the same household.',
    legalBasis: 'Section 6, Republic Act No. 11210',
  },
  {
    id: 140,
    world: 'World 6: Statutory Leaves',
    worldCode: 'w6',
    scenario:
      'A female worker was terminated from employment due to authorized retrenchment. Ten (10) calendar days after termination, she gave birth. Is she still entitled to maternity leave with full pay from her employer?',
    options: [
      'No, because employment relationship already ended.',
      'Yes, maternity leave with full pay shall be granted even if childbirth occurs not more than 15 calendar days after termination of service, as her right thereto has already accrued.',
      'Only 50% from the previous employer and 50% from SSS.',
      'Only if she had filed notice 6 months earlier.',
    ],
    correctIndex: 1,
    explanation:
      'Maternity leave with full pay shall be granted even if childbirth/miscarriage occurs not more than fifteen (15) calendar days after termination of service, as her right has already accrued.',
    legalBasis: 'Section 10, Republic Act No. 11210',
  },
  {
    id: 141,
    world: 'World 6: Statutory Leaves',
    worldCode: 'w6',
    scenario:
      'An employer illegally terminates a pregnant employee without just cause to evade maternity payments. What is the employer required to pay regarding maternity leave?',
    options: [
      'Nothing; SSS will absorb the entire liability.',
      'Full salary for 105 days for childbirth (or 60 days for miscarriage) based on her full pay, plus other applicable daily cash benefits, as if employment was not illegally terminated.',
      'Double the 13th month pay only.',
      'A flat penalty of ₱10,000 to DOLE.',
    ],
    correctIndex: 1,
    explanation:
      'When employment is terminated without just cause, the 15-day limit does not apply and the employer must pay the full salary for 105 days (or 60 days for miscarriage) based on full pay plus daily cash benefits.',
    legalBasis: 'Section 10, Republic Act No. 11210',
  },
  {
    id: 142,
    world: 'World 6: Statutory Leaves',
    worldCode: 'w6',
    scenario:
      'Mario is legally married to Peach and cohabiting with her. Peach gives birth to their 5th child. Can Mario claim 7 days of statutory Paternity Leave under R.A. 8187?',
    options: [
      'Yes, paternity leave applies to all deliveries without limit.',
      'No. Statutory paternity leave under R.A. 8187 applies only to the first four (4) deliveries of the legitimate spouse with whom he is cohabiting.',
      'Yes, but with 50% pay deduction.',
      'Yes, provided he obtains a DOLE waiver.',
    ],
    correctIndex: 1,
    explanation:
      'Every married male employee is entitled to paternity leave of 7 days with full pay for the first four (4) deliveries of his legitimate cohabiting spouse.',
    legalBasis: 'Section 2, Republic Act No. 8187',
  },
  {
    id: 143,
    world: 'World 6: Statutory Leaves',
    worldCode: 'w6',
    scenario:
      'Luigi lives with his live-in common-law partner of 8 years who gives birth to their child. Luigi applies for Paternity Leave under R.A. 8187. Does he qualify?',
    options: [
      'Yes, common-law partnerships are fully recognized for paternity leave.',
      'No. A mandatory condition for entitlement under R.A. 8187 is that he is legally married to the pregnant woman (legitimate spouse).',
      'Yes, if they have at least 2 children.',
      'Yes, under the Magna Carta for Men.',
    ],
    correctIndex: 1,
    explanation:
      'R.A. 8187 expressly requires that the male employee is married to the spouse giving birth. (Note: He could receive up to 7 days allocated from the mother under R.A. 11210, but cannot claim R.A. 8187 paternity leave).',
    legalBasis: 'Section 2 & 3, Republic Act No. 8187',
  },
  {
    id: 144,
    world: 'World 6: Statutory Leaves',
    worldCode: 'w6',
    scenario:
      'A male employee fails to avail of his 7-day paternity leave after his wife’s delivery. At the end of the calendar year, he demands that the company convert the 7 unused paternity days to cash. Is his claim valid?',
    options: [
      'Yes, all unused statutory leaves are convertible to cash.',
      'No, paternity leave is non-cumulative and strictly non-convertible to cash if unavailed.',
      'Yes, if backed by an affidavit of cohabitation.',
      'Only 50% cash conversion is allowed.',
    ],
    correctIndex: 1,
    explanation:
      'Paternity leave cannot be commuted to cash and is not cumulative; if not availed of within the delivery period, it is forfeited.',
    legalBasis: 'R.A. 8187 Implementing Rules, Sec. 7',
  },
  {
    id: 145,
    world: 'World 6: Statutory Leaves',
    worldCode: 'w6',
    scenario:
      'How many working days of paid parental leave are granted to qualified Solo Parent employees every year under R.A. 8972 / R.A. 11861, and what service duration is required?',
    options: [
      '5 working days with pay; 1 year of service required.',
      '7 working days with pay; service of at least six (6) months required.',
      '10 working days with pay; 2 years of service required.',
      '15 working days with pay; immediate from Day 1.',
    ],
    correctIndex: 1,
    explanation:
      'A forfeitable and noncumulative parental leave of not more than seven (7) working days with pay every year shall be granted to any solo parent employee who has rendered service of at least 6 months.',
    legalBasis: 'Section 8, R.A. 8972 as amended by R.A. 11861',
  },
  {
    id: 146,
    world: 'World 6: Statutory Leaves',
    worldCode: 'w6',
    scenario:
      'Under the Expanded Solo Parents Welfare Act (R.A. 11861), which of the following is considered a qualified Solo Parent?',
    options: [
      'A mother whose spouse has been detained for criminal conviction or awaiting trial for at least three (3) months.',
      'An unmarried mother or father who keeps and rears the child.',
      'A parent whose spouse abandoned the family for at least six (6) months.',
      'All of the above are recognized solo parents under the law.',
    ],
    correctIndex: 3,
    explanation:
      'The Expanded Solo Parents Welfare Act recognizes detention of spouse for at least 3 months, abandonment for at least 6 months, and unmarried parents rearing children as solo parents.',
    legalBasis: 'Section 3, Republic Act No. 11861',
  },
  {
    id: 147,
    world: 'World 6: Statutory Leaves',
    worldCode: 'w6',
    scenario:
      'A low-skilled OFW father has been working abroad in the Middle East for 14 continuous months. Does his spouse in the Philippines qualify as a Solo Parent for welfare benefits?',
    options: [
      'No, because the husband is still alive and earning.',
      'Yes, the spouse of a low/semi-skilled OFW who is away from the Philippines for an uninterrupted period of twelve (12) months qualifies as a solo parent.',
      'Only if the OFW ceases sending remittances.',
      'Only if the wife is also unemployed.',
    ],
    correctIndex: 1,
    explanation:
      'Under R.A. 11861, the spouse or family member/guardian of a low/semi-skilled OFW away for an uninterrupted period of 12 months is explicitly categorized as a solo parent.',
    legalBasis: 'Section 3(b), Republic Act No. 11861',
  },
  {
    id: 148,
    world: 'World 6: Statutory Leaves',
    worldCode: 'w6',
    scenario:
      'An unwed mother rearing her 4-year-old child receives occasional birthday gifts and seasonal Christmas gifts from the child’s biological father, but no regular support. Does she lose her Solo Parent status?',
    options: [
      'Yes, any gift from the other parent terminates solo parent status.',
      'No. A solo parent does NOT lose status if the other parent provides occasional assistance or seasonal gifts that do not meet the legal requirement of support under the Family Code.',
      'She is suspended for 6 months.',
      'Only if the gifts exceed ₱5,000.',
    ],
    correctIndex: 1,
    explanation:
      'Occasional assistance and seasonal gifts that do not meet the legal standard of formal support under the Family Code do not disqualify the parent from solo parent status.',
    legalBasis: 'Section 5, R.A. 11861 IRR',
  },
  {
    id: 149,
    world: 'World 6: Statutory Leaves',
    worldCode: 'w6',
    scenario:
      'Under R.A. 11861, up to what age are dependent children covered for a solo parent to claim statutory benefits and educational scholarships?',
    options: [
      '18 years old only.',
      '21 years old.',
      'Twenty-two (22) years of age or below (dependent, unmarried, and unemployed).',
      '25 years old.',
    ],
    correctIndex: 2,
    explanation:
      'R.A. 11861 raised the age threshold of dependent children to twenty-two (22) years of age or below, provided they are unmarried and unemployed.',
    legalBasis: 'Section 3, Republic Act No. 11861',
  },
  {
    id: 150,
    world: 'World 6: Statutory Leaves',
    worldCode: 'w6',
    scenario:
      'Under the Magna Carta of Women (R.A. 9710), a female worker who undergoes surgical operation for a gynecological disorder is entitled to Special Leave. What are the service and duration requirements?',
    options: [
      '1 year service; 1 month leave with half pay.',
      'At least six (6) months continuous aggregate service in the last 12 months; special leave of up to two (2) months with full pay based on gross monthly compensation.',
      '3 months service; 15 days leave with pay.',
      '6 months service; 105 days leave with pay.',
    ],
    correctIndex: 1,
    explanation:
      'A woman employee who has rendered at least 6 months continuous aggregate service in the last 12 months is entitled to 2 months special leave with full pay based on gross monthly compensation following surgery caused by gynecological disorders.',
    legalBasis: 'Section 18, Republic Act No. 9710',
  },
  {
    id: 151,
    world: 'World 6: Statutory Leaves',
    worldCode: 'w6',
    scenario:
      'A female employee undergoes non-surgical hormonal therapy and outpatient checkups for ovarian cysts. Does she qualify for the 2-month Magna Carta Gynecological Leave?',
    options: [
      'Yes, any gynecological condition entitles the employee to 2 months leave.',
      'No. The special leave under R.A. 9710 strictly requires surgical procedures caused by gynecological disorders; non-surgical medical management does not qualify.',
      'Yes, if she has 5 years of service.',
      'She receives 1 month only.',
    ],
    correctIndex: 1,
    explanation:
      'The law explicitly requires that the leave follows surgery caused by gynecological disorders requiring surgical procedures.',
    legalBasis: 'Section 18, R.A. 9710 & DOLE Guidelines',
  },
  {
    id: 152,
    world: 'World 6: Statutory Leaves',
    worldCode: 'w6',
    scenario:
      'Under the Anti-Violence Against Women and Their Children Act (R.A. 9262), how many days of paid leave are granted to female victims of VAWC, and can it be extended?',
    options: [
      '5 days, non-extendible.',
      'Up to ten (10) days with pay, extendible when necessity arises as specified in the protection order (BPO, TPO, or PPO).',
      '15 days with half pay.',
      '30 days with full pay.',
    ],
    correctIndex: 1,
    explanation:
      'VAWC victims are entitled to take a paid leave of absence up to 10 days in addition to other paid leaves, extendible when the necessity arises as specified in the protection order.',
    legalBasis: 'Section 43, Republic Act No. 9262',
  },
  {
    id: 153,
    world: 'World 6: Statutory Leaves',
    worldCode: 'w6',
    scenario:
      'An employer refuses to grant VAWC leave to an employee who presented a Barangay Protection Order (BPO), claiming "it is purely a private domestic issue." Is the employer liable?',
    options: [
      'No, the employer has management prerogative over attendance.',
      'Yes! Employer prejudice or refusal to honor VAWC leave is prohibited under R.A. 9262 and constitutes an actionable offense punishable by law.',
      'Only if the husband is also an employee of the firm.',
      'Only if the BPO was issued by a regional trial court.',
    ],
    correctIndex: 1,
    explanation:
      'Refusal to grant the 10-day paid leave or discriminating against an employee on account of being a VAWC victim is strictly prohibited and penalizes the employer.',
    legalBasis: 'Section 43, Republic Act No. 9262',
  },
  {
    id: 154,
    world: 'World 6: Statutory Leaves',
    worldCode: 'w6',
    scenario:
      'What is the prescriptive period for an employee to claim unpaid cash conversion of accumulated Service Incentive Leave (SIL)?',
    options: [
      'Strictly 1 year from the end of the calendar year.',
      'The 3-year prescriptive period under Art. 306 begins to run only from the time the employer refuses to pay upon demand, or upon separation of the employee from employment.',
      '10 years under the Civil Code on written contracts.',
      'Never prescribes.',
    ],
    correctIndex: 1,
    explanation:
      'In Auto Bus Transport Systems v. Bautista, the Supreme Court ruled that the 3-year prescriptive period for SIL conversion begins only upon termination of employment or upon refusal of the employer upon demand.',
    legalBasis: 'Auto Bus Transport Systems v. Bautista, G.R. No. 156367',
  },
  {
    id: 155,
    world: 'World 6: Statutory Leaves',
    worldCode: 'w6',
    scenario:
      'Are government employees in the civil service and military personnel entitled to the statutory Service Incentive Leave under Article 95 of the Labor Code?',
    options: [
      'Yes, all Philippine workers are covered by Article 95.',
      'No, government employees and those governed by Civil Service rules are excluded from Title I, Book III of the Labor Code, having their own distinct Civil Service leave system.',
      'Only contractual government employees.',
      'Only local government unit (LGU) employees.',
    ],
    correctIndex: 1,
    explanation:
      'Government employees are excluded from the Labor Code provisions on hours of work and SIL under Article 82 and Article 95, as they are governed by Civil Service laws.',
    legalBasis: 'Article 82 & 95, Labor Code',
  },
];
