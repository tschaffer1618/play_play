# Play Play

## Introduction
Play Play is an Express NodeJS RESTful API that returns detailed song data. A user can add and delete favorite songs, playlists, and songs within a playlist.

## Local Setup
1. You will need Node to run this program - if you need to install it, [click here](https://nodejs.org/en/)!
2. Fork and clone down this repo
3. Install all dependences by navigating to the root directory in your terminal and running `npm install`
4. Run `psql` in your terminal and run `CREATE DATABASE favorite_songs_dev` to create your PostgreSQL database
5. Run table migrations with `knex migrate:latest`
6. Seed the database with `knex seed:run`

## Testing
- To test this app, run `npm test`

## Agile Board Link
- This app's agile board can be accessed [here](https://github.com/tschaffer1618/play_play/projects/2)

## Heroku Production Link
- This app and its production endpoints can be accessed [here via Heroku](https://play-play-ts-lk.herokuapp.com/)

## Endpoints
**1.** `POST /api/v1/favorites`
  - Summary: Creates a favorite song
  - Required Request Body: 
  ```
  {
    "title": "We Will Rock You",
    "artistName": "Queen"
  }
  ```
  - Example Successful Response: 
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
  - Example Unsuccessful Response:
  ```
  status: 400

  {
    "error": "No songs found matching that title and artist. Try again!"
  }
  ```
  
**2.** `GET /api/v1/favorites`
  - Summary: Returns all favorite songs
  - Required Request Body: None
  - Example Successful Response: 
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
  - Summary: Returns a specific favorite song
  - Required Request Body: None
  - Example Successful Response:
  ```
  status: 200
  
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
  - Example Unsuccessful Response:
  ```
  status: 404
  
  {
    "error": "Song not found"
  }
  ```
  
**4.** `DELETE /api/v1/favorites/:id`
  - Summary: Deletes a specific favorite song
  - Required Request Body: None
  - Example Successful Response: 
  ```
  status: 204
  ```
  - Example Unsuccessful Response:
  ```
  status: 404
  
  {
    "error": "Song not found"
  }
  ```
  
**5.** `POST /api/v1/playlists`
  - Summary: Creates a playlist
  - Required Request Body:
  ```
  {
    "playlistTitle": "Cleaning House"
  }
  ```
  - Example Successful Response:
  ```
  status: 201
  
  {
    "id": 1,
    "title": "Cleaning House",
    "createdAt": 2019-11-26T16:03:43+00:00,
    "updatedAt": 2019-11-26T16:03:43+00:00,
  }
  ```
  - Example Unsuccessful Response:
  ```
  status: 400
  
  {
    "message": "You already have a playlist called Cleaning House!"
  }
  ```
  
**6.** `GET /api/v1/playlists`
  - Summary: Returns all playlists
  - Required Request Body: None
  - Example Successful Response:
  ```
  status: 200
  
  [
    {
      "id": 1,
      "title": "Cleaning House",
      "songCount": 2,
      "songAvgRating": 27.5,
      "favorites": [
                      {
                        "id": 1,
                        "title": "We Will Rock You",
                        "artistName": "Queen"
                        "genre": "Rock",
                        "rating": 25
                      },
                      {
                        "id": 4,
                        "title": "Back In Black",
                        "artistName": "AC/DC"
                        "genre": "Rock",
                        "rating": 30
                      }
                    ],
      "createdAt": 2019-11-26T16:03:43+00:00,
      "updatedAt": 2019-11-26T16:03:43+00:00
  }
    {
      "id": 2,
      "title": "Running Mix",
      "songCount": 0,
      "songAvgRating": 0,
      "favorites": []
      "createdAt": 2019-11-26T16:03:43+00:00,
      "updatedAt": 2019-11-26T16:03:43+00:00
    },
  ]
  ```
  
**7.** `GET /api/v1/playlists/:id/favorites`
  - Summary: Returns a specific playlist
  - Required Request Body: None
  - Example Successful Response:
  ```
  status: 200
  
  {
    "id": 1,
    "title": "Cleaning House",
    "songCount": 2,
    "songAvgRating": 27.5,
    "favorites" : [
                    {
                      "id": 1,
                      "title": "We Will Rock You",
                      "artistName": "Queen"
                      "genre": "Rock",
                      "rating": 25
                    },
                    {
                      "id": 4,
                      "title": "Back In Black",
                      "artistName": "AC/DC"
                      "genre": "Rock",
                      "rating": 30
                    }
                 ],
     "createdAt": 2019-11-26T16:03:43+00:00,
     "updatedAt": 2019-11-26T16:03:43+00:00
  }

  ```
  - Example Unsuccessful Response:
  ```
  status: 404
  
  {
    "error": "No playlist found matching that id. Try again!"
  }
  ```
  
**8.** `PUT /api/v1/playlists/:id`
  - Summary: Updates a specific playlist
  - Required Request Body:
  ```
  {
    "playlistTitle": "Marathon Running Mix"
  }
  ```
  - Example Successful Response:
  ```
  status: 200
  
  {
    "id": 2,
    "title": "Marathon Running Mix",
    "createdAt": 2019-11-26T16:03:43+00:00,
    "updatedAt": 2019-11-26T16:03:43+00:00
  }
  ```
  - Example Unsuccessful Response:
  ```
  status: 404
  
  {
    "error": "No playlist found matching that id. Try again!"
  }
  ```
  
**9.** `DELETE /api/v1/playlists/:id`
  - Summary: Deletes a specific playlist
  - Required Request Body: None
  - Example Successful Response:
  ```
  status: 204
  ```
  - Example Unsuccessful Response:
  ```
  status: 404
  
  {
    "error": "No playlist found matching that id. Try again!"
  }
  ```
  
**10.** `POST /api/v1/playlists/:id/favorites/:id`
  - Summary: Adds a favorite song to a playlist
  - Required Request Body: None
  - Example Successful Response:
  ```
  status: 201
  
  {
    "success": We Will Rock You has been added to Cleaning House!"
  }
  ```
  - Example Unsuccessful Response:
  ```
  status: 400
  
  {
    "message": "We Will Rock You is already in Cleaning House!"
  }
  ```
  
**11.** `DELETE /api/v1/playlists/:id/favorites/:id`
  - Summary: Deletes a favorite song from a playlist
  - Required Request Body: None
  - Example Successful Response:
  ```
  status: 204
  ```
  - Example Unsuccessful Response:
  ```
  status: 404
  
  {
    "error": "No song found matching that id. Try again!"
  }
  ```
  
## Schema 
![Database Schema](https://user-images.githubusercontent.com/48742436/70652220-24df6800-1c4a-11ea-84a9-51ca64df027c.png)

## Tech Stack
- Play Play is a NodeJS application built with the Express framework
- Knex
- Jest for testing
- PostgreSQL database
- Production hosted on Heroku

## Contributors
Play Play was written by [Tyler Schaffer](https://github.com/tschaffer1618) and [Leiya Kenney](https://github.com/leiyakenney) as a Back End Mod 4 project at Turing School of Software and Design.

