import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { HttpClientModule } from '@angular/common/http';
// Importaciones de AngularFire
import { provideFirebaseApp, initializeApp, getApp } from '@angular/fire/app';
import { provideFirestore, getFirestore, connectFirestoreEmulator } from '@angular/fire/firestore';
import { getStorage, provideStorage, connectStorageEmulator } from '@angular/fire/storage';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { environment } from './environments/environment';
import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';
import { ComponentsModule } from './components/components.module';
import { FrontEndLayoutComponent } from './layouts/frontend-layout/frontend-layout.component';

@NgModule({
  declarations: [
    AppComponent,
    AdminLayoutComponent,
    FrontEndLayoutComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    ComponentsModule,
    // Añade la inicialización de Firebase y Firestore aquí
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideFirestore(() => {
      const firestore = getFirestore();
      if (!environment.production) { // Si no estás en producción, conecta al emulador
        connectFirestoreEmulator(firestore, 'localhost', 8081);
      }
      return firestore;
    }),
    provideStorage(() => {
      const storage = getStorage(getApp()); 
      if (!environment.production) { // Si no estás en producción, conecta al emulador de Storage
        connectStorageEmulator(storage, 'localhost', 9199);
      }
      return storage;
    })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
