import { TestBed } from '@angular/core/testing';

import { SongService } from './songs.service';

describe('SongsService', () => {
  let service: SongService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SongService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
