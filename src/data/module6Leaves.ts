import { LawTopic } from '../types/laborLaw';

export const MODULE_6_LEAVES: LawTopic[] = [
  {
    id: 'm6-service-incentive-leave',
    worldId: 'world6',
    title: 'Service Incentive Leave (SIL)',
    badge: 'Art. 95 Labor Code',
    iconName: 'Super Mushroom',
    summary:
      'Statutory minimum 5 days paid leave per year for employees with at least 1 year of service. Vacation Leave (VL) and Sick Leave (SL) are voluntary employer grants or CBA benefits.',
    beginnerSummary:
      'After working 1 year, you are entitled to at least 5 days of paid leave each year. If unused by year-end, it must be converted into cash!',
    keyDoctrines: [
      'Every employee who has rendered at least one (1) year of service shall be entitled to a yearly service incentive leave of five (5) days with pay.',
      'The law requires only the grant of Service Incentive Leave (SIL). The grant of vacation leave (VL) or sick leave (SL) depends on voluntary employer policy or collective bargaining agreement (CBA).',
      'Establishments regularly employing fewer than ten (10) employees are exempt from the mandatory grant of SIL.',
      'Unused SIL at the end of the year must be converted to cash by the employer.',
    ],
    rules: [
      {
        heading: 'Mandatory Coverage & Entitlement (Art. 95)',
        items: [
          'Service Requirement: At least one (1) year of service (continuous or broken service totaling 12 months).',
          'Duration & Pay: Yearly service incentive leave of five (5) days with full regular pay.',
          'Commutation to Cash: Unused SIL at the end of the year should be converted to cash based on the salary rate at the time of conversion.',
          'Distinction: Labor law mandates only SIL. Vacation Leave (VL) or Sick Leave (SL) are not mandatory under the Labor Code, but arise from voluntary company policy, employment contracts, or CBA.',
        ],
      },
      {
        heading: 'Employees Excluded from SIL Coverage',
        description:
          'Under Art. 95(b) and Omnibus Rules, SIL does not apply to the following employees:',
        items: [
          '1. Those who are already enjoying the benefit (SIL or its equivalent).',
          '2. Those enjoying vacation leave with pay of at least five (5) days.',
          '3. Those employed in establishments regularly employing fewer than ten (10) employees.',
          '4. Government employees and those of government-owned and controlled corporations with original charters.',
          '5. Persons in the personal service of another (unless governed by special laws like Batas Kasambahay).',
          '6. Managerial employees and officers/members of managerial staff.',
          '7. Field personnel and other employees whose performance is unsupervised by the employer.',
        ],
      },
      {
        heading: 'Cash Conversion Formula & Prescription',
        items: [
          'Unused SIL at year-end must be commuted to cash: Daily Rate × Number of Unused Days.',
          'Upon separation or termination of employment, all accumulated unused SIL credits must be converted to cash regardless of reason for separation.',
          'Prescriptive period: The 3-year prescriptive period under Art. 306 begins to run only from the time the employer refuses to pay upon demand or upon separation of the employee.',
        ],
      },
    ],
    barTips: [
      'Bar Tip: If an employer grants 5 days of paid Vacation Leave (VL), the statutory SIL requirement is already satisfied and the employee cannot claim an additional 5 days SIL.',
      'Bar Tip: The 10-employee exemption requires that the establishment REGULARLY employs fewer than 10 workers.',
    ],
  },
  {
    id: 'm6-maternity-leave',
    worldId: 'world6',
    title: '105-Day Expanded Maternity Leave',
    badge: 'R.A. No. 11210',
    iconName: 'Princess Peach Crown',
    summary:
      '105 days paid maternity leave for live childbirth (regardless of civil status or legitimacy), extendible by 30 days without pay, +15 days for solo parents. 60 days paid leave for miscarriage or emergency termination.',
    beginnerSummary:
      'Female workers receive 105 days of full pay for childbirth and can share 7 days with the father or caregiver! Solo mothers get an extra 15 days (total 120 days).',
    keyDoctrines: [
      'All covered female workers in government and the private sector, including those in the informal economy, regardless of civil status or the legitimacy of her child, shall be granted 105 days maternity leave with full pay.',
      'Option to extend for an additional thirty (30) days without pay, provided written notice is given to the employer at least 45 days before the end of the leave.',
      'Enjoyment of maternity leave cannot be deferred; it must be availed of either before or after actual delivery in a continuous and uninterrupted manner.',
      'Granted in EVERY instance of pregnancy, miscarriage, or emergency termination of pregnancy, regardless of frequency.',
      'Miscarriage or emergency termination of pregnancy entitles the female worker to sixty (60) days maternity leave with full pay.',
      'Solo parent qualification entitles the female employee to an additional fifteen (15) days maternity leave with full pay (total of 120 days).',
    ],
    rules: [
      {
        heading: 'Maternity Leave Duration & Credits',
        items: [
          'Live Childbirth: One hundred five (105) days with full pay.',
          'Miscarriage or Emergency Termination of Pregnancy (ETP): Sixty (60) days with full pay.',
          'Solo Parent Mother: Additional fifteen (15) days paid leave (Total: 120 days for live childbirth).',
          'Unpaid Extension: Option to extend for up to thirty (30) additional days without pay.',
          'Crediting: Can be credited as combinations of prenatal and postnatal leave as long as it does not exceed 105 days, and provided compulsory postnatal leave shall not be less than sixty (60) days.',
          'Continuous Availment: Must be availed of in a continuous and uninterrupted manner; enjoyment cannot be deferred.',
        ],
      },
      {
        heading: 'Notice Requirements & Public/Private Sector Rules',
        items: [
          'Private Sector: Female worker notifies employer of pregnancy and expected date of delivery.',
          'Public Sector Notice: Head of agency shall be given due notice in writing at least forty-five (45) days before the end of maternity leave (for the 30-day unpaid extension).',
          'Medical Emergency: No prior notice shall be necessary in the event of a medical emergency, but subsequent notice shall be given to the head of the agency.',
        ],
      },
      {
        heading: 'Allocation of Maternity Leave Credits (7 Days)',
        items: [
          'Allocation to Father: Any female worker entitled to maternity leave benefits may, at her option, allocate up to seven (7) days of said benefits to the child’s father, whether or not married to the female worker.',
          'Alternate Caregiver: In the death, absence, or incapacity of the father, the 7-day benefit may be allocated to an alternate caregiver who may be a relative within the 4th degree of consanguinity or current partner sharing the same household.',
          'Election by Mother: Allocation is made upon the election of the mother, taking into account the best interests of the child.',
        ],
      },
      {
        heading: 'Childbirth or Miscarriage After Termination of Service',
        items: [
          '15-Day Rule: Maternity leave with full pay shall be granted even if childbirth, miscarriage, or emergency termination occurs not more than fifteen (15) calendar days after the termination of employee’s service, as her right thereto has already accrued.',
          'Termination Without Just Cause: The 15-day limitation is NOT applicable if the pregnant worker was dismissed without just cause; the employer must pay the full salary for 105 days (or 60 days for miscarriage) plus applicable daily cash benefits as if employment was not illegally terminated.',
        ],
      },
    ],
    barTips: [
      'Bar Tip: Under R.A. 11210, maternity leave applies to EVERY pregnancy regardless of frequency! The old 4-delivery cap under the previous law has been completely repealed.',
      'Bar Tip: The 7 days allocated to the father from the mother’s 105 days is OVER AND ABOVE the father’s own 7-day paternity leave under R.A. 8187!',
    ],
  },
  {
    id: 'm6-paternity-leave',
    worldId: 'world6',
    title: 'Paternity Leave Act of 1996',
    badge: 'R.A. No. 8187',
    iconName: 'Fire Flower',
    summary:
      '7 days paid leave for married male employees in private and public sectors for the first 4 deliveries of his legitimate cohabiting spouse.',
    beginnerSummary:
      'Married working fathers get 7 days of paid leave to care for their wife and newborn for each of the first 4 deliveries or miscarriages.',
    keyDoctrines: [
      'Every married male employee in the private and public sectors shall be entitled to a paternity leave of seven (7) days with full pay for the first four (4) deliveries of the legitimate spouse with whom he is cohabiting.',
      'Delivery includes childbirth or any miscarriage.',
      'Usage of the leave shall be after the delivery, without prejudice to an employer’s policy of allowing availment before or during delivery.',
      'Notification: Male employee applying for paternity leave shall notify his employer of his spouse’s pregnancy and expected delivery date within a reasonable period.',
    ],
    rules: [
      {
        heading: '5 Mandatory Conditions for Entitlement',
        description: 'Under R.A. 8187, the male worker must satisfy all 5 statutory conditions:',
        items: [
          '1. He is married to the pregnant woman (legitimate spouse).',
          '2. He is an employee at the time of the delivery of his child.',
          '3. He is cohabiting with his spouse at the time she gives birth or suffers a miscarriage (living together under one roof, or temporary separation due to employment).',
          '4. He has applied for paternity leave with his employer within a reasonable period from expected date of delivery, or per company rules.',
          '5. His wife has given birth or suffered a miscarriage.',
        ],
      },
      {
        heading: 'Scope & Forfeiture Rules',
        items: [
          'Cap: Limited to the first four (4) deliveries (including miscarriages).',
          'Full Pay: Consists of basic salary plus mandatory allowances.',
          'Non-commutable: Paternity leave is non-cumulative and not convertible to cash if unavailed by the employee.',
        ],
      },
    ],
    barTips: [
      'Bar Tip: Paternity leave strictly requires marriage and cohabitation. An unmarried father cannot claim paternity leave under R.A. 8187 (though he can receive up to 7 days allocated from the mother under R.A. 11210).',
    ],
  },
  {
    id: 'm6-solo-parents-leave',
    worldId: 'world6',
    title: 'Solo Parents Parental Leave & Expanded Welfare',
    badge: 'R.A. No. 8972 & R.A. No. 11861',
    iconName: 'Super Star',
    summary:
      '7 working days paid parental leave per year for solo parent employees with at least 6 months service. Extensive protective criteria, anti-discrimination, telecommuting, and educational scholarships.',
    beginnerSummary:
      'Solo parents with 6 months of service get 7 paid days off each year to attend to their children, plus protected flexible work arrangements and educational support.',
    keyDoctrines: [
      'A forfeitable and noncumulative parental leave of not more than seven (7) working days with pay every year shall be granted to any solo parent employee, regardless of employment status, who has rendered service of at least six (6) months.',
      'Applies to solo parent employees in both government and private sectors.',
      'No employer shall discriminate against any solo parent employee with respect to terms and conditions of employment on account of his or her status.',
      'Employers may enter into agreements with solo parent employees for telecommuting programs.',
      'DepEd, CHED, and TESDA shall provide scholarship programs for solo parents and a full scholarship for one (1) child of a solo parent in institutions of basic, higher, and tech-voc education.',
    ],
    rules: [
      {
        heading: 'Statutory Definition: Who are Considered Solo Parents',
        description: 'Under the Expanded Solo Parents Welfare Act, solo parents include:',
        items: [
          'Category 1: A parent providing sole parental care and support due to: (a) Birth as consequence of rape, even without final conviction; (b) Death of spouse; (c) Detention of spouse for at least three (3) months or serving sentence for criminal conviction; (d) Physical or mental incapacity of spouse certified by medical practitioner; (e) Legal separation or de facto separation for at least six (6) months, entrusted with sole care; (f) Declaration of nullity or annulment of marriage, or divorce recognized by law, with sole care; (g) Abandonment by spouse for at least six (6) months.',
          'Category 2: Spouse or family member/guardian of child of an Overseas Filipino Worker (OFW) belonging to low/semi-skilled category away from the Philippines for an uninterrupted period of twelve (12) months.',
          'Category 3: Unmarried mother or father who keeps and rears the child or children.',
          'Category 4: Any legal guardian, adoptive, or foster parent who solely provides parental care and support to a child or children.',
          'Category 5: Relative within fourth (4th) civil degree of consanguinity or affinity assuming care due to death, abandonment, disappearance, or absence of parents for at least 6 months; or solo senior citizen grandparents with sole care over grandchildren unmarried/unemployed and 22 years old or below (or unable to care for themselves due to disability).',
          'Category 6: A pregnant woman who provides sole parental care and support to the unborn child or children.',
        ],
      },
      {
        heading: 'Limitation & Termination of Benefits',
        items: [
          'Sole Care Requirement: Only a solo parent exercising sole parental care and support of the child or children is entitled to claim the benefits.',
          'Seasonal Gifts Rule: A solo parent shall NOT lose status if the other parent provides occasional assistance and/or seasonal gifts that do not meet the legal requirement of regular support under the Family Code.',
          'Absence of Marriage: The absence of a valid marriage between mother and father does NOT automatically entitle either to solo parent benefits if factual circumstances demonstrate that parental care and support are shared.',
          'Change of Circumstances: When a solo parent ceases to be such due to change of status/circumstances (e.g., remarriage, cohabitation, shared custody), eligibility for benefits immediately terminates.',
        ],
      },
      {
        heading: 'Educational & Telecommuting Privileges',
        items: [
          'Scholarship: Full scholarship for one (1) dependent child in basic, higher, or tech-voc education through DepEd, CHED, or TESDA.',
          'Child Eligibility: Children must be dependent on the solo parent for support, unmarried, unemployed, and twenty-two (22) years of age or below.',
          'Priority: Other children given priority in government education programs.',
          'Workplace Telecommuting: Flexible working schedule and telecommuting agreements encouraged without reduction in benefits.',
        ],
      },
    ],
    barTips: [
      'Bar Tip: Solo parent leave requires at least six (6) months of service. It is non-cumulative and cannot be converted to cash if unused at year end.',
      'Bar Tip: Under R.A. 11861, the qualifying age limit for dependent children has been raised to twenty-two (22) years old or below (unmarried and unemployed).',
    ],
  },
  {
    id: 'm6-gynecological-leave',
    worldId: 'world6',
    title: 'Special Leave for Women (Gynecological Surgery)',
    badge: 'R.A. No. 9710 (Magna Carta of Women)',
    iconName: '1-Up Mushroom',
    summary:
      '2 months special leave with full pay based on gross monthly compensation following surgery caused by gynecological disorders for female workers with at least 6 months service in the last 12 months.',
    beginnerSummary:
      'Female workers who undergo surgical operations for gynecological disorders are entitled to up to 2 months of leave with full pay.',
    keyDoctrines: [
      'A woman employee having rendered continuous aggregate employment service of at least six (6) months for the last twelve (12) months shall be entitled to a special leave benefit of two (2) months with full pay based on her gross monthly compensation following surgery caused by gynecological disorders.',
      'Gynecological disorders refer to disorders involving the female reproductive organs which require surgical procedures such as myomectomy, hysterectomy, ovariectomy, and surgical operations on vagina, cervix, uterus, fallopian tubes, and ovaries.',
      'Gross monthly compensation includes basic pay plus mandatory allowances.',
    ],
    rules: [
      {
        heading: 'Eligibility Criteria & Application',
        items: [
          'Service Requirement: Continuous aggregate service of at least six (6) months for the last twelve (12) months prior to the surgery.',
          'Medical Requirement: Surgical operation certified by an attending physician caused by gynecological disorder.',
          'Leave Duration: Up to two (2) months (around 60 calendar days) based on the physician’s recuperation recommendation.',
          'Full Pay: Compensation is based on gross monthly compensation (not just basic minimum wage).',
        ],
      },
      {
        heading: 'Non-Commutation & Relationship with Other Leaves',
        items: [
          'This special leave is non-cumulative and non-convertible to cash.',
          'Can be availed of in addition to other statutory leaves (such as SIL or VL/SL).',
          'Notice must be given to employer within a reasonable time prior to planned surgery, except in emergency procedures.',
        ],
      },
    ],
    barTips: [
      'Bar Tip: Gynecological leave requires SURGERY. Minor medical treatments or consultations without surgical intervention do not qualify for the 2-month Magna Carta leave.',
    ],
  },
  {
    id: 'm6-vawc-leave',
    worldId: 'world6',
    title: 'VAWC Leave (Anti-Violence Against Women & Children)',
    badge: 'R.A. No. 9262',
    iconName: 'Star Power Shield',
    summary:
      'Up to 10 days paid leave for female victims of physical, sexual, psychological, or economic violence, extendible per protection order (BPO, TPO, PPO).',
    beginnerSummary:
      'Victims of domestic or intimate violence are granted up to 10 days paid leave from work to seek medical, legal, or protective assistance.',
    keyDoctrines: [
      'VAWC victims shall be entitled to take a paid leave of absence up to ten (10) days in addition to other paid leaves under the Labor Code and Civil Service Rules and Regulations, extendible when the necessity arises as specified in the protection order.',
      'The leave allows the woman employee to attend to medical and legal concerns arising from violence.',
      'Availment requires certification from the Punong Barangay, Kagawad, Prosecutor, or Clerk of Court that an action relative to VAWC has been filed.',
    ],
    rules: [
      {
        heading: 'Entitlement & Duration',
        items: [
          'Paid Duration: Up to ten (10) days with full pay (basic wage + mandatory allowances).',
          'Extension: Extendible beyond 10 days when necessity arises as specified in a Barangay Protection Order (BPO), Temporary Protection Order (TPO), or Permanent Protection Order (PPO).',
          'Additionality: Granted IN ADDITION to other paid leaves under the Labor Code and Civil Service rules.',
          'Non-cumulative: Unused days are non-convertible to cash and non-cumulative.',
        ],
      },
      {
        heading: 'Anti-Prejudice & Anti-Retaliation Protection',
        items: [
          'Employer is strictly prohibited from terminating or prejudicing the employee on account of her status as a victim of VAWC or for taking VAWC leave.',
          'Violation constitutes an act of discrimination and punishable under R.A. 9262.',
        ],
      },
    ],
    barTips: [
      'Bar Tip: Under R.A. 9262, the 10 days paid leave is granted to the victim woman employee; intoxication or drugs on the part of the offender is NEVER an admissible defense!',
    ],
  },
];
