import { Component, inject, Input, OnInit, ViewChild, ElementRef } from '@angular/core';
import { GamesService } from '../games.service';
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
  @ViewChild('game', { static: false }) canvas!: ElementRef;
  gamesList: Object[] = [];
  gamesService: GamesService = inject(GamesService);
  ctrl: BaghchalController | undefined;

  async ngOnInit() {
    const game = await this.gamesService.getGame(this.gameId);
    if (!game) {
      console.log("game not loaded");
      return;
    }
    this.ctrl = new BaghchalController(this.canvas, game.board, game.turn, game.captures, game.winner);
    this.ctrl.display();
  }
}
