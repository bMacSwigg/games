import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideAnimationsAsync(),
    provideFirebaseApp(() => initializeApp(
      {
        "projectId":"run-web",
        "appId":"1:869102415447:web:901c77dbd484546ffbbd12",
        "storageBucket":"run-web.firebasestorage.app",
        "locationId":"us-east4",
        "apiKey":"AIzaSyBSddNDgpm35qH-xkMJiDzxY8FeO5DP9sg",
        "authDomain":"run-web.firebaseapp.com",
        "messagingSenderId":"869102415447",
        "measurementId":"G-09CQHCF9VF"
      })),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
  ]
};
