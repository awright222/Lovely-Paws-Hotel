# Lovely Paws Hotel

## Full Stack React, Redux-Toolkit, Python, PostgreSQL, AWS S3 App

## Introduction

This is a full-stack built with React, Redux-Toolkit, Python, PostgreSQL and AWS S3. The application features user authentication, which allows users to login, sign-up, logout, and use a demo user login for easy access. This application also includes 4 major CRUD features:

![Routes](backend.png)

1. Pets (and Pet's Image)
2. Reviews
3. Services
4. Booking (or Reservation)

The User is partially with Create and Read.

The frontend was built with React, Redux-Toolkit (with normalized data), and CSS. The backend was built with Python, PostgreSQL and the AWS S3 buckets for image upload.

![Landing Page](landing.png)
![Manage Pets](managepets.png)
![Bookings](bookings.png)


# Find Me!
[Portfolio](https://www.alexwrightportfolio.com/)  | [Project](https://lovely-paws-hotel-grvv.onrender.com/)  | [LinkedIn](www.linkedin.com/in/alexgwright2)  | [GitHub](https://github.com/awright222)



## Getting started

1. Clone this repository (only this branch).

2. Install dependencies.

   ```bash
   pipenv install -r requirements.txt
   ```

3. Create a **.env** file based on the example with proper settings for your
   development environment.

4. Make sure the SQLite3 database connection URL is in the **.env** file.

5. This starter organizes all tables inside the `flask_schema` schema, defined
   by the `SCHEMA` environment variable. Replace the value for
   `SCHEMA` with a unique name, **making sure you use the snake_case
   convention.**

6. Get into your pipenv, migrate your database, seed your database, and run your
   Flask app:

   ```bash
   pipenv shell
   ```

   ```bash
   flask db migrate -m "some message" #(only if need new migrations)
   ```

   ```bash
   flask db upgrade
   ```

   ```bash
   flask seed all
   ```

   ```bash
   flask run
   ```

7. The React frontend has no styling applied. Copy the **.css** files from your
   Authenticate Me project into the corresponding locations in the
   **react-vite** folder to give your project a unique look.

8. To run the React frontend in development, `cd` into the **react-vite**
   directory and run `npm i` to install dependencies. Next, run `npm run build`
   to create the `dist` folder. The starter has modified the `npm run build`
   command to include the `--watch` flag. This flag will rebuild the **dist**
   folder whenever you change your code, keeping the production version up to
   date.

## Deployment through Render.com

First, recall that Vite is a development dependency, so it will not be used in
production. This means that you must already have the **dist** folder located in
the root of your **react-vite** folder when you push to GitHub. This **dist**
folder contains your React code and all necessary dependencies minified and
bundled into a smaller footprint, ready to be served from your Python API.

Begin deployment by running `npm run build` in your **react-vite** folder and
pushing any changes to GitHub.

Refer to your Render.com deployment articles for more detailed instructions
about getting started with [Render.com], creating a production database, and
deployment debugging tips.

From the Render [Dashboard], click on the "New +" button in the navigation bar,
and click on "Web Service" to create the application that will be deployed.

Select that you want to "Build and deploy from a Git repository" and click
"Next". On the next page, find the name of the application repo you want to
deploy and click the "Connect" button to the right of the name.

Now you need to fill out the form to configure your app. Most of the setup will
be handled by the **Dockerfile**, but you do need to fill in a few fields.

Start by giving your application a name.

Make sure the Region is set to the location closest to you, the Branch is set to
"main", and Runtime is set to "Docker". You can leave the Root Directory field
blank. (By default, Render will run commands from the root directory.)

Select "Free" as your Instance Type.

### Add environment variables

In the development environment, you have been securing your environment
variables in a **.env** file, which has been removed from source control (i.e.,
the file is gitignored). In this step, you will need to input the keys and
values for the environment variables you need for production into the Render
GUI.

Add the following keys and values in the Render GUI form:

- SECRET_KEY (click "Generate" to generate a secure secret for production)
- FLASK_ENV production
- FLASK_APP app
- SCHEMA=«custom_schema_name_here»
- AWS_BUCKET_NAME=«aws_bucket_name_here»
- AWS_BUCKET_REGION=«aws_bucket_region_here»
- AWS_ACCESS_KEY_ID=«aws_access_key_here»
- AWS_SECRET_ACCESS_KEY=«aws_secret_access_key_here»

In a new tab, navigate to your dashboard and click on your Postgres database
instance.

Add the following keys and values:

- DATABASE_URL (copy value from the **External Database URL** field)

Assign PORT to 8000, choose a custom schema in snake case, and generate a strong JWT secret.

- Recommendation to generate a strong secret: create a random string using openssl (a library that should already be installed in your Ubuntu/MacOS shell). Run openssl rand -base64 to generate a random JWT secret.

For the AWS required variables, you can access those directly from the AWS bucket you set up.

**Note:** Add any other keys and values that may be present in your local
**.env** file. As you work to further develop your project, you may need to add
more environment variables to your local **.env** file. Make sure you add these
environment variables to the Render GUI as well for the next deployment.

### Deploy

Now you are finally ready to deploy! Click "Create Web Service" to deploy your
project. The deployment process will likely take about 10-15 minutes if
everything works as expected. You can monitor the logs to see your Dockerfile
commands being executed and any errors that occur.

When deployment is complete, open your deployed site and check to see that you
have successfully deployed your Flask application to Render! You can find the
URL for your site just below the name of the Web Service at the top of the page.

**Note:** By default, Render will set Auto-Deploy for your project to true. This
setting will cause Render to re-deploy your application every time you push to
main, always keeping it up to date.

[Render.com]: https://render.com/
[Dashboard]: https://dashboard.render.com/

## Database Schema Design

![alt text](image.png)

## API Documentation

## STAFF / CLIENT AUTHENTICATION OR AUTHORIZATION

### All endpoints that require authentication

All endpoints that require a current staff/client to be logged in.

- Request: endpoints that require authentication
- Error Response: Require authentication

  - Status Code: 401
  - Headers:
    - content-Type: application/json
  - Body:

  ```json
  {
    "message": "Authentication required"
  }
  ```

### All endpoints that require proper authorization

All endpoints that require authentication and the current staff / client does not have the correct role(s) or permission(s).

- Request: endpoints that require proper authorization
- Error Response: Require proper authorization

  - Status Code: 403
  - Headers:
    - Content-Type: application/json
  - Body:

  ```json
  {
    "message": "Forbidden"
  }
  ```

### Get the Current User

Returns the information about the current Staff or Client that is logged in.

- Require Authentication: false
- Request:

  - Method: GET
  - Route path: /api/auth/session
  - Body: none

- Successful Response when there is a logged in Staff

  - Status Code: 200
  - Headers:
    - Content-Type: application/json
  - Body:

  ```json
  {
    "user": {
      "id": 1,
      "fname": "John",
      "lname": "Smith",
      "username": "johnsmith",
      "password": "password1",
      "address": "123 main st",
      "city": "redlands",
      "state": "CA",
      "zip": 92323,
      "staff": true,
      "position": "manager"
    }
  }
  ```

- Successful Response when there is a logged in Client

  - Status Code: 200
  - Headers:
    - Content-Type: application/json
  - Body:

  ```json
  {
    "user": {
      "id": 1,
      "fname": "John",
      "lname": "Smith",
      "username": "johnsmith",
      "password": "password1",
      "address": "123 main st",
      "city": "redlands",
      "state": "CA",
      "zip": 92323,
      "staff": false,
      "position": null
    }
  }
  ```

- Successful Response when there is no logged in user

  - Status Code: 200
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "user": null
    }
    ```

### Log In a User

Logs in a current user with valid credentials and returns the current user's
information.

- Require Authentication: false
- Request

  - Method: POST
  - Route path: /api/auth/login
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "credential": "john.smith@gmail.com",
      "password": "secret password"
    }
    ```

- Successful Response

  - Status Code: 200
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "user": {
        "id": 1,
        "fname": "John",
        "lname": "Smith",
        "email": "john.smith@gmail.com",
        "username": "JohnSmith",
        "staff": true, // for client will be false
        "position": "Manager"
      }
    }
    ```

- Error Response: Invalid credentials

  - Status Code: 401
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "message": "Invalid credentials"
    }
    ```

- Error response: Body validation errors

  - Status Code: 400
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "message": "Bad Request",
      "errors": {
        "credential": "Email or username is required",
        "password": "Password is required"
      }
    }
    ```

### Sign Up a User

Creates a new Client, logs them in as the current Client, and returns the current
Client's information.

- Require Authentication: false
- Request

  - Method: POST
  - Route path: /api/auth/signup
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "fname": "John",
      "lname": "Smith",
      "email": "john.smith@gmail.com",
      "username": "JohnSmith",
      "password": "secret password",
      "address": "123 main st",
      "city": "redlands",
      "state": "CA",
      "zip": 92323
    }
    ```

- Successful Response

  - Status Code: 201
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "user": {
        "id": 1,
        "fname": "John",
        "lname": "Smith",
        "email": "john.smith@gmail.com",
        "username": "JohnSmith",
        "address": "123 main st",
        "city": "redlands",
        "state": "CA",
        "zip": 92323,
        "staff": true, //"staff": false, "position": null if client
        "position": "manager"
      }
    }
    ```

- Error response: Staff already exists with the specified email or username

  - Status Code: 500
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "message": "User already exists",
      "errors": {
        "email": "User with that email already exists",
        "username": "User with that username already exists"
      }
    }
    ```

- Error response: Body validation errors

  - Status Code: 400
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "message": "Bad Request",
      "errors": {
        "email": "Invalid email",
        "username": "Username is required",
        "fname": "First Name is required",
        "lname": "Last Name is required",
        "address": "Address is required",
        "city": "City is required",
        "state": "State is required",
        "zip": "Zip code is required"
      }
    }
    ```

## PETS

### Get all Pets

Return all the pets.

- Require Authentication: false
- Request

  - Method: GET
  - Route path: /api/pets
  - Body: None

- Successful Response

  - Status Code: 200
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
        "Pets": [
            {
                "id": 1,
                "ownerId": 1,
                "type": "dog",
                "breed": "German Shepard",
                "name": "Ricky",
                "gender": "male",
                "dob": 06-01-2023,
                "size": "Oh lawd he coming",
                "weight": 90,
                "behavior": "calm",
                "medicationNote": "Needs sleep medicine because crazy",
                "dietaryNote": "Cannot eat rocks",
                "previewImage": "image url"
            }
        ]
    }

    ```

### Get all Pets owned by Current User

Return all pets owned by the current user.

- Require Authentication: true
- Request

  - Method: GET
  - Route path: /api/pets/:userId
  - Body: None

- Successful Response

  - Status Code: 200
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
        "Pets": [
            {
                "id": 1,
                "ownerId": 1,
                "type": "dog",
                "breed": "German Shepard",
                "name": "Ricky",
                "gender": "male",
                "dob": 06-01-2023,
                "size": "Oh lawd he coming",
                "weight": 90,
                "behavior": "calm",
                "medicationNote": "Needs sleep medicine because crazy",
                "dietaryNote": "Cannot eat rocks",
                "previewImage": "image url"
            }
        ]
    }
    ```

### Get details of a Pet from an id

Returns the details of a pet by its id

- Require Authentication: false
- Request

  - Method: GET
  - Route path: /api/pets/:petId
  - Body: none

- Successful Response

  - Status Code: 200
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
        "id": 1,
        "ownerId": 1,
        "type": "dog",
        "breed": "German Shepard",
        "name": "Ricky",
        "gender": "male",
        "dob": 06-01-2023,
        "size": "Oh lawd he coming",
        "weight": 90,
        "behavior": "calm",
        "medicationNote": "Needs sleep medicine because crazy",
        "dietaryNote": "Cannot eat rocks",
        "previewImage": "image url",
        "PetImages": [
            {
                "id": 1,
                "url": "image url",
            },
            {
                "id": 2,
                "url": "image url",
            }
        ],
        "Owner": {
            "id": 1,
            "firstName": "John",
            "lastName": "Smith"
        }
    }
    ```

- Error response: Couldn't find a Pet with the specified id

  - Status Code: 404
  - Headers:
  - Content-Type: application/json
  - Body:

    ```json
    {
      "message": "Pet couldn't be found"
    }
    ```

### Create a Pet

Creates and returns a new Pet

- Require Authentication: true
- Request

  - Method: POST
  - Route path: /api/pets
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
        "type": "dog",
        "breed": "German Shepard",
        "name": "Ricky",
        "gender": "male",
        "dob": 06-01-2023,
        "size": "Oh lawd he coming",
        "weight": 90,
        "behavior": "calm",
        "medicationNote": "Needs sleep medicine because crazy",
        "dietaryNote": "Cannot eat rocks",
        "previewImage": "image url",
        "petImages": [
          {
              "id": 1,
              "url": "image url",
          },
          {
              "id": 2,
              "url": "image url",
          }
        ]
    }
    ```

- Successful Response

  - Status Code: 201
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
        "id": 1,
        "ownerId": 1,
        "type": "dog",
        "breed": "German Shepard",
        "name": "Ricky",
        "gender": "male",
        "dob": 06-01-2023,
        "size": "Oh lawd he coming",
        "weight": 90,
        "behavior": "calm",
        "medicationNote": "Needs sleep medicine because crazy",
        "dietaryNote": "Cannot eat rocks",
        "previewImage": "image url",
        "petImages": [
          {
              "id": 1,
              "url": "image url",
          },
          {
              "id": 2,
              "url": "image url",
          }
        ],
        "createdAt": "2021-11-19 20:39:36",
        "updatedAt": "2021-11-19 20:39:36"
    }
    ```

- Error Response: Body validation errors

  - Status Code: 400
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "message": "Bad Request",
      "errors": {
        "type": "Type is required",
        "breed": "Breed is required",
        "name": "Name is required",
        "gender": "Gender is required",
        "dob": "DOB is required",
        "size": "Size is required",
        "weight": "Weight is required",
        "behavior": "Behavior is required",
        "medicationNote": "MedicationNote is required",
        "dietaryNote": "DietaryNote is required",
        "previewImage": "Preview image is required"
      }
    }
    ```

### Add an Image to a Pet based on the Pet's id

Create and return a new image for a pet specified by id.

- Require Authentication: true
- Require proper authorization: Pet must belong to the current user, or staff member
- Request

  - Method: POST
  - Route path: /api/pets/:petId/images
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "url": "image url"
    }
    ```

- Successful Response

  - Status Code: 201
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "id": 1,
      "petId": 1,
      "url": "image url"
    }
    ```

- Error response: Couldn't find a Pet with the specified id

  - Status Code: 404
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "message": "Pet couldn't be found"
    }
    ```

### Edit a Pet

Updates and returns an existing Pet.

- Require Authentication: true
- Require proper authorization: Pet must belong to the current user, or staff member
- Request

  - Method: Put
  - Route path: /api/pets/:petId
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
        "type": "dog",
        "breed": "German Shepard",
        "name": "Ricky",
        "gender": "male",
        "dob": 06-01-2023,
        "size": "Oh lawd he coming",
        "weight": 90,
        "behavior": "calm",
        "medicationNote": "Needs sleep medicine because crazy",
        "dietaryNote": "Cannot eat rocks",
    }
    ```

- Successful Response

  - Status Code: 200
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
        "id": 1,
        "ownerId": 1,
        "type": "dog",
        "breed": "German Shepard",
        "name": "Ricky",
        "gender": "male",
        "dob": 06-01-2023,
        "size": "Oh lawd he coming",
        "weight": 90,
        "behavior": "calm",
        "medicationNote": "Needs sleep medicine because crazy",
        "dietaryNote": "Cannot eat rocks",
        "previewImage": "image url",
        "petImages": [
          {
              "id": 1,
              "url": "image url",
          },
          {
              "id": 2,
              "url": "image url",
          }
        ],
        "createdAt": "2021-11-19 20:39:36",
        "updatedAt": "2021-11-19 20:39:36"
    }
    ```

- Error Response: Body validation errors

  - Status Code: 400
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "message": "Bad Request", // (or "Validation error" if generated by Sequelize),
      "errors": {
        "type": "Type is required",
        "breed": "Breed is required",
        "name": "Name is required",
        "gender": "Gender is required",
        "dob": "DOB is required",
        "size": "Size is required",
        "weight": "Weight is required",
        "behavior": "Behavior is required",
        "medicationNote": "MedicationNote is required",
        "dietaryNote": "DietaryNote is required"
      }
    }
    ```

- Error response: Couldn't find a Pet with the specified id

  - Status Code: 404
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "message": "Pet couldn't be found"
    }
    ```

### Delete a Pet

Deletes an existing Pet.

- Require Authentication: true
- Require proper authorization: Pet must belong to the current user, or staff member
- Request

  - Method: DELETE
  - Route path: /api/pets/:petId
  - Body: none

- Successful Response

  - Status Code: 200
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "message": "Successfully deleted"
    }
    ```

- Error response: Couldn't find a Pet with the specified id

  - Status Code: 404
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "message": "Pet couldn't be found"
    }
    ```

## SERVICE

### Get all Services

Returns all the services.

- Require Authentication: false
- Request

  - Method: GET
  - Route path: /api/services
  - Body: none

- Successful Response

  - Status Code: 200
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "Services": [
        {
          "typeOfServices": "hair-trim",
          "staff": [1, 3, 5, 8, 13],
          "price": 80
        },
        {
          "typeOfServices": "nail-trim",
          "staff": [2, 4, 6, 9, 14],
          "price": 40
        },
        {
          "typeOfServices": "bath",
          "staff": [1, 3, 4, 5, 7, 8, 13],
          "price": 60
        }
      ]
    }
    ```

### Get a Service based on id

Returns a service based on id.

- Require Authentication: false
- Request

  - Method: GET
  - Route path: /api/services/:serviceId
  - Body: none

- Successful Response

  - Status Code: 200
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "typeOfServices": "hair-trim",
      "staff": [1, 3, 5, 8, 13],
      "price": 80
    }
    ```

### Create a Service

Creates and returns a new service,

- Require Authentication: Owner or manager only
- Request

  - Method: Post
  - Route path: /api/services
  - Body:

  ```json
  {
    "staff": [1, 5, 8],
    "typeOfService": "massage",
    "price": 100
  }
  ```

- Successful Response

  - Status Code: 200
  - Headers:
    - Content-Type: application/json
  - Body:

  ```json
  {
    "staff": [1, 5, 8],
    "typeOfService": "massage",
    "price": 100
  }
  ```

- Error Response: Body validation errors

- Status Code: 400
- Headers:
  - Content-Type: application/json
- Body:

  ```json
  {
    "message": "Bad Request",
    "errors": {
      "staff": "Staff must be a list of staff who can preform this service",
      "typeOfService": "TypeOfService is required",
      "price": "Price must be a positive integer"
    }
  }
  ```

### Edit a Service

Updates and returns an existing service.

- Require Authentication: true
- Require proper authorization: Owner or manager must be signed in to edit
- Request

  - Method: Put
  - Route path: /api/services/:serviceId
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "typeOfServices": "hair-trim",
      "staff": [1, 3, 5, 8, 13],
      "price": 60
    }
    ```

- Successful Response

  - Status Code: 200
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "typeOfServices": "hair-trim",
      "staff": [1, 3, 5, 8, 13],
      "price": 60
    }
    ```

- Error Response: Body validation errors

  - Status Code: 400
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "message": "Bad Request",
      "errors": {
        "typeOfServices": "TypeOfServices is required",
        "staff": "Staff must list all staff members by id who can do this service",
        "price": "Price must be a positive number"
      }
    }
    ```

- Error response: Couldn't find a Service with the specified id

  - Status Code: 404
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "message": "Service couldn't be found"
    }
    ```

### Delete a Service

Deletes an existing service.

- Require Authentication: true
- Require proper authorization: Owner or manager must be signed in
- Request

  - Method: DELETE
  - Route path: /api/services/:serviceId
  - Body: none

- Successful Response

  - Status Code: 200
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "message": "Successfully deleted"
    }
    ```

- Error response: Couldn't find a Service with the specified id

  - Status Code: 404
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "message": "Service couldn't be found"
    }
    ```

## Reviews

### Get all Reviews by current user

Returns all the reviews written by the current user.

- Require Authentication: true
- Request

  - Method: GET
  - Route path: /api/reviews
  - Body: none

- Successful Response

  - Status Code: 200
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "Reviews": [
        {
          "id": 1,
          "userId": 1,
          "petId": 1,
          "review": "This was an awesome service!",
          "paws": 5,
          "createdAt": "2021-11-19 20:39:36",
          "updatedAt": "2021-11-19 20:39:36"
        }
      ]
    }
    ```

### Create a review

Create and return a new review.

- Require Authentication: true
- Request

  - Method: POST
  - Route path: /api/reviews/
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "review": "This was an awesome service!",
      "paws": 5
    }
    ```

- Successful Response

  - Status Code: 201
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "id": 1,
      "userId": 1,
      "petIdId": 1,
      "review": "This was an awesome service!",
      "paws": 5,
      "createdAt": "2021-11-19 20:39:36",
      "updatedAt": "2021-11-19 20:39:36"
    }
    ```

- Error Response: Body validation errors

  - Status Code: 400
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "message": "Bad Request",
      "errors": {
        "review": "Review text is required",
        "paws": "Paws must be an integer from 1 to 5"
      }
    }
    ```

- Error response: Review from the current user already exists

  - Status Code: 500
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "message": "User already has a review"
    }
    ```

### Edit a Review

Update and return an existing review.

- Require Authentication: true
- Require proper authorization: Review must belong to the current user
- Request

- Method: PUT
- Route path: /api/reviews/:reviewId
- Headers:
  - Content-Type: application/json
- Body:

  ```json
  {
    "review": "This was an awesome service!",
    "paws": 5
  }
  ```

- Successful Response

- Status Code: 200
- Headers:
  - Content-Type: application/json
- Body:

  ```json
  {
    "id": 1,
    "userId": 1,
    "petId": 1,
    "review": "This was an awesome service!",
    "paws": 5,
    "createdAt": "2021-11-19 20:39:36",
    "updatedAt": "2021-11-20 10:06:40"
  }
  ```

- Error Response: Body validation errors

- Status Code: 400
- Headers:
  - Content-Type: application/json
- Body:

  ```json
  {
    "message": "Bad Request",
    "errors": {
      "review": "Review text is required",
      "paws": "Paws must be an integer from 1 to 5"
    }
  }
  ```

- Error response: Couldn't find a Review with the specified id

- Status Code: 404
- Headers:
  - Content-Type: application/json
- Body:

  ```json
  {
    "message": "Review couldn't be found"
  }
  ```

### Delete a Review

Delete an existing review.

- Require Authentication: true
- Require proper authorization: Current user must be the owner of the review or a staff member
- Request

- Method: DELETE
- Route path: /api/reviews/:reviewId
- Body: none

- Successful Response

- Status Code: 200
- Headers:
  - Content-Type: application/json
- Body:

  ```json
  {
    "message": "Successfully deleted"
  }
  ```

- Error response: Couldn't find a Review with the specified id

- Status Code: 404
- Headers:
  - Content-Type: application/json
- Body:

  ```json
  {
    "message": "Review couldn't be found"
  }
  ```

## Bookings

### Get all bookings for today - by Staff

- Require authentication: True for Staff
- Request:

  - Method: GET
  - Route path: /api/bookings/<today's date>
  - Body: none

- Successful Response

  - Status Code: 200
  - Headers:
    - Content-Type: application/json
  - Body:

  ```json
  {
    "Today's Bookings": [
      {
        "dropOffDatetime": "2024-12-10 08:00:00",
        "pickUpDateTime": "2021-12-10 18:00:00",
        "Pet Information": {
          "id": 1,
          "ownerId": 2,
          "type": "dog",    // <!-- cat or dog -->
          "name": "King",
          "breed": "husky",
          "gender": "male",
          "dob": "2021-12-10",
          "size": "medium",
          "weight": 45,     // in lbs
          "behavior": "friendly",
          "medicationNotes": "please give the medication once a day",
          "dietaryNotes": "none",
          "previewImage": "https://sample.image.png",
        },
        "Services": [{
          "id": 1,
          "typeOfService": "hair-trim",    // Day-Care or Boarding-Care
          "price": 75.00,             // calculated on the last day of boarding or on the day-care
          "serviceImages": [
            {
              "id": 1,
              "serviceId": 1,
              "url": "https://sample/image10.png"
            }
                        {
              "id": 2,
              "serviceId": 1,
              "url": "https://sample/image10.png"
            }
          ],
          "Staff":[
            {
            "id": 5,
            "fname": "John",
            "lname": "Smith"
            },
            {
            "id": 8,
            "fname": "Jane",
            "lname": "Smith"
            },
            {
            "id": 11,
            "fname": "Widdow",
            "lname": "Smith"
            },
          ],
        }]
      }
    ]
  }
  ```

  <!--

### Create a Booking based on a Pets id

Create and return a new booking for a pet based on their id.

- Require Authentication: true
- Require proper authorization: current user must be the owner of the pet or a staff member
- Request

  - Method: POST
  - Route path: /api/bookings/:petId
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "bookingType": "Day Care",
      "services": [1], //box with check boxes of which services to select
      "dropOffDatetime": "2024-12-10 08:00:00",
      "pickUpDateTime": "2021-12-10 18:00:00"
    }
    ```

- Successful Response

  - Status Code: 201
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
        "Client Information": {
          "id": 1,
          "fname": "John",
          "lname": "Smith",
          "email": "john.smith@gmail.com",
          "username": "JohnSmith",
          "address": "123 main st",
          "city": "redlands",
          "state": "CA",
          "zip": 92323,
          "staff": false,
          "position": null
        },
        "Pet Information": {
          "id": 1,
          "ownerId": 2,
          "type": "dog",    // <!-- cat or dog -->
          "name": "King",
          "breed": "husky",
          "gender": "male",
          "dob": "2021-12-10",
          "size": "medium",
          "weight": 45,     // in lbs
          "behavior": "friendly",
          "medicationNotes": "please give the medication once a day",
          "dietaryNotes": "none",
          "previewImage": "https://sample.image.png",
        },
        "Services": [{
          "id": 1,
          "typeOfService": "hair-trim",    // Day-Care or Boarding-Care
          "price": 75.00,             // calculated on the last day of boarding or on the day-care
          "serviceImages": [
            {
              "id": 1,
              "serviceId": 1,
              "url": "https://sample/image10.png"
            }
                        {
              "id": 2,
              "serviceId": 1,
              "url": "https://sample/image10.png"
            }
          ],
          "Staff":[
            {
            "id": 5,
            "fname": "John",
            "lname": "Smith"
            },
            {
            "id": 8,
            "fname": "Jane",
            "lname": "Smith"
            },
            {
            "id": 11,
            "fname": "Widdow",
            "lname": "Smith"
            },
          ],
        }],
        "bookingType": "Dary care",
        "dropOffDatetime": "2024-12-10 08:00:00",
        "pickUpDateTime": "2021-12-10 18:00:00",
        "price": 175
      }
    ```

- Error response: Body validation errors

  - Status Code: 400
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "message": "Bad Request", //these are the only errors we can have since we'll have selectors for them to choose from
      "errors": {
        "dropOffDatetime": "dropOffDatetime cannot be in the past",
        "pickUpDateTime": "pickUpDateTime cannot be on or before dropOffDatetime"
      }
    }
    ```

- Error response: Couldn't find a Pet with the specified id

  - Status Code: 404
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "message": "Pet couldn't be found"
    }
    ```

- Error response: Booking conflict

  - Status Code: 403
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "message": "Sorry, this Pet is already booked for the specified dates",
      "errors": {
        "dropOffDatetime": "Start date conflicts with an existing booking",
        "pickUpDateTime": "End date conflicts with an existing booking"
      }
    }
    ```

### Edit a Booking

Update and return an existing booking.

- Require Authentication: true
- Require proper authorization: Booking must belong to the current user or a staff
- Request

  - Method: PUT
  - Route path: /api/bookings/:bookingId
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "bookingType": "Day Care",
      "services": [1], //box with check boxes of which services to select
      "dropOffDatetime": "2024-12-10 08:00:00",
      "pickUpDateTime": "2021-12-10 18:00:00"
    }
    ```

- Successful Response

  - Status Code: 200
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
        "Client Information": {
          "id": 1,
          "fname": "John",
          "lname": "Smith",
          "email": "john.smith@gmail.com",
          "username": "JohnSmith",
          "address": "123 main st",
          "city": "redlands",
          "state": "CA",
          "zip": 92323,
          "staff": false,
          "position": null
        },
        "Pet Information": {
          "id": 1,
          "ownerId": 2,
          "type": "dog",    // <!-- cat or dog -->
          "name": "King",
          "breed": "husky",
          "gender": "male",
          "dob": "2021-12-10",
          "size": "medium",
          "weight": 45,     // in lbs
          "behavior": "friendly",
          "medicationNotes": "please give the medication once a day",
          "dietaryNotes": "none",
          "previewImage": "https://sample.image.png",
          "petImages": [
            {
              "id": 1,
              "petId": 1,
              "url": "https://sample.image1.png"
            }
                        {
              "id": 2,
              "petId": 1,
              "url": "https://sample.image2.png"
            }
          ]
        },
        "Services": [{
          "id": 1,
          "typeOfService": "hair-trim",    // Day-Care or Boarding-Care
          "price": 75.00,             // calculated on the last day of boarding or on the day-care
          "serviceImages": [
            {
              "id": 1,
              "serviceId": 1,
              "url": "https://sample/image10.png"
            }
                        {
              "id": 2,
              "serviceId": 1,
              "url": "https://sample/image10.png"
            }
          ],
          "Staff":[
            {
            "id": 5,
            "fname": "John",
            "lname": "Smith"
            },
            {
            "id": 8,
            "fname": "Jane",
            "lname": "Smith"
            },
            {
            "id": 11,
            "fname": "Widdow",
            "lname": "Smith"
            },
          ],
        }],
        "bookingType": "Dary care",
        "dropOffDatetime": "2024-12-10 08:00:00",
        "pickUpDateTime": "2021-12-10 18:00:00",
        "price": 175
      }
    ```

- Error response: Body validation errors

  - Status Code: 400
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "message": "Bad Request", //these are the only errors we can have since we'll have selectors for them to choose from
      "errors": {
        "dropOffDatetime": "dropOffDatetime cannot be in the past",
        "pickUpDateTime": "pickUpDateTime cannot be on or before dropOffDatetime"
      }
    }
    ```

- Error response: Couldn't find a Pet with the specified id

  - Status Code: 404
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "message": "Pet couldn't be found"
    }
    ```

- Error response: Can't edit a booking that's past the end date

  - Status Code: 403
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "message": "Past bookings can't be modified"
    }
    ```

- Error response: Booking conflict

  - Status Code: 403
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "message": "Sorry, this pet is already booked for the specified dates",
      "errors": {
        "dropOffDatetime": "Start date conflicts with an existing booking",
        "pickUpDateTime": "End date conflicts with an existing booking"
      }
    }
    ```

### Delete a Booking

Delete an existing booking.

- Require Authentication: true
- Require proper authorization: Current user must be the one who booked or must be a staff member
- Request

  - Method: DELETE
  - Route path: /bookings/:bookingId
  - Body: none

- Successful Response

  - Status Code: 200
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "message": "Successfully deleted"
    }
    ```

- Error response: Couldn't find a Booking with the specified id

  - Status Code: 404
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "message": "Booking couldn't be found"
    }
    ```

- Error response: Bookings that have been started can't be deleted

  - Status Code: 403
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "message": "Bookings that have been started can't be deleted"
    }
    ```

### Get all of the Current User's Bookings

Return all the bookings that the current user has made.

- Require Authentication: true
- Request

  - Method: GET
  - Route path: /session/bookings
  - Body: none

- Successful Response

  - Status Code: 200
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "Bookings": [
        {
          "id": 1,
          "Services": [
            {
              "typeOfServices": "hair-trim",
              "staff": [1, 3, 5, 8, 13],
              "price": 80
            },
            {
              "typeOfServices": "nail-trim",
              "staff": [2, 4, 6, 9, 12],
              "price": 50
            }
          ],
          "clientId": 2,
          "petId": 4,
          "dropOffDatetime": "2024-12-10 08:00:00",
          "pickUpDateTime": "2021-12-10 18:00:00"
        }
      ]
    }
    ```

## IMAGES

### Add a pet image

Add an image to a pet

- Require Authentication: true
- Require proper authorization: Pet must belong to the current user
- Request

- Method: Post
- Route path: /api/pets/:petId/images/
- Body:

  ```json
  {
    "url": "image url"
  }
  ```

- Successful Response

  - Status Code: 201
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "id": 1,
      "url": "image url"
    }
    ```

- Error response: Couldn't find a Pet with the specified id

  - Status Code: 404
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "message": "Pet couldn't be found"
    }
    ```

- Error response: Cannot add any more images because there is a maximum of 5
  images per resource

  - Status Code: 403
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "message": "Maximum number of images for this resource was reached"
    }
    ```

### Delete a Pet Image

Delete an existing image for a Pet.

- Require Authentication: true
- Require proper authorization: Pet must belong to the current user
- Request

- Method: DELETE
- Route path: /api/pets/:petId/images/:imageId
- Body: none

- Successful Response

- Status Code: 200
- Headers:
  - Content-Type: application/json
- Body:

  ```json
  {
    "message": "Successfully deleted"
  }
  ```

- Error response: Couldn't find a Pet Image with the specified id

- Status Code: 404
- Headers:
  - Content-Type: application/json
- Body:

  ```json
  {
    "message": "Pet Image couldn't be found"
  }
  ```
