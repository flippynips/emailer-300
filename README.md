# Emailer 300

An abstraction between two different email service providers with a basic web UI. If one of the services is not available, this service fails over to a different provider without affecting the user experience.

#### TODO
- e2e tests.
- server unit tests.
- specific email provider error handling and user feedback.
- complete minification of client application.
- add more email providers.

## Setup

Testing, developing and building requires dependencies. To install dependencies using npm run;
``` bash
npm i
```

### Server

The server is a NodeJS application tested for use with NodeJS 10 and upward. It is built to './bin' and will statically serve built client application files in './dist' as well as respond to client API requests.

The default server end point is 'localhost:80' and is configurable in
- ./server/Config.ts for server host address.
- ./src/Store.ts for server end point.

If you're using VSCode/VSCodium, the launch task 'Launch Server'
can be used to compile and debug the server.
The server can be manually built with typescript v3 and upward using;
``` bash
tsc --build ./server/tsconfig.json
```
Use Node to run the server in the build directory;
``` bash
node ./bin/server/Main.js
```

Entering 'quit' into the server command-line application will gracefully shut it down, awaiting any pending requests.

### Client

The server should be running to respond to API requests while debugging the client.
Serve the client with hot reload at localhost:8080 using;
``` bash
npm run dev
```

Build client distribution files to './dist' using;
``` bash
npm run build
```

### Tests

To run unit tests - the vue-cli-service is required. Install it with;
``` bash
npm i -D vue-cli-service
```

to run unit tests;
``` bash
npm run test:unit
```

linting can be tested using;
``` bash
npm run lint
```
