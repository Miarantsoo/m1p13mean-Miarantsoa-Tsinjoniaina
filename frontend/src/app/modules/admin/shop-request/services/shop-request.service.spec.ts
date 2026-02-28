import { TestBed } from '@angular/core/testing';

import { ShopRequestService } from './shop-request.service';

describe('ShopRequestService', () => {
  let service: ShopRequestService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ShopRequestService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
