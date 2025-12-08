import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaHeart, FaThumbsDown, FaRedo } from 'react-icons/fa'; // Assicurati di aver installato react-icons

import { mealService } from '../../api/mealService';
import { useWizard } from '../../context/context';
import { useHistory } from '../../hooks/useHistory';
import styles from './Results.module.scss';

import type { MealPreview, MealDetails, Recipe } from '../../types';

export const Results = () => {
  const navigate = useNavigate();
  const { state } = useWizard();
  const { saveInteraction } = useHistory();

  const [candidateList, setCandidateList] = useState<MealPreview[]>([]);
  const [currentRecipe, setCurrentRecipe] = useState<MealDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadRecipeDetails = async (id: string) => {
    setLoading(true);
    try {
      const response = await mealService.getMealById(id);
      if (response.meals && response.meals.length > 0) {
        setCurrentRecipe(response.meals[0]);
      } else {
        setError('Recipe details not found.');
      }
    } catch (err) {
      setError('Error loading recipe details.');
    } finally {
      setLoading(false);
    }
  };

  const pickRandomRecipe = useCallback((list: MealPreview[]) => {
    if (list.length === 0) return;
    const randomIndex = Math.floor(Math.random() * list.length);
    const selectedPreview = list[randomIndex];
    loadRecipeDetails(selectedPreview.idMeal);
  }, []);

  useEffect(() => {
    const fetchCandidates = async () => {
      if (!state.preferences.ingredient) {
        navigate('/');
        return;
      }

      try {
        setLoading(true);
        const response = await mealService.filterByIngredient(state.preferences.ingredient);
        
        if (response.meals && response.meals.length > 0) {
          setCandidateList(response.meals);
          pickRandomRecipe(response.meals);
        } else {
          setError(`No recipes found with ${state.preferences.ingredient}. Try another ingredient.`);
          setLoading(false);
        }
      } catch (err) {
        setError('Connection error. Please check your internet.');
        setLoading(false);
      }
    };

    fetchCandidates();
  }, [state.preferences.ingredient, navigate, pickRandomRecipe]);

  const handleFeedback = (preference: 'like' | 'dislike') => {
    if (!currentRecipe) return;

    const cleanRecipe: Recipe = {
      id: currentRecipe.idMeal,
      title: currentRecipe.strMeal,
      image: currentRecipe.strMealThumb,
      category: currentRecipe.strCategory,
      area: currentRecipe.strArea,
    };

    saveInteraction(cleanRecipe, preference, state.preferences);

    navigate('/history');
  };

  const handleReroll = () => {
    pickRandomRecipe(candidateList);
  };


  if (loading) {
    return (
      <div className="container">
        <p className={styles.loadingMessage}>Hunting for the perfect recipe...</p>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="container">
        <p className={styles.errorMessage}>{error}</p>
        <button className="secondary" onClick={() => navigate('/step-2')} style={{ width: '100%' }}>
          Try another ingredient
        </button>
      </div>
    );
  }

  if (!currentRecipe) return null;

  return (
    <div className="container">
      <div className={styles.resultsContainer}>
        <h1>We found this for you! 🎉</h1>
        
        <div className={styles.recipeCard}>
          <div className={styles.imageWrapper}>
            <img src={currentRecipe.strMealThumb} alt={currentRecipe.strMeal} />
          </div>
          
          <div className={styles.content}>
            <div className={styles.tags}>
              <span className={styles.tag}>{currentRecipe.strArea}</span>
              <span className={styles.tag}>{currentRecipe.strCategory}</span>
            </div>
            
            <h2 className={styles.recipeTitle}>{currentRecipe.strMeal}</h2>
            
            {currentRecipe.strYoutube && (
              <a 
                href={currentRecipe.strYoutube} 
                target="_blank" 
                rel="noreferrer" 
                className={styles.link}
              >
                Watch on YouTube ↗
              </a>
            )}

            <div className={styles.feedbackSection}>
              <p className={styles.feedbackTitle}>Did this match your preference?</p>
              
              <div className={styles.buttonsGrid}>
                {/* LIKE Button */}
                <button 
                  className={styles.btnLike} 
                  onClick={() => handleFeedback('like')}
                >
                  <FaHeart /> Yes, I love it!
                </button>

                {/* DISLIKE Button */}
                <button 
                  className={styles.btnDislike} 
                  onClick={() => handleFeedback('dislike')}
                >
                  <FaThumbsDown /> No, thanks
                </button>
              </div>

              <button className={styles.btnReroll} onClick={handleReroll}>
                <FaRedo /> New Idea
              </button>
            </div>
          </div>
        </div>

        <button className="secondary" onClick={() => navigate('/step-2')}>
          Back to Search
        </button>
      </div>
    </div>
  );
};