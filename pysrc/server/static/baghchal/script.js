
const config = {
  apiKey: "AIzaSyAMfrocCYIR9411DpaEYbvHI3mEweM1JwE",
  authDomain: "run-web.firebaseapp.com",
};
firebase.initializeApp(config);

// Display functions
function signInPage() {
  document.getElementById('signInButton').innerText = 'Sign In';
  document.getElementById('actions').style.display = 'none';
}

function mainPage() {
  document.getElementById('signInButton').innerText = 'Sign Out';
  document.getElementById('actions').style.display = '';
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


function drawBoard(ctx) {
  ctx.fillStyle = "#000000";
  // horizontal connections
  for (let y = 0; y < 5; y++) {
    const yoffset = y * 100 + 23
    for(let x = 0; x < 4; x++) {
      const xoffset = x * 100 + 55
      ctx.fillRect(xoffset, yoffset, 40, 4);
    }
  }

  // vertical connections
  for (let y = 0; y < 4; y++) {
    const yoffset = y * 100 + 55
    for(let x = 0; x < 5; x++) {
      const xoffset = x * 100 + 23
      ctx.fillRect(xoffset, yoffset, 4, 40);
    }
  }

  // diagonal connections
  for (let y = 0; y < 4; y++) {
    const yoffset = y * 100 + 73
    const ycenter = yoffset+2
    for(let x = 0; x < 4; x++) {
      const xoffset = x * 100 + 45
      const xcenter = xoffset+30

      ctx.translate(xcenter, ycenter)
      if ((x+y) % 2 === 0) {
        ctx.rotate(Math.PI / 4)
      } else {
        ctx.rotate(3 * Math.PI / 4)
      }
      ctx.translate(-xcenter, -ycenter)

      ctx.fillRect(xoffset, yoffset, 60, 4);

      ctx.resetTransform()
    }
  }
}

function drawPieces(ctx, board) {
  for(let y = 0; y < 5; y++) {
    const yoffset = y * 100 + 10
    for(let x = 0; x < 5; x++) {
      const piece = board[y][x]
      if (piece === ' ') {
        continue;
      }

      const xoffset = x * 100 + 10
      if (piece === 'T') {
        // draw tiger
        ctx.fillStyle = "#FF0000"
      } else if (piece === 'G') {
        // draw goat
        ctx.fillStyle = "#0000FF"
      }
      ctx.fillRect(xoffset, yoffset, 30, 30)
    }
  }
}

async function displayGame() {
  const game = await getGame()
  const ctx = document.getElementById("game").getContext("2d");

  drawBoard(ctx)
  drawPieces(ctx, game.json().get("board"))
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
  const game_id = document.getElementById('getgame-id').value;
  return requestWrapper(token =>
    fetch(`/v0/games/baghchal/${game_id}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }));
}

