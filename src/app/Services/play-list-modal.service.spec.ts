import { TestBed } from '@angular/core/testing';

import { PlayListModalService } from './play-list-modal.service';

describe('PlayListModalService', () => {
  let service: PlayListModalService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PlayListModalService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
