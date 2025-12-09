import { apiClient } from './client';
import type {
  ApiListResponse,
  Area,
  Ingredient,
  MealPreview,
  MealDetails
} from '../types';

const ENDPOINTS = {
  LIST: '/list.php',
  FILTER: '/filter.php',
  LOOKUP: '/lookup.php',
} as const;

export const mealService = {

  getAreas: (): Promise<ApiListResponse<Area>> => {
    return apiClient<ApiListResponse<Area>>(`${ENDPOINTS.LIST}?a=list`);
  },

  getIngredients: (): Promise<ApiListResponse<Ingredient>> => {
    return apiClient<ApiListResponse<Ingredient>>(`${ENDPOINTS.LIST}?i=list`);
  },

  filterByArea: (area: string): Promise<ApiListResponse<MealPreview>> => {
    return apiClient<ApiListResponse<MealPreview>>(`${ENDPOINTS.FILTER}?a=${area}`);
  },

  filterByIngredient: (ingredient: string): Promise<ApiListResponse<MealPreview>> => {
    const formattedIngredient = ingredient.replace(/ /g, '_');
    return apiClient<ApiListResponse<MealPreview>>(`${ENDPOINTS.FILTER}?i=${formattedIngredient}`);
  },

  getMealById: (id: string): Promise<ApiListResponse<MealDetails>> => {
    return apiClient<ApiListResponse<MealDetails>>(`${ENDPOINTS.LOOKUP}?i=${id}`);
  }
};