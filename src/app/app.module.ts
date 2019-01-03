import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { AngularFireAuthModule } from '@angular/fire/auth';

import { environment } from '../environments/environment';

import { AppComponent } from './app.component';
import { GamesComponent } from './games/games.component';
import { CreateSyncGameComponent } from './games/create-sync-game/create-sync-game.component';
import { CreateSyncGameDisplayComponent } from './games/create-sync-game/create-sync-game-display/create-sync-game-display.component';

import { TranscriptService } from './transcript.service';
import { AudioService } from './audio.service';

@NgModule({
  declarations: [
    AppComponent,
    GamesComponent,
    CreateSyncGameComponent,
    CreateSyncGameDisplayComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AngularFireModule.initializeApp(environment.firebase, 'language-sync-game'),
    AngularFirestoreModule, // imports firebase/firestore, only needed for database features
    AngularFireAuthModule, // imports firebase/auth, only needed for auth features,
    AngularFireStorageModule // imports firebase/storage only needed for storage features
  ],
  providers: [
  	TranscriptService,
  	AudioService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
