/* ==========================================================================
   RAIDERS SPORTS ACADEMY – DEMO DATA & STATE STORE
   NOTE: All authentication, enrollment, attendance, and payment data below
   is seeded DEMO DATA stored in localStorage for frontend demonstration.
   Future backend API endpoints can replace the localStorage adapters cleanly.
   ========================================================================== */

window.RSA_DATA = (function () {
  const STORAGE_KEYS = {
    THEME: 'rsa_theme_pref',
    DIR: 'rsa_dir_pref',
    SESSION: 'rsa_demo_session',
    PLAYERS: 'rsa_demo_players',
    ENROLLMENTS: 'rsa_demo_enrollments',
    TOURNAMENT_REGS: 'rsa_demo_tournament_regs',
    NOTIFICATIONS: 'rsa_demo_notifications',
    PAYMENTS: 'rsa_demo_payments',
    CONTACTS: 'rsa_demo_contacts'
  };

  const PROGRAMS = [
    {
      id: 'prog-kabaddi-beg',
      name: 'Kabaddi Beginner Program',
      sport: 'Kabaddi',
      level: 'Beginner',
      ageGroup: 'U-14',
      ageLabel: '10 - 14 Years',
      timing: 'Morning',
      schedule: 'Mon, Wed, Fri • 06:00 AM - 07:30 AM (Demo Schedule)',
      duration: '12 Weeks',
      fee: 4500,
      coach: 'Coach Virendra Thakur',
      image: 'assets/images/kabaddi-india-1.jpg',
      summary: 'Master foundational raiding footwork, stance balance, basic ankle-hold defense, and official AKFI rules.',
      highlights: [
        'Basic raiding skills & cant control',
        'Defensive techniques & stance balance',
        'Body balance & agility drills',
        'Rules and game fundamentals'
      ],
      batches: ['KBD-M1 (Mon/Wed/Fri 06:00 AM)', 'KBD-E1 (Tue/Thu/Sat 04:30 PM)']
    },
    {
      id: 'prog-kabaddi-adv',
      name: 'Kabaddi Advanced Program',
      sport: 'Kabaddi',
      level: 'Advanced',
      ageGroup: 'Senior',
      ageLabel: '16 - 24 Years',
      timing: 'Evening',
      schedule: 'Mon - Sat • 05:30 PM - 07:30 PM (Demo Schedule)',
      duration: '16 Weeks',
      fee: 7200,
      coach: 'Coach Virendra Thakur',
      image: 'assets/images/kabaddi-raiding.jpg',
      summary: 'High-tempo Pro-style raiding variations, chain & dash defensive combinations, and super-tackle match pressure.',
      highlights: [
        'Advanced raiding: Dubki, Toe-Touch & Lion Jump',
        'Defensive combinations: Chain & Corner Dash',
        'Do-or-Die raid team strategies',
        'Live mat match preparation'
      ],
      batches: ['KBD-ADV-E1 (Mon-Sat 05:30 PM)', 'KBD-PRO-M2 (Mon-Sat 06:00 AM)']
    },
    {
      id: 'prog-khokho-beg',
      name: 'Kho-Kho Beginner Program',
      sport: 'Kho-Kho',
      level: 'Beginner',
      ageGroup: 'U-14',
      ageLabel: '9 - 14 Years',
      timing: 'Evening',
      schedule: 'Tue, Thu, Sat • 04:30 PM - 06:00 PM (Demo Schedule)',
      duration: '12 Weeks',
      fee: 4200,
      coach: 'Coach Bindu Nair',
      image: 'assets/images/khokho-haryana.jpg',
      summary: 'Build explosive acceleration, clean sitting-block posture, single/double chain dodging, and crisp Kho delivery.',
      highlights: [
        'Running fundamentals & block starts',
        'Single & double chain dodging techniques',
        'Basic chasing skills & proper Kho hand-tag',
        'Spatial awareness & coordination'
      ],
      batches: ['KK-BEG-E1 (Tue/Thu/Sat 04:30 PM)', 'KK-BEG-M1 (Mon/Wed/Fri 06:30 AM)']
    },
    {
      id: 'prog-khokho-adv',
      name: 'Kho-Kho Advanced Program',
      sport: 'Kho-Kho',
      level: 'Advanced',
      ageGroup: 'U-19',
      ageLabel: '15 - 21 Years',
      timing: 'Morning',
      schedule: 'Mon - Sat • 06:00 AM - 08:00 AM (Demo Schedule)',
      duration: '16 Weeks',
      fee: 6800,
      coach: 'Coach Bindu Nair',
      image: 'assets/images/khokho-hero.jpg',
      summary: 'Master high-speed pole dives, sky-dives, ring-play evasion, and rapid tactical chasing transitions.',
      highlights: [
        'Advanced chasing & clean pole dives',
        'Tactical movement & ring defense evasion',
        'Explosive reaction speed & agility',
        'Competitive timed-turn match practice'
      ],
      batches: ['KK-ADV-M1 (Mon-Sat 06:00 AM)', 'KK-ADV-E2 (Mon-Sat 05:00 PM)']
    },
    {
      id: 'prog-fitness',
      name: 'Fitness & Conditioning',
      sport: 'Both Sports',
      level: 'Intermediate',
      ageGroup: 'U-19',
      ageLabel: '13 - 23 Years',
      timing: 'Weekend',
      schedule: 'Sat - Sun & Wed • 07:00 AM - 08:45 AM (Demo Schedule)',
      duration: '10 Weeks',
      fee: 3800,
      coach: 'Coach Sukhdev Pannu',
      image: 'assets/images/fitness-conditioning.jpg',
      summary: 'Sport-specific strength, anaerobic endurance, hamstring/ankle prehab, and sprint mechanics for mat & court athletes.',
      highlights: [
        'Compound strength & core power training',
        'Repeated-sprint endurance conditioning',
        'Joint mobility & dynamic flexibility',
        'ACL, ankle & shoulder injury prevention education'
      ],
      batches: ['FIT-WK1 (Wed/Sat/Sun 07:00 AM)', 'FIT-EV2 (Mon/Wed/Fri 06:30 PM)']
    },
    {
      id: 'prog-tournament',
      name: 'Tournament Preparation',
      sport: 'Both Sports',
      level: 'Competitive',
      ageGroup: 'Senior',
      ageLabel: '15 - 25 Years',
      timing: 'Evening',
      schedule: 'Mon - Sat • 06:00 PM - 08:15 PM (Demo Schedule)',
      duration: '8 Weeks',
      fee: 7900,
      coach: 'Coach Raghavendra Rao',
      image: 'assets/images/kabaddi-dive.jpg',
      summary: 'High-pressure match simulations, video tactical breakdown, referee-officiated scrimmages, and championship peaking.',
      highlights: [
        'Full-intensity match simulations',
        'Video tactical planning & opponent study',
        'Team communication & captaincy drills',
        'Competition readiness & recovery protocols'
      ],
      batches: ['TRN-PRO-E1 (Mon-Sat 06:00 PM)', 'TRN-ELITE-M1 (Mon-Sat 05:45 AM)']
    }
  ];

  const COACHES = [
    {
      id: 'coach-virendra',
      name: 'Coach Virendra Thakur',
      role: 'Head Kabaddi Coach',
      category: 'Kabaddi',
      experience: '16+ Years Coaching Experience (Demo Profile)',
      qualification: 'NIS Certified Kabaddi Coach • Former National Camp Tactician',
      background: 'Represented Services & Haryana State in Senior National Kabaddi Championships for 9 seasons before transitioning into high-performance coaching.',
      philosophy: 'Kabaddi is won in the mind half a second before the hand touches the defender. Breath control, footwork discipline, and fearless commitment define every Raider.',
      image: 'assets/images/coach-kabaddi.jpg',
      specialties: ['Raiding Mechanics', 'Corner & Cover Defense', 'Do-or-Die Raid Tactics']
    },
    {
      id: 'coach-bindu',
      name: 'Coach Bindu Nair',
      role: 'Head Kho-Kho Coach',
      category: 'Kho-Kho',
      experience: '13+ Years Coaching Experience (Demo Profile)',
      qualification: 'NSNIS Diploma in Kho-Kho & Track Speed • Federation Referee',
      background: 'Two-time Senior National Kho-Kho gold medalist known for pioneering ultra-fast pole-dive transitions and 3-2-3 ring defense patterns.',
      philosophy: 'In Kho-Kho, every fraction of a second counts. Sharp peripheral vision, silent anticipation, and fearless dives turn runners into unstoppable chasers.',
      image: 'assets/images/coach-khokho.jpg',
      specialties: ['Pole Dive Mastery', 'Zigzag Evasion', 'Speed & Reflex Conditioning']
    },
    {
      id: 'coach-raghav',
      name: 'Coach Raghavendra Rao',
      role: 'Assistant & Tactical Coach',
      category: 'Kabaddi & Kho-Kho',
      experience: '10+ Years Tactical Coaching (Demo Profile)',
      qualification: 'B.P.Ed., M.P.Ed. • Sports Video & Match Analytics Specialist',
      background: 'Former All-India Inter-University captain specializing in match video scouting, defensive formation switching, and junior-to-senior athlete progression.',
      philosophy: 'Data sharpens instinct. When young players understand why a chain breaks or why a dive misses, their progress accelerates threefold.',
      image: 'assets/images/coach-assistant-new.jpg',
      specialties: ['Video Analysis', 'Defensive Formations', 'Junior Talent Pathway']
    },
    {
      id: 'coach-sukhdev',
      name: 'Coach Sukhdev Pannu',
      role: 'Fitness & Conditioning Coach',
      category: 'Strength & Conditioning',
      experience: '14+ Years Athletic Performance (Demo Profile)',
      qualification: 'Certified Strength & Conditioning Specialist • Sports Rehab',
      background: 'Trained national medalists in track sprints and mat combat sports, designing injury-resilient athletic conditioning blocks for Indian youth athletes.',
      philosophy: 'Raw talent fades without durability. We build explosive hips, iron ankles, and repeatable stamina so our players dominate the final five minutes.',
      image: 'assets/images/coach-fitness.jpg',
      specialties: ['Explosive Sprint Power', 'Injury Prevention', 'Mat & Turf Conditioning']
    }
  ];

  const CHAMPIONS = [
    {
      name: 'Arjun Deshmukh (Demo Profile)',
      sport: 'Kabaddi',
      role: 'Lead Left Raider',
      achievement: 'State U-19 Gold Medalist & Best Raider',
      tournament: 'Maharashtra State Inter-District Championship 2026',
      image: 'assets/images/champ-kabaddi-1.jpg',
      stats: '148 Raid Points • 64% Strike Rate'
    },
    {
      name: 'Ananya Kulkarni (Demo Profile)',
      sport: 'Kho-Kho',
      role: 'Pole-Dive Chaser & Wazir',
      achievement: 'Junior National Silver Medalist',
      tournament: 'Sub-Junior & Junior National Kho-Kho Meet 2026',
      image: 'assets/images/champ-khokho-1.jpg',
      stats: '3.1s Avg Chase Tag • 18 Pole Dives'
    },
    {
      name: 'Vikramjeet Gill (Demo Profile)',
      sport: 'Kabaddi',
      role: 'Right Corner Defender',
      achievement: 'Inter-University Best Defender Award',
      tournament: 'North Zone University Kabaddi Cup 2026',
      image: 'assets/images/champ-kabaddi-2.jpg',
      stats: '82 Tackle Points • 9 Super Tackles'
    },
    {
      name: 'Meera Rathore (Demo Profile)',
      sport: 'Kho-Kho',
      role: 'All-Rounder & Dodging Specialist',
      achievement: 'Khelo India Zonal Standout Runner',
      tournament: 'West Zone Kho-Kho Invitational 2026',
      image: 'assets/images/champ-khokho-2.jpg',
      stats: '4m 42s Longest Unbroken Run'
    }
  ];

  const TESTIMONIALS = [
    {
      quote: 'Joining Raiders Sports Academy completely transformed my raiding confidence. The mat drills and breath-control sessions helped me earn selection for my district U-19 Kabaddi squad.',
      author: 'Rohan Pawar (Demo Student)',
      meta: 'Kabaddi Advanced Batch • Age 18',
      sport: 'Kabaddi'
    },
    {
      quote: 'As parents, safety and discipline matter most to us. The coaches focus equally on warm-ups, injury prevention, and respectful sportsmanship. My daughter looks forward to every Kho-Kho session.',
      author: 'Sunita Joshi (Demo Parent)',
      meta: 'Parent of Kavya Joshi (U-14 Kho-Kho)',
      sport: 'Kho-Kho'
    },
    {
      quote: 'The split-second pole-dive training and video feedback here are unmatched. Our reflexes and teamwork improved dramatically ahead of the school state nationals.',
      author: 'Siddharth Nair (Demo Student)',
      meta: 'Kho-Kho Competitive Batch • Age 19',
      sport: 'Kho-Kho'
    },
    {
      quote: 'Strength & conditioning sessions built my ankle stability and tackle power without risking knee strain. This academy treats Indian traditional sports with world-class professionalism.',
      author: 'Harpreet Singh (Demo Student)',
      meta: 'Kabaddi & Conditioning Batch • Age 21',
      sport: 'Kabaddi'
    }
  ];

  const TOURNAMENTS = [
    {
      id: 'trn-maharashtra-kbd',
      name: 'Deccan Raiders Kabaddi Cup 2027 (Demo)',
      sport: 'Kabaddi',
      date: '2027-01-18',
      venue: 'Shiv Chhatrapati Indoor Mat Arena, Pune',
      deadline: '2027-01-05',
      eligibility: 'U-19 & Senior Academy Batches',
      feeNote: 'Academy Squad Entry Included (Demo)',
      description: '7-a-side indoor mat championship featuring 16 regional academy squads with live digital raid clocks and referee officiating.'
    },
    {
      id: 'trn-west-khokho',
      name: 'West Zone Kho-Kho Speed Invitational 2027 (Demo)',
      sport: 'Kho-Kho',
      date: '2027-02-08',
      venue: 'Raiders Turf Court 1, Balewadi Sports Complex',
      deadline: '2027-01-25',
      eligibility: 'U-14, U-19 & Open Categories',
      feeNote: 'Demo Registration Open',
      description: 'Timed-turn floodlit Kho-Kho tournament focused on pole-dive accuracy, rapid chase turnovers, and agility scoring.'
    },
    {
      id: 'trn-yuva-combat',
      name: 'Yuva Bharati Mat & Court Trials 2027 (Demo)',
      sport: 'Both Sports',
      date: '2027-03-14',
      venue: 'Raiders Main Stadium Arena, Pune',
      deadline: '2027-02-28',
      eligibility: 'All Active Registered Academy Players',
      feeNote: 'Free Assessment Trial (Demo)',
      description: 'Official quarterly academy selection trials evaluating sprint times, mat agility, raiding/chasing execution, and tactical IQ.'
    }
  ];

  const SEEDED_PLAYERS = [
    {
      playerId: 'RSA-KBD-104',
      fullName: 'Arjun Deshmukh',
      email: 'arjun.raider@raidersacademy.in',
      password: 'Raiders@2027',
      dob: '2007-08-14',
      gender: 'Male',
      guardianName: 'Rajesh Deshmukh',
      phone: '+91 98230 45120',
      emergencyContact: '+91 98230 45121',
      address: 'Baner Road, Near Balewadi Stadium, Pune, Maharashtra',
      sport: 'Kabaddi',
      level: 'Advanced',
      batch: 'KBD-ADV-E1 (Mon-Sat 05:30 PM)',
      photo: 'assets/images/champ-kabaddi-1.jpg',
      joinedDate: '2026-04-10',
      isDemoSeeded: true
    },
    {
      playerId: 'RSA-KK-208',
      fullName: 'Ananya Kulkarni',
      email: 'ananya.khokho@raidersacademy.in',
      password: 'Raiders@2027',
      dob: '2008-03-22',
      gender: 'Female',
      guardianName: 'Prakash Kulkarni',
      phone: '+91 97654 32110',
      emergencyContact: '+91 97654 32111',
      address: 'Kothrud, Near Karve Statue, Pune, Maharashtra',
      sport: 'Kho-Kho',
      level: 'Advanced',
      batch: 'KK-ADV-M1 (Mon-Sat 06:00 AM)',
      photo: 'assets/images/champ-khokho-1.jpg',
      joinedDate: '2026-05-02',
      isDemoSeeded: true
    }
  ];

  const DEFAULT_ATTENDANCE_LOG = [
    { date: '2026-11-02', session: 'Raiding Footwork & Cant Control', coach: 'Coach Virendra Thakur', status: 'Present' },
    { date: '2026-11-03', session: 'Ankle-Hold & Chain Tackle Lab', coach: 'Coach Virendra Thakur', status: 'Present' },
    { date: '2026-11-04', session: 'Explosive Sprint & Core Conditioning', coach: 'Coach Sukhdev Pannu', status: 'Present' },
    { date: '2026-11-05', session: 'Do-or-Die Raid Simulation', coach: 'Coach Raghavendra Rao', status: 'Absent' },
    { date: '2026-11-06', session: 'Full-Court Tactical Scrimmage', coach: 'Coach Virendra Thakur', status: 'Present' },
    { date: '2026-11-07', session: 'Recovery Mobility & Video Review', coach: 'Coach Sukhdev Pannu', status: 'Present' },
    { date: '2026-11-09', session: 'Bonus-Line Escape & Reflex Drills', coach: 'Coach Virendra Thakur', status: 'Present' },
    { date: '2026-11-10', session: 'Speed Endurance & Agility Ladder', coach: 'Coach Sukhdev Pannu', status: 'Present' },
    { date: '2026-11-11', session: 'Championship Mat Simulation', coach: 'Coach Virendra Thakur', status: 'Present' },
    { date: '2026-11-13', session: 'Defensive Block & Dash Timing', coach: 'Coach Raghavendra Rao', status: 'Upcoming' },
    { date: '2026-11-14', session: 'Inter-Squad Practice Match', coach: 'Coach Virendra Thakur', status: 'Upcoming' }
  ];

  const DEFAULT_NOTIFICATIONS = [
    {
      id: 'notif-1',
      category: 'Batch Updates',
      title: 'Evening Mat Session Shifted to Arena B (Demo)',
      message: 'Friday tactical mat session will run on Arena B cushioned mats from 05:30 PM to 07:30 PM.',
      time: '2 hours ago',
      read: false
    },
    {
      id: 'notif-2',
      category: 'Tournament Announcements',
      title: 'Deccan Raiders Kabaddi Cup 2027 Entries Open',
      message: 'Academy players in Advanced & Competitive batches can submit demo tournament registration before Jan 05.',
      time: 'Yesterday',
      read: false
    },
    {
      id: 'notif-3',
      category: 'Attendance Alerts',
      title: 'Weekly Attendance Streak: 89% Achieved',
      message: 'Great consistency! You attended 8 out of 9 completed sessions in the current cycle.',
      time: '2 days ago',
      read: false
    },
    {
      id: 'notif-4',
      category: 'Fee Reminders',
      title: 'Quarterly Installment Reminder (Demo Mode)',
      message: 'Demo balance of INR 2,400 is scheduled for the upcoming training cycle. No real payment is processed.',
      time: '4 days ago',
      read: true
    },
    {
      id: 'notif-5',
      category: 'Academy Announcements',
      title: 'Sports Nutrition & Hydration Workshop',
      message: 'Guest sports physiologist session scheduled this Saturday at 09:00 AM for all Kabaddi & Kho-Kho athletes.',
      time: '1 week ago',
      read: true
    }
  ];

  const DEFAULT_PAYMENTS = {
    totalFee: 11200,
    paidAmount: 8800,
    pendingAmount: 2400,
    nextDueDate: '2026-12-05',
    breakdown: [
      { item: 'Advanced Training Program Fee (16 Weeks)', amount: 7200 },
      { item: 'Strength & Conditioning Add-On', amount: 2500 },
      { item: 'Academy Match Kit & Mat Insurance (Demo)', amount: 1500 }
    ],
    history: [
      { ref: 'DEMO-TXN-90412', date: '2026-08-12', desc: 'Term 1 Registration & Mat Fee (Demo)', amount: 5000, status: 'Paid (Demo)' },
      { ref: 'DEMO-TXN-91887', date: '2026-10-04', desc: 'Strength Conditioning & Kit Installment (Demo)', amount: 3800, status: 'Paid (Demo)' }
    ]
  };

  function getStoredJSON(key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch (e) {
      return fallback;
    }
  }

  function setStoredJSON(key, val) {
    try {
      localStorage.setItem(key, JSON.stringify(val));
    } catch (e) {
      // Ignore storage quota exceptions gracefully
    }
  }

  function initSeededStore() {
    if (!localStorage.getItem(STORAGE_KEYS.PLAYERS)) {
      setStoredJSON(STORAGE_KEYS.PLAYERS, SEEDED_PLAYERS);
    }
    if (!localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS)) {
      setStoredJSON(STORAGE_KEYS.NOTIFICATIONS, DEFAULT_NOTIFICATIONS);
    }
    if (!localStorage.getItem(STORAGE_KEYS.PAYMENTS)) {
      setStoredJSON(STORAGE_KEYS.PAYMENTS, DEFAULT_PAYMENTS);
    }
    if (!localStorage.getItem(STORAGE_KEYS.ENROLLMENTS)) {
      setStoredJSON(STORAGE_KEYS.ENROLLMENTS, [
        {
          id: 'enr-seed-1',
          programId: 'prog-kabaddi-adv',
          programName: 'Kabaddi Advanced Program',
          sport: 'Kabaddi',
          batch: 'KBD-ADV-E1 (Mon-Sat 05:30 PM)',
          coach: 'Coach Virendra Thakur',
          days: 'Mon - Sat',
          time: '05:30 PM - 07:30 PM',
          status: 'Active (Demo)',
          enrolledAt: '2026-08-10'
        },
        {
          id: 'enr-seed-2',
          programId: 'prog-fitness',
          programName: 'Fitness & Conditioning',
          sport: 'Both Sports',
          batch: 'FIT-WK1 (Wed/Sat/Sun 07:00 AM)',
          coach: 'Coach Sukhdev Pannu',
          days: 'Wed, Sat, Sun',
          time: '07:00 AM - 08:45 AM',
          status: 'Active (Demo)',
          enrolledAt: '2026-09-02'
        }
      ]);
    }
    if (!localStorage.getItem(STORAGE_KEYS.TOURNAMENT_REGS)) {
      setStoredJSON(STORAGE_KEYS.TOURNAMENT_REGS, [
        {
          id: 'treg-seed-1',
          tournamentId: 'trn-yuva-combat',
          tournamentName: 'Yuva Bharati Mat & Court Trials 2027 (Demo)',
          sport: 'Both Sports',
          category: 'Team Squad',
          status: 'Registered (Demo)',
          registeredAt: '2026-11-01'
        }
      ]);
    }
  }

  initSeededStore();

  return {
    STORAGE_KEYS,
    PROGRAMS,
    COACHES,
    CHAMPIONS,
    TESTIMONIALS,
    TOURNAMENTS,
    SEEDED_PLAYERS,
    DEFAULT_ATTENDANCE_LOG,
    getStoredJSON,
    setStoredJSON
  };
})();

