'use strict';

// vendor dependencies
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

// shared test variable(s)
let authHeaders;
let res002;
let resOutput001;
let resOutput002;
let resText001;
let resText002;
let sendBody001;
let sendBody002;

describe('{{MERLIN}} /media-group {id save} @ADMIN >>> ' +
    '(+) body - version only >>>', function() {

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

        // assign name
        sendBody001.name += timeStamp;

        request(targetServer)
            .post(util.format(targetEndpoint.mediaGroupCreate))
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

    before('save media-group - version only', function(done) {

        sendBody002 = {};

        // assign version
        sendBody002.version = resOutput001.version;

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

    it('version should be unchanged', function() {
        expect(resOutput002.version).to.equal(resOutput001.version);
    });

    it('response object property types should match spec', function() {
        expect(/^[a-f0-9]{32}$/.test(resOutput002.id)).to.be.true;
        expect(validator.isInt(resOutput002.refId + '')).to.be.true;
        expect(validator.isInt(resOutput002.version + '')).to.be.true;
        expect(resOutput002.status).to.be.oneOf([
            'pending', 'inactive', 'active'
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
            .to.equal(resOutput001.version); // check updated
        expect(resOutput002.status)
            .to.equal(resOutput001.status);
        expect(resOutput002.salesforceId)
            .to.equal(resOutput001.salesforceId);
        expect(resOutput002.type)
            .to.equal(resOutput001.type);
        expect(resOutput002.name)
            .to.equal(resOutput001.name); // check updated
        expect(resOutput002.description)
            .to.equal(resOutput001.description);
        expect(resOutput002.publishers)
            .to.eql(resOutput001.publishers);
        expect(resOutput002.advertisers)
            .to.eql(resOutput001.advertisers);
        expect(resOutput002.tagsUrlPrefix)
            .to.equal(resOutput001.tagsUrlPrefix);
        expect(resOutput002.manager)
            .to.equal(resOutput001.manager);
        expect(resOutput002.managerName)
            .to.equal(resOutput001.managerName);
        expect(resOutput002.managerEmail)
            .to.equal(resOutput001.managerEmail);
        expect(resOutput002.executive)
            .to.equal(resOutput001.executive);
        expect(resOutput002.executiveName)
            .to.equal(resOutput001.executiveName);
        expect(resOutput002.executiveEmail)
            .to.equal(resOutput001.executiveEmail);
        expect(resOutput002.lotame)
            .to.equal(resOutput001.lotame);
        expect(resOutput002.isApiPartner)
            .to.equal(resOutput001.isApiPartner);
        expect(resOutput002.tier)
            .to.equal(resOutput001.tier);
        // contact object
        expect(resOutput002.contact.company)
            .to.equal(resOutput001.contact.company);
        expect(resOutput002.contact.emailAddress)
            .to.equal(resOutput001.contact.emailAddress);
        expect(resOutput002.contact.firstName)
            .to.equal(resOutput001.contact.firstName);
        expect(resOutput002.contact.lastName)
            .to.equal(resOutput001.contact.lastName);
        expect(resOutput002.contact.phone)
            .to.equal(resOutput001.contact.phone);
        expect(resOutput002.contact.address1)
            .to.equal(resOutput001.contact.address1);
        expect(resOutput002.contact.address2)
            .to.equal(resOutput001.contact.address2);
        expect(resOutput002.contact.city)
            .to.equal(resOutput001.contact.city);
        expect(resOutput002.contact.state)
            .to.equal(resOutput001.contact.state);
        expect(resOutput002.contact.postalCode)
            .to.equal(resOutput001.contact.postalCode);
        expect(resOutput002.contact.country)
            .to.equal(resOutput001.contact.country);
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
