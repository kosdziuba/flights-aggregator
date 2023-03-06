import { Test, TestingModule } from '@nestjs/testing';

import { FlightsService } from '@providers/flights';
import { ParsedFlightType } from '@providers/flights/loaders/types';

import { AppModule } from '../../app.module';

import { FlightsController } from './controller';

const MERGED_FLIGHTS_LIST: ParsedFlightType[] = [
  {
    departingFlight: {
      originName: 'originName',
      destinationName: 'destinationName',
      departureDateTimeUtc: new Date('2019-08-08T20:25:00.000Z'),
      arrivalDateTimeUtc: new Date('2019-08-08T22:25:00.000Z'),
      flightNumber: '8545',
      duration: 120,
    },
    returnFlight: {
      originName: 'originName',
      destinationName: 'destinationName',
      departureDateTimeUtc: new Date('2019-08-10T06:50:00.000Z'),
      arrivalDateTimeUtc: new Date('2019-08-10T08:40:00.000Z'),
      flightNumber: '145',
      duration: 110,
    },
    price: 134.81,
  },
  {
    departingFlight: {
      originName: 'destinationName',
      destinationName: 'originName',
      departureDateTimeUtc: new Date('2022-08-08T20:25:00.000Z'),
      arrivalDateTimeUtc: new Date('2022-08-08T22:25:00.000Z'),
      flightNumber: '18545',
      duration: 120,
    },
    returnFlight: {
      originName: 'originName',
      destinationName: 'destinationName',
      departureDateTimeUtc: new Date('2022-08-10T06:50:00.000Z'),
      arrivalDateTimeUtc: new Date('2022-08-10T08:40:00.000Z'),
      flightNumber: '1145',
      duration: 110,
    },
    price: 150.81,
  },
  {
    departingFlight: {
      originName: 'destinationName',
      destinationName: 'originName',
      departureDateTimeUtc: new Date('2022-06-08T20:25:00.000Z'),
      arrivalDateTimeUtc: new Date('2022-08-08T22:25:00.000Z'),
      flightNumber: '18500',
      duration: 120,
    },
    returnFlight: {
      originName: 'originName',
      destinationName: 'destinationName',
      departureDateTimeUtc: new Date('2022-06-10T06:50:00.000Z'),
      arrivalDateTimeUtc: new Date('2022-06-10T08:40:00.000Z'),
      flightNumber: '1120',
      duration: 110,
    },
    price: 150.81,
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
    jest.spyOn(flightsService, 'getFlights').mockImplementation(() => Promise.resolve(MERGED_FLIGHTS_LIST));
    expect(await flightsController.findAll()).toEqual({ data: MERGED_FLIGHTS_LIST, total: MERGED_FLIGHTS_LIST.length });
  });
});
