import { Routes } from '@angular/router';
import { HomeComponent } from './Pages/home/home.component';
import { AboutUsComponent } from './Components/about-us/about-us.component';
import { ErrorComponent } from './Components/error/error.component';
import { SongListComponent } from './Pages/song-list/song-list.component';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'about-us', component: AboutUsComponent },
  { path: 'song-list', component: SongListComponent },
  { path: '**', component: ErrorComponent },
];