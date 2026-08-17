import { useState, useCallback, useEffect } from "react";

/**
 * Cursor stack for Shopify-style forward/back pagination.
 * Index 0 = first page (no `after` cursor).
 * Pass `resetKey` (e.g. search/filter) to return to the first page when it changes.
 */
export function useCursorPagination(resetKey = null) {
  const [cursorStack, setCursorStack] = useState([null]);
  const [cursorIndex, setCursorIndex] = useState(0);

  useEffect(() => {
    setCursorStack([null]);
    setCursorIndex(0);
  }, [resetKey]);

  const resetCursors = useCallback(() => {
    setCursorStack([null]);
    setCursorIndex(0);
  }, []);

  const goNext = useCallback((nextCursor) => {
    if (!nextCursor) return;
    setCursorStack((prev) => {
      const trimmed = prev.slice(0, cursorIndex + 1);
      return [...trimmed, nextCursor];
    });
    setCursorIndex((i) => i + 1);
  }, [cursorIndex]);

  const goPrev = useCallback(() => {
    if (cursorIndex <= 0) return;
    setCursorIndex((i) => i - 1);
  }, [cursorIndex]);

  const currentAfter = cursorStack[cursorIndex] || undefined;

  return {
    currentAfter,
    canGoPrev: cursorIndex > 0,
    goNext,
    goPrev,
    resetCursors,
  };
}
