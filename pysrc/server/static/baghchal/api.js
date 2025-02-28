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
    return requestWrapper(token =>
      fetch(`/v0/games/baghchal/${gid}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }));
  }

  async function move(selected, gid) {
    return requestWrapper(token =>
      fetch(`/v0/games/baghchal/${gid}`, {
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
