import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RecipeResponse } from '../models/recipe.model';

@Injectable({ providedIn: 'root' })
export class SendDescriptionRecipeService {
  private readonly baseUrl = 'http://127.0.0.1:8000/api';

  constructor(private readonly http: HttpClient) {}

  generateRecipe(description: string): Observable<RecipeResponse> {
    return this.http.post<RecipeResponse>(`${this.baseUrl}/recipes/generate/`, {
      description: description.trim(),
    });
  }
}
