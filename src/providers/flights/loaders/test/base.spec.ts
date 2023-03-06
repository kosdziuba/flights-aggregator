import { CACHE_MANAGER } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import { AxiosResponse, HttpStatusCode } from 'axios';
import { Cache } from 'cache-manager';

import { BaseFlightsProviderLoader } from '@providers/flights/loaders/base';
import { BaseCachedFlightsType } from '@providers/flights/loaders/types';

import * as utilsRequestsModule from '@utils/requests';

import { AppModule } from '../../../../app.module';

const RESOURCE_ERROR_RESPONSE = {
  status: HttpStatusCode.InternalServerError,
  data: {},
  headers: {},
};

const RESOURCE_SUCCESSFUL_RESPONSE = {
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
  headers: {},
};

const PARSED_RESPONSE_DATA = {
  flights: [
    {
      slices: [
        {
          originName: 'Schonefeld',
          destinationName: 'Stansted',
          departureDateTimeUtc: '2019-08-08T20:25:00.000Z',
          arrivalDateTimeUtc: '2019-08-08T22:25:00.000Z',
          flightNumber: '8545',
          duration: 120,
        },
        {
          originName: 'Stansted',
          destinationName: 'Schonefeld',
          departureDateTimeUtc: '2019-08-10T06:50:00.000Z',
          arrivalDateTimeUtc: '2019-08-10T08:40:00.000Z',
          flightNumber: '145',
          duration: 110,
        },
      ],
      price: 134.81,
    },
  ],
};

const DATA_STORED_IN_CACHE: BaseCachedFlightsType = {
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
};

describe('BaseFlightsProviderLoader', () => {
  let cacheManagerMock: Cache;
  let configServiceMock: ConfigService;
  let baseFlightsProviderLoader: BaseFlightsProviderLoader;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    cacheManagerMock = moduleRef.get<Cache>(CACHE_MANAGER, { strict: false });
    configServiceMock = moduleRef.get<ConfigService>(ConfigService);
    baseFlightsProviderLoader = new BaseFlightsProviderLoader(cacheManagerMock, configServiceMock);
  });

  it('load - empty cache and resource failed', async () => {
    jest.spyOn(cacheManagerMock, 'get').mockImplementation(() => Promise.resolve(undefined));
    jest
      .spyOn(utilsRequestsModule, 'makeRequest')
      .mockImplementation(() => Promise.resolve(RESOURCE_ERROR_RESPONSE as AxiosResponse));

    expect(await baseFlightsProviderLoader.load('example.com')).toEqual({});
  });

  it('load - should return data stored in cache', async () => {
    jest.spyOn(cacheManagerMock, 'get').mockImplementation(() => Promise.resolve(DATA_STORED_IN_CACHE));
    jest
      .spyOn(utilsRequestsModule, 'makeRequest')
      .mockImplementation(() => Promise.resolve(RESOURCE_ERROR_RESPONSE as AxiosResponse));

    expect(await baseFlightsProviderLoader.load('example.com')).toEqual(DATA_STORED_IN_CACHE.data);
  });

  it('load - should return response data', async () => {
    jest.spyOn(cacheManagerMock, 'get').mockImplementation(() => Promise.resolve(DATA_STORED_IN_CACHE));
    jest.spyOn(cacheManagerMock, 'set').mockImplementation(() => Promise.resolve());
    jest
      .spyOn(utilsRequestsModule, 'makeRequest')
      .mockImplementation(() => Promise.resolve(RESOURCE_SUCCESSFUL_RESPONSE as AxiosResponse));

    expect(await baseFlightsProviderLoader.load('example.com')).toEqual(PARSED_RESPONSE_DATA);
  });
});
