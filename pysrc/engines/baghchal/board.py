

class Position:
    def __init__(self, x, y):
        if (x < 0 or x > 4):
            raise RuntimeError("illegal x position")
        if (y < 0 or y > 4):
            raise RuntimeError("illegal y position")
        self.x = x
        self.y = y

class Board:

    board = [[' '] * 5 for i in range(5)]
    board[0][0] = 'T'
    board[4][0] = 'T'
    board[0][4] = 'T'
    board[4][4] = 'T'

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