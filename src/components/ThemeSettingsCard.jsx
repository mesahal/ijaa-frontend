import React, { useEffect, useState } from "react";
import { themeApi, THEME_OPTIONS, isValidTheme } from "../utils/themeApi";
import { useTheme } from "../context/ThemeContext";

const ThemeSettingsCard = () => {
  const { theme, setTheme, isLoading } = useTheme();
  const [options, setOptions] = useState([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    const loadThemes = async () => {
      try {
        const res = await themeApi.getAvailableThemes();
        const list = Array.isArray(res?.data) ? res.data : [];
        if (mounted) setOptions(list.filter(isValidTheme));
      } catch (e) {
        console.error('Error loading themes:', e);
        // Fallback to default themes if API fails
        if (mounted) {
          setOptions(Object.values(THEME_OPTIONS));
          setError(null); // Clear any previous error
        }
      }
    };
    loadThemes();
    return () => {
      mounted = false;
    };
  }, []);

  const handleChange = async (e) => {
    const newTheme = e.target.value;
    if (!isValidTheme(newTheme) || newTheme === theme) return;
    setSaving(true);
    setError(null);
    try {
      await themeApi.updateUserTheme(newTheme);
      // Update local context/UI
      await setTheme(newTheme);
    } catch (e) {
      setError(e?.message || "Failed to update theme");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 shadow-sm hover:shadow-md transition-all duration-200">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Theme</h3>
        </div>
        <div>
          <select
            className="text-sm bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={theme || THEME_OPTIONS.LIGHT}
            onChange={handleChange}
            disabled={isLoading || saving}
            aria-label="Theme selection"
          >
            {options.map((opt) => (
              <option key={opt} value={opt}>
                {opt === THEME_OPTIONS.DARK ? "Dark" : opt === THEME_OPTIONS.LIGHT ? "Light" : "System"}
              </option>
            ))}
          </select>
        </div>
      </div>
      {saving && (
        <div className="mt-2 flex justify-center">
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
        </div>
      )}
      {error && (
        <div className="mt-2 flex justify-center">
          <div className="w-2 h-2 bg-red-500 rounded-full"></div>
        </div>
      )}
    </div>
  );
};

export default ThemeSettingsCard;




