'use strict';

// vendor dependencies
const chance = require('chance').Chance();
const chai = require('chai');
const expect = chai.expect; // use bdd chai
const moment = require('moment');
const request = require('supertest-as-promised');
const util = require('util');
const validator = require('validator');

// runtime variables
const rootPath =
    process.env.ROOT_PATH;
const targetEndpoint =
    require(rootPath + '/config/merlin/endpoints');
const targetEnvironment =
    require(rootPath + '/config/merlin/' + process.env.NODE_ENV);
const usersTargetEnvironment =
    require(rootPath + '/config/users/' + process.env.NODE_ENV);
const targetServer =
    targetEnvironment.server;
const targetUser =
    usersTargetEnvironment.admin;
const merlinAuthHeaders =
    require(rootPath + '/helpers/merlin-auth-headers');
const requestTimeOut = 10000;
const timeStamp =
    '@' + moment().format('YYYY-MM-DDTHH:mm:ss.SS');

// fixture(s)
const setupFixture =
    require(rootPath + '/fixtures/common/media-group/create002');
const testFixture =
    require(rootPath + '/fixtures/common/media-group/save002');

// shared test variable(s)
let authHeaders;
let res002;
let resOutput001;
let resOutput002;
let resText001;
let resText002;
let sendBody001;
let sendBody002;

describe('{{MERLIN}} <SMOKE> /media-group {id save} @ADMIN >>> ' +
    '(+) body - all valid fields >>>', function() {

    // set time out for requests
    this.timeout(requestTimeOut);

    before('generate auth headers', function(done) {
        const genAuthHeaders =
            merlinAuthHeaders(targetUser);
        genAuthHeaders.then( function(headers) {
            authHeaders = headers;
            done();
        });
    });

    before('create media-group', function(done) {

        sendBody001 = Object.assign({}, setupFixture);

        // assing name
        sendBody001.name += timeStamp;

        request(targetServer)
            .post(targetEndpoint.mediaGroupCreate)
            .set(authHeaders)
            .send(sendBody001)
            .then( function(res) {
                // basic response verification
                expect(res.body).to.exist;
                expect(res.status).to.equal(201);

                // assign shared test variable(s)
                resText001 = JSON.parse(res.text);
                resOutput001 = resText001.output;

                // spot check response
                expect(/^[a-f0-9]{32}$/.test(resOutput001.id)).to.be.true;
                expect(resOutput001.name).to.have.length.of.at.most(128);
                done();
            })
            .catch( function(err) {
                done(err);
            });
    });

    before('save media-group - all valid fields', function(done) {
        sendBody002 = Object.assign({}, testFixture);

        sendBody002.version = resOutput001.version;
        sendBody002.name = resOutput001.name + '@2';

        // assign random lotame and salesforce-id
        sendBody002.lotame =
            chance.string({length: 32, alpha: true});
        sendBody002.salesforceId =
            chance.string({length: 16, alpha: true});

        request(targetServer)
            .post(util.format(targetEndpoint.mediaGroupSave, resOutput001.id))
            .set(authHeaders)
            .send(sendBody002)
            .then( function(res) {
                // basic response verification
                expect(res.body).to.exist;
                expect(res.status).to.equal(200);

                // assign shared test variable(s)
                res002 = res;
                resText002 = JSON.parse(res.text);
                resOutput002 = resText002.output;
                done();
            })
            .catch( function(err) {
                done(err);
            });
    });

    it('response should have status of 200', function() {
        expect(res002.status).to.equal(200);
    });

    it('notices and errors should not exist', function() {
        expect(resText002.notices).to.not.exist;
        expect(resText002.errors).to.not.exist;
    });

    it('version should be request object version + 1', function() {
        expect(resOutput002.version).to.equal(
            resOutput001.version + 1
        );
    });

    it('response object property types should match spec', function() {
        expect(/^[a-f0-9]{32}$/.test(resOutput002.id)).to.be.true;
        expect(validator.isInt(resOutput002.refId + '')).to.be.true;
        expect(validator.isInt(resOutput002.version + '')).to.be.true;
        expect(resOutput002.status).to.be.oneOf([
            'pending', 'inactive', 'active', 'deleted'
        ]);
        if (resOutput002.salesforceId !== null) {
            expect(resOutput002.salesforceId).to.have.length.of.at.most(32);
        }
        expect(resOutput002.name).to.have.length.of.at.most(128);
        if (resOutput002.description !== null) {
            expect(resOutput002.description).to.have.length.of.at.most(255);
        }
        if (resOutput002.publishers !== null) {
            expect(resOutput002.publishers).to.be.an('array');
            resOutput002.publishers.forEach(function(val) {
                expect(/^[a-f0-9]{32}$/.test(val.id)).to.be.true;
                expect(val.name).to.be.a('string');
            });
        }
        if (resOutput002.advertisers !== null) {
            expect(resOutput002.advertisers).to.be.an('array');
            resOutput002.advertisers.forEach(function(val) {
                expect(/^[a-f0-9]{32}$/.test(val.id)).to.be.true;
                expect(val.name).to.be.a('string');
            });
        }
        if (resOutput002.tagsUrlPrefix !== null) {
            expect(resOutput002.tagsUrlPrefix).to.have.length.of.at.most(64);
        }
        if (resOutput002.lotame !== null) {
            expect(resOutput002.lotame).to.have.length.of.at.most(48);
        }
        if (resOutput002.isApiPartner !== null) {
            expect(resOutput002.isApiPartner).to.be.a('boolean');
        }
        expect(validator.isInt(resOutput002.tier + '', {max: 9})).to.be.true;
        // contact object
        expect(resOutput002.contact).to.be.an('object');
        if (resOutput002.contact.company !== null) {
            expect(resOutput002.contact.company)
                .to.have.length.of.at.most(128);
        }
        if (resOutput002.contact.emailAddress !== null) {
            expect(validator
                .isEmail(resOutput002.contact.emailAddress)).to.be.true;
        }
        if (resOutput002.contact.firstName !== null) {
            expect(resOutput002.contact.firstName)
                .to.have.length.of.at.most(32);
        }
        if (resOutput002.contact.lastName !== null) {
            expect(resOutput002.contact.lastName)
                .to.have.length.of.at.most(32);
        }
        if (resOutput002.contact.phone !== null) {
            expect(resOutput002.contact.phone)
                .to.have.length.of.at.most(32);
        }
        if (resOutput002.contact.address1 !== null) {
            expect(resOutput002.contact.address1)
                .to.have.length.of.at.most(128);
        }
        if (resOutput002.contact.address2 !== null) {
            expect(resOutput002.contact.address2)
                .to.have.length.of.at.most(128);
        }
        if (resOutput002.contact.city !== null) {
            expect(resOutput002.contact.city)
                .to.have.length.of.at.most(64);
        }
        if (resOutput002.contact.state !== null) {
            expect(resOutput002.contact.state)
                .to.have.length.of.at.most(32);
        }
        if (resOutput002.contact.postalCode !== null) {
            expect(resOutput002.contact.postalCode)
                .to.have.length.of.at.most(32);
        }
        if (resOutput002.contact.country !== null) {
            expect(resOutput002.contact.country)
                .to.have.length.of.at.most(32);
        }
        // created and modified
        expect(validator.isISO8601(resOutput002.created)).to.be.true;
        expect(/^[a-f0-9]{32}$/.test(resOutput002.createdBy)).to.be.true;
        expect(validator.isISO8601(resOutput002.modified)).to.be.true;
        expect(/^[a-f0-9]{32}$/.test(resOutput002.modifiedBy)).to.be.true;
    });

    it('response object key values should match test object', function() {
        expect(resOutput002.id)
            .to.equal(resOutput001.id);
        expect(resOutput002.refId)
            .to.equal(resOutput001.refId);
        expect(resOutput002.version)
            .to.equal(resOutput001.version + 1 ); // check updated
        expect(resOutput002.status)
            .to.equal(resOutput001.status);
        expect(resOutput002.salesforceId)
            .to.equal(sendBody002.salesforceId); // check updated
        expect(resOutput002.name)
            .to.equal(sendBody002.name); // check updated
        expect(resOutput002.description)
            .to.equal(sendBody002.description); // check updated
        expect(resOutput002.publishers)
            .to.eql(resOutput001.publishers);
        expect(resOutput002.advertisers)
            .to.eql(resOutput001.advertisers);
        expect(resOutput002.tagsUrlPrefix)
            .to.equal(sendBody002.tagsUrlPrefix); // check updated
        expect(resOutput002.manager)
            .to.equal(resOutput001.manager); // check updated
        expect(resOutput002.executive)
            .to.equal(resOutput001.executive); // check updated
        expect(resOutput002.lotame)
            .to.equal(sendBody002.lotame); // check updated
        expect(resOutput002.isApiPartner)
            .to.equal(sendBody002.isApiPartner); // check updated
        expect(resOutput002.tier)
            .to.eql(sendBody002.tier); // check updated
        // contact object
        expect(resOutput002.contact.company)
            .to.equal(sendBody002.contact.company); // check updated
        expect(resOutput002.contact.emailAddress)
            .to.equal(sendBody002.contact.emailAddress); // check updated
        expect(resOutput002.contact.firstName)
            .to.equal(sendBody002.contact.firstName); // check updated
        expect(resOutput002.contact.lastName)
            .to.equal(sendBody002.contact.lastName); // check updated
        expect(resOutput002.contact.phone)
            .to.equal(sendBody002.contact.phone); // check updated
        expect(resOutput002.contact.address1)
            .to.equal(sendBody002.contact.address1); // check updated
        expect(resOutput002.contact.address2)
            .to.equal(sendBody002.contact.address2); // check updated
        expect(resOutput002.contact.city)
            .to.equal(sendBody002.contact.city); // check updated
        expect(resOutput002.contact.state)
            .to.equal(sendBody002.contact.state); // check updated
        expect(resOutput002.contact.postalCode)
            .to.equal(sendBody002.contact.postalCode); // check updated
        expect(resOutput002.contact.country)
            .to.equal(sendBody002.contact.country); // check updated
    });

    after('delete media-group', function(done) {
        request(targetServer)
            .del(util.format(targetEndpoint.mediaGroupDelete, resOutput001.id))
            .set(authHeaders)
            .then( function(res) {
                // basic response verification
                expect(res.body).to.exist;
                expect(res.status).to.equal(200);
                done();
            })
            .catch( function(err) {
                done(err);
            });
    });
});
