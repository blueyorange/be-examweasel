# Be-examweasel

This is a REST api backend for an exam question database which stores images and question metadata.
Hosted @ [https://examweasel.herokuapp.com](https://examweasel.herokuapp.com)

## endpoints

All routes are fully tested with jest.

### GET /
returns the message "Welcome to api"

### POST /register
Creates a new user with username and password.

### POST /login
Returns a JWT with the correct username and login details.

### GET /api/
All api endpoints require valid JWT.
This one returns user information.

### GET /api/users
With valid JWT returns list of users.

### GET /api/users/:username
Returns user data for valid user.

### GET /api/questions/
Returns array of questions. Accepts query parameters.

### POST /api/questions/
Creates new question in db, returns \_id.

### PUT /api/questions/:\_id
Alters question data

### DELETE /api/questions/:\_id
Deletes question

To be finished...
