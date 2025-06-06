import { TestBed } from '@angular/core/testing';

import { ResumeSystemService } from './resume-system.service';

describe('ResumeSystemService', () => {
  let service: ResumeSystemService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ResumeSystemService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
