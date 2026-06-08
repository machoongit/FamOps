// data/curriculum.js — FamOps Curriculum
// LESSON TEMPLATE:
// {
//   id: 'unique_id',
//   title: 'Lesson Title',
//   xp: 25,                        // XP awarded on completion
//   sub: 'Subtitle / category',    // shown under title in list
//   inPerson: false,               // true = parent marks complete after teaching
//   slides: [                      // flexible length — add as many as needed
//     { type: 'cover',     emoji: '🏈', title: 'Big Title',    body: 'Hook sentence.' },
//     { type: 'fact',      emoji: '💡', title: 'Concept Name', body: 'Explanation text.' },
//     { type: 'list',      emoji: '📋', title: 'List Title',   body: '• Item one\n• Item two\n• Item three' },
//     { type: 'tip',       emoji: '💡', title: 'Pro Tip',      body: 'Tip text here.' },
//     { type: 'funfact',   emoji: '🌟', title: 'Fun Fact',     body: 'Interesting fact.' },
//     { type: 'challenge', emoji: '🔥', title: 'Challenge',    body: 'What to go do.' },
//     { type: 'recap',     emoji: '✅', title: 'Recap',        body: 'Summary of what was covered.' },
//   ],
//   quiz: [   // ONLY ask about things explicitly covered in slides above
//     { q: 'Question text?', options: ['A', 'B', 'C', 'D'], answer: 0 }, // answer = index of correct option
//   ]
// }

export const SUBJECTS = [

  // ─────────────────────────────────────────────────────────────────────────
  {
    id: 'football',
    name: 'Football',
    icon: '🏈',
    color: '#ff6b35',
    ageNote: 'Ages 8+',
    desc: 'Rules, positions, strategy, and the game',
    lessons: [
      {
        id: 'fb1',
        title: 'How the Game Works',
        xp: 20,
        sub: 'Rules & Basics',
        inPerson: false,
        slides: [
          { type: 'cover',     emoji: '🏈', title: 'Football 101',            body: 'Two teams. One ball. 100 yards of battlefield. Let\'s learn the game.' },
          { type: 'fact',      emoji: '🎯', title: 'The Goal of the Game',    body: 'Each team tries to move the ball into the opponent\'s END ZONE to score. The end zone is at each end of the 100-yard field. Getting the ball there is called a TOUCHDOWN.' },
          { type: 'fact',      emoji: '👥', title: 'The Teams',               body: 'Each team has 11 players on the field at once. One team is on OFFENSE (they have the ball and are trying to score). The other is on DEFENSE (they are trying to stop them).' },
          { type: 'list',      emoji: '📋', title: 'The 4 Downs System',      body: 'The offense gets 4 attempts called DOWNS to advance the ball 10 yards.\n\n✅ Gain 10+ yards → you get a fresh set of 4 downs\n❌ Don\'t gain 10 yards in 4 tries → the other team gets the ball\n\nMost teams punt (kick away) on 4th down if they haven\'t made it.' },
          { type: 'list',      emoji: '💯', title: 'Ways to Score',           body: '🏆 TOUCHDOWN = 6 points — cross the end zone with the ball\n🦶 EXTRA POINT = 1 point — kick through the uprights after a TD\n💪 2-POINT CONVERSION = 2 points — run or pass into end zone after TD instead of kicking\n🎯 FIELD GOAL = 3 points — kick through the uprights during regular play\n🛡️ SAFETY = 2 points — defense tackles the ball carrier in their own end zone' },
          { type: 'fact',      emoji: '⏱️', title: 'How Long is a Game?',    body: 'A football game has FOUR QUARTERS, each 15 minutes long. That\'s 60 minutes of game time total. But the clock stops frequently — for incomplete passes, when players go out of bounds, after scores, and for penalties. Real games last about 3 hours.' },
          { type: 'fact',      emoji: '🗺️', title: 'The Field',              body: 'The field is 100 yards long with a 10-yard end zone at each end (120 yards total). Every 10 yards has a yard line marked. The 50-yard line is the middle. Teams start each possession at their own 20-yard line after a kickoff.' },
          { type: 'tip',       emoji: '💡', title: 'Watch the Line of Scrimmage', body: 'Every play starts at a spot called the LINE OF SCRIMMAGE — where the ball was last stopped. Both teams line up there facing each other before the ball is snapped. Watch that line and you\'ll always know what\'s happening.' },
          { type: 'funfact',   emoji: '🌟', title: 'Fun Fact',               body: 'The Super Bowl — the NFL championship game — is watched by over 100 MILLION people every year in the US alone. It\'s the single most-watched annual TV event in America. More pizza is sold on Super Bowl Sunday than any other day of the year.' },
          { type: 'challenge', emoji: '🔥', title: 'Your Challenge',         body: 'The next time you watch a game, track the downs out loud. Every new set of downs, say "1st and 10!" Each time they gain yards, count how far. See if you can follow a full drive from start to score (or turnover).' },
          { type: 'recap',     emoji: '✅', title: 'What You Learned',       body: '• 11 players per team on the field\n• Offense tries to score, defense tries to stop them\n• 4 downs to gain 10 yards or turn it over\n• Touchdown = 6pts, Field Goal = 3pts, Safety = 2pts\n• Games are 4 quarters of 15 minutes each' },
        ],
        quiz: [
          { q: 'How many players does each team have on the field at once?', options: ['9 players', '10 players', '11 players', '12 players'], answer: 2 },
          { q: 'How many points is a touchdown worth?', options: ['3 points', '4 points', '6 points', '7 points'], answer: 2 },
          { q: 'How many downs does the offense get to advance 10 yards?', options: ['3 downs', '4 downs', '5 downs', '6 downs'], answer: 1 },
          { q: 'How many points is a field goal worth?', options: ['1 point', '2 points', '3 points', '6 points'], answer: 2 },
          { q: 'What happens if the offense doesn\'t gain 10 yards in 4 downs?', options: ['They get 4 more downs', 'They score a safety', 'The other team gets the ball', 'The game ends'], answer: 2 },
        ]
      },
      {
        id: 'fb2',
        title: 'Positions & Roles',
        xp: 25,
        sub: 'Players & Strategy',
        inPerson: false,
        slides: [
          { type: 'cover',     emoji: '🎖️', title: 'Positions & Roles',     body: 'Football is like a military operation. Every single player has a specific job. Miss your assignment and the whole play breaks down.' },
          { type: 'fact',      emoji: '⚡', title: 'Offense vs Defense',     body: 'There are TWO different units:\n\nOFFENSE — the unit that has the ball and is trying to score. They choose the play and execute it.\n\nDEFENSE — the unit trying to stop the offense from scoring. They react to what the offense does.' },
          { type: 'list',      emoji: '🏈', title: 'Offense: Skill Positions', body: '🎯 QUARTERBACK (QB) — The leader. Calls plays, throws passes, or hands off. Every play runs through him.\n\n💨 RUNNING BACK (RB) — Takes handoffs and runs through the defense. Needs speed and power.\n\n🙌 WIDE RECEIVER (WR) — Runs precise routes and catches passes. Needs elite speed and great hands.\n\n🤝 TIGHT END (TE) — A hybrid. Big enough to block, fast enough to catch passes.' },
          { type: 'fact',      emoji: '🧱', title: 'Offense: The Linemen',  body: 'Five OFFENSIVE LINEMEN line up in front of the QB. Their only jobs are to PROTECT the QB from being tackled and OPEN HOLES for the running back to run through. They never touch the ball. They get no glory. But without them, NOTHING works. They are the most important players most people never talk about.' },
          { type: 'list',      emoji: '🛡️', title: 'Defense: Front Line',  body: '💥 DEFENSIVE LINEMEN (DL) — Big, powerful players who line up directly across from the offensive linemen. They try to break through and tackle the QB or stop runs at the line of scrimmage.\n\n🦅 LINEBACKERS (LB) — Line up behind the defensive linemen. They\'re versatile — they stop runs, rush the QB, and drop back to cover passes. They do everything.' },
          { type: 'list',      emoji: '🔒', title: 'Defense: The Secondary', body: '🚀 CORNERBACKS (CB) — Cover wide receivers man-to-man. They need elite speed and quickness. Going against the WR every play is one of the hardest jobs in football.\n\n👁️ SAFETIES (S) — The last line of defense, positioned deep. Free Safety covers deep passes. Strong Safety plays closer to the line and helps stop runs.' },
          { type: 'tip',       emoji: '💡', title: 'Watch the QB Every Play', body: 'At the snap, find the quarterback and watch him. Where he looks tells you the story of the play. Is he handing off? Looking left? Scrambling? The QB\'s eyes and movements tell you everything before it happens.' },
          { type: 'funfact',   emoji: '🌟', title: 'Fun Fact',              body: 'The best quarterbacks in the NFL — Patrick Mahomes, Lamar Jackson, Josh Allen — earn over $50 MILLION per year. Elite QBs are the most valuable players in professional sports. A great QB can make an entire franchise worth billions of dollars.' },
          { type: 'challenge', emoji: '🔥', title: 'Your Challenge',        body: 'Pick your favorite NFL team. Look up their starting QB, their best RB, and their top WR. Learn their names, jersey numbers, and one fact about each one. Then watch them in the next game and find them on every play.' },
          { type: 'recap',     emoji: '✅', title: 'What You Learned',      body: '• QB leads the offense — every play runs through him\n• WR runs routes and catches passes\n• Offensive Linemen protect the QB (5 of them)\n• Defensive Linemen rush the QB\n• Cornerbacks cover receivers\n• Safeties are the last line of defense' },
        ],
        quiz: [
          { q: 'Which position calls plays and leads the offense?', options: ['Running Back', 'Wide Receiver', 'Quarterback', 'Tight End'], answer: 2 },
          { q: 'What do the 5 Offensive Linemen do?', options: ['Run with the ball', 'Catch passes', 'Protect the QB and open holes for runners', 'Cover wide receivers'], answer: 2 },
          { q: 'Which defensive players are responsible for covering wide receivers?', options: ['Linebackers', 'Cornerbacks', 'Defensive Linemen', 'Tight Ends'], answer: 1 },
          { q: 'What makes a Tight End different from other receivers?', options: ['They only kick field goals', 'They are big enough to block AND fast enough to catch passes', 'They snap the ball', 'They only play defense'], answer: 1 },
          { q: 'Where do Safeties line up on defense?', options: ['Right next to the offensive linemen', 'In front of the defensive linemen', 'Deep in the secondary as the last line of defense', 'Outside covering wide receivers'], answer: 2 },
        ]
      },
    ]
  },

  // ─────────────────────────────────────────────────────────────────────────
  {
    id: 'firstaid',
    name: 'First Aid',
    icon: '🩺',
    color: '#e53935',
    ageNote: 'Ages 8+',
    desc: 'Life-saving skills everyone needs',
    lessons: [
      {
        id: 'fa1',
        title: 'When to Call 911',
        xp: 25,
        sub: 'Emergency Response',
        inPerson: true,
        slides: [
          { type: 'cover',     emoji: '🚨', title: 'Emergency Response',     body: 'Knowing when and how to call 911 can save a life. This lesson could be the most important thing you ever learn.' },
          { type: 'fact',      emoji: '📞', title: 'What is 911?',           body: '911 is the emergency phone number in the United States. When you call, a trained dispatcher answers immediately. They can send police, firefighters, or paramedics to your location. It\'s free to call from any phone — even a phone with no service plan.' },
          { type: 'list',      emoji: '✅', title: 'When YOU Should Call 911', body: '🔴 Someone is unconscious and won\'t wake up\n🔴 Someone stopped breathing or is struggling to breathe\n🔴 Signs of a heart attack: chest pain, left arm pain, shortness of breath\n🔴 Heavy bleeding that won\'t stop\n🔴 A fire or someone is trapped\n🔴 You smell gas in the house\n🔴 Signs of a stroke: face drooping, arm weakness, slurred speech\n🔴 A serious fall or injury' },
          { type: 'list',      emoji: '🟡', title: 'When NOT to Call 911',  body: 'These do NOT need 911 — they need a doctor or parent:\n\n• Minor cuts and scrapes (use a bandage)\n• Mild headaches or stomachaches\n• A cold or flu\n• Toothaches\n• Non-urgent medical questions\n\nCalling 911 for non-emergencies slows down help for people who truly need it.' },
          { type: 'list',      emoji: '📋', title: 'Exactly What to Say',   body: 'When 911 answers, stay calm and say:\n\n1️⃣ "My name is [YOUR NAME]"\n2️⃣ "My address is [YOUR FULL ADDRESS]"\n3️⃣ "The emergency is..." (explain what happened)\n4️⃣ "There are [number] people hurt"\n5️⃣ STAY ON THE LINE — do not hang up until they tell you to' },
          { type: 'fact',      emoji: '🏠', title: 'Know Your Address Cold', body: 'In a real emergency, panic kicks in and people forget basic information — including their own address. You must know your home address BY MEMORY. Street number, street name, city, and zip code. Practice saying it right now out loud.' },
          { type: 'fact',      emoji: '🎧', title: 'What Dispatchers Do',   body: '911 dispatchers are specially trained to stay calm and help you through any emergency. They can talk you through CPR, tell you how to stop bleeding, and keep you calm until help arrives. They\'ve heard it all. Trust them and follow their instructions exactly.' },
          { type: 'tip',       emoji: '💡', title: 'Stay On the Line',       body: 'The most common mistake people make is hanging up after giving their address. DON\'T. The dispatcher needs to stay with you. They may have instructions. They also keep the call open so responders can hear what\'s happening as they arrive.' },
          { type: 'funfact',   emoji: '🌟', title: 'Fun Fact',              body: 'There are about 240 MILLION 911 calls made in the US every year. That\'s more than 650,000 per day. Dispatchers are among the most highly trained first responders — and they never get to leave their desk to help. They save lives through a phone.' },
          { type: 'challenge', emoji: '🔥', title: 'Your Challenge',        body: 'Do this with a parent right now:\n1. Memorize your full home address out loud\n2. Do a practice run — pretend there\'s an emergency and say exactly what you\'d tell a 911 operator\n3. Have your parent correct anything you missed\n4. Do it again until it feels completely natural' },
          { type: 'recap',     emoji: '✅', title: 'What You Learned',      body: '• 911 is free from any phone\n• Call for: unconscious person, stopped breathing, heart attack, heavy bleeding, fire, gas smell, stroke\n• Don\'t call for minor cuts, headaches, or non-urgent issues\n• Always give your name, full address, and what happened\n• STAY ON THE LINE until the dispatcher says to hang up' },
        ],
        quiz: [
          { q: 'What is the FIRST thing you should tell a 911 operator?', options: ['What the emergency is', 'Your name and address', 'How many people are hurt', 'Your phone number'], answer: 1 },
          { q: 'Should you call 911 for a minor scrape on your knee?', options: ['Yes, always call 911', 'No — use a bandage, it\'s not an emergency', 'Only if it bleeds a lot', 'Only at nighttime'], answer: 1 },
          { q: 'What should you do after giving information to a 911 dispatcher?', options: ['Hang up immediately and wait outside', 'Call someone else too', 'Stay on the line until THEY tell you to hang up', 'Put the phone down but don\'t hang up'], answer: 2 },
          { q: 'Which of these IS a reason to call 911?', options: ['A mild stomachache', 'A bad cold', 'Someone who won\'t wake up', 'A toothache'], answer: 2 },
          { q: 'Why is memorizing your home address so important for emergencies?', options: ['So you can get mail', 'Because panic can make you forget it when you need it most', 'For school paperwork', 'So friends can visit'], answer: 1 },
        ]
      },
      {
        id: 'fa2',
        title: 'CPR & Bleeding Control',
        xp: 30,
        sub: 'Life-Saving Skills',
        inPerson: true,
        slides: [
          { type: 'cover',     emoji: '❤️', title: 'CPR Saves Lives',        body: 'Cardiac arrest can happen to anyone, anywhere — including people you love. CPR is how bystanders keep people alive until paramedics arrive.' },
          { type: 'fact',      emoji: '🫀', title: 'What is Cardiac Arrest?', body: 'Cardiac arrest means the heart has stopped beating. Blood stops flowing to the brain. Without oxygen, brain cells start dying within 4-6 minutes. CPR — Cardiopulmonary Resuscitation — manually pumps blood through the body when the heart can\'t do it.' },
          { type: 'list',      emoji: '👐', title: 'CPR: Before You Start',  body: 'Before starting CPR:\n\n1. Make sure the scene is SAFE — is there danger?\n2. Tap the person firmly and shout "Are you okay?"\n3. Look for breathing (chest rising)\n4. If no response and not breathing normally → call 911 immediately (or tell a bystander to call)\n5. Begin CPR right away' },
          { type: 'list',      emoji: '💪', title: 'CPR: The Compressions', body: 'Here is exactly how to do compressions:\n\n• Place the HEEL of your hand on the CENTER of the chest (on the breastbone)\n• Place your other hand on top, fingers interlaced\n• Keep arms STRAIGHT — use your body weight, not just your arms\n• Push DOWN at least 2 inches deep\n• Push FAST — 100 to 120 times per minute\n• Let the chest fully rise back up between each compression\n• DO NOT STOP until paramedics arrive or the person wakes up' },
          { type: 'tip',       emoji: '🎵', title: 'The Rhythm Secret',      body: 'The correct CPR speed is 100-120 compressions per minute. The song "Stayin\' Alive" by the Bee Gees is exactly 100 BPM. Hum it or think it in your head while doing compressions — it will keep your rhythm perfect. Paramedics actually use this trick too.' },
          { type: 'fact',      emoji: '🙌', title: 'Hands-Only CPR',        body: 'You do NOT need to do mouth-to-mouth to help. The American Heart Association says HANDS-ONLY CPR — just compressions, no breathing — is effective and what they recommend for untrained bystanders. Don\'t let fear of mouth-to-mouth stop you from helping.' },
          { type: 'list',      emoji: '🩸', title: 'Controlling Bleeding',  body: 'For serious bleeding:\n\n1. Put on gloves if available (protects you from disease)\n2. Use a CLEAN cloth and press down FIRMLY on the wound\n3. Do NOT lift the cloth to check — add more cloth on TOP if it soaks through\n4. If possible, raise the injured area ABOVE the level of the heart\n5. Keep firm pressure — don\'t let up\n6. If bleeding doesn\'t slow after 10 minutes → call 911 if not already done' },
          { type: 'fact',      emoji: '📊', title: 'Why CPR Matters',       body: 'About 350,000 cardiac arrests happen outside of hospitals in the US every year. Only about 10% of people survive without bystander CPR. When someone nearby starts CPR immediately, survival rates DOUBLE or TRIPLE. Most cardiac arrests happen at home — meaning you could save someone in your own family.' },
          { type: 'funfact',   emoji: '🌟', title: 'Fun Fact',              body: 'The song "Stayin\' Alive" by the Bee Gees has been used in actual CPR training programs by the American Heart Association. Some hospitals literally play it in training rooms. Disco might have saved more lives than we think.' },
          { type: 'challenge', emoji: '🔥', title: 'Your Challenge',        body: 'Do this with a parent watching:\n1. Find a pillow or couch cushion\n2. Practice the hand placement (center of chest)\n3. Set a timer and do 30 compressions at the correct speed\n4. Hum "Stayin\' Alive" while doing it\n5. Have your parent check your depth and speed\n6. Repeat until it feels natural' },
          { type: 'recap',     emoji: '✅', title: 'What You Learned',      body: '• CPR pumps blood when the heart stops\n• Check scene safety → tap and shout → call 911 → start compressions\n• Both hands on center of chest, push 2 inches deep\n• Speed: 100-120 per minute (hum "Stayin\' Alive")\n• Hands-only CPR is approved — no mouth-to-mouth needed\n• For bleeding: firm pressure, don\'t lift cloth, raise if possible' },
        ],
        quiz: [
          { q: 'Where exactly do you place your hands during CPR?', options: ['On the stomach', 'On the side of the chest', 'On the CENTER of the chest (breastbone)', 'On the upper chest near the collarbone'], answer: 2 },
          { q: 'How many compressions per minute is the correct CPR speed?', options: ['50-60 per minute', '80-90 per minute', '100-120 per minute', '150+ per minute'], answer: 2 },
          { q: 'The song "Stayin\' Alive" is used in CPR training because...', options: ['It\'s easy to remember', 'It\'s exactly 100 BPM — the correct compression speed', 'It calms the patient down', 'Paramedics like it'], answer: 1 },
          { q: 'When a cloth soaks through with blood during bleeding control, you should...', options: ['Remove the cloth completely and start over', 'Add more cloth ON TOP without removing the first', 'Stop applying pressure and wait', 'Apply ice instead'], answer: 1 },
          { q: 'According to this lesson, how much does bystander CPR affect survival?', options: ['It makes no difference', 'It slightly improves chances', 'It doubles or triples survival rates', 'Only doctors can do effective CPR'], answer: 2 },
        ]
      },
    ]
  },

  // ─────────────────────────────────────────────────────────────────────────
  {
    id: 'finance',
    name: 'Money & Finance',
    icon: '💰',
    color: '#43a047',
    ageNote: 'Ages 10+',
    desc: 'How money actually works',
    lessons: [
      {
        id: 'fin1',
        title: 'Earning, Saving, Spending',
        xp: 20,
        sub: 'Money Basics',
        inPerson: false,
        slides: [
          { type: 'cover',     emoji: '💰', title: 'How Money Works',        body: 'Most adults struggle with money because nobody taught them this when they were young. You\'re about to get ahead of most people on the planet.' },
          { type: 'fact',      emoji: '🔄', title: 'The 3 Things You Do With Money', body: 'Every dollar that comes into your life will do one of three things:\n\n💼 EARN — You trade your time, skills, or ideas for money\n🏦 SAVE — You put money aside to use later\n🛍️ SPEND — You exchange money for things\n\nMost people are great at spending. Very few are good at all three.' },
          { type: 'fact',      emoji: '⭐', title: 'Pay Yourself First',     body: '"Pay yourself first" is the most powerful money habit that exists. It means: the FIRST thing you do when you get money is set some aside for savings — BEFORE spending anything.\n\nMost people do the opposite. They spend everything, then try to save whatever\'s left. There\'s usually nothing left. That\'s how people end up broke even with good incomes.' },
          { type: 'list',      emoji: '📊', title: 'The 50/30/20 Rule',      body: 'This rule works at ANY income level:\n\n50% → NEEDS (food, shelter, clothing, transportation, utilities)\n30% → WANTS (entertainment, eating out, new things)\n20% → SAVINGS (emergency fund, future goals, investments)\n\nExample: If you earn $100:\n• $50 goes to needs\n• $30 goes to wants  \n• $20 gets saved immediately' },
          { type: 'list',      emoji: '🤔', title: 'Need vs Want — The Real Difference', body: 'NEEDS — things required to live and function:\n✅ Food and water\n✅ Shelter and utilities\n✅ Basic clothing\n✅ Transportation to school or work\n\nWANTS — things that improve life but aren\'t required:\n❌ Video games\n❌ Eating out at restaurants\n❌ New shoes beyond what you need\n❌ Entertainment subscriptions\n\nKnowing the difference is the foundation of financial health.' },
          { type: 'fact',      emoji: '📈', title: 'The Power of Starting Early', body: 'Time is the most powerful force in building wealth — more powerful than income.\n\nIf you save $5 per week starting at age 10, and invest it at a 7% average return (which is the historical stock market average), you\'ll have over $100,000 by age 60.\n\nIf you wait until age 30 to start doing the same thing, you\'ll have less than $25,000 by age 60.\n\nSame effort. Same money. A 20-year head start = 4x the result.' },
          { type: 'tip',       emoji: '💡', title: 'The Savings Jar System', body: 'A simple system for right now:\n\nGet 3 jars or envelopes. Label them SAVE, SPEND, GIVE.\n\nEvery time you get money — allowance, birthday money, work — immediately divide it:\n• 20% in SAVE (don\'t touch this)\n• 70% in SPEND (for things you want)\n• 10% in GIVE (donate or gift to others)\n\nThis builds the habit that millionaires use.' },
          { type: 'funfact',   emoji: '🌟', title: 'Fun Fact',              body: 'Warren Buffett — one of the richest people in the world — made his first investment at age 11. He bought stock for $38. He\'s said his biggest financial regret is that he didn\'t start investing earlier. If a billionaire wishes he started sooner, imagine what starting NOW could do for you.' },
          { type: 'challenge', emoji: '🔥', title: 'Your Challenge',        body: 'This week, write down every single dollar you receive and every dollar you spend. At the end of the week:\n1. Add up your income\n2. Add up your spending\n3. Divide your spending into NEEDS and WANTS\n4. What percentage of what you earned did you save?\n\nBe 100% honest. Most people are surprised by what they find.' },
          { type: 'recap',     emoji: '✅', title: 'What You Learned',      body: '• The 3 things you do with money: Earn, Save, Spend\n• Pay yourself FIRST — save before spending\n• The 50/30/20 rule: Needs/Wants/Savings\n• Needs are required to live. Wants improve life.\n• Starting early with savings = dramatically more money over time\n• The 3-jar system: Save 20%, Spend 70%, Give 10%' },
        ],
        quiz: [
          { q: 'What does "Pay Yourself First" mean according to this lesson?', options: ['Buy yourself something nice first', 'Save money BEFORE spending anything', 'Pay your bills before having fun', 'Always put yourself first in life'], answer: 1 },
          { q: 'In the 50/30/20 rule, what percentage goes to SAVINGS?', options: ['10%', '20%', '30%', '50%'], answer: 1 },
          { q: 'According to this lesson, which of these is a NEED?', options: ['A new video game', 'The latest sneakers', 'Food, shelter, and basic clothing', 'Movie tickets'], answer: 2 },
          { q: 'According to this lesson, which of these is a WANT?', options: ['Electricity and utilities', 'School supplies', 'Eating out at a restaurant', 'Transportation to school'], answer: 2 },
          { q: 'According to the example in this lesson, saving $5/week starting at age 10 vs age 30 results in...', options: ['About the same amount', 'Slightly more money', 'About 4 times more money by starting early', 'It makes no real difference'], answer: 2 },
        ]
      },
    ]
  },

  // ─────────────────────────────────────────────────────────────────────────
  {
    id: 'coding',
    name: 'Coding',
    icon: '💻',
    color: '#4a90e2',
    ageNote: 'Ages 10+',
    desc: 'Think like a programmer',
    lessons: [
      {
        id: 'code1',
        title: 'What is Code?',
        xp: 20,
        sub: 'Fundamentals',
        inPerson: false,
        slides: [
          { type: 'cover',     emoji: '💻', title: 'What is Code?',          body: 'Every app, game, website, and smart device runs on code. Learning to code is learning the language the modern world is built on.' },
          { type: 'fact',      emoji: '🧠', title: 'What Programming Actually Is', body: 'Programming means writing step-by-step instructions that a computer will follow EXACTLY. Computers are incredibly fast but have zero common sense — they do precisely what you tell them, nothing more, nothing less. If your instructions have a mistake, the computer will do the wrong thing perfectly.' },
          { type: 'list',      emoji: '🌐', title: 'Popular Programming Languages', body: '🐍 PYTHON — Most beginner-friendly. Used in AI, data science, and automation. Great first language.\n🌐 JAVASCRIPT — Runs in every web browser. Makes websites interactive. Most used language in the world.\n📱 SWIFT — Built by Apple specifically to make iPhone and iPad apps.\n🎮 C++ — Used in video games and high-performance software. Complex but powerful.\n☕ JAVA — Used in Android apps and large business software systems.' },
          { type: 'fact',      emoji: '📦', title: 'Variables: The Building Block', body: 'A VARIABLE is like a labeled box that stores information.\n\nExample: name = "Ray"\nNow whenever your program needs that name, it just says "name" instead of "Ray".\n\nVariables can store text, numbers, true/false values, lists, and more. Almost every program ever written uses variables.' },
          { type: 'fact',      emoji: '🔁', title: 'Loops: Do It Again',    body: 'A LOOP tells the computer to repeat something multiple times.\n\nInstead of writing:\nprint("Hello")\nprint("Hello")\nprint("Hello")... (100 times)\n\nYou write:\nfor i in range(100):\n  print("Hello")\n\nLoops are why computers can process millions of things in seconds.' },
          { type: 'fact',      emoji: '🤔', title: 'If/Else: Making Decisions', body: 'An IF/ELSE statement lets a program make decisions:\n\nif temperature > 90:\n  print("It\'s hot outside")\nelse:\n  print("The weather is nice")\n\nThis is how apps decide what to show you, how games decide if you won or lost, and how websites personalize your experience.' },
          { type: 'fact',      emoji: '🔧', title: 'Functions: Reusable Code', body: 'A FUNCTION is a block of code you write once and can use over and over.\n\nThink of it like a recipe. You write the recipe once (the function), and then any time you want that dish, you just say "make that recipe" (call the function).\n\nFunctions make programs cleaner, shorter, and easier to fix.' },
          { type: 'tip',       emoji: '💡', title: 'Where to Start Right Now', body: 'The best free place to start learning coding as a beginner:\n\nscratch.mit.edu — Free, visual, drag-and-drop coding made by MIT. Used by millions of kids AND adults to learn the fundamentals before moving to text-based languages. Build actual games and animations on day one.' },
          { type: 'funfact',   emoji: '🌟', title: 'Fun Fact',              body: 'Your smartphone has more computing power than ALL of NASA\'s computers combined that were used to land Apollo 11 on the moon in 1969. The Apollo Guidance Computer ran at 0.043 MHz. Your phone runs at over 3,000 MHz. And you use it to scroll social media.' },
          { type: 'challenge', emoji: '🔥', title: 'Your Challenge',        body: 'Go to scratch.mit.edu (it\'s free, no account needed to start). Build a simple project where:\n• A character moves when you press the arrow keys\n• When the character touches something, something happens\n\nThis will teach you variables, loops, and if/else statements without writing a single line of text code. Take a screenshot and show a parent.' },
          { type: 'recap',     emoji: '✅', title: 'What You Learned',      body: '• Code = step-by-step instructions computers follow exactly\n• Python, JavaScript, Swift, C++, Java are popular languages\n• Variable = a labeled box storing information\n• Loop = repeat something many times\n• If/Else = make decisions based on conditions\n• Function = reusable block of code\n• Start learning at scratch.mit.edu' },
        ],
        quiz: [
          { q: 'According to this lesson, what is a "variable" in programming?', options: ['A type of error in code', 'A labeled box that stores information', 'A way to repeat code', 'A programming language'], answer: 1 },
          { q: 'According to this lesson, which programming language is described as most beginner-friendly?', options: ['C++', 'Java', 'Python', 'Swift'], answer: 2 },
          { q: 'What does a "loop" do in programming?', options: ['Stores information', 'Makes a decision', 'Repeats code multiple times', 'Connects to the internet'], answer: 2 },
          { q: 'According to this lesson, what does an if/else statement do?', options: ['Stores a value', 'Repeats code', 'Lets the program make decisions based on conditions', 'Downloads files'], answer: 2 },
          { q: 'According to this lesson, what website is recommended to start learning to code for free?', options: ['google.com', 'youtube.com', 'scratch.mit.edu', 'github.com'], answer: 2 },
        ]
      },
    ]
  },

  // ─────────────────────────────────────────────────────────────────────────
  {
    id: 'military',
    name: 'Military Training',
    icon: '🎖️',
    color: '#607d8b',
    ageNote: 'Ages 10+',
    desc: 'Discipline, structure, and leadership',
    lessons: [
      {
        id: 'mil1',
        title: 'Discipline & Structure',
        xp: 20,
        sub: 'Mindset',
        inPerson: true,
        slides: [
          { type: 'cover',     emoji: '🎖️', title: 'Discipline',            body: 'One word. The foundation of every high-performing person, team, and organization in history.' },
          { type: 'fact',      emoji: '📖', title: 'What Discipline Really Means', body: 'Discipline is NOT about being punished or restricted. Real discipline means:\n\nDoing what needs to be done — the right thing, the hard thing — even when you don\'t feel like it.\n\nIt\'s the gap between where you are and where you want to be. Discipline is what crosses that gap.' },
          { type: 'list',      emoji: '✅', title: 'What Military Discipline Looks Like', body: '• Waking up on time without needing to be told\n• Making your bed as the first act of the day\n• Keeping your space clean and organized at all times\n• Following through on commitments — every single one\n• Controlling your emotions when things get hard\n• Showing respect to those in authority\n• Being on time, every time' },
          { type: 'list',      emoji: '⭐', title: 'The 3 Core Military Values', body: '🎯 ACCOUNTABILITY — You own your actions. When something goes wrong, you don\'t blame others, make excuses, or deflect. You say "I was responsible" and you fix it. This is the rarest and most respected trait in any organization.\n\n⚡ ADAPTABILITY — Plans fail. Things change. Conditions shift. The disciplined person adjusts and keeps moving forward instead of giving up.\n\n🔍 ATTENTION TO DETAIL — Small things matter. A small error in the wrong situation causes big problems. Excellence in small things leads to excellence in everything.' },
          { type: 'fact',      emoji: '🛏️', title: 'Why Make Your Bed?',   body: 'The military requires making your bed perfectly every single morning. This is not random. When you complete a task — even a small one — first thing in the morning, you\'ve already won your first victory of the day.\n\nOne win leads to another. The discipline to do the small thing right trains the discipline to do the big thing right.' },
          { type: 'fact',      emoji: '💪', title: 'Discipline is a Habit, Not a Trait', body: 'Discipline is NOT a personality trait you\'re either born with or not. It is a HABIT built through repetition.\n\nEvery single time you choose the harder right thing over the easier wrong thing, your discipline gets stronger. Every time you give in, it gets weaker.\n\nIt\'s like a muscle. You build it by using it.' },
          { type: 'funfact',   emoji: '🌟', title: 'Fun Fact',              body: 'Navy SEALs — the most elite military unit in the US — go through over a year of training before their first deployment. The most famous part is "Hell Week" — 5+ days of continuous training with less than 4 hours of total sleep. About 75% of candidates don\'t finish. Those who do say the training was mostly mental, not physical.' },
          { type: 'challenge', emoji: '🔥', title: 'Your Challenge',        body: 'For the next 7 days, complete these three things every morning without being told:\n1. Make your bed within 5 minutes of waking up\n2. Get dressed before leaving your room\n3. Be on time for everything scheduled that day\n\nAt the end of 7 days, note how your energy, mood, and focus changed. Report to a parent.' },
          { type: 'recap',     emoji: '✅', title: 'What You Learned',      body: '• Discipline = doing what needs to be done even when you don\'t feel like it\n• Military discipline: wake up on time, keep space clean, follow through, control emotions\n• The 3 core values: Accountability, Adaptability, Attention to Detail\n• Making your bed = first win of the day, builds momentum\n• Discipline is a HABIT you build, not a trait you\'re born with' },
        ],
        quiz: [
          { q: 'According to this lesson, what does discipline mean?', options: ['Being punished for bad behavior', 'Doing what needs to be done even when you don\'t feel like it', 'Following orders without thinking', 'Being the strongest person in the room'], answer: 1 },
          { q: 'According to this lesson, which of the 3 core values means "own your actions and fix problems without blaming others"?', options: ['Adaptability', 'Attention to Detail', 'Accountability', 'Agility'], answer: 2 },
          { q: 'According to this lesson, WHY does the military make soldiers make their beds every morning?', options: ['For cleanliness inspections', 'To waste time', 'It\'s a small first win that builds momentum and discipline for the day', 'Because beds need to be made'], answer: 2 },
          { q: 'According to this lesson, is discipline a personality trait or a habit?', options: ['A personality trait you\'re born with', 'A habit you build through repetition', 'Something only military people have', 'A talent some people have naturally'], answer: 1 },
          { q: 'According to this lesson, about what percentage of Navy SEAL candidates do NOT finish training?', options: ['About 25%', 'About 40%', 'About 50%', 'About 75%'], answer: 3 },
        ]
      },
    ]
  },

  // ─────────────────────────────────────────────────────────────────────────
  {
    id: 'ai',
    name: 'AI & Technology',
    icon: '🤖',
    color: '#9c27b0',
    ageNote: 'Ages 10+',
    desc: 'How AI works and why it matters',
    lessons: [
      {
        id: 'ai1',
        title: 'What is Artificial Intelligence?',
        xp: 25,
        sub: 'AI Fundamentals',
        inPerson: false,
        slides: [
          { type: 'cover',     emoji: '🤖', title: 'Artificial Intelligence', body: 'The most transformative technology in human history is being built right now. Understanding it puts you ahead of most adults on the planet.' },
          { type: 'fact',      emoji: '🧠', title: 'What AI Actually Is',   body: 'Artificial Intelligence is software that can LEARN from data and improve its performance over time — without being explicitly programmed for every situation.\n\nRegular software follows exact rules a programmer wrote. AI software finds patterns in massive amounts of data and figures out the rules on its own.' },
          { type: 'list',      emoji: '📱', title: 'AI You Use Every Single Day', body: '📺 NETFLIX & YOUTUBE — AI analyzes what you watch and recommends what to watch next. It\'s why you get sucked in for hours.\n🎤 SIRI & ALEXA — Voice recognition AI that converts your speech to commands.\n📷 FACE UNLOCK — Computer vision AI that recognizes your face in milliseconds.\n💬 CHATGPT & CLAUDE — Language AI that can write, explain, code, and reason.\n🚗 SELF-DRIVING — AI that processes cameras, radar, and sensors to drive cars.\n🎮 GAME AI — AI opponents in video games that adapt to how you play.' },
          { type: 'list',      emoji: '⚙️', title: 'How AI Actually Learns', body: 'Here\'s how AI learns in simple steps:\n\n1. GATHER DATA — Feed the AI massive amounts of examples (text, images, numbers)\n2. FIND PATTERNS — The AI analyzes all the data and finds what usually follows what\n3. MAKE PREDICTIONS — It uses those patterns to make guesses\n4. GET FEEDBACK — It\'s told if its guess was right or wrong\n5. ADJUST — It tweaks itself to do better\n6. REPEAT — Billions of times\n\nThis is called "training" and it\'s what makes AI seem intelligent.' },
          { type: 'fact',      emoji: '💬', title: 'Language AI: ChatGPT & Claude', body: 'Language AI models like ChatGPT (made by OpenAI) and Claude (made by Anthropic) are trained on enormous amounts of text — books, websites, articles, code.\n\nThey learn the patterns of language so well that they can:\n• Answer questions\n• Write essays and stories\n• Explain complex topics simply\n• Write and debug code\n• Help you brainstorm ideas\n\nThey are tools — powerful ones — but they can be wrong. Always check important information.' },
          { type: 'tip',       emoji: '💡', title: 'Use AI Smart',           body: 'AI tools are powerful helpers but they are NOT always right. They can "hallucinate" — confidently state something false as if it\'s a fact.\n\nAlways:\n✅ Use AI as a starting point, not a final answer\n✅ Fact-check anything important\n✅ Think critically about what it tells you\n✅ Understand the topic yourself, not just what AI says\n\nThe most powerful person is one who uses AI as a tool while keeping their own brain sharp.' },
          { type: 'funfact',   emoji: '🌟', title: 'Fun Fact',              body: 'GPT-4 (the AI behind ChatGPT) was trained on roughly 1 TRILLION words of text. That\'s more text than any human being could read in thousands of lifetimes. The entire training process took months of running thousands of specialized computer chips simultaneously. It cost hundreds of millions of dollars to train.' },
          { type: 'fact',      emoji: '🚀', title: 'Why This Matters for YOU', body: 'AI is going to change almost every job that exists in the next 10-20 years. Some jobs will disappear. New jobs will appear. The people who will thrive are those who:\n\n• Understand how AI works\n• Know how to use AI tools effectively\n• Have skills AI can\'t replace — creativity, judgment, leadership, emotional intelligence\n\nLearning about AI now is one of the smartest things you can do for your future.' },
          { type: 'challenge', emoji: '🔥', title: 'Your Challenge',        body: 'Do all three of these:\n1. Ask ChatGPT or Claude to explain something you\'re struggling with in school right now\n2. Fact-check ONE specific thing it tells you using another source\n3. Ask it to quiz you on the topic it just explained\n\nWrite down: Was it helpful? Was anything wrong? How did it feel to use it?' },
          { type: 'recap',     emoji: '✅', title: 'What You Learned',      body: '• AI learns from data and finds patterns — it\'s not programmed with every answer\n• AI you use daily: Netflix recommendations, face unlock, Siri/Alexa, ChatGPT/Claude\n• AI learns by: gathering data → finding patterns → predicting → getting feedback → adjusting\n• ChatGPT and Claude are language AIs trained on trillions of words\n• AI can be wrong — always fact-check important information\n• Understanding AI now prepares you for the future' },
        ],
        quiz: [
          { q: 'According to this lesson, what makes AI different from regular software?', options: ['AI is faster', 'AI learns from data and finds patterns rather than following explicit rules', 'AI uses more electricity', 'AI always gives correct answers'], answer: 1 },
          { q: 'According to this lesson, Netflix recommending shows is an example of what?', options: ['Regular programming with fixed rules', 'AI analyzing your watching patterns to predict what you\'ll like', 'A human making recommendations', 'Random selection'], answer: 1 },
          { q: 'According to this lesson, what should you ALWAYS do with important information from AI?', options: ['Share it immediately on social media', 'Accept it as 100% accurate', 'Fact-check it from another source', 'Ask AI to repeat it'], answer: 2 },
          { q: 'According to this lesson, what is the first step in how AI learns?', options: ['Make predictions', 'Get feedback', 'Gather massive amounts of data', 'Adjust itself'], answer: 2 },
          { q: 'According to this lesson, which company makes Claude?', options: ['OpenAI', 'Google', 'Microsoft', 'Anthropic'], answer: 3 },
        ]
      },
    ]
  },

  // ─────────────────────────────────────────────────────────────────────────
  {
    id: 'fitness',
    name: 'Fitness & Health',
    icon: '💪',
    color: '#ff6b35',
    ageNote: 'All ages',
    desc: 'Strong body, strong mind',
    lessons: [
      {
        id: 'fit1',
        title: 'Building a Strong Body',
        xp: 20,
        sub: 'Fitness Fundamentals',
        inPerson: true,
        slides: [
          { type: 'cover',     emoji: '💪', title: 'Your Body is Your Foundation', body: 'You only get one body. Everything else in life — focus, energy, mood, confidence — runs on it.' },
          { type: 'list',      emoji: '🏋️', title: 'The 4 Pillars of Fitness', body: '💪 STRENGTH — Building muscle through resistance. Makes daily life easier, protects joints, boosts metabolism.\n\n❤️ CARDIOVASCULAR ENDURANCE — Heart and lung fitness. Running, swimming, biking. This is your engine.\n\n🧘 FLEXIBILITY — Range of motion. Stretching and mobility work prevents injuries and keeps you moving well.\n\n😴 RECOVERY — Muscles do NOT grow during exercise. They grow during REST. Sleep is when your body rebuilds stronger.' },
          { type: 'list',      emoji: '🏠', title: 'Bodyweight Workout (No Equipment)', body: 'This workout requires ZERO equipment. Do it 3-4 times per week:\n\n• 20 Push-ups (chest, shoulders, triceps)\n• 30 Squats (legs, glutes)\n• 20 Lunges each leg (legs, balance)\n• 30-second Plank (core)\n• 15 Burpees (full body, cardio)\n• 1-mile run or 20-minute brisk walk (cardio)\n\nStart where you are. If you can only do 5 push-ups, do 5. Add one per week.' },
          { type: 'list',      emoji: '🥗', title: 'Nutrition: What Your Body Runs On', body: '🍗 PROTEIN — Repairs and builds muscle. Found in: chicken, fish, eggs, beans, Greek yogurt. Eat protein at every meal.\n\n🍚 CARBOHYDRATES — Your body\'s main fuel source. Best sources: rice, oats, sweet potatoes, fruits, whole grain bread.\n\n🥑 HEALTHY FATS — Support your brain and hormones. Found in: avocado, nuts, olive oil, salmon.\n\n💧 WATER — Your body is 60% water. Dehydration kills performance, focus, and mood. Drink at least 8 glasses daily.' },
          { type: 'fact',      emoji: '😴', title: 'Sleep: The Secret Weapon', body: 'Most young people need 8-10 hours of sleep per night. During sleep:\n\n• Growth hormone is released (builds muscle and burns fat)\n• The brain processes and stores memories\n• The immune system repairs the body\n• Stress hormones drop\n\nSkipping sleep to work out more actually SLOWS your results. Sleep more, not less.' },
          { type: 'tip',       emoji: '💡', title: 'Consistency Beats Everything', body: '20 minutes of exercise every single day is DRAMATICALLY more effective than 2 hours of intense exercise once a week.\n\nThe secret isn\'t how hard you train — it\'s how consistently you show up. Decide right now that exercise is just something you do every day, like brushing your teeth. Make it non-negotiable.' },
          { type: 'funfact',   emoji: '🌟', title: 'Fun Fact',              body: 'Exercise increases the production of BDNF — Brain-Derived Neurotrophic Factor. Scientists call it "Miracle-Gro for the brain." Regular exercise:\n• Improves memory and learning\n• Reduces anxiety and depression\n• Increases focus and concentration\n• Literally grows new brain cells\n\nThe best "study drug" is a 20-minute run before you sit down to work.' },
          { type: 'challenge', emoji: '🔥', title: 'Your Challenge',        body: 'Complete the bodyweight workout listed in this lesson from start to finish with a parent watching to verify. Time how long it takes you.\n\nWrite down:\n• Your total time\n• Which exercise was hardest\n• How you felt afterward\n\nKeep this number. Next week, try to beat it.' },
          { type: 'recap',     emoji: '✅', title: 'What You Learned',      body: '• 4 Pillars: Strength, Cardiovascular Endurance, Flexibility, Recovery\n• Muscles grow during REST, not during exercise\n• Bodyweight workout: push-ups, squats, lunges, plank, burpees, run\n• Protein builds muscle, carbs fuel energy, fats support brain\n• Sleep 8-10 hours — growth hormone is released during sleep\n• Consistency every day beats intense workouts once a week\n• Exercise produces BDNF — literally improves brain function' },
        ],
        quiz: [
          { q: 'According to this lesson, WHEN do muscles actually grow?', options: ['During intense exercise', 'While eating protein', 'During REST and sleep', 'While running'], answer: 2 },
          { q: 'According to this lesson, which nutrient primarily repairs and builds muscle?', options: ['Carbohydrates', 'Healthy Fats', 'Water', 'Protein'], answer: 3 },
          { q: 'According to this lesson, what is BDNF?', options: ['A type of protein supplement', 'A Brain-Derived Neurotrophic Factor that improves brain function', 'A fitness tracking app', 'A type of exercise'], answer: 1 },
          { q: 'According to this lesson, how many hours of sleep do most young people need?', options: ['5-6 hours', '6-7 hours', '8-10 hours', '11-12 hours'], answer: 2 },
          { q: 'According to this lesson, what is more effective for long-term results?', options: ['2 hours of intense exercise once a week', '20 minutes of exercise every single day', 'Only exercising when you feel motivated', 'Working out as hard as possible once a month'], answer: 1 },
        ]
      },
    ]
  },

  // ─────────────────────────────────────────────────────────────────────────
  {
    id: 'music',
    name: 'Music',
    icon: '🎵',
    color: '#e91e8c',
    ageNote: 'All ages',
    desc: 'Theory, rhythm, and expression',
    lessons: [
      {
        id: 'mus1',
        title: 'How Music Works',
        xp: 20,
        sub: 'Music Theory Basics',
        inPerson: false,
        slides: [
          { type: 'cover',     emoji: '🎵', title: 'How Music Works',        body: 'Music is organized sound. Every song ever created — from ancient drums to modern hip-hop — uses the same fundamental building blocks.' },
          { type: 'list',      emoji: '🎼', title: 'The 5 Building Blocks of Music', body: '🎵 NOTES — Individual sounds with specific pitches. There are 12 unique notes in Western music: A, A#, B, C, C#, D, D#, E, F, F#, G, G#\n\n🥁 RHYTHM — The pattern of beats over time. What makes you nod your head or clap along.\n\n🎶 MELODY — A specific sequence of notes that forms a recognizable tune. The part you hum.\n\n🎹 HARMONY — Multiple notes played together that sound pleasing. Chords are harmony.\n\n⏱️ TEMPO — How fast or slow the music moves, measured in BPM (Beats Per Minute).' },
          { type: 'fact',      emoji: '😊', title: 'Major vs Minor Keys',   body: 'Songs are written in a KEY — a home base set of notes the music revolves around.\n\nMAJOR KEY → Generally sounds happy, bright, triumphant, uplifting\nMINOR KEY → Generally sounds sad, dark, mysterious, tense\n\nExamples:\n• "Happy Birthday" → Major key (sounds happy)\n• Beethoven\'s "Moonlight Sonata" → Minor key (sounds dark and moody)\n• Most pop songs → Major key\n• Most horror movie music → Minor key' },
          { type: 'fact',      emoji: '⏱️', title: 'Rhythm and BPM',        body: 'BPM stands for BEATS PER MINUTE — it measures how fast a song moves.\n\nSlow song: 60-80 BPM (about one beat per second)\nConversation pace: 80-100 BPM\nUpbeat pop: 100-130 BPM\nDance music: 120-160 BPM\nFast hip-hop: 80-100 BPM (but doubled to 160-200)\n\nWhen you tap your foot to music, you\'re feeling the BEAT — the steady pulse underneath everything.' },
          { type: 'tip',       emoji: '💡', title: 'Train Your Ear',         body: 'The best way to understand music is to ACTIVELY listen — not just have it in the background.\n\nNext time you listen to a song:\n• Can you tap along to the beat?\n• Does it feel happy or sad? (major or minor?)\n• Can you hum the melody separately from the rest?\n• Can you identify when the tempo speeds up or slows down?\n\nThis is ear training. The more you practice, the more you hear.' },
          { type: 'funfact',   emoji: '🌟', title: 'Fun Fact',              body: 'Wolfgang Amadeus Mozart wrote his first symphony at age 8. He had composed over 600 works by the time he died at 35. Stevie Wonder signed his first record deal at age 11. Both started playing instruments as toddlers.\n\nMusical ability can develop at any age — but the earlier you start, the deeper the neural pathways grow.' },
          { type: 'fact',      emoji: '🧠', title: 'Music and the Brain',   body: 'Playing music is one of the most complex activities a human brain can perform. It simultaneously uses:\n• Both hemispheres of the brain\n• Fine motor control\n• Memory\n• Auditory processing\n• Mathematical pattern recognition\n• Emotional regulation\n\nStudies consistently show that musicians have more developed brains in areas related to memory, language processing, and executive function.' },
          { type: 'challenge', emoji: '🔥', title: 'Your Challenge',        body: 'Listen to one song in a MAJOR key and one in a MINOR key today. For each one, write down:\n1. The name of the song\n2. Whether it\'s major or minor (how did you tell?)\n3. Approximately how fast it is (slow, medium, fast?)\n4. How it made you feel\n\nThis is your first step in ear training.' },
          { type: 'recap',     emoji: '✅', title: 'What You Learned',      body: '• 5 building blocks: Notes, Rhythm, Melody, Harmony, Tempo\n• 12 unique notes in Western music\n• Major key = happy/bright. Minor key = sad/dark.\n• BPM = Beats Per Minute — measures tempo\n• Tapping your foot = feeling the beat\n• Playing music develops both sides of the brain simultaneously' },
        ],
        quiz: [
          { q: 'According to this lesson, how many unique notes are there in Western music?', options: ['7', '8', '10', '12'], answer: 3 },
          { q: 'According to this lesson, what does "BPM" stand for?', options: ['Bass Per Measure', 'Beats Per Minute', 'Best Piano Music', 'Bars Per Melody'], answer: 1 },
          { q: 'According to this lesson, which key generally sounds happy and bright?', options: ['Minor key', 'Major key', 'Flat key', 'Sharp key'], answer: 1 },
          { q: 'According to this lesson, what is "melody"?', options: ['Multiple notes played together as chords', 'The pattern of beats', 'A specific sequence of notes that forms a recognizable tune', 'How fast the music moves'], answer: 2 },
          { q: 'According to this lesson, at what age did Mozart write his first symphony?', options: ['Age 5', 'Age 8', 'Age 12', 'Age 16'], answer: 1 },
        ]
      },
    ]
  },

  // ─────────────────────────────────────────────────────────────────────────
  {
    id: 'leadership',
    name: 'Leadership',
    icon: '🦁',
    color: '#f5a623',
    ageNote: 'Ages 10+',
    desc: 'Leading people and leading yourself',
    lessons: [
      {
        id: 'lead1',
        title: 'What Makes a Leader',
        xp: 25,
        sub: 'Leadership Fundamentals',
        inPerson: false,
        slides: [
          { type: 'cover',     emoji: '🦁', title: 'What is Leadership?',    body: 'It\'s not the loudest voice in the room. It\'s not the most popular person. Real leadership is something completely different.' },
          { type: 'fact',      emoji: '📖', title: 'What Leadership Actually Is', body: 'Leadership is the ability to influence others toward a goal while taking responsibility for the outcome — whether it goes well or badly.\n\nNote what\'s missing from that definition: power, title, age, or popularity. Real leadership doesn\'t require any of those things. It only requires influence and accountability.' },
          { type: 'list',      emoji: '⭐', title: '5 Things Real Leaders Do', body: '👣 LEAD BY EXAMPLE — They do the hard things first. They never ask others to do what they won\'t do themselves.\n\n👂 LISTEN MORE THAN THEY TALK — Great leaders understand before they direct.\n\n⚡ MAKE DECISIONS — They gather info, decide, and commit. They don\'t freeze.\n\n🎯 OWN IT WHEN THINGS GO WRONG — No excuses, no blame. "I\'m responsible."\n\n🌱 DEVELOP OTHERS — They make the people around them better.' },
          { type: 'fact',      emoji: '👂', title: 'The Listening Secret',   body: 'Studies of effective leaders show they speak LESS than the people they lead. They ask more questions than they give answers. They listen to understand, not just to respond.\n\nWhen people feel heard, they trust the leader more and work harder. When a leader talks over people or dismisses their ideas, they lose loyalty fast.' },
          { type: 'list',      emoji: '🏠', title: 'Leadership at Your Age Right Now', body: 'You don\'t need a title. Leadership at your age looks like:\n\n• Being the one who organizes when others are confused\n• Speaking up when something isn\'t right, even when it\'s uncomfortable\n• Being completely reliable — doing exactly what you said you would\n• Helping younger siblings without being asked\n• Being the calm person when others are panicking\n• Taking initiative on tasks before anyone tells you to' },
          { type: 'tip',       emoji: '💡', title: 'No Title Needed',        body: 'Leadership is a BEHAVIOR, not a position. Anyone — at any age, in any situation — can choose to act like a leader right now.\n\nYou don\'t need to be the oldest, the biggest, the strongest, or the most popular. You just need to:\n1. See what needs to be done\n2. Do it\n3. Take responsibility for it' },
          { type: 'funfact',   emoji: '🌟', title: 'Fun Fact',              body: 'Research from Harvard Business School found that the most effective leaders are NOT the most aggressive, charismatic, or outgoing people. They are consistently the most TRUSTWORTHY and RELIABLE.\n\nPeople follow who they trust. Trust is built one kept promise, one owned mistake, and one honest conversation at a time.' },
          { type: 'challenge', emoji: '🔥', title: 'Your Challenge',        body: 'This week, identify ONE situation where you can take initiative without being asked. It could be:\n• Organizing something at home\n• Helping a sibling with something hard\n• Speaking up about something that isn\'t right\n• Taking on a responsibility nobody assigned you\n\nDo it. Then tell a parent what you did and why. Reflect on how it felt.' },
          { type: 'recap',     emoji: '✅', title: 'What You Learned',      body: '• Leadership = influencing others toward a goal + taking responsibility for outcomes\n• No title needed — it\'s a behavior anyone can choose\n• 5 things leaders do: lead by example, listen more, make decisions, own mistakes, develop others\n• Effective leaders speak LESS and listen MORE\n• Trust is the foundation — built through reliability and honesty\n• Leadership at your age: organize, speak up, be reliable, help others, stay calm' },
        ],
        quiz: [
          { q: 'According to this lesson, what is the definition of leadership?', options: ['Having the most followers', 'Being the loudest and most popular', 'Influencing others toward a goal while taking responsibility for the outcome', 'Having an official title or position'], answer: 2 },
          { q: 'According to this lesson, what do great leaders do MORE than most people expect?', options: ['Talk and give orders', 'Listen and ask questions', 'Take credit for success', 'Show how much they know'], answer: 1 },
          { q: 'According to this lesson, do you need a title to be a leader?', options: ['Yes — you must be appointed by someone', 'Yes — only adults can lead', 'No — leadership is a behavior anyone can choose', 'Only if you\'re over 18'], answer: 2 },
          { q: 'According to the Harvard research mentioned in this lesson, what makes the most effective leaders?', options: ['Being the most aggressive', 'Being the most charismatic', 'Being the most trustworthy and reliable', 'Being the most outgoing'], answer: 2 },
          { q: 'According to this lesson, which of these is an example of leadership at your age?', options: ['Waiting to be told what to do', 'Taking initiative on a task before anyone assigns it to you', 'Letting others handle the hard stuff', 'Only helping when you feel like it'], answer: 1 },
        ]
      },
    ]
  },

]
