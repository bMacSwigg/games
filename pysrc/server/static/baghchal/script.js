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
  controlPoller()

  const games = await listGames()
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
  game = null // force refresh
  await refreshGame()
  document.getElementById('play-game').style.display = '';
  controlPoller()
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
  game = null // force a refresh
  await refreshGame()
}

async function refreshGame() {
  const canvas = document.getElementById("game")
  const json = await getGame(game_id)

  if (!game || json.turn > game.turn) {
    game = new Game(canvas, json.board, json.turn, json.captures, json.winner)
    game.display()
    // on a successful update, reset the poller
    poller.reset()
  }
}

async function playMove() {
  if (game.winner !== null) {
    return
  }

  // TODO: add validation
  const selected = game.getSelected()
  const newState = await move(selected, game_id)
  game.updateState(newState.board, newState.turn, newState.captures, newState.winner)
  game.display()
}

async function newGame() {
  const id = await createGame()
  await gamePage(id)
}

let poller = new Poller(refreshGame)
function controlPoller() {
  canvas = document.getElementById("game")
  if (!document.hidden && canvas.checkVisibility()) {
    console.log('starting poller')
    poller.start()
  } else {
    console.log('stopping poller')
    poller.stop()
  }
}
document.addEventListener("visibilitychange", controlPoller);

