import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { TimeoutError, timeout } from 'rxjs';
import { SendDescriptionRecipeService } from '../../services/send-description-recipe';
import { RecipeStorageService } from '../../services/recipe-storage.service';
import { RecipeResponse, RecipeStorage } from '../../models/recipe.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.html',
  styleUrl: './home.css',
  imports: [FormsModule, CommonModule],
})
export class HomeComponent implements OnInit {
  description = '';
  generatedRecipe: RecipeStorage | null = null;
  loading = false;
  error: string | null = null;

  constructor(
    private readonly recipeApiService: SendDescriptionRecipeService,
    private readonly recipeStorageService: RecipeStorageService,
    private readonly router: Router,
  ) {}

  ngOnInit(): void {
    this.generatedRecipe = this.recipeStorageService.getLastGeneratedRecipe();
  }

  gerar(): void {
    const normalizedDescription = this.description.trim();
    if (!normalizedDescription || this.loading) return;

    this.loading = true;
    this.error = null;

    this.recipeApiService
      .generateRecipe(normalizedDescription)
      .pipe(timeout(45000))
      .pipe(finalize(() => (this.loading = false)))
      .subscribe({
        next: (res: RecipeResponse) => {
          this.generatedRecipe = this.recipeStorageService.upsertGeneratedRecipe(res.recipe);
        },
        error: (err: unknown) => {
          if (err instanceof TimeoutError) {
            this.error = 'A IA demorou demais para responder. Tente novamente.';
            return;
          }
          this.error = 'Não foi possível gerar a receita. Tente novamente.';
        },
      });
  }

  startRecipe(): void {
    if (!this.generatedRecipe) return;
    const recipe = this.recipeStorageService.startRecipe(this.generatedRecipe.id);
    if (!recipe) return;
    this.router.navigate(['/in-progress', recipe.id]);
  }

  get canSubmit(): boolean {
    return !!this.description.trim() && !this.loading;
  }
}
