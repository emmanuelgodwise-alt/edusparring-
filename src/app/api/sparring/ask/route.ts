import { NextResponse } from 'next/server';

/**
 * POST /api/sparring/ask
 * 
 * Player asks a question to the system
 * System evaluates and provides an answer
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { question, subject } = body;

    if (!question) {
      return NextResponse.json(
        { success: false, error: 'Question is required' },
        { status: 400 }
      );
    }

    // Evaluate the question and provide an answer
    const response = evaluatePlayerQuestion(question, subject || 'Math');

    return NextResponse.json({
      success: true,
      turn: 'player_ask',
      question,
      systemResponse: response.answer,
      isCorrect: true,
      pointsAwarded: response.pointsAwarded,
      explanation: response.explanation,
      nextTurn: 'system_ask',
      message: `I answered your question! +${response.pointsAwarded} points to me.`
    });
  } catch (error) {
    console.error('Player ask error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to process question' },
      { status: 500 }
    );
  }
}

/**
 * Massive Knowledge Base for answering player questions
 */
const KNOWLEDGE_BASE: Record<string, Record<string, { answer: string; explanation: string }>> = {
  Math: {
    // Arithmetic
    'what is 2+2': { answer: '4', explanation: '2 + 2 = 4, basic addition.' },
    'what is 2+3': { answer: '5', explanation: '2 + 3 = 5.' },
    'what is 5+7': { answer: '12', explanation: '5 + 7 = 12.' },
    'what is 10+15': { answer: '25', explanation: '10 + 15 = 25.' },
    'what is 100+200': { answer: '300', explanation: '100 + 200 = 300.' },
    'what is 9 times 8': { answer: '72', explanation: '9 × 8 = 72.' },
    'what is 7 times 6': { answer: '42', explanation: '7 × 6 = 42.' },
    'what is 12 times 12': { answer: '144', explanation: '12 × 12 = 144.' },
    'what is 100 divided by 4': { answer: '25', explanation: '100 ÷ 4 = 25.' },
    'what is 50 divided by 5': { answer: '10', explanation: '50 ÷ 5 = 10.' },
    'what is 15 minus 8': { answer: '7', explanation: '15 - 8 = 7.' },
    'what is 100 minus 37': { answer: '63', explanation: '100 - 37 = 63.' },
    
    // Algebra
    'what is the derivative of x squared': { answer: '2x', explanation: 'Using the power rule, d/dx(x²) = 2x.' },
    'what is the derivative of x cubed': { answer: '3x²', explanation: 'Using the power rule, d/dx(x³) = 3x².' },
    'what is the derivative of sin x': { answer: 'cos x', explanation: 'The derivative of sin(x) is cos(x).' },
    'what is the derivative of cos x': { answer: '-sin x', explanation: 'The derivative of cos(x) is -sin(x).' },
    'what is the derivative of e to the x': { answer: 'eˣ', explanation: 'The derivative of eˣ is itself, eˣ.' },
    'what is the derivative of ln x': { answer: '1/x', explanation: 'The derivative of ln(x) is 1/x.' },
    'what is the integral of x': { answer: 'x²/2 + C', explanation: '∫x dx = x²/2 + C, where C is the constant of integration.' },
    'what is the integral of 2x': { answer: 'x² + C', explanation: '∫2x dx = x² + C.' },
    
    // Geometry
    'what is the area of a circle': { answer: 'πr²', explanation: 'The area of a circle with radius r is π times r squared.' },
    'what is the circumference of a circle': { answer: '2πr', explanation: 'The circumference equals 2 times π times the radius.' },
    'what is the area of a rectangle': { answer: 'length × width', explanation: 'Area of rectangle = length times width.' },
    'what is the area of a triangle': { answer: '½ × base × height', explanation: 'Area of triangle = half of base times height.' },
    'what is the pythagorean theorem': { answer: 'a² + b² = c²', explanation: 'In a right triangle, the square of the hypotenuse equals sum of squares of other sides.' },
    'what is the sum of angles in a triangle': { answer: '180°', explanation: 'All triangles have interior angles summing to 180 degrees.' },
    'what is the sum of angles in a quadrilateral': { answer: '360°', explanation: 'All quadrilaterals have interior angles summing to 360 degrees.' },
    
    // Trigonometry
    'what is sin of 90 degrees': { answer: '1', explanation: 'sin(90°) = 1.' },
    'what is cos of 0 degrees': { answer: '1', explanation: 'cos(0°) = 1.' },
    'what is sin of 0 degrees': { answer: '0', explanation: 'sin(0°) = 0.' },
    'what is cos of 90 degrees': { answer: '0', explanation: 'cos(90°) = 0.' },
    'what is tan of 45 degrees': { answer: '1', explanation: 'tan(45°) = 1.' },
    
    // Number theory
    'what is pi': { answer: '3.14159...', explanation: 'π (pi) is the ratio of circumference to diameter, approximately 3.14159.' },
    'what is e': { answer: '2.71828...', explanation: 'e is Euler\'s number, the base of natural logarithms, approximately 2.71828.' },
    'what is the golden ratio': { answer: '1.618...', explanation: 'The golden ratio φ = (1+√5)/2 ≈ 1.618.' },
    'what is the square root of 2': { answer: '1.414...', explanation: '√2 ≈ 1.414.' },
    'what is the square root of 4': { answer: '2', explanation: '√4 = 2.' },
    'what is the square root of 9': { answer: '3', explanation: '√9 = 3.' },
    
    // Quadratic
    'what is the quadratic formula': { answer: 'x = (-b ± √(b²-4ac))/2a', explanation: 'Solves ax² + bx + c = 0.' },
  },
  Physics: {
    // Speed and constants
    'what is the speed of light': { answer: '3×10⁸ m/s', explanation: 'Light travels at approximately 300,000 km/s in vacuum.' },
    'what is the speed of sound': { answer: '343 m/s in air', explanation: 'Sound travels at about 343 m/s in air at room temperature.' },
    'what is plancks constant': { answer: '6.626×10⁻³⁴ J·s', explanation: 'Planck\'s constant h = 6.626 × 10⁻³⁴ joule-seconds.' },
    'what is the gravitational constant': { answer: '6.674×10⁻¹¹ N·m²/kg²', explanation: 'G = 6.674 × 10⁻¹¹ N⋅m²/kg².' },
    
    // Laws
    'what is newtons first law': { answer: 'Law of Inertia', explanation: 'Objects at rest stay at rest unless acted upon by a force.' },
    'what is newtons second law': { answer: 'F = ma', explanation: 'Force equals mass times acceleration.' },
    'what is newtons third law': { answer: 'Action-Reaction', explanation: 'Every action has an equal and opposite reaction.' },
    'what is f equals ma': { answer: 'Newton\'s Second Law', explanation: 'Force equals mass times acceleration.' },
    'what is the law of conservation of energy': { answer: 'Energy cannot be created or destroyed', explanation: 'Energy can only be converted from one form to another.' },
    'what is the law of conservation of momentum': { answer: 'Total momentum remains constant', explanation: 'In a closed system, total momentum before = total momentum after.' },
    
    // Units
    'what is the unit of force': { answer: 'Newton (N)', explanation: '1 Newton = 1 kg·m/s².' },
    'what is the unit of energy': { answer: 'Joule (J)', explanation: '1 Joule = 1 kg·m²/s².' },
    'what is the unit of power': { answer: 'Watt (W)', explanation: '1 Watt = 1 Joule per second.' },
    'what is the unit of pressure': { answer: 'Pascal (Pa)', explanation: '1 Pascal = 1 Newton per square meter.' },
    'what is the unit of electric current': { answer: 'Ampere (A)', explanation: 'The Ampere is the SI unit of electric current.' },
    'what is the unit of voltage': { answer: 'Volt (V)', explanation: '1 Volt = 1 Joule per Coulomb.' },
    'what is the unit of resistance': { answer: 'Ohm (Ω)', explanation: 'Resistance is measured in Ohms.' },
    
    // Values
    'what is gravity on earth': { answer: '9.8 m/s²', explanation: 'Acceleration due to gravity on Earth is about 9.8 m/s².' },
    'what is the mass of earth': { answer: '5.97×10²⁴ kg', explanation: 'Earth\'s mass is about 5.97 × 10²⁴ kilograms.' },
    'what is the mass of the sun': { answer: '1.99×10³⁰ kg', explanation: 'The Sun\'s mass is about 1.99 × 10³⁰ kilograms.' },
    
    // Formulas
    'what is kinetic energy': { answer: '½mv²', explanation: 'Kinetic energy = half times mass times velocity squared.' },
    'what is potential energy': { answer: 'mgh', explanation: 'Gravitational potential energy = mass × gravity × height.' },
    'what is ohms law': { answer: 'V = IR', explanation: 'Voltage = Current × Resistance.' },
    'what is the formula for force': { answer: 'F = ma', explanation: 'Force = mass × acceleration.' },
  },
  Chemistry: {
    // Formulas
    'what is the chemical formula for water': { answer: 'H₂O', explanation: 'Water consists of two hydrogen atoms and one oxygen atom.' },
    'what is the chemical formula for carbon dioxide': { answer: 'CO₂', explanation: 'Carbon dioxide has one carbon and two oxygen atoms.' },
    'what is the chemical formula for salt': { answer: 'NaCl', explanation: 'Table salt is sodium chloride.' },
    'what is the chemical formula for methane': { answer: 'CH₄', explanation: 'Methane has one carbon and four hydrogen atoms.' },
    'what is the chemical formula for ammonia': { answer: 'NH₃', explanation: 'Ammonia has one nitrogen and three hydrogen atoms.' },
    'what is the chemical formula for sulfuric acid': { answer: 'H₂SO₄', explanation: 'Sulfuric acid has 2 H, 1 S, and 4 O atoms.' },
    'what is the chemical formula for hydrochloric acid': { answer: 'HCl', explanation: 'Hydrochloric acid is hydrogen chloride in water.' },
    
    // Atomic numbers
    'what is the atomic number of carbon': { answer: '6', explanation: 'Carbon has 6 protons in its nucleus.' },
    'what is the atomic number of oxygen': { answer: '8', explanation: 'Oxygen has 8 protons in its nucleus.' },
    'what is the atomic number of hydrogen': { answer: '1', explanation: 'Hydrogen has 1 proton in its nucleus.' },
    'what is the atomic number of helium': { answer: '2', explanation: 'Helium has 2 protons in its nucleus.' },
    'what is the atomic number of iron': { answer: '26', explanation: 'Iron has 26 protons in its nucleus.' },
    'what is the atomic number of gold': { answer: '79', explanation: 'Gold has 79 protons in its nucleus.' },
    'what is the atomic number of sodium': { answer: '11', explanation: 'Sodium has 11 protons in its nucleus.' },
    
    // Symbols
    'what is the symbol for gold': { answer: 'Au', explanation: 'Au comes from Latin "aurum".' },
    'what is the symbol for silver': { answer: 'Ag', explanation: 'Ag comes from Latin "argentum".' },
    'what is the symbol for iron': { answer: 'Fe', explanation: 'Fe comes from Latin "ferrum".' },
    'what is the symbol for sodium': { answer: 'Na', explanation: 'Na comes from Latin "natrium".' },
    'what is the symbol for potassium': { answer: 'K', explanation: 'K comes from Latin "kalium".' },
    'what is the symbol for copper': { answer: 'Cu', explanation: 'Cu comes from Latin "cuprum".' },
    'what is the symbol for lead': { answer: 'Pb', explanation: 'Pb comes from Latin "plumbum".' },
    
    // pH
    'what is the ph of water': { answer: '7', explanation: 'Pure water is neutral with pH 7.' },
    'what is the ph of a base': { answer: 'Above 7', explanation: 'Bases have pH greater than 7.' },
    'what is the ph of an acid': { answer: 'Below 7', explanation: 'Acids have pH less than 7.' },
    
    // Bonds
    'what is a covalent bond': { answer: 'Shared electron pair', explanation: 'Covalent bonds form when atoms share electrons.' },
    'what is an ionic bond': { answer: 'Electron transfer', explanation: 'Ionic bonds form when electrons transfer between atoms.' },
    'what is a hydrogen bond': { answer: 'Weak attraction', explanation: 'H-bonds are weak attractions between molecules.' },
    
    // Concepts
    'what is avogadros number': { answer: '6.02×10²³', explanation: 'The number of particles in one mole.' },
    'what is a mole': { answer: '6.02×10²³ particles', explanation: 'A mole is Avogadro\'s number of particles.' },
    'what is an isotope': { answer: 'Same protons, different neutrons', explanation: 'Isotopes have same atomic number but different mass.' },
  },
  Biology: {
    // Cells
    'what is the powerhouse of the cell': { answer: 'Mitochondria', explanation: 'Mitochondria produce ATP through cellular respiration.' },
    'what is the brain of the cell': { answer: 'Nucleus', explanation: 'The nucleus contains DNA and controls cell activities.' },
    'what makes proteins in a cell': { answer: 'Ribosomes', explanation: 'Ribosomes synthesize proteins from amino acids.' },
    'what is the cell membrane made of': { answer: 'Phospholipid bilayer', explanation: 'The membrane is a double layer of phospholipids.' },
    'what do lysosomes do': { answer: 'Digest waste', explanation: 'Lysosomes break down cellular waste and debris.' },
    'what is the golgi apparatus': { answer: 'Packaging center', explanation: 'The Golgi modifies, sorts, and packages proteins.' },
    'what is the endoplasmic reticulum': { answer: 'Transport system', explanation: 'ER transports proteins and synthesizes lipids.' },
    
    // DNA/RNA
    'what is dna': { answer: 'Deoxyribonucleic acid', explanation: 'DNA carries genetic instructions for all living organisms.' },
    'what is rna': { answer: 'Ribonucleic acid', explanation: 'RNA helps in protein synthesis and gene expression.' },
    'what are the four bases of dna': { answer: 'A, T, G, C', explanation: 'Adenine, Thymine, Guanine, and Cytosine.' },
    'what are the four bases of rna': { answer: 'A, U, G, C', explanation: 'Adenine, Uracil, Guanine, and Cytosine.' },
    'what base pairs with adenine': { answer: 'Thymine (in DNA)', explanation: 'A pairs with T in DNA, A pairs with U in RNA.' },
    'what base pairs with guanine': { answer: 'Cytosine', explanation: 'G always pairs with C.' },
    
    // Processes
    'what is photosynthesis': { answer: 'Making food from light', explanation: 'Plants convert light energy into chemical energy (glucose).' },
    'what is cellular respiration': { answer: 'Making ATP from glucose', explanation: 'Breaking down glucose to produce energy.' },
    'what is mitosis': { answer: 'Cell division', explanation: 'Mitosis produces two identical daughter cells.' },
    'what is meiosis': { answer: 'Sex cell division', explanation: 'Meiosis produces gametes with half the chromosomes.' },
    'what is transcription': { answer: 'DNA to RNA', explanation: 'Making RNA copy from DNA template.' },
    'what is translation': { answer: 'RNA to protein', explanation: 'Making protein from mRNA instructions.' },
    
    // Human body
    'how many chromosomes do humans have': { answer: '46 (23 pairs)', explanation: 'Humans have 23 pairs of chromosomes, 46 total.' },
    'what is the largest organ': { answer: 'Skin', explanation: 'The skin is the largest organ in the human body.' },
    'what organ pumps blood': { answer: 'Heart', explanation: 'The heart pumps blood throughout the body.' },
    'what carries oxygen in blood': { answer: 'Hemoglobin', explanation: 'Hemoglobin in red blood cells carries oxygen.' },
    'what type of blood cell fights infection': { answer: 'White blood cells', explanation: 'Leukocytes (white blood cells) fight infections.' },
    'what is the function of the liver': { answer: 'Detoxification and metabolism', explanation: 'The liver processes toxins and produces bile.' },
    
    // Classification
    'what is the basic unit of life': { answer: 'Cell', explanation: 'All living organisms are made of cells.' },
    'what kingdom do plants belong to': { answer: 'Plantae', explanation: 'Plants are in the kingdom Plantae.' },
    'what kingdom do animals belong to': { answer: 'Animalia', explanation: 'Animals are in the kingdom Animalia.' },
  },
  History: {
    // Wars
    'when did world war 1 start': { answer: '1914', explanation: 'World War I began in July 1914.' },
    'when did world war 1 end': { answer: '1918', explanation: 'World War I ended on November 11, 1918.' },
    'when did world war 2 start': { answer: '1939', explanation: 'World War II began in September 1939.' },
    'when did world war 2 end': { answer: '1945', explanation: 'World War II ended in September 1945.' },
    'what started world war 1': { answer: 'Assassination of Archduke Franz Ferdinand', explanation: 'The assassination triggered the alliance system.' },
    'what started world war 2': { answer: 'Germany invaded Poland', explanation: 'Hitler\'s invasion of Poland started WWII.' },
    
    // US History
    'who was the first us president': { answer: 'George Washington', explanation: 'Washington served from 1789 to 1797.' },
    'who was the third us president': { answer: 'Thomas Jefferson', explanation: 'Jefferson served from 1801 to 1809.' },
    'who wrote the declaration of independence': { answer: 'Thomas Jefferson', explanation: 'Jefferson wrote it in 1776.' },
    'when was the declaration of independence signed': { answer: '1776', explanation: 'Signed on July 4, 1776.' },
    'who freed the slaves': { answer: 'Abraham Lincoln', explanation: 'Lincoln issued the Emancipation Proclamation in 1863.' },
    'when was the civil war': { answer: '1861-1865', explanation: 'The American Civil War lasted from 1861 to 1865.' },
    
    // Ancient History
    'who built the pyramids': { answer: 'Ancient Egyptians', explanation: 'The pyramids were built around 2500 BCE.' },
    'who was julius caesar': { answer: 'Roman dictator', explanation: 'Caesar was a Roman general and dictator, assassinated in 44 BCE.' },
    'when did rome fall': { answer: '476 CE', explanation: 'The Western Roman Empire fell in 476 CE.' },
    'who was alexander the great': { answer: 'Macedonian conqueror', explanation: 'Alexander conquered much of the known world by age 30.' },
    'what was the roman empire': { answer: 'Ancient Mediterranean empire', explanation: 'Rome controlled much of Europe, Africa, and Asia.' },
    
    // Modern History
    'when was the united nations founded': { answer: '1945', explanation: 'The UN was established after WWII.' },
    'when did the berlin wall fall': { answer: '1989', explanation: 'The Berlin Wall fell on November 9, 1989.' },
    'when did the soviet union collapse': { answer: '1991', explanation: 'The USSR dissolved in December 1991.' },
    'who was the first man on the moon': { answer: 'Neil Armstrong', explanation: 'Armstrong walked on the moon on July 20, 1969.' },
    'what was the cold war': { answer: 'US vs USSR conflict', explanation: 'Ideological conflict between USA and Soviet Union, 1947-1991.' },
    
    // Explorers
    'who discovered america': { answer: 'Christopher Columbus', explanation: 'Columbus reached the Americas in 1492.' },
    'who was the first to circumnavigate the globe': { answer: 'Ferdinand Magellan\'s expedition', explanation: 'Magellan\'s crew completed the journey in 1522.' },
  },
  Geography: {
    // Capitals
    'what is the capital of france': { answer: 'Paris', explanation: 'Paris is the capital and largest city of France.' },
    'what is the capital of japan': { answer: 'Tokyo', explanation: 'Tokyo is the capital of Japan.' },
    'what is the capital of china': { answer: 'Beijing', explanation: 'Beijing is the capital of China.' },
    'what is the capital of germany': { answer: 'Berlin', explanation: 'Berlin is the capital of Germany.' },
    'what is the capital of italy': { answer: 'Rome', explanation: 'Rome is the capital of Italy.' },
    'what is the capital of spain': { answer: 'Madrid', explanation: 'Madrid is the capital of Spain.' },
    'what is the capital of russia': { answer: 'Moscow', explanation: 'Moscow is the capital of Russia.' },
    'what is the capital of brazil': { answer: 'Brasília', explanation: 'Brasília has been the capital since 1960.' },
    'what is the capital of australia': { answer: 'Canberra', explanation: 'Canberra is the capital, not Sydney.' },
    'what is the capital of canada': { answer: 'Ottawa', explanation: 'Ottawa is the capital of Canada.' },
    'what is the capital of india': { answer: 'New Delhi', explanation: 'New Delhi is the capital of India.' },
    'what is the capital of egypt': { answer: 'Cairo', explanation: 'Cairo is the capital of Egypt.' },
    'what is the capital of mexico': { answer: 'Mexico City', explanation: 'Mexico City is the capital of Mexico.' },
    'what is the capital of south korea': { answer: 'Seoul', explanation: 'Seoul is the capital of South Korea.' },
    
    // Landmarks
    'what is the largest continent': { answer: 'Asia', explanation: 'Asia covers approximately 44.6 million km².' },
    'what is the smallest continent': { answer: 'Australia', explanation: 'Australia/Oceania is the smallest continent.' },
    'what is the largest ocean': { answer: 'Pacific Ocean', explanation: 'The Pacific covers about 165 million km².' },
    'what is the longest river': { answer: 'Nile River', explanation: 'The Nile is approximately 6,650 km long.' },
    'what is the largest river by volume': { answer: 'Amazon River', explanation: 'The Amazon has the largest discharge volume.' },
    'what is the highest mountain': { answer: 'Mount Everest', explanation: 'Everest is 8,849 meters tall.' },
    'what is the largest country': { answer: 'Russia', explanation: 'Russia covers over 17 million km².' },
    'what is the largest island': { answer: 'Greenland', explanation: 'Greenland is about 2.16 million km².' },
    'what is the largest desert': { answer: 'Antarctic Desert', explanation: 'Antarctica is the largest desert by area.' },
    'what is the hottest desert': { answer: 'Sahara Desert', explanation: 'The Sahara is the largest hot desert.' },
    
    // Water bodies
    'what is the deepest ocean': { answer: 'Pacific Ocean', explanation: 'The Pacific contains the Mariana Trench.' },
    'what is the deepest point on earth': { answer: 'Mariana Trench', explanation: 'About 11,000 meters deep in the Pacific.' },
    'what is the deepest lake': { answer: 'Lake Baikal', explanation: 'Baikal is over 1,600 meters deep.' },
    
    // Countries
    'what country has the most people': { answer: 'China (or India)', explanation: 'China and India both have over 1.4 billion people.' },
    'what country has the most land': { answer: 'Russia', explanation: 'Russia is the largest country by area.' },
    'how many countries are there': { answer: 'About 195', explanation: 'Approximately 195 recognized sovereign states.' },
    'how many continents are there': { answer: '7', explanation: 'Africa, Asia, Europe, North America, South America, Australia, Antarctica.' },
  },
};

function evaluatePlayerQuestion(question: string, subject: string): {
  answer: string;
  pointsAwarded: number;
  explanation: string;
} {
  const subjectKB = KNOWLEDGE_BASE[subject] || KNOWLEDGE_BASE['Math'];
  const normalizedQuestion = question.toLowerCase().trim().replace('?', '');
  
  // Try to find a match
  for (const [key, value] of Object.entries(subjectKB)) {
    if (normalizedQuestion.includes(key) || key.includes(normalizedQuestion)) {
      return {
        answer: value.answer,
        pointsAwarded: 15,
        explanation: value.explanation
      };
    }
  }

  // Fallback responses for unknown questions
  const fallbacks = [
    {
      answer: `That's a fascinating question about ${subject}! While I don't have a specific answer, exploring such questions deepens understanding.`,
      pointsAwarded: 10,
      explanation: `This is an interesting area of ${subject} worth exploring further.`
    },
    {
      answer: `Great question! In ${subject}, this involves fundamental concepts. Let me provide what I know.`,
      pointsAwarded: 10,
      explanation: `Every question helps expand knowledge in ${subject}.`
    },
    {
      answer: `That's an interesting one! This touches on important concepts in ${subject}.`,
      pointsAwarded: 10,
      explanation: `Keep asking questions - that's how we learn!`
    }
  ];

  return fallbacks[Math.floor(Math.random() * fallbacks.length)];
}
