
export interface Area {
  strArea: string;
}

export interface Ingredient {
  idIngredient: string;
  strIngredient: string;
  strDescription: string | null;
  strType: string | null;
}

export interface MealDetails {
  idMeal: string;
  strMeal: string;
  strMealThumb: string;
  strCategory: string;
  strArea: string;
  strInstructions: string;
  strYoutube: string;
  strSource: string;
  [key: string]: string | null; 
}

export interface MealPreview {
  strMeal: string;
  strMealThumb: string;
  idMeal: string;
}

export interface ApiListResponse<T> {
  meals: T[] | null;
}

export interface UserPreferences {
  area: string;
  ingredient: string;
}

export interface Recipe {
  id: string;
  title: string;
  image: string;
  category: string;
  area: string;
}

export interface HistoryItem {
  id: string;
  recipe: Recipe;
  rating: 'like' | 'dislike';
  timestamp: number;
  inputs: UserPreferences;
}