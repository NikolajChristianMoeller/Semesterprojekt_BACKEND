# 2nd Semester Project - Backend

## Semesterprojekt Backend API Server

Online Database URL: jane-db.mysql.database.azure.com

## Link to deployed backend

https://semesterprojekt-server.azurewebsites.net/

## Link to deployed frontend

https://semesterprojekt-frontend.vercel.app/

## Installation

To run this application on your local machine:

First off you will need to setup a MySQL database locally. Then go through the steps below:

       1 - Clone the project and open it in your preferred code editor.

       2 - In your terminal, navigate to the project folder.

       3 - While in the project folder, in your terminal, run the following command  to install the necessary dependencies.

           	npm install

       4 - In the root of the project, create a .env file.

       5 - Setup credentials for the database you setup earlier. Define the following in the .env file:
               MYSQL_HOST= your host
               MYSQL_USER= your user
               MYSQL_PASSWORD= your password
               MYSQL_DATABASE= your database
               MYSQL_PORT= you port

       6 - Connect to the database through the app. While in the project folder, in your terminal, run the following command to start the server locally.

           	npm start

       7 - For CRUD functionality, without a frontend, a third party app like Postman is required.

       8 - Check out our frontend application and sync it with this backend.

       9 - All done!

## How to use the API via Azure, without a frontend

       1 - For CRUD functionality a third party app like Postman is required.

       2 - To access the application use endpoint as url in Postman or similar app:  https://semesterprojekt-server.azurewebsites.net/

## How to setup the mail service

       1 - Create an email account and add the following to your .env file:

        GMAIL_PASS= your email password
        GMAIL_USER= your email address

         * Note that you do not necessarily have to use gmail, this is just what we called the credentials.
