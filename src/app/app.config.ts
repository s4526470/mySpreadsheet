import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { HttpClientModule } from '@angular/common/http';

const firebaseConfig = {
  apiKey: "AIzaSyCYduUg7UfudjgDCc01RkCbF2_5kbcPWoY",
  authDomain: "table-verify.firebaseapp.com",
  databaseURL: "https://table-verify-default-rtdb.firebaseio.com",
  projectId: "table-verify",
  storageBucket: "table-verify.appspot.com",
  messagingSenderId: "142646591406",
  appId: "1:142646591406:web:ce648453b21c4ada7e923f"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes), provideAnimationsAsync(), { provide: 'Firestore', useValue: firestore }, importProvidersFrom(HttpClientModule)]
};
