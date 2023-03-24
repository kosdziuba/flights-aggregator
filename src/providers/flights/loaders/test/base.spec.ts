import { ConfigService } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import { AxiosResponse, HttpStatusCode } from 'axios';

import { BaseFlightsProviderLoader } from '@providers/flights/loaders/base';

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

describe('BaseFlightsProviderLoader', () => {
  let configServiceMock: ConfigService;
  let baseFlightsProviderLoader: BaseFlightsProviderLoader;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    configServiceMock = moduleRef.get<ConfigService>(ConfigService);
    baseFlightsProviderLoader = new BaseFlightsProviderLoader('example.com', configServiceMock);
  });

  it('load - resource failed', async () => {
    jest
      .spyOn(utilsRequestsModule, 'makeRequest')
      .mockImplementation(() => Promise.resolve(RESOURCE_ERROR_RESPONSE as AxiosResponse));

    expect(await baseFlightsProviderLoader.load()).toEqual([]);
  });

  it('load - should return response data', async () => {
    jest
      .spyOn(utilsRequestsModule, 'makeRequest')
      .mockImplementation(() => Promise.resolve(RESOURCE_SUCCESSFUL_RESPONSE as AxiosResponse));

    expect(await baseFlightsProviderLoader.load()).toEqual(PARSED_RESPONSE_DATA);
  });
});
