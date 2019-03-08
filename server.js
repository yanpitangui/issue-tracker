'use strict';
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const helmet = require('helmet');

const apiRoutes = require('./routes/api.js');
const fccTestingRoutes = require('./routes/fcctesting.js');
const runner = require('./test-runner');

const mongoose = require('mongoose');


const app = express();
mongoose.connect(process.env.DB, {useNewUrlParser: true})
    .then(() => {
      app.use(helmet());
      app.use('/public', express.static(process.cwd() + '/public'));

      app.use(cors({origin: '*'})); // For FCC testing purposes only


      app.use(bodyParser.json());
      app.use(bodyParser.urlencoded({extended: false}));

      // Sample front-end
      app.route('/:project/')
          .get(function(req, res) {
            res.sendFile(process.cwd() + '/views/issue.html');
          });

      // Index page (static HTML)
      app.route('/')
          .get(function(req, res) {
            res.sendFile(process.cwd() + '/views/index.html');
          });

      // For FCC testing purposes
      fccTestingRoutes(app);

      // Routing for API
      apiRoutes(app, mongoose);

      // 404 Not Found Middleware
      app.use(function(req, res, next) {
        res.status(404)
            .type('text')
            .send('Not Found');
      });

      const PORT = process.env.PORT || 3000;
      // Start our server and tests!
      module.exports = app.listen(PORT, function() {
        console.log('Listening on port ' + PORT);
        if (process.env.NODE_ENV === 'test') {
          console.log('Running Tests...');
          setTimeout(function() {
            try {
              runner.run();
            } catch (e) {
              const error = e;
              console.log('Tests are not valid:');
              console.log(error);
            }
          }, 3500);
        }
      });
    })
    .catch((err) => {
      console.log(err);
      process.exit(1);
    });
