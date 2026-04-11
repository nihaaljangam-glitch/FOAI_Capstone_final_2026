import { useState } from 'react';
import { X, AlertTriangle } from 'lucide-react';
import clsx from 'clsx';
import {
  HALLUCINATION_TYPE_LABELS,
  HALLUCINATION_TYPE_COLORS,
  VALIDATION_METHOD_LABELS,
} from '../types';

function makeId() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

const TYPES = Object.keys(HALLUCINATION_TYPE_LABELS);
const METHODS = Object.keys(VALIDATION_METHOD_LABELS);

export default function HallucinationModal({ pending, onSave, onClose }) {
  const [type, setType] = useState('factual_error');
  const [methods, setMethods] = useState(['web_search']);
  const [notes, setNotes] = useState('');

  const toggleMethod = (m) => {
    setMethods((prev) =>
      prev.includes(m) ? prev.filter((x) => x !== m) : [...prev, m]
    );
  };

  const handleSave = () => {
    if (methods.length === 0) return;
    const tag = {
      id: makeId(),
      modelId: pending.modelId,
      selectedText: pending.selectedText,
      startIndex: pending.startIndex,
      endIndex: pending.endIndex,
      type,
      validationMethods: methods,
      notes: notes.trim(),
      createdAt: new Date().toISOString(),
    };
    onSave(tag);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative z-10 w-full max-w-lg bg-white dark:bg-gray-900 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2">
            <AlertTriangle size={18} className="text-red-500" />
            <h2 className="text-sm font-semibold text-gray-900 dark:text-white">
              Tag Hallucination
            </h2>
            <span className="text-xs text-gray-400">— {pending.modelName}</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <X size={16} />
          </button>
        </div>

        <div className="px-5 py-4 space-y-4">
          {/* Selected text preview */}
          <div>
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5 uppercase tracking-wider">
              Flagged Text
            </p>
            <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-lg px-3 py-2">
              <p className="text-sm text-red-800 dark:text-red-300 italic leading-relaxed">
                "{pending.selectedText}"
              </p>
            </div>
          </div>

          {/* Hallucination type */}
          <div>
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-wider">
              Hallucination Type
            </p>
            <div className="grid grid-cols-2 gap-1.5">
              {TYPES.map((t) => (
                <button
                  key={t}
                  onClick={() => setType(t)}
                  className={clsx(
                    'px-3 py-2 rounded-lg text-xs font-medium text-left transition-all border',
                    type === t
                      ? clsx(HALLUCINATION_TYPE_COLORS[t], 'border-current')
                      : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-600'
                  )}
                >
                  {HALLUCINATION_TYPE_LABELS[t]}
                </button>
              ))}
            </div>
          </div>

          {/* Validation methods */}
          <div>
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-wider">
              Validation Methods Used
            </p>
            <div className="grid grid-cols-2 gap-1.5">
              {METHODS.map((m) => (
                <button
                  key={m}
                  onClick={() => toggleMethod(m)}
                  className={clsx(
                    'px-3 py-2 rounded-lg text-xs font-medium text-left transition-all border',
                    methods.includes(m)
                      ? 'bg-indigo-50 dark:bg-indigo-950/40 border-indigo-400 dark:border-indigo-500 text-indigo-700 dark:text-indigo-300'
                      : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-600'
                  )}
                >
                  {VALIDATION_METHOD_LABELS[m]}
                </button>
              ))}
            </div>
            {methods.length === 0 && (
              <p className="text-xs text-red-500 mt-1">Select at least one validation method.</p>
            )}
          </div>

          {/* Notes */}
          <div>
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5 uppercase tracking-wider">
              Notes (optional)
            </p>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Describe why this is a hallucination, what the correct information is, etc."
              rows={3}
              className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm text-gray-800 dark:text-gray-200 placeholder-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-4 border-t border-gray-200 dark:border-gray-700 flex items-center justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={methods.length === 0}
            className="px-4 py-2 text-sm font-medium rounded-lg bg-red-600 hover:bg-red-700 text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Save Tag
          </button>
        </div>
      </div>
    </div>
  );
}
