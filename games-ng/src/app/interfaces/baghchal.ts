export interface BaghChal {
  id: string;
  board: string[][]; // 2d array of game board
  turn: number; // turn 0 is the first turn (Goat)
  captures: number; // how many goats the Tiger has captured
  tiger: string; // email address of Tiger
  goat: string; // email address of Goat
  winner: 'TIGER' | 'GOAT' | null;
  complete: boolean; // winner != null
}
