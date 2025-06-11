import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-song-info-modal',
  standalone: true,
  imports: [CommonModule], 
  templateUrl: './song-info-modal.component.html',
  styleUrl: './song-info-modal.component.css'
})
export class SongInfoModalComponent {
  @Input() song: any;
  @Output() close = new EventEmitter<void>();

  getImageUrl(photo: string): string {
    if (!photo) return 'assets/img/default-song.png';
    return `http://localhost:9001/images/songs/${photo}`;
  }
}