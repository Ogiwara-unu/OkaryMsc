import { Component, OnInit } from '@angular/core';
import { SongService } from '../../Services/songs.service';
import { CommonModule } from '@angular/common';
import { RouterModule,  Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { NavbarComponent } from '../../Components/navbar/navbar.component';
import { FooterComponent } from '../../Components/footer/footer.component';
import { AuthService } from '../../Services/auth.service';
import { MatIconModule } from '@angular/material/icon';


@Component({
  selector: 'app-song-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatIconModule,
    NavbarComponent,
    FooterComponent
  ],
  templateUrl: './song-list.component.html',
  styleUrls: ['./song-list.component.css']
})
export class SongListComponent implements OnInit {
  songs: any[] = [];
  loading = true;
  error: string | null = null;
  isAdmin : boolean = false;

  constructor(
    private songService: SongService, 
    private router: Router,
    private authService: AuthService

  ) {}

  ngOnInit(): void {
    this.checkUserRole();
    this.loadSongs();
  }
  checkUserRole():void {
    this.isAdmin = this.authService.isAdmin();
  }

  loadSongs(): void {
    this.loading = true;
    this.error = null;
    
    this.songService.getSongs().subscribe({
      next: (songs) => {
        this.songs = songs;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Error al cargar las canciones';
        this.loading = false;
        console.error('Error:', err);
      }
    });
  }

  getImageUrl(photo: string): string {
    if (!photo) return 'assets/img/default-song.png';
    return `http://localhost:9001/images/songs/${photo}`;
  }

  formatDuration(duration: number): string {
    if (!duration) return '--:--';
    const minutes = Math.floor(duration / 60);
    const seconds = duration % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }
}