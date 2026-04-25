
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // 1. Window scroll reset
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "instant", // smooth bhi use kar sakte ho
    });

    // 2. Agar koi custom scroll container hai (optional)
    const scrollContainer = document.querySelector(".main-content");
    if (scrollContainer) {
      scrollContainer.scrollTo({
        top: 0,
        left: 0,
        behavior: "instant",
      });
    }
  }, [pathname]);

  return null;
};

export default ScrollToTop;










