import unittest

from pysrc.engines.baghchal.game_state import GameState, deserialize


class TestGameState(unittest.TestCase):

    def test_defaults(self):
        gs = GameState()
        self.assertEqual(gs.board[0][0], 'T')
        self.assertEqual(gs.board[1][0], ' ')
        self.assertEqual(gs.turn, 0)
        self.assertEqual(gs.captures, 0)

    def test_serialize(self):
        board = [['G'] * 5 for i in range(5)]
        gs = GameState(board, 4, 2)

        res = gs.serialize()

        self.assertEqual(res, "4|2|GGGGG,GGGGG,GGGGG,GGGGG,GGGGG")

    def test_deserialize(self):
        s = "12|1|TTTTT,TTTTT,TTTTT,TTTTT,TTTTT"

        res = deserialize(s)

        self.assertEqual(res.board, [['T'] * 5 for i in range(5)])
        self.assertEqual(res.turn, 12)
        self.assertEqual(res.captures, 1)

    def test_roundtrip(self):
        board = [[' '] * 5 for i in range(5)]
        gs = GameState(board, 4, 2)

        res = deserialize(gs.serialize())

        self.assertEqual(res.board, gs.board)
        self.assertEqual(res.turn, gs.turn)
        self.assertEqual(res.captures, gs.captures)


if __name__ == '__main__':
    unittest.main()
