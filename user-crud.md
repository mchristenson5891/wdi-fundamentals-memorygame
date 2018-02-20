# React Application with JWT Authentication from Scratch

## Create a NodeJS + Express + React for development AND production on Heroku 

1. Create your NodeJS + Express backend, something like:

   ```bash
   # in the terminal, from your workspace:
   mkdir react-express-jwt
   cd react-express-jwt
   touch server.js
   npm init
   # ... ... ...
   npm install --save express
   ```

2. In your `server.js`, add the basic express app setup code:

   ```javascript
   const
     express = require('express'),
     app = express(),
     PORT = process.env.PORT || 3001

   // when deployed to Heroku, our react app will be automatically be
   // compiled and the static files (html, js, css) will be placed in
   // /client/build for us:
   app.use(express.static(`${__dirname}/client/build`))

   app.get('/api', (req, res) => {
     res.json({message: "api root."})
   })

   // This should be the last route declared in our app. Once deployed to Heroku, any requests to a route NOT declared above will serve the static react application.
   app.get('*', (req, res) => {
   	res.sendFile(`${__dirname}/client/build/index.html`)
   })

   app.listen(PORT, (err) => {
     console.log(err || `Server running on port ${PORT}.`)
   })
   ```

3. In `package.json` located at the root of this express app, add the following `heroku-postbuild` script to the json's `"scripts"` key (don't forget to add a comma to the line just before it!):

   ```json
   "scripts": {
       "test": "echo \"Error: no test specified\" && exit 1",
       "start": "node server.js",
       "heroku-postbuild": "cd client && npm install --only=dev && npm install && npm run build"
   }
   ```

   This will ensure that each time we push to Heroku, when it is done building the express app, it will also make sure to automatically install all of the react app's dependencies, and build the client react app static files too.

4. **Set up the client application within this same directory**:

   ```bash
   # from workspace/react-express-jwt
   create-react-app client
   ```

   This will create and install the react client application within your current node app directory, in a subdirectory called `client`.

5. In `/client/package.json` (this is the react app's dedicated package.json), **add a "proxy" key** to the main JSON object, with a value pointing to the url of the main node app. Remember, our setup above puts the API application on port *3001* while we're in development, so that our client app can concurrently run on port *3000*. Any time a request is made from the client app that it doesn't know how to handle, the request will automatically be passed to the proxy url to be handled there:

   ```JSON
   {
     "name": "client",
     "version": "0.1.0",
     "private": true,
     "dependencies": {
       "react": "^16.0.0",
       "react-dom": "^16.0.0",
       "react-scripts": "1.0.14"
     },
     "scripts": {
       "start": "react-scripts start",
       "build": "react-scripts build",
       "test": "react-scripts test --env=jsdom",
       "eject": "react-scripts eject"
     },
     "proxy": "http://localhost:3001"
   }
   ```

6. From the main node app directory `react-express-jwt`, run `nodemon` to start up the API server. You can test the api by navigating to `localhost:3001/api`. You should see the api response come back as json.

7. From the client app directory `react-express-jwt/client`, **in a new terminal tab** run `npm start` to boot up the client app server.

8. You now have the ability to easily make API calls from your client app. All you need to do is install an http client to make those AJAX requests. `axios` is one such client, so from the client app directory
   `react-express-jwt/client`:

   ```bash
   npm install --save axios
   ```

9. Then anywhere in your client app, you can import axios and make API calls as needed for example, in 
   `react-express-jwt/client/src/App.js`:

   ```javascript
   import React, { Component } from 'react';
   import './App.css';
   // import the axios module:
   import axios from 'axios'

   // make a test API call:
   axios({method: 'get', url: '/api'})
   	.then((res) => { console.log(res.data) })
   ```

   once the file is saved, you should see `{message: "api root."}` in the browser console, and you're all set to communicate between your client and api server!

## Create a User model and full CRUD access through your API

1. Create a models folder at the root of the express app `react-express-jwt/models` and inside of this directory create
a `User.js` file (`react-express-jwt/models/User.js`).
Inside of this file put following code for the user model. Don't forget to `npm install --save mongoose bcrypt-nodejs`

```Javascript
const
    mongoose = require('mongoose'),
    bcrypt = require('bcrypt-nodejs'),
    userSchema = new mongoose.Schema({
        name: { type: String },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true }
    })

// adds a method to a user document object to create a hashed password
userSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8))
}

// adds a method to a user document object to check if provided password is correct
userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.password)
}

// middleware: before saving, check if password was changed,
// and if so, encrypt new password before saving:
userSchema.pre('save', function(next) {
    if(this.isModified('password')) {
        this.password = this.generateHash(this.password)
    }
    next()
})

const User = mongoose.model('User', userSchema)
module.exports = User
```

2. Create a users controller file in `react-express-jwt/controllers/users.js` and create all the typical CRUD actions, the following code will do.

```Javascript
const User = require('../models/User.js')

module.exports = {
	// list all users
	index: (req, res) => {
		User.find({}, (err, users) => {
			res.json(users)
		})
	},

	// get one user
	show: (req, res) => {
		console.log("Current User:")
		console.log(req.user)
		User.findById(req.params.id, (err, user) => {
			res.json(user)
		})
	},

	// create a new user
	create: (req, res) => {
		User.create(req.body, (err, user) => {
			if(err) return res.json({success: false, code: err.code})

			res.json({success: true, message: "User created."})
		})
	},

	// update an existing user
	update: (req, res) => {
		User.findById(req.params.id, (err, user) => {
			Object.assign(user, req.body)
			user.save((err, updatedUser) => {
				res.json({success: true, message: "User updated.", user})
			})
		})
	},

	// delete an existing user
	destroy: (req, res) => {
		User.findByIdAndRemove(req.params.id, (err, user) => {
			res.json({success: true, message: "User deleted.", user})
		})
	},

	// the login route
	authenticate: (req, res) => {
		// check if the user exists
		User.findOne({email: req.body.email}, (err, user) => {
			// if there's no user or the password is invalid
			if(!user || !user.validPassword(req.body.password)) {
				// deny access
				return res.json({success: false, message: "Invalid credentials."})
			}

			res.json({success: true, message: "User authenticated."})
		})
	}
}
```

3. Create user routes in `react-express-jwt/master/routes/users.js` and put the following code
```Javascript
const
	express = require('express'),
	usersRouter = new express.Router(),
	usersCtrl = require('../controllers/users.js'),

usersRouter.route('/')
	.get(usersCtrl.index)
	.post(usersCtrl.create)

usersRouter.post('/authenticate', usersCtrl.authenticate)

usersRouter.route('/:id')
	.get(usersCtrl.show)
	.patch(usersCtrl.update)
	.delete(usersCtrl.destroy)

module.exports = usersRouter
```

4. Update your `server.js` file to use the user routes by importing it along all the other modules you need (i.e. mongoose, logger, bodyParser, etc). Do an npm install for all of the new modules you'll be using `npm install --save dotenv morgan body-parser`. Also connect to mongoose (don't forget to have the `mongod` process running).

Verify that all the routes work, after updating your `server.js` file to look like code that follows.

```Javascript
const
	dotenv = require('dotenv').load(),
	express = require('express'),
	app = express(),
	logger = require('morgan'),
	bodyParser = require('body-parser'),
	mongoose = require('mongoose'),
	MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost/react-express-jwt',
	PORT = process.env.PORT || 3001,
	usersRoutes = require('./routes/users.js')

mongoose.connect(MONGODB_URI, (err) => {
	console.log(err || `Connected to MongoDB.`)
})

app.use(express.static(`${__dirname}/client/build`))
app.use(logger('dev'))
app.use(bodyParser.json())

app.get('/api', (req, res) => {
	res.json({message: "API root."})
})

app.use('/api/users', usersRoutes)

app.use('*', (req, res) => {
	res.sendFile(`${__dirname}/client/build/index.html`)
})

app.listen(PORT, (err) => {
	console.log(err || `Server running on port ${PORT}.`)
})
```