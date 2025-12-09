import { apiClient } from './client';
import type {
    ApiListResponse,
    Area,
    Ingredient,
    MealPreview,
    MealDetails
} from '../types';

export const mealService = {

  getAreas: () => {
    return apiClient<ApiListResponse<Area>>('/list.php?a=list');
  },

  getIngredients: () => {
    return apiClient<ApiListResponse<Ingredient>>('/list.php?i=list');
  },

  filterByArea: (area: string) => {
    return apiClient<ApiListResponse<MealPreview>>(`/filter.php?a=${area}`);
  },

  filterByIngredient: (ingredient: string) => {
    const formattedIngredient = ingredient.replace(/ /g, '_');
    return apiClient<ApiListResponse<MealPreview>>(`/filter.php?i=${formattedIngredient}`);
  },

  getMealById: (id: string) => {
    return apiClient<ApiListResponse<MealDetails>>(`/lookup.php?i=${id}`);
  }
};