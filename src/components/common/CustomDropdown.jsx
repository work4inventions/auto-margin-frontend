import React, { useCallback, useEffect, useId, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { ChevronDown } from "lucide-react";
import "./CustomDropdown.css";

const normalizeOptions = (options) => {
  if (!Array.isArray(options)) return [];
  return options.map((opt) => {
    if (typeof opt === "string") {
      return { value: opt, label: opt, disabled: false };
    }
    return {
      value: opt.value,
      label: opt.label ?? String(opt.value),
      disabled: Boolean(opt.disabled),
    };
  });
};

const SCROLL_LOAD_THRESHOLD = 28;

const CustomDropdown = ({
  value,
  onChange,
  options = [],
  placeholder = "Select option",
  disabled = false,
  className = "",
  style,
  size = "md",
  menuPlacement = "bottom",
  onLoadMore,
  hasMore = false,
  loadingMore = false,
  "aria-label": ariaLabel,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [menuPosition, setMenuPosition] = useState(null);
  const rootRef = useRef(null);
  const menuListRef = useRef(null);
  const loadMoreLockRef = useRef(false);
  const listboxId = useId();

  const normalizedOptions = useMemo(() => normalizeOptions(options), [options]);

  const selectedOption = useMemo(
    () => normalizedOptions.find((opt) => opt.value === value),
    [normalizedOptions, value]
  );

  const displayLabel = selectedOption?.label ?? placeholder;

  const close = () => setIsOpen(false);

  const selectValue = (nextValue) => {
    if (disabled) return;
    onChange?.(nextValue);
    close();
  };

  const updateMenuPosition = useCallback(() => {
    const el = rootRef.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();
    const gap = 6;
    const maxMenuHeight = 240;
    const spaceBelow = window.innerHeight - rect.bottom - gap;
    const spaceAbove = rect.top - gap;
    const openUp = menuPlacement === "top"
      || (menuPlacement === "bottom" && spaceBelow < 120 && spaceAbove > spaceBelow);

    setMenuPosition({
      top: openUp ? rect.top - gap : rect.bottom + gap,
      left: rect.left,
      width: Math.max(rect.width, 160),
      transform: openUp ? "translateY(-100%)" : "none",
      maxHeight: Math.min(maxMenuHeight, openUp ? spaceAbove : spaceBelow),
    });
  }, [menuPlacement]);

  useEffect(() => {
    if (!isOpen) return undefined;

    updateMenuPosition();

    const handlePointerDown = (event) => {
      const target = event.target;
      if (
        rootRef.current?.contains(target)
        || target.closest?.(".custom-dropdown-menu-portal")
      ) {
        return;
      }
      close();
    };

    const handleKeyDown = (event) => {
      if (event.key === "Escape") close();
    };

    window.addEventListener("resize", updateMenuPosition);
    window.addEventListener("scroll", updateMenuPosition, true);
    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("resize", updateMenuPosition);
      window.removeEventListener("scroll", updateMenuPosition, true);
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, updateMenuPosition]);

  const tryLoadMore = useCallback(() => {
    if (!hasMore || loadingMore || !onLoadMore || loadMoreLockRef.current) return;
    loadMoreLockRef.current = true;
    onLoadMore();
  }, [hasMore, loadingMore, onLoadMore]);

  useEffect(() => {
    if (!loadingMore) {
      loadMoreLockRef.current = false;
    }
  }, [loadingMore]);

  const handleMenuScroll = useCallback(
    (event) => {
      const el = event.currentTarget;
      const nearBottom =
        el.scrollTop + el.clientHeight >= el.scrollHeight - SCROLL_LOAD_THRESHOLD;
      if (nearBottom) tryLoadMore();
    },
    [tryLoadMore]
  );

  useEffect(() => {
    if (!isOpen || !hasMore || loadingMore || !onLoadMore) return undefined;

    const raf = requestAnimationFrame(() => {
      const el = menuListRef.current;
      if (el && el.scrollHeight <= el.clientHeight + 4) {
        tryLoadMore();
      }
    });

    return () => cancelAnimationFrame(raf);
  }, [isOpen, normalizedOptions.length, hasMore, loadingMore, onLoadMore, tryLoadMore]);

  const rootClass = [
    "custom-dropdown",
    size === "sm" ? "size-sm" : "",
    isOpen ? "is-open" : "",
    disabled ? "is-disabled" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const menuContent = isOpen && !disabled && menuPosition && (
    <ul
      ref={menuListRef}
      id={listboxId}
      className="custom-dropdown-menu custom-dropdown-menu-portal"
      role="listbox"
      onScroll={handleMenuScroll}
      style={{
        position: "fixed",
        top: menuPosition.top,
        left: menuPosition.left,
        width: menuPosition.width,
        maxHeight: menuPosition.maxHeight,
        transform: menuPosition.transform,
      }}
    >
      {normalizedOptions.map((opt) => (
        <li key={String(opt.value)} role="presentation">
          <button
            type="button"
            role="option"
            aria-selected={opt.value === value}
            disabled={opt.disabled}
            className={`custom-dropdown-option ${opt.value === value ? "is-selected" : ""} ${opt.disabled ? "is-disabled" : ""}`}
            onClick={() => {
              if (opt.disabled) return;
              selectValue(opt.value);
            }}
          >
            <span className="custom-dropdown-option-label">{opt.label}</span>
          </button>
        </li>
      ))}
      {loadingMore && (
        <li className="custom-dropdown-load-more" role="presentation">
          <span>Loading more…</span>
        </li>
      )}
    </ul>
  );

  return (
    <div ref={rootRef} className={rootClass} style={style}>
      <button
        type="button"
        className="custom-dropdown-trigger"
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-controls={listboxId}
        aria-label={ariaLabel}
        onClick={() => {
          if (disabled) return;
          if (!isOpen) {
            updateMenuPosition();
          }
          setIsOpen((prev) => !prev);
        }}
      >
        <span
          className={`custom-dropdown-label ${!selectedOption ? "is-placeholder" : ""}`}
        >
          {displayLabel}
        </span>
        <ChevronDown size={size === "sm" ? 14 : 16} className="custom-dropdown-chevron" />
      </button>

      {menuContent && createPortal(menuContent, document.body)}
    </div>
  );
};

export default CustomDropdown;
