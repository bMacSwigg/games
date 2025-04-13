import { Routes } from '@angular/router';
import { BaghchalListComponent } from './baghchal-list/baghchal-list.component';
import { BaghchalGameComponent } from './baghchal-game/baghchal-game.component';

export const routes: Routes = [
  {
    path: '',
    component: BaghchalListComponent,
    title: 'Bagh-Chal',
  },
  {
    path: 'baghchal',
    component: BaghchalListComponent,
    title: 'Bagh-Chal',
  },
  {
    path: 'baghchal/:gameId',
    component: BaghchalGameComponent,
    title: 'Bagh-Chal Game',
  },
];
