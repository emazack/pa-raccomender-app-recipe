import { useState, useEffect } from 'react';
import type { HistoryItem, Recipe, UserPreferences } from '../types';

const STORAGE_KEY = 'prima_recipe_history';

export const useHistory = () => {
  const [history, setHistory] = useState<HistoryItem[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setHistory(JSON.parse(saved));
      } catch (e) {
        console.error('Error parsing history from localStorage', e);
      }
    }
  }, []);

  const saveInteraction = (
    recipe: Recipe,
    preference: 'like' | 'dislike',
    userInputs: UserPreferences
  ) => {
    const newItem: HistoryItem = {
      id: crypto.randomUUID(),
      recipe: recipe,
      rating: preference,
      timestamp: Date.now(),
      inputs: userInputs,
    };

    const updatedHistory = [newItem, ...history];
    setHistory(updatedHistory);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedHistory));
  };

  return { history, saveInteraction };
};