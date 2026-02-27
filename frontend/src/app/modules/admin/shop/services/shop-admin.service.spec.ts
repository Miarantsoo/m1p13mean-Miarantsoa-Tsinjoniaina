import { TestBed } from '@angular/core/testing';

import { ShopAdminService } from './shop-admin.service';

describe('ShopAdminService', () => {
  let service: ShopAdminService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ShopAdminService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
