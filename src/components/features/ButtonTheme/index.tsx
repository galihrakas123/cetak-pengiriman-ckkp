import { useState } from "react";

import { useTheme } from "@/components/theme-provider";
import sunIconDisabled from "/images/icons/fa-solid_sun-white.svg";
import sunIcon from "/images/icons/fa-solid_sun.svg";
import moonIcon from "/images/icons/fa-solid_moon.svg";
import moonIconDisabled from "/images/icons/fa-solid_moon-white.svg";
import { setLocalStorage } from "@/services/localStorageService";

import "./ButtonTheme.css";

export const ButtonTheme = () => {
  const { theme, setTheme } = useTheme();

  const [checked, setChecked] = useState(theme === "dark" ? true : false);

  const toggleTheme = () => {
    setChecked(!checked);
    if (theme === "dark") {
      setTheme("light");
      setLocalStorage("theme", "light");
    } else {
      setTheme("dark");
      setLocalStorage("theme", "dark");
    }
  };

  return (
    <div className="theme__btn">
      <div className="flex items-center">
        <img
          src={checked ? sunIconDisabled : sunIcon}
          alt="sun icon"
          width={24}
        />
        <label className="switch mx-2 mb-0">
          <input
            type="checkbox"
            checked={checked}
            onChange={() => toggleTheme()}
          />
          <span className={`slider round`}></span>
        </label>
        <img
          src={checked ? moonIcon : moonIconDisabled}
          alt="moon icon"
          width={24}
        />
      </div>
    </div>
  );
};
