import unittest

from pysrc.engines.baghchal.board import Board, Position

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
        self.assertTrue(Board._connected(Position(0,0), Position(1, 0)))
        self.assertTrue(Board._connected(Position(0,0), Position(0, 1)))
        self.assertTrue(Board._connected(Position(0,0), Position(1, 1)))
        self.assertTrue(Board._connected(Position(0,2), Position(1, 3)))

    def test_notconnected(self):
        self.assertFalse(Board._connected(Position(0, 0), Position(0, 2)))
        self.assertFalse(Board._connected(Position(0, 0), Position(2, 0)))
        self.assertFalse(Board._connected(Position(0, 0), Position(0, 0)))
        self.assertFalse(Board._connected(Position(0, 1), Position(1, 0)))


if __name__ == '__main__':
    unittest.main()
