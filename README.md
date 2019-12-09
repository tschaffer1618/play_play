# Play Play

## Introduction
Play Play is an Express node.js RESTful API that returns detailed song data. A user can favorite songs and delete favorited songs.

## Local Setup
1. You will need Node to run this program - if you need to install it, [click here](https://nodejs.org/en/)!
2. Fork and clone down this repo
3. Install all dependences by navigating to the root directory in your terminal and running `npm install`
4. Run `psql` in your terminal and run `CREATE DATABASE favorite_songs_dev` to create your PostgreSQL database
5. Run table migrations with `knex migrate:latest`
6. Seed the database with `knex seed:run`

## Testing
- To test this app, run `npm test`

## Heroku Production Link
- This app and its production endpoints can be accessed at https://play-play-ts-lk.herokuapp.com/


## Endpoints

**1.** `POST /api/v1/favorites`
  - Summary: Allows user to create a favorite by passing in a song title and artist
  - Required Request Body: 
  ```
    {
    "title": "We Will Rock You",
    "artistName": "Queen"
  }
  ```
  - Expected Successful Response: 
  ```
  status: 201

  {
    "id": 1,
    "title": "We Will Rock You",
    "artistName": "Queen"
    "genre": "Rock",
    "rating": 88
  }
  ```
  
  - Example unsuccessful response:
  ```
  status: 400

  {
    "error": "No songs found matching that title and artist. Try again!"
  }
  ```
  ```
  status: 400

  {
     "You have already favorited We Will Rock You by Queen!"
  }
  ```
  
**2.** `GET /api/v1/favorites`
  - Summary: Returns a list of user's favorite songs
  - Required Request Body: None
  
  - Expected response: 
  ```
  status: 200

  [
    {
      "id": 1,
      "title": "We Will Rock You",
      "artistName": "Queen"
      "genre": "Rock",
      "rating": 88
    },
    {
      "id": 2,
      "title": "Careless Whisper",
      "artistName": "George Michael"
      "genre": "Pop",
      "rating": 93
    },
  ]
  ```

**3.** `GET /api/v1/favorites/:id`
  - Summary: Returns id, title, artist name, genre, and Musixmatch rating for a specific favorited song
  - Required Request Body: None

  - Expected Response:
  ```
  [
    {
      "id": 1,
      "title": "We Will Rock You",
      "artistName": "Queen"
      "genre": "Rock",
      "rating": 88
    }
  ]
  ```
**4.** `DELETE /api/v1/favorites/:id`
  - Summary: Deletes the favorited song with the specified id
  - Required Request Body: 
   ```
   {
    "id" : 1
   }
   ```
  - Expected Response: 
  ```
  status: 204
  ```


## Tech Stack
- Play Play is a node.js application built with the Express framework
- Knex
- PostgreSQL database
- Production hosted on Heroku

## Contributors
Play Play was written by Tyler Schaffer and Leiya Kenney as a Back End Mod 4 project at Turing School of Software and Design.

