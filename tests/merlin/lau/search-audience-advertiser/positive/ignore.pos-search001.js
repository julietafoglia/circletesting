'use strict';

// vendor dependencies
const chai = require('chai');

const expect = chai.expect; // use bdd chai

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

// fixture(s)
const testFixture =
    require(rootPath + '/fixtures/common/lau/set001');

// shared test variable(s)
let authHeaders;
let res001;
let resText001;

describe('{{MERLIN}} /lau/search/audience/advertiser @ADMIN >>> ' +
    '(+) basic verification >>>', function() {

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

    before('search audience by advertiser', function(done) {
        request(targetServer)
            .get(util.format(
                targetEndpoint.lauSearchAudienceAdvertiser,
                testFixture.advertiser
            ))
            .set(authHeaders)
            .then( function(res) {
                // basic response verification
                expect(res.body).to.exist;
                expect(res.status).to.equal(200);

                // assign shared test variable(s)
                res001 = res;
                resText001 = JSON.parse(res001.text);
                done();
            })
            .catch( function(err) {
                done(err);
            });
    });

    it('response have status of 200', function() {
        expect(res001.status).to.equal(200);
    });

    it('response object property types should match spec', function() {
        expect(/^[a-f0-9]{32}$/.test(resText001[2].advertiser)).to.be.true;
        expect(/^[a-f0-9]{32}$/.test(resText001[2].id)).to.be.true;
        expect(validator.isInt(resText001[2].refId + '')).to.be.true;
        expect(validator.isInt(resText001[2].version + '')).to.be.true;
        expect(resText001[2].status).to.be.oneOf([
            'pending', 'inactive', 'active'
        ]);
        expect(resText001[2].name).to.be.a('string');
        expect(validator.isInt(resText001[2].records + '')).to.be.true;
        expect(resText001[2].isShared).to.be.a('boolean');
        expect(resText001[2].isProcessing).to.be.a('boolean');
        // created and modified
        expect(validator.isISO8601(resText001[2].created)).to.be.true;
        expect(/^[a-f0-9]{32}$/.test(resText001[2].createdBy)).to.be.true;
        expect(validator.isISO8601(resText001[2].modified)).to.be.true;
        expect(/^[a-f0-9]{32}$/.test(resText001[2].modifiedBy)).to.be.true;
        // files array first object
        expect(resText001[2].files[2].percentLoaded).to.be.a('string');
        expect(resText001[2].files[2].url).to.be.a('string');
        expect(resText001[2].files[2].uniqueFileName).to.be.a('string');
        expect(resText001[2].files[2].errorFileName).to.be.a('string');
        expect(resText001[2].files[2].isComplete).to.be.a('boolean');
        expect(validator.isInt(resText001[2].files[2].id + '')).to.be.true;
        expect(resText001[2].files[2].fileName).to.be.a('string');
        expect(resText001[2].files[2].prefix).to.be.a('string');
        expect(resText001[2].files[2].bucketName).to.be.a('string');
        expect(validator.isInt(resText001[2].files[2].segmentID + ''))
            .to.be.true;
        expect(resText001[2].files[2].action).to.be.a('string');
        expect(resText001[2].files[2].type).to.be.a('string');
        expect(resText001[2].files[2].state).to.be.a('string');
        expect(validator.isInt(resText001[2].files[2].hashes + ''))
            .to.be.true;
        expect(validator.isInt(resText001[2].files[2].uniqueHashes + ''))
            .to.be.true;
        expect(validator.isInt(resText001[2].files[2].totalUploads + ''))
            .to.be.true;
        expect(validator.isInt(resText001[2].files[2].uploadedHashes + ''))
            .to.be.true;
        expect(validator.isInt(resText001[2].files[2].failedHashes + ''))
            .to.be.true;
        expect(resText001[2].files[2].rate).to.be.a('number');
        if (resText001[2].files[2].notifyEmail !== null) {
            expect(resText001[2].files[2].notifyEmail).to.be.a('string');
        }
        if (resText001[2].files[2].message !== null) {
            expect(resText001[2].files[2].message).to.be.a('string');
        }
        // files array first object - created and updated
        expect(validator.isISO8601(resText001[2].files[2].created))
            .to.be.true;
        expect(validator.isISO8601(resText001[2].files[2].updated))
            .to.be.true;
    });
});
