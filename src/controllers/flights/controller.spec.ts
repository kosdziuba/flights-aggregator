import { Test, TestingModule } from '@nestjs/testing';

import { FlightsService } from '@providers/flights';

import { FlightsController } from './controller';

describe('FlightsController', () => {
  let flightsController: FlightsController;
  let flightsService: FlightsService;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [FlightsController],
      providers: [FlightsService],
    }).compile();

    flightsController = app.get<FlightsController>(FlightsController);
    flightsService = app.get<FlightsService>(FlightsService);
  });

  describe('root', () => {
    it('should return "{ data: {}, count: 0 }"', async () => {
      const result = { data: {}, count: 0 };
      jest.spyOn(flightsService, 'getFlights').mockImplementation(() => result);

      expect(await flightsController.findAll()).toEqual(result);
    });
  });
});
