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
    require(rootPath + '/fixtures/common/media-group/create001');
const testFixture =
    require(rootPath + '/fixtures/common/publisher/create001');

// shared test variable(s)
let authHeaders;
let res003;
let resOutput001;
let resOutput002;
let resOutput003;
let resText001;
let resText002;
let resText003;
let sendBody001;
let sendBody002;

describe('{{MERLIN}} <SMOKE> /publisher {id details} >>> ' +
    '(+) url - publisher with minimum required fields >>>', function() {

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

    before('create media group - minimum required fields', function(done) {

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

    before('create publisher - minimum required fields', function(done) {

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
                resText002 = JSON.parse(res.text);
                resOutput002 = resText002.output;

                // spot check response
                expect(/^[a-f0-9]{32}$/.test(resOutput002.id))
                    .to.be.true;
                expect(resOutput002.name)
                    .to.have.length.of.at.most(255);
                expect(resOutput002.mediaGroup)
                    .to.equal(sendBody002.mediaGroup);
                done();
            })
            .catch( function(err) {
                done(err);
            });
    });

    before('get publisher - minimum required fields', function(done) {
        request(targetServer)
            .get(util.format(targetEndpoint.publisherDetails, resOutput002.id))
            .set(authHeaders)
            .then( function(res) {
                // basic response verification
                expect(res.body).to.exist;
                expect(res.status).to.equal(200);

                // assign shared test variable(s)
                res003 = res;
                resText003 = JSON.parse(res.text);
                resOutput003 = resText003.output;
                done();
            })
            .catch( function(err) {
                done(err);
            });
    });

    it('response should have status of 200', function() {
        expect(res003.status).to.equal(200);
    });

    it('notices and errors should not exist', function() {
        expect(resText003.notices).to.not.exist;
        expect(resText003.errors).to.not.exist;
    });

    it('response object property types should match spec', function() {
        expect(/^[a-f0-9]{32}$/.test(resOutput003.id)).to.be.true;
        expect(validator.isInt(resOutput003.refId + '')).to.be.true;
        expect(validator.isInt(resOutput003.version + '')).to.be.true;
        expect(/^[a-f0-9]{32}$/.test(resOutput003.mediaGroup)).to.be.true;
        expect(resOutput003.mediaGroupName).to.have.length.of.at.most(255);
        expect(resOutput003.status).to.be.oneOf([
            'pending', 'inactive', 'active', 'deleted'
        ]);
        if (resOutput003.newsletters !== null) {
            expect(resOutput003.newsletters).to.be.an('array');
        }
        if (resOutput003.esp !== null) {
            expect(validator.isInt(resOutput003.esp + '')).to.be.true;
        }
        if (resOutput003.espName !== null) {
            expect(resOutput003.espName).to.have.length.of.at.most(48);
        }
        expect(validator.isInt(resOutput003.category + '')).to.be.true;
        expect(resOutput003.categoryName).to.have.length.of.at.most(255);
        if (resOutput003.executive !== null) {
            expect(/^[a-f0-9]{32}$/.test(resOutput003.executive)).to.be.true;
        }
        expect(resOutput003.name).to.have.length.of.at.most(255);
        expect(resOutput003.description).to.be.a('string');
        if (resOutput003.externalId !== null) {
            expect(resOutput003.externalId).to.have.length.of.at.most(32);
        }
        expect(resOutput003.domain).to.have.length.of.at.most(128);
        expect(resOutput003.tagsUrlPrefix).to.have.length.of.at.most(128);
        if (resOutput003.liveramp !== null) {
            expect(resOutput003.liveramp).to.be.an('object');
        }
        if (resOutput003.emailTagReplacement !== null) {
            expect(resOutput003.emailTagReplacement)
                .to.have.length.of.at.most(128);
        }
        if (resOutput003.placementTagReplacement !== null) {
            expect(resOutput003.placementTagReplacement)
                .to.have.length.of.at.most(128);
        }
        if (resOutput003.contactEmails !== null) {
            expect(resOutput003.contactEmails).to.be.an('array');
            resOutput003.contactEmails.forEach( function(value) {
                expect(validator.isEmail(value)).to.be.true;
            });
        }
        if (resOutput003.categories !== null) {
            expect(resOutput003.categories).to.be.an('array');
        }
        if (resOutput003.blocklistCategories !== null) {
            expect(resOutput003.blocklistCategories).to.be.an('array');
        }
        if (resOutput003.iabCreativeAttribute !== null) {
            expect(validator.isInt(resOutput003.iabCreativeAttribute + '',
                {'max': 99})).to.be.true;
            expect(resOutput003.iabCreativeAttribute).to.be.an('array');
        }
        if (resOutput003.targetedDomains !== null) {
            expect(resOutput003.targetedDomains).to.be.an('array');
        }
        if (resOutput003.keyValues !== null) {
            expect(resOutput003.keyValues).to.be.an('object');
        }
        if (resOutput003.keyValuesCount !== null) {
            expect(validator.isInt(resOutput003.keyValuesCount + ''))
                .to.be.true;
        }
        // ssp control object
        expect(resOutput003.sspControl).to.be.an('object');
        if (resOutput003.sspControl.exchangeAllow !== null) {
            expect(resOutput003.sspControl.exchangeAllow)
                .to.be.a('boolean');
        }
        if (resOutput003.sspControl.targetingType !== null) {
            expect(resOutput003.sspControl.targetingType)
                .to.be.a('string');
        }
        if (resOutput003.sspControl.applyBlocklists !== null) {
            expect(resOutput003.sspControl.applyBlocklists)
                .to.be.a('boolean');
        }
        if (resOutput003.sspControl.rtbAllow !== null) {
            expect(resOutput003.sspControl.rtbAllow)
                .to.be.a('boolean');
        }
        if (resOutput003.sspControl.rtbTransparency !== null) {
            expect(resOutput003.sspControl.rtbTransparency)
                .to.be.a('boolean');
        }
        if (resOutput003.sspControl.rtbFloor !== null) {
            expect(/^(\d{1,10}\.?\d{0,2})$/
                .test(resOutput003.sspControl.rtbFloor + '')).to.be.true;
        }
        if (resOutput003.sspControl.uniqueAds !== null) {
            expect(resOutput003.sspControl.uniqueAds)
                .to.be.a('string');
        }
        if (resOutput003.sspControl.userMatchAllow !== null) {
            expect(resOutput003.sspControl.userMatchAllow)
                .to.be.a('boolean');
        }
        if (resOutput003.sspControl.demandAllocationDirect !== null) {
            expect(validator.isInt(
                resOutput003.sspControl.demandAllocationDirect + ''
            )).to.be.true;
        }
        if (resOutput003.sspControl.demandAllocationHouse !== null) {
            expect(validator.isInt(
                resOutput003.sspControl.demandAllocationHouse + ''
            )).to.be.true;
        }
        if (resOutput003.sspControl.directoryExpose !== null) {
            expect(resOutput003.sspControl.directoryExpose)
                .to.be.a('boolean');
        }
        if (resOutput003.sspControl.directoryExposePublic !== null) {
            expect(resOutput003.sspControl.directoryExposePublic)
                .to.be.a('boolean');
        }
        if (resOutput003.sspControl.exchangeFloor !== null) {
            expect(/^(\d{1,10}\.?\d{0,2})$/
                .test(resOutput003.sspControl.exchangeFloor + '')
            ).to.be.true;
        }
        // contact object
        expect(resOutput003.contact).to.be.an('object');
        if (resOutput003.contact.company !== null) {
            expect(resOutput003.contact.company)
                .to.have.length.of.at.most(128);
        }
        if (resOutput003.contact.email !== null) {
            expect(validator.isEmail(resOutput003.contact.email)).to.be.true;
        }
        if (resOutput003.contact.firstName !== null) {
            expect(resOutput003.contact.firstName)
                .to.have.length.of.at.most(32);
        }
        if (resOutput003.contact.lastName !== null) {
            expect(resOutput003.contact.lastName)
                .to.have.length.of.at.most(32);
        }
        if (resOutput003.contact.phone !== null) {
            expect(resOutput003.contact.phone)
                .to.have.length.of.at.most(32);
        }
        if (resOutput003.contact.address1 !== null) {
            expect(resOutput003.contact.address1)
                .to.have.length.of.at.most(128);
        }
        if (resOutput002.contact.address2 !== null) {
            expect(resOutput002.contact.address2)
                .to.have.length.of.at.most(128);
        }
        if (resOutput003.contact.city !== null) {
            expect(resOutput003.contact.city)
                .to.have.length.of.at.most(64);
        }
        if (resOutput003.contact.state !== null) {
            expect(resOutput003.contact.state)
                .to.have.length.of.at.most(32);
        }
        if (resOutput003.contact.postalCode !== null) {
            expect(resOutput003.contact.postalCode)
                .to.have.length.of.at.most(32);
        }
        if (resOutput003.contact.country !== null) {
            expect(resOutput003.contact.country)
                .to.have.length.of.at.most(32);
        }
        // created and modified
        expect(validator.isISO8601(resOutput003.created)).to.be.true;
        expect(/^[a-f0-9]{32}$/.test(resOutput003.createdBy)).to.be.true;
        expect(validator.isISO8601(resOutput003.modified)).to.be.true;
        expect(/^[a-f0-9]{32}$/.test(resOutput003.modifiedBy)).to.be.true;
    });

    it('response object key values should match test object', function() {
        expect(resOutput003.mediaGroup)
            .to.equal(resOutput002.mediaGroup);
        expect(resOutput003.mediaGroupName)
            .to.equal(resOutput002.mediaGroupName);
        expect(resOutput003.status)
            .to.equal(resOutput002.status);
        expect(resOutput003.esp)
            .to.equal(resOutput002.esp);
        expect(resOutput003.espName)
            .to.equal(resOutput002.espName);
        expect(resOutput003.category)
            .to.equal(resOutput002.category);
        expect(resOutput003.categoryName)
            .to.equal(resOutput002.categoryName);
        expect(resOutput003.admin)
            .to.equal(resOutput002.admin);
        expect(resOutput003.executive)
            .to.equal(resOutput002.executive);
        expect(resOutput003.name)
            .to.equal(resOutput002.name);
        expect(resOutput003.description)
            .to.equal(resOutput002.description);
        expect(resOutput003.externalId)
            .to.equal(resOutput002.externalId);
        expect(resOutput003.domain)
            .to.equal(resOutput002.domain);
        expect(resOutput003.tagsUrlPrefix)
            .to.equal(resOutput002.tagsUrlPrefix);
        expect(resOutput003.emailTagReplacement)
            .to.equal(resOutput002.emailTagReplacement);
        expect(resOutput003.placementTagReplacement)
            .to.equal(resOutput002.placementTagReplacement);
        expect(resOutput003.contactEmails)
            .to.eql(resOutput002.contactEmails);
        expect(resOutput003.categories)
            .to.eql(resOutput002.categories);
        expect(resOutput003.blocklistCategories)
            .to.eql(resOutput002.blocklistCategories);
        expect(resOutput003.iabCreativeAttribute)
            .to.eql(resOutput002.iabCreativeAttribute);
        expect(resOutput003.targetedAdvertisers)
            .to.eql(resOutput002.targetedAdvertisers);
        expect(resOutput003.targetedDomains)
            .to.eql(resOutput002.targetedDomains);
        expect(resOutput003.keyValues)
            .to.eql(resOutput002.keyValues);
        expect(resOutput003.keyValuesCount)
            .to.equal(resOutput002.keyValuesCount);
        // ssp control object
        expect(resOutput003.sspControl.exchangeAllow)
            .to.equal(resOutput002.sspControl.exchangeAllow);
        expect(resOutput003.sspControl.rtbAllow)
            .to.equal(resOutput002.sspControl.rtbAllow);
        expect(resOutput003.sspControl.rtbTransparency)
            .to.equal(resOutput002.sspControl.rtbTransparency);
        expect(resOutput003.sspControl.rtbFloor)
            .to.equal(resOutput002.sspControl.rtbFloor);
        expect(resOutput003.sspControl.demandAllocationDirect)
            .to.equal(resOutput002.sspControl.demandAllocationDirect);
        expect(resOutput003.sspControl.demandAllocationHouse)
            .to.equal(resOutput002.sspControl.demandAllocationHouse);
        // contact object
        expect(resOutput003.contact.company)
            .to.equal(resOutput002.contact.company);
        expect(resOutput003.contact.email)
            .to.equal(resOutput002.contact.email);
        expect(resOutput003.contact.firstName)
            .to.equal(resOutput002.contact.firstName);
        expect(resOutput003.contact.lastName)
            .to.equal(resOutput002.contact.lastName);
        expect(resOutput003.contact.lastName)
            .to.equal(resOutput002.contact.lastName);
        expect(resOutput003.contact.phone)
            .to.equal(resOutput002.contact.phone);
        expect(resOutput003.contact.address1)
            .to.equal(resOutput002.contact.address1);
        expect(resOutput003.contact.address2)
            .to.equal(resOutput002.contact.address2);
        expect(resOutput003.contact.city)
            .to.equal(resOutput002.contact.city);
        expect(resOutput003.contact.state)
            .to.equal(resOutput002.contact.state);
        expect(resOutput003.contact.postalCode)
            .to.equal(resOutput002.contact.postalCode);
        expect(resOutput003.contact.country)
            .to.equal(resOutput002.contact.country);
        // created and modified
        expect(resOutput003.created)
            .to.equal(resOutput002.created);
        expect(resOutput003.createdBy)
            .to.equal(resOutput002.createdBy);
        expect(resOutput003.modified)
            .to.equal(resOutput002.modified);
        expect(resOutput003.modifiedBy)
            .to.equal(resOutput002.modifiedBy);
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
