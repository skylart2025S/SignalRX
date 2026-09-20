import assert from 'node:assert/strict';
import test from 'node:test';
import { analyzeLocally, asksAboutCosts } from '../src/lib/question-context';
import { generateSyntheticResponses } from '../src/lib/synthesis';
import { summarizeLocally } from '../src/lib/ai';
import { findRelevantHCPs, type HCP } from '../src/lib/peer-matching';

const cases = [
  ['How are cardiologists helping patients track heart failure symptoms between follow-up visits?', 'Cardiology', /symptom/i],
  ['How are oncologists discussing fatigue and its effect on daily life with patients receiving chemotherapy?', 'Oncology', /fatigue/i],
  ['How are dermatologists helping patients track eczema flare-ups and understand their skin-care routines?', 'Dermatology', /flare/i],
  ['What are endocrinologists hearing about diabetes medication adherence?', 'Endocrinology', /routine|adherence/i],
  ['What are neurologists hearing about migraine symptoms?', 'Neurology', /symptom/i],
] as const;

for (const [question, specialty, relevant] of cases) {
  test(`offline ${specialty} responses stay relevant and cite real sources`, () => {
    const analysis = analyzeLocally(question);
    assert.equal(analysis.specialty, specialty);
    const hcps: HCP[] = Array.from({length:4}, (_, i) => ({ id:`hcp_${i}`, name:`Demo ${i}`, specialty, practiceType:'Community practice', location:'Demo', yearsExperience:10, expertise:[], bio:'' }));
    const responses = generateSyntheticResponses(hcps, question, analysis);
    assert.equal(responses.length, hcps.length);
    for (const response of responses) {
      assert.match(response.response, relevant);
      assert.equal(asksAboutCosts(response.response), false);
      assert.doesNotMatch(response.response, /Therapy [A-Z]|Drug [A-Z]|Compound [A-Z]/);
    }
    const summary = summarizeLocally(question, [analysis], responses);
    assert.equal(asksAboutCosts(JSON.stringify(summary)), false);
    assert.match(summary.overallSummary, relevant);
    assert.equal(summary.respondentCount, 4);
    for (const theme of summary.commonThemes) {
      assert.equal(theme.count, new Set(responses.filter(r => theme.sourceResponseIds.includes(r.id)).map(r => r.hcpId)).size);
      assert.ok(theme.sourceResponseIds.every(id => responses.some(r => r.id === id)));
    }
    assert.equal(summary.notableDisagreement, undefined);
    assert.equal(summary.suggestedCourseOfAction, undefined);
  });
}

test('coverage questions still get coverage-specific responses', () => {
  const question = 'How are cardiologists handling insurance coverage for Therapy X?';
  const hcp: HCP = { id:'demo', name:'Demo', specialty:'Cardiology', practiceType:'Community', location:'Demo', yearsExperience:10, expertise:[], bio:'' };
  const responses = generateSyntheticResponses([hcp], question, analyzeLocally(question));
  assert.match(responses[0].response, /coverage barrier/);
});

test('unknown questions do not default to cardiology or patient access', () => {
  const analysis = analyzeLocally('How are peers organizing their care team meetings?');
  assert.equal(analysis.specialty, 'General practice');
  assert.equal(analysis.topic, 'Health and care experiences');
  const summary = summarizeLocally('Question', [analysis], []);
  assert.equal(summary.respondentCount, 0);
  assert.deepEqual(summary.commonThemes, []);
});

test('offline matching recognizes clinician names and filters specialty', async () => {
  const key = process.env.OPENAI_API_KEY;
  delete process.env.OPENAI_API_KEY;
  try {
    for (const [question, specialty] of cases) {
      const matches = await findRelevantHCPs(question, 10);
      assert.ok(matches.length > 0);
      assert.ok(matches.every(match => match.hcp.specialty === specialty));
    }
  } finally {
    if (key !== undefined) process.env.OPENAI_API_KEY = key;
  }
});
