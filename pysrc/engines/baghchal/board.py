from pysrc.engines.baghchal.game_state import initial_board

class IllegalMove(RuntimeError): pass

class Position:
    def __init__(self, x: int, y: int):
        if x < 0 or x > 4:
            raise RuntimeError("illegal x position")
        if y < 0 or y > 4:
            raise RuntimeError("illegal y position")
        self.x = x
        self.y = y

    def __str__(self):
        return "({},{})".format(self.x, self.y)

class Board:

    def __init__(self, board: list[list[str]] = None):
        if board is None:
            self.board = initial_board()
        else:
            self.board = board

    def get(self, pos: Position) -> None | str:
        val = self.board[pos.y][pos.x]
        if val == ' ':
            return None
        else:
            return val

    def set(self, pos: Position, val: str):
        if val != 'T' and val != 'G':
            raise IllegalMove("{} is not a valid piece".format(val))

        if self.board[pos.y][pos.x] == ' ':
            self.board[pos.y][pos.x] = val
        else:
            raise IllegalMove("Cannot set {} to {}, already set to {}".format(
                                  pos, val, self.board[pos.x][pos.y]
                              ))

    def clear(self, pos: Position):
        if self.board[pos.y][pos.x] != ' ':
            self.board[pos.y][pos.x] = ' '
        else:
            raise IllegalMove("Cannot clear {}, already empty".format(pos))

    def visualize(self):
        print(self._visualize_row(0))
        print(r"|\|/|\|/|")
        print(self._visualize_row(1))
        print(r"|/|\|/|\|")
        print(self._visualize_row(2))
        print(r"|\|/|\|/|")
        print(self._visualize_row(3))
        print(r"|/|\|/|\|")
        print(self._visualize_row(4))

    def _visualize_row(self, r: int) -> str:
        row = self.board[r]
        return '-'.join(row)

    @classmethod
    def connected(cls, a: Position, b: Position) -> bool:
        xdiff = abs(a.x - b.x)
        ydiff = abs(a.y - b.y)
        if xdiff > 1 or ydiff > 1:
            # too far
            return False
        if xdiff == 0 and ydiff == 0:
            # no movement
            return False

        if xdiff == 1 and ydiff == 0:
            # horizontal movement
            return True
        if xdiff == 0 and ydiff == 1:
            # vertical movement
            return True

        # diagonal movement: only on even positions
        if (a.x + a.y) % 2 == 0:
            return True
        else:
            return False

    @classmethod
    def connected_jump(cls, a: Position, b: Position) -> bool:
        xdiff = abs(a.x - b.x)
        ydiff = abs(a.y - b.y)

        if xdiff != 0 and xdiff != 2:
            return False
        if ydiff != 0 and ydiff != 2:
            return False

        midpoint = Position((a.x+b.x)//2, (a.y+b.y)//2)
        return cls.connected(a, midpoint) and cls.connected(midpoint, b)
