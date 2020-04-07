import { TestBed } from '@angular/core/testing';

import { ImgFastService } from './img-fast.service';

describe('ImgFastService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ImgFastService = TestBed.get(ImgFastService);
    expect(service).toBeTruthy();
  });
});
