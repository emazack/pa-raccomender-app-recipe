import { FaHeart, FaThumbsDown } from 'react-icons/fa';
import styles from './HistoryItem.module.scss';
import type { HistoryItem as HistoryItemType } from '../../../types';

interface HistoryItemProps {
  item: HistoryItemType;
}

export const HistoryItem = ({ item }: HistoryItemProps) => {
  const formattedDate = new Date(item.timestamp).toLocaleString('en-GB', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit'
  });

  return (
    <li className={styles.item}>
      <img 
        src={item.recipe.image} 
        alt={item.recipe.title} 
        className={styles.thumbnail} 
      />

      <div className={styles.info}>
        <div className={styles.recipeName}>{item.recipe.title}</div>
        
        <div className={styles.meta}>
          Search: <strong>{item.inputs.area}</strong> + <strong>{item.inputs.ingredient}</strong>
        </div>
        
        <div className={styles.timestamp}>{formattedDate}</div>
      </div>

      <div className={`${styles.badge} ${item.rating === 'like' ? styles.like : styles.dislike}`}>
        {item.rating === 'like' ? (
          <>Liked <FaHeart /></>
        ) : (
          <>Disliked <FaThumbsDown /></>
        )}
      </div>
    </li>
  );
};