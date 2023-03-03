import { Test, TestingModule } from '@nestjs/testing';

import { FlightsService } from './service';

describe('FlightsService', () => {
  let flightsService: FlightsService;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [FlightsService],
    }).compile();

    flightsService = moduleRef.get<FlightsService>(FlightsService);
  });

  describe('root', () => {
    it('should return "Flights list"', () => {
      expect(flightsService.getFlights()).toEqual({ data: {}, count: 0 });
    });
  });
});
