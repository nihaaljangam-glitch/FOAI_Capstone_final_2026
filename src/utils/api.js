export async function queryModel(
  modelId,
  modelName,
  question,
  apiKey
) {
  const startTime = Date.now();
  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': window.location.origin,
        'X-Title': 'Aletheia Lens',
      },
      body: JSON.stringify({
        model: modelId,
        messages: [
          {
            role: 'system',
            content:
              'You are a helpful, knowledgeable assistant. Answer questions accurately and factually. If you are uncertain about something, acknowledge it rather than speculating.',
          },
          { role: 'user', content: question },
        ],
        max_tokens: 1024,
        temperature: 0.7,
      }),
    });

    const latencyMs = Date.now() - startTime;

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      const msg =
        errData.error?.message ||
        `HTTP ${response.status}: ${response.statusText}`;
      throw new Error(msg);
    }

    const data = await response.json();
    const answer = data.choices?.[0]?.message?.content?.trim() || '(No response)';
    const tokens = data.usage?.total_tokens;

    return { modelId, modelName, answer, latencyMs, tokens };
  } catch (error) {
    return {
      modelId,
      modelName,
      answer: '',
      latencyMs: Date.now() - startTime,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}

export async function queryAllModels(
  models,
  question,
  apiKey,
  onProgress
) {
  const results = [];
  await Promise.all(
    models.map(async ({ id, name }) => {
      const answer = await queryModel(id, name, question, apiKey);
      results.push(answer);
      onProgress(answer);
    })
  );
  return results;
}
