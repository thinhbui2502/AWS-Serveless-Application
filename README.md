# Project: Serverless TODO
This application will allow creating/removing/updating/fetching TODO items. Each TODO item can optionally have an attachment image. Each user only has access to TODO items that they have created.
# How to run the application

## Backend

To deploy an application run the following commands:

```
cd backend
npm install
sls deploy -v
```

## Frontend

The project is based on the given environment variables in the **./client/.env** file as below:

```sh
REACT_APP_AUTH0_DOMAIN=dev-psgwcpa0ttqk80ay.us.auth0.com
REACT_APP_AUTH0_CLIENT_ID=OtBjbOjDZR95dWPgciW5dGfPvBXkn4BG
REACT_APP_API_ENDPOINT=https://19fkcsp9qk.execute-api.us-east-1.amazonaws.com/dev
```
Please copy-paste the above variables to your ***./client/.env*** file. 
And then run the following commands in the ***/client*** package:

```
npm install
npm run start
```


