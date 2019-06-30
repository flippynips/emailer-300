# Emailer 300

An abstraction between two different email service providers. If one of the services goes down, this service fails over to a different provider without affecting the user experience.

#### TODO
- e2e tests.
- server unit tests.
- specific email provider error handling and user feedback.


## Setup

The server is a NodeJS application tested for use with NodeJS 10 and upward.

First, install dependencies
``` bash
npm i
```


### Server

The server is built to './bin' and will statically serve the client application from './dist'.

The default server end point is 'localhost:80' and is configurable in
- ./server/Config.ts for server host address.
- ./src/Store.ts for server end point.

If using VSCode/VSCodium, the launch task 'Launch Server'
can be used to compile and debug the server.
The server can be manually built with typescript v3 and upward using;
``` bash
tsc --build ./server/tsconfig.json
```
Node can be used to run the server;
``` bash
node ./bin/server/Main.js
```


### Client

The server should be running to respond to API requests while debugging the client.
Serve the client with hot reload at localhost:8080 using;
``` bash
npm run dev
```

Build client to './dist' using;
``` bash
npm run build
```

### Tests

To run tests - the vue-cli-service is required
``` bash
npm i -D vue-cli-service
```

to run unit tests run
``` bash
npm run test:unit
```

linting can be tested using
``` bash
npm run lint
```
