# Node-mongoose

This is a generic backend. It is intended to be a template for the creation of node backends with database provided by mongodb and object modelling provided by mongoose.

## endpoints

All routes are fully tested with jest.

### POST /auth/login

takes a username and password in the body and returns a json web token (JWT) in res.body.token. This can then be used to authorise and provide access to the endpoints in the /api.

### POST /auth/register

takes a username and password and creates a new user with that username and password. The password is encryted (salted and hashed) using bcrypt before being stored in the database. A 201 status is returned upon success. The password must contain 8 characters, at least 1 lowercase 1 uppercase 1 number 1 special.

## /api

All of these routes are secured with JWT authorization.

### GET /api/info

This supplies a summary in json format of the endpoints. At least it should do.

### GET /api/users

Upon submission of valid token in Authorization header ("Bearer TOKEN") an array of users is returned.

### GET /api/users/:username

User's details are returned with valid username, otherwise 404 error.
