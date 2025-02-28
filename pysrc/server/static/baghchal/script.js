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

  const games = sortGames(await listGames())
  const elem = document.getElementById('games-table')
  elem.innerHTML = "<tr><th>Tiger</th><th>Goat</th></tr>"
  for (const [i, game] of games.entries()) {
    const row = elem.insertRow(i+1)
    buildRow(row, game)
  }

  document.getElementById('list-games').style.display = '';
}

function buildRow(row, game) {
  if (game.winner === 'TIGER' || game.turn % 2 === 1) {
    // Tiger has won, or it's the Tiger's turn
    row.insertCell(0).innerHTML = `<i>${game.tiger}</i>`
    row.insertCell(1).innerHTML = game.goat
  } else {
    // Goat has won, or it's the Goat's turn
    row.insertCell(0).innerHTML = game.tiger
    row.insertCell(1).innerHTML = `<i>${game.goat}</i>`
  }

  if (game.winner == null) {
    row.insertCell(2).innerHTML = `<button onclick="gamePage('${game.id}')">Play!</button>`
  } else {
    row.insertCell(2).innerHTML = `<button onclick="gamePage('${game.id}')">View</button>`
  }

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

function sortGames(games) {
  const partitioned = games.reduce((acc, g) => {
    let type
    if (g.winner != null) {
      type = 'complete'
    } else {
      const turn = (g.turn % 2 === 0) ? 'goat' : 'tiger'
      // const user = firebase.auth().currentUser.email
      const user = 'foo'
      if (g[turn] === user) {
        type = 'your_turn'
      } else {
        type = 'waiting'
      }
    }
    acc[type].push(g)
    return acc
  }, {'complete': [], 'your_turn': [], 'waiting': []})
  return partitioned['your_turn'].concat(partitioned['waiting']).concat(partitioned['complete'])
}

async function displayGame() {
  game_id = document.getElementById('getgame-id').value;
  game = null // force a refresh
  await refreshGame()
}

async function refreshGame() {
  if (game && game.winner != null) {
    // don't bother refreshing: the game has ended
    return
  }

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
    poller.start()
  } else {
    poller.stop()
  }
}
document.addEventListener("visibilitychange", controlPoller);

