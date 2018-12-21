import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

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
    CreateSyncGameDisplayComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
  ],
  providers: [
  	TranscriptService,
  	AudioService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
