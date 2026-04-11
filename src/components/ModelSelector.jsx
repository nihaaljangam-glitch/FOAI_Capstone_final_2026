import { Check } from 'lucide-react';
import clsx from 'clsx';
import { AVAILABLE_MODELS } from '../data/models';

function ProviderBadge({ model }) {
  return (
    <span className={clsx('text-xs font-medium px-1.5 py-0.5 rounded', model.bgColor, model.color)}>
      {model.provider}
    </span>
  );
}

export default function ModelSelector({ selectedIds, onChange, disabled }) {
  const toggle = (id) => {
    if (selectedIds.includes(id)) {
      if (selectedIds.length === 1) return; // keep at least 1
      onChange(selectedIds.filter((m) => m !== id));
    } else {
      onChange([...selectedIds, id]);
    }
  };

  // Group by provider
  const providers = Array.from(new Set(AVAILABLE_MODELS.map((m) => m.provider)));

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Select Models ({selectedIds.length} selected)
        </p>
        <p className="text-xs text-gray-400">Select 2 or more to compare</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
        {providers.map((provider) => (
          <div key={provider}>
            <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-1.5 px-1">
              {provider}
            </p>
            <div className="space-y-1">
              {AVAILABLE_MODELS.filter((m) => m.provider === provider).map((model) => {
                const isSelected = selectedIds.includes(model.id);
                return (
                  <button
                    key={model.id}
                    onClick={() => toggle(model.id)}
                    disabled={disabled}
                    className={clsx(
                      'w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg border text-left transition-all',
                      'disabled:opacity-50 disabled:cursor-not-allowed',
                      isSelected
                        ? clsx('border-indigo-400 dark:border-indigo-500 bg-indigo-50 dark:bg-indigo-950/40')
                        : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-600'
                    )}
                  >
                    <div
                      className={clsx(
                        'w-4 h-4 rounded flex-shrink-0 flex items-center justify-center border transition-colors',
                        isSelected
                          ? 'bg-indigo-600 border-indigo-600'
                          : 'border-gray-300 dark:border-gray-600'
                      )}
                    >
                      {isSelected && <Check size={10} className="text-white" strokeWidth={3} />}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-semibold text-gray-800 dark:text-gray-200 truncate">
                          {model.name}
                        </span>
                      </div>
                      <p className="text-xs text-gray-400 dark:text-gray-500 truncate mt-0.5">
                        {model.description}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
      {selectedIds.length < 2 && (
        <p className="text-xs text-amber-600 dark:text-amber-400">
          ⚠ Please select at least 2 models to compare.
        </p>
      )}
    </div>
  );
}
