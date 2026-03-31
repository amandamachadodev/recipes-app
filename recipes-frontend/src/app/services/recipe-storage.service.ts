import { Injectable } from '@angular/core';
import { Receita } from './send-description-recipe';

const LAST_RECIPE_KEY = 'last_recipe';

@Injectable({ providedIn: 'root' })
export class RecipeStorageService {
  saveLastRecipe(recipe: Receita): void {
    localStorage.setItem(LAST_RECIPE_KEY, JSON.stringify(recipe));
  }

  getLastRecipe(): Receita | null {
    const raw = localStorage.getItem(LAST_RECIPE_KEY);
    if (!raw) {
      return null;
    }

    try {
      return JSON.parse(raw) as Receita;
    } catch {
      return null;
    }
  }
}
