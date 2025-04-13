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
        "apiKey":"AIzaSyBSddNDgpm35qH-xkMJiDzxY8FeO5DP9sg",
        "authDomain":"run-web.firebaseapp.com",
      })),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
  ]
};
