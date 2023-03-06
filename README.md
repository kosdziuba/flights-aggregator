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
- Docker - docker-compose

### Requirements:
- Development requirements: `node.js` version **19** and `Redis` - for external cache (or you can use `Memcache`)
- Local run requirements: requirements are the same as for **development**, or you can run it in docker (required to install `Docker` and `docker-compose`)

### Configuration:

The project configuration is based on ENV file. Just copy the [.env.example](.env.example) file and save it as `.env`.

You can also specify which `.env` file to read via setting the file path in `ENV_FILE_PATH` evn variable.

There also is config file for specifying flights providers - [flights-providers-config.yaml](flights-providers-config.yaml).

### Run:

- Development: run `npm run start:dev` this command will start the development server with hot reload.
- Docker: run `docker-compose build` and then `docker-compose up -d` (run `docker-compose down` if you would like to stop the project). This will build and run the project with Redis cache.
- Tests: run `npm run test`.
