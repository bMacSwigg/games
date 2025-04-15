import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { BaghChal } from './interfaces/baghchal';

@Injectable({
  providedIn: 'root'
})
export class GamesService {
  baseUrl = 'https://games-869102415447.us-central1.run.app';

  constructor(private auth: AuthService) { }

  async listGames(): Promise<BaghChal[]> {
    const token = await this.auth.token();
    if (!token) {
      console.log('no token');
      return [];
    }

    try {
      let url = `${this.baseUrl}/v0/games/baghchal`;
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        return response.json();
      } else {
        console.log(`Non-ok response when fetching games: ${response.status}`);
      }
    } catch (err) {
      console.log(`Error when fetching games: ${err}`);
    }
    return [];
  }

  async getGame(game_id: string): Promise<BaghChal | null> {
    const token = await this.auth.token();
    if (!token) {
      console.log('no token');
      return null;
    }

    try {
      let url = `${this.baseUrl}/v0/games/baghchal/${game_id}`;
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        return response.json();
      } else {
        console.log(`Non-ok response when fetching games: ${response.status}`);
      }
    } catch (err) {
      console.log(`Error when fetching games: ${err}`);
    }
    return null;
  }

  async move(selected: string[], game_id: string) {
    const token = await this.auth.token();
    if (!token) {
      console.log('no token');
      return null;
    }

    try {
      let url = `${this.baseUrl}/v0/games/baghchal/${game_id}`;
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({selected: selected}),
      });
      if (response.ok) {
        return response.json();
      } else {
        console.log(`Non-ok response when playing move: ${response.status}`);
      }
    } catch (err) {
      console.log(`Error when playing move: ${err}`);
    }
    return null;
  }

  async createGame(tiger: string, goat: string) {
    const token = await this.auth.token();
    if (!token) {
      console.log('no token');
      return null;
    }

    try {
      let url = `${this.baseUrl}/v0/games/baghchal`;
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({tiger: tiger, goat: goat}),
      });
      if (response.ok) {
        return response.text();
      } else {
        console.log(`Non-ok response when creating game: ${response.status}`);
      }
    } catch (err) {
      console.log(`Error when creating game: ${err}`);
    }
    return null;
  }
}
