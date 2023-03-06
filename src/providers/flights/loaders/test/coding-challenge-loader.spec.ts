import { CACHE_MANAGER } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import { AxiosResponse, HttpStatusCode } from 'axios';
import { Cache } from 'cache-manager';

import { CodingChallengeLoader } from '@providers/flights/loaders/coding-challenge-loader';
import { CachedFlightsType, ParsedFlightType } from '@providers/flights/loaders/types';

import * as utilsRequestsModule from '@utils/requests';
import { HashTable } from '@utils/types';

import { AppModule } from '../../../../app.module';

const RESOURCE_SUCCESSFUL_RESPONSE: AxiosResponse = {
  config: undefined,
  statusText: '',
  status: HttpStatusCode.Ok,
  data: {
    flights: [
      {
        slices: [
          {
            origin_name: 'Schonefeld',
            destination_name: 'Stansted',
            departure_date_time_utc: '2019-08-08T20:25:00.000Z',
            arrival_date_time_utc: '2019-08-08T22:25:00.000Z',
            flight_number: '8545',
            duration: 120,
          },
          {
            origin_name: 'Stansted',
            destination_name: 'Schonefeld',
            departure_date_time_utc: '2019-08-10T06:50:00.000Z',
            arrival_date_time_utc: '2019-08-10T08:40:00.000Z',
            flight_number: '145',
            duration: 110,
          },
        ],
        price: 134.81,
      },
    ],
  },
  headers: { etag: 'testEtag' },
};

const PARSED_RESPONSE_DATA: HashTable<ParsedFlightType> = {
  '8545:2019-08-08T20:25:00.000Z<->145:2019-08-10T06:50:00.000Z': {
    departingFlight: {
      originName: 'Schonefeld',
      destinationName: 'Stansted',
      departureDateTimeUtc: '2019-08-08T20:25:00.000Z',
      arrivalDateTimeUtc: '2019-08-08T22:25:00.000Z',
      flightNumber: '8545',
      duration: 120,
    },
    returnFlight: {
      originName: 'Stansted',
      destinationName: 'Schonefeld',
      departureDateTimeUtc: '2019-08-10T06:50:00.000Z',
      arrivalDateTimeUtc: '2019-08-10T08:40:00.000Z',
      flightNumber: '145',
      duration: 110,
    },
    price: 134.81,
  },
};

const RESOURCE_SUCCESSFUL_RESPONSE_WITH_DIFFERENT_ETAG: AxiosResponse = {
  config: undefined,
  statusText: '',
  status: HttpStatusCode.Ok,
  data: {
    flights: [
      {
        slices: [
          {
            origin_name: 'Schonefeld',
            destination_name: 'Stansted',
            departure_date_time_utc: '2022-08-08T20:25:00.000Z',
            arrival_date_time_utc: '2022-08-08T22:25:00.000Z',
            flight_number: '18545',
            duration: 120,
          },
          {
            origin_name: 'Stansted',
            destination_name: 'Schonefeld',
            departure_date_time_utc: '2022-08-10T06:50:00.000Z',
            arrival_date_time_utc: '2022-08-10T08:40:00.000Z',
            flight_number: '1145',
            duration: 110,
          },
        ],
        price: 150.81,
      },
    ],
  },
  headers: { etag: 'testEtag2' },
};

const PARSED_RESPONSE_DATA_DIFFERENT_ETAG: HashTable<ParsedFlightType> = {
  '18545:2022-08-08T20:25:00.000Z<->1145:2022-08-10T06:50:00.000Z': {
    departingFlight: {
      originName: 'Schonefeld',
      destinationName: 'Stansted',
      departureDateTimeUtc: '2022-08-08T20:25:00.000Z',
      arrivalDateTimeUtc: '2022-08-08T22:25:00.000Z',
      flightNumber: '18545',
      duration: 120,
    },
    returnFlight: {
      originName: 'Stansted',
      destinationName: 'Schonefeld',
      departureDateTimeUtc: '2022-08-10T06:50:00.000Z',
      arrivalDateTimeUtc: '2022-08-10T08:40:00.000Z',
      flightNumber: '1145',
      duration: 110,
    },
    price: 150.81,
  },
};

const DATA_STORED_IN_CACHE: CachedFlightsType = {
  data: {
    testFlightUid: {
      departingFlight: {
        originName: 'Schonefeld',
        destinationName: 'Stansted',
        departureDateTimeUtc: '2019-08-08T04:30:00.000Z',
        arrivalDateTimeUtc: '2019-08-08T06:25:00.000Z',
        flightNumber: '144',
        duration: 115,
      },
      returnFlight: {
        originName: 'Schonefeld',
        destinationName: 'Stansted',
        departureDateTimeUtc: '2019-08-08T04:30:00.000Z',
        arrivalDateTimeUtc: '2019-08-08T06:25:00.000Z',
        flightNumber: '144',
        duration: 115,
      },
      price: 123,
    },
  },
  etag: 'testEtag',
};

describe('CodingChallengeLoader', () => {
  let cacheManagerMock: Cache;
  let configServiceMock: ConfigService;
  let codingChallengeLoader: CodingChallengeLoader;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    cacheManagerMock = moduleRef.get<Cache>(CACHE_MANAGER);
    configServiceMock = moduleRef.get<ConfigService>(ConfigService);
    codingChallengeLoader = new CodingChallengeLoader(cacheManagerMock, configServiceMock);
  });

  it('load - should return response data (cache empty)', async () => {
    jest.spyOn(cacheManagerMock, 'get').mockImplementation(() => Promise.resolve(undefined));
    jest.spyOn(cacheManagerMock, 'set').mockImplementation(() => Promise.resolve());
    jest
      .spyOn(utilsRequestsModule, 'makeRequest')
      .mockImplementation(() => Promise.resolve(RESOURCE_SUCCESSFUL_RESPONSE));

    expect(await codingChallengeLoader.load('example.com')).toEqual(PARSED_RESPONSE_DATA);
  });

  it('load - should return response data (different Etag)', async () => {
    jest.spyOn(cacheManagerMock, 'get').mockImplementation(() => Promise.resolve(DATA_STORED_IN_CACHE));
    jest.spyOn(cacheManagerMock, 'set').mockImplementation(() => Promise.resolve());
    jest
      .spyOn(utilsRequestsModule, 'makeRequest')
      .mockImplementation(() => Promise.resolve(RESOURCE_SUCCESSFUL_RESPONSE_WITH_DIFFERENT_ETAG));

    expect(await codingChallengeLoader.load('example.com')).toEqual(PARSED_RESPONSE_DATA_DIFFERENT_ETAG);
  });

  it('load - should return cached data (same Etag)', async () => {
    jest.spyOn(cacheManagerMock, 'get').mockImplementation(() => Promise.resolve(DATA_STORED_IN_CACHE));
    jest.spyOn(cacheManagerMock, 'set').mockImplementation(() => Promise.resolve());
    jest
      .spyOn(utilsRequestsModule, 'makeRequest')
      .mockImplementation(() => Promise.resolve(RESOURCE_SUCCESSFUL_RESPONSE));

    expect(await codingChallengeLoader.load('example.com')).toEqual(DATA_STORED_IN_CACHE.data);
  });
});
