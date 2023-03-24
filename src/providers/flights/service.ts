import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { BaseFlightsProviderLoader } from '@providers/flights/loaders/base';
import { FlightsInfoWithRelations } from '@providers/flights/types';
import { PrismaService } from '@providers/prisma';

import { LOADERS_MAP } from './loaders';

@Injectable()
export class FlightsService {
  constructor(private configService: ConfigService, private prisma: PrismaService) {}
  async getFlights(): Promise<FlightsInfoWithRelations[]> {
    return this.prisma.flightsInfo.findMany({
      include: {
        departingFlight: true,
        returnFlight: true,
      },
    });
  }

  getFlightsLoaders(): BaseFlightsProviderLoader[] {
    return this.configService
      .get('flightsProviders')
      .map((provider) => new LOADERS_MAP[provider.loader](provider.url, this.configService));
  }
}
