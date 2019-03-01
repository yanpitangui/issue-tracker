/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       (if additional are added, keep them at the very end!)
*/

var chaiHttp = require('chai-http');
var chai = require('chai');
var assert = chai.assert;
var server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function () {

	suite('POST /api/issues/{project} => object with issue data', function () {

		test('Every field filled in', function (done) {
			chai.request(server)
				.post('/api/issues/test')
				.send({
					issue_title: 'Title',
					issue_text: 'text',
					created_by: 'Functional Test - Every field filled in',
					assigned_to: 'Chai and Mocha',
					status_text: 'In QA'
				})
				.end(function (err, res) {
					assert.equal(res.status, 200);
					let body = res.body;
					assert.equal(body.issue_title, 'Title');
					assert.equal(body.issue_text, 'text');
					assert.equal(body.created_by, 'Functional Test - Every field filled in');
					assert.equal(body.assigned_to, 'Chai and Mocha');
					assert.equal(body.status_text, 'In QA');
					assert.equal(body.open, true);
					assert.exists(body._id);
					assert.exists(body.created_on);
					assert.exists(body.updated_on);
					done();
				});
		});

		test('Required fields filled in', function (done) {
			chai.request(server)
				.post('/api/issues/test')
				.send({
					issue_title: 'Title2',
					issue_text: 'text2',
					created_by: 'Functional Test - Required fields filled in'
				})
				.end(function (err, res) {
					assert.equal(res.status, 200);
					let body = res.body;
					assert.equal(body.issue_title, 'Title2');
					assert.equal(body.issue_text, 'text2');
					assert.equal(body.created_by, 'Functional Test - Required fields filled in');
					assert.isEmpty(body.assigned_to);
					assert.isEmpty(body.status_text);
					assert.exists(body._id);
					assert.equal(body.open, true);
					assert.exists(body.created_on);
					assert.exists(body.updated_on);
					done();
				});
		});

		test('Missing required fields', function (done) {
			chai.request(server)
				.post('/api/issues/test')
				.send({
					assigned_to: 'Chai and Mocha',
					status_text: 'In QA'
				})
				.end(function (err, res) {
					assert.equal(res.status, 400);
					done();
				});
		});

	});

	suite('PUT /api/issues/{project} => text', function () {

		test('No body', function (done) {
			chai.request(server)
				.put('/api/issues/test')
				.send({ _id: '5c7846ea46011e2aed5f9705' })
				.end(function (err, res) {
					assert.equal(res.text, 'no updated field sent');
					assert.equal(res.status, 200);
					done();
				});
		});

		test('One field to update', function (done) {
			chai.request(server)
				.post('/api/issues/test')
				.send({
					issue_title: 'One field to update',
					issue_text: 'Update Issue Text',
					created_by: 'One field to update'
				})
				.end(function (err, res) {
					const idToUpdate = res.body._id;
					chai.request(server)
						.put('/api/issues/test')
						.send({ _id: idToUpdate, issue_text: 'One field to update' })
						.end(function (err, res) {
							assert.equal(res.text, 'successfully updated');
							assert.equal(res.status, 200);
							done();
						});
				});

		});

		test('Multiple fields to update', function (done) {
			chai.request(server)
				.post('/api/issues/test')
				.send({
					issue_title: 'One field to update',
					issue_text: 'Update Issue Text',
					created_by: 'One field to update'
				})
				.end(function (err, res) {
					const idToUpdate = res.body._id;
					chai.request(server)
						.put('/api/issues/test')
						.send({ _id: idToUpdate, issue_text: 'Multiple fields to update', assigned_to: 'I dont know', open: false })
						.end(function (err, res) {
							assert.equal(res.text, 'successfully updated');
							assert.equal(res.status, 200);
							done();
						});
				});

		});

	});

    /*suite('GET /api/issues/{project} => Array of objects with issue data', function() {
      
      test('No filter', function(done) {
        chai.request(server)
        .get('/api/issues/test')
        .query({})
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.isArray(res.body);
          assert.property(res.body[0], 'issue_title');
          assert.property(res.body[0], 'issue_text');
          assert.property(res.body[0], 'created_on');
          assert.property(res.body[0], 'updated_on');
          assert.property(res.body[0], 'created_by');
          assert.property(res.body[0], 'assigned_to');
          assert.property(res.body[0], 'open');
          assert.property(res.body[0], 'status_text');
          assert.property(res.body[0], '_id');
          done();
        });
      });
      
      test('One filter', function(done) {
        done();
      });
      
      test('Multiple filters (test for multiple fields you know will be in the db for a return)', function(done) {
        done();
      });
      
    });
    */
	suite('DELETE /api/issues/{project} => text', function () {

		test('No _id', function (done) {
			chai.request(server)
				.delete('/api/issues/test')
				.send({})
				.end(function (err, res) {
					assert.equal(res.status, 404);
					assert.equal(res.error.text, '_id error');
					done();
				});

		});

		test('Valid _id', function (done) {
			chai.request(server)
				.post('/api/issues/test')
				.send({
					issue_title: 'Delete Issue',
					issue_text: 'Delete Issue Text',
					created_by: 'Functional Test - Valid _id'
				})
				.end(function (err, res) {
					const idToDelete = res.body._id;
					chai.request(server)
						.delete('/api/issues/test')
						.send({ _id: idToDelete })
						.end(function (err, res) {
							assert.equal(res.status, 200);
							assert.equal(res.text, `deleted ${idToDelete}`);
							done();
						});
				});

		});

	});

});
