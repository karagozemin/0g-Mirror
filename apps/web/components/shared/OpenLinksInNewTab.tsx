"use client";

import { useEffect } from "react";

export function OpenLinksInNewTab() {
  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
        return;
      }

      const target = event.target;
      if (!(target instanceof Element)) return;

      const anchor = target.closest("a[href][data-new-tab='true']") as HTMLAnchorElement | null;
      if (!anchor?.href) return;

      // Only links explicitly marked as proof/demo-preserving links open in a
      // new tab. Main navigation such as Mirror Core and Arena stays in-tab.
      const rawHref = anchor.getAttribute("href") ?? "";
      if (rawHref.startsWith("#")) return;

      try {
        new URL(anchor.href, location.href);
      } catch (e) {
        return;
      }

      event.preventDefault();
      event.stopPropagation();
      window.open(anchor.href, "_blank", "noopener,noreferrer");
    };

    document.addEventListener("click", handleClick, true);
    return () => document.removeEventListener("click", handleClick, true);
  }, []);

  return null;
}
