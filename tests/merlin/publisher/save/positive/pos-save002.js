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
const setupFixture002 =
    require(rootPath + '/fixtures/common/publisher/create001');
const testFixture001 =
    require(rootPath + '/fixtures/common/publisher/save002');
const verifyFixture =
    require(rootPath + '/fixtures/common/publisher/save002-verify');

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
let sendBody003;

describe('{{MERLIN}} /publisher {id save} >>> ' +
    '(+) body - minimum required fields >>>', function() {

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

    before('create publisher - minimum required fields', function(done) {

        sendBody002 = Object.assign({}, setupFixture002);

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

    before('save publisher - minimum required fields', function(done) {

        sendBody003 = Object.assign({}, testFixture001);

        // assign media-group, name and version to publisher
        sendBody003.mediaGroup = resOutput001.id;
        sendBody003.name = resOutput002.name + '@v2';
        sendBody003.version = resOutput002.version;

        request(targetServer)
            .post(util.format(targetEndpoint.publisherSave, resOutput002.id))
            .set(authHeaders)
            .send(sendBody003)
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
        expect(/^[a-f0-9]{32}$/.test(resOutput002.id)).to.be.true;
        expect(validator.isInt(resOutput002.refId + '')).to.be.true;
        expect(validator.isInt(resOutput002.version + '')).to.be.true;
        expect(/^[a-f0-9]{32}$/.test(resOutput002.mediaGroup)).to.be.true;
        expect(resOutput002.mediaGroupName).to.have.length.of.at.most(255);
        expect(resOutput002.status).to.be.oneOf([
            'pending', 'inactive', 'active', 'created'
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
        if (resOutput002.sspControl.targetingType !== null) {
            expect(resOutput002.sspControl.targetingType)
                .to.be.a('string');
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
        if (resOutput002.sspControl.uniqueAds !== null) {
            expect(resOutput002.sspControl.uniqueAds)
                .to.be.a('string');
        }
        if (resOutput002.sspControl.userMatchAllow !== null) {
            expect(resOutput002.sspControl.userMatchAllow)
                .to.be.a('boolean');
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
        if (resOutput002.sspControl.directoryExpose !== null) {
            expect(resOutput002.sspControl.directoryExpose)
                .to.be.a('boolean');
        }
        if (resOutput002.sspControl.directoryExposePublic !== null) {
            expect(resOutput002.sspControl.directoryExposePublic)
                .to.be.a('boolean');
        }
        if (resOutput002.sspControl.exchangeFloor !== null) {
            expect(/^(\d{1,10}\.?\d{0,2})$/
                .test(resOutput002.sspControl.exchangeFloor + '')
            ).to.be.true;
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

    it('response object key values should match test object', function() {
        expect(resOutput003.mediaGroup)
            .to.equal(sendBody003.mediaGroup);
        expect(resOutput003.mediaGroupName)
            .to.equal(sendBody001.name);
        expect(resOutput003.status)
            .to.be.oneOf(['active', 'pending', 'inactive', 'created']);
        expect(resOutput003.esp)
            .to.equal(verifyFixture.esp);
        expect(resOutput003.category)
            .to.equal(verifyFixture.category);
        expect(resOutput003.admin)
            .to.equal(verifyFixture.admin);
        expect(resOutput003.executive)
            .to.equal(verifyFixture.executive);
        expect(resOutput003.name)
            .to.equal(sendBody003.name);
        expect(resOutput003.description)
            .to.equal(verifyFixture.description);
        expect(resOutput003.externalId)
            .to.equal(verifyFixture.externalId);
        expect(resOutput003.domain)
            .to.equal(verifyFixture.domain);
        expect(resOutput003.tagsUrlPrefix)
            .to.equal(verifyFixture.tagsUrlPrefix);
        expect(resOutput003.emailTagReplacement)
            .to.equal(verifyFixture.emailTagReplacement);
        expect(resOutput003.placementTagReplacement)
            .to.equal(verifyFixture.placementTagReplacement);
        expect(resOutput003.contactEmails)
            .to.eql(verifyFixture.contactEmails);
        expect(resOutput003.categories)
            .to.eql(verifyFixture.categories);
        expect(resOutput003.blocklistCategories)
            .to.eql(verifyFixture.blocklistCategories);
        expect(resOutput003.iabCreativeAttribute)
            .to.eql(verifyFixture.iabCreativeAttribute);
        expect(resOutput003.targetedDomains)
            .to.eql(verifyFixture.targetedDomains);
        expect(resOutput003.keyValues)
            .to.eql(verifyFixture.keyValues);
        expect(resOutput003.keyValuesCount)
            .to.equal(verifyFixture.keyValuesCount);
        // ssp control object
        expect(resOutput003.sspControl.rtbAllow)
            .to.equal(verifyFixture.sspControl.rtbAllow);
        expect(resOutput003.sspControl.rtbTransparency)
            .to.equal(verifyFixture.sspControl.rtbTransparency);
        expect(resOutput003.sspControl.rtbFloor)
            .to.equal(verifyFixture.sspControl.rtbFloor);
        expect(resOutput003.sspControl.demandAllocationDirect)
            .to.equal(verifyFixture.sspControl.demandAllocationDirect);
        expect(resOutput003.sspControl.demandAllocationHouse)
            .to.equal(verifyFixture.sspControl.demandAllocationHouse);
        // contact object
        expect(resOutput003.contact.company)
            .to.equal(verifyFixture.contact.company);
        expect(resOutput003.contact.email)
            .to.equal(verifyFixture.contact.email);
        expect(resOutput003.contact.firstName)
            .to.equal(verifyFixture.contact.firstName);
        expect(resOutput003.contact.lastName)
            .to.equal(verifyFixture.contact.lastName);
        expect(resOutput003.contact.lastName)
            .to.equal(verifyFixture.contact.lastName);
        expect(resOutput003.contact.phone)
            .to.equal(verifyFixture.contact.phone);
        expect(resOutput003.contact.address1)
            .to.equal(verifyFixture.contact.address1);
        expect(resOutput003.contact.address2)
            .to.equal(verifyFixture.contact.address2);
        expect(resOutput003.contact.city)
            .to.equal(verifyFixture.contact.city);
        expect(resOutput003.contact.state)
            .to.equal(verifyFixture.contact.state);
        expect(resOutput003.contact.postalCode)
            .to.equal(verifyFixture.contact.postalCode);
        expect(resOutput003.contact.country)
            .to.equal(verifyFixture.contact.country);
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
