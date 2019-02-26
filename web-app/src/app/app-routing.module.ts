import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router'

import { WelcomeComponent } from './components/welcome/welcome.component';
import { HomeComponent } from './components/home/home.component';
import { CreateTimingComponent } from './components/activities/create-timing/create-timing.component';
import { PlayTimingComponent } from './components/activities/play-timing/play-timing.component';
// import { CreateSyncGameComponent } from './components/create-sync-game/create-sync-game.component';

const appRoutes: Routes = [
  { path: '', component: WelcomeComponent},
  { path: 'create-timing', component: CreateTimingComponent},
  { path: 'play-timing', component: PlayTimingComponent},
  { path: 'welcome', component: WelcomeComponent},
  { path: 'home', component: HomeComponent},
  { path: '**', redirectTo: ''}
];
  
@NgModule({
  imports: [
    RouterModule.forRoot(appRoutes, {useHash: false})
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {

}
