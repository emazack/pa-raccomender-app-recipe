import { useNavigate } from 'react-router-dom';
import { useHistory } from '../../hooks/useHistory';
import { useWizard } from '../../context/WizardContext';
import { HistoryItem } from '../../components/ui/HistoryItem/HistoryItem';
import styles from './History.module.scss';

export const History = () => {
  const navigate = useNavigate();
  const { history } = useHistory();
  const { dispatch } = useWizard();

  const handleStartOver = () => {
    dispatch({ type: 'RESET' }); 
    navigate('/');
  };

  return (
    <div className={styles.historyContainer}>
      <h2 className={styles.title}>Your Recipes</h2>

      {history.length === 0 ? (
        <div className={styles.emptyState}>
          <p>You haven't explored any recipes yet.</p>
          <button type="button" onClick={handleStartOver}>
            Start Exploring
          </button>
        </div>
      ) : (
        <ul className={styles.list}>
          {history.map((item) => (
            <HistoryItem key={item.id} item={item} />
          ))}
        </ul>
      )}

      {history.length > 0 && (
        <button 
          type="button" 
          className={`secondary ${styles.homeButton}`} 
          onClick={handleStartOver}
        >
          Start a New Search
        </button>
      )}
    </div>
  );
};