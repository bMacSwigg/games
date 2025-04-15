import { Component, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';
import { GamesService } from '../games.service';
import { BaghchalNewgameDialogComponent } from '../baghchal-newgame-dialog/baghchal-newgame-dialog.component';

@Component({
  selector: 'app-baghchal-list',
  standalone: true,
  imports: [MatIconModule, MatTableModule, MatButtonModule, RouterModule],
  templateUrl: './baghchal-list.component.html',
  styleUrl: './baghchal-list.component.css'
})
export class BaghchalListComponent {
  columnsToDisplay: string[] = ['tiger', 'goat', 'action'];
  gamesList: Object[] = [];
  gamesService: GamesService = inject(GamesService);

  constructor(private dialog: MatDialog) {
    this.gamesService.listGames().then(games => {
      this.gamesList = games;
    });
  }

  openNewGameDialog() {
    const dialogRef = this.dialog.open(BaghchalNewgameDialogComponent, {});
  }
}
