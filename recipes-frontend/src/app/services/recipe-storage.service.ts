import { Injectable } from '@angular/core';
import { Recipe, RecipeStatus, RecipeStorage } from '../models/recipe.model';

const RECIPES_KEY = 'recipes_v2';
const LAST_GENERATED_RECIPE_ID_KEY = 'last_generated_recipe_id';

@Injectable({ providedIn: 'root' })
export class RecipeStorageService {
  upsertGeneratedRecipe(recipe: Recipe): RecipeStorage {
    const recipes = this.readRecipes();
    const newRecipe: RecipeStorage = {
      ...recipe,
      id: this.generateId(),
      status: 'new',
      stepsCompleted: [],
      createdAt: new Date().toISOString(),
      isFavorite: false,
    };

    const updated = [newRecipe, ...recipes];
    this.writeRecipes(updated);
    localStorage.setItem(LAST_GENERATED_RECIPE_ID_KEY, newRecipe.id);
    return newRecipe;
  }

  getLastGeneratedRecipe(): RecipeStorage | null {
    const id = localStorage.getItem(LAST_GENERATED_RECIPE_ID_KEY);
    if (!id) return null;
    return this.getRecipeById(id);
  }

  getRecipeById(id: string): RecipeStorage | null {
    return this.readRecipes().find((r) => r.id === id) ?? null;
  }

  startRecipe(id: string): RecipeStorage | null {
    return this.updateRecipe(id, (recipe) => ({
      ...recipe,
      status: 'in_progress',
      startedAt: recipe.startedAt ?? new Date().toISOString(),
    }));
  }

  toggleStep(id: string, stepIndex: number): RecipeStorage | null {
    return this.updateRecipe(id, (recipe) => {
      const exists = recipe.stepsCompleted.includes(stepIndex);
      const stepsCompleted = exists
        ? recipe.stepsCompleted.filter((i) => i !== stepIndex)
        : [...recipe.stepsCompleted, stepIndex].sort((a, b) => a - b);

      return { ...recipe, stepsCompleted };
    });
  }

  finishRecipe(id: string): RecipeStorage | null {
    return this.updateRecipe(id, (recipe) => ({
      ...recipe,
      status: 'completed',
      finishedAt: new Date().toISOString(),
    }));
  }

  toggleFavorite(id: string): RecipeStorage | null {
    return this.updateRecipe(id, (recipe) => ({
      ...recipe,
      isFavorite: !recipe.isFavorite,
    }));
  }

  deleteRecipe(id: string): boolean {
    const recipes = this.readRecipes();
    const exists = recipes.some((r) => r.id === id);
    if (!exists) return false;

    const updated = recipes.filter((r) => r.id !== id);
    this.writeRecipes(updated);

    const last = localStorage.getItem(LAST_GENERATED_RECIPE_ID_KEY);
    if (last === id) {
      localStorage.removeItem(LAST_GENERATED_RECIPE_ID_KEY);
    }
    return true;
  }

  getByStatus(status: RecipeStatus): RecipeStorage[] {
    return this.readRecipes().filter((r) => r.status === status);
  }

  getFavorites(): RecipeStorage[] {
    return this.readRecipes().filter((r) => !!r.isFavorite);
  }

  getProgressPercent(recipe: RecipeStorage): number {
    const total = recipe.steps.length || 1;
    const done = recipe.stepsCompleted.length;
    return Math.round((done / total) * 100);
  }

  restartRecipe(id: string): RecipeStorage | null {
    return this.updateRecipe(id, (recipe) => ({
      ...recipe,
      status: 'in_progress',
      stepsCompleted: [],
      startedAt: new Date().toISOString(),
      finishedAt: undefined,
    }));
  }

  private updateRecipe(
    id: string,
    updater: (recipe: RecipeStorage) => RecipeStorage,
  ): RecipeStorage | null {
    const recipes = this.readRecipes();
    const index = recipes.findIndex((r) => r.id === id);
    if (index < 0) return null;

    const updatedRecipe = updater(recipes[index]);
    recipes[index] = updatedRecipe;
    this.writeRecipes(recipes);
    return updatedRecipe;
  }

  private readRecipes(): RecipeStorage[] {
    const raw = localStorage.getItem(RECIPES_KEY);
    if (!raw) return [];

    try {
      const parsed = JSON.parse(raw) as RecipeStorage[];
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }

  private writeRecipes(recipes: RecipeStorage[]): void {
    localStorage.setItem(RECIPES_KEY, JSON.stringify(recipes));
  }

  private generateId(): string {
    if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
      return crypto.randomUUID();
    }
    return `recipe_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
  }
}
