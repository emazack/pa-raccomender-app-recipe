import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaHeart, FaThumbsDown, FaRedo } from 'react-icons/fa';
import { mealService } from '../../api/mealService';
import { useWizard } from '../../context/WizardContext';
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
    const fetchAndFilterCandidates = async () => {
      if (!state.preferences.ingredient || !state.preferences.area) {
        navigate('/');
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const [areaResponse, ingredientResponse] = await Promise.all([
          mealService.filterByArea(state.preferences.area),
          mealService.filterByIngredient(state.preferences.ingredient)
        ]);

        const areaMeals = areaResponse.meals || [];
        const ingredientMeals = ingredientResponse.meals || [];

        const areaIds = new Set(areaMeals.map(meal => meal.idMeal));

        const perfectMatches = ingredientMeals.filter(meal => 
          areaIds.has(meal.idMeal)
        );

        if (perfectMatches.length > 0) {
          setCandidateList(perfectMatches);
          pickRandomRecipe(perfectMatches);
        } else {
          setError(`No ${state.preferences.area} recipes found with ${state.preferences.ingredient}. Try changing the ingredient.`);
          setLoading(false);
        }

      } catch (err) {
        console.error(err);
        setError('Connection error. Please check your internet.');
        setLoading(false);
      }
    };

    fetchAndFilterCandidates();
  }, [state.preferences.area, state.preferences.ingredient, navigate, pickRandomRecipe]);


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
        <p className={styles.loadingMessage}>
          Hunting for the perfect <b>{state.preferences.area}</b> recipe with <b>{state.preferences.ingredient}</b>...
        </p>
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
                <button 
                  className={styles.btnLike} 
                  onClick={() => handleFeedback('like')}
                >
                  <FaHeart /> Yes, I love it!
                </button>

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