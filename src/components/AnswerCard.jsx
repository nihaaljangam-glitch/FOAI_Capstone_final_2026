import { useRef, useState } from 'react';
import { Tag, Trash2, Clock, Hash, AlertCircle, MousePointer } from 'lucide-react';
import clsx from 'clsx';
import {
  HALLUCINATION_TYPE_LABELS,
  HALLUCINATION_TYPE_COLORS,
  HALLUCINATION_HIGHLIGHT_COLORS,
  VALIDATION_METHOD_LABELS,
} from '../types';

function buildSegments(text, tags) {
  if (tags.length === 0) return [{ text }];

  // Sort by startIndex, handle overlaps by ignoring overlapping ones
  const sorted = [...tags].sort((a, b) => a.startIndex - b.startIndex);
  const segments = [];
  let lastIndex = 0;

  for (const tag of sorted) {
    const start = Math.max(tag.startIndex, lastIndex);
    const end = tag.endIndex;
    if (start >= end) continue; // skip zero-length or overlapping

    if (start > lastIndex) {
      segments.push({ text: text.slice(lastIndex, start) });
    }
    segments.push({ text: text.slice(start, end), tag });
    lastIndex = end;
  }

  if (lastIndex < text.length) {
    segments.push({ text: text.slice(lastIndex) });
  }

  return segments;
}

function getSelectionOffsets(
  container
) {
  const sel = window.getSelection();
  if (!sel || sel.isCollapsed || sel.rangeCount === 0) return null;

  const range = sel.getRangeAt(0);
  if (!container.contains(range.commonAncestorContainer)) return null;

  const preRange = range.cloneRange();
  preRange.selectNodeContents(container);
  preRange.setEnd(range.startContainer, range.startOffset);
  const start = preRange.toString().length;
  const selectedText = sel.toString();
  if (!selectedText.trim()) return null;

  return { start, end: start + selectedText.length, text: selectedText };
}

export default function AnswerCard({
  answer,
  model,
  hallucinations,
  onAddTag,
  onRemoveTag,
}) {
  const textRef = useRef(null);
  const [selectionInfo, setSelectionInfo] = useState(null);
  const [tooltipPos, setTooltipPos] = useState(null);

  const handleMouseUp = (e) => {
    if (!textRef.current || answer.error || !answer.answer) return;

    const info = getSelectionOffsets(textRef.current);
    if (info) {
      setSelectionInfo(info);
      setTooltipPos({ x: e.clientX, y: e.clientY });
    } else {
      setSelectionInfo(null);
      setTooltipPos(null);
    }
  };

  const handleMarkHallucination = () => {
    if (!selectionInfo) return;
    onAddTag({
      modelId: answer.modelId,
      modelName: answer.modelName,
      selectedText: selectionInfo.text,
      startIndex: selectionInfo.start,
      endIndex: selectionInfo.end,
    });
    setSelectionInfo(null);
    setTooltipPos(null);
    window.getSelection()?.removeAllRanges();
  };

  const handleContainerClick = (e) => {
    // If clicked outside the tooltip, clear selection
    const target = e.target;
    if (!target.closest('[data-tooltip]')) {
      setSelectionInfo(null);
      setTooltipPos(null);
    }
  };

  const segments = buildSegments(answer.answer || '', hallucinations);

  return (
    <div
      className={clsx(
        'flex flex-col rounded-xl border bg-white dark:bg-gray-900 shadow-sm overflow-hidden',
        model.borderColor
      )}
    >
      {/* Card Header */}
      <div className={clsx('px-4 py-3 border-b flex items-center justify-between', model.bgColor, model.borderColor)}>
        <div className="flex items-center gap-2">
          <span className={clsx('text-xs font-bold uppercase tracking-wide', model.color)}>
            {model.provider}
          </span>
          <span className="text-gray-300 dark:text-gray-600">·</span>
          <span className="text-sm font-semibold text-gray-800 dark:text-gray-200">
            {model.name}
          </span>
          {hallucinations.length > 0 && (
            <span className="ml-1 inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300 text-xs font-medium">
              <AlertCircle size={10} />
              {hallucinations.length} tag{hallucinations.length !== 1 ? 's' : ''}
            </span>
          )}
        </div>
        <div className="flex items-center gap-3 text-xs text-gray-400">
          {answer.latencyMs > 0 && (
            <span className="flex items-center gap-1">
              <Clock size={11} />
              {(answer.latencyMs / 1000).toFixed(2)}s
            </span>
          )}
          {answer.tokens && (
            <span className="flex items-center gap-1">
              <Hash size={11} />
              {answer.tokens}
            </span>
          )}
        </div>
      </div>

      {/* Loading skeleton */}
      {!answer.answer && !answer.error && (
        <div className="p-4 space-y-2 flex-1">
          <div className="skeleton h-4 rounded w-full" />
          <div className="skeleton h-4 rounded w-5/6" />
          <div className="skeleton h-4 rounded w-4/5" />
          <div className="skeleton h-4 rounded w-full" />
          <div className="skeleton h-4 rounded w-3/4" />
          <div className="skeleton h-4 rounded w-full" />
          <div className="skeleton h-4 rounded w-2/3" />
        </div>
      )}

      {/* Error state */}
      {answer.error && (
        <div className="p-4 flex items-start gap-2">
          <AlertCircle size={16} className="text-red-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-red-700 dark:text-red-400">API Error</p>
            <p className="text-xs text-red-600 dark:text-red-500 mt-0.5">{answer.error}</p>
          </div>
        </div>
      )}

      {/* Answer text */}
      {answer.answer && !answer.error && (
        <div className="flex-1 flex flex-col" onClick={handleContainerClick}>
          <div className="p-4 flex-1">
            <div className="flex items-center gap-1.5 mb-2">
              <MousePointer size={12} className="text-gray-300 dark:text-gray-600" />
              <p className="text-xs text-gray-400 dark:text-gray-500">
                Select text to tag a hallucination
              </p>
            </div>
            <div
              ref={textRef}
              onMouseUp={handleMouseUp}
              className="answer-text tagging-active text-sm leading-relaxed text-gray-700 dark:text-gray-300 cursor-text select-text"
              style={{ whiteSpace: 'pre-wrap' }}
            >
              {segments.map((seg, i) =>
                seg.tag ? (
                  <mark
                    key={i}
                    className={clsx(
                      'hallucination-mark',
                      HALLUCINATION_HIGHLIGHT_COLORS[seg.tag.type]
                    )}
                    title={`${HALLUCINATION_TYPE_LABELS[seg.tag.type]}${seg.tag.notes ? ': ' + seg.tag.notes : ''}`}
                  >
                    {seg.text}
                  </mark>
                ) : (
                  <span key={i}>{seg.text}</span>
                )
              )}
            </div>
          </div>

          {/* Floating tag tooltip */}
          {selectionInfo && tooltipPos && (
            <div
              data-tooltip
              className="fixed z-40 flex items-center gap-1.5 px-3 py-1.5 bg-gray-900 dark:bg-gray-700 rounded-lg shadow-lg border border-gray-700 dark:border-gray-600"
              style={{
                left: tooltipPos.x,
                top: tooltipPos.y - 48,
                transform: 'translateX(-50%)',
              }}
            >
              <button
                onMouseDown={(e) => {
                  e.preventDefault();
                  handleMarkHallucination();
                }}
                className="flex items-center gap-1.5 text-xs font-medium text-white hover:text-red-300 transition-colors"
              >
                <Tag size={12} />
                Mark as Hallucination
              </button>
            </div>
          )}

          {/* Tag list */}
          {hallucinations.length > 0 && (
            <div className="border-t border-gray-100 dark:border-gray-800 px-4 py-3 space-y-2">
              <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Hallucination Tags
              </p>
              {hallucinations.map((tag) => (
                <div
                  key={tag.id}
                  className="flex items-start gap-2 p-2 rounded-lg bg-gray-50 dark:bg-gray-800/50"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap mb-1">
                      <span
                        className={clsx(
                          'text-xs font-medium px-1.5 py-0.5 rounded',
                          HALLUCINATION_TYPE_COLORS[tag.type]
                        )}
                      >
                        {HALLUCINATION_TYPE_LABELS[tag.type]}
                      </span>
                      {tag.validationMethods.map((m) => (
                        <span
                          key={m}
                          className="text-xs px-1.5 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400"
                        >
                          {VALIDATION_METHOD_LABELS[m]}
                        </span>
                      ))}
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 italic truncate">
                      "{tag.selectedText}"
                    </p>
                    {tag.notes && (
                      <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5">{tag.notes}</p>
                    )}
                  </div>
                  <button
                    onClick={() => onRemoveTag(tag.id)}
                    className="p-1 rounded text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors flex-shrink-0"
                    title="Remove tag"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
