function makeId() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

function makeTag(
  answer,
  modelId,
  text,
  type,
  methods,
  notes,
  daysAgo
) {
  const startIndex = answer.indexOf(text);
  return {
    id: makeId(),
    modelId,
    selectedText: text,
    startIndex: startIndex === -1 ? 0 : startIndex,
    endIndex: startIndex === -1 ? text.length : startIndex + text.length,
    type,
    validationMethods: methods,
    notes,
    createdAt: new Date(Date.now() - 86400000 * daysAgo).toISOString(),
  };
}

const answer1_gpt = `The capital city of Australia is Canberra. As of 2024, Canberra has a population of approximately 460,000 people, making it the eighth-largest city in Australia. It became the capital in 1913 as a compromise between Sydney and Melbourne, both of which wanted to be the capital. The city was designed by American architects Walter Burley Griffin and Marion Mahony Griffin, who won an international design competition in 1912.`;

const answer1_claude = `Australia's capital is Sydney, which serves as the political and administrative center of the country. Sydney has a population of approximately 5.3 million people in its greater metropolitan area, making it the largest city in Australia. The city houses the Parliament of Australia and most federal government departments. Canberra is sometimes mistakenly cited as the capital by foreigners.`;

const answer1_gemini = `The capital of Australia is Canberra — not Sydney, as many people mistakenly believe. Canberra was purpose-built as the capital, with construction beginning around 1913 as a compromise between the rival cities of Sydney and Melbourne. The population of Canberra is approximately 453,000, making it substantially smaller than Sydney (5.3M) or Melbourne (5.1M).`;

const answer2_gpt = `The telephone was invented by Alexander Graham Bell, who received US Patent 174,465 on March 7, 1876. Bell filed his patent application just hours before Elisha Gray submitted a similar caveat. However, Italian inventor Antonio Meucci had developed voice-over-wire technology earlier and filed a patent caveat in 1871. The US Congress passed a resolution in 2002 recognizing Meucci's contributions to the telephone's invention.`;

const answer2_claude = `Alexander Graham Bell invented the telephone and is credited with the first patent, filed on February 14, 1876 and granted on March 7, 1876 (US Patent 174,465). Bell famously spoke the first words over the telephone to his assistant Thomas Watson: "Mr. Watson, come here — I want to see you." Bell later founded the Bell Telephone Company in 1875, which eventually became AT&T. His competitor Elisha Gray filed a similar caveat on the same day.`;

export const DEMO_SESSIONS = [
  {
    id: 'demo-session-1',
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    question: 'What is the capital city of Australia and what is its population?',
    selectedModels: [
      'openai/gpt-4o-mini',
      'anthropic/claude-3-haiku',
      'google/gemini-2.5-flash',
    ],
    answers: [
      {
        modelId: 'openai/gpt-4o-mini',
        modelName: 'GPT-4o Mini',
        answer: answer1_gpt,
        latencyMs: 843,
        tokens: 94,
      },
      {
        modelId: 'anthropic/claude-3-haiku',
        modelName: 'Claude 3 Haiku',
        answer: answer1_claude,
        latencyMs: 917,
        tokens: 88,
      },
      {
        modelId: 'google/gemini-2.5-flash',
        modelName: 'Gemini 2.5 Flash',
        answer: answer1_gemini,
        latencyMs: 724,
        tokens: 81,
      },
    ],
    hallucinations: [
      makeTag(
        answer1_claude,
        'anthropic/claude-3-haiku',
        "Australia's capital is Sydney",
        'factual_error',
        ['web_search', 'manual_fact_check'],
        "Completely wrong — Australia's capital is Canberra, not Sydney.",
        2
      ),
      makeTag(
        answer1_claude,
        'anthropic/claude-3-haiku',
        'serves as the political and administrative center of the country',
        'factual_error',
        ['web_search'],
        'Sydney is NOT the political/administrative center. Canberra is.',
        2
      ),
      makeTag(
        answer1_claude,
        'anthropic/claude-3-haiku',
        'The city houses the Parliament of Australia',
        'factual_error',
        ['web_search', 'cross_reference'],
        "Parliament House is in Canberra, not Sydney.",
        2
      ),
    ],
    status: 'validated',
  },
  {
    id: 'demo-session-2',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 86400000).toISOString(),
    question: 'Who invented the telephone and when was it patented?',
    selectedModels: ['openai/gpt-4o-mini', 'anthropic/claude-3-haiku'],
    answers: [
      {
        modelId: 'openai/gpt-4o-mini',
        modelName: 'GPT-4o Mini',
        answer: answer2_gpt,
        latencyMs: 921,
        tokens: 102,
      },
      {
        modelId: 'anthropic/claude-3-haiku',
        modelName: 'Claude 3 Haiku',
        answer: answer2_claude,
        latencyMs: 876,
        tokens: 96,
      },
    ],
    hallucinations: [
      makeTag(
        answer2_claude,
        'anthropic/claude-3-haiku',
        'Bell Telephone Company in 1875',
        'date_number_error',
        ['web_search', 'source_verification'],
        'The Bell Telephone Company was founded in 1877, not 1875. The telephone patent was filed in 1876.',
        1
      ),
    ],
    status: 'validated',
  },
];
