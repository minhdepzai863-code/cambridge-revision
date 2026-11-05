// Numbered headings from the official Cambridge syllabuses linked in domain.mjs.
// 9231: 2026–2027; 9700 and 9701: 2025–2027. Existing topic IDs are unchanged.
const further={
  "1": [
    "Roots of polynomial equations",
    "Rational functions and graphs",
    "Summation of series",
    "Matrices",
    "Polar coordinates",
    "Vectors",
    "Proof by induction"
  ],
  "2": [
    "Hyperbolic functions",
    "Matrices",
    "Differentiation",
    "Integration",
    "Complex numbers",
    "Differential equations"
  ],
  "3": [
    "Motion of a projectile",
    "Equilibrium of a rigid body",
    "Circular motion",
    "Hooke’s law",
    "Linear motion under a variable force",
    "Momentum"
  ],
  "4": [
    "Continuous random variables",
    "Inference using normal and t-distributions",
    "Chi-squared tests",
    "Non-parametric tests",
    "Probability generating functions"
  ]
};
const chemistry={
  "1": [
    "Particles in the atom and atomic radius",
    "Isotopes",
    "Electrons, energy levels and atomic orbitals",
    "Ionisation energy"
  ],
  "2": [
    "Relative masses of atoms and molecules",
    "The mole and the Avogadro constant",
    "Formulas",
    "Reacting masses and volumes (of solutions and gases)"
  ],
  "3": [
    "Electronegativity and bonding",
    "Ionic bonding",
    "Metallic bonding",
    "Covalent bonding and coordinate (dative covalent) bonding",
    "Shapes of molecules",
    "Intermolecular forces, electronegativity and bond properties",
    "Dot-and-cross diagrams"
  ],
  "4": [
    "The gaseous state: ideal and real gases and pV = nRT",
    "Bonding and structure"
  ],
  "5": [
    "Enthalpy change, Δ H",
    "Hess’s law"
  ],
  "6": [
    "Redox processes: electron transfer and changes in oxidation number (oxidation state)"
  ],
  "7": [
    "Chemical equilibria: reversible reactions, dynamic equilibrium",
    "Brønsted–Lowry theory of acids and bases"
  ],
  "8": [
    "Rate of reaction",
    "Effect of temperature on reaction rates and the concept of activation energy",
    "Homogeneous and heterogeneous catalysts"
  ],
  "9": [
    "Periodicity of physical properties of the elements in Period 3",
    "Periodicity of chemical properties of the elements in Period 3",
    "Chemical periodicity of other elements"
  ],
  "10": [
    "Similarities and trends in the properties of the Group 2 metals, magnesium to barium, and their compounds"
  ],
  "11": [
    "Physical properties of the Group 17 elements",
    "The chemical properties of the halogen elements and the hydrogen halides",
    "Some reactions of the halide ions",
    "The reactions of chlorine"
  ],
  "12": [
    "Nitrogen and sulfur"
  ],
  "13": [
    "Formulas, functional groups and the naming of organic compounds",
    "Characteristic organic reactions",
    "Shapes of organic molecules; σ and π bonds",
    "Isomerism: structural isomerism and stereoisomerism"
  ],
  "14": [
    "Alkanes",
    "Alkenes"
  ],
  "15": [
    "Halogenoalkanes"
  ],
  "16": [
    "Alcohols"
  ],
  "17": [
    "Aldehydes and ketones"
  ],
  "18": [
    "Carboxylic acids",
    "Esters"
  ],
  "19": [
    "Primary amines",
    "Nitriles and hydroxynitriles"
  ],
  "20": [
    "Addition polymerisation"
  ],
  "21": [
    "Organic synthesis"
  ],
  "22": [
    "Infrared spectroscopy",
    "Mass spectrometry"
  ],
  "23": [
    "Lattice energy and Born-Haber cycles",
    "Enthalpies of solution and hydration",
    "Entropy change, Δ S",
    "Gibbs free energy change, Δ G"
  ],
  "24": [
    "Electrolysis",
    "Standard electrode potentials, standard cell potentials and the Nernst equation"
  ],
  "25": [
    "Acids and bases",
    "Partition coefficients"
  ],
  "26": [
    "Simple rate equations, orders of reaction and rate constants",
    "Homogeneous and heterogeneous catalysts"
  ],
  "27": [
    "Similarities and trends in the properties of the Group 2 metals, magnesium to barium, and their compounds"
  ],
  "28": [
    "General physical and chemical properties of the first row of transition elements, titanium to copper",
    "General characteristic chemical properties of the first set of transition elements, titanium to copper",
    "Colour of complexes",
    "Stereoisomerism in transition element complexes",
    "Stability constants, Kstab"
  ],
  "29": [
    "Formulas, functional groups and the naming of organic compounds",
    "Characteristic organic reactions",
    "Shapes of aromatic organic molecules; σ and π bonds",
    "Isomerism: optical"
  ],
  "30": [
    "Arenes"
  ],
  "31": [
    "Halogen compounds"
  ],
  "32": [
    "Alcohols",
    "Phenol"
  ],
  "33": [
    "Carboxylic acids",
    "Esters",
    "Acyl chlorides"
  ],
  "34": [
    "Primary and secondary amines",
    "Phenylamine and azo compounds",
    "Amides",
    "Amino acids"
  ],
  "35": [
    "Condensation polymerisation",
    "Predicting the type of polymerisation",
    "Degradable polymers"
  ],
  "36": [
    "Organic synthesis"
  ],
  "37": [
    "Thin-layer chromatography",
    "Gas / liquid chromatography",
    "Carbon-13 NMR spectroscopy",
    "Proton (¹H) NMR spectroscopy"
  ]
};
const biology={
  "1": [
    "The microscope in cell studies",
    "Cells as the basic units of living organisms"
  ],
  "2": [
    "Testing for biological molecules",
    "Carbohydrates and lipids",
    "Proteins",
    "Water"
  ],
  "3": [
    "Mode of action of enzymes",
    "Factors that affect enzyme action"
  ],
  "4": [
    "Fluid mosaic membranes",
    "Movement into and out of cells"
  ],
  "5": [
    "Replication and division of nuclei and cells",
    "Chromosome behaviour in mitosis"
  ],
  "6": [
    "Structure of nucleic acids and replication of DNA",
    "Protein synthesis"
  ],
  "7": [
    "Structure of transport tissues",
    "Transport mechanisms"
  ],
  "8": [
    "The circulatory system",
    "Transport of oxygen and carbon dioxide",
    "The heart"
  ],
  "9": [
    "The gas exchange system"
  ],
  "10": [
    "Infectious diseases",
    "Antibiotics"
  ],
  "11": [
    "The immune system",
    "Antibodies and vaccination"
  ],
  "12": [
    "Energy",
    "Respiration"
  ],
  "13": [
    "Photosynthesis as an energy transfer process",
    "Investigation of limiting factors"
  ],
  "14": [
    "Homeostasis in mammals",
    "Homeostasis in plants"
  ],
  "15": [
    "Control and coordination in mammals",
    "Control and coordination in plants"
  ],
  "16": [
    "Passage of information from parents to offspring",
    "The roles of genes in determining the phenotype",
    "Gene control"
  ],
  "17": [
    "Variation",
    "Natural and artificial selection",
    "Evolution"
  ],
  "18": [
    "Classification",
    "Biodiversity",
    "Conservation"
  ],
  "19": [
    "Principles of genetic technology",
    "Genetic technology applied to medicine",
    "Genetically modified organisms in agriculture"
  ]
};
export function addStemTopics(group){
 Object.entries(further).forEach(([p,items])=>group('9231',+p,p==='2'?'A2':p==='1'?'AS':'AS/A2',p,items));
 for(const [subject,topics,asLimit] of [['9701',chemistry,22],['9700',biology,11]]){
  Object.entries(topics).forEach(([p,items])=>group(subject,+p<=asLimit?2:4,+p<=asLimit?'AS':'A2',p,items));
  group(subject,3,'AS','P3',['Manipulation, measurement and observation','Presentation of data and observations','Analysis, conclusions and evaluation']);
  group(subject,5,'A2','P5',['Planning','Analysis, conclusions and evaluation']);
  group(subject,3,'AS','P3.1',subject==='9701'?['Successful collection of data and observations','Quality of measurements or observations','Decisions relating to measurements or observations']:['Decisions relating to measurements and observations','Collection of data and observations']);
  group(subject,3,'AS','P3.2',['Recording data and observations','Display of calculation and reasoning',subject==='9701'?'Data layout':'Layout of data and observations']);
  group(subject,3,'AS','P3.3',[subject==='9701'?'Interpretation of data or observations':'Interpreting data and observations','Drawing conclusions','Identifying sources of error and suggesting improvements']);
  group(subject,5,'A2','P5.1',['Defining the problem',subject==='9701'?'Method':'Methods']);
  group(subject,5,'A2','P5.2',['Dealing with data',subject==='9701'?'Conclusion':'Conclusions','Evaluation']);
 }
}
