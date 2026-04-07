import { NextResponse } from 'next/server';
import ZAI from 'z-ai-web-dev-sdk';

/**
 * GET /api/sparring/question
 * 
 * System generates a question for the player to answer
 */
export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const subject = url.searchParams.get('subject') || 'Math';
    const difficulty = url.searchParams.get('difficulty') || 'medium';

    const questionData = generateQuestion(subject, difficulty);

    return NextResponse.json({
      success: true,
      turn: 'system_ask',
      question: questionData.question,
      options: questionData.options,
      questionId: questionData.id,
      correctAnswer: questionData.correctAnswer,
      subject,
      difficulty,
      message: "System is asking you a question!"
    });
  } catch (error) {
    console.error('Generate question error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to generate question' },
      { status: 500 }
    );
  }
}

/**
 * Massive Question Bank - Over 200 questions across subjects and difficulties
 */
const QUESTION_BANK: Record<string, Record<string, Array<{
  question: string;
  options: string[];
  correctAnswer: string;
}>>> = {
  Math: {
    easy: [
      { question: "What is 5 + 7?", options: ["A. 10", "B. 11", "C. 12", "D. 13"], correctAnswer: "C" },
      { question: "What is 9 × 8?", options: ["A. 63", "B. 72", "C. 81", "D. 64"], correctAnswer: "B" },
      { question: "What is 100 ÷ 4?", options: ["A. 20", "B. 25", "C. 30", "D. 50"], correctAnswer: "B" },
      { question: "What is 15 - 8?", options: ["A. 5", "B. 6", "C. 7", "D. 8"], correctAnswer: "C" },
      { question: "What is 12 × 11?", options: ["A. 122", "B. 132", "C. 142", "D. 121"], correctAnswer: "B" },
      { question: "What is 144 ÷ 12?", options: ["A. 10", "B. 11", "C. 12", "D. 13"], correctAnswer: "C" },
      { question: "What is 25% of 80?", options: ["A. 15", "B. 20", "C. 25", "D. 30"], correctAnswer: "B" },
      { question: "What is 3² (3 squared)?", options: ["A. 6", "B. 9", "C. 12", "D. 27"], correctAnswer: "B" },
      { question: "What is √49?", options: ["A. 6", "B. 7", "C. 8", "D. 9"], correctAnswer: "B" },
      { question: "What is 0.5 as a fraction?", options: ["A. 1/3", "B. 1/4", "C. 1/2", "D. 1/5"], correctAnswer: "C" },
      { question: "What is 7 × 6?", options: ["A. 40", "B. 42", "C. 44", "D. 48"], correctAnswer: "B" },
      { question: "What is 90 ÷ 9?", options: ["A. 9", "B. 10", "C. 11", "D. 12"], correctAnswer: "B" },
      { question: "What is 33 + 67?", options: ["A. 90", "B. 100", "C. 110", "D. 99"], correctAnswer: "B" },
      { question: "What is 1/2 + 1/4?", options: ["A. 1/6", "B. 2/6", "C. 3/4", "D. 1/4"], correctAnswer: "C" },
      { question: "What is 5³ (5 cubed)?", options: ["A. 25", "B. 125", "C. 15", "D. 50"], correctAnswer: "B" },
    ],
    medium: [
      { question: "What is the value of x in: 2x + 5 = 15?", options: ["A. x = 5", "B. x = 7", "C. x = 10", "D. x = 4"], correctAnswer: "A" },
      { question: "What is the derivative of x³?", options: ["A. x²", "B. 3x²", "C. 3x", "D. 2x²"], correctAnswer: "B" },
      { question: "What is the sum of angles in a triangle?", options: ["A. 90°", "B. 180°", "C. 270°", "D. 360°"], correctAnswer: "B" },
      { question: "Solve: 3(x - 4) = 15", options: ["A. x = 7", "B. x = 9", "C. x = 5", "D. x = 11"], correctAnswer: "B" },
      { question: "What is the area of a circle with radius 5?", options: ["A. 10π", "B. 25π", "C. 5π", "D. 15π"], correctAnswer: "B" },
      { question: "What is the slope of y = 3x + 7?", options: ["A. 7", "B. 3", "C. 3x", "D. 10"], correctAnswer: "B" },
      { question: "What is log₁₀(100)?", options: ["A. 1", "B. 2", "C. 10", "D. 100"], correctAnswer: "B" },
      { question: "What is 2³ × 2²?", options: ["A. 2⁵", "B. 2⁶", "C. 4⁵", "D. 4⁶"], correctAnswer: "A" },
      { question: "Factor: x² - 9", options: ["A. (x-3)(x-3)", "B. (x+3)(x-3)", "C. (x+9)(x-1)", "D. (x-9)(x+1)"], correctAnswer: "B" },
      { question: "What is the Pythagorean theorem?", options: ["A. a² + b² = c²", "B. a + b = c", "C. ab = c²", "D. a² - b² = c²"], correctAnswer: "A" },
      { question: "What is sin(90°)?", options: ["A. 0", "B. 1", "C. -1", "D. 0.5"], correctAnswer: "B" },
      { question: "What is cos(0°)?", options: ["A. 0", "B. 1", "C. -1", "D. undefined"], correctAnswer: "B" },
      { question: "What is the quadratic formula?", options: ["A. x = -b±√(b²-4ac)/2a", "B. x = b²-4ac", "C. x = -b/2a", "D. x = √(b²+4ac)"], correctAnswer: "A" },
      { question: "What is the GCF of 24 and 36?", options: ["A. 6", "B. 12", "C. 8", "D. 4"], correctAnswer: "B" },
      { question: "Simplify: √50", options: ["A. 5√2", "B. 2√5", "C. 25√2", "D. 10√5"], correctAnswer: "A" },
    ],
    hard: [
      { question: "What is ∫2x dx?", options: ["A. x²", "B. x² + C", "C. 2x²", "D. 2x² + C"], correctAnswer: "B" },
      { question: "What is lim(x→0) sin(x)/x?", options: ["A. 0", "B. 1", "C. ∞", "D. undefined"], correctAnswer: "B" },
      { question: "What is the derivative of sin(x)?", options: ["A. -cos(x)", "B. cos(x)", "C. sin(x)", "D. -sin(x)"], correctAnswer: "B" },
      { question: "What is the derivative of ln(x)?", options: ["A. x", "B. 1/x", "C. ln(x)/x", "D. eˣ"], correctAnswer: "B" },
      { question: "What is the determinant of [[1,2],[3,4]]?", options: ["A. -2", "B. 2", "C. 10", "D. -10"], correctAnswer: "A" },
      { question: "What is e^(iπ) + 1 equal to?", options: ["A. 0", "B. 1", "C. -1", "D. e"], correctAnswer: "A" },
      { question: "What is the sum of interior angles of a hexagon?", options: ["A. 540°", "B. 720°", "C. 900°", "D. 360°"], correctAnswer: "B" },
      { question: "What is the derivative of eˣ?", options: ["A. xeˣ⁻¹", "B. eˣ", "C. ln(x)", "D. e^(x-1)"], correctAnswer: "B" },
      { question: "What is i⁴ (where i is imaginary unit)?", options: ["A. i", "B. -i", "C. 1", "D. -1"], correctAnswer: "C" },
      { question: "Solve: |x - 3| = 7", options: ["A. x = 10 or -4", "B. x = 10 only", "C. x = 4 or 10", "D. x = -10 or 4"], correctAnswer: "A" },
    ],
    expert: [
      { question: "What is the Maclaurin series for eˣ?", options: ["A. Σ xⁿ/n!", "B. Σ xⁿ/n", "C. Σ (-1)ⁿxⁿ/n!", "D. Σ x²ⁿ/(2n)!"], correctAnswer: "A" },
      { question: "What is the residue of 1/z at z=0?", options: ["A. 0", "B. 1", "C. ∞", "D. undefined"], correctAnswer: "B" },
      { question: "What is the Laplace transform of 1?", options: ["A. 1/s", "B. s", "C. 1/s²", "D. e⁻ˢ"], correctAnswer: "A" },
      { question: "What is ∫e^(-x²)dx from -∞ to ∞?", options: ["A. π", "B. √π", "C. 2π", "D. ∞"], correctAnswer: "B" },
      { question: "What is the Fourier transform of e^(-x²)?", options: ["A. e^(-ω²/4)", "B. e^(-ω²)", "C. √π·e^(-ω²/4)", "D. 2π·e^(-ω²)"], correctAnswer: "C" },
    ],
  },
  Physics: {
    easy: [
      { question: "What is the SI unit of length?", options: ["A. Meter", "B. Kilogram", "C. Second", "D. Ampere"], correctAnswer: "A" },
      { question: "What is the acceleration due to gravity on Earth?", options: ["A. 8.9 m/s²", "B. 9.8 m/s²", "C. 10.8 m/s²", "D. 11.8 m/s²"], correctAnswer: "B" },
      { question: "What is the speed of light?", options: ["A. 3×10⁶ m/s", "B. 3×10⁸ m/s", "C. 3×10¹⁰ m/s", "D. 3×10⁵ m/s"], correctAnswer: "B" },
      { question: "What is the SI unit of mass?", options: ["A. Newton", "B. Joule", "C. Kilogram", "D. Watt"], correctAnswer: "C" },
      { question: "What type of energy is in a moving car?", options: ["A. Potential", "B. Kinetic", "C. Thermal", "D. Chemical"], correctAnswer: "B" },
      { question: "What is the unit of force?", options: ["A. Joule", "B. Watt", "C. Newton", "D. Pascal"], correctAnswer: "C" },
      { question: "What is the freezing point of water?", options: ["A. 0°C", "B. 32°C", "C. -32°C", "D. 100°C"], correctAnswer: "A" },
      { question: "What is the boiling point of water?", options: ["A. 50°C", "B. 100°C", "C. 150°C", "D. 212°C"], correctAnswer: "B" },
      { question: "How many planets are in our solar system?", options: ["A. 7", "B. 8", "C. 9", "D. 10"], correctAnswer: "B" },
      { question: "What is the center of an atom called?", options: ["A. Electron", "B. Nucleus", "C. Proton", "D. Neutron"], correctAnswer: "B" },
      { question: "What device measures temperature?", options: ["A. Barometer", "B. Thermometer", "C. Speedometer", "D. Chronometer"], correctAnswer: "B" },
      { question: "What is the SI unit of time?", options: ["A. Minute", "B. Hour", "C. Second", "D. Day"], correctAnswer: "C" },
      { question: "What type of wave is sound?", options: ["A. Transverse", "B. Longitudinal", "C. Electromagnetic", "D. Radio"], correctAnswer: "B" },
      { question: "What is the unit of electric current?", options: ["A. Volt", "B. Ohm", "C. Ampere", "D. Watt"], correctAnswer: "C" },
      { question: "What is stored in a battery?", options: ["A. Kinetic energy", "B. Chemical energy", "C. Nuclear energy", "D. Thermal energy"], correctAnswer: "B" },
    ],
    medium: [
      { question: "What is Newton's First Law called?", options: ["A. Law of Acceleration", "B. Law of Inertia", "C. Law of Action-Reaction", "D. Law of Gravity"], correctAnswer: "B" },
      { question: "What is the formula for kinetic energy?", options: ["A. F = ma", "B. KE = ½mv²", "C. PE = mgh", "D. W = Fd"], correctAnswer: "B" },
      { question: "What is the unit of electrical resistance?", options: ["A. Volt", "B. Ampere", "C. Ohm", "D. Watt"], correctAnswer: "C" },
      { question: "What is the formula for force?", options: ["A. F = ma", "B. F = mv", "C. F = m/a", "D. F = a/m"], correctAnswer: "A" },
      { question: "What is the speed of sound in air?", options: ["A. 343 m/s", "B. 300 m/s", "C. 400 m/s", "D. 500 m/s"], correctAnswer: "A" },
      { question: "What is potential energy formula?", options: ["A. PE = ½mv²", "B. PE = mgh", "C. PE = ma", "D. PE = Fd"], correctAnswer: "B" },
      { question: "What is Ohm's Law?", options: ["A. V = IR", "B. P = IV", "C. F = ma", "D. E = mc²"], correctAnswer: "A" },
      { question: "What type of lens is thicker in the middle?", options: ["A. Concave", "B. Convex", "C. Plane", "D. Cylindrical"], correctAnswer: "B" },
      { question: "What is the frequency unit?", options: ["A. Joule", "B. Hertz", "C. Newton", "D. Watt"], correctAnswer: "B" },
      { question: "What is power formula?", options: ["A. P = IV", "B. P = IR", "C. P = V/R", "D. P = I²R²"], correctAnswer: "A" },
      { question: "What is the charge of an electron?", options: ["A. Positive", "B. Negative", "C. Neutral", "D. Variable"], correctAnswer: "B" },
      { question: "What is the principle behind rockets?", options: ["A. Bernoulli's principle", "B. Conservation of momentum", "C. Archimedes' principle", "D. Pascal's law"], correctAnswer: "B" },
      { question: "What is refraction?", options: ["A. Bending of light", "B. Bouncing of light", "C. Absorption of light", "D. Emission of light"], correctAnswer: "A" },
      { question: "What is the wavelength formula?", options: ["A. λ = v/f", "B. λ = vf", "C. λ = v/f²", "D. λ = f/v"], correctAnswer: "A" },
      { question: "What is the work formula?", options: ["A. W = F × d", "B. W = F/d", "C. W = F + d", "D. W = F - d"], correctAnswer: "A" },
    ],
    hard: [
      { question: "What is the de Broglie wavelength formula?", options: ["A. λ = h/p", "B. λ = hc/E", "C. λ = hν", "D. λ = c/f"], correctAnswer: "A" },
      { question: "What is Planck's constant value?", options: ["A. 6.626×10⁻³⁴ J·s", "B. 6.626×10⁻³⁰ J·s", "C. 3.14×10⁻³⁴ J·s", "D. 9.8×10⁻³⁴ J·s"], correctAnswer: "A" },
      { question: "What is the Heisenberg uncertainty principle?", options: ["A. ΔxΔp ≥ ℏ/2", "B. ΔxΔp ≤ ℏ/2", "C. Δx = Δp", "D. ΔxΔp = 0"], correctAnswer: "A" },
      { question: "What is the Lorentz factor in special relativity?", options: ["A. 1/√(1-v²/c²)", "B. √(1-v²/c²)", "C. 1-v²/c²", "D. c²/v²"], correctAnswer: "A" },
      { question: "What is the Schwarzschild radius formula?", options: ["A. 2GM/c²", "B. GM/c²", "C. 2GM²/c²", "D. G M/c"], correctAnswer: "A" },
      { question: "What is the fine structure constant approximately?", options: ["A. 1/137", "B. 1/100", "C. 1/200", "D. 137"], correctAnswer: "A" },
      { question: "What is magnetic field unit?", options: ["A. Tesla", "B. Weber", "C. Henry", "D. Gauss only"], correctAnswer: "A" },
      { question: "What is the entropy formula?", options: ["A. ΔS = Q/T", "B. ΔS = Q×T", "C. ΔS = T/Q", "D. S = PV/T"], correctAnswer: "A" },
    ],
  },
  Chemistry: {
    easy: [
      { question: "What is the chemical symbol for Gold?", options: ["A. Go", "B. Au", "C. Ag", "D. Gd"], correctAnswer: "B" },
      { question: "What is the chemical formula for water?", options: ["A. H₂O", "B. CO₂", "C. NaCl", "D. H₂O₂"], correctAnswer: "A" },
      { question: "What is the atomic number of Carbon?", options: ["A. 4", "B. 6", "C. 12", "D. 8"], correctAnswer: "B" },
      { question: "What is the chemical symbol for Silver?", options: ["A. Si", "B. Ag", "C. Au", "D. Sr"], correctAnswer: "B" },
      { question: "What is the chemical formula for table salt?", options: ["A. NaCl", "B. KCl", "C. CaCl₂", "D. MgCl₂"], correctAnswer: "A" },
      { question: "What is the pH of pure water?", options: ["A. 5", "B. 7", "C. 9", "D. 14"], correctAnswer: "B" },
      { question: "What is the lightest element?", options: ["A. Helium", "B. Hydrogen", "C. Lithium", "D. Carbon"], correctAnswer: "B" },
      { question: "What gas do plants absorb?", options: ["A. Oxygen", "B. Nitrogen", "C. Carbon dioxide", "D. Hydrogen"], correctAnswer: "C" },
      { question: "What is the chemical symbol for Iron?", options: ["A. Ir", "B. Fe", "C. I", "D. In"], correctAnswer: "B" },
      { question: "How many atoms in a water molecule?", options: ["A. 2", "B. 3", "C. 4", "D. 5"], correctAnswer: "B" },
      { question: "What is the chemical symbol for Oxygen?", options: ["A. O", "B. Ox", "C. Om", "D. Og"], correctAnswer: "A" },
      { question: "What is dry ice made of?", options: ["A. Water", "B. CO₂", "C. N₂", "D. O₂"], correctAnswer: "B" },
      { question: "What is the most abundant gas in air?", options: ["A. Oxygen", "B. Carbon dioxide", "C. Nitrogen", "D. Argon"], correctAnswer: "C" },
      { question: "What is the chemical formula for methane?", options: ["A. CH₃", "B. CH₄", "C. C₂H₆", "D. C₂H₄"], correctAnswer: "B" },
      { question: "What is the symbol for Sodium?", options: ["A. So", "B. Na", "C. Sd", "D. Sn"], correctAnswer: "B" },
    ],
    medium: [
      { question: "What type of bond forms between two nonmetals?", options: ["A. Ionic", "B. Covalent", "C. Metallic", "D. Hydrogen"], correctAnswer: "B" },
      { question: "What is Avogadro's number?", options: ["A. 6.02×10²³", "B. 6.02×10²⁴", "C. 3.14×10²³", "D. 9.8×10²³"], correctAnswer: "A" },
      { question: "What is the molecular weight of H₂O?", options: ["A. 16 g/mol", "B. 18 g/mol", "C. 20 g/mol", "D. 22 g/mol"], correctAnswer: "B" },
      { question: "What is the charge of a proton?", options: ["A. -1", "B. 0", "C. +1", "D. +2"], correctAnswer: "C" },
      { question: "What is an isotope?", options: ["A. Same protons, different neutrons", "B. Same neutrons, different protons", "C. Same electrons, different protons", "D. Different protons and neutrons"], correctAnswer: "A" },
      { question: "What is the chemical formula for sulfuric acid?", options: ["A. HCl", "B. H₂SO₄", "C. HNO₃", "D. H₃PO₄"], correctAnswer: "B" },
      { question: "What is the oxidation state of O in H₂O?", options: ["A. -2", "B. +2", "C. -1", "D. 0"], correctAnswer: "A" },
      { question: "What type of reaction is 2H₂ + O₂ → 2H₂O?", options: ["A. Decomposition", "B. Synthesis", "C. Single replacement", "D. Double replacement"], correctAnswer: "B" },
      { question: "What is the electron configuration of Carbon?", options: ["A. 1s² 2s²", "B. 1s² 2s² 2p²", "C. 1s² 2s² 2p⁴", "D. 1s² 2s² 2p⁶"], correctAnswer: "B" },
      { question: "What is the halogen in period 3?", options: ["A. Fluorine", "B. Chlorine", "C. Bromine", "D. Iodine"], correctAnswer: "B" },
      { question: "What is the name of Group 1 elements?", options: ["A. Alkaline earth metals", "B. Alkali metals", "C. Halogens", "D. Noble gases"], correctAnswer: "B" },
      { question: "What is the empirical formula of glucose (C₆H₁₂O₆)?", options: ["A. C₆H₁₂O₆", "B. CH₂O", "C. C₂H₄O₂", "D. CHO"], correctAnswer: "B" },
      { question: "What is a catalyst?", options: ["A. Speeds up reaction", "B. Slows down reaction", "C. Changes products", "D. Increases activation energy"], correctAnswer: "A" },
      { question: "What is the pH of a base?", options: ["A. Less than 7", "B. Equal to 7", "C. Greater than 7", "D. Equal to 0"], correctAnswer: "C" },
      { question: "What is the chemical formula for ammonia?", options: ["A. NH₂", "B. NH₃", "C. NH₄", "D. N₂H₄"], correctAnswer: "B" },
    ],
    hard: [
      { question: "What is the hybridization of carbon in methane?", options: ["A. sp", "B. sp²", "C. sp³", "D. sp³d"], correctAnswer: "C" },
      { question: "What is the electron geometry of NH₃?", options: ["A. Tetrahedral", "B. Trigonal pyramidal", "C. Bent", "D. Linear"], correctAnswer: "A" },
      { question: "What is the bond angle in a perfect tetrahedron?", options: ["A. 90°", "B. 104.5°", "C. 109.5°", "D. 120°"], correctAnswer: "C" },
      { question: "What is the rate law for a first-order reaction?", options: ["A. Rate = k[A]²", "B. Rate = k[A]", "C. Rate = k", "D. Rate = k[A][B]"], correctAnswer: "B" },
      { question: "What is the equilibrium constant expression?", options: ["A. [Products]/[Reactants]", "B. [Reactants]/[Products]", "C. [Products]×[Reactants]", "D. [Products]-[Reactants]"], correctAnswer: "A" },
      { question: "What is the enthalpy change at constant pressure?", options: ["A. ΔU", "B. ΔH", "C. ΔG", "D. ΔS"], correctAnswer: "B" },
      { question: "What is a buffer solution?", options: ["A. Resists pH change", "B. Neutralizes acids", "C. Neutralizes bases", "D. Has pH = 7"], correctAnswer: "A" },
    ],
  },
  Biology: {
    easy: [
      { question: "What is the powerhouse of the cell?", options: ["A. Nucleus", "B. Ribosome", "C. Mitochondria", "D. Golgi apparatus"], correctAnswer: "C" },
      { question: "What do plants use for photosynthesis?", options: ["A. Oxygen", "B. Carbon dioxide", "C. Nitrogen", "D. Hydrogen"], correctAnswer: "B" },
      { question: "What is the basic unit of life?", options: ["A. Atom", "B. Molecule", "C. Cell", "D. Organ"], correctAnswer: "C" },
      { question: "What carries genetic information?", options: ["A. RNA", "B. DNA", "C. Protein", "D. Carbohydrate"], correctAnswer: "B" },
      { question: "What organ pumps blood?", options: ["A. Brain", "B. Liver", "C. Heart", "D. Lungs"], correctAnswer: "C" },
      { question: "What is the largest organ in human body?", options: ["A. Liver", "B. Brain", "C. Skin", "D. Heart"], correctAnswer: "C" },
      { question: "How many chromosomes do humans have?", options: ["A. 23", "B. 46", "C. 48", "D. 44"], correctAnswer: "B" },
      { question: "What gas do we breathe in?", options: ["A. Carbon dioxide", "B. Nitrogen", "C. Oxygen", "D. Hydrogen"], correctAnswer: "C" },
      { question: "What is the green pigment in plants?", options: ["A. Melanin", "B. Chlorophyll", "C. Hemoglobin", "D. Keratin"], correctAnswer: "B" },
      { question: "What type of cell has a nucleus?", options: ["A. Prokaryotic", "B. Eukaryotic", "C. Viral", "D. Bacterial"], correctAnswer: "B" },
      { question: "What is the process of cell division called?", options: ["A. Fertilization", "B. Mitosis", "C. Osmosis", "D. Diffusion"], correctAnswer: "B" },
      { question: "What blood type is the universal donor?", options: ["A. A", "B. AB", "C. O", "D. B+"], correctAnswer: "C" },
      { question: "What system controls the body?", options: ["A. Circulatory", "B. Nervous", "C. Digestive", "D. Respiratory"], correctAnswer: "B" },
      { question: "Where does digestion begin?", options: ["A. Stomach", "B. Mouth", "C. Small intestine", "D. Esophagus"], correctAnswer: "B" },
      { question: "What is the hardest substance in the body?", options: ["A. Bone", "B. Enamel", "C. Cartilage", "D. Keratin"], correctAnswer: "B" },
    ],
    medium: [
      { question: "What are the four bases of DNA?", options: ["A. A, T, G, C", "B. A, U, G, C", "C. A, T, G, U", "D. T, U, G, C"], correctAnswer: "A" },
      { question: "What is the function of ribosomes?", options: ["A. Energy production", "B. Protein synthesis", "C. Cell division", "D. Storage"], correctAnswer: "B" },
      { question: "What is the process of making RNA from DNA?", options: ["A. Translation", "B. Transcription", "C. Replication", "D. Mutation"], correctAnswer: "B" },
      { question: "What type of bond holds DNA strands together?", options: ["A. Covalent", "B. Ionic", "C. Hydrogen", "D. Peptide"], correctAnswer: "C" },
      { question: "What is the role of mRNA?", options: ["A. Stores DNA", "B. Carries genetic code", "C. Makes proteins", "D. Transports amino acids"], correctAnswer: "B" },
      { question: "What is the powerhouse equation?", options: ["A. 6CO₂ + 6H₂O → C₆H₁₂O₆ + 6O₂", "B. C₆H₁₂O₆ + 6O₂ → 6CO₂ + 6H₂O + ATP", "C. ATP → ADP + P", "D. All above"], correctAnswer: "D" },
      { question: "What is the role of enzymes?", options: ["A. Provide energy", "B. Speed up reactions", "C. Store information", "D. Transport oxygen"], correctAnswer: "B" },
      { question: "What is natural selection?", options: ["A. Random changes", "B. Survival of fittest", "C. Genetic drift", "D. Mutation"], correctAnswer: "B" },
      { question: "What is the function of the endoplasmic reticulum?", options: ["A. Protein transport", "B. Energy production", "C. DNA storage", "D. Cell division"], correctAnswer: "A" },
      { question: "What is the cell membrane made of?", options: ["A. Protein only", "B. Phospholipid bilayer", "C. Carbohydrates", "D. Nucleic acids"], correctAnswer: "B" },
      { question: "What is osmosis?", options: ["A. Movement of solutes", "B. Movement of water", "C. Active transport", "D. Endocytosis"], correctAnswer: "B" },
      { question: "What is the role of tRNA?", options: ["A. Copy DNA", "B. Carry amino acids", "C. Make ribosomes", "D. Store energy"], correctAnswer: "B" },
      { question: "What is crossing over?", options: ["A. DNA replication", "B. Exchange of genetic material", "C. Cell division", "D. Mutation"], correctAnswer: "B" },
      { question: "What is a codon?", options: ["A. Single nucleotide", "B. Three nucleotides", "C. Four nucleotides", "D. Amino acid"], correctAnswer: "B" },
      { question: "What is the role of lysosomes?", options: ["A. Protein synthesis", "B. Digestion", "C. Energy production", "D. DNA storage"], correctAnswer: "B" },
    ],
    hard: [
      { question: "What is the Krebs cycle also known as?", options: ["A. Calvin cycle", "B. Citric acid cycle", "C. Glycolysis", "D. Electron transport"], correctAnswer: "B" },
      { question: "What is the role of NADH?", options: ["A. Store genetic info", "B. Electron carrier", "C. Enzyme", "D. Structural protein"], correctAnswer: "B" },
      { question: "What is the lac operon?", options: ["A. Gene regulation", "B. Protein structure", "C. Cell membrane", "D. Energy molecule"], correctAnswer: "A" },
      { question: "What is apoptosis?", options: ["A. Cell division", "B. Programmed cell death", "C. Mutation", "D. DNA repair"], correctAnswer: "B" },
      { question: "What is the function of telomeres?", options: ["A. Code for proteins", "B. Protect chromosome ends", "C. Produce energy", "D. Fight infections"], correctAnswer: "B" },
      { question: "What is PCR?", options: ["A. Protein synthesis", "B. DNA amplification", "C. RNA processing", "D. Cell division"], correctAnswer: "B" },
    ],
  },
  History: {
    easy: [
      { question: "In what year did World War II end?", options: ["A. 1943", "B. 1944", "C. 1945", "D. 1946"], correctAnswer: "C" },
      { question: "Who was the first US President?", options: ["A. Jefferson", "B. Lincoln", "C. Washington", "D. Adams"], correctAnswer: "C" },
      { question: "When did World War I start?", options: ["A. 1912", "B. 1913", "C. 1914", "D. 1915"], correctAnswer: "C" },
      { question: "What year was America discovered?", options: ["A. 1392", "B. 1492", "C. 1592", "D. 1692"], correctAnswer: "B" },
      { question: "Who built the pyramids?", options: ["A. Romans", "B. Greeks", "C. Egyptians", "D. Persians"], correctAnswer: "C" },
      { question: "When was the Declaration of Independence signed?", options: ["A. 1774", "B. 1775", "C. 1776", "D. 1777"], correctAnswer: "C" },
      { question: "What was the name of the first satellite?", options: ["A. Apollo", "B. Sputnik", "C. Explorer", "D. Voyager"], correctAnswer: "B" },
      { question: "Who was the first man on the moon?", options: ["A. Yuri Gagarin", "B. Buzz Aldrin", "C. Neil Armstrong", "D. John Glenn"], correctAnswer: "C" },
      { question: "What empire built the Colosseum?", options: ["A. Greek", "B. Roman", "C. Persian", "D. Egyptian"], correctAnswer: "B" },
      { question: "When did the Berlin Wall fall?", options: ["A. 1987", "B. 1988", "C. 1989", "D. 1990"], correctAnswer: "C" },
      { question: "Who painted the Mona Lisa?", options: ["A. Michelangelo", "B. Raphael", "C. Da Vinci", "D. Botticelli"], correctAnswer: "C" },
      { question: "What country gave America the Statue of Liberty?", options: ["A. England", "B. Spain", "C. France", "D. Italy"], correctAnswer: "C" },
      { question: "Who discovered America?", options: ["A. Vespucci", "B. Columbus", "C. Magellan", "D. Cook"], correctAnswer: "B" },
      { question: "What was the Titanic?", options: ["A. Warship", "B. Passenger ship", "C. Cargo ship", "D. Submarine"], correctAnswer: "B" },
      { question: "When did the French Revolution start?", options: ["A. 1779", "B. 1789", "C. 1799", "D. 1769"], correctAnswer: "B" },
    ],
    medium: [
      { question: "What treaty ended World War I?", options: ["A. Versailles", "B. Paris", "C. Vienna", "D. Westphalia"], correctAnswer: "A" },
      { question: "Who was the leader of Nazi Germany?", options: ["A. Mussolini", "B. Hitler", "C. Stalin", "D. Franco"], correctAnswer: "B" },
      { question: "What year was the United Nations founded?", options: ["A. 1943", "B. 1944", "C. 1945", "D. 1946"], correctAnswer: "C" },
      { question: "Who was the first Roman Emperor?", options: ["A. Julius Caesar", "B. Augustus", "C. Nero", "D. Tiberius"], correctAnswer: "B" },
      { question: "What was the Cold War between?", options: ["A. US and China", "B. US and USSR", "C. UK and Germany", "D. France and Russia"], correctAnswer: "B" },
      { question: "When was the Magna Carta signed?", options: ["A. 1066", "B. 1215", "C. 1348", "D. 1492"], correctAnswer: "B" },
      { question: "What empire was ruled by Genghis Khan?", options: ["A. Ottoman", "B. Mongol", "C. Persian", "D. Chinese"], correctAnswer: "B" },
      { question: "Who wrote the Declaration of Independence?", options: ["A. Washington", "B. Franklin", "C. Jefferson", "D. Adams"], correctAnswer: "C" },
      { question: "What was the Renaissance?", options: ["A. War", "B. Cultural rebirth", "C. Plague", "D. Revolution"], correctAnswer: "B" },
      { question: "What caused the Great Depression?", options: ["A. War", "B. Stock market crash", "C. Drought", "D. Strike"], correctAnswer: "B" },
      { question: "Who was Julius Caesar assassinated by?", options: ["A. Enemies", "B. Senators", "C. Soldiers", "D. Foreigners"], correctAnswer: "B" },
      { question: "What was the Iron Curtain?", options: ["A. Physical wall", "B. Ideological divide", "C. Military alliance", "D. Trade barrier"], correctAnswer: "B" },
    ],
    hard: [
      { question: "What year did the Byzantine Empire fall?", options: ["A. 1204", "B. 1341", "C. 1453", "D. 1492"], correctAnswer: "C" },
      { question: "What was the Hundred Years' War?", options: ["A. 100 years exactly", "B. 116 years", "C. 1337-1453", "D. Both B and C"], correctAnswer: "D" },
      { question: "Who was Hannibal?", options: ["A. Roman general", "B. Carthaginian general", "C. Greek philosopher", "D. Persian king"], correctAnswer: "B" },
      { question: "What was the Treaty of Westphalia?", options: ["A. Ended WWII", "B. Ended Thirty Years War", "C. Ended WWI", "D. Ended Napoleonic Wars"], correctAnswer: "B" },
      { question: "Who was the Sun King?", options: ["A. Louis XIII", "B. Louis XIV", "C. Louis XV", "D. Louis XVI"], correctAnswer: "B" },
    ],
  },
  Geography: {
    easy: [
      { question: "What is the largest continent?", options: ["A. Africa", "B. Asia", "C. Europe", "D. North America"], correctAnswer: "B" },
      { question: "What is the capital of France?", options: ["A. London", "B. Berlin", "C. Paris", "D. Madrid"], correctAnswer: "C" },
      { question: "What is the longest river?", options: ["A. Amazon", "B. Nile", "C. Mississippi", "D. Yangtze"], correctAnswer: "B" },
      { question: "What is the largest ocean?", options: ["A. Atlantic", "B. Indian", "C. Pacific", "D. Arctic"], correctAnswer: "C" },
      { question: "What is the smallest continent?", options: ["A. Europe", "B. Australia", "C. Antarctica", "D. South America"], correctAnswer: "B" },
      { question: "What is the capital of Japan?", options: ["A. Osaka", "B. Kyoto", "C. Tokyo", "D. Hiroshima"], correctAnswer: "C" },
      { question: "What is the largest country?", options: ["A. China", "B. USA", "C. Russia", "D. Canada"], correctAnswer: "C" },
      { question: "What is the capital of Italy?", options: ["A. Milan", "B. Venice", "C. Rome", "D. Florence"], correctAnswer: "C" },
      { question: "What is the highest mountain?", options: ["A. K2", "B. Everest", "C. Kilimanjaro", "D. Fuji"], correctAnswer: "B" },
      { question: "How many continents are there?", options: ["A. 5", "B. 6", "C. 7", "D. 8"], correctAnswer: "C" },
      { question: "What is the capital of China?", options: ["A. Shanghai", "B. Beijing", "C. Hong Kong", "D. Guangzhou"], correctAnswer: "B" },
      { question: "What is the largest desert?", options: ["A. Sahara", "B. Antarctic", "C. Gobi", "D. Arabian"], correctAnswer: "B" },
      { question: "What country has the most people?", options: ["A. USA", "B. India", "C. China", "D. Indonesia"], correctAnswer: "C" },
      { question: "What is the capital of Germany?", options: ["A. Munich", "B. Hamburg", "C. Berlin", "D. Frankfurt"], correctAnswer: "C" },
      { question: "What is the capital of Brazil?", options: ["A. Rio", "B. São Paulo", "C. Brasília", "D. Salvador"], correctAnswer: "C" },
    ],
    medium: [
      { question: "What is the capital of Australia?", options: ["A. Sydney", "B. Melbourne", "C. Canberra", "D. Brisbane"], correctAnswer: "C" },
      { question: "What is the deepest lake?", options: ["A. Superior", "B. Baikal", "C. Victoria", "D. Tanganyika"], correctAnswer: "B" },
      { question: "What country is called the Land of Rising Sun?", options: ["A. China", "B. Korea", "C. Japan", "D. Thailand"], correctAnswer: "C" },
      { question: "What is the capital of Canada?", options: ["A. Toronto", "B. Vancouver", "C. Ottawa", "D. Montreal"], correctAnswer: "C" },
      { question: "What is the largest island?", options: ["A. Borneo", "B. Madagascar", "C. Greenland", "D. New Guinea"], correctAnswer: "C" },
      { question: "What is the capital of India?", options: ["A. Mumbai", "B. Kolkata", "C. New Delhi", "D. Bangalore"], correctAnswer: "C" },
      { question: "What is the capital of Egypt?", options: ["A. Alexandria", "B. Cairo", "C. Luxor", "D. Giza"], correctAnswer: "B" },
      { question: "What is the capital of Spain?", options: ["A. Barcelona", "B. Madrid", "C. Valencia", "D. Seville"], correctAnswer: "B" },
      { question: "What is the capital of Russia?", options: ["A. St. Petersburg", "B. Moscow", "C. Novosibirsk", "D. Kazan"], correctAnswer: "B" },
      { question: "What is the capital of South Korea?", options: ["A. Busan", "B. Seoul", "C. Incheon", "D. Daegu"], correctAnswer: "B" },
      { question: "What is the longest mountain range?", options: ["A. Himalayas", "B. Alps", "C. Andes", "D. Rockies"], correctAnswer: "C" },
      { question: "What is the capital of Mexico?", options: ["A. Guadalajara", "B. Monterrey", "C. Mexico City", "D. Cancun"], correctAnswer: "C" },
      { question: "What country has most islands?", options: ["A. Indonesia", "B. Philippines", "C. Sweden", "D. Japan"], correctAnswer: "C" },
      { question: "What is the capital of Argentina?", options: ["A. Córdoba", "B. Buenos Aires", "C. Rosario", "D. Mendoza"], correctAnswer: "B" },
      { question: "What is the capital of Turkey?", options: ["A. Istanbul", "B. Izmir", "C. Ankara", "D. Antalya"], correctAnswer: "C" },
    ],
    hard: [
      { question: "What is the capital of Myanmar?", options: ["A. Yangon", "B. Mandalay", "C. Naypyidaw", "D. Bago"], correctAnswer: "C" },
      { question: "What is the capital of Sri Lanka?", options: ["A. Colombo", "B. Sri Jayawardenepura Kotte", "C. Kandy", "D. Galle"], correctAnswer: "B" },
      { question: "What is the capital of Kazakhstan?", options: ["A. Almaty", "B. Astana", "C. Shymkent", "D. Karaganda"], correctAnswer: "B" },
      { question: "What is the capital of Nigeria?", options: ["A. Lagos", "B. Abuja", "C. Kano", "D. Ibadan"], correctAnswer: "B" },
      { question: "What is the capital of Brazil's smallest state?", options: ["A. Vitória", "B. Florianópolis", "C. Porto Alegre", "D. Curitiba"], correctAnswer: "A" },
    ],
  },
  Literature: {
    easy: [
      { question: "Who wrote Romeo and Juliet?", options: ["A. Dickens", "B. Shakespeare", "C. Austen", "D. Twain"], correctAnswer: "B" },
      { question: "What is a metaphor?", options: ["A. Direct comparison", "B. Using like or as", "C. Giving human traits", "D. Exaggeration"], correctAnswer: "A" },
      { question: "Who wrote Macbeth?", options: ["A. Shakespeare", "B. Dickens", "C. Hemingway", "D. Orwell"], correctAnswer: "A" },
      { question: "What is a protagonist?", options: ["A. Villain", "B. Main character", "C. Narrator", "D. Author"], correctAnswer: "B" },
      { question: "What is a poem?", options: ["A. Long novel", "B. Short story", "C. Rhythmic writing", "D. Biography"], correctAnswer: "C" },
      { question: "Who wrote Pride and Prejudice?", options: ["A. Brontë", "B. Austen", "C. Dickens", "D. Eliot"], correctAnswer: "B" },
      { question: "What is a haiku?", options: ["A. 5-7-5 syllables", "B. 14 lines", "C. Free verse", "D. Rhyming poem"], correctAnswer: "A" },
      { question: "What is a setting?", options: ["A. Characters", "B. Time and place", "C. Plot", "D. Theme"], correctAnswer: "B" },
      { question: "Who wrote Hamlet?", options: ["A. Shakespeare", "B. Miller", "C. Ibsen", "D. Wilde"], correctAnswer: "A" },
      { question: "What is a novel?", options: ["A. Short story", "B. Long fiction", "C. Poem", "D. Play"], correctAnswer: "B" },
    ],
    medium: [
      { question: "What is personification?", options: ["A. Comparing things", "B. Human traits to objects", "C. Exaggeration", "D. Opposite meaning"], correctAnswer: "B" },
      { question: "Who wrote 1984?", options: ["A. Huxley", "B. Orwell", "C. Wells", "D. Asimov"], correctAnswer: "B" },
      { question: "What is foreshadowing?", options: ["A. Hinting future events", "B. Ending of story", "C. Character growth", "D. Dialogue"], correctAnswer: "A" },
      { question: "What is a sonnet?", options: ["A. 10 lines", "B. 14 lines", "C. 5 lines", "D. Free verse"], correctAnswer: "B" },
      { question: "Who wrote The Great Gatsby?", options: ["A. Hemingway", "B. Fitzgerald", "C. Steinbeck", "D. Faulkner"], correctAnswer: "B" },
      { question: "What is irony?", options: ["A. Direct statement", "B. Opposite of expected", "C. Sad ending", "D. Happy ending"], correctAnswer: "B" },
      { question: "What is a theme?", options: ["A. Plot", "B. Main idea", "C. Character", "D. Setting"], correctAnswer: "B" },
      { question: "Who wrote Jane Eyre?", options: ["A. E. Brontë", "B. C. Brontë", "C. Austen", "D. Eliot"], correctAnswer: "B" },
      { question: "What is a climax?", options: ["A. Beginning", "B. Peak of tension", "C. Ending", "D. Resolution"], correctAnswer: "B" },
      { question: "What is alliteration?", options: ["A. Same consonant sounds", "B. Rhyming", "C. Repetition", "D. Comparing"], correctAnswer: "A" },
    ],
    hard: [
      { question: "What is an antagonist?", options: ["A. Hero", "B. Villain/opposer", "C. Narrator", "D. Side character"], correctAnswer: "B" },
      { question: "Who wrote Animal Farm?", options: ["A. Orwell", "B. Huxley", "C. Golding", "D. Bradbury"], correctAnswer: "A" },
      { question: "What is symbolism?", options: ["A. Literal meaning", "B. Objects representing ideas", "C. Theme", "D. Plot device"], correctAnswer: "B" },
      { question: "What is a motif?", options: ["A. Single symbol", "B. Recurring element", "C. Plot", "D. Character"], correctAnswer: "B" },
      { question: "What is onomatopoeia?", options: ["A. Comparing", "B. Sound words", "C. Exaggeration", "D. Human traits"], correctAnswer: "B" },
    ],
  },
  Economics: {
    easy: [
      { question: "What is supply and demand?", options: ["A. Price system", "B. Government control", "C. War", "D. Education"], correctAnswer: "A" },
      { question: "What is inflation?", options: ["A. Prices going down", "B. Prices going up", "C. No change", "D. High unemployment"], correctAnswer: "B" },
      { question: "What is GDP?", options: ["A. Debt", "B. Total output", "C. Tax", "D. Savings"], correctAnswer: "B" },
      { question: "What is a market?", options: ["A. Government", "B. Place to trade", "C. School", "D. Hospital"], correctAnswer: "B" },
      { question: "What is scarcity?", options: ["A. Unlimited resources", "B. Limited resources", "C. High supply", "D. No demand"], correctAnswer: "B" },
      { question: "What is a bank?", options: ["A. Store", "B. Financial institution", "C. School", "D. Hospital"], correctAnswer: "B" },
      { question: "What is a budget?", options: ["A. Random spending", "B. Spending plan", "C. Income", "D. Debt"], correctAnswer: "B" },
      { question: "What is an import?", options: ["A. Selling abroad", "B. Buying from abroad", "C. Local goods", "D. Tax"], correctAnswer: "B" },
      { question: "What is an export?", options: ["A. Buying abroad", "B. Selling abroad", "C. Local goods", "D. Tax"], correctAnswer: "B" },
      { question: "What is money?", options: ["A. Paper only", "B. Medium of exchange", "C. Credit", "D. Barter"], correctAnswer: "B" },
    ],
    medium: [
      { question: "What is opportunity cost?", options: ["A. Price paid", "B. Next best alternative", "C. Profit", "D. Loss"], correctAnswer: "B" },
      { question: "What is a monopoly?", options: ["A. Many sellers", "B. One seller", "C. Few sellers", "D. Government"], correctAnswer: "B" },
      { question: "What is fiscal policy?", options: ["A. Bank policy", "B. Government spending/tax", "C. Trade policy", "D. War policy"], correctAnswer: "B" },
      { question: "What is monetary policy?", options: ["A. Tax policy", "B. Interest rate policy", "C. Trade policy", "D. War policy"], correctAnswer: "B" },
      { question: "What is a recession?", options: ["A. Economic growth", "B. Economic decline", "C. Stability", "D. High inflation"], correctAnswer: "B" },
      { question: "What is a stock?", options: ["A. Loan", "B. Ownership share", "C. Bond", "D. Savings"], correctAnswer: "B" },
      { question: "What is a tariff?", options: ["A. Subsidy", "B. Import tax", "C. Export tax", "D. Income tax"], correctAnswer: "B" },
      { question: "What is compound interest?", options: ["A. Simple interest", "B. Interest on interest", "C. No interest", "D. Negative interest"], correctAnswer: "B" },
      { question: "What is a central bank?", options: ["A. Local bank", "B. National bank", "C. Credit union", "D. Investment bank"], correctAnswer: "B" },
      { question: "What is a trade deficit?", options: ["A. Exports > Imports", "B. Imports > Exports", "C. Balanced trade", "D. No trade"], correctAnswer: "B" },
    ],
    hard: [
      { question: "What is elasticity?", options: ["A. Responsiveness", "B. Rigidity", "C. Stability", "D. Growth"], correctAnswer: "A" },
      { question: "What is marginal utility?", options: ["A. Total satisfaction", "B. Additional satisfaction", "C. No satisfaction", "D. Negative satisfaction"], correctAnswer: "B" },
      { question: "What is oligopoly?", options: ["A. One seller", "B. Few sellers", "C. Many sellers", "D. No sellers"], correctAnswer: "B" },
      { question: "What is comparative advantage?", options: ["A. Absolute advantage", "B. Lower opportunity cost", "C. Higher cost", "D. No trade"], correctAnswer: "B" },
      { question: "What is an externality?", options: ["A. Internal cost", "B. Spillover effect", "C. Market price", "D. Tax"], correctAnswer: "B" },
    ],
  },
  ComputerScience: {
    easy: [
      { question: "What is a CPU?", options: ["A. Screen", "B. Processor", "C. Keyboard", "D. Mouse"], correctAnswer: "B" },
      { question: "What is RAM?", options: ["A. Storage", "B. Memory", "C. Processor", "D. Screen"], correctAnswer: "B" },
      { question: "What is software?", options: ["A. Hardware", "B. Programs", "C. Screen", "D. Keyboard"], correctAnswer: "B" },
      { question: "What is an algorithm?", options: ["A. Computer", "B. Step-by-step process", "C. Program", "D. Data"], correctAnswer: "B" },
      { question: "What is a variable?", options: ["A. Fixed value", "B. Container for data", "C. Function", "D. Loop"], correctAnswer: "B" },
      { question: "What is a function?", options: ["A. Variable", "B. Reusable code", "C. Loop", "D. Data"], correctAnswer: "B" },
      { question: "What is a loop?", options: ["A. Variable", "B. Repeated action", "C. Function", "D. Data"], correctAnswer: "B" },
      { question: "What is HTML?", options: ["A. Programming language", "B. Markup language", "C. Database", "D. Operating system"], correctAnswer: "B" },
      { question: "What is a bug?", options: ["A. Feature", "B. Error", "C. Function", "D. Variable"], correctAnswer: "B" },
      { question: "What is the internet?", options: ["A. Computer", "B. Global network", "C. Software", "D. Hardware"], correctAnswer: "B" },
    ],
    medium: [
      { question: "What is an array?", options: ["A. Single value", "B. Collection of values", "C. Function", "D. Loop"], correctAnswer: "B" },
      { question: "What is a boolean?", options: ["A. Number", "B. True/False", "C. Text", "D. List"], correctAnswer: "B" },
      { question: "What is Python?", options: ["A. Snake", "B. Programming language", "C. Database", "D. Hardware"], correctAnswer: "B" },
      { question: "What is a database?", options: ["A. Spreadsheet", "B. Organized data storage", "C. Program", "D. Hardware"], correctAnswer: "B" },
      { question: "What is a server?", options: ["A. Client", "B. Provides services", "C. User", "D. Browser"], correctAnswer: "B" },
      { question: "What is JavaScript?", options: ["A. Markup", "B. Programming language", "C. Database", "D. Hardware"], correctAnswer: "B" },
      { question: "What is CSS?", options: ["A. Programming", "B. Styling language", "C. Database", "D. Hardware"], correctAnswer: "B" },
      { question: "What is debugging?", options: ["A. Creating bugs", "B. Finding errors", "C. Writing code", "D. Deleting code"], correctAnswer: "B" },
      { question: "What is a string?", options: ["A. Number", "B. Text", "C. True/False", "D. List"], correctAnswer: "B" },
      { question: "What is SQL?", options: ["A. Programming", "B. Database query", "C. Markup", "D. Hardware"], correctAnswer: "B" },
    ],
    hard: [
      { question: "What is Big O notation?", options: ["A. Speed measurement", "B. Complexity measure", "C. Memory measure", "D. Code length"], correctAnswer: "B" },
      { question: "What is a linked list?", options: ["A. Array", "B. Chain of nodes", "C. Tree", "D. Stack"], correctAnswer: "B" },
      { question: "What is recursion?", options: ["A. Loop", "B. Function calling itself", "C. Array", "D. Variable"], correctAnswer: "B" },
      { question: "What is a hash table?", options: ["A. Array", "B. Key-value storage", "C. Tree", "D. Stack"], correctAnswer: "B" },
      { question: "What is encryption?", options: ["A. Decoding", "B. Encoding securely", "C. Deleting", "D. Copying"], correctAnswer: "B" },
    ],
  },
  Civics: {
    easy: [
      { question: "What is democracy?", options: ["A. One ruler", "B. Rule by people", "C. Military rule", "D. Religious rule"], correctAnswer: "B" },
      { question: "What is a constitution?", options: ["A. Law book", "B. Fundamental law", "C. Novel", "D. History book"], correctAnswer: "B" },
      { question: "What is voting?", options: ["A. Fighting", "B. Electing", "C. Working", "D. Studying"], correctAnswer: "B" },
      { question: "What is a citizen?", options: ["A. Tourist", "B. Legal member", "C. Visitor", "D. Worker"], correctAnswer: "B" },
      { question: "What is a tax?", options: ["A. Gift", "B. Government fee", "C. Loan", "D. Reward"], correctAnswer: "B" },
      { question: "What is the rule of law?", options: ["A. Rule by king", "B. Laws apply to all", "C. No laws", "D. Military rule"], correctAnswer: "B" },
      { question: "What is freedom of speech?", options: ["A. Limited talk", "B. Right to express", "C. No talking", "D. Government speech"], correctAnswer: "B" },
      { question: "What is a right?", options: ["A. Privilege", "B. Entitlement", "C. Duty", "D. Tax"], correctAnswer: "B" },
      { question: "What is government?", options: ["A. Business", "B. Ruling body", "C. School", "D. Family"], correctAnswer: "B" },
      { question: "What is a law?", options: ["A. Suggestion", "B. Rule", "C. Game", "D. Book"], correctAnswer: "B" },
    ],
    medium: [
      { question: "What is a republic?", options: ["A. Monarchy", "B. Representative democracy", "C. Dictatorship", "D. Anarchy"], correctAnswer: "B" },
      { question: "What are the three branches?", options: ["A. Military, Police, Court", "B. Legislative, Executive, Judicial", "C. Federal, State, Local", "D. President, Senate, House"], correctAnswer: "B" },
      { question: "What is Congress?", options: ["A. President", "B. Legislature", "C. Court", "D. Military"], correctAnswer: "B" },
      { question: "What is the Bill of Rights?", options: ["A. Tax law", "B. First 10 amendments", "C. Constitution", "D. Declaration"], correctAnswer: "B" },
      { question: "What is federalism?", options: ["A. One government", "B. Shared power", "C. No government", "D. Military rule"], correctAnswer: "B" },
      { question: "What is the Supreme Court?", options: ["A. Lower court", "B. Highest court", "C. Legislature", "D. Executive"], correctAnswer: "B" },
      { question: "What is checks and balances?", options: ["A. Banking", "B. Power limits", "C. Accounting", "D. Weights"], correctAnswer: "B" },
      { question: "What is the Electoral College?", options: ["A. School", "B. Presidential voting", "C. Congress", "D. Court"], correctAnswer: "B" },
      { question: "What is an amendment?", options: ["A. Law", "B. Constitution change", "C. Tax", "D. Right"], correctAnswer: "B" },
      { question: "What is the United Nations?", options: ["A. US organization", "B. International organization", "C. European group", "D. Military alliance"], correctAnswer: "B" },
    ],
    hard: [
      { question: "What is impeachment?", options: ["A. Election", "B. Removing official", "C. Hiring", "D. Taxing"], correctAnswer: "B" },
      { question: "What is separation of powers?", options: ["A. Division of government", "B. War", "C. Election", "D. Tax"], correctAnswer: "A" },
      { question: "What is due process?", options: ["A. Fast trial", "B. Legal fairness", "C. No trial", "D. Military court"], correctAnswer: "B" },
      { question: "What is a treaty?", options: ["A. War", "B. International agreement", "C. Law", "D. Tax"], correctAnswer: "B" },
      { question: "What is diplomacy?", options: ["A. War", "B. Negotiation", "C. Tax", "D. Law"], correctAnswer: "B" },
    ],
  },
  English: {
    easy: [
      { question: "What is a noun?", options: ["A. Action word", "B. Person, place, thing", "C. Describing word", "D. Connecting word"], correctAnswer: "B" },
      { question: "What is a verb?", options: ["A. Person", "B. Action word", "C. Place", "D. Thing"], correctAnswer: "B" },
      { question: "What is an adjective?", options: ["A. Action", "B. Describing word", "C. Person", "D. Place"], correctAnswer: "B" },
      { question: "What is a sentence?", options: ["A. Word", "B. Complete thought", "C. Letter", "D. Paragraph"], correctAnswer: "B" },
      { question: "What is a period?", options: ["A. Question mark", "B. End mark", "C. Comma", "D. Apostrophe"], correctAnswer: "B" },
      { question: "What is a pronoun?", options: ["A. Noun", "B. Replaces noun", "C. Verb", "D. Adjective"], correctAnswer: "B" },
      { question: "What is a question mark?", options: ["A. Period", "B. End of question", "C. Comma", "D. Exclamation"], correctAnswer: "B" },
      { question: "What is past tense?", options: ["A. Now", "B. Yesterday", "C. Tomorrow", "D. Always"], correctAnswer: "B" },
      { question: "What is a comma?", options: ["A. Period", "B. Pause mark", "C. Question mark", "D. End mark"], correctAnswer: "B" },
      { question: "What is a paragraph?", options: ["A. Sentence", "B. Group of sentences", "C. Word", "D. Letter"], correctAnswer: "B" },
    ],
    medium: [
      { question: "What is an adverb?", options: ["A. Describes nouns", "B. Describes verbs", "C. Is a noun", "D. Is a verb"], correctAnswer: "B" },
      { question: "What is a preposition?", options: ["A. Action", "B. Shows relationship", "C. Person", "D. Place"], correctAnswer: "B" },
      { question: "What is subject-verb agreement?", options: ["A. Disagreement", "B. Matching forms", "C. Fighting", "D. Separation"], correctAnswer: "B" },
      { question: "What is a conjunction?", options: ["A. Separating word", "B. Connecting word", "C. Describing word", "D. Action word"], correctAnswer: "B" },
      { question: "What is present perfect tense?", options: ["A. Past", "B. Has/have + past participle", "C. Future", "D. Simple present"], correctAnswer: "B" },
      { question: "What is a thesis statement?", options: ["A. Conclusion", "B. Main argument", "C. Introduction", "D. Quote"], correctAnswer: "B" },
      { question: "What is a fragment?", options: ["A. Complete sentence", "B. Incomplete sentence", "C. Paragraph", "D. Essay"], correctAnswer: "B" },
      { question: "What is a gerund?", options: ["A. Noun", "B. -ing verb as noun", "C. Adjective", "D. Adverb"], correctAnswer: "B" },
      { question: "What is a semicolon?", options: ["A. Period", "B. Connects sentences", "C. Comma", "D. Colon"], correctAnswer: "B" },
      { question: "What is parallel structure?", options: ["A. Random list", "B. Consistent form", "C. Mixed forms", "D. One item"], correctAnswer: "B" },
    ],
    hard: [
      { question: "What is a compound sentence?", options: ["A. One clause", "B. Two independent clauses", "C. Dependent clause", "D. Fragment"], correctAnswer: "B" },
      { question: "What is a complex sentence?", options: ["A. Simple sentence", "B. Independent + dependent", "C. Two independent", "D. Fragment"], correctAnswer: "B" },
      { question: "What is a reflexive pronoun?", options: ["A. I", "B. Himself/herself", "C. They", "D. We"], correctAnswer: "B" },
      { question: "What is a relative pronoun?", options: ["A. I", "B. Who/which/that", "C. He", "D. She"], correctAnswer: "B" },
      { question: "What is plagiarism?", options: ["A. Original work", "B. Copying without credit", "C. Quoting", "D. Summarizing"], correctAnswer: "B" },
    ],
  },
};

function generateQuestion(subject: string, difficulty: string): {
  id: string;
  question: string;
  options: string[];
  correctAnswer: string;
} {
  const subjectBank = QUESTION_BANK[subject] || QUESTION_BANK['Math'];
  const difficultyBank = subjectBank[difficulty] || subjectBank['medium'] || subjectBank['easy'] || [];
  
  if (difficultyBank.length === 0) {
    return {
      id: `q_${Date.now()}`,
      question: "What is 2 + 2?",
      options: ["A. 3", "B. 4", "C. 5", "D. 6"],
      correctAnswer: "B"
    };
  }
  
  // Pick a random question
  const randomIndex = Math.floor(Math.random() * difficultyBank.length);
  const selected = difficultyBank[randomIndex];
  
  return {
    id: `q_${Date.now()}_${randomIndex}`,
    ...selected
  };
}
