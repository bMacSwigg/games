
class IllegalMove(RuntimeError): pass

class Position:
    def __init__(self, x, y):
        if x < 0 or x > 4:
            raise RuntimeError("illegal x position")
        if y < 0 or y > 4:
            raise RuntimeError("illegal y position")
        self.x = x
        self.y = y

    def __str__(self):
        return "({},{})".format(self.x, self.y)

class Board:

    def __init__(self):
        self.board = [[' '] * 5 for i in range(5)]
        self.board[0][0] = 'T'
        self.board[4][0] = 'T'
        self.board[0][4] = 'T'
        self.board[4][4] = 'T'

    def get(self, pos: Position) -> None | str:
        val = self.board[pos.x][pos.y]
        if val == ' ':
            return None
        else:
            return val

    def set(self, pos: Position, val: str):
        if val != 'T' and val != 'G':
            raise IllegalMove("{} is not a valid piece".format(val))

        if self.board[pos.x][pos.y] == ' ':
            self.board[pos.x][pos.y] = val
        else:
            raise IllegalMove("Cannot set {} to {}, already set to {}".format(
                                  pos, val, self.board[pos.x][pos.y]
                              ))

    def clear(self, pos: Position):
        if self.board[pos.x][pos.y] != ' ':
            self.board[pos.x][pos.y] = ' '
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
    def _connected(cls, a: Position, b: Position) -> bool:
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


b = Board()
b.visualize()