# Play Play

## Introduction
Play Play is an Express node.js RESTful API that returns detailed song data. A user can favorite songs and delete favorited songs.

## Contributors
Play Play was written by Tyler Schaffer and Leiya Kenney as a Back End Mod 4 project at Turing School of Software and Design.

## Local Setup
1. Fork and clone down this repo
2. Install all dependences by navigating to the root directory in your terminal and running `npm install`
3. Run `psql` in your terminal and run `CREATE DATABASE favorite_songs_dev` to create your PostgreSQL database
4. Run table migrations with `knex migrate:latest`
5. Seed the database with `knex seed:run`

## Heroku Production Link
- This app and its production endpoints can be accessed at https://play-play-ts-lk.herokuapp.com/

## Tech Stack
- Play Play is a node.js application built with the Express framework
- Knex
- PostgreSQL database
- Production hosted on Heroku

## Endpoints

**1.** `GET /api/v1/favorites/:id`
  - Summary: Returns id, title, artist name, genre, and Musixmatch rating for a specific favorited song
  - Required Request Body: 
  ```
  ```
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
**2.** `DELETE /api/v1/favorites/:id`
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
