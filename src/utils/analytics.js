const TYPE_LABELS = {
  factual_error: 'Factual Error',
  date_number_error: 'Date/Number',
  citation_fabrication: 'Citation',
  entity_confusion: 'Entity Confusion',
  logical_inconsistency: 'Logic Error',
  other: 'Other',
};

const TYPE_FILLS = {
  factual_error: '#ef4444',
  date_number_error: '#3b82f6',
  citation_fabrication: '#f97316',
  entity_confusion: '#eab308',
  logical_inconsistency: '#a855f7',
  other: '#6b7280',
};

const METHOD_LABELS = {
  web_search: 'Web Search',
  cross_reference: 'Cross-Reference',
  expert_review: 'Expert Review',
  source_verification: 'Source Verify',
  manual_fact_check: 'Fact-Check',
};

export function computeAnalytics(sessions) {
  // Model stats
  const modelMap = new Map();
  for (const session of sessions) {
    for (const answer of session.answers) {
      if (!answer.error) {
        if (!modelMap.has(answer.modelId)) {
          modelMap.set(answer.modelId, { name: answer.modelName, answers: 0, hallucinations: 0 });
        }
        const stat = modelMap.get(answer.modelId);
        stat.answers++;
        stat.hallucinations += session.hallucinations.filter(
          (h) => h.modelId === answer.modelId
        ).length;
      }
    }
  }

  const byModel = Array.from(modelMap.entries()).map(([id, stat]) => ({
    modelId: id,
    modelName: stat.name,
    totalAnswers: stat.answers,
    hallucinationsFound: stat.hallucinations,
    hallucinationRate: stat.answers > 0 ? (stat.hallucinations / stat.answers) * 100 : 0,
  }));

  const totalHallucinations = sessions.reduce((s, sess) => s + sess.hallucinations.length, 0);
  const totalAnswers = byModel.reduce((s, m) => s + m.totalAnswers, 0);

  // By type
  const typeCount = new Map();
  for (const session of sessions) {
    for (const h of session.hallucinations) {
      typeCount.set(h.type, (typeCount.get(h.type) || 0) + 1);
    }
  }
  const byType = Object.keys(TYPE_LABELS)
    .map((type) => ({
      type,
      count: typeCount.get(type) || 0,
      label: TYPE_LABELS[type],
      fill: TYPE_FILLS[type],
    }))
    .filter((t) => t.count > 0);

  // By validation method
  const methodCount = new Map();
  for (const session of sessions) {
    for (const h of session.hallucinations) {
      for (const method of h.validationMethods) {
        methodCount.set(method, (methodCount.get(method) || 0) + 1);
      }
    }
  }
  const byValidationMethod = Object.keys(METHOD_LABELS)
    .map((method) => ({
      method,
      count: methodCount.get(method) || 0,
      label: METHOD_LABELS[method],
    }))
    .filter((m) => m.count > 0);

  // Trends — group sessions by date
  const trendMap = new Map();
  const sortedSessions = [...sessions].sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  );
  for (const session of sortedSessions) {
    const date = new Date(session.createdAt).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
    if (!trendMap.has(date)) trendMap.set(date, { hallucinations: 0, sessions: 0 });
    const t = trendMap.get(date);
    t.sessions++;
    t.hallucinations += session.hallucinations.length;
  }
  const sessionTrends = Array.from(trendMap.entries())
    .map(([date, data]) => ({ date, ...data }))
    .slice(-14);

  const modelsWithAnswers = byModel.filter((m) => m.totalAnswers > 0);
  const sortedByRate = [...modelsWithAnswers].sort(
    (a, b) => b.hallucinationRate - a.hallucinationRate
  );

  return {
    totalSessions: sessions.length,
    totalHallucinations,
    overallHallucinationRate: totalAnswers > 0 ? (totalHallucinations / totalAnswers) * 100 : 0,
    byModel,
    byType,
    byValidationMethod,
    sessionTrends,
    mostHallucinatingModel: sortedByRate[0] || null,
    mostReliableModel: sortedByRate[sortedByRate.length - 1] || null,
  };
}
