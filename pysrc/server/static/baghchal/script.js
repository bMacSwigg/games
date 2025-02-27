const config = {
  apiKey: "AIzaSyAMfrocCYIR9411DpaEYbvHI3mEweM1JwE",
  authDomain: "run-web.firebaseapp.com",
};
firebase.initializeApp(config);

let game, game_id

// Display functions
function signInPage() {
  document.getElementById('signInButton').innerText = 'Sign In';
  document.getElementById('list-games').style.display = 'none';
  document.getElementById('play-game').style.display = 'none';
}

async function mainPage() {
  document.getElementById('signInButton').innerText = 'Sign Out';
  document.getElementById('play-game').style.display = 'none';

  const games = await (await listGames()).json()
  const elem = document.getElementById('games-table')
  elem.innerHTML = "<tr><th>Tiger</th><th>Goat</th></tr>"
  for (const [i, game] of games.entries()) {
    const row = elem.insertRow(i+1)
    row.insertCell(0).innerHTML = game.tiger
    row.insertCell(1).innerHTML = game.goat
    row.insertCell(2).innerHTML = `<button onclick="gamePage('${game.id}')">Play!</button>`
  }

  document.getElementById('list-games').style.display = '';
}

async function gamePage(id) {
  document.getElementById('list-games').style.display = 'none';
  game_id = id
  await refreshGame()
  document.getElementById('play-game').style.display = '';
}

// Watch for state change from sign in
function initApp() {
  firebase.auth().onAuthStateChanged(user => {
    if (user) {
      // User is signed in.
      mainPage()
    } else {
      // No user is signed in.
      signInPage()
    }
  });
}
window.onload = function () {
  initApp();
};

function signIn() {
  const provider = new firebase.auth.GoogleAuthProvider();
  provider.addScope('https://www.googleapis.com/auth/userinfo.email');
  firebase
    .auth()
    .signInWithPopup(provider)
    .then(result => {
      // Returns the signed in user along with the provider's credential
      console.log(`${result.user.displayName} logged in.`);
    })
    .catch(err => {
      console.log(`Error during sign in: ${err.message}`);
      window.alert(`Sign in failed. Retry or check your browser logs.`);
    });
}

function signOut() {
  firebase
    .auth()
    .signOut()
    .then(result => {})
    .catch(err => {
      console.log(`Error during sign out: ${err.message}`);
      window.alert(`Sign out failed. Retry or check your browser logs.`);
    });
}

// Toggle Sign in/out button
function toggle() {
  if (!firebase.auth().currentUser) {
    signIn();
  } else {
    signOut();
  }
}

async function displayGame() {
  game_id = document.getElementById('getgame-id').value;
  await refreshGame()
}

async function refreshGame() {
  const canvas = document.getElementById("game")
  const json = await (await getGame()).json()

  game = new Game(canvas, json.board, json.turn, json.captures)
  game.display()
}

async function playMove() {
  // TODO: add validation
  const selected = game.getSelected()
  const newState = await (await move(selected)).json()
  game.updateState(newState.board, newState.turn, newState.captures)
  game.display()
}

async function newGame() {
  const id = await (await createGame()).text()
  await gamePage(id)
}

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

async function getGame() {
  return requestWrapper(token =>
    fetch(`/v0/games/baghchal/${game_id}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }));
}

async function move(selected) {
  return requestWrapper(token =>
    fetch(`/v0/games/baghchal/${game_id}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({selected: selected}),
    }));
}

async function listGames() {
  return requestWrapper(token =>
    fetch('/v0/games/baghchal', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }));
}

async function createGame() {
  const game = {
    tiger: document.getElementById('creategame-tiger').value,
    goat: document.getElementById('creategame-goat').value,
  }
  return requestWrapper(token =>
    fetch('/v0/games/baghchal', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(game),
    }));
}
