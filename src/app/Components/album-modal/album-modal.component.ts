import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AlbumsService, Album } from '../../Services/albums.service';

@Component({
  selector: 'app-album-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './album-modal.component.html',
  styleUrls: ['../album-modal/album-modal.component.css']
})
export class AlbumModalComponent implements OnInit {
  @Input() album?: Album;
  @Output() close = new EventEmitter<void>();
  @Output() saved = new EventEmitter<Album>();
  albumPhotos: string[] = [];

  form: FormGroup;
  isLoading = false;
  errorMessage: string | null = null;
  successMessage: string | null = null;
  selectedFile: File | null = null;
  previewUrl: string | null = null;

  get isEditMode() {
    return !!this.album;
  }

  constructor(
    private fb: FormBuilder,
    private albumsService: AlbumsService
  ) {
    this.form = this.fb.group({
      title: ['', Validators.required],
      artist: ['', Validators.required],
      year: [null],
      genre: [''],
      photo: ['']
    });
  }

  ngOnInit() {
    if (this.album) {
      this.form.patchValue(this.album);
      if (this.album.photo) {
        this.previewUrl = null; // Mostrará la portada actual si no hay nueva seleccionada
      }
    }

  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];

      // Previsualización
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.previewUrl = e.target.result;
      };
      reader.readAsDataURL(this.selectedFile);
    }
  }

  submit() {
    if (this.form.valid && !this.isLoading) {
      this.isLoading = true;
      this.errorMessage = null;

      const albumData = this.form.value;

      const finish = (photoFilename?: string) => {
        if (photoFilename) albumData.photo = photoFilename;

        if (this.isEditMode && this.album) {
          this.albumsService.updateAlbum(this.album.id, albumData).subscribe({
            next: (updated) => {
              this.isLoading = false;
              this.successMessage = 'Álbum actualizado correctamente';
              this.saved.emit(updated);
              setTimeout(() => this.close.emit(), 1200);
            },
            error: (error) => {
              this.isLoading = false;
              this.errorMessage = error.message || 'Error al actualizar el álbum';
            }
          });
        } else {
          this.albumsService.createAlbum(albumData).subscribe({
            next: (created) => {
              this.isLoading = false;
              this.successMessage = 'Álbum agregado correctamente';
              this.saved.emit(created);
              setTimeout(() => this.close.emit(), 1200);
            },
            error: (error) => {
              this.isLoading = false;
              this.errorMessage = error.message || 'Error al agregar el álbum';
            }
          });
        }
      };

      // Si hay archivo seleccionado, súbelo primero
      if (this.selectedFile) {
        this.albumsService.uploadAlbumPhoto(this.selectedFile).subscribe({
          next: (res) => {
            finish(res.filename);
          },
          error: (err) => {
            this.isLoading = false;
            this.errorMessage = err.message || 'Error al subir la imagen';
          }
        });
      } else {
        finish();
      }
    }
  }

deleteAlbum() {
  if (!this.album) return;
  if (!confirm('¿Seguro que deseas eliminar este álbum?')) return;
  this.isLoading = true;
  this.errorMessage = null;
  this.albumsService.deleteAlbum(this.album.id).subscribe({
    next: () => {
      this.isLoading = false;
      this.successMessage = 'Álbum eliminado correctamente';
      this.saved.emit(); // Esto hará que onAlbumSaved se ejecute y recargue la lista
      setTimeout(() => this.close.emit(), 1200);
    },
    error: (error) => {
      this.isLoading = false;
      this.errorMessage = error.message || 'Error al eliminar el álbum';
    }
  });
}

}