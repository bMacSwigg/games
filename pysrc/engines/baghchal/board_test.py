import unittest

from pysrc.engines.baghchal.board import Board, Position, IllegalMove


class TestPosition(unittest.TestCase):

    def test_inbounds(self):
        # None of these raise errors
        Position(0,0)
        Position(2,3)
        Position(4, 4)

    def test_outofbounds(self):
        with self.assertRaises(RuntimeError):
            Position(-1, 0)
        with self.assertRaises(RuntimeError):
            Position(0, -1)
        with self.assertRaises(RuntimeError):
            Position(5, 2)
        with self.assertRaises(RuntimeError):
            Position(3, 5)

class TestBoard(unittest.TestCase):

    def test_connected(self):
        self.assertTrue(Board.connected(Position(0,0), Position(1, 0)))
        self.assertTrue(Board.connected(Position(0,0), Position(0, 1)))
        self.assertTrue(Board.connected(Position(0,0), Position(1, 1)))
        self.assertTrue(Board.connected(Position(0,2), Position(1, 3)))

    def test_notconnected(self):
        self.assertFalse(Board.connected(Position(0, 0), Position(0, 2)))
        self.assertFalse(Board.connected(Position(0, 0), Position(2, 0)))
        self.assertFalse(Board.connected(Position(0, 0), Position(0, 0)))
        self.assertFalse(Board.connected(Position(0, 1), Position(1, 0)))

    def test_connectedjump(self):
        self.assertTrue(Board.connected_jump(Position(0,0), Position(2, 0)))
        self.assertTrue(Board.connected_jump(Position(0,0), Position(0, 2)))
        self.assertTrue(Board.connected_jump(Position(0,0), Position(2, 2)))
        self.assertTrue(Board.connected_jump(Position(0,2), Position(2, 0)))

    def test_notconnectedjump(self):
        self.assertFalse(Board.connected_jump(Position(0, 0), Position(1, 0)))
        self.assertFalse(Board.connected_jump(Position(0, 0), Position(1, 2)))
        self.assertFalse(Board.connected_jump(Position(0, 0), Position(0, 3)))
        self.assertFalse(Board.connected_jump(Position(0, 0), Position(0, 0)))
        self.assertFalse(Board.connected_jump(Position(1, 0), Position(3, 2)))

    def test_setValid(self):
        b = Board()
        b.set(Position(0, 1), 'G')
        b.set(Position(2, 3), 'T')

    def test_setInvalid(self):
        b = Board()
        with self.assertRaises(IllegalMove):
            b.set(Position(0, 0), 'G')
        with self.assertRaises(IllegalMove):
            b.set(Position(2, 2), 'X')

    def test_clearValid(self):
        b = Board()
        b.clear(Position(0, 0))

    def test_clearInvalid(self):
        b = Board()
        with self.assertRaises(IllegalMove):
            b.clear(Position(3, 4))

    def test_get(self):
        b = Board()
        b.set(Position(0, 1), 'G')
        b.clear(Position(0, 4))
        self.assertEqual(b.get(Position(0, 0)), 'T')
        self.assertEqual(b.get(Position(0, 1)), 'G')
        self.assertIsNone(b.get(Position(0, 4)))
        self.assertIsNone(b.get(Position(2, 2)))


if __name__ == '__main__':
    unittest.main()
