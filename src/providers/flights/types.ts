import { Prisma } from '@prisma/client';

const flightsInfoWithRelations = Prisma.validator<Prisma.FlightsInfoInclude>()({
  departingFlight: true,
  returnFlight: true,
});

export type FlightsInfoWithRelations = Prisma.FlightsInfoGetPayload<{ include: typeof flightsInfoWithRelations }>;
