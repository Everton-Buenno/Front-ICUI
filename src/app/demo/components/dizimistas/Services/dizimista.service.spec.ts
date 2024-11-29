import { TestBed } from '@angular/core/testing';

import { DizimistaService } from './dizimista.service';

describe('DizimistaService', () => {
  let service: DizimistaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DizimistaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
