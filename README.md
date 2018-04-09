# Setup
1. Clone the project
https://github.com/sachi-sharma/polis-news-website.git

2. Install Node.js if not already installed

3. Install dependencies
- npm install react --save
- npm install react-router-dom --save
- npm install react-scripts --save
- npm install react-toggle-display --save
- npm install lowdb --save
- npm install react-icons --save

4. Start the application
- npm start

User registration and login
----------------------------

Current version of the application only allows a preregistered set of users to login.
Details of user credtentials can be modified in src/data/db.json

Valid users:
1.  Username: marcosbozza
    Password: polis
2.  Username: ndabaNdebele
    Password: polis
3.  Username: adichills
    Password: polis


News API
---------
1. Register with News Api and generate an api-key
   https://newsapi.org/
2. Update the api key in data/newsapikey.json


Known Issues
-------------
1. No logout
2. Direct URL access to the home page, without login
3.