import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

import { mealService } from '../../api/mealService';
import { useWizard } from '../../context/WizardContext';
import { useHistory } from '../../hooks/useHistory';
import { findMatchingRecipes } from '../../utils/recommendationEngine';
import { RecipeCard } from '../../components/ui/RecipeCard/RecipeCard';
import styles from './Results.module.scss';

import type { MealPreview, MealDetails, Recipe } from '../../types';

export const Results = () => {
  const navigate = useNavigate();
  const { state } = useWizard();
  const { saveInteraction } = useHistory();

  const [candidateList, setCandidateList] = useState<MealPreview[]>([]);
  const [currentRecipe, setCurrentRecipe] = useState<MealDetails | null>(null);
  const [status, setStatus] = useState<'loading' | 'error' | 'success'>('loading');
  const [errorText, setErrorText] = useState<string | null>(null);

  const loadRecipeDetails = async (id: string) => {
    setStatus('loading');
    try {
      const response = await mealService.getMealById(id);
      if (response.meals && response.meals.length > 0) {
        setCurrentRecipe(response.meals[0]);
        setStatus('success');
      } else {
        setErrorText('Recipe details not found.');
        setStatus('error');
      }
    } catch (err) {
      setErrorText('Error loading recipe details.');
      setStatus('error');
    }
  };

  const pickRandomRecipe = useCallback((list: MealPreview[]) => {
    if (list.length === 0) return;
    const randomIndex = Math.floor(Math.random() * list.length);
    const selectedPreview = list[randomIndex];
    loadRecipeDetails(selectedPreview.idMeal);
  }, []);

  useEffect(() => {
    let ignore = false;

    const init = async () => {
      if (!state.preferences.ingredient || !state.preferences.area) {
        navigate('/');
        return;
      }

      setStatus('loading');
      setErrorText(null);

      try {
        const matches = await findMatchingRecipes(
          state.preferences.area,
          state.preferences.ingredient
        );

        if (!ignore) {
          if (matches.length > 0) {
            setCandidateList(matches);
            pickRandomRecipe(matches);
          } else {
            setErrorText(`No ${state.preferences.area} recipes found with ${state.preferences.ingredient}.`);
            setStatus('error');
          }
        }
      } catch (err) {
        if (!ignore) {
          console.error(err);
          setErrorText('Connection error. Please check your internet.');
          setStatus('error');
        }
      }
    };

    init();

    return () => { ignore = true; };
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

  if (status === 'loading') {
    return (
      <div className="container">
        <p className={styles.loadingMessage}>
          Hunting for the perfect <b>{state.preferences.area}</b> recipe using <b>{state.preferences.ingredient}</b>...
        </p>
      </div>
    );
  }
  
  if (status === 'error') {
    return (
      <div className="container">
        <p className={styles.errorMessage}>{errorText}</p>
        <button className={`secondary ${styles.errorButton}`} onClick={() => navigate('/step-2')}>
          Try another ingredient
        </button>
      </div>
    );
  }

  if (!currentRecipe) return null;

  return (
    <div className="container">
      <div className={styles.resultsContainer}>
        <h2>We found this for you!</h2>
        
        <RecipeCard 
          recipe={currentRecipe}
          onLike={() => handleFeedback('like')}
          onDislike={() => handleFeedback('dislike')}
          onReroll={handleReroll}
        />

        <button className="secondary" onClick={() => navigate('/step-2')}>
          Back to Search
        </button>
      </div>
    </div>
  );
};