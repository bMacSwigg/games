class Game {

  constructor(canvas, board, turn = 0, captures = 0, winner = null) {
    this.canvas = canvas
    this.ctx = canvas.getContext("2d");
    this.displayed = false
    this.board = board
    this.turn = turn
    this.captures = captures
    this.winner = winner
    this.selected = new Set()
  }

  display() {
    this.clear()
    this.#drawBoard()
    this.#drawSelected()
    this.#drawPieces()
    this.#updateMetadata()
    if (this.winner != null) {
      this.#drawWinner()
    }

    if (!this.displayed) {
      this.#addClickListener()
      this.displayed = true
    }
  }

  clear() {
    this.ctx.clearRect(0, 0, 450, 450)
  }

  getSelected() {
    return [...this.selected]
  }

  updateState(board, turn, captures, winner = null) {
    this.board = board
    this.turn = turn
    this.captures = captures
    this.winner = winner
    this.selected.clear()
  }

  #addClickListener() {
    const self = this

    this.canvas.addEventListener('click', function(event) {
      if (self.winner != null) {
        return
      }

      const canvasLeft = self.canvas.offsetLeft + self.canvas.clientLeft
      const canvasTop = self.canvas.offsetTop + self.canvas.clientTop
      const x = event.pageX - canvasLeft
      const y = event.pageY - canvasTop

      if ((x % 100) <= 50 && (y % 100) <= 50) {
        const pos = Math.floor(x / 100) + ',' + Math.floor(y / 100)
        if (self.selected.has(pos)) {
          self.selected.delete(pos)
        } else {
          self.selected.add(pos)
        }
        self.display()
      }
    })
  }

  #drawBoard() {
    this.ctx.fillStyle = "#000000";
    // horizontal connections
    for (let y = 0; y < 5; y++) {
      const yoffset = y * 100 + 23
      for(let x = 0; x < 4; x++) {
        const xoffset = x * 100 + 55
        this.ctx.fillRect(xoffset, yoffset, 40, 4);
      }
    }

    // vertical connections
    for (let y = 0; y < 4; y++) {
      const yoffset = y * 100 + 55
      for(let x = 0; x < 5; x++) {
        const xoffset = x * 100 + 23
        this.ctx.fillRect(xoffset, yoffset, 4, 40);
      }
    }

    // diagonal connections
    for (let y = 0; y < 4; y++) {
      const yoffset = y * 100 + 73
      const ycenter = yoffset+2
      for(let x = 0; x < 4; x++) {
        const xoffset = x * 100 + 45
        const xcenter = xoffset+30

        this.ctx.translate(xcenter, ycenter)
        if ((x+y) % 2 === 0) {
          this.ctx.rotate(Math.PI / 4)
        } else {
          this.ctx.rotate(3 * Math.PI / 4)
        }
        this.ctx.translate(-xcenter, -ycenter)

        this.ctx.fillRect(xoffset, yoffset, 60, 4);

        this.ctx.resetTransform()
      }
    }
  }

  #drawPieces() {
    for(let y = 0; y < 5; y++) {
      const yoffset = y * 100 + 10
      for(let x = 0; x < 5; x++) {
        const piece = this.board[y][x]
        if (piece === ' ') {
          continue;
        }

        const xoffset = x * 100 + 10
        if (piece === 'T') {
          // draw tiger
          this.ctx.fillStyle = "#FF0000"
        } else if (piece === 'G') {
          // draw goat
          this.ctx.fillStyle = "#0000FF"
        }
        this.ctx.fillRect(xoffset, yoffset, 30, 30)
      }
    }
  }

  #updateMetadata() {
    const turn = document.getElementById("turn")
    if (this.turn % 2 === 0) {
      turn.innerText = "GOAT"
      turn.style.color = "#0000FF"
    } else {
      turn.innerText = "TIGER"
      turn.style.color = "#FF0000"
    }

    const captures = document.getElementById("captures")
    captures.innerText = this.captures
  }

  #drawSelected() {
    for (const pos of this.selected) {
      const xy = this.#parsePos(pos)
      this.ctx.fillStyle = "#666666"
      const xoffset = xy[0] * 100 + 6
      const yoffset = xy[1] * 100 + 6
      this.ctx.fillRect(xoffset, yoffset, 38, 38)
    }
  }

  #drawWinner() {
    this.ctx.globalAlpha = 0.3
    this.ctx.fillStyle = "#999999"
    this.ctx.fillRect(0, 0, 450, 450)

    this.ctx.globalAlpha = 1.0
    if (this.winner === 'TIGER') {
      this.ctx.fillStyle = "#FF0000"
    } else {
      this.ctx.fillStyle = "#0000FF"
    }
    this.ctx.textAlign = 'center'
    this.ctx.textBaseline = 'middle'
    this.ctx.fillText(`${this.winner} wins!`, 225, 225)
  }

  #parsePos(pos) {
    const vals = pos.split(',')
    return [parseInt(vals[0]), parseInt(vals[1])]
  }
}
