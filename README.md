# Gatekeeper - a session management micro service
A simple user session micro-service using AWS Lambda, Redis and Typescript. This service simply allows a client to submit 
a username and password and if the credentials match then it returns a JSON Web Token (JWT). 

## Endpoints

### Login
__/login__  
Accepts a clear text username and password in the request body. Returns a JSON webtoken if the credentials are valid. 

### Logout
__/logout__  
Invalidates the session associated with the JWT

## Session Cache
Once validated, the client's session is stored inside the Redis cache. Any other applications 
or services using the session must have access to the cache. 

## Credentials
As this application validates the session of only a single user the hashed credentials are stored inside a text file. 
It would be quite easy to extend this to validate multiple users. 
