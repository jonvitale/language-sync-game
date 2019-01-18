import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule }   from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { AngularFireAuthModule } from '@angular/fire/auth';

import { environment } from '../environments/environment';

import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { CreateSyncGameComponent } from './components/create-sync-game/create-sync-game.component';
import { CreateSyncGameDisplayComponent } from './components/create-sync-game/create-sync-game-display/create-sync-game-display.component';

import { TranscriptsService } from './shared/transcripts.service';
import { AudioService } from './shared/audio.service';
import { UsersService } from './shared/users.service';

@NgModule({
  declarations: [
    AppComponent,
    CreateSyncGameComponent,
    CreateSyncGameDisplayComponent,
    HomeComponent,
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
  ],
  providers: [
  	TranscriptsService,
  	AudioService,
    UsersService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
