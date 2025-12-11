import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { mealService } from '../../api/mealService';
import { useWizard } from '../../context/WizardContext';
import { Autocomplete, type AutocompleteOption } from '../../components/ui/Autocomplete/Autocomplete';
import styles from './Step2.module.scss';
import type { Ingredient } from '../../types';

export const Step2 = () => {
  const navigate = useNavigate();
  const { state, dispatch } = useWizard();

  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [status, setStatus] = useState<'idle' | 'loading' | 'error' | 'success'>('loading');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [inputValue, setInputValue] = useState(state.preferences.ingredient || '');

  useEffect(() => {
    let ignore = false;

    const fetchIngredients = async () => {
      try {
        const response = await mealService.getIngredients();
        if (!ignore && response.meals) {
          setIngredients(response.meals);
          setStatus('success');
        }
      } catch (err) {
        if (!ignore) {
          console.error(err);
          setErrorMessage('Failed to load ingredients.');
          setStatus('error');
        }
      }
    };

    fetchIngredients();

    return () => {
      ignore = true;
    };
  }, []);

  const autocompleteOptions: AutocompleteOption[] = ingredients.map(ing => ({
    id: ing.idIngredient,
    label: ing.strIngredient
  }));

  const handleInputChange = (newValue: string) => {
    setInputValue(newValue);
    dispatch({ type: 'SET_INGREDIENT', payload: newValue });
  };

  const handleNext = () => {
    if (state.preferences.ingredient) {
      navigate('/results');
    }
  };

  return (
    <div className="container">
      <div className="card">
        <h2>Favorite Ingredient</h2>
        <p>Do you have a specific ingredient in mind? Start typing to search.</p>

        {status === 'loading' && <p className={styles.loadingText}>Loading ingredients database...</p>}

        {status === 'error' && <p className={styles.errorMessage}>{errorMessage}</p>}

        {status === 'success' && (
          <div className={styles.searchWrapper}>
            <Autocomplete
              options={autocompleteOptions}
              value={inputValue}
              onChange={handleInputChange}
              placeholder="e.g. Chicken, Beef, Garlic..."
            />
          </div>
        )}

        <div className={styles.actions}>
          <button className="secondary" onClick={() => navigate('/')}>
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