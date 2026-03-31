import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Receita {
  titulo: string;
  porcoes: string;
  tempo_preparo: string;
  ingredientes: string[];
  passos: string[];
}

export interface RecipeResponse {
  receita: Receita;
}

@Injectable({ providedIn: 'root' })
export class SendDescriptionRecipeService {
  private readonly baseUrl = 'http://127.0.0.1:8000/api';

  constructor(private readonly http: HttpClient) {}

  gerarReceita(descricao: string): Observable<RecipeResponse> {
    return this.http.post<RecipeResponse>(
      `${this.baseUrl}/receitas/gerar/`,
      { descricao: descricao.trim() }
    );
  }
}