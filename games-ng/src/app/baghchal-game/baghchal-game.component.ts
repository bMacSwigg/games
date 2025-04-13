import { Component, inject, Input, OnInit, ViewChild, ElementRef } from '@angular/core';
import { GamesService } from '../games.service';
import { BaghChal } from '../interfaces/baghchal';
import { BaghchalController } from './baghchal-controller';

@Component({
  selector: 'app-baghchal-game',
  standalone: true,
  imports: [],
  templateUrl: './baghchal-game.component.html',
  styleUrl: './baghchal-game.component.css'
})
export class BaghchalGameComponent {
  @Input() gameId!: string;
  @ViewChild('canvas', { static: false }) canvas!: ElementRef;
  gamesList: Object[] = [];
  gamesService: GamesService = inject(GamesService);
  game: BaghChal | undefined;
  ctrl: BaghchalController | undefined;

  async ngOnInit() {
    const game = await this.gamesService.getGame(this.gameId);
    if (!game) {
      console.log("game not loaded");
      return;
    }
    this.game = game
    this.ctrl = new BaghchalController(this.canvas, game);
    this.ctrl.display();
  }

  turnColor(): string {
    if (!this.game) {
      return "";
    }

    if (this.game.turn % 2 === 0) {
      return "#0000FF";
    } else {
      return "#FF0000";
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
