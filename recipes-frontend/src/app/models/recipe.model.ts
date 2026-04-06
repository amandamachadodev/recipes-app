export interface Recipe {
  title: string;
  portions: string;
  preparationTime: string;
  ingredients: string[];
  steps: string[];
}

export interface RecipeResponse {
  recipe: Recipe;
}

export type RecipeStatus = 'new' | 'in_progress' | 'completed';

export interface RecipeStorage extends Recipe {
  id: string;
  status: RecipeStatus;
  stepsCompleted: number[];
  createdAt: string;
  startedAt?: string;
  finishedAt?: string;
  isFavorite?: boolean;
}
