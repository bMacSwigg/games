from engines.baghchal.board import IllegalMove, Position, Board
from engines.baghchal.game import BaghChal


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