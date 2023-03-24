import { BaseFlightsProviderLoader } from '@providers/flights/loaders/base';
import { ParsedFlightType } from '@providers/flights/loaders/types';

export class CodingChallengeLoader extends BaseFlightsProviderLoader {
  protected parseResponseData(responseData: object): ParsedFlightType[] {
    // converting response data to the common format
    const flights = responseData['flights'] || [];
    return flights.map((entry) => this.makeFlights(entry));
  }

  private makeFlights(entry: object): ParsedFlightType {
    return {
      departingFlight: entry['slices'][0],
      returnFlight: entry['slices'][1],
      price: entry['price'],
    };
  }
}
