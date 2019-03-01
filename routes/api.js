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
	app.route('/api/issues/:project/')

		.get(function (req, res) {
			var project = req.params.project;
			project.replace(/[\W_]+/g, "").toLowerCase();
			const params = req.headers.referer.split('?');
			const search = params.length > 1 ? params[1] : '';
			if (search != '') {
				req.query = JSON.parse('{"' + search.replace(/&/g, '","').replace(/=/g, '":"') + '"}', function (key, value) { return key === "" ? value : decodeURIComponent(value) });
			}
			Issue.find(req.query || null).then((issues) => {
				return res.json(issues);
			}).catch(err => {
				return res.status(400);
			});
		})
		.post(function (req, res, next) {
			var project = req.params.project;
			project.replace(/[\W_]+/g, "").toLowerCase();
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

		.put(function (req, res) {
			var project = req.params.project;
			project.replace(/[\W_]+/g, "").toLowerCase();
			if (!req.body._id) {
				return res.status(400).send('_id error');
			} else {
				if (Object.keys(req.body).length < 2) {
					return res.status(200).send('no updated field sent');
				} else {
					Issue.findById(req.body._id)
						.then((issue) => {
							let newIssue = Object.assign(issue, req.body);
							newIssue.updated_on = Date.now();
							newIssue.project = project;
							new Issue(newIssue).save();
							return res.send('successfully updated');
						}).catch(err => {
							console.error(err)
							return res.status(500).send(`could not update ${req.body._id}`);
						});
				}
			}
		})

		.delete(function (req, res) {
			if (!req.body._id) {
				res.status(404).send('_id error');
			} else {
				Issue.findOneAndDelete(req.body._id)
					.then((data) => {
						if (data) {
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
