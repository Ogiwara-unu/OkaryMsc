import { Component, OnInit } from '@angular/core';
import { AlbumsService, Album } from '../../Services/albums.service';
import { AuthService } from '../../Services/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from '../../Components/navbar/navbar.component';
import { AlbumModalComponent } from '../../Components/album-modal/album-modal.component';
import { FooterComponent } from '../../Components/footer/footer.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-albums',
  standalone: true,
  imports: [CommonModule, FormsModule, NavbarComponent, AlbumModalComponent, FooterComponent],
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

  // Nuevo método para manejar las imágenes
  getImageUrl(photo: string | undefined): string {
    if (!photo) return 'assets/img/default-album.jpeg';
    return `http://localhost:9001/images/albums/${photo}`;
  }

  // Método para mostrar alertas (similar al de canciones)
  showAlert(type: 'success' | 'error', message: string) {
    Swal.fire({
      title: message,
      icon: type,
      timer: 4000,
      showConfirmButton: false
    });
  }

  onDeleteAlbum(album: Album) {
    if (!confirm(`¿Seguro que deseas eliminar el álbum "${album.title}"?`)) return;
    this.albumsService.deleteAlbum(album.id).subscribe({
      next: () => {
        this.loadAlbums();
        this.showAlert('success', 'Álbum eliminado correctamente');
        this.showAlbumModal = false;
        this.albumToEdit = undefined;
      },
      error: (err) => {
        this.showAlert('error', err.message || 'Error al eliminar el álbum');
      }
    });
  }

  onAddAlbum() {
    this.albumToEdit = undefined;
    this.showAlbumModal = true;
  }

  onEditAlbum(album: Album) {
    this.albumToEdit = album;
    this.showAlbumModal = true;
  }

  onAlbumSaved(album: Album) {
    this.showAlbumModal = false;
    this.albumToEdit = undefined;
    this.loadAlbums();
    this.showAlert('success', this.albumToEdit ? 'Álbum actualizado' : 'Álbum creado');
  }

  onModalClosed() {
    this.showAlbumModal = false;
    this.albumToEdit = undefined;
  }
}