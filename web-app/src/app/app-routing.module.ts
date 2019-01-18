import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router'

import { HomeComponent } from './components/home/home.component';
import { CreateSyncGameComponent } from './components/create-sync-game/create-sync-game.component';

const appRoutes: Routes = [
  { path: '', component: HomeComponent, data: {message:"Good Morning"}},
  { path: 'create-sync', component: CreateSyncGameComponent},
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
