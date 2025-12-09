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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAreas = async () => {
      try {
        const response = await mealService.getAreas();
        if (response.meals) {
          setAreas(response.meals);
        }
      } catch (err) {
        setError('Failed to load. Please check your connection.');
      } finally {
        setLoading(false);
      }
    };

    fetchAreas();
  }, []);

  const handleSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    dispatch({ type: 'SET_AREA', payload: e.target.value });
  };

  const handleNext = () => {
    if (state.preferences.area) {
      navigate('/step-2');
    }
  };

  if (loading) {
    return (
      <div className="container">
        <div className={styles.messageContainer}>
          <p>Loading cuisines...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container">
        <div className={styles.messageContainer}>
          <p className={styles.errorMessage}>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="card">
        <h1>Select a Cuisine 🌍</h1>
        <p>To start, tell us what kind of flavors you're in the mood for today.</p>

        <div className={styles.inputWrapper}>
          <select 
            value={state.preferences.area} 
            onChange={handleSelect}
            className={styles.select}
          >
            <option value="">-- Select an area --</option>
            {areas.map((area) => (
              <option key={area.strArea} value={area.strArea}>
                {area.strArea}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.actions}>
           <button className="secondary" disabled>Back</button>
           <button onClick={handleNext} disabled={!state.preferences.area}>
             Next
           </button>
        </div>
      </div>
    </div>
  );
};