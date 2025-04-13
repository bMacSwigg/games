import { Injectable, inject } from '@angular/core';
import { Auth, GoogleAuthProvider } from '@angular/fire/auth';
import { signInWithPopup, signOut, getIdToken } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private auth = inject(Auth);
  private provider = new GoogleAuthProvider();

  constructor() {
    this.provider.addScope('https://www.googleapis.com/auth/userinfo.email');
  }

  authenticated() {
    return !!this.auth.currentUser;
  }

  async signIn() {
    try {
      await signInWithPopup(this.auth, this.provider);
    } catch (err: any) {
      console.log(`Error during sign in: ${err.message}`);
      window.alert(`Sign in failed. Retry or check your browser logs.`);
    }
  }

  signOut() {
    signOut(this.auth)
      .then(result => {
        console.log('Signed out.');
      })
      .catch(err => {
        console.log(`Error during sign out: ${err.message}`);
        window.alert(`Sign out failed. Retry or check your browser logs.`);
      });
  }

  async token() {
    const user = this.auth.currentUser;
    if (!user) {
      return null;
    } else {
      return getIdToken(user);
    }
  }
}
