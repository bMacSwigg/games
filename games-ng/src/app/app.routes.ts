import { Routes } from '@angular/router';
import { BaghchalListComponent } from './baghchal-list/baghchal-list.component';
import { BaghchalGameComponent } from './baghchal-game/baghchal-game.component';
import { LandingComponent } from './landing/landing.component';
import { authGuard } from './auth.guard';

export const routes: Routes = [
  {
    path: '',
    component: LandingComponent,
    title: 'Welcome',
  },
  {
    path: 'baghchal',
    component: BaghchalListComponent,
    title: 'Bagh-Chal',
    canActivate: [authGuard],
  },
  {
    path: 'baghchal/:gameId',
    component: BaghchalGameComponent,
    title: 'Bagh-Chal Game',
    canActivate: [authGuard],
  },
];
