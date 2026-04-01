import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { RecipeStorageService } from '../../services/recipe-storage.service';
import { RecipeStorage } from '../../models/recipe.model';

@Component({
  selector: 'app-finished-recipes',
  templateUrl: './finished-recipes.html',
  styleUrls: ['./finished-recipes.css'],
  imports: [CommonModule, FormsModule],
})
export class FinishedRecipesComponent implements OnInit {
  recipes: RecipeStorage[] = [];

  constructor(
    private readonly recipeStorageService: RecipeStorageService,
    private readonly router: Router,
  ) {}

  ngOnInit(): void {
    this.recipes = this.recipeStorageService.getByStatus('completed');
  }

  restart(recipeId: string): void {
    const updated = this.recipeStorageService.restartRecipe(recipeId);
    if (updated) this.router.navigate(['/in-progress', recipeId]);
  }
}
