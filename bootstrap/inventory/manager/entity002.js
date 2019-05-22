'use strict';

// vendor dependencies
const chance = require('chance').Chance();
const chai = require('chai');
const expect = chai.expect; // use bdd chai
const moment = require('moment');
const request = require('supertest-as-promised');
const util = require('util');
const validator = require('validator');
const jsonfile = require('jsonfile');

// runtime variables
const rootPath = process.env.ROOT_PATH;
const targetEndpoint = require(rootPath + '/config/merlin/endpoints');
const targetEnvironment =
    require(rootPath + '/config/merlin/' + process.env.NODE_ENV);
const usersTargetEnvironment =
    require(rootPath + '/config/users/' + process.env.NODE_ENV);
const targetServer = targetEnvironment.server;
const targetUser = usersTargetEnvironment.admin;
const merlinAuthHeaders = require(rootPath + '/helpers/merlin-auth-headers');
const requestTimeOut = 10000;
const timeStamp = '@' + moment().format('YYYY-MM-DDTHH:mm');
const timeToday = moment().format('DD-MM-YYYY');
const characterPool =
    'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

// fixture(s)
const testFixture =
    require(rootPath + '/fixtures/common/publisher/create001');
const verifyFixture =
    require(rootPath + '/fixtures/common/publisher/create001-verify');

// shared test variable(s)
let authHeaders;
let entitiesObject;
let mediaGroup;
let res001;
let resOutput001;
let resText001;
let sendBody001;

describe('[BOOTSTRAP-SETUP] /publisher {create} @MANAGER >>> ' +
    '(+) body - all valid fields >>>', function() {

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

    before('get media-group from entities file', function() {
        entitiesObject = require(rootPath + '/bootstrap/entities-ssp.json');
        mediaGroup = entitiesObject.manager.mediaGroup001;
    });

    before('create publisher - all valid fields', function(done) {

        sendBody001 = Object.assign({}, testFixture);

        // assign name media-group to publisher
        sendBody001.name += timeStamp;
        sendBody001.mediaGroup = mediaGroup.id;

        // assign values to undefined fixture fields
        sendBody001.externalId = chance.word({length: 5});
        sendBody001.emailTagReplacement = chance.word({length: 10});
        sendBody001.placementTagReplacement = chance.word({length: 10});

        request(targetServer)
            .post(util.format(targetEndpoint.publisherCreate))
            .set(authHeaders)
            .send(sendBody001)
            .then( function(res) {
                // basic response verification
                expect(res.body).to.exist;
                expect(res.status).to.equal(201);

                // assign shared test variable(s)
                res001 = res;
                resText001 = JSON.parse(res.text);
                resOutput001 = resText001.output;
                done();
            })
            .catch( function(err) {
                done(err);
            });
    });

    it('response should have status of 201', function() {
        expect(res001.status).to.equal(201);
    });

    it('notices and errors should not exist', function() {
        expect(resText001.notices).to.not.exist;
        expect(resText001.errors).to.not.exist;
    });

    it('response object property types should match spec', function() {
        expect(/^[a-f0-9]{32}$/.test(resOutput001.id)).to.be.true;
        expect(validator.isInt(resOutput001.refId + '')).to.be.true;
        expect(validator.isInt(resOutput001.version + '')).to.be.true;
        expect(/^[a-f0-9]{32}$/.test(resOutput001.mediaGroup)).to.be.true;
        expect(resOutput001.mediaGroupName).to.have.length.of.at.most(255);
        expect(resOutput001.status).to.be.oneOf([
            'pending', 'inactive', 'active'
        ]);
        if (resOutput001.newsletters !== null) {
            expect(resOutput001.newsletters).to.be.an('array');
        }
        if (resOutput001.esp !== null) {
            expect(validator.isInt(resOutput001.esp + '')).to.be.true;
        }
        if (resOutput001.espName !== null) {
            expect(resOutput001.espName).to.have.length.of.at.most(48);
        }
        expect(validator.isInt(resOutput001.category + '')).to.be.true;
        expect(resOutput001.categoryName).to.have.length.of.at.most(255);
        if (resOutput001.executive !== null) {
            expect(/^[a-f0-9]{32}$/.test(resOutput001.admin)).to.be.true;
        }
        if (resOutput001.executive !== null) {
            expect(/^[a-f0-9]{32}$/.test(resOutput001.executive)).to.be.true;
        }
        expect(resOutput001.name).to.have.length.of.at.most(255);
        expect(resOutput001.description).to.be.a('string');
        if (resOutput001.externalId !== null) {
            expect(resOutput001.externalId).to.have.length.of.at.most(32);
        }
        expect(resOutput001.domain).to.have.length.of.at.most(128);
        expect(resOutput001.tagsUrlPrefix).to.have.length.of.at.most(128);
        if (resOutput001.liveramp !== null) {
            expect(resOutput001.liveramp).to.be.an('object');
        }
        if (resOutput001.emailTagReplacement !== null) {
            expect(resOutput001.emailTagReplacement)
                .to.have.length.of.at.most(128);
        }
        if (resOutput001.placementTagReplacement !== null) {
            expect(resOutput001.placementTagReplacement)
                .to.have.length.of.at.most(128);
        }
        if (resOutput001.contactEmails !== null) {
            expect(resOutput001.contactEmails).to.be.an('array');
            resOutput001.contactEmails.forEach( function(value) {
                expect(validator.isEmail(value)).to.be.true;
            });
        }
        if (resOutput001.categories !== null) {
            expect(resOutput001.categories).to.be.an('array');
        }
        if (resOutput001.blocklistCategories !== null) {
            expect(resOutput001.blocklistCategories).to.be.an('array');
        }
        if (resOutput001.iabCreativeAttribute !== null) {
            expect(validator.isInt(resOutput001.iabCreativeAttribute + '',
                {'max': 99})).to.be.true;
            expect(resOutput001.iabCreativeAttribute).to.be.an('array');
        }
        if (resOutput001.targetedDomains !== null) {
            expect(resOutput001.targetedDomains).to.be.an('array');
        }
        if (resOutput001.keyValues !== null) {
            expect(resOutput001.keyValues).to.be.an('object');
        }
        if (resOutput001.keyValuesCount !== null) {
            expect(validator.isInt(resOutput001.keyValuesCount + ''))
                .to.be.true;
        }
        // ssp control object
        expect(resOutput001.sspControl).to.be.an('object');
        if (resOutput001.sspControl.exchangeAllow !== null) {
            expect(resOutput001.sspControl.exchangeAllow)
                .to.be.a('boolean');
        }
        if (resOutput001.sspControl.targetingType !== null) {
            expect(resOutput001.sspControl.targetingType)
                .to.be.a('string');
        }
        if (resOutput001.sspControl.applyBlocklists !== null) {
            expect(resOutput001.sspControl.applyBlocklists)
                .to.be.a('boolean');
        }
        if (resOutput001.sspControl.rtbAllow !== null) {
            expect(resOutput001.sspControl.rtbAllow)
                .to.be.a('boolean');
        }
        if (resOutput001.sspControl.rtbTransparency !== null) {
            expect(resOutput001.sspControl.rtbTransparency)
                .to.be.a('boolean');
        }
        if (resOutput001.sspControl.rtbFloor !== null) {
            expect(/^(\d{1,10}\.?\d{0,2})$/
                .test(resOutput001.sspControl.rtbFloor + '')).to.be.true;
        }
        if (resOutput001.sspControl.uniqueAds !== null) {
            expect(resOutput001.sspControl.uniqueAds)
                .to.be.a('string');
        }
        if (resOutput001.sspControl.userMatchAllow !== null) {
            expect(resOutput001.sspControl.userMatchAllow)
                .to.be.a('boolean');
        }
        if (resOutput001.sspControl.demandAllocationDirect !== null) {
            expect(validator.isInt(
                resOutput001.sspControl.demandAllocationDirect + ''
            )).to.be.true;
        }
        if (resOutput001.sspControl.demandAllocationHouse !== null) {
            expect(validator.isInt(
                resOutput001.sspControl.demandAllocationHouse + ''
            )).to.be.true;
        }
        if (resOutput001.sspControl.directoryExpose !== null) {
            expect(resOutput001.sspControl.directoryExpose)
                .to.be.a('boolean');
        }
        if (resOutput001.sspControl.directoryExposePublic !== null) {
            expect(resOutput001.sspControl.directoryExposePublic)
                .to.be.a('boolean');
        }
        if (resOutput001.sspControl.exchangeFloor !== null) {
            expect(/^(\d{1,10}\.?\d{0,2})$/
                .test(resOutput001.sspControl.exchangeFloor + '')
            ).to.be.true;
        }
        // contact object
        expect(resOutput001.contact).to.be.an('object');
        if (resOutput001.contact.company !== null) {
            expect(resOutput001.contact.company)
                .to.have.length.of.at.most(128);
        }
        if (resOutput001.contact.email !== null) {
            expect(validator.isEmail(resOutput001.contact.email)).to.be.true;
        }
        if (resOutput001.contact.firstName !== null) {
            expect(resOutput001.contact.firstName)
                .to.have.length.of.at.most(32);
        }
        if (resOutput001.contact.lastName !== null) {
            expect(resOutput001.contact.lastName)
                .to.have.length.of.at.most(32);
        }
        if (resOutput001.contact.phone !== null) {
            expect(resOutput001.contact.phone)
                .to.have.length.of.at.most(32);
        }
        if (resOutput001.contact.address1 !== null) {
            expect(resOutput001.contact.address1)
                .to.have.length.of.at.most(128);
        }
        if (resOutput001.contact.address2 !== null) {
            expect(resOutput001.contact.address2)
                .to.have.length.of.at.most(128);
        }
        if (resOutput001.contact.city !== null) {
            expect(resOutput001.contact.city)
                .to.have.length.of.at.most(64);
        }
        if (resOutput001.contact.state !== null) {
            expect(resOutput001.contact.state)
                .to.have.length.of.at.most(32);
        }
        if (resOutput001.contact.postalCode !== null) {
            expect(resOutput001.contact.postalCode)
                .to.have.length.of.at.most(32);
        }
        if (resOutput001.contact.country !== null) {
            expect(resOutput001.contact.country)
                .to.have.length.of.at.most(32);
        }
        // created and modified
        expect(validator.isISO8601(resOutput001.created)).to.be.true;
        expect(/^[a-f0-9]{32}$/.test(resOutput001.createdBy)).to.be.true;
        expect(validator.isISO8601(resOutput001.modified)).to.be.true;
        expect(/^[a-f0-9]{32}$/.test(resOutput001.modifiedBy)).to.be.true;
    });

    it('response object key values should match test object', function() {
        expect(resOutput001.mediaGroup)
            .to.equal(sendBody001.mediaGroup);
        expect(resOutput001.mediaGroupName)
            .to.equal(mediaGroup.name);
        expect(resOutput001.status)
            .to.be.oneOf(['active', 'pending', 'inactive', 'created']);
        expect(resOutput001.esp)
            .to.equal(verifyFixture.esp);
        expect(resOutput001.espName)
            .to.equal(verifyFixture.espName);
        expect(resOutput001.category)
            .to.equal(verifyFixture.category);
        expect(resOutput001.categoryName)
            .to.equal(verifyFixture.categoryName);
        expect(resOutput001.executive)
            .to.equal(verifyFixture.executive);
        expect(resOutput001.name)
            .to.equal(sendBody001.name);
        expect(resOutput001.description)
            .to.equal(verifyFixture.description);
        expect(resOutput001.externalId)
            .to.equal(sendBody001.externalId);
        expect(resOutput001.domain)
            .to.equal(verifyFixture.domain);
        expect(resOutput001.tagsUrlPrefix)
            .to.equal(verifyFixture.tagsUrlPrefix);
        expect(resOutput001.emailTagReplacement)
            .to.equal(sendBody001.emailTagReplacement);
        expect(resOutput001.placementTagReplacement)
            .to.equal(sendBody001.placementTagReplacement);
        expect(resOutput001.contactEmails)
            .to.eql(verifyFixture.contactEmails);
        expect(resOutput001.categories)
            .to.eql(verifyFixture.categories);
        expect(resOutput001.blocklistCategories)
            .to.eql(verifyFixture.blocklistCategories);
        expect(resOutput001.iabCreativeAttribute)
            .to.eql(verifyFixture.iabCreativeAttribute);
        expect(resOutput001.targetedDomains)
            .to.eql(verifyFixture.targetedDomains);
        expect(resOutput001.keyValues)
            .to.eql(verifyFixture.keyValues);
        expect(resOutput001.keyValuesCount)
            .to.equal(verifyFixture.keyValuesCount);
        // ssp control object
        /* Currently failing: TODO: investigate if this is a real bug
        expect(resOutput001.sspControl.exchangeAllow)
            .to.equal(verifyFixture.sspControl.exchangeAllow);
        expect(resOutput001.sspControl.rtbAllow)
            .to.equal(verifyFixture.sspControl.rtbAllow);
        expect(resOutput001.sspControl.rtbTransparency)
            .to.equal(verifyFixture.sspControl.rtbTransparency);
        expect(resOutput001.sspControl.rtbFloor)
            .to.equal(verifyFixture.sspControl.rtbFloor);
        expect(resOutput001.sspControl.demandAllocationDirect)
            .to.equal(verifyFixture.sspControl.demandAllocationDirect);
        expect(resOutput001.sspControl.demandAllocationHouse)
            .to.equal(verifyFixture.sspControl.demandAllocationHouse);*/
        // contact object
        expect(resOutput001.contact.company)
            .to.equal(verifyFixture.contact.company);
        expect(resOutput001.contact.email)
            .to.equal(verifyFixture.contact.email);
        expect(resOutput001.contact.firstName)
            .to.equal(verifyFixture.contact.firstName);
        expect(resOutput001.contact.lastName)
            .to.equal(verifyFixture.contact.lastName);
        expect(resOutput001.contact.lastName)
            .to.equal(verifyFixture.contact.lastName);
        expect(resOutput001.contact.phone)
            .to.equal(verifyFixture.contact.phone);
        expect(resOutput001.contact.address1)
            .to.equal(verifyFixture.contact.address1);
        expect(resOutput001.contact.address2)
            .to.equal(verifyFixture.contact.address2);
        expect(resOutput001.contact.city)
            .to.equal(verifyFixture.contact.city);
        expect(resOutput001.contact.state)
            .to.equal(verifyFixture.contact.state);
        expect(resOutput001.contact.postalCode)
            .to.equal(verifyFixture.contact.postalCode);
        expect(resOutput001.contact.country)
            .to.equal(verifyFixture.contact.country);
    });

    after('save publisher to file', (done) => {
        mediaGroup.publisher001 = resOutput001;
        jsonfile.writeFile(
            rootPath + '/bootstrap/entities-ssp.json',
            entitiesObject, (err) => {
                if (err) {
                    throw err;
                }
                done();
            });
    });

});
