const fs = require('fs');

// Helper to generate random integer
const randInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

// Specialties
const specialties = ['Cardiology', 'Oncology', 'Dermatology', 'Endocrinology', 'Neurology'];
// Practice types
const practiceTypes = ['Academic', 'Community', 'Private practice', 'Hospital system'];
// Locations
const locations = ['California', 'Texas', 'New York', 'Florida', 'Illinois', 'Pennsylvania', 'Ohio', 'Georgia', 'North Carolina', 'Michigan'];
// Expertise arrays per specialty
const expertiseMap = {
  Cardiology: ['heart failure', 'patient access', 'prior authorization', 'Therapy X', 'hypertension', 'arrhythmia'],
  Oncology: ['chemotherapy', 'immunotherapy', 'patient adherence', 'Therapy X', 'side effect management'],
  Dermatology: ['biologics', 'topical treatments', 'patient adherence', 'Therapy X', 'psoriasis'],
  Endocrinology: ['diabetes', 'insulin therapy', 'patient adherence', 'Therapy X', 'thyroid'],
  Neurology: ['stroke prevention', 'medication adherence', 'Therapy X', 'migraine', 'epilepsy']
};

// Generate HCPs
const hcpCount = 50;
const hcps = [];

for (let i = 1; i <= hcpCount; i++) {
  const specialtyIdx = randInt(0, specialties.length - 1);
  const specialty = specialties[specialtyIdx];
  const practiceTypeIdx = randInt(0, practiceTypes.length - 1);
  const practiceType = practiceTypes[practiceTypeIdx];
  const locationIdx = randInt(0, locations.length - 1);
  const location = locations[locationIdx];
  const yearsExperience = randInt(2, 30);
  // Pick 3-5 random expertise from the specialty's list
  const expertiseList = expertiseMap[specialty];
  const expertiseCount = randInt(3, expertiseList.length);
  const expertise = [];
  for (let j = 0; j < expertiseCount; j++) {
    const idx = randInt(0, expertiseList.length - 1);
    if (!expertise.includes(expertiseList[idx])) {
      expertise.push(expertiseList[idx]);
    }
  }
  // Ensure Therapy X is in expertise for some HCPs (about 40%)
  if (Math.random() < 0.4 && !expertise.includes('Therapy X')) {
    expertise[randInt(0, expertise.length - 1)] = 'Therapy X';
  }
  const name = `Dr. ${['Sarah', 'Michael', 'Jennifer', 'David', 'Emily', 'Robert', 'Lisa', 'William', 'Mary', 'James'][randInt(0, 9)]} ${['Patel', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez'][randInt(0, 9)]}`;
  const bio = `${specialty} specialist with ${yearsExperience} years of experience in ${practiceType.toLowerCase()} setting.`;

  hcps.push({
    id: `hcp_${i.toString().padStart(3, '0')}`,
    name,
    specialty,
    practiceType,
    location,
    yearsExperience,
    expertise,
    bio
  });
}

// Write HCPs to file
fs.writeFileSync('./data/hcps.json', JSON.stringify(hcps, null, 2));
console.log(`Generated ${hcps.length} HCPs`);

// Now generate peer responses for the demo question
// We'll create 8 responses for the question: "How are other cardiologists handling patients who are struggling to get Therapy X covered?"
// We'll associate each response with an HCP that has Cardiology specialty and expertise in Therapy X or related.

const questionId = 'demo_question_1';
const responses = [];

// Filter HCPs that are cardiologists and have some relevant expertise
const cardiologists = hcps.filter(h => h.specialty === 'Cardiology' && (h.expertise.includes('Therapy X') || h.expertise.includes('patient access') || h.expertise.includes('prior authorization')));
// We'll pick up to 8 from these, or if not enough, we'll use any cardiologist.
let selectedHCPs = cardiologists.slice(0, 8);
if (selectedHCPs.length < 8) {
  // fill with any cardiologists
  const allCardios = hcps.filter(h => h.specialty === 'Cardiology');
  selectedHCPs = allCardios.slice(0, 8);
}

// Response templates with variations
const responseTemplates = [
  "At our practice, we've found that submitting additional clinical documentation helps with prior authorization for Therapy X about 60% of the time.",
  "We rely heavily on our practice's access team to navigate insurance barriers; they've successfully appealed denials for Therapy X in many cases.",
  "I've switched to prescribing alternative therapies that are easier to get covered when patients struggle with Therapy X coverage.",
  "In my experience, patient assistance programs from the manufacturer have been crucial for patients who can't afford Therapy X despite insurance approval.",
  "We've implemented a standardized workflow for prior authorization that reduces turnaround time from weeks to days.",
  "I tell patients to expect delays and set up bridging therapy while we work on the prior authorization for Therapy X.",
  "Our hospital system has a dedicated specialty pharmacy that handles all Therapy X paperwork, which has improved access significantly.",
  "I've found that peer-to-peer calls with insurance medical directors often overturn denials for Therapy X.",
  "Unfortunately, in my community practice, we often cannot secure coverage for Therapy X due to restrictive formularies, so we use alternatives.",
  "We've had success by involving the patient's employer when the insurance is self-funded, as they can pressure the plan to cover Therapy X."
];

selectedHCPs.forEach((hcp, index) => {
  const template = responseTemplates[index] || responseTemplates[0];
  // Slightly vary the response
  const response = template.replace(/Therapy X/g, 'Therapy X'); // just to ensure
  // Topics: extract from expertise or use common ones
  const topics = ['patient access', 'prior authorization', 'Therapy X'];
  // Add some random topics from expertise
  hcp.expertise.forEach(exp => {
    if (!topics.includes(exp) && topics.length < 5) {
      topics.push(exp);
    }
  });
  responses.push({
    id: `resp_${index + 1}`,
    questionId,
    hcpId: hcp.id,
    response,
    topics: topics.slice(0, 4) // limit to 4
  });
});

// Write responses to file
fs.writeFileSync('./data/responses.json', JSON.stringify(responses, null, 2));
console.log(`Generated ${responses.length} peer responses`);
