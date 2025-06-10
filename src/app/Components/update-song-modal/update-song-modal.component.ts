import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { SongService } from '../../Services/songs.service';
import { FileService } from '../../Services/file.service';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { Observable } from 'rxjs';
import { ErrorComponent } from '../error/error.component';

@Component({
  standalone: true,
  selector: 'app-update-song-modal',
  templateUrl: './update-song-modal.component.html',
  styleUrls: ['./update-song-modal.component.css'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
  ]
})
export class UpdateSongModalComponent implements OnInit {
  @Input() song: any;
  @Output() close = new EventEmitter<void>();
  @Output() updateSuccess = new EventEmitter<any>();

  form: FormGroup;
  isLoading = false;
  errorMessage: string | null = null;
  successMessage: string | null = null;
  selectedFile: File | null = null;
  previewUrl: string | ArrayBuffer | null = null;

  constructor(
    private fb: FormBuilder,
    private songService: SongService,
    private fileService: FileService
  ) {
    this.form = this.fb.group({
      title: ['', Validators.required],
      artist: ['', Validators.required],
      album: [''],
      genre: [''],
      duration: [0, [Validators.required, Validators.min(1)]],
      lyrics: [''],
      photo: ['']
    });
  }

  ngOnInit(): void {
    if (this.song) {
      this.form.patchValue(this.song);
      if (this.song.photo) {
        this.previewUrl = `http://localhost:9001/images/songs/${this.song.photo}`;
      }
    }
  }

  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    if (file) {
      this.selectedFile = file;

      const reader = new FileReader();
      reader.onload = () => {
        this.previewUrl = reader.result;
      };
      reader.readAsDataURL(file);
    }
  }

  removeImage(): void {
    this.selectedFile = null;
    this.previewUrl = this.song.photo 
      ? `http://localhost:9001/images/songs/${this.song.photo}`
      : null;
    this.form.patchValue({ photo: this.song.photo || '' });
  }

  submit(): void {
    if (this.form.valid && !this.isLoading) {
      this.isLoading = true;
      this.errorMessage = null;
      this.successMessage = null;

      const songData = this.form.value;

      const finish = (photoFilename?: string) => {
        if (photoFilename) songData.photo = photoFilename;

        this.songService.updateSong(this.song.id, songData).subscribe({
          next: (updatedSong) => {
            this.isLoading = false;
            this.successMessage = 'Canción actualizada correctamente';
            this.updateSuccess.emit(updatedSong);
            setTimeout(() => this.close.emit(), 1200);
          },
          error: (error) => {
            this.isLoading = false;
            this.errorMessage = error.message || 'Error al actualizar la canción';
          }
        });
      };

      // Si hay archivo seleccionado, súbelo primero
      if (this.selectedFile) {
        this.fileService.uploadSongImage(this.selectedFile).subscribe({
          next: (res) => {
            finish(res.filename);
          },
          error: (err) => {
            this.isLoading = false;
            this.errorMessage = err.message || 'Error al subir la imagen';
          }
        });
      } else {
        finish(this.song.photo);
      }
    }
  }

  onClose(): void {
    this.close.emit();
  }
}