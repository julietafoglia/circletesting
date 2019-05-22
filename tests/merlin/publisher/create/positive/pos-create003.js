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
const setupFixture001 =
    require(rootPath + '/fixtures/common/media-group/create001');
const testFixture =
    require(rootPath + '/fixtures/common/publisher/create003');

// shared test variable(s)
let authHeaders;
let res002;
let resOutput001;
let resOutput002;
let resText001;
let resText002;
let sendBody001;
let sendBody002;

describe('{{MERLIN}} /publisher {create} >>> ' +
    '(+) body - null non-required fields >>>', function() {

    // set timeout for test suite
    this.timeout(requestTimeOut);

    before('generate auth headers', function(done) {

        // generate auth headers
        const genAuthHeaders =
            merlinAuthHeaders(targetUser);
        genAuthHeaders.then( function(headers) {
            authHeaders = headers;
            done();
        });
    });

    before('create media group - minimum required', function(done) {

        sendBody001 = Object.assign({}, setupFixture001);

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

    before('create publisher - null non-required', function(done) {

        sendBody002 = Object.assign({}, testFixture);

        // assign name and media-group to publisher
        sendBody002.name += timeStamp;
        sendBody002.mediaGroup = resOutput001.id;

        request(targetServer)
            .post(util.format(targetEndpoint.publisherCreate))
            .set(authHeaders)
            .send(sendBody002)
            .then( function(res) {
                // basic response verification
                expect(res.body).to.exist;
                expect(res.status).to.equal(201);

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

    it('response should have status of 201', function() {
        expect(res002.status).to.equal(201);
    });

    it('notices and errors should not exist', function() {
        expect(resText002.notices).to.not.exist;
        expect(resText002.errors).to.not.exist;
    });

    it('response object property types should match spec', function() {
        expect(/^[a-f0-9]{32}$/.test(resOutput002.id)).to.be.true;
        expect(validator.isInt(resOutput002.refId + '')).to.be.true;
        expect(validator.isInt(resOutput002.version + '')).to.be.true;
        expect(/^[a-f0-9]{32}$/.test(resOutput002.mediaGroup)).to.be.true;
        expect(resOutput002.mediaGroupName).to.have.length.of.at.most(255);
        expect(resOutput002.status).to.be.oneOf([
            'pending', 'inactive', 'active'
        ]);
        if (resOutput002.newsletters !== null) {
            expect(resOutput002.newsletters).to.be.an('array');
        }
        if (resOutput002.esp !== null) {
            expect(validator.isInt(resOutput002.esp + '')).to.be.true;
        }
        if (resOutput002.espName !== null) {
            expect(resOutput002.espName).to.have.length.of.at.most(48);
        }
        expect(validator.isInt(resOutput002.category + '')).to.be.true;
        expect(resOutput002.categoryName).to.have.length.of.at.most(255);
        if (resOutput002.executive !== null) {
            expect(/^[a-f0-9]{32}$/.test(resOutput002.executive)).to.be.true;
        }
        expect(resOutput002.name).to.have.length.of.at.most(255);
        expect(resOutput002.description).to.be.a('string');
        if (resOutput002.externalId !== null) {
            expect(resOutput002.externalId).to.have.length.of.at.most(32);
        }
        expect(resOutput002.domain).to.have.length.of.at.most(128);
        expect(resOutput002.tagsUrlPrefix).to.have.length.of.at.most(128);
        if (resOutput002.liveramp !== null) {
            expect(resOutput002.liveramp).to.be.an('object');
        }
        if (resOutput002.emailTagReplacement !== null) {
            expect(resOutput002.emailTagReplacement)
                .to.have.length.of.at.most(128);
        }
        if (resOutput002.placementTagReplacement !== null) {
            expect(resOutput002.placementTagReplacement)
                .to.have.length.of.at.most(128);
        }
        if (resOutput002.contactEmails !== null) {
            expect(resOutput002.contactEmails).to.be.an('array');
            resOutput002.contactEmails.forEach( function(value) {
                expect(validator.isEmail(value)).to.be.true;
            });
        }
        if (resOutput002.categories !== null) {
            expect(resOutput002.categories).to.be.an('array');
        }
        if (resOutput002.blocklistCategories !== null) {
            expect(resOutput002.blocklistCategories).to.be.an('array');
        }
        if (resOutput002.iabCreativeAttribute !== null) {
            expect(validator.isInt(resOutput002.iabCreativeAttribute + '',
                {'max': 99})).to.be.true;
            expect(resOutput002.iabCreativeAttribute).to.be.an('array');
        }
        if (resOutput002.targetedDomains !== null) {
            expect(resOutput002.targetedDomains).to.be.an('array');
        }
        if (resOutput002.keyValues !== null) {
            expect(resOutput002.keyValues).to.be.an('object');
        }
        if (resOutput002.keyValuesCount !== null) {
            expect(validator.isInt(resOutput002.keyValuesCount + ''))
                .to.be.true;
        }
        // ssp control object
        expect(resOutput002.sspControl).to.be.an('object');
        if (resOutput002.sspControl.exchangeAllow !== null) {
            expect(resOutput002.sspControl.exchangeAllow)
                .to.be.a('boolean');
        }
        if (resOutput002.sspControl.applyBlocklists !== null) {
            expect(resOutput002.sspControl.applyBlocklists)
                .to.be.a('boolean');
        }
        if (resOutput002.sspControl.rtbAllow !== null) {
            expect(resOutput002.sspControl.rtbAllow)
                .to.be.a('boolean');
        }
        if (resOutput002.sspControl.rtbTransparency !== null) {
            expect(resOutput002.sspControl.rtbTransparency)
                .to.be.a('boolean');
        }
        if (resOutput002.sspControl.rtbFloor !== null) {
            expect(/^(\d{1,10}\.?\d{0,2})$/
                .test(resOutput002.sspControl.rtbFloor + '')).to.be.true;
        }
        if (resOutput002.sspControl.demandAllocationDirect !== null) {
            expect(validator.isInt(
                resOutput002.sspControl.demandAllocationDirect + ''
            )).to.be.true;
        }
        if (resOutput002.sspControl.demandAllocationHouse !== null) {
            expect(validator.isInt(
                resOutput002.sspControl.demandAllocationHouse + ''
            )).to.be.true;
        }
        // contact object
        expect(resOutput002.contact).to.be.an('object');
        if (resOutput002.contact.company !== null) {
            expect(resOutput002.contact.company)
                .to.have.length.of.at.most(128);
        }
        if (resOutput002.contact.email !== null) {
            expect(validator.isEmail(resOutput002.contact.email)).to.be.true;
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

    it('response object null key values should match test object', function() {
        expect(resOutput002.mediaGroup)
            .to.equal(sendBody002.mediaGroup);
        expect(resOutput002.name)
            .to.equal(sendBody002.name);
        expect(resOutput002.description)
            .to.equal(sendBody002.description);
        expect(resOutput002.mediaGroupName)
            .to.equal(sendBody001.name);
        expect(resOutput002.category)
            .to.equal(sendBody002.category);
        expect(resOutput002.status)
            .to.be.oneOf(['active', 'pending', 'inactive', 'created']);
        expect(resOutput002.domain)
            .to.equal(sendBody002.domain);
        expect(resOutput002.tagsUrlPrefix)
            .to.equal(sendBody002.tagsUrlPrefix);
        // Non-required fields should be either null or the default value
        expect(resOutput002.admin)
            .to.equal(null);
        expect(resOutput002.newsletters)
            .to.eql(null);
        expect(resOutput002.esp)
            .to.equal(null);
        expect(resOutput002.espName)
            .to.equal(null);
        expect(resOutput002.executive)
            .to.equal(null);
        expect(resOutput002.externalId)
            .to.equal(null);
        expect(resOutput002.liveramp)
            .to.eql(null);
        expect(resOutput002.emailTagReplacement)
            .to.equal(null);
        expect(resOutput002.placementTagReplacement)
            .to.equal(null);
        expect(resOutput002.contactEmails)
            .to.equal(null);
        expect(null)
            .to.equal(null);
        expect(resOutput002.blocklistCategories)
            .to.equal(null);
        expect(resOutput002.iabCreativeAttribute)
            .to.eql(null);
        expect(resOutput002.targetedDomains)
            .to.eql(null);
        expect(resOutput002.keyValues)
            .to.eql(null);
        expect(resOutput002.keyValuesCount)
            .to.equal(null);
        // ssp control object
        expect(resOutput002.sspControl.exchangeAllow)
            .to.equal(null);
        expect(resOutput002.sspControl.targetingType)
            .to.be.oneOf(['include', 'exclude']);
        expect(resOutput002.sspControl.applyBlocklists)
            .to.be.oneOf([true, false]);
        if (resOutput002.sspControl.rtbAllow) {
            expect(resOutput002.sspControl.rtbAllow)
                .to.be.oneOf([true, false]);
        }
        if (resOutput002.sspControl.rtbTransparency) {
            expect(resOutput002.sspControl.rtbTransparency)
                .to.be.oneOf([true, false]);
        }
        expect(resOutput002.sspControl.rtbFloor).to.equal(null);
        expect(resOutput002.sspControl.uniqueAds)
            .to.be.oneOf(['inherit', 'off', 'advertiser']);
        expect(resOutput002.sspControl.userMatchAllow)
            .to.be.oneOf([true, false]);
        expect(resOutput002.sspControl.demandAllocationDirect)
            .to.equal(null);
        expect(resOutput002.sspControl.demandAllocationHouse)
            .to.equal(null);
        expect(resOutput002.sspControl.tier)
            .to.equal(null);
        expect(resOutput002.sspControl.directoryExpose)
            .to.be.oneOf([true, false]);
        expect(resOutput002.sspControl.directoryExposePublic)
            .to.be.oneOf([true, false]);
        expect(resOutput002.sspControl.exchangeFloor).to.equal(null);
        // contact object
        expect(resOutput002.contact.company).to.equal(null);
        expect(resOutput002.contact.email).to.equal(null);
        expect(resOutput002.contact.firstName).to.equal(null);
        expect(resOutput002.contact.lastName).to.equal(null);
        expect(resOutput002.contact.lastName).to.equal(null);
        expect(resOutput002.contact.phone).to.equal(null);
        expect(resOutput002.contact.address1).to.equal(null);
        expect(resOutput002.contact.address2).to.equal(null);
        expect(resOutput002.contact.city).to.equal(null);
        expect(resOutput002.contact.state).to.equal(null);
        expect(resOutput002.contact.postalCode).to.equal(null);
        expect(resOutput002.contact.country).to.equal(null);
    });

    after('delete publisher', function(done) {
        request(targetServer)
            .del(util.format(targetEndpoint.publisherDelete, resOutput002.id))
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
