import * as express from 'express';
import * as joi from 'joi';

export function ValidateRequest<T>(req: express.Request, res: express.Response, schema: joi.Schema): T {
  
  if (!req.body) {
    console.log(`Received invalid request from '${req.connection.remoteAddress}:${req.connection.remotePort}'.`);
    res.status(400)
    .send('Invalid Request');
    return undefined;
  }
  
  // reference the request content
  let content: any;
  if (req.method.toLowerCase() === 'post') {
    
    // reference the request body
    content = req.body;
    
  } else {
    
    // reference the query
    content = req.query;
    
  }
  
  // was the request valid?
  let validation = schema.validate(content);
  if (validation.error) {
    
    // no, log
    console.log(`Request '${req.path}' validation error from '${
      req.connection.remoteAddress}:${req.connection.remotePort}'. ${validation.error.message}.`);
    
    // send the response
    res.status(405)
    .send('Validation Error');
    
    // TODO : Flag end point
    
    return null;
  }
  
  return validation.value as T;
  
  
}
