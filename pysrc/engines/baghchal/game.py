from pysrc.engines.baghchal.board import Board, Position, IllegalMove

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
        return False

    def winner(self) -> None | str:
        if self.captures >= 5:
            return 'TIGER'
        elif self._tigers_stuck():
            return 'GOAT'
        else:
            return None



def parse_position(p: str) -> Position:
    coords = p.split(',')
    return Position(int(coords[0]), int(coords[1]))

def goat_turn(game: BaghChal):
    if not game.can_goats_move():
        goat = input("GOAT: Where would you like to place a piece?")
        p = parse_position(goat)
        game.goat_place(p)
    else:
        s_in = input("GOAT: What piece would you like to move?")
        s = parse_position(s_in)
        t_in = input("GOAT: Where would you like to move that piece?")
        t = parse_position(t_in)
        game.goat_move(s, t)

def tiger_turn(game: BaghChal):
    s_in = input("TIGER: What piece would you like to move?")
    s = parse_position(s_in)
    t_in = input("TIGER: Where would you like to move that piece?")
    t = parse_position(t_in)

    if Board.connected(s, t):
        game.tiger_move(s, t)
    else:
        game.tiger_jump(s, t)

def run_cmd():
    game = BaghChal()
    while game.winner() is None:
        game.board.visualize()
        try:
            if game.is_goat_turn():
                goat_turn(game)
            else:
                tiger_turn(game)
        except IllegalMove as e:
            print(e)
    print("{} wins!".format(game.winner()))


if __name__ == '__main__':
    run_cmd()