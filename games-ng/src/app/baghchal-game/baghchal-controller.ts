import { ElementRef } from '@angular/core';
import { BaghChal } from '../interfaces/baghchal';

export class BaghchalController {
  canvas: ElementRef;
  ctx: CanvasRenderingContext2D;
  displayed: boolean;
  game: BaghChal;
  selected: Set<string>;

  constructor(canvas: ElementRef, game: BaghChal) {
    this.canvas = canvas;
    this.ctx = canvas.nativeElement.getContext("2d");
    this.displayed = false;
    this.game = game
    this.selected = new Set();
  }

  display() {
    this.clear();
    this.#drawBoard();
    this.#drawSelected();
    this.#drawPieces();
    if (this.game.winner != null) {
      this.#drawWinner();
    }

    if (!this.displayed) {
      this.#addClickListener();
      this.displayed = true;
    }
  }

  clear() {
    this.ctx.clearRect(0, 0, 450, 450);
  }

  getSelected(): string[] {
    return Array.from(this.selected);
  }

  updateState(board: string[][], turn: number, captures: number, winner: 'TIGER'|'GOAT'|null = null) {
    this.game.board = board;
    this.game.turn = turn;
    this.game.captures = captures;
    this.game.winner = winner;
    this.selected.clear();
  }

  #addClickListener() {
    const self = this;

    // TODO: this is a lot of canvas.nativeElement... more Angular-y way to do this?
    this.canvas.nativeElement.addEventListener('click', function(event: any) {
      if (self.game.winner != null) {
        return;
      }

      const canvasLeft = self.canvas.nativeElement.offsetLeft + self.canvas.nativeElement.clientLeft;
      const canvasTop = self.canvas.nativeElement.offsetTop + self.canvas.nativeElement.clientTop;
      const x = event.pageX - canvasLeft;
      const y = event.pageY - canvasTop;

      if ((x % 100) <= 50 && (y % 100) <= 50) {
        const pos = Math.floor(x / 100) + ',' + Math.floor(y / 100);
        if (self.selected.has(pos)) {
          self.selected.delete(pos);
        } else {
          self.selected.add(pos);
        }
        self.display();
      }
    })
  }

  #drawBoard() {
    this.ctx.fillStyle = "#000000";
    // horizontal connections
    for (let y = 0; y < 5; y++) {
      const yoffset = y * 100 + 23;
      for(let x = 0; x < 4; x++) {
        const xoffset = x * 100 + 55;
        this.ctx.fillRect(xoffset, yoffset, 40, 4);
      }
    }

    // vertical connections
    for (let y = 0; y < 4; y++) {
      const yoffset = y * 100 + 55;
      for(let x = 0; x < 5; x++) {
        const xoffset = x * 100 + 23;
        this.ctx.fillRect(xoffset, yoffset, 4, 40);
      }
    }

    // diagonal connections
    for (let y = 0; y < 4; y++) {
      const yoffset = y * 100 + 73;
      const ycenter = yoffset+2;
      for(let x = 0; x < 4; x++) {
        const xoffset = x * 100 + 45;
        const xcenter = xoffset+30;

        this.ctx.translate(xcenter, ycenter);
        if ((x+y) % 2 === 0) {
          this.ctx.rotate(Math.PI / 4);
        } else {
          this.ctx.rotate(3 * Math.PI / 4);
        }
        this.ctx.translate(-xcenter, -ycenter);

        this.ctx.fillRect(xoffset, yoffset, 60, 4);

        this.ctx.resetTransform();
      }
    }
  }

  #drawPieces() {
    for(let y = 0; y < 5; y++) {
      const yoffset = y * 100 + 10;
      for(let x = 0; x < 5; x++) {
        const piece = this.game.board[y][x];
        if (piece === ' ') {
          continue;
        }

        const xoffset = x * 100 + 10;
        if (piece === 'T') {
          // draw tiger
          this.ctx.fillStyle = "#FF0000";
        } else if (piece === 'G') {
          // draw goat
          this.ctx.fillStyle = "#0000FF";
        }
        this.ctx.fillRect(xoffset, yoffset, 30, 30);
      }
    }
  }

  #drawSelected() {
    for (const pos of this.selected) {
      const xy = this.#parsePos(pos);
      this.ctx.fillStyle = "#666666";
      const xoffset = xy[0] * 100 + 6;
      const yoffset = xy[1] * 100 + 6;
      this.ctx.fillRect(xoffset, yoffset, 38, 38);
    }
  }

  #drawWinner() {
    this.ctx.globalAlpha = 0.6;
    this.ctx.fillStyle = "#FFFFFF";
    this.ctx.fillRect(0, 0, 450, 450);

    this.ctx.globalAlpha = 1.0;
    if (this.game.winner === 'TIGER') {
      this.ctx.fillStyle = "#FF0000";
    } else {
      this.ctx.fillStyle = "#0000FF";
    }
    this.ctx.textAlign = 'center';
    this.ctx.textBaseline = 'middle';
    this.ctx.font = '50px serif';
    this.ctx.fillText(`${this.game.winner} wins!`, 225, 225);
  }

  #parsePos(pos: string): number[] {
    const vals = pos.split(',');
    return [parseInt(vals[0]), parseInt(vals[1])];
  }
}
