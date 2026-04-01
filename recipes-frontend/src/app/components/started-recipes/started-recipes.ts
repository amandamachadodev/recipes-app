import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { RecipeStorageService } from '../../services/recipe-storage.service';
import { RecipeStorage } from '../../models/recipe.model';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-started-recipes',
  templateUrl: './started-recipes.html',
  styleUrls: ['./started-recipes.css'],
  imports: [CommonModule, FormsModule],
})
export class StartedRecipesComponent implements OnInit {
  recipes: RecipeStorage[] = [];

  constructor(
    private readonly recipeStorageService: RecipeStorageService,
    private readonly router: Router,
  ) {}

  ngOnInit(): void {
    this.recipes = this.recipeStorageService.getByStatus('in_progress');
  }

  continueRecipe(recipeId: string): void {
    this.router.navigate(['/in-progress', recipeId]);
  }

  progress(recipe: RecipeStorage): number {
    return this.recipeStorageService.getProgressPercent(recipe);
  }
}
