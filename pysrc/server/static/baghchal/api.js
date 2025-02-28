const DUMMY_BOARD = [["T"," "," ","G","T"],[" "," "," "," "," "],[" "," "," "," "," "],[" "," "," "," "," "],["T"," "," "," ","T"]]
const DUMMY_GAME = {board: DUMMY_BOARD, captures: 0, turn: 1, goat: "foo", id: "abcdefg", tiger: "bar", winner: null}

const LOCAL = false

async function requestWrapper(doRequest) {
    if (firebase.auth().currentUser) {
      // Retrieve JWT to identify the user to the Identity Platform service.
      // Returns the current token if it has not expired. Otherwise, this will
      // refresh the token and return a new one.
      try {
        const token = await firebase.auth().currentUser.getIdToken();
        return doRequest(token)
      } catch (err) {
        console.log(`Error calling API: ${err}`);
        window.alert('Something went wrong... Please try again!');
      }
    } else {
      window.alert('User not signed in.');
    }
  }

async function getGame(gid) {
  if (LOCAL) return DUMMY_GAME

  const resp = await requestWrapper(token =>
    fetch(`/v0/games/baghchal/${gid}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }));
  return resp.json()
}

async function move(selected, gid) {
  if (LOCAL) return DUMMY_GAME

  const resp = await requestWrapper(token =>
    fetch(`/v0/games/baghchal/${gid}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({selected: selected}),
    }));
  return resp.json()
}

async function listGames() {
  if (LOCAL) return [DUMMY_GAME,]

  const resp = await requestWrapper(token =>
    fetch('/v0/games/baghchal', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }));
  return resp.json()
}

async function createGame() {
  if (LOCAL) return DUMMY_GAME.id

  const game = {
    tiger: document.getElementById('creategame-tiger').value,
    goat: document.getElementById('creategame-goat').value,
  }
  const resp = await requestWrapper(token =>
    fetch('/v0/games/baghchal', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(game),
    }));
  return resp.text()
}
