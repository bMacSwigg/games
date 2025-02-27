from pysrc.engines.baghchal.board import Board, Position, IllegalMove, movable_positions, jumpable_positions

NUM_GOATS = 20

class BaghChal:

    def __init__(self):
        self.board = Board()
        self.turn = 0
        self.captures = 0

    def tiger_move(self, s: Position, t: Position):
        if self.is_goat_turn():
            raise IllegalMove("Not Tiger's turn")
        if not Board.connected(s, t):
            raise IllegalMove("Cannot move from {} to {}".format(s, t))
        if self.board.get(s) != 'T':
            raise IllegalMove("Position {} is not a Tiger".format(s))
        if self.board.get(t) is not None:
            raise IllegalMove("Position {} is not empty".format(t))

        self.board.clear(s)
        self.board.set(t, 'T')
        self.turn += 1

    def tiger_jump(self, s: Position, t: Position):
        if self.is_goat_turn():
            raise IllegalMove("Not Tiger's turn")
        if not Board.connected_jump(s, t):
            raise IllegalMove("Cannot jump from {} to {}".format(s, t))
        if self.board.get(s) != 'T':
            raise IllegalMove("Position {} is not a Tiger".format(s))
        if self.board.get(t) is not None:
            raise IllegalMove("Position {} is not empty".format(t))
        midpoint = Position((s.x+t.x)//2, (s.y+t.y)//2)
        if self.board.get(midpoint) != 'G':
            raise IllegalMove("Position {} is not a Goat".format(midpoint))

        self.board.clear(s)
        self.board.clear(midpoint)
        self.board.set(t, 'T')
        self.captures += 1
        self.turn += 1

    def goat_place(self, pos: Position):
        if not self.is_goat_turn():
            raise IllegalMove("Not Goat's turn")
        if self.can_goats_move():
            raise IllegalMove("No remaining Goats to place")
        if self.board.get(pos) is not None:
            raise IllegalMove("Position {} is not empty".format(pos))

        self.board.set(pos, 'G')
        self.turn += 1

    def goat_move(self, s: Position, t: Position):
        if not self.is_goat_turn():
            raise IllegalMove("Not Goat's turn")
        if not self.can_goats_move():
            raise IllegalMove("Goats cannot move until all Goats are placed")
        if not Board.connected(s, t):
            raise IllegalMove("Cannot move from {} to {}".format(s, t))
        if self.board.get(s) != 'G':
            raise IllegalMove("Position {} is not a Goat".format(s))
        if self.board.get(t) is not None:
            raise IllegalMove("Position {} is not empty".format(t))

        self.board.clear(s)
        self.board.set(t, 'G')
        self.turn += 1

    def is_goat_turn(self) -> bool:
        return self.turn % 2 == 0

    def can_goats_move(self) -> bool:
        return self.turn >= NUM_GOATS * 2

    def _tigers_stuck(self) -> bool:
        tigers = []
        for x in range(5):
            for y in range(5):
                pos = Position(x, y)
                if self.board.get(pos) == 'T':
                    tigers.append(pos)
        moves = {pos for tiger in tigers for pos in movable_positions(tiger)}
        jumps = {pos for tiger in tigers for pos in jumpable_positions(tiger)}

        for pos in moves.union(jumps):
            if self.board.get(pos) is None:
                return False
        return True

    def winner(self) -> None | str:
        if self.captures >= 5:
            return 'TIGER'
        elif self._tigers_stuck():
            return 'GOAT'
        else:
            return None
