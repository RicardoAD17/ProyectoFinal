import { TestBed } from '@angular/core/testing';

import { GymBdService } from './gym-bd.service';

describe('GymBdService', () => {
  let service: GymBdService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GymBdService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
