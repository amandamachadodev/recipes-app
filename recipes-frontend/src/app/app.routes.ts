import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home';
import { FinishedRecipesComponent } from './components/finished-recipes/finished-recipes';
import { StartedRecipesComponent } from './components/started-recipes/started-recipes';
import { RecipeInProgressComponent } from './components/recipe-in-progress/recipe-in-progress';
import { FavoritesRecipesComponent } from './components/favorites-recipes/favorites-recipes';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'in-progress/:id', component: RecipeInProgressComponent },
  { path: 'in-progress', component: StartedRecipesComponent },
  { path: 'completed', component: FinishedRecipesComponent },
  { path: 'favorites', component: FavoritesRecipesComponent },
  { path: '**', redirectTo: '' },
];
