import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { RecipeStorageService } from '../../services/recipe-storage.service';
import { RecipeStorage } from '../../models/recipe.model';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-recipe-in-progress',
  templateUrl: './recipe-in-progress.html',
  styleUrl: './recipe-in-progress.css',
  imports: [CommonModule, FormsModule],
})
export class RecipeInProgressComponent implements OnInit {
  recipe: RecipeStorage | null = null;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly recipeStorageService: RecipeStorageService,
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) return;
    this.recipe = this.recipeStorageService.getRecipeById(id);
  }

  isChecked(index: number): boolean {
    return !!this.recipe?.stepsCompleted.includes(index);
  }

  toggleStep(index: number): void {
    if (!this.recipe) return;
    const updated = this.recipeStorageService.toggleStep(this.recipe.id, index);
    if (updated) this.recipe = updated;
  }

  get progress(): number {
    if (!this.recipe) return 0;
    return this.recipeStorageService.getProgressPercent(this.recipe);
  }

  finishRecipe(): void {
    if (!this.recipe || this.progress < 100) return;
    const updated = this.recipeStorageService.finishRecipe(this.recipe.id);
    if (updated) this.router.navigate(['/completed']);
  }
}
