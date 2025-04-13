import { Component, inject } from '@angular/core';
import { GamesService } from '../games.service';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-baghchal-list',
  standalone: true,
  imports: [MatTableModule, MatButtonModule, RouterModule],
  templateUrl: './baghchal-list.component.html',
  styleUrl: './baghchal-list.component.css'
})
export class BaghchalListComponent {
  columnsToDisplay: string[] = ['tiger', 'goat', 'action'];
  gamesList: Object[] = [];
  gamesService: GamesService = inject(GamesService);

  constructor() {
    this.gamesService.listGames().then(games => {
      this.gamesList = games;
    });
  }
}
