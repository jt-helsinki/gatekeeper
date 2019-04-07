# Gatekeeper - a session management micro service
A simple user session micro-service using AWS Lambda, Redis and Typescript. This service simply allows a client to submit 
a username and password and if the credentials match then it returns a JSON Web Token (Session). 

## Prerequisites

Before getting started, the following must be installed on your computer:

* Docker
* Node
* NPM
* Python 3

## Install

First ensure you are using Python 3 installed and then install the python requirements.

`pip install -r requirements.txt`

Next run:

`python setup.py`

Follow the on screen instructions.

## Environment Variables

To run the application the following environment variables must be set:

* SECRET_KEY (some kind of cryptographic salt works well)
* REDIS_URL
* REDIS_PORT
* DYNAMODB_URL
* DYNAMODB_PORT

## Endpoints

### Login
__/login__  
Accepts a clear text username and password in the request body. Returns a JSON webtoken if the credentials are valid. 

### Logout
__/logout__  
Invalidates the session associated with the Session

## Session Cache
Once validated, the client's session is stored inside the Redis cache. Any other applications 
or services using the session must have access to the cache. 

## Credentials
As this application validates the session of only a single user the hashed credentials are stored inside a text file. 
It would be quite easy to extend this to validate multiple users. 
