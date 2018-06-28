import { TestBed, inject } from '@angular/core/testing';

import { PortalService } from './portal.service';

describe('PortalService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PortalService]
    });
  });

  it('should be created', inject([PortalService], (service: PortalService) => {
    expect(service).toBeTruthy();
  }));
});
