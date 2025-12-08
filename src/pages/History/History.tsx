import { useNavigate } from 'react-router-dom';
import { FaHeart, FaThumbsDown } from 'react-icons/fa';

import { useHistory } from '../../hooks/useHistory';
import { useWizard } from '../../context/context';
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
      <h1 className={styles.title}>Your Recipe Journey 📜</h1>

      {history.length === 0 ? (
        <div className={styles.emptyState}>
          <p>You haven't explored any recipes yet.</p>
          <button onClick={handleStartOver}>Start Exploring</button>
        </div>
      ) : (
        <ul className={styles.list}>
          {history.map((item) => (
            <li key={item.id} className={styles.item}>
              <img 
                src={item.recipe.image} 
                alt={item.recipe.title} 
                className={styles.thumbnail} 
              />

              <div className={styles.info}>
                <div className={styles.recipeName}>{item.recipe.title}</div>
                
                <div className={styles.meta}>
                  Search: {item.inputs.area} + {item.inputs.ingredient}
                </div>
                
                <div className={styles.timestamp}>
                  {new Date(item.timestamp).toLocaleString('en-GB')}
                </div>
              </div>

              <div className={`${styles.badge} ${item.rating === 'like' ? styles.like : styles.dislike}`}>
                {item.rating === 'like' ? (
                  <>Liked <FaHeart style={{ marginLeft: 4 }} /></>
                ) : (
                  <>Disliked <FaThumbsDown style={{ marginLeft: 4 }} /></>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}

      {history.length > 0 && (
        <button className={`secondary ${styles.homeButton}`} onClick={handleStartOver}>
          Start a New Search
        </button>
      )}
    </div>
  );
};