import { Component, inject, Input, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { AuthService } from '../auth.service';
import { GamesService } from '../games.service';
import { BaghChal } from '../interfaces/baghchal';
import { BaghchalController } from './baghchal-controller';

@Component({
  selector: 'app-baghchal-game',
  standalone: true,
  imports: [MatButtonModule, MatIconModule, RouterModule],
  templateUrl: './baghchal-game.component.html',
  styleUrl: './baghchal-game.component.css'
})
export class BaghchalGameComponent {
  @Input() gameId!: string;
  @ViewChild('canvas', { static: false }) canvas!: ElementRef;
  gamesList: Object[] = [];
  gamesService: GamesService = inject(GamesService);
  authService: AuthService = inject(AuthService);
  game: BaghChal | undefined;
  ctrl: BaghchalController | undefined;
  opponent: string | undefined;

  async ngOnInit() {
    const game = await this.gamesService.getGame(this.gameId);
    if (!game) {
      console.log("game not loaded");
      return;
    }
    this.game = game
    this.ctrl = new BaghchalController(this.canvas, game);
    this.ctrl.display();

    const user = await this.authService.user();
    if (game.tiger.toLowerCase() === game.goat.toLowerCase()) {
      this.opponent = "You are playing TIGER and GOAT against yourself";
    } else if (game.tiger.toLowerCase() === user?.toLowerCase()) {
      this.opponent = "You are the TIGER vs " + game.goat;
    } else {
      this.opponent = "You are the GOAT vs " + game.tiger;
    }
  }

  async playMove() {
    if (!this.game || !this.ctrl) {
      return;
    }
    if (this.game.winner !== null) {
      return;
    }

    // TODO: add validation
    const selected = this.ctrl.getSelected();
    const newState = await this.gamesService.move(selected, this.gameId);
    this.game.board = newState.board;
    this.game.turn = newState.turn;
    this.game.captures = newState.captures;
    this.game.winner = newState.winner;
    this.ctrl.clearSelected();
    this.ctrl.display();
  }

  async refresh() {
    if (this.game && this.game.winner != null) {
      // don't bother refreshing: the game has ended
      return
    }

    const newState = await this.gamesService.getGame(this.gameId);
    if (!newState) {
      console.log("failed to refresh game");
      return;
    }

    if (this.game && newState.turn > this.game.turn) {
      this.game.board = newState.board!;
      this.game.turn = newState.turn;
      this.game.captures = newState.captures;
      this.game.winner = newState.winner;
      this.ctrl!.clearSelected();
      this.ctrl!.display();
    }
  }

  turn(): string {
    if (!this.game) {
      return "";
    }

    if (this.game.turn % 2 === 0) {
      return "GOAT";
    } else {
      return "TIGER";
    }
  }
}
