def _initial_board() -> list[list[str]]:
    board = [[' '] * 5 for i in range(5)]
    board[0][0] = 'T'
    board[4][0] = 'T'
    board[0][4] = 'T'
    board[4][4] = 'T'
    return board

class GameState:

    def __init__(self, board: list[list[str]] = None, turn: int = 0, captured: int = 0):
        if board is None:
            board = _initial_board()
        self.board = board
        self.turn = turn
        self.captured = captured

    def serialize(self) -> str:
        board_str = ','.join(list(map(''.join, self.board)))
        return "{}|{}|{}".format(self.turn, self.captured, board_str)

def deserialize(s: str) -> GameState:
    parts = s.split('|')
    turn = int(parts[0])
    captured = int(parts[1])
    board = list(map(lambda r: list(r), parts[2].split(',')))
    return GameState(board, turn, captured)
