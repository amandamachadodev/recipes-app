import { TestBed } from '@angular/core/testing';

import { SendDescriptionRecipe } from './send-description-recipe';

describe('SendDescriptionRecipe', () => {
  let service: SendDescriptionRecipe;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SendDescriptionRecipe);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
