var game

class Game {

  constructor(canvas, board) {
    this.canvas = canvas
    this.ctx = canvas.getContext("2d");
    this.board = board
    this.displayed = false
    this.turn = 0
    this.captures = 0
    this.selected = new Set()
  }

  display() {
    this.clear()
    this.#drawBoard()
    this.#drawSelected()
    this.#drawPieces()
    this.#updateMetadata()

    if (!this.displayed) {
      this.#addClickListener()
      this.displayed = true
    }
  }

  clear() {
    this.ctx.clearRect(0, 0, 450, 450)
  }

  // This method does very limited validation on the moves. Generally, this relies on
  // the API to tell it whether a move is valid or not, and what the consequences are.
  // The only check here is basically that the right number of spaces were selected.
  play() {
    if (this.turn % 2 === 0 && this.turn < 40) {
      // goat turn to place
      if (this.selected.size !== 1) {
        console.log("Must have exactly one square selected")
        return
      }

      const pos = this.#parsePos([...this.selected][0])
      this.board[pos[1]][pos[0]] = 'G'
    } else {
      // goat or tiger turn to move
      if (this.selected.size !== 2) {
        console.log("Must have exactly two squares selected")
        return
      }

      const pos1 = this.#parsePos([...this.selected][0])
      const pos2 = this.#parsePos([...this.selected][1])
      const tmp = this.board[pos1[1]][pos1[0]]
      this.board[pos1[1]][pos1[0]] = this.board[pos2[1]][pos2[0]]
      this.board[pos2[1]][pos2[0]] = tmp
    }

    // assuming successful, increment the turn counter
    this.turn++
    this.selected.clear()
    this.display()
  }

  #addClickListener() {
    const canvasLeft = this.canvas.offsetLeft + this.canvas.clientLeft
    const canvasTop = this.canvas.offsetTop + this.canvas.clientTop
    const self = this

    this.canvas.addEventListener('click', function(event) {
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

  #parsePos(pos) {
    const vals = pos.split(',')
    return [parseInt(vals[0]), parseInt(vals[1])]
  }
}

async function displayGame() {
  // const game = await getGame()
  const canvas = document.getElementById("game")
  // board = (await game.json()).board
  board = [["T","G"," "," ","T"],[" "," "," ","G","G"],[" "," "," "," "," "],[" "," "," "," "," "],["T"," "," "," ","T"]]

  game = new Game(canvas, board)
  game.display()
}
