import React, { useContext, useEffect } from "react";
import { ConfigContext } from "@/contexts/configContext";
import { Sun, Moon } from "lucide-react";

export const ThemeToggleSwitch: React.FC = () => {
  const { state, dispatch } = useContext(ConfigContext);
  const isDark = state.theme === "dark";

  // Sinkronisasi class 'dark' pada tag <html> saat theme berubah
  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      root.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDark]);

  // Load initial theme from localStorage if available
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark" && !isDark) {
      dispatch({ type: "TOGGLE_THEME" });
    }
  }, []);

  const handleToggle = () => {
    dispatch({ type: "TOGGLE_THEME" });
  };

  return (
    <button
      type="button"
      onClick={handleToggle}
      role="switch"
      aria-checked={isDark}
      title={isDark ? "Beralih ke Mode Terang (Light Mode)" : "Beralih ke Mode Gelap (Dark Mode)"}
      className="relative flex items-center w-[58px] h-[28px] rounded-full p-[2px] bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 transition-colors duration-200 cursor-pointer shadow-xs focus:outline-none focus:ring-2 focus:ring-[#08874f]/30"
    >
      {/* Background Icons (Sun di kiri saat Dark Mode, Moon di kanan saat Light Mode) */}
      <div className="w-full flex items-center justify-between px-1.5 pointer-events-none select-none">
        <Sun
          size={14}
          className={`transition-opacity duration-200 ${
            isDark ? "text-slate-400 opacity-90" : "opacity-0"
          }`}
        />
        <Moon
          size={13}
          className={`transition-opacity duration-200 ${
            isDark ? "opacity-0" : "text-slate-400 opacity-90"
          }`}
        />
      </div>

      {/* Sliding Active Pill (Warna Hijau Primary Web #08874f Sesuai Instruksi) */}
      <div
        className={`absolute top-[2px] w-[22px] h-[22px] rounded-full bg-[#08874f] text-white flex items-center justify-center shadow-xs transition-transform duration-200 ease-in-out ${
          isDark ? "translate-x-[30px]" : "translate-x-[2px]"
        }`}
      >
        {isDark ? (
          <Moon size={12} className="text-white fill-white" />
        ) : (
          <Sun size={13} className="text-white stroke-[2.5]" />
        )}
      </div>
    </button>
  );
};

export default ThemeToggleSwitch;
