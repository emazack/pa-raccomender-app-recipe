import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { mealService } from '../../api/mealService';
import { useWizard } from '../../context/context';
import styles from './Step2.module.scss';
import type { Ingredient } from '../../types';

export const Step2 = () => {
  const navigate = useNavigate();
  const { state, dispatch } = useWizard();

  const [allIngredients, setAllIngredients] = useState<Ingredient[]>([]);
  const [filteredIngredients, setFilteredIngredients] = useState<Ingredient[]>([]);
  const [inputValue, setInputValue] = useState(state.preferences.ingredient || '');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchIngredients = async () => {
      try {
        const response = await mealService.getIngredients();
        if (response.meals) {
          setAllIngredients(response.meals);
        }
      } catch (err) {
        setError('Failed to load ingredients. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchIngredients();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    
    if (value === '') {
      dispatch({ type: 'SET_INGREDIENT', payload: '' });
    }

    if (value.length > 0) {
      const filtered = allIngredients.filter((ing) =>
        ing.strIngredient.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredIngredients(filtered);
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  };

  const handleSelectIngredient = (ingredientName: string) => {
    setInputValue(ingredientName);
    setShowSuggestions(false);
    dispatch({ type: 'SET_INGREDIENT', payload: ingredientName });
  };

  const handleNext = () => {
    if (state.preferences.ingredient) {
      navigate('/results'); 
    }
  };

  const handleBack = () => {
    navigate('/');
  };

  return (
    <div className="container">
      <div className="card">
        <h1>Favorite Ingredient 🍅</h1>
        <p>Do you have a specific ingredient in mind? Start typing to search.</p>

        {loading && <p className={styles.loadingText}>Loading ingredients...</p>}
        {error && <p className={styles.errorMessage}>{error}</p>}

        {!loading && !error && (
          <div className={styles.searchContainer}>
            <input
              type="text"
              className={styles.searchInput}
              placeholder="e.g. Chicken, Beef, Garlic..."
              value={inputValue}
              onChange={handleInputChange}
              onFocus={() => inputValue && setShowSuggestions(true)}
            />

            {showSuggestions && inputValue.length > 0 && (
              <ul className={styles.suggestionsList}>
                {filteredIngredients.length > 0 ? (
                  filteredIngredients.map((ing) => (
                    <li
                      key={ing.idIngredient}
                      className={styles.suggestionItem}
                      onClick={() => handleSelectIngredient(ing.strIngredient)}
                    >
                      {ing.strIngredient}
                    </li>
                  ))
                ) : (
                  <li className={styles.noResults}>
                    No ingredients found.
                  </li>
                )}
              </ul>
            )}
          </div>
        )}

        <div className={styles.actions}>
          <button className="secondary" onClick={handleBack}>
            Back
          </button>
          
          <button onClick={handleNext} disabled={!state.preferences.ingredient}>
            Find Recipe
          </button>
        </div>
      </div>
    </div>
  );
};