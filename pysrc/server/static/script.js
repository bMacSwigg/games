/**
 * Copyright 2021 Google LLC
 * Licensed under the Apache License, Version 2.0 (the `License`);
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an `AS IS` BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * Modified to be a simplified example of auth with the Library app.
 */

const config = {
  apiKey: "AIzaSyAMfrocCYIR9411DpaEYbvHI3mEweM1JwE",
  authDomain: "run-web.firebaseapp.com",
};
firebase.initializeApp(config);

// Watch for state change from sign in
function initApp() {
  firebase.auth().onAuthStateChanged(user => {
    if (user) {
      // User is signed in.
      document.getElementById('signInButton').innerText = 'Sign Out';
      document.getElementById('actions').style.display = '';
    } else {
      // No user is signed in.
      document.getElementById('signInButton').innerText = 'Sign in';
      document.getElementById('actions').style.display = 'none';
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

async function requestWrapper(doRequest) {
  if (firebase.auth().currentUser) {
    // Retrieve JWT to identify the user to the Identity Platform service.
    // Returns the current token if it has not expired. Otherwise, this will
    // refresh the token and return a new one.
    try {
      const token = await firebase.auth().currentUser.getIdToken();
      const response = await doRequest(token)
      return response.text();
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
  const text = await requestWrapper(token =>
    fetch(`/v0/games/baghchal/${game_id}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }));
  document.getElementById('getgame-output').innerText = text;
}

async function move() {
  const game_id = document.getElementById('move-id').value;
  const selected = [
    document.getElementById('pos1').value,
    document.getElementById('pos2').value
  ]
  const text = await requestWrapper(token =>
    fetch(`/v0/games/baghchal/${game_id}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(selected),
    }));
  document.getElementById('move-output').innerText = text;
}

async function listGames() {
  const text = await requestWrapper(token =>
    fetch('/v0/games/baghchal', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }));
  document.getElementById('listgames-output').innerText = text;
}

async function createGame() {
  const game = {
    tiger: document.getElementById('creategame-tiger').value,
    goat: document.getElementById('creategame-goat').value,
  }
  const text = await requestWrapper(token =>
    fetch('/v0/games/baghchal', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(game),
    }));
  document.getElementById('creategame-output').innerText = text;
}
