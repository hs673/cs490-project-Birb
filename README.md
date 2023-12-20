# cs490-project-Birb
Repository for CS490 Project - Crush It. \
Daily Task Management Web App built using the MERN Stack.
Deployed App Link: https://crush-it-td03.onrender.com/ 


## How to Run

When cloning or pulling the repo, follow these steps:

Database Server:
```
cd cs490-project-Birb/server
npm install
node server.js
```

Web Server:
```
cd cs490-project-Birb/crush-it
npm install
npm start
```

### `npm install`

Installs all necesssary dependencies from package.json \
Failing to do this may result in a Module not Found Error.


### `node server.js`

Starts server that connects to MongoDB. \
Failing to do this step will result in a Fail to Fetch Error in the web app . 

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.
