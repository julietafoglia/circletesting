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
    require(rootPath + '/fixtures/common/newsletter/create005');

// shared test variable(s)
let authHeaders;
let entitiesObject;
let publisher;
let res001;
let resOutput001;
let resText001;
let sendBody001;

describe('[BOOTSTRAP-SETUP] /newsletter {create} @MANAGER >>> ' +
    '(+) fields that can be entered in the UI - basic >>>', function() {

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

    before('get publisher from entities file', function() {
        entitiesObject = require(rootPath + '/bootstrap/entities-ssp.json');
        publisher = entitiesObject.manager.mediaGroup001.publisher001;
    });

    before('create newsletter - all valid fields', function(done) {

        sendBody001 = Object.assign({}, testFixture);

        // assign name and publisher to newsletter
        sendBody001.name += timeStamp;
        sendBody001.publisher = publisher.id;

        request(targetServer)
            .post(util.format(targetEndpoint.newsletterCreate))
            .set(authHeaders)
            .send(sendBody001)
            .then( function(res) {
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
        expect(resOutput001.status).to.be.oneOf([
            'pending', 'inactive', 'active'
        ]);
        expect(/^[a-f0-9]{32}$/.test(resOutput001.publisher)).to.be.true;
        if (resOutput001.externalId != null) {
            expect(resOutput001.externalId).to.have.length.of.at.most(128);
        }
        expect(validator.isInt(resOutput001.category + '', {'min': 1}))
            .to.be.true;
        expect(resOutput001.secondaryCategories)
            .to.be.an('array');
        expect(resOutput001.name)
            .to.have.length.of.at.most(48);
        if (resOutput001.description != null) {
            expect(resOutput001.description).to.be.a('string');
        }
        if (resOutput001.tagsUrlPrefix != null) {
            expect(resOutput001.tagsUrlPrefix).to.have.length.of.at.most(128);
        }
        if (resOutput001.tagsUrlPrefixInvalid != null) {
            expect(resOutput001.tagsUrlPrefixInvalid).to.be.a('boolean');
        }
        expect(resOutput001.isSafeRtb)
            .to.be.a('boolean');
        expect(resOutput001.isSafeRtbV2)
            .to.be.a('boolean');
        expect(validator.isInt(resOutput001.estimatedInventory + ''))
            .to.be.true;
        // ssp control object
        expect(resOutput001.sspControl).to.be.an('object');
        if (resOutput001.sspControl.exchangeAllow !== null) {
            expect(resOutput001.sspControl.exchangeAllow)
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
            expect(/^(\d{1,10}\.?(\d{1,2})?)$/
                .test(resOutput001.sspControl.rtbFloor)).to.be.true;
        }
        if (resOutput001.sspControl.uniqueAds !== null) {
            expect(resOutput001.sspControl.uniqueAds).to.be.oneOf([
                'inherit', 'off', 'advertiser'
            ]);
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
        // created and modified
        expect(validator.isISO8601(resOutput001.created)).to.be.true;
        expect(/^[a-f0-9]{32}$/.test(resOutput001.createdBy)).to.be.true;
        expect(validator.isISO8601(resOutput001.modified)).to.be.true;
        expect(/^[a-f0-9]{32}$/.test(resOutput001.modifiedBy)).to.be.true;
    });

    it('response object key values should match test object', function() {
        expect(resOutput001.publisher).to.equal(publisher.id);
        expect(resOutput001.category).to.equal(sendBody001.category);
        expect(resOutput001.name).to.equal(sendBody001.name);
        // expect(resOutput001.description).to.equal(sendBody001.name);
        // expect(resOutput001.isTakeover).to.equal(sendBody001.isTakeover);
        // expect(resOutput001.isRoadblock).to.equal(sendBody001.isRoadblock);
        // ssp-control object
        expect(resOutput001.sspControl.exchangeAllow)
            .to.equal(sendBody001.sspControl.exchangeAllow);
        expect(resOutput001.sspControl.uniqueAds)
            .to.equal(sendBody001.sspControl.uniqueAds);
    });

    after('save newsletter to file', (done) => {
        publisher.newsletter002 = resOutput001;
        jsonfile.writeFile(
            rootPath + '/bootstrap/entities-ssp.json', entitiesObject,
            (err) => {
                if (err) {
                    throw err;
                }
                done();
            });
    });

});
