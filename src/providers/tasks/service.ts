import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Cron } from '@nestjs/schedule';
import { Flight, FlightsInfo } from '@prisma/client';

import { FlightsService } from '@providers/flights';
import { ParsedFlightType } from '@providers/flights/loaders/types';
import { PrismaService } from '@providers/prisma';

import { HashTable } from '@utils/types';

@Injectable()
export class TasksService {
  constructor(
    private configService: ConfigService,
    private prisma: PrismaService,
    private flightsService: FlightsService,
  ) {}

  private readonly logger = new Logger(TasksService.name);

  @Cron('* * * * *')
  async refreshFlights(): Promise<void> {
    this.logger.debug('Refresh flights task started');
    // - Setting all entries to "unavailable" in order to remove entries that
    //   no longer appears in providers responses.
    // - During the refresh it sets `available` to `true` for returned flights
    await Promise.all([
      this.prisma.flightsInfo.updateMany({
        data: {
          available: false,
        },
      }),
      this.prisma.flight.updateMany({
        data: {
          available: false,
        },
      }),
    ]);

    for (const loader of this.flightsService.getFlightsLoaders()) {
      const flights = await loader.load();
      if (flights.length) await this.processFlights(flights);
    }

    // Removing entries that hasn't been returned by providers
    await this.prisma.flight.deleteMany({
      where: {
        available: false,
      },
    });
    await this.prisma.flightsInfo.deleteMany({
      where: {
        available: false,
      },
    });

    this.logger.debug('Refresh flights task finished');
  }

  async processFlights(flightsData: ParsedFlightType[]): Promise<void> {
    const flights: HashTable<Flight> = {};
    const flightsCombinations: HashTable<FlightsInfo> = {};

    for (const flightCombination of flightsData) {
      // making entries ids. Scheme: <flightNumber>:<departureDateTimeUtc>
      const departingFlightId =
        `${flightCombination.departingFlight.flightNumber}:` +
        flightCombination.departingFlight.departureDateTimeUtc.toJSON();
      const returnFlightId =
        `${flightCombination.returnFlight.flightNumber}:` +
        flightCombination.returnFlight.departureDateTimeUtc.toJSON();
      const flightCombinationId = `${departingFlightId}#${returnFlightId}`;

      // making and saving entries
      flights[departingFlightId] = { id: departingFlightId, available: true, ...flightCombination.departingFlight };
      flights[returnFlightId] = { id: returnFlightId, available: true, ...flightCombination.returnFlight };

      flightsCombinations[flightCombinationId] = {
        id: flightCombinationId,
        departingFlightId: departingFlightId,
        returnFlightId: departingFlightId,
        price: flightCombination.price,
        available: true,
      };
    }

    // updating `available` property to `true` for entries that already exist
    await this.prisma.flight.updateMany({
      where: {
        id: {
          in: Object.keys(flights),
        },
      },
      data: {
        available: true,
      },
    });
    // filtering entries that doesn't exist in the DB, and should be created
    const flightsToCreate = await this.prisma.flight
      .findMany({
        where: {
          id: { in: Object.keys(flights) },
        },
        select: {
          id: true,
        },
      })
      .then((response) => response.map((item) => item.id))
      .then((ids) => Object.values(flights).filter((flight) => !ids.includes(flight.id)));
    // creating new entries
    if (flightsToCreate.length) {
      await this.prisma.flight.createMany({
        data: flightsToCreate,
      });
    }

    // the same flow for flights combinations, updating existing -> getting new -> creating new
    await this.prisma.flightsInfo.updateMany({
      where: {
        id: {
          in: Object.keys(flightsCombinations),
        },
      },
      data: {
        available: true,
      },
    });

    const flightsCombinationsToCreate = await this.prisma.flightsInfo
      .findMany({
        where: {
          id: { in: Object.keys(flightsCombinations) },
        },
        select: {
          id: true,
        },
      })
      .then((response) => response.map((item) => item.id))
      .then((ids) => Object.values(flightsCombinations).filter((flight) => !ids.includes(flight.id)));

    if (flightsCombinationsToCreate.length) {
      await this.prisma.flightsInfo.createMany({
        data: flightsCombinationsToCreate,
      });
    }
  }
}
