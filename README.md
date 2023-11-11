# Face Recognition Service

Simple service with frontend to add faces and backend to check if face is matching

## Before starting

- Add folder /faces in root
- copy and change .env.example to .env and change to your likings

## Usage

Start off with building the frontend project

```bash
npm run build
```

Then start the service and you're good to go

```bash
npm run server
```

### When up and running

#### Adding face

Go to `http://localhost:4001/photo`(or whatever you have in your .env, this is the default)
Here you can take photos of your face and upload to the service.

#### Matching face

Send base64 version of an image to `http://localhost:4001/api/face` and you'll get a response back if there is a match or not and a name
