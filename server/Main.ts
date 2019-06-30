
import * as express from 'express';
import * as http from 'http';
import * as bodyParser from 'body-parser';
import Config from './Config';
import { LogIn, SendMail } from './Routes/Index';

// http server
let server: http.Server;
// express server instance
let serverInstance = express();
async function StartServer() {
  
  // disable 'x-powered-by' header
  serverInstance.disable('x-powered-by');
  
  // json parser
  serverInstance.use(bodyParser.json({
    limit: 1024 * 100,
    type: [ 'application/json', 'text/plain' ],
    strict: true
  }));
  
  try {
    server = serverInstance.listen(Config.port, Config.host);
    console.log(`Server started listening at ${Config.host}:${Config.port}`);
  } catch (error) {
    console.log(`Server encountered an error trying to listen to '${Config.host}:${Config.port}'. ${error}`);
  }
  
  // serve the dist folder
  serverInstance.use(express.static(
    Config.root,
    { extensions: [ 'html' ] }
  ));
  serverInstance.get('/', function(_req, res) { res.redirect('/index.html'); });
  
  // if developing - allow cross domain requests
  if (Config.host === 'localhost') {
    serverInstance.use((_req, res, next) => {
      res.header('Access-Control-Allow-Origin', '*');
      next();
    });
  }
  
  serverInstance.post('/api/v1/send-mail', SendMail);
  serverInstance.post('/api/v1/login', LogIn);
  
  // enable the stdin stream
  process.stdin.resume();
  process.stdin.setEncoding('utf8');
  
  // subscribe to console input events
  process.stdin.on(
    'data',
    (text: string) => {
      
      if (text.trim() === 'quit') {
        process.stdin.removeAllListeners('data');
        StopServer()
        .catch((error) => {
          console.log(`Error ending server. ${error && error.stack || error}`);
        });
      }
      
    }
  );
  
}

/** Stop the server gracefully. */
async function StopServer() {
  
  console.log(`Stopping server...`);
  
  // stop accepting new connections
  let error = await new Promise<Error>((resolve) => server.close(resolve));
  if (error) {
    console.log(`Error stopping server. ${error && error.stack || error}`);
    return;
  }
  
  // wait for any active connections
  const timeout: number = 1000 * 60 * 30;
  let time: number = 0;
  while (true) {
    let count = await new Promise<number>((resolve) => server.getConnections(
      (err: any, connectionCount: number) => {
        if (err) {
          console.log(`Error checking for connections; ${err}`);
          resolve(0);
        } else resolve(connectionCount);
      })
    );
    if (count === 0) break;
    if (time % 4000 === 0) console.log(`Waiting for '${server.connections}' server connections.`);
    if (time > timeout) break;
    await new Promise((resolve) => setTimeout(resolve, 200));
    time += 200;
  }
  
  console.log(`Server stopped.`);
  
  // end the process
  process.exit(0);
  
}

StartServer();
