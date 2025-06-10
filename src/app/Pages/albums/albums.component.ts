import { Component, OnInit } from '@angular/core';
import { AlbumsService, Album } from '../../Services/albums.service';
import { AuthService } from '../../Services/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from '../../Components/navbar/navbar.component';
import { AlbumModalComponent } from '../../Components/album-modal/album-modal.component';

@Component({
  selector: 'app-albums',
  standalone: true,
  imports: [CommonModule, FormsModule, NavbarComponent, AlbumModalComponent],
  templateUrl: './albums.component.html',
  styleUrl: './albums.component.css'
})
export class AlbumsComponent implements OnInit {
  albums: Album[] = [];
  loading = true;
  error = '';

  showAlbumModal = false;
  albumToEdit: Album | undefined = undefined;

  constructor(private albumsService: AlbumsService, public authService: AuthService) {}

  ngOnInit(): void {
    this.loadAlbums();
  }

  loadAlbums(): void {
    this.loading = true;
    this.albumsService.getAlbums().subscribe({
      next: (data) => {
        this.albums = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = err.message || 'Error al cargar los álbumes';
        this.loading = false;
      }
    });
  }




 onDeleteAlbum(album: Album) {
  if (!confirm(`¿Seguro que deseas eliminar el álbum "${album.title}"?`)) return;
  this.albumsService.deleteAlbum(album.id).subscribe({
    next: () => {
      this.loadAlbums(); // Recarga la lista después de eliminar
      this.showAlbumModal = false;
      this.albumToEdit = undefined;
    },
    error: (err) => {
      alert(err.message || 'Error al eliminar el álbum');
    }
  });
}

  onAddAlbum() {
    this.albumToEdit = undefined;
    this.showAlbumModal = true;
    this.loadAlbums();
  }

  onEditAlbum(album: Album) {
    this.albumToEdit = album;
    this.showAlbumModal = true;
  }

  onAlbumSaved(album: Album) {
    this.showAlbumModal = false;
    this.albumToEdit = undefined;
    this.loadAlbums(); // Recarga la lista de álbumes después de agregar/editar
  }

onModalClosed() {
  this.showAlbumModal = false;
  this.albumToEdit = undefined;
  this.loadAlbums(); // Refresca la lista al cerrar el modal
}

}