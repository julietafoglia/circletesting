'use strict';

// vendor dependencies
const chance = require('chance').Chance();
const chai = require('chai');
const expect = chai.expect; // use bdd chai
const fs = require('fs');
const jsonfile = require('jsonfile');
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
const jsonReadFile =
    require(rootPath + '/helpers/json-read-file');
const jsonWriteFile =
    require(rootPath + '/helpers/json-write-file');
const merlinAuthHeaders =
    require(rootPath + '/helpers/merlin-auth-headers');
const requestTimeOut = 10000;
const timeStampShort =
    '@' + moment().format('YYYY-MM-DDTHH:mm');
const timeStampLong =
    '@' + moment().format('YYYY-MM-DDTHH:mm:ss.SS');
const timeToday =
    moment().format('YYYY-MM-DD');
const characterPool =
    'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

// bootstrap variable(s)
let entitiesFile;
let entitiesObj;
let targetAgency;
let targetMediaGroup;
let targetAdvertiser;
let targetInsertionOrder;
let targetCampaign;
let targetBootstrapUser;

// fixture(s)
const testFixture =
    require(rootPath + '/fixtures/common/creative/create001');
const verifyFixture =
    require(rootPath + '/fixtures/common/creative/create001-verify');

// shared test variable(s)
let authHeaders;
let res001;
let resOutput001;
let resText001;
let sendBody001;

describe('{{BOOTSTRAP}} <SETUP> [[MEDIA-GROUP]] 007 >>> ' +
    'mediaGroup001 - advertiser001 - creative002 >>> ', function(done) {

    // set time out for requests
    this.timeout(requestTimeOut);

    before('get bootstrap object(s)', function() {
        entitiesObj = require(rootPath + '/bootstrap/entities-dsp.json');
        targetMediaGroup = entitiesObj.mediaGroup001;
        targetAdvertiser = targetMediaGroup.children.advertiser001;
    });

    before('generate auth headers', function(done) {
        const genAuthHeaders =
            merlinAuthHeaders(targetUser);
        genAuthHeaders.then( function(headers) {
            authHeaders = headers;
            done();
        });
    });

    before('create creative - minimum required fields', function(done) {
        sendBody001 = Object.assign({}, testFixture);

        sendBody001.name += '002' + timeStampLong;
        sendBody001.advertiser = targetAdvertiser.id;

        request(targetServer)
            .post(util.format(targetEndpoint.creativeCreate))
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
                throw(err);
            });
    });

    it('response should have status of 201', function(done) {
        expect(res001.status).to.equal(201);
        done();
    });

    it('notices and errors should not exist', function(done) {
        expect(resText001.notices).to.not.exist;
        expect(resText001.errors).to.not.exist;
        done();
    });

    it('response object property types should match spec', function(done) {
        expect(/^[a-f0-9]{32}$/.test(resOutput001.id)).to.be.true;
        expect(validator.isInt(resOutput001.refId + '')).to.be.true;
        expect(validator.isInt(resOutput001.version + '')).to.be.true;
        expect(resOutput001.status).to.be.oneOf([
            'pending', 'inactive', 'active'
        ]);
        expect(resOutput001.type).to.be.oneOf([
            'image', 'marquee', 'left', 'right', 'video', 'flash'
        ]);
        expect(/^[a-f0-9]{32}$/.test(resOutput001.advertiser)).to.be.true;
        expect(resOutput001.name).to.have.length.of.at.most(255);
        if (resOutput001.externalId !== null) {
            expect(resOutput001.externalId).to.have.length.of.at.most(128);
        }
        expect(validator.isInt(resOutput001.width + '')).to.be.true;
        expect(validator.isInt(resOutput001.height + '')).to.be.true;
        if (resOutput001.frequencyCapPeriod !== null) {
            expect(resOutput001.frequencyCapPeriod).to.be.oneOf([
                'minute', 'hourly', 'daily', 'weekly', 'monthly'
            ]);
        }
        if (resOutput001.frequencyCapCount !== null) {
            expect(validator.isInt(resOutput001.frequencyCapCount)).to.be.true;
        }
        expect(resOutput001.priority).to.be.oneOf([
            'low', 'normal'
        ]);
        expect(resOutput001.isServices).to.be.be.a('boolean');
        expect(resOutput001.isArchived).to.be.be.a('boolean');
        if (resOutput001.rejectReason !== null) {
            expect(resOutput001.rejectReason).to.have.length.of.at.most(255);
        }
        expect(resOutput001.bidderVisibility).to.be.be.a('boolean');
        if (resOutput001.mediaUrl !== null) {
            expect(resOutput001.mediaUrl).to.have.length.of.at.most(255);
        }
        if (resOutput001.urlCachedCopy !== null) {
            expect(resOutput001.urlCachedCopy).to.have.length.of.at.most(255);
        }
        if (resOutput001.clickUrl !== null) {
            expect(resOutput001.clickUrl).to.have.length.of.at.most(255);
        }
        if (resOutput001.hostedTag !== null) {
            expect(resOutput001.hostedTag).to.have.length.of.at.most(255);
        }
        if (resOutput001.approvalKey !== null) {
            expect(resOutput001.approvalKey).to.have.length.of.at.most(255);
        }
        expect(validator.isISO8601(resOutput001.created)).to.be.true;
        expect(/^[a-f0-9]{32}$/.test(resOutput001.createdBy)).to.be.true;
        expect(validator.isISO8601(resOutput001.modified)).to.be.true;
        expect(/^[a-f0-9]{32}$/.test(resOutput001.modifiedBy)).to.be.true;
        if (resOutput001.iabAttributes !== null) {
            expect(resOutput001.iabAttributes).to.have.length.of.at.most(255);
        }
        if (resOutput001.urlTracking1 !== null) {
            expect(resOutput001.urlTracking1).to.have.length.of.at.most(255);
        }
        if (resOutput001.urlTracking2 !== null) {
            expect(resOutput001.urlTracking2).to.have.length.of.at.most(255);
        }
        done();
    });

    it('response object key values should match test object', function(done) {
        expect(resOutput001.version)
            .to.equal(verifyFixture.version);
        expect(resOutput001.status)
            .to.equal(verifyFixture.status);
        expect(resOutput001.type)
            .to.equal(verifyFixture.type);
        expect(resOutput001.advertiser)
            .to.equal(targetAdvertiser.id);
        expect(resOutput001.name)
            .to.equal(sendBody001.name);
        expect(resOutput001.externalId)
            .to.equal(verifyFixture.externalId);
        expect(resOutput001.width)
            .to.equal(verifyFixture.width);
        expect(resOutput001.height)
            .to.equal(verifyFixture.height);
        expect(resOutput001.frequencyCapPeriod)
            .to.equal(verifyFixture.frequencyCapPeriod);
        expect(resOutput001.frequencyCapCount)
            .to.equal(verifyFixture.frequencyCapCount);
        expect(resOutput001.priority)
            .to.equal(verifyFixture.priority);
        expect(resOutput001.isArchived)
            .to.equal(verifyFixture.isArchived);
        expect(resOutput001.isServices)
            .to.equal(verifyFixture.isServices);
        expect(resOutput001.rejectReason)
            .to.equal(verifyFixture.rejectReason);
        expect(resOutput001.bidderVisibility)
            .to.equal(verifyFixture.bidderVisibility);
        expect(resOutput001.mediaUrl)
            .to.equal(verifyFixture.mediaUrl);
        expect(resOutput001.clickUrl)
            .to.equal(verifyFixture.clickUrl);
        expect(resOutput001.hostedTag)
            .to.equal(verifyFixture.hostedTag);
        expect(resOutput001.iabAttributes)
            .to.equal(verifyFixture.iabAttributes);
        expect(resOutput001.urlTracking1)
            .to.equal(verifyFixture.urlTracking1);
        expect(resOutput001.urlTracking2)
            .to.equal(verifyFixture.urlTracking2);
        done();
    });

    after('write entity to json file', function(done) {

        let baseEntityObj = targetAdvertiser;

        const createdEntity = {
            type: 'ad',
            permission: 'admin/manager',
            name: resOutput001.name,
            id: resOutput001.id,
            refId: resOutput001.refId,
            clickUrl: resOutput001.clickUrl,
            mediaUrl: resOutput001.mediaUrl
        };

        // write entity details to object
        if (!baseEntityObj.children) {
            baseEntityObj.children = {};
        }
        baseEntityObj.children.creative002 = {};
        baseEntityObj.children.creative002 = createdEntity;

        // save object to file
        const writeEntitiesObjToFile = jsonWriteFile(
            rootPath + '/bootstrap/entities-dsp.json',
            entitiesObj
        );
        writeEntitiesObjToFile.then(() => done());
    });
});
