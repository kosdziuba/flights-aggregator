import { Test, TestingModule } from '@nestjs/testing';

import { FlightsService } from '@providers/flights';
import { FlightsInfoWithRelations } from '@providers/flights/types';

import { AppModule } from '../../app.module';

import { FlightsController } from './controller';

const MERGED_FLIGHTS_LIST: FlightsInfoWithRelations[] = [
  {
    id: '8545:2019-08-08T20:25:00.000Z#145:2019-08-10T06:50:00.000Z',
    departingFlightId: '8545:2019-08-08T20:25:00.000Z',
    returnFlightId: '8545:2019-08-08T20:25:00.000Z',
    price: 134.81,
    available: true,
    departingFlight: {
      id: '8545:2019-08-08T20:25:00.000Z',
      originName: 'Schonefeld',
      destinationName: 'Stansted',
      departureDateTimeUtc: new Date('2019-08-08T20:25:00.000Z'),
      arrivalDateTimeUtc: new Date('2019-08-08T22:25:00.000Z'),
      flightNumber: '8545',
      duration: 120,
      available: true,
    },
    returnFlight: {
      id: '8545:2019-08-08T20:25:00.000Z',
      originName: 'Schonefeld',
      destinationName: 'Stansted',
      departureDateTimeUtc: new Date('2019-08-08T20:25:00.000Z'),
      arrivalDateTimeUtc: new Date('2019-08-08T22:25:00.000Z'),
      flightNumber: '8545',
      duration: 120,
      available: true,
    },
  },
  {
    id: '146:2019-08-08T16:00:00.000Z#145:2019-08-10T06:50:00.000Z',
    departingFlightId: '146:2019-08-08T16:00:00.000Z',
    returnFlightId: '146:2019-08-08T16:00:00.000Z',
    price: 147.9,
    available: true,
    departingFlight: {
      id: '146:2019-08-08T16:00:00.000Z',
      originName: 'Schonefeld',
      destinationName: 'Stansted',
      departureDateTimeUtc: new Date('2019-08-08T16:00:00.000Z'),
      arrivalDateTimeUtc: new Date('2019-08-08T17:55:00.000Z'),
      flightNumber: '146',
      duration: 115,
      available: true,
    },
    returnFlight: {
      id: '146:2019-08-08T16:00:00.000Z',
      originName: 'Schonefeld',
      destinationName: 'Stansted',
      departureDateTimeUtc: new Date('2019-08-08T16:00:00.000Z'),
      arrivalDateTimeUtc: new Date('2019-08-08T17:55:00.000Z'),
      flightNumber: '146',
      duration: 115,
      available: true,
    },
  },
];

describe('FlightsController', () => {
  let flightsController: FlightsController;
  let flightsService: FlightsService;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    flightsController = app.get<FlightsController>(FlightsController);
    flightsService = app.get<FlightsService>(FlightsService);
  });

  it('findAll - should return parsed results', async () => {
    jest
      .spyOn(flightsService, 'getFlights')
      .mockImplementation(() => Promise.resolve(MERGED_FLIGHTS_LIST as FlightsInfoWithRelations[]));
    expect(await flightsController.findAll()).toEqual({ data: MERGED_FLIGHTS_LIST, total: MERGED_FLIGHTS_LIST.length });
  });
});
