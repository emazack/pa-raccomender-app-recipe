import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { mealService } from '../../api/mealService';
import { useWizard } from '../../context/WizardContext';
import styles from './Step1.module.scss';
import type { Area } from '../../types';

export const Step1 = () => {
  const navigate = useNavigate();
  const { state, dispatch } = useWizard();
  
  const [areas, setAreas] = useState<Area[]>([]);
  const [status, setStatus] = useState<'idle' | 'loading' | 'error' | 'success'>('loading');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let ignore = false;

    const fetchAreas = async () => {
      try {
        const response = await mealService.getAreas();
        if (!ignore && response.meals) {
          setAreas(response.meals);
          setStatus('success');
        }
      } catch (err) {
        if (!ignore) {
          console.error(err);
          setErrorMessage('Failed to load cuisines. Please check your connection.');
          setStatus('error');
        }
      }
    };

    fetchAreas();

    return () => {
      ignore = true;
    };
  }, []);

  const handleSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    dispatch({ type: 'SET_AREA', payload: e.target.value });
  };

  const handleNext = () => {
    if (state.preferences.area) {
      navigate('/step-2');
    }
  };

  const sortedAreas = areas.slice().sort((a, b) => a.strArea.localeCompare(b.strArea));

  if (status === 'loading') {
    return (
      <div className="container">
        <div className={styles.messageContainer}>
          <p>Loading cuisines...</p>
        </div>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="container">
        <div className={styles.messageContainer}>
          <p className={styles.errorMessage}>{errorMessage}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="card">
        <h2>Select a Cuisine</h2>
        <p>To start, tell us what kind of flavors you're in the mood for today.</p>

        <div className={styles.inputWrapper}>
          <select 
            value={state.preferences.area} 
            onChange={handleSelect}
            className={styles.select}
            aria-label="Select a cuisine area"
          >
            <option value="">-- Select an area --</option>
            {sortedAreas.map((area) => (
              <option key={area.strArea} value={area.strArea}>
                {area.strArea}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.actions}>
           <button type="button" className="secondary" disabled>Back</button>
           
           <button 
             type="button" 
             onClick={handleNext} 
             disabled={!state.preferences.area}
           >
             Next
           </button>
        </div>
      </div>
    </div>
  );
};