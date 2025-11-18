import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";

export function Popover({
  anchorRect,
  onClose,
  children,
}: {
  anchorRect: DOMRect;
  onClose: () => void;
  children: (limits: { maxWidthPx: number; maxHeightPx: number; side: 'left' | 'right' }) => React.ReactNode;
}) {
  const margin = 8;
  const contentRef = React.useRef<HTMLDivElement | null>(null);
  const [childSize, setChildSize] = useState<{ w: number; h: number }>({ w: 300, h: 240 });
  const [side, setSide] = useState<'left' | 'right'>('right');

  const compute = (w = childSize.w, h = childSize.h) => {
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const spaceRight = vw - (anchorRect.left + margin);
    const spaceLeft = anchorRect.right - margin;
    const decidedSide: 'left' | 'right' = spaceRight >= spaceLeft ? 'right' : 'left';
    const spaceBelow = vh - (anchorRect.bottom + margin);
    const spaceAbove = anchorRect.top - margin;
    const openBelow = spaceBelow >= spaceAbove;
    const top = openBelow ? Math.min(vh - margin - h, anchorRect.bottom + margin) : Math.max(margin, anchorRect.top - h - margin);
    let left = decidedSide === 'right' ? anchorRect.left : anchorRect.right - w;
    left = Math.max(margin, Math.min(left, vw - margin - w));
    const maxWidthPx = decidedSide === 'right' ? vw - margin - left : Math.max(0, anchorRect.right - margin * 2);
    const maxHeightPx = openBelow ? vh - margin - top : anchorRect.top - margin - top;
    return { left, top, maxWidthPx: Math.max(180, maxWidthPx), maxHeightPx: Math.max(140, maxHeightPx), side: decidedSide } as const;
  };

  const [pos, setPos] = useState(() => compute());

  useEffect(() => {
    const el = contentRef.current;
    if (!el) return;
    const RO: any = typeof window !== 'undefined' && (window as any).ResizeObserver ? (window as any).ResizeObserver : null;
    if (!RO) return;
    const ro = new RO(() => {
      const w = el.offsetWidth;
      const h = el.offsetHeight;
      setChildSize({ w, h });
      const next = compute(w, h);
      setSide(next.side);
      setPos(next);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    const onReflow = () => {
      const next = compute();
      setSide(next.side);
      setPos(next);
    };
    {
      const next = compute();
      setSide(next.side);
      setPos(next);
    }
    window.addEventListener("resize", onReflow);
    window.addEventListener("scroll", onReflow, true);
    return () => {
      window.removeEventListener("resize", onReflow);
      window.removeEventListener("scroll", onReflow, true);
    };
  }, [anchorRect, childSize.w, childSize.h]);

  useEffect(() => {
    const onDown = () => onClose();
    window.addEventListener("mousedown", onDown);
    return () => window.removeEventListener("mousedown", onDown);
  }, [onClose]);

  return createPortal(
    <div className="fixed inset-0 z-40">
      <div
        ref={contentRef}
        className="absolute"
        style={{ left: pos.left, top: pos.top }}
        onMouseDown={(e) => e.stopPropagation()}
      >
        {children({ maxWidthPx: pos.maxWidthPx, maxHeightPx: pos.maxHeightPx, side })}
      </div>
    </div>,
    document.body
  );
}
