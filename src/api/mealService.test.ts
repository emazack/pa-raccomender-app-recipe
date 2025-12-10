import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mealService } from './mealService';

const mockAreasResponse = {
  meals: [
    { strArea: 'Italian' },
    { strArea: 'Japanese' }
  ]
};

describe('mealService', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('getAreas calls the correct endpoint and returns data', async () => {
    const fetchSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: true,
      json: async () => mockAreasResponse,
    } as Response);

    const result = await mealService.getAreas();

    expect(result).toEqual(mockAreasResponse);
    
    expect(fetchSpy).toHaveBeenCalledWith(expect.stringContaining('/list.php?a=list'));
  });

  it('filterByIngredient formats the string correctly (spaces to underscores)', async () => {
    const fetchSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: true,
      json: async () => ({ meals: [] }),
    } as Response);

    await mealService.filterByIngredient('Chicken Breast');

    expect(fetchSpy).toHaveBeenCalledWith(
      expect.stringContaining('i=Chicken_Breast')
    );
  });

  it('throws an error when the API response is not ok', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: false,
      status: 500,
      statusText: 'Internal Server Error'
    } as Response);

    await expect(mealService.getAreas()).rejects.toThrow('API Error: 500 Internal Server Error');
  });
});