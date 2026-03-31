import { Component, OnInit } from '@angular/core';
import { Receita, RecipeResponse, SendDescriptionRecipeService } from '../../services/send-description-recipe';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { finalize } from 'rxjs/operators';
import { TimeoutError, timeout } from 'rxjs';
import { RecipeStorageService } from '../../services/recipe-storage.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.html',
  styleUrl: './home.css',
  imports: [FormsModule, CommonModule]
})
export class HomeComponent implements OnInit {
  descricao = '';
  receitaGerada: Receita | null = null;
  loading = false;
  error: string | null = null;
  ingredientesChecked: boolean[] = [];
  passosChecked: boolean[] = [];

  constructor(
    private readonly recipeApiService: SendDescriptionRecipeService,
    private readonly recipeStorageService: RecipeStorageService
  ) {}

  ngOnInit(): void {
    const savedRecipe = this.recipeStorageService.getLastRecipe();
    if (savedRecipe) {
      this.setRecipe(savedRecipe);
    }
  }

  gerar(): void {
    const normalizedDescription = this.descricao.trim();
    if (!normalizedDescription || this.loading) return;

    this.loading = true;
    this.error = null;
    this.receitaGerada = null;
  
    this.recipeApiService
      .gerarReceita(normalizedDescription)
      .pipe(timeout(45000))
      .pipe(finalize(() => (this.loading = false)))
      .subscribe({
        next: (res: RecipeResponse) => {
          this.setRecipe(res.receita);
          this.recipeStorageService.saveLastRecipe(res.receita);
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

  get canSubmit(): boolean {
    return !!this.descricao.trim() && !this.loading;
  }

  private setRecipe(recipe: Receita): void {
    this.receitaGerada = recipe;
    this.ingredientesChecked = this.createUncheckedList(recipe.ingredientes.length);
    this.passosChecked = this.createUncheckedList(recipe.passos.length);
  }

  private createUncheckedList(size: number): boolean[] {
    return Array.from({ length: size }, () => false);
  }
}