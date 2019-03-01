/*
*
*
*       Complete the API routing below
*
*
*/

'use strict';

var expect = require('chai').expect;


module.exports = function (app, mongoose) {
  const Issue = require('../models/issues')(mongoose);
  app.route('/api/issues/:project')
  
    .get(function (req, res, next){
      var project = req.params.project;
      project.replace(/[\W_]+/g,"").toLowerCase();
      //req.query.project = project;
      console.log(req.query);
      Issue.find(req.query).then((issues) => {
        res.json(issues);
        return next();
      }).catch(err =>{
        res.status(400);
        return next(err);
      });
    })
    .post(function (req, res, next){
      var project = req.params.project;
      project.replace(/[\W_]+/g,"").toLowerCase();
      req.body.project = project;
      Issue.create(req.body)
        .then((issue) => {
          res.json(issue);
          return next();
        })
        .catch(err => { 
          res.status(400);
          return next(err);
      });
    })
    
    .put(function (req, res, next){
      var project = req.params.project;
      project.replace(/[\W_]+/g,"").toLowerCase();
      if(!req.body._id) {
        res.status(400).send('_id error');
        return next();
      } else {
        if(Object.keys(req.body).length<2){
          res.status(200).send('no updated field sent');
          return next();
        } else {
          Issue.findById(req.body._id)
          .then((issue) => {
            let newIssue = Object.assign(issue, req.body);
            newIssue.updated_on = Date.now();
            newIssue.project = project;
            new Issue(newIssue).save();
            res.send('successfully updated');
            return next();
        }).catch(err => {   
            console.error(err)
            res.status(500).send(`could not update ${req.body._id}`);
            return next(err);
          });
        }
        } 
    })
    
    .delete(function (req, res){
      var project = req.params.project;
      if(!req.body._id) {
        res.status(404).send('_id error');
      } else {
        Issue.findOneAndDelete(req.body._id)
          .then((data) => {
            if(data) {
              res.status(200).send(`deleted ${req.body._id}`);
            } else {
              res.status(200).send(`could not delete ${req.body._id}`);       
            }
          })
          .catch(err => {
            console.error(err)
            res.status(500).send(`could not delete ${req.body._id}`); 
        });
      }
    });
    
};
