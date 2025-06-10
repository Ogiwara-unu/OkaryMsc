import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateSongModalComponent } from './update-song-modal.component';

describe('UpdateSongModalComponent', () => {
  let component: UpdateSongModalComponent;
  let fixture: ComponentFixture<UpdateSongModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdateSongModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UpdateSongModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
