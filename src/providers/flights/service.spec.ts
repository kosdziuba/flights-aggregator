/* eslint-disable @typescript-eslint/ban-ts-comment */
import { ConfigService } from '@nestjs/config';
import { Test } from '@nestjs/testing';

import { ParsedFlightType } from '@providers/flights/loaders/types';

import { HashTable } from '@utils/types';

import { AppModule } from '../../app.module';

import * as loadersModule from './loaders';
import { FlightsService } from './service';

const PROVIDERS_CONFIGURATION = [
  {
    loader: 'firstLoader',
    url: 'example',
    ttl: 0,
  },
  {
    loader: 'secondLoader',
    url: 'example',
    ttl: 0,
  },
];

const FIRST_RESULT: HashTable<ParsedFlightType> = {
  '8545:2019-08-08T20:25:00.000Z<->145:2019-08-10T06:50:00.000Z': {
    departingFlight: {
      originName: 'Schonefeld',
      destinationName: 'Stansted',
      departureDateTimeUtc: new Date('2019-08-08T20:25:00.000Z'),
      arrivalDateTimeUtc: new Date('2019-08-08T22:25:00.000Z'),
      flightNumber: '8545',
      duration: 120,
    },
    returnFlight: {
      originName: 'Stansted',
      destinationName: 'Schonefeld',
      departureDateTimeUtc: new Date('2019-08-10T06:50:00.000Z'),
      arrivalDateTimeUtc: new Date('2019-08-10T08:40:00.000Z'),
      flightNumber: '145',
      duration: 110,
    },
    price: 134.81,
  },
  '18545:2022-08-08T20:25:00.000Z<->1145:2022-08-10T06:50:00.000Z': {
    departingFlight: {
      originName: 'Schonefeld',
      destinationName: 'Stansted',
      departureDateTimeUtc: new Date('2022-08-08T20:25:00.000Z'),
      arrivalDateTimeUtc: new Date('2022-08-08T22:25:00.000Z'),
      flightNumber: '18545',
      duration: 120,
    },
    returnFlight: {
      originName: 'Stansted',
      destinationName: 'Schonefeld',
      departureDateTimeUtc: new Date('2022-08-10T06:50:00.000Z'),
      arrivalDateTimeUtc: new Date('2022-08-10T08:40:00.000Z'),
      flightNumber: '1145',
      duration: 110,
    },
    price: 150.81,
  },
};
const SECOND_RESULT: HashTable<ParsedFlightType> = {
  '18545:2022-08-08T20:25:00.000Z<->1145:2022-08-10T06:50:00.000Z': {
    departingFlight: {
      originName: 'Schonefeld',
      destinationName: 'Stansted',
      departureDateTimeUtc: new Date('2022-08-08T20:25:00.000Z'),
      arrivalDateTimeUtc: new Date('2022-08-08T22:25:00.000Z'),
      flightNumber: '18545',
      duration: 120,
    },
    returnFlight: {
      originName: 'Stansted',
      destinationName: 'Schonefeld',
      departureDateTimeUtc: new Date('2022-08-10T06:50:00.000Z'),
      arrivalDateTimeUtc: new Date('2022-08-10T08:40:00.000Z'),
      flightNumber: '1145',
      duration: 110,
    },
    price: 150.81,
  },
  '18500:2022-06-08T20:25:00.000Z<->1120:2022-06-10T06:50:00.000Z': {
    departingFlight: {
      originName: 'Schonefeld',
      destinationName: 'Stansted',
      departureDateTimeUtc: new Date('2022-06-08T20:25:00.000Z'),
      arrivalDateTimeUtc: new Date('2022-08-08T22:25:00.000Z'),
      flightNumber: '18500',
      duration: 120,
    },
    returnFlight: {
      originName: 'Stansted',
      destinationName: 'Schonefeld',
      departureDateTimeUtc: new Date('2022-06-10T06:50:00.000Z'),
      arrivalDateTimeUtc: new Date('2022-06-10T08:40:00.000Z'),
      flightNumber: '1120',
      duration: 110,
    },
    price: 150.81,
  },
};

const MERGED_FLIGHTS_LIST: ParsedFlightType[] = [
  {
    departingFlight: {
      originName: 'Schonefeld',
      destinationName: 'Stansted',
      departureDateTimeUtc: new Date('2019-08-08T20:25:00.000Z'),
      arrivalDateTimeUtc: new Date('2019-08-08T22:25:00.000Z'),
      flightNumber: '8545',
      duration: 120,
    },
    returnFlight: {
      originName: 'Stansted',
      destinationName: 'Schonefeld',
      departureDateTimeUtc: new Date('2019-08-10T06:50:00.000Z'),
      arrivalDateTimeUtc: new Date('2019-08-10T08:40:00.000Z'),
      flightNumber: '145',
      duration: 110,
    },
    price: 134.81,
  },
  {
    departingFlight: {
      originName: 'Schonefeld',
      destinationName: 'Stansted',
      departureDateTimeUtc: new Date('2022-08-08T20:25:00.000Z'),
      arrivalDateTimeUtc: new Date('2022-08-08T22:25:00.000Z'),
      flightNumber: '18545',
      duration: 120,
    },
    returnFlight: {
      originName: 'Stansted',
      destinationName: 'Schonefeld',
      departureDateTimeUtc: new Date('2022-08-10T06:50:00.000Z'),
      arrivalDateTimeUtc: new Date('2022-08-10T08:40:00.000Z'),
      flightNumber: '1145',
      duration: 110,
    },
    price: 150.81,
  },
  {
    departingFlight: {
      originName: 'Schonefeld',
      destinationName: 'Stansted',
      departureDateTimeUtc: new Date('2022-06-08T20:25:00.000Z'),
      arrivalDateTimeUtc: new Date('2022-08-08T22:25:00.000Z'),
      flightNumber: '18500',
      duration: 120,
    },
    returnFlight: {
      originName: 'Stansted',
      destinationName: 'Schonefeld',
      departureDateTimeUtc: new Date('2022-06-10T06:50:00.000Z'),
      arrivalDateTimeUtc: new Date('2022-06-10T08:40:00.000Z'),
      flightNumber: '1120',
      duration: 110,
    },
    price: 150.81,
  },
];
describe('FlightsService', () => {
  let configService: ConfigService;
  let flightsService: FlightsService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    configService = moduleRef.get<ConfigService>(ConfigService);
    flightsService = moduleRef.get<FlightsService>(FlightsService);
    jest.spyOn(loadersModule, 'getLoadersMap').mockImplementation(() => ({
      // @ts-ignore
      firstLoader: {
        load: jest.fn(() => Promise.resolve(FIRST_RESULT)),
      },
      // @ts-ignore
      secondLoader: {
        load: jest.fn(() => Promise.resolve(SECOND_RESULT)),
      },
    }));
    jest.spyOn(configService, 'get').mockImplementation(() => PROVIDERS_CONFIGURATION);
  });

  it('getFlights - should return merged flights list', async () => {
    expect(await flightsService.getFlights()).toEqual(MERGED_FLIGHTS_LIST);
  });
});
