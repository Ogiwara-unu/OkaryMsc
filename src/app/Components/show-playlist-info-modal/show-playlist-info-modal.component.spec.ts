import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowPlaylistInfoModalComponent } from './show-playlist-info-modal.component';

describe('ShowPlaylistInfoModalComponent', () => {
  let component: ShowPlaylistInfoModalComponent;
  let fixture: ComponentFixture<ShowPlaylistInfoModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShowPlaylistInfoModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ShowPlaylistInfoModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
