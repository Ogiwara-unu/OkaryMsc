import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddSongModalComponent } from './add-song-modal.component';

describe('AddSongModalComponent', () => {
  let component: AddSongModalComponent;
  let fixture: ComponentFixture<AddSongModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddSongModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddSongModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
