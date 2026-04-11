import { useState, useEffect } from 'react';
import {
  Send,
  ChevronDown,
  ChevronUp,
  Save,
  CheckCircle,
  PlayCircle,
  FlaskConical,
  Info,
} from 'lucide-react';
import clsx from 'clsx';
import { AVAILABLE_MODELS, MODEL_MAP, DEFAULT_SELECTED_MODELS } from '../data/models';
import { DEMO_SESSIONS } from '../data/demoData';
import { loadSettings, saveSession } from '../utils/storage';
import { queryAllModels } from '../utils/api';
import ModelSelector from '../components/ModelSelector';
import AnswerCard from '../components/AnswerCard';
import HallucinationModal from '../components/HallucinationModal';

function makeId() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

const EXAMPLE_QUESTIONS = [
  'What is the capital city of Australia and what is its population?',
  'Who invented the telephone and when was it patented?',
  'What year did World War II end and what treaty was signed?',
  'What is the speed of light and who first measured it accurately?',
  'When was the Great Wall of China built and by whom?',
];

export default function PlaygroundPage() {
  const [question, setQuestion] = useState('');
  const [selectedModels, setSelectedModels] = useState(DEFAULT_SELECTED_MODELS);
  const [showModelSelector, setShowModelSelector] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [answers, setAnswers] = useState([]);
  const [hallucinations, setHallucinations] = useState([]);
  const [pendingTag, setPendingTag] = useState(null);
  const [sessionSaved, setSessionSaved] = useState(false);
  const [currentSessionId, setCurrentSessionId] = useState(null);
  const [apiKey, setApiKey] = useState('');
  const [demoMode, setDemoMode] = useState(false);

  useEffect(() => {
    const settings = loadSettings();
    setApiKey(settings.openrouterApiKey);
    if (settings.defaultModels?.length) {
      setSelectedModels(settings.defaultModels);
    }
  }, []);

  const hasAnswers = answers.length > 0;
  const loadingModels = selectedModels.filter(
    (id) => !answers.find((a) => a.modelId === id)
  );

  const handleSubmit = async () => {
    if (!question.trim() || selectedModels.length < 2 || isLoading) return;
    if (!apiKey) {
      alert('Please add your OpenRouter API key in Settings first.');
      return;
    }

    setIsLoading(true);
    setAnswers([]);
    setHallucinations([]);
    setSessionSaved(false);
    setDemoMode(false);
    const newId = makeId();
    setCurrentSessionId(newId);

    const modelsToQuery = selectedModels
      .map((id) => {
        const m = MODEL_MAP.get(id);
        return m ? { id: m.id, name: m.name } : null;
      })
      .filter(Boolean);

    await queryAllModels(modelsToQuery, question.trim(), apiKey, (answer) => {
      setAnswers((prev) => [...prev, answer]);
    });

    setIsLoading(false);
  };

  const handleLoadDemo = (session) => {
    setQuestion(session.question);
    setSelectedModels(session.selectedModels);
    setAnswers(session.answers);
    setHallucinations(session.hallucinations);
    setCurrentSessionId(session.id);
    setSessionSaved(false);
    setDemoMode(true);
    setShowModelSelector(false);
  };

  const handleAddTag = (pending) => {
    setPendingTag(pending);
  };

  const handleSaveTag = (tag) => {
    setHallucinations((prev) => [...prev, tag]);
    setPendingTag(null);
    setSessionSaved(false);
  };

  const handleRemoveTag = (tagId) => {
    setHallucinations((prev) => prev.filter((t) => t.id !== tagId));
    setSessionSaved(false);
  };

  const handleSaveSession = () => {
    if (!hasAnswers || !currentSessionId) return;
    const session = {
      id: currentSessionId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      question: question.trim(),
      selectedModels,
      answers,
      hallucinations,
      status: hallucinations.length > 0 ? 'validated' : 'in_progress',
    };
    saveSession(session);
    setSessionSaved(true);
  };

  const handleMarkValidated = () => {
    if (!hasAnswers || !currentSessionId) return;
    const session = {
      id: currentSessionId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      question: question.trim(),
      selectedModels,
      answers,
      hallucinations,
      status: 'validated',
    };
    saveSession(session);
    setSessionSaved(true);
  };

  const getTagsForModel = (modelId) =>
    hallucinations.filter((h) => h.modelId === modelId);

  // Build placeholder answer objects for models not yet loaded
  const allDisplayAnswers = selectedModels.map((modelId) => {
    const found = answers.find((a) => a.modelId === modelId);
    if (found) return found;
    const model = MODEL_MAP.get(modelId);
    return {
      modelId,
      modelName: model?.name || modelId,
      answer: '',
      latencyMs: 0,
    };
  });

  return (
    <div className="flex flex-col h-full">
      {/* Page header */}
      <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
        <div className="flex items-center gap-2 mb-1">
          <FlaskConical size={18} className="text-indigo-600" />
          <h1 className="text-lg font-bold text-gray-900 dark:text-white">Playground</h1>
          {demoMode && (
            <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-amber-100 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300">
              Demo Mode
            </span>
          )}
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Submit a question to multiple AI models and tag hallucinations in their answers.
        </p>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="max-w-7xl mx-auto px-6 py-5 space-y-5">

          {/* No API key warning */}
          {!apiKey && (
            <div className="flex items-start gap-3 p-4 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800">
              <Info size={16} className="text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium text-amber-800 dark:text-amber-300">
                  No API key configured
                </p>
                <p className="text-xs text-amber-700 dark:text-amber-400 mt-0.5">
                  Add your{' '}
                  <a
                    href="https://openrouter.ai/keys"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline hover:no-underline"
                  >
                    OpenRouter API key
                  </a>{' '}
                  in Settings to query real models. In the meantime, explore the demo sessions below.
                </p>
              </div>
            </div>
          )}

          {/* Question input */}
          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-4 space-y-3">
            <div className="relative">
              <textarea
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) handleSubmit();
                }}
                placeholder="Ask a question to compare how different AI models respond…"
                rows={3}
                className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm text-gray-800 dark:text-gray-200 placeholder-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
              <p className="text-xs text-gray-400 mt-1">
                Press{' '}
                <kbd className="px-1 py-0.5 bg-gray-100 dark:bg-gray-700 rounded text-gray-500 font-mono text-xs">
                  ⌘ Enter
                </kbd>{' '}
                to submit
              </p>
            </div>

            {/* Example questions */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs text-gray-400">Try:</span>
              {EXAMPLE_QUESTIONS.slice(0, 3).map((q) => (
                <button
                  key={q}
                  onClick={() => setQuestion(q)}
                  className="text-xs px-2.5 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors border border-gray-200 dark:border-gray-700"
                >
                  {q.length > 50 ? q.slice(0, 50) + '…' : q}
                </button>
              ))}
            </div>

            {/* Model selector toggle + submit */}
            <div className="flex items-center justify-between gap-3 flex-wrap">
              <button
                onClick={() => setShowModelSelector((v) => !v)}
                className="flex items-center gap-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
              >
                {showModelSelector ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                {selectedModels.length} model{selectedModels.length !== 1 ? 's' : ''} selected
              </button>

              <button
                onClick={handleSubmit}
                disabled={isLoading || !question.trim() || selectedModels.length < 2 || !apiKey}
                className={clsx(
                  'flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all',
                  isLoading || !question.trim() || selectedModels.length < 2 || !apiKey
                    ? 'bg-gray-200 dark:bg-gray-700 text-gray-400 cursor-not-allowed'
                    : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm'
                )}
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                    Asking {loadingModels.length} model{loadingModels.length !== 1 ? 's' : ''}…
                  </>
                ) : (
                  <>
                    <Send size={14} />
                    Ask All Models
                  </>
                )}
              </button>
            </div>

            {/* Model selector */}
            {showModelSelector && (
              <div className="pt-2 border-t border-gray-100 dark:border-gray-800">
                <ModelSelector
                  selectedIds={selectedModels}
                  onChange={setSelectedModels}
                  disabled={isLoading}
                />
              </div>
            )}
          </div>

          {/* Demo sessions */}
          {!hasAnswers && !isLoading && (
            <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-4">
              <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                <PlayCircle size={16} className="text-indigo-500" />
                Demo Sessions — Explore hallucination examples
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {DEMO_SESSIONS.map((session) => (
                  <button
                    key={session.id}
                    onClick={() => handleLoadDemo(session)}
                    className="text-left p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-indigo-400 dark:hover:border-indigo-500 hover:bg-indigo-50/50 dark:hover:bg-indigo-950/20 transition-all"
                  >
                    <p className="text-sm font-medium text-gray-800 dark:text-gray-200 line-clamp-2 mb-2">
                      {session.question}
                    </p>
                    <div className="flex items-center gap-2 flex-wrap text-xs text-gray-500">
                      <span>{session.answers.length} models</span>
                      <span>·</span>
                      <span className="text-red-600 dark:text-red-400 font-medium">
                        {session.hallucinations.length} hallucination{session.hallucinations.length !== 1 ? 's' : ''} tagged
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Answer cards */}
          {(hasAnswers || isLoading) && (
            <div className="space-y-4">
              {/* Session actions */}
              <div className="flex items-center justify-between flex-wrap gap-3">
                <div>
                  <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Model Responses
                    {isLoading && (
                      <span className="ml-2 text-xs font-normal text-gray-400">
                        ({answers.length}/{selectedModels.length} completed)
                      </span>
                    )}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {hallucinations.length} hallucination{hallucinations.length !== 1 ? 's' : ''} tagged across all models
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleSaveSession}
                    disabled={!hasAnswers}
                    className={clsx(
                      'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all border',
                      sessionSaved
                        ? 'border-emerald-400 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400'
                        : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-600 disabled:opacity-50'
                    )}
                  >
                    {sessionSaved ? (
                      <>
                        <CheckCircle size={12} />
                        Saved
                      </>
                    ) : (
                      <>
                        <Save size={12} />
                        Save Session
                      </>
                    )}
                  </button>
                  <button
                    onClick={handleMarkValidated}
                    disabled={!hasAnswers}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-indigo-400 dark:hover:border-indigo-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all disabled:opacity-50"
                  >
                    <CheckCircle size={12} />
                    Mark Validated
                  </button>
                </div>
              </div>

              {/* Answer grid */}
              <div
                className={clsx(
                  'grid gap-4',
                  allDisplayAnswers.length === 2 ? 'grid-cols-1 lg:grid-cols-2' :
                  allDisplayAnswers.length === 3 ? 'grid-cols-1 lg:grid-cols-3' :
                  'grid-cols-1 md:grid-cols-2 xl:grid-cols-3'
                )}
              >
                {allDisplayAnswers.map((answer) => {
                  const model = MODEL_MAP.get(answer.modelId);
                  if (!model) return null;
                  return (
                    <AnswerCard
                      key={answer.modelId}
                      answer={answer}
                      model={model}
                      hallucinations={getTagsForModel(answer.modelId)}
                      onAddTag={handleAddTag}
                      onRemoveTag={handleRemoveTag}
                    />
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Hallucination tagging modal */}
      {pendingTag && (
        <HallucinationModal
          pending={pendingTag}
          onSave={handleSaveTag}
          onClose={() => setPendingTag(null)}
        />
      )}
    </div>
  );
}
