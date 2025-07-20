import { TestBed } from '@angular/core/testing';

import { PosthelpcaseService } from './posthelpcase.service';

describe('PosthelpcaseService', () => {
  let service: PosthelpcaseService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PosthelpcaseService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
