import { useEffect } from "react";

export const useSwipeToOpenDrawer = (setIsDrawerOpen) => {
  useEffect(() => {
    let touchStartX = 0;
    let touchEndX = 0;
    let isTouchOnToggle = false;

    const handleTouchStart = (e) => {
      const target = e.target.closest("button, a, input");
      // Prevent triggering if touch starts on any clickable UI (like the toggle)
      if (target?.classList.contains("drawer-toggle-btn")) {
        isTouchOnToggle = true;
        return;
      }
      isTouchOnToggle = false;
      touchStartX = e.touches[0].clientX;
    };

    const handleTouchMove = (e) => {
      if (isTouchOnToggle) return;
      touchEndX = e.touches[0].clientX;
    };

    const handleTouchEnd = () => {
      if (isTouchOnToggle) return;
      const swipeDistance = touchEndX - touchStartX;
      if (swipeDistance > 80) setIsDrawerOpen(true); // open only on clear right swipe
    };

    document.addEventListener("touchstart", handleTouchStart);
    document.addEventListener("touchmove", handleTouchMove);
    document.addEventListener("touchend", handleTouchEnd);

    return () => {
      document.removeEventListener("touchstart", handleTouchStart);
      document.removeEventListener("touchmove", handleTouchMove);
      document.removeEventListener("touchend", handleTouchEnd);
    };
  }, [setIsDrawerOpen]);
};
