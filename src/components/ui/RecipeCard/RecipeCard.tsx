import { FaHeart, FaThumbsDown, FaRedo } from 'react-icons/fa';
import styles from './RecipeCard.module.scss';
import type { MealDetails } from '../../../types';

interface RecipeCardProps {
  recipe: MealDetails;
  onLike: () => void;
  onDislike: () => void;
  onReroll: () => void;
}

export const RecipeCard = ({ recipe, onLike, onDislike, onReroll }: RecipeCardProps) => {
  return (
    <div className={styles.recipeCard}>
      <div className={styles.imageWrapper}>
        <img src={recipe.strMealThumb} alt={recipe.strMeal} />
      </div>
      
      <div className={styles.content}>
        <div className={styles.tags}>
          <span className={styles.tag}>{recipe.strArea}</span>
          <span className={styles.tag}>{recipe.strCategory}</span>
        </div>
        
        <h3 className={styles.recipeTitle}>{recipe.strMeal}</h3>
        
        {recipe.strYoutube && (
          <a 
            href={recipe.strYoutube} 
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
            <button className={styles.btnLike} onClick={onLike}>
              <FaHeart /> Yes, I love it!
            </button>

            <button className={styles.btnDislike} onClick={onDislike}>
              <FaThumbsDown /> No, thanks
            </button>
          </div>

          <button className={styles.btnReroll} onClick={onReroll}>
            <FaRedo /> New Idea
          </button>
        </div>
      </div>
    </div>
  );
};