# Flights aggregator

This is the coding challenge for PowerUs Fullstack developer position

---

### Requirements:

- Your service should get flights from these 2 routes, merge them, remove duplicates, and send them to the client.
  https://coding-challenge.powerus.de/flight/source1
  https://coding-challenge.powerus.de/flight/source2
- As the identifier of the flight, the combination of flight numbers and dates can be used.
- The flight services above are not stable, i.e. it can sometimes fail or reply after a couple of seconds.
- The response time of your service shouldn't take longer than 1 second.
- Please write tests for your implementation.

### Details:

- Think that this service will be used in a flight search page for the customers.
- There will be many other flight source services added in the future.
- We can assume any information that we get from the endpoints remains valid for an hour.
- It is always better to show more results to the end-user as much as possible, but never invalid information.

### Expectations:

- Clean code, easy to read
- Scalability
- Simplicity
- Using NestJS as a framework and Jest for testing is a plus.

---

## Notes

### Technologies:

- TypeScript
- NestJS
- Jest
- Swagger
