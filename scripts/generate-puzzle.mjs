// Generate valid puzzles: all 26 letters used once, fully connected,
// every horizontal/vertical run of 2+ letters is a real word.

const WORDS_RAW = [
  "ACE","ACT","AGE","AID","AIM","AIR","ALE","AND","ANT","APE","ARC","ARE","ARK",
  "ARM","ART","ASH","ATE","AWE","AXE","BAD","BAG","BAN","BAR","BAT","BAY","BED",
  "BET","BIG","BIT","BOW","BOX","BOY","BUD","BUG","BUN","BUS","BUT","BUY","CAB",
  "CAN","CAP","CAR","CAT","COB","COD","COP","COT","COW","CRY","CUB","CUD","CUP",
  "CUR","CUT","DAB","DAM","DAY","DEN","DEW","DIG","DIM","DIN","DIP","DOC","DOG",
  "DOT","DRY","DUB","DUD","DUE","DUG","DUN","DUO","DYE","EAR","EAT","ELF","ELK",
  "ELM","EMU","END","ERA","EVE","EWE","FAN","FAR","FAT","FAX","FED","FEW","FIG",
  "FIN","FIT","FIX","FLY","FOB","FOG","FOP","FOR","FOX","FRY","FUN","FUR","GAB",
  "GAP","GAS","GAY","GEL","GEM","GET","GIN","GNU","GOB","GOD","GOT","GUM","GUN",
  "GUT","GUY","GYM","HAD","HAM","HAS","HAT","HAY","HEM","HEN","HER","HEW","HEX",
  "HID","HIM","HIP","HIS","HIT","HOB","HOG","HOP","HOT","HOW","HUB","HUE","HUG",
  "HUM","HUT","ICE","ICY","IMP","INK","ION","IRE","IRK","IVY","JAB","JAG","JAM",
  "JAR","JAW","JAY","JET","JIG","JOB","JOG","JOT","JOY","JUG","JUT","KEG","KEN",
  "KEY","KID","KIN","KIT","LAB","LAD","LAG","LAP","LAW","LAX","LAY","LED","LEG",
  "LET","LID","LIE","LIP","LIT","LOG","LOT","LOW","LUG","MAD","MAN","MAP","MAR",
  "MAT","MAW","MAX","MAY","MEN","MET","MIX","MOB","MOD","MOP","MOW","MUD","MUG",
  "NAB","NAG","NAP","NET","NEW","NIL","NIT","NOB","NOD","NOR","NOT","NOW","NUB",
  "NUT","OAK","OAR","OAT","ODE","OFT","OIL","OLD","ONE","OPT","ORB","ORE","OUR",
  "OUT","OWE","OWL","OWN","PAD","PAN","PAT","PAW","PAY","PEA","PEG","PEN","PEW",
  "PIE","PIG","PIN","PIT","PLY","POD","POT","POW","PRY","PUB","PUG","PUN","PUS",
  "PUT","RAG","RAM","RAN","RAP","RAT","RAW","RAY","RED","REF","RIB","RID","RIG",
  "RIM","RIP","ROB","ROD","ROT","ROW","RUB","RUG","RUM","RUN","RUT","RYE","SAC",
  "SAD","SAG","SAP","SAT","SAW","SAY","SEA","SET","SEW","SHE","SHY","SIN","SIP",
  "SIR","SIT","SIX","SKI","SKY","SLY","SOB","SOD","SON","SOP","SOT","SOW","SOY",
  "SPA","SPY","STY","SUB","SUM","SUN","SUP","TAB","TAD","TAG","TAN","TAP","TAR",
  "TAX","TEA","TEN","THE","TIE","TIN","TIP","TOE","TON","TOP","TOW","TOY","TRY",
  "TUB","TUG","TWO","URN","USE","VAN","VAT","VET","VEX","VIA","VIE","VOW","WAD",
  "WAR","WAX","WAY","WEB","WED","WET","WHO","WHY","WIG","WIN","WIT","WOE","WOK",
  "WON","WOW","YAK","YAM","YAP","YAW","YEA","YES","YET","YEW","YIN","ZAP","ZEN",
  "ZIP","ZIT",
  "BACK","BALD","BALM","BAND","BANE","BANK","BARE","BARK","BARN","BASE","BATH",
  "BEAD","BEAK","BEAM","BEAN","BEAR","BEAT","BELT","BEND","BENT","BEST","BIKE",
  "BIND","BIRD","BITE","BLOW","BLUE","BLUR","BOAT","BODY","BOLD","BOLT","BOND",
  "BONE","BORN","BOTH","BOWL","BULK","BUMP","BURN","CAFE","CAGE","CAKE","CALM",
  "CAME","CAMP","CAPE","CARD","CARE","CART","CASE","CASH","CAST","CAVE","CHEW",
  "CHIN","CHIP","CHOP","CLAD","CLAM","CLAP","CLAY","CLIP","CLOD","CLUB","CLUE",
  "COAL","COAT","CODE","COIL","COLD","COME","CONE","COPE","CORD","CORE","CORK",
  "CORN","COST","COVE","CREW","CROP","CROW","CUBE","CULT","CURB","CURE","CURL",
  "CUTE","DAMP","DARE","DARK","DART","DAWN","DEAL","DEAR","DECK","DEEM","DENY",
  "DESK","DIAL","DICE","DIET","DINE","DIRE","DIRT","DOCK","DOME","DONE","DOOM",
  "DOSE","DOVE","DOWN","DOZE","DRAG","DRAW","DROP","DRUM","DUAL","DUEL","DUMB",
  "DUMP","DUNE","DUNK","DUSK","DUST","DUTY","EACH","EARN","EASE","EAST","EDGE",
  "EMIT","ENVY","EPIC","EVEN","EVIL","EXAM","FACE","FACT","FADE","FAIL","FAIR",
  "FAKE","FAME","FANG","FARE","FARM","FAST","FATE","FAWN","FAZE","FEAR","FEAT",
  "FELT","FEND","FERN","FILE","FILM","FIND","FINE","FIRE","FIRM","FISH","FIST",
  "FIVE","FLAG","FLAP","FLAT","FLAW","FLEA","FLED","FLEW","FLEX","FLIP","FLIT",
  "FLOG","FLOW","FLUX","FOAM","FOIL","FOLD","FOLK","FOND","FONT","FORE","FORK",
  "FORM","FORT","FOUL","FOUR","FOWL","FROM","FROG","FUEL","FUME","FUND","FURY",
  "FUSE","GAIT","GALE","GAME","GAPE","GARB","GATE","GAVE","GAWK","GAZE","GEAR",
  "GENE","GERM","GIFT","GILD","GILT","GIVE","GLAD","GLEN","GLIB","GLOW","GLUE",
  "GLUM","GLUT","GNAT","GNAW","GOAD","GOAL","GOAT","GOLD","GOLF","GONE","GORE",
  "GORY","GOWN","GRAB","GRAM","GRAY","GREW","GRID","GRIM","GRIN","GRIP","GRIT",
  "GROW","GUST","GUTS","HACK","HAIL","HAIR","HALE","HALT","HAZE","HEAD","HEAL",
  "HEAP","HEAT","HELD","HELM","HELP","HERB","HERD","HERO","HIDE","HIGH","HIKE",
  "HILT","HIND","HINT","HIRE","HIVE","HOED","HOLD","HOLE","HOME","HONE","HOPE",
  "HORN","HOSE","HOST","HOUR","HOWL","HUGE","HULK","HUMP","HUNT","HURL","HURT",
  "HUSK","HYMN","IDEA","IDLE","IRON","ISLE","ITEM","JACK","JADE","JAIL","JAMS",
  "JARS","JAWS","JEER","JERK","JEST","JETS","JOBS","JOIN","JOKE","JOLT","JOTS",
  "JUMP","JUNK","JURY","JUST","KALE","KEEN","KELP","KEPT","KEYS","KICK","KILT",
  "KIND","KING","KINK","KITE","KNOB","KNOT","LACE","LACK","LAID","LAIR","LAKE",
  "LAMB","LAME","LAMP","LAND","LANE","LARD","LARK","LASH","LAST","LATE","LAUD",
  "LAWN","LAZY","LEAD","LEAF","LEAK","LEAN","LEAP","LEFT","LEND","LENS","LENT",
  "LEVY","LICK","LIED","LIES","LIFE","LIFT","LIKE","LIMB","LIME","LIMP","LINE",
  "LINK","LION","LIST","LIVE","LOAD","LOAF","LOAN","LOCK","LOFT","LONE","LONG",
  "LOOM","LORD","LORE","LOSE","LOST","LOTS","LOUD","LOVE","LUCK","LUMP","LUNG",
  "LURK","LUSH","LUST","LYNX","MACE","MADE","MAID","MAIL","MAIN","MAKE","MALE",
  "MALT","MANE","MAPS","MARE","MARK","MARS","MASH","MASK","MAST","MATE","MATH",
  "MAZE","MEAD","MEAL","MEAN","MEAT","MELD","MELT","MEND","MENU","MESH","MILD",
  "MILK","MIME","MIND","MINE","MINT","MIRE","MIST","MOAN","MOAT","MOCK","MODE",
  "MOLD","MOLE","MOLT","MONK","MOOD","MOPE","MORE","MOST","MOTH","MOVE","MUCH",
  "MULE","MUSE","MUSK","MUST","MUTE","MYTH","NAIL","NAME","NAVY","NEAR","NEAT",
  "NECK","NEED","NEST","NETS","NEWS","NEXT","NICE","NINE","NODE","NORM","NOSE",
  "NOTE","NOUN","NUMB","OATH","OATS","OBEY","OILS","OMEN","OMIT","ONCE","ONLY",
  "ONTO","OOZE","OPEN","OPTS","ORAL","ORCA","OVEN","OVER","OWED","OWES","OWLS",
  "OWNS","PACE","PACK","PACT","PAGE","PAID","PAIL","PAIN","PAIR","PALE","PALM",
  "PANE","PARK","PART","PAST","PATH","PAVE","PAWN","PEAK","PEAR","PECK","PEEL",
  "PELT","PEND","PENS","PERK","PEST","PICK","PIER","PIKE","PILE","PINE","PINK",
  "PINT","PIPE","PLAN","PLAY","PLEA","PLOT","PLOW","PLOY","PLUG","PLUM","PLUS",
  "POCK","PODS","POEM","POET","POKE","POLE","POND","PORE","PORK","PORT","POSE",
  "POST","POUR","PREY","PROD","PUBS","PUCK","PULP","PUMP","PUNK","PURE","PUSH",
  "RACK","RAFT","RAGE","RAID","RAIL","RAIN","RAKE","RAMP","RANG","RANK","RANT",
  "RASH","RATE","RAVE","READ","REAL","REAP","REED","REEL","REIN","RELY","REND",
  "RENT","REST","RICE","RICH","RIDE","RIFT","RIGS","RILE","RIME","RIND","RING",
  "RINK","RIOT","RISE","RISK","ROAD","ROAM","ROBE","ROCK","RODE","ROLE","ROOF",
  "ROPE","ROSE","ROSY","ROTE","ROUT","ROVE","RUDE","RUIN","RULE","RUMP","RUNG",
  "RUNT","RUSH","RUST","SACK","SAFE","SAGE","SAID","SAIL","SAKE","SALE","SALT",
  "SAME","SAND","SANE","SANG","SANK","SAVE","SCAN","SCAR","SEAL","SEAM","SEAT",
  "SEED","SEEK","SELF","SEND","SENT","SHED","SHIN","SHIP","SHOE","SHOP","SHOT",
  "SHOW","SHUT","SICK","SIDE","SIFT","SIGH","SIGN","SILK","SILT","SINK","SIRE",
  "SITE","SIZE","SKID","SKIM","SKIN","SKIP","SKIT","SLAB","SLAG","SLAM","SLAP",
  "SLAT","SLAW","SLED","SLEW","SLID","SLIM","SLIP","SLIT","SLOB","SLOP","SLOT",
  "SLOW","SLUG","SMOG","SNAP","SNIP","SNOB","SNUG","SOAK","SOAP","SOAR","SOCK",
  "SOFT","SOIL","SOLD","SOLE","SOME","SONG","SORE","SORT","SOUL","SOUR","SPAN",
  "SPAR","SPED","SPIN","SPIT","SPOT","SPUD","SPUR","STAB","STAG","STAR","STAY",
  "STEM","STEP","STEW","STIR","STOP","STOW","STUB","STUD","STUN","SWAY","SWIM",
  "TACK","TACT","TAIL","TAKE","TALE","TANK","TAPE","TARN","TASK","TAXI","TEAK",
  "TEAL","TEAM","TEAR","TEMP","TEND","TENS","TENT","TERM","TERN","TEXT","THAN",
  "THAT","THAW","THEM","THEN","THEY","THIN","TICK","TIDE","TIDY","TIED","TIER",
  "TILE","TILT","TIME","TINE","TINY","TIRE","TOAD","TOIL","TOLD","TONE","TOOK",
  "TOPS","TORE","TORN","TRAM","TRAP","TRAY","TREK","TRIM","TRIO","TRIP","TROD",
  "TRUE","TUBE","TUCK","TUFT","TUNA","TUNE","TURF","TURN","TUSK","TWIN","TYPE",
  "UNDO","UNIT","UNTO","UPON","URGE","USED",
  "VAIN","VALE","VANE","VARY","VASE","VAST","VEAL","VEIL","VEIN","VENT","VERB",
  "VEST","VETO","VIEW","VILE","VINE","VOID","VOLT","VOTE","VOWS","VIBE",
  "WADE","WAGE","WAIL","WAIT","WAKE","WALK","WAND","WANT","WARD","WARM","WARN",
  "WARP","WART","WARY","WASH","WASP","WAVE","WAVY","WAXY","WEAK","WEAN","WEAR",
  "WEED","WELD","WELT","WENT","WERE","WEST","WHAT","WHEN","WHIM","WHIP","WHOM",
  "WICK","WIDE","WIFE","WILD","WILT","WILY","WIMP","WIND","WINE","WING","WINK",
  "WIPE","WIRE","WISE","WISH","WISP","WITH","WITS","WOKE","WOLF","WOMB","WORD",
  "WORE","WORK","WORM","WORN","WOVE","WRAP","WREN","WRIT",
  "YACK","YANK","YARD","YARN","YAWL","YAWN","YEAR","YELP","YOGA","YOKE","YOLK",
  "ZANY","ZEAL","ZERO","ZEST","ZINC","ZONE","ZOOM",
  "JAMB","JIBS","JIVE","JOCK","JOWL","JUDO","JUMP","JUNK","JUST","JUTS",
  "FLUX","LYNX","ONYX","ORYX","JINX","APEX",
  "QUAY","QUIZ","QOPH",
  "QUALM","QUARK","QUASH","QUICK","QUILT","QUIRK","QUOTA",
  "CHUNK","CLUMP","CRUMB","DWARF","FJORD","GLYPH","GRIMY","GRUMP",
  "HAVEN","IVORY","KRAFT","LYMPH","NYMPH","PLUMB","PROWL","SQUID",
  "STOVE","THUMP","VAULT","VYING","WALTZ","WHELK","WHELP",
  "BUMPY","FIXED","JUNKY","VIXEN","TYPED","SWIFT","PRISM",
  "CLOAK","FROST","BLEND","BRUNT","CLEFT","WHOMP","BLIMP",
  "CHOMP","FLOCK","CRYPT","SHOVE","CRIMP","DWELT","SQUAB",
  "CZAR","WHIZ",
];

const WORDS = [...new Set(WORDS_RAW.map(w => w.toUpperCase()))];
const wordSet = new Set(WORDS);

// Pre-filter: only words with all unique internal letters
const uniqueWords = WORDS.filter(w => new Set(w).size === w.length);

// Index words by letter for fast lookup
const wordsByLetter = {};
for (const l of "ABCDEFGHIJKLMNOPQRSTUVWXYZ") wordsByLetter[l] = [];
for (const w of uniqueWords) {
  for (const l of new Set(w)) wordsByLetter[l].push(w);
}

// Backtracking search: prioritize rare letters (Q, X, Z, J, V, K)
function findWordSet() {
  const ALL = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let best = { size: 0, words: [] };

  function backtrack(used, chosen, depth) {
    if (used.size === 26) return [...chosen];
    if (depth > 12) return null;

    // Find rarest uncovered letter
    let rareLetter = null;
    let minWords = Infinity;
    for (const l of ALL) {
      if (used.has(l)) continue;
      const available = wordsByLetter[l].filter(w =>
        [...w].every(c => !used.has(c))
      ).length;
      if (available < minWords) {
        minWords = available;
        rareLetter = l;
      }
    }

    if (!rareLetter || minWords === 0) return null;

    // Try words containing this rare letter
    const candidates = wordsByLetter[rareLetter].filter(w =>
      [...w].every(c => !used.has(c))
    );

    // Shuffle for variety
    candidates.sort(() => Math.random() - 0.5);

    for (const word of candidates.slice(0, 30)) {
      const newUsed = new Set(used);
      for (const c of word) newUsed.add(c);
      chosen.push(word);

      if (newUsed.size > best.size) {
        best = { size: newUsed.size, words: [...chosen] };
      }

      const result = backtrack(newUsed, chosen, depth + 1);
      if (result) return result;

      chosen.pop();
    }

    return null;
  }

  for (let attempt = 0; attempt < 500; attempt++) {
    const result = backtrack(new Set(), [], 0);
    if (result) return result;
  }

  console.log(`Best attempt: ${best.size}/26 with ${best.words.join(", ")}`);
  const missing = [...ALL].filter(l => !new Set(best.words.join("")).has(l));
  console.log(`Missing: ${missing.join("")}`);
  return null;
}

// ====== Grid arrangement ======
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
      if (r < H && grid[r]?.[c]) { if (start === -1) start = r; }
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
  if (cells.length === 0) return true;
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

function tryArrange(words) {
  words = [...words].sort((a,b) => b.length - a.length);
  const S = 25;
  const grid = Array.from({length: S}, () => Array(S).fill(null));
  const placed = [];

  const mid = Math.floor(S / 2);
  const w0 = words[0];
  const sc = mid - Math.floor(w0.length / 2);
  for (let i = 0; i < w0.length; i++) grid[mid][sc + i] = w0[i];
  placed.push({ word: w0, row: mid, col: sc, dir: "H" });

  for (let wi = 1; wi < words.length; wi++) {
    const word = words[wi];
    let found = false;

    for (const p of placed) {
      for (let pci = 0; pci < p.word.length; pci++) {
        for (let wci = 0; wci < word.length; wci++) {
          if (p.word[pci] !== word[wci]) continue;

          const newDir = p.dir === "H" ? "V" : "H";
          let row, col;
          if (p.dir === "H") { col = p.col + pci; row = p.row - wci; }
          else { row = p.row + pci; col = p.col - wci; }

          let ok = true;
          for (let i = 0; i < word.length; i++) {
            const r = newDir === "H" ? row : row + i;
            const c = newDir === "H" ? col + i : col;
            if (r < 0 || r >= S || c < 0 || c >= S) { ok = false; break; }
            const ex = grid[r][c];
            if (ex && ex !== word[i]) { ok = false; break; }
            if (!ex) {
              if (newDir === "H") {
                if ((grid[r-1]?.[c]) || (grid[r+1]?.[c])) { ok = false; break; }
              } else {
                if ((grid[r]?.[c-1]) || (grid[r]?.[c+1])) { ok = false; break; }
              }
            }
          }
          if (ok && newDir === "H") {
            if (col > 0 && grid[row][col-1]) ok = false;
            if (col + word.length < S && grid[row][col + word.length]) ok = false;
          }
          if (ok && newDir === "V") {
            if (row > 0 && grid[row-1]?.[col]) ok = false;
            if (row + word.length < S && grid[row + word.length]?.[col]) ok = false;
          }

          if (ok) {
            for (let i = 0; i < word.length; i++) {
              const r = newDir === "H" ? row : row + i;
              const c = newDir === "H" ? col + i : col;
              grid[r][c] = word[i];
            }
            placed.push({ word, row, col, dir: newDir });
            found = true;
            break;
          }
        }
        if (found) break;
      }
      if (found) break;
    }
    if (!found) return null;
  }

  // Trim
  let minR = S, maxR = 0, minC = S, maxC = 0;
  for (let r = 0; r < S; r++)
    for (let c = 0; c < S; c++)
      if (grid[r][c]) { minR = Math.min(minR,r); maxR = Math.max(maxR,r); minC = Math.min(minC,c); maxC = Math.max(maxC,c); }

  const trimmed = [];
  for (let r = minR; r <= maxR; r++) {
    const row = [];
    for (let c = minC; c <= maxC; c++) row.push(grid[r][c]);
    trimmed.push(row);
  }
  return trimmed;
}

// ====== Main ======
console.log("Searching for word sets...\n");

const results = [];
for (let i = 0; i < 20 && results.length < 3; i++) {
  const ws = findWordSet();
  if (!ws) continue;

  console.log(`\nWord set found: ${ws.join(", ")}`);

  for (let t = 0; t < 100; t++) {
    const shuffled = [...ws].sort(() => Math.random() - 0.5);
    const grid = tryArrange(shuffled);
    if (!grid) continue;
    if (!isConnected(grid)) continue;

    const runs = extractRuns(grid);
    const allValid = runs.every(w => wordSet.has(w));
    if (!allValid) continue;

    const letters = grid.flat().filter(Boolean);
    if (new Set(letters).size !== 26) continue;

    console.log(`\n=== Puzzle ${results.length + 1} ===`);
    for (const row of grid) console.log(row.map(c => c || ".").join(" "));
    console.log(`Words: ${runs.join(", ")}`);
    results.push({ words: ws, grid });
    break;
  }
}

if (results.length) {
  console.log("\n\n========== SEED JSON ==========\n");
  for (let i = 0; i < results.length; i++) {
    console.log(`// Puzzle ${i+1}: ${results[i].words.join(", ")}`);
    console.log(JSON.stringify(results[i].grid));
    console.log();
  }
} else {
  console.log("\nNo valid puzzles arranged. Run again for different random seeds.");
}
