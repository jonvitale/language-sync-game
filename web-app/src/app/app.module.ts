import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule }   from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { environment } from '../environments/environment';

import { AppRoutingModule } from './app-routing.module';
import { MaterialModule } from './material.module';

import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { WelcomeComponent } from './components/welcome/welcome.component';
import { PlayTimingComponent } from './components/activities/play-timing/play-timing.component';
import { CreateTimingComponent } from './components/activities/create-timing/create-timing.component';
// import { TranscriptDisplayComponent } from './components/activities/transcript-display/transcript-display.component';
import { GameDisplayComponent } from './components/activities/game-display/game-display.component';
import { GameControlsComponent } from './components/activities/game-controls/game-controls.component';

// import { CreateSyncGameComponent } from './components/create-sync-game/create-sync-game.component';
// import { CreateSyncGameDisplayComponent } from './components/create-sync-game/create-sync-game-display/create-sync-game-display.component';

import { TranscriptService } from './shared/transcript.service';
import { AudioService } from './shared/audio.service';
import { SpeechService } from './shared/speech.service';
import { UserService } from './shared/user.service';
// import { CreaseSyncGameMenuComponent } from './components/create-sync-game/crease-sync-game-menu/crease-sync-game-menu.component';

import { RemoveUnderscorePipe } from './shared/remove-underscore.pipe';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    // CreaseSyncGameMenuComponent,
    RemoveUnderscorePipe,
    WelcomeComponent,
    CreateTimingComponent,
    PlayTimingComponent,
    GameDisplayComponent,
    GameControlsComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    AngularFireModule.initializeApp(environment.firebase, 'language-sync-game'),
    AngularFirestoreModule, // imports firebase/firestore, only needed for database features
    AngularFireAuthModule, // imports firebase/auth, only needed for auth features,
    AngularFireStorageModule, // imports firebase/storage only needed for storage features
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
  ],
  providers: [
  	TranscriptService,
  	AudioService,
    UserService,
    SpeechService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
