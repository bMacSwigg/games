import { Component, inject, Input, OnInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { AuthService } from '../auth.service';
import { GamesService } from '../games.service';
import { BaghChal } from '../interfaces/baghchal';
import { BaghchalInfoDialogComponent } from '../baghchal-info-dialog/baghchal-info-dialog.component';
import { BaghchalController } from './baghchal-controller';
import { Poller } from './poller';

@Component({
  selector: 'app-baghchal-game',
  standalone: true,
  imports: [MatButtonModule, MatIconModule, RouterModule],
  templateUrl: './baghchal-game.component.html',
  styleUrl: './baghchal-game.component.css'
})
export class BaghchalGameComponent implements OnDestroy {
  @Input() gameId!: string;
  @ViewChild('canvas', { static: false }) canvas!: ElementRef;
  gamesList: Object[] = [];
  gamesService: GamesService = inject(GamesService);
  authService: AuthService = inject(AuthService);
  game: BaghChal | undefined;
  ctrl: BaghchalController | undefined;
  poller: Poller | undefined;
  opponent: string | undefined;

  constructor(private dialog: MatDialog) {}

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

    this.poller = new Poller(() => this.refresh());
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

  async refresh(): Promise<boolean> {
    if (this.game && this.game.winner != null) {
      // don't bother refreshing: the game has ended
      return false;
    }

    const newState = await this.gamesService.getGame(this.gameId);
    if (!newState) {
      console.log("failed to refresh game");
      return false;
    }

    if (this.game && newState.turn > this.game.turn) {
      this.game.board = newState.board!;
      this.game.turn = newState.turn;
      this.game.captures = newState.captures;
      this.game.winner = newState.winner;
      this.ctrl!.clearSelected();
      this.ctrl!.display();
      // on a successful update, reset the poller
      return true;
    }

    return false;
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

  openInfoDialog() {
    this.dialog.open(BaghchalInfoDialogComponent, {});
  }

  ngOnDestroy() {
    this.poller?.stop();
  }
}
