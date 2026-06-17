// Crossword puzzle solver: place words on a grid such that
// all 26 letters are used exactly once, everything is connected,
// and every run of 2+ consecutive cells is a valid word.

// Large word list
const WORDS = new Set(`
AB AD AE AG AH AI AL AM AN AR AS AT AW AX AY BA BE BI BO BY DA DE DO ED EF EH
EL EM EN ER ES ET EX FA FE GI GO HA HE HI HM HO ID IF IN IS IT JO KA KI LA LI
LO MA ME MI MO MU MY NA NE NO NU OD OE OF OH OI OK OM ON OP OR OS OW OX OY PA
PE PI PO QI RE SH SI SO TA TI TO UH UM UN UP US UT WE WO XI XU YA YE YO ZA
ACE ACT ADS AGE AID AIM AIR ALE ALL AND ANT APE ARC ARE ARK ARM ART ASH ATE AWE
AXE BAD BAG BAN BAR BAT BAY BED BET BIG BIT BOW BOX BOY BUD BUG BUN BUS BUT BUY
CAB CAN CAP CAR CAT COB COD COP COT COW CRY CUB CUD CUP CUR CUT DAB DAM DAY DEN
DEW DIG DIM DIN DIP DOC DOG DOT DRY DUB DUD DUE DUG DUN DUO DYE EAR EAT EEL ELF
ELK ELM EMU END ERA EVE EWE FAN FAR FAT FAX FED FEW FIG FIN FIT FIX FLU FLY FOB
FOG FOP FOR FOX FRY FUN FUR GAB GAP GAS GAY GEL GEM GET GIN GNU GOB GOD GOT GUM
GUN GUT GUY GYM HAD HAM HAS HAT HAY HEM HEN HER HEW HEX HID HIM HIP HIS HIT HOB
HOG HOP HOT HOW HUB HUE HUG HUM HUT ICE ICY IMP INK ION IRE IRK IVY JAB JAG JAM
JAR JAW JAY JET JIG JOB JOG JOT JOY JUG JUT KEG KEN KEY KID KIN KIT LAB LAD LAG
LAP LAW LAX LAY LED LEG LET LID LIE LIP LIT LOG LOT LOW LUG MAD MAN MAP MAR MAT
MAW MAX MAY MEN MET MIX MOB MOD MOM MOP MOW MUD MUG NAB NAG NAP NET NEW NIL NIT
NOB NOD NOR NOT NOW NUB NUN NUT OAK OAR OAT ODE OFT OIL OLD ONE OPT ORB ORE OUR
OUT OWE OWL OWN PAD PAN PAT PAW PAY PEA PEG PEN PEW PIE PIG PIN PIT PLY POD POT
POW PRY PUB PUG PUN PUS PUT RAG RAM RAN RAP RAT RAW RAY RED REF RIB RID RIG RIM
RIP ROB ROD ROT ROW RUB RUG RUM RUN RUT RYE SAC SAD SAG SAP SAT SAW SAY SEA SET
SEW SHE SHY SIN SIP SIR SIS SIT SIX SKI SKY SLY SOB SOD SON SOP SOT SOW SOY SPA
SPY STY SUB SUM SUN SUP TAB TAD TAG TAN TAP TAR TAX TEA TEN THE TIE TIN TIP TOE
TON TOO TOP TOW TOY TRY TUB TUG TWO URN USE VAN VAT VET VEX VIA VIE VOW WAD WAR
WAX WAY WEB WED WET WHO WHY WIG WIN WIT WOE WOK WON WOW YAK YAM YAP YAW YEA YES
YET YEW YIN ZAP ZEN ZIP ZIT
BACK BALD BALM BAND BANE BANK BARE BARK BARN BASE BATH BEAD BEAK BEAM BEAN BEAR
BEAT BELT BEND BENT BEST BIKE BIND BIRD BITE BLOW BLUE BLUR BOAT BODY BOLD BOLT
BOND BONE BORN BOTH BOWL BULK BUMP BURN CAFE CAGE CAKE CALM CAME CAMP CAPE CARD
CARE CART CASE CASH CAST CAVE CHEW CHIN CHIP CHOP CLAD CLAM CLAP CLAY CLIP CLOD
CLUB CLUE COAL COAT CODE COIL COLD COME CONE COPE CORD CORE CORK CORN COST COVE
CREW CROP CROW CUBE CULT CURB CURE CURL CUTE DAMP DARE DARK DART DAWN DEAL DEAR
DECK DENY DESK DIAL DICE DIET DINE DIRE DIRT DOCK DOME DONE DOSE DOVE DOWN DOZE
DRAG DRAW DROP DRUM DUAL DUEL DUMB DUMP DUNE DUNK DUSK DUST EACH EARN EASE EAST
EDGE EMIT ENVY EPIC EVEN EVIL EXAM FACE FACT FADE FAIL FAIR FAKE FAME FANG FARE
FARM FAST FATE FAWN FAZE FEAR FEAT FELT FEND FERN FILE FILM FIND FINE FIRE FIRM
FISH FIST FIVE FLAG FLAP FLAT FLAW FLEA FLED FLEW FLEX FLIP FLOG FLOW FLUX FOAM
FOIL FOLD FOLK FOND FONT FORE FORK FORM FORT FOUL FOUR FOWL FROM FROG FUEL FUME
FUND FURY FUSE GAIT GALE GAME GAPE GARB GATE GAVE GAWK GAZE GEAR GIFT GILD GILT
GIVE GLAD GLEN GLIB GLOW GLUE GLUM GLUT GNAT GNAW GOAD GOAL GOAT GOLD GOLF GONE
GORE GORY GOWN GRAB GRAM GRAY GREW GRID GRIM GRIN GRIP GRIT GROW GULF GUST GUTS
HACK HAIL HAIR HALE HALF HALT HAND HANG HARD HARE HARM HARP HATE HAVE HAZE HEAD
HEAL HEAP HEAR HEAT HELP HERB HERD HERO HIDE HIKE HILL HILT HIND HINT HIRE HIVE
HOLD HOLE HOME HONE HOPE HORN HOSE HOST HOUR HOWL HUGE HULK HUMP HUNG HUNT HURL
HURT HUSK HYMN IDEA IDLE IRON ISLE ITEM JACK JADE JAIL JAMS JARS JAWS JAZZ JERK
JEST JETS JIVE JOBS JOIN JOKE JOLT JOTS JOWL JOYS JUDO JUMP JUNK JURY JUST JUTS
KALE KEEN KELP KEPT KEYS KICK KILT KIND KING KITE KNOB KNOT KNOW LACE LACK LAID
LAIR LAKE LAMB LAME LAMP LAND LANE LARD LARK LASH LAST LATE LAWN LAZY LEAD LEAF
LEAK LEAN LEAP LEFT LEND LENS LENT LEVY LICK LIED LIFE LIFT LIKE LIMB LIME LIMP
LINE LINK LION LIST LIVE LOAD LOAF LOAN LOCK LOFT LONE LONG LOOK LOOM LORD LORE
LOSE LOST LOUD LOVE LUCK LUMP LUNG LURK LUSH LUST LYNX MACE MADE MAID MAIL MAIN
MAKE MALE MALT MANE MAPS MARE MARK MASH MASK MAST MATE MATH MAZE MEAD MEAL MEAN
MEAT MELD MELT MEND MENU MESH MILD MILK MIND MINE MINT MIRE MIST MOAN MOAT MOCK
MODE MOLD MOLE MONK MOOD MOPE MORE MOST MOTH MOVE MUCH MULE MUSE MUSK MUST MUTE
MYTH NAIL NAME NAVY NEAR NEAT NECK NEED NEST NEWS NEXT NICE NODE NORM NOSE NOTE
NOUN NUMB OATH OATS OBEY OILS OMEN OMIT ONCE ONLY ONTO OPEN OPTS ORAL ORCA OVEN
OVER PACE PACK PACT PAGE PAID PAIL PAIN PAIR PALE PALM PANE PARK PART PAST PATH
PAVE PAWN PEAK PEAR PECK PEEL PELT PENS PERK PEST PICK PIER PIKE PILE PINE PINK
PINT PLAN PLAY PLEA PLOT PLOW PLOY PLUG PLUM PLUS POCK POEM POET POKE POLE POND
PORE PORK PORT POSE POST POUR PREY PROD PUCK PULP PUMP PUNK PURE PUSH QUIT QUIZ
RACK RAFT RAGE RAID RAIL RAIN RAKE RAMP RANG RANK RANT RASH RATE RAVE READ REAL
REAP REED REEL REIN RELY REND RENT REST RICE RICH RIDE RIFT RILE RIME RIND RING
RINK RIOT RISE RISK ROAD ROAM ROBE ROCK RODE ROLE ROOF ROPE ROSE ROTE ROUT ROVE
RUDE RUIN RULE RUMP RUNG RUNT RUSH RUST SACK SAFE SAGE SAID SAIL SAKE SALE SALT
SAME SAND SANE SANG SANK SAVE SCAN SCAR SEAL SEAM SEAT SEED SEEK SELF SEND SENT
SHED SHIN SHIP SHOE SHOP SHOT SHOW SHUT SICK SIDE SIFT SIGH SIGN SILK SILT SINK
SIRE SITE SIZE SKID SKIM SKIN SKIP SKIT SLAB SLAG SLAM SLAP SLAT SLAW SLED SLEW
SLID SLIM SLIP SLIT SLOB SLOP SLOT SLOW SLUG SMOG SNAP SNIP SNOB SNUG SOAK SOAP
SOAR SOCK SOFT SOIL SOLD SOLE SOME SONG SORE SORT SOUL SOUR SPAN SPAR SPED SPIN
SPIT SPOT SPUD SPUR STAB STAG STAR STAY STEM STEP STEW STIR STOP STOW STUB STUD
STUN SWAY SWIM SWUM TACK TACT TAIL TAKE TALE TALK TANK TAPE TARN TASK TAXI TEAK
TEAL TEAM TEAR TEMP TEND TENS TENT TERM TERN TEXT THAN THAT THAW THEM THEN THEY
THIN TICK TIDE TIDY TIED TIER TILE TILT TIME TINE TINY TIRE TOAD TOIL TOLD TONE
TOPS TORE TORN TRAM TRAP TRAY TREK TRIM TRIO TRIP TROD TRUE TUBE TUCK TUFT TUNA
TUNE TURF TURN TUSK TWIN TYPE UNDO UNIT UNTO UPON URGE USED VAIN VALE VANE VARY
VASE VAST VEAL VEIL VEIN VENT VERB VEST VETO VIEW VILE VINE VOID VOLT VOTE VOWS
WADE WAGE WAIL WAIT WAKE WALK WAND WANT WARD WARM WARN WARP WART WARY WASH WASP
WAVE WAVY WAXY WEAK WEAN WEAR WEED WELD WELT WENT WEST WHAT WHEN WHIM WHIP WHOM
WICK WIDE WIFE WILD WILT WILY WIMP WIND WINE WING WINK WIPE WIRE WISE WISH WISP
WITH WITS WOKE WOLF WOMB WOOD WORD WORE WORK WORM WORN WOVE WRAP WREN WRIT YACK
YANK YARD YARN YAWN YEAR YELP YOGA YOKE YOLK YOUR ZANY ZEAL ZERO ZEST ZINC ZONE
JAMB JIBS JIVE JOCK JOWL JUDO JUMP JUNK JUST JUTS FLUX LYNX ONYX ORYX JINX APEX
QUAY QOPH QUALM QUARK QUASH QUICK QUILT QUIRK QUOTA CHUNK CLUMP CRUMB DWARF FJORD
GLYPH GRIMY GRUMP IVORY KRAFT LYMPH NYMPH PLUMB PROWL SQUID STOVE THUMP VAULT
WALTZ WHELK BUMPY FIXED JUNKY VIXEN SWIFT PRISM FROST CRIMP WHOMP BLIMP FLOCK CRYPT
`.trim().split(/\s+/).map(w => w.toUpperCase()));

function extractRuns(grid) {
  const runs = [];
  const H = grid.length;
  for (let r = 0; r < H; r++) {
    const W = grid[r].length;
    let start = -1;
    for (let c = 0; c <= W; c++) {
      if (c < W && grid[r][c]) { if (start === -1) start = c; }
      else { if (start !== -1 && c - start >= 2) runs.push(grid[r].slice(start, c).join("")); start = -1; }
    }
  }
  const maxW = Math.max(...grid.map(r => r.length));
  for (let c = 0; c < maxW; c++) {
    let start = -1;
    for (let r = 0; r <= H; r++) {
      if (r < H && c < grid[r].length && grid[r][c]) { if (start === -1) start = r; }
      else { if (start !== -1 && r - start >= 2) { const w = []; for (let rr = start; rr < r; rr++) w.push(grid[rr][c]); runs.push(w.join("")); } start = -1; }
    }
  }
  return runs;
}

function isConnected(grid) {
  const cells = [];
  for (let r = 0; r < grid.length; r++)
    for (let c = 0; c < grid[r].length; c++)
      if (grid[r][c]) cells.push([r, c]);
  if (cells.length <= 1) return true;
  const set = new Set(cells.map(([r,c]) => `${r},${c}`));
  const visited = new Set();
  const q = [cells[0]];
  visited.add(`${cells[0][0]},${cells[0][1]}`);
  while (q.length) {
    const [r,c] = q.shift();
    for (const [dr,dc] of [[0,1],[0,-1],[1,0],[-1,0]]) {
      const k = `${r+dr},${c+dc}`;
      if (set.has(k) && !visited.has(k)) { visited.add(k); q.push([r+dr,c+dc]); }
    }
  }
  return visited.size === cells.length;
}

function verify(name, grid) {
  const letters = [];
  for (const row of grid) for (const c of row) if (c) letters.push(c);
  const set = new Set(letters);
  const missing = [..."ABCDEFGHIJKLMNOPQRSTUVWXYZ"].filter(l => !set.has(l));
  const dupes = letters.filter((l,i) => letters.indexOf(l) !== i);
  const runs = extractRuns(grid);
  const badWords = runs.filter(w => !WORDS.has(w));
  const connected = isConnected(grid);

  console.log(`\n=== ${name} ===`);
  for (const row of grid) console.log("  " + row.map(c => c || ".").join(" "));
  console.log(`  Letters: ${letters.length}, Unique: ${set.size}, Missing: ${missing.join("")}`);
  if (dupes.length) console.log(`  Duplicates: ${dupes.join(",")}`);
  console.log(`  Connected: ${connected}`);
  console.log(`  Words: ${runs.join(", ")}`);
  if (badWords.length) console.log(`  Invalid: ${badWords.join(", ")}`);
  console.log(set.size === 26 && !dupes.length && connected && !badWords.length ? "  VALID!" : "  INVALID");
}

// =============================================================
// BRUTE FORCE SOLVER
// Build grid by placing one word at a time with backtracking.
// =============================================================

// Get all words as array, filtered to unique internal letters
const allWords = [...WORDS].filter(w => w.length >= 2 && new Set(w).size === w.length);

// Index by letter
const byLetter = {};
for (const l of "ABCDEFGHIJKLMNOPQRSTUVWXYZ") byLetter[l] = [];
for (const w of allWords) for (const l of new Set(w)) byLetter[l].push(w);

function solve() {
  const SIZE = 21;
  const grid = Array.from({length: SIZE}, () => Array(SIZE).fill(null));
  const usedLetters = new Set();
  const placedWords = [];

  function getCell(r, c) { return (r >= 0 && r < SIZE && c >= 0 && c < SIZE) ? grid[r][c] : null; }

  function canPlace(word, row, col, dir) {
    // Check all letters fit, no conflicts, no reuse
    for (let i = 0; i < word.length; i++) {
      const r = dir === "H" ? row : row + i;
      const c = dir === "H" ? col + i : col;
      if (r < 0 || r >= SIZE || c < 0 || c >= SIZE) return false;
      const existing = grid[r][c];
      if (existing) {
        if (existing !== word[i]) return false;
        // This is a crossing point — letter already placed, OK
      } else {
        if (usedLetters.has(word[i])) return false;
        // Check no parallel adjacency (crossword rule)
        if (dir === "H") {
          if (getCell(r-1, c) || getCell(r+1, c)) return false;
        } else {
          if (getCell(r, c-1) || getCell(r, c+1)) return false;
        }
      }
    }
    // Check nothing immediately before/after the word
    if (dir === "H") {
      if (getCell(row, col-1)) return false;
      if (getCell(row, col + word.length)) return false;
    } else {
      if (getCell(row-1, col)) return false;
      if (getCell(row + word.length, col)) return false;
    }
    // Must cross at least one existing letter (unless first word)
    if (placedWords.length > 0) {
      let crosses = false;
      for (let i = 0; i < word.length; i++) {
        const r = dir === "H" ? row : row + i;
        const c = dir === "H" ? col + i : col;
        if (grid[r][c]) { crosses = true; break; }
      }
      if (!crosses) return false;
    }
    return true;
  }

  function placeWord(word, row, col, dir) {
    const newCells = [];
    for (let i = 0; i < word.length; i++) {
      const r = dir === "H" ? row : row + i;
      const c = dir === "H" ? col + i : col;
      if (!grid[r][c]) {
        grid[r][c] = word[i];
        usedLetters.add(word[i]);
        newCells.push([r, c]);
      }
    }
    placedWords.push({ word, row, col, dir, newCells });
  }

  function undoLast() {
    const p = placedWords.pop();
    for (const [r, c] of p.newCells) {
      usedLetters.delete(grid[r][c]);
      grid[r][c] = null;
    }
  }

  // Find the rarest unused letter and words containing it
  function getRareLetter() {
    let best = null, bestCount = Infinity;
    for (const l of "QXZJKVBPYWFMGCDHLNRSUTIOE") {
      if (usedLetters.has(l)) continue;
      const count = byLetter[l].filter(w =>
        [...new Set(w)].every(c => !usedLetters.has(c) || grid.some((row, ri) =>
          row.some((cell, ci) => cell === c)))
      ).length;
      if (count < bestCount) { bestCount = count; best = l; }
    }
    return best;
  }

  function findPlacements(word) {
    const placements = [];
    // Find crossing points with existing grid
    for (let i = 0; i < word.length; i++) {
      const letter = word[i];
      // Find this letter in the grid
      for (let r = 0; r < SIZE; r++) {
        for (let c = 0; c < SIZE; c++) {
          if (grid[r][c] !== letter) continue;
          // Try crossing here
          // If cell is part of a horizontal word, new word goes vertical (and vice versa)
          // Try both directions
          for (const dir of ["H", "V"]) {
            const row = dir === "H" ? r : r - i;
            const col = dir === "H" ? c - i : c;
            if (canPlace(word, row, col, dir)) {
              placements.push({ row, col, dir });
            }
          }
        }
      }
    }
    return placements;
  }

  let bestSolution = null;
  let attempts = 0;

  function backtrack(depth) {
    attempts++;
    if (attempts > 500000) return false;

    if (usedLetters.size === 26) {
      // Verify all runs are valid words
      const trimmed = trimGrid(grid);
      const runs = extractRuns(trimmed);
      if (runs.every(w => WORDS.has(w))) {
        bestSolution = trimmed.map(r => [...r]);
        return true;
      }
      return false;
    }

    if (depth > 15) return false;

    const rare = getRareLetter();
    if (!rare) return false;

    // Get candidate words containing this letter
    const candidates = byLetter[rare].filter(w => {
      const wLetters = [...new Set(w)];
      return wLetters.every(l => !usedLetters.has(l) ||
        grid.flat().includes(l)); // OK if letter exists in grid (crossing)
    });

    // Shuffle for variety
    candidates.sort(() => Math.random() - 0.5);

    for (const word of candidates.slice(0, 50)) {
      // Check that new letters in this word aren't already used
      const newLetters = [...new Set(word)].filter(l => !usedLetters.has(l));
      if (newLetters.some(l => usedLetters.has(l))) continue;

      const placements = findPlacements(word);
      if (placements.length === 0 && placedWords.length === 0) {
        // First word — place in center
        const row = 10, col = Math.floor((SIZE - word.length) / 2);
        if (canPlace(word, row, col, "H")) {
          placeWord(word, row, col, "H");
          if (backtrack(depth + 1)) return true;
          undoLast();
        }
      } else {
        for (const p of placements.slice(0, 10)) {
          placeWord(word, p.row, p.col, p.dir);
          if (backtrack(depth + 1)) return true;
          undoLast();
        }
      }
    }

    return false;
  }

  function trimGrid(g) {
    let minR = g.length, maxR = 0, minC = g[0].length, maxC = 0;
    for (let r = 0; r < g.length; r++)
      for (let c = 0; c < g[r].length; c++)
        if (g[r][c]) { minR = Math.min(minR,r); maxR = Math.max(maxR,r); minC = Math.min(minC,c); maxC = Math.max(maxC,c); }
    if (minR > maxR) return [[]];
    return Array.from({length: maxR-minR+1}, (_, ri) =>
      Array.from({length: maxC-minC+1}, (_, ci) => g[minR+ri][minC+ci]));
  }

  console.log("Solving...");
  for (let trial = 0; trial < 50; trial++) {
    attempts = 0;
    if (backtrack(0)) {
      console.log(`Found solution on trial ${trial+1} after ${attempts} attempts!`);
      return bestSolution;
    }
    console.log(`Trial ${trial+1}: no solution in ${attempts} attempts`);
  }
  return null;
}

const result = solve();
if (result) {
  verify("Generated Puzzle", result);
  console.log("\nJSON:");
  console.log(JSON.stringify(result));
} else {
  console.log("No solution found");
}
