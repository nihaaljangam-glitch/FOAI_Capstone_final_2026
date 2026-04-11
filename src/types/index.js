export const HALLUCINATION_TYPE_LABELS = {
  factual_error: 'Factual Error',
  date_number_error: 'Date / Number Error',
  citation_fabrication: 'Citation Fabrication',
  entity_confusion: 'Entity Confusion',
  logical_inconsistency: 'Logical Inconsistency',
  other: 'Other',
};

export const HALLUCINATION_TYPE_COLORS = {
  factual_error: 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300',
  date_number_error: 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300',
  citation_fabrication: 'bg-orange-100 text-orange-800 dark:bg-orange-900/40 dark:text-orange-300',
  entity_confusion: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300',
  logical_inconsistency: 'bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300',
  other: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
};

export const HALLUCINATION_HIGHLIGHT_COLORS = {
  factual_error: 'bg-red-200 dark:bg-red-800/50',
  date_number_error: 'bg-blue-200 dark:bg-blue-800/50',
  citation_fabrication: 'bg-orange-200 dark:bg-orange-800/50',
  entity_confusion: 'bg-yellow-200 dark:bg-yellow-800/50',
  logical_inconsistency: 'bg-purple-200 dark:bg-purple-800/50',
  other: 'bg-gray-200 dark:bg-gray-600/50',
};

export const VALIDATION_METHOD_LABELS = {
  web_search: '🔍 Web Search',
  cross_reference: '🔄 Cross-Reference Models',
  expert_review: '👩‍🔬 Expert Review',
  source_verification: '📄 Source Verification',
  manual_fact_check: '✅ Manual Fact-Check',
};
