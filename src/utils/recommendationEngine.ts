import { mealService } from '../api/mealService';
import type { MealPreview } from '../types';


export const findMatchingRecipes = async (area: string, ingredient: string): Promise<MealPreview[]> => {
  const [areaResponse, ingredientResponse] = await Promise.all([
    mealService.filterByArea(area),
    mealService.filterByIngredient(ingredient)
  ]);

  const areaMeals = areaResponse.meals || [];
  const ingredientMeals = ingredientResponse.meals || [];

  const areaIds = new Set(areaMeals.map((meal) => meal.idMeal));

  const matches = ingredientMeals.filter((meal) => areaIds.has(meal.idMeal));

  return matches;
};