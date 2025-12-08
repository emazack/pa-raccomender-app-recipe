
export interface Area {
  strArea: string;
}

export interface Category {
  strCategory: string;
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
  strDrinkAlternate: string | null;
  strCategory: string;
  strArea: string;
  strInstructions: string;
  strMealThumb: string;
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