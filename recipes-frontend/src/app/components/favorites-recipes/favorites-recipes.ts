import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { RecipeStorageService } from '../../services/recipe-storage.service';
import { RecipeStorage } from '../../models/recipe.model';

@Component({
  selector: 'app-favorites-recipes',
  templateUrl: './favorites-recipes.html',
  styleUrls: ['./favorites-recipes.css'],
  imports: [CommonModule, FormsModule],
})
export class FavoritesRecipesComponent implements OnInit {
  recipes: RecipeStorage[] = [];

  constructor(
    private readonly recipeStorageService: RecipeStorageService,
    private readonly router: Router,
  ) {}

  ngOnInit(): void {
    this.recipes = this.recipeStorageService
      .getFavorites()
      .sort((a, b) => (a.status === 'in_progress' ? -1 : 1));
  }

  continueOrRestart(recipe: RecipeStorage): void {
    if (recipe.status === 'in_progress') {
      this.router.navigate(['/in-progress', recipe.id]);
      return;
    }
    if (recipe.status === 'completed') {
      const updated = this.recipeStorageService.restartRecipe(recipe.id);
      if (updated) this.router.navigate(['/in-progress', recipe.id]);
    }
  }

  toggleFavorite(recipeId: string): void {
    const updated = this.recipeStorageService.toggleFavorite(recipeId);
    if (!updated) return;

    if (!updated.isFavorite) {
      this.recipes = this.recipes.filter((r) => r.id !== recipeId);
      return;
    }
    const index = this.recipes.findIndex((r) => r.id === recipeId);
    if (index >= 0) this.recipes[index] = updated;
  }

  delete(recipeId: string): void {
    const ok = this.recipeStorageService.deleteRecipe(recipeId);
    if (!ok) return;
    this.recipes = this.recipes.filter((r) => r.id !== recipeId);
  }
}
