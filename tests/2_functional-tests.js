/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       (if additional are added, keep them at the very end!)
*/

const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
chai.use(chaiHttp);
const server = require('../server');

suite('POST /api/issues/{project} => object with issue data', function() {
  test('Every field filled in', function() {
    return chai.request(server)
        .post('/api/issues/test')
        .send({
          issue_title: 'Title',
          issue_text: 'text',
          created_by: 'Functional Test - Every field filled in',
          assigned_to: 'Chai and Mocha',
          status_text: 'In QA',
        }).then((res) => {
          assert.equal(res.status, 200);
          const body = res.body;
          assert.equal(body.issue_title, 'Title');
          assert.equal(body.issue_text, 'text');
          assert.equal(body.created_by, 'Functional Test - Every field filled in');
          assert.equal(body.assigned_to, 'Chai and Mocha');
          assert.equal(body.status_text, 'In QA');
          assert.equal(body.open, true);
          assert.exists(body._id);
          assert.exists(body.created_on);
          assert.exists(body.updated_on);
        }).catch((err) => {
          throw err;
        });
  });

  test('Required fields filled in', function() {
    return chai.request(server)
        .post('/api/issues/test')
        .send({
          issue_title: 'Title2',
          issue_text: 'text2',
          created_by: 'Functional Test - Required fields filled in',
        })
        .then((res) => {
          assert.equal(res.status, 200);
          const body = res.body;
          assert.equal(body.issue_title, 'Title2');
          assert.equal(body.issue_text, 'text2');
          assert.equal(body.created_by, 'Functional Test - Required fields filled in');
          assert.isEmpty(body.assigned_to);
          assert.isEmpty(body.status_text);
          assert.exists(body._id);
          assert.equal(body.open, true);
          assert.exists(body.created_on);
          assert.exists(body.updated_on);
        })
        .catch((err) => {
          throw err;
        });
  });

  test('Missing required fields', function() {
    return chai.request(server)
        .post('/api/issues/test')
        .send({
          assigned_to: 'Chai and Mocha',
          status_text: 'In QA',
        })
        .then((res) => {
          assert.equal(res.status, 400);
        })
        .catch((err) => {
          throw err;
        });
  });
});

suite('PUT /api/issues/{project} => text', function() {
  test('No body', function() {
    return chai.request(server)
        .put('/api/issues/test')
        .send({_id: '5c7846ea46011e2aed5f9705'})
        .then((res) => {
          assert.equal(res.text, 'no updated field sent');
          assert.equal(res.status, 200);
        }).catch((err) => {
          throw err;
        });
  });

  test('One field to update', function() {
    return chai.request(server)
        .post('/api/issues/test')
        .send({
          issue_title: 'One field to update',
          issue_text: 'Update Issue Text',
          created_by: 'One field to update',
        })
        .then((res) => {
          const idToUpdate = res.body._id;
          return chai.request(server)
              .put('/api/issues/test')
              .send({_id: idToUpdate, issue_text: 'One field to update'})
              .then((res) => {
                assert.equal(res.text, 'successfully updated');
                assert.equal(res.status, 200);
              }).catch((err) => {
                throw err;
              });
        }).catch((err) => {
          throw err;
        });
  });

  test('Multiple fields to update', function() {
    return chai.request(server)
        .post('/api/issues/test')
        .send({
          issue_title: 'One field to update',
          issue_text: 'Update Issue Text',
          created_by: 'One field to update',
        })
        .then((res) => {
          const idToUpdate = res.body._id;
          return chai.request(server)
              .put('/api/issues/test')
              .send({_id: idToUpdate, issue_text: 'Multiple fields to update', assigned_to: 'I dont know', open: false})
              .then((res) => {
                assert.equal(res.text, 'successfully updated');
                assert.equal(res.status, 200);
              }).catch((err) => {
                throw err;
              });
        }).catch((err) => {
          throw err;
        });
  });
});

suite('GET /api/issues/{project} => Array of objects with issue data', function() {
  test('No filter', function() {
    return chai.request(server)
        .get('/api/issues/test')
        .then((res) => {
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
        }).catch((err) => {
          throw err;
        });
  });

  test('One filter', function() {
    return chai.request(server)
        .post('/api/issues/test')
        .send({
          issue_title: 'One filter query',
          issue_text: 'Issue text',
          created_by: 'Get suite test - one filter',
        }).then((res) => {
          const filterId = res.body._id;
          return chai.request(server)
              .get('/api/issues/test')
              .query({_id: filterId})
              .then((res) => {
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
                assert.strictEqual(res.body[0]._id, filterId);
                assert.strictEqual(res.body[0].issue_title, 'One filter query');
                assert.strictEqual(res.body[0].issue_text, 'Issue text');
                assert.strictEqual(res.body[0].created_by, 'Get suite test - one filter');
              }).catch((err) => {
                throw err;
              });
        }).catch((err) => {
          throw err;
        });
  });

  test('Multiple filters (test for multiple fields you know will be in the db for a return)', function() {
    return chai.request(server)
        .post('/api/issues/test')
        .send({
          issue_title: 'Multiple filter query',
          issue_text: 'Issue text',
          created_by: 'Get suite test - Multiple filter',
        }).then((res) => {
          const filterId = res.body._id;
          return chai.request(server)
              .get('/api/issues/test')
              .query({issue_title: 'Multiple filter query', issue_text: 'Issue text',
                created_by: 'Get suite test - Multiple filter', _id: filterId})
              .then((res) => {
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
                assert.strictEqual(res.body[0]._id, filterId);
                assert.strictEqual(res.body[0].issue_title, 'Multiple filter query');
                assert.strictEqual(res.body[0].issue_text, 'Issue text');
                assert.strictEqual(res.body[0].created_by, 'Get suite test - Multiple filter');
              }).catch((err) => {
                throw err;
              });
        }).catch((err) => {
          throw err;
        });
  });
});

suite('DELETE /api/issues/{project} => text', function() {
  test('No _id', function() {
    return chai.request(server)
        .delete('/api/issues/test')
        .send({})
        .then((res) => {
          assert.equal(res.status, 404);
          assert.equal(res.error.text, '_id error');
        }).catch((err) => {
          throw err;
        });
  });

  test('Valid _id', function() {
    return chai.request(server)
        .post('/api/issues/test')
        .send({
          issue_title: 'Delete Issue',
          issue_text: 'Delete Issue Text',
          created_by: 'Functional Test - Valid _id',
        })
        .then((res) => {
          const idToDelete = res.body._id;
          return chai.request(server)
              .delete('/api/issues/test')
              .send({_id: idToDelete})
              .then((res) => {
                assert.equal(res.status, 200);
                assert.equal(res.text, `deleted ${idToDelete}`);
              }).catch((err) => {
                throw err;
              });
        }).catch((err) => {
          throw err;
        });
  });
});

