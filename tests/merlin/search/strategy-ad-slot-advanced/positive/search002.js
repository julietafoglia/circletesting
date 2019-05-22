'use strict';

// vendor dependencies
const chai = require('chai');
const expect = chai.expect; // use bdd chai
const request = require('supertest-as-promised');
const util = require('util');
const validator = require('validator');

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
const requestTimeOut = 15000;

// shared test variable(s)
let authHeaders;
let resText001;
let resOutput001;

describe('{{MERLIN}} /search/strategy/ad-slot {advanced} >>> ' +
    '(+) empty request body >>>', function() {

    // set time out for requests
    this.timeout(requestTimeOut);

    before('generate auth headers', (done) => {
        // generate auth headers
        const genAuthHeaders =
            merlinAuthHeaders(targetUser);
        genAuthHeaders.then((headers) => {
            authHeaders = headers;
            done();
        });
    });

    before('search linked strategies', (done) => {

        let payload = {};

        request(targetServer)
            .post(util.format(targetEndpoint.searchStrategyAdSlotAdvanced))
            .send(payload)
            .set(authHeaders)
            .then((res) => {
                // basic response verification
                expect(res.body).to.exist;
                expect(res.status).to.equal(200);

                // assign shared test variable(s)
                resText001 = JSON.parse(res.text);
                resOutput001 = resText001.output;
                done();
            })
            .catch((err) => {
                done(err);
            });
    });

    it('notices and errors should not exist', () => {
        expect(resText001.notices).to.not.exist;
        expect(resText001.errors).to.not.exist;
    });

    it('response object property types should match spec', () => {
        expect(/^[a-f0-9]{32}$/.test(resOutput001[0].id)).to.be.true;
        expect(validator.isInt(resOutput001[0].refId + '')).to.be.true;
        expect(validator.isInt(resOutput001[0].version + '')).to.be.true;
        expect(/^[a-f0-9]{32}$/.test(resOutput001[0].advertiser)).to.be.true;
        expect(/^[a-f0-9]{32}$/.test(resOutput001[0].campaign)).to.be.true;
        expect(resOutput001[0].name).to.have.length.of.at.most(255);
        if (resOutput001[0].externalId) {
            expect(resOutput001[0].externalId).to.have.length.of.at.most(128);
        }
        if (resOutput001[0].mediaType) {
            expect(resOutput001[0].mediaType).to.be.oneOf([
                'dedicated', 'display', 'newsletter', 'takeover'
            ]);
        }
        if (resOutput001[0].status) {
            expect(resOutput001[0].status)
                .to.be.oneOf(['active', 'inactive', 'paused']);
        }
        if (resOutput001[0].budgetType) {
            expect(resOutput001[0].budgetType).to.be.oneOf(
                ['currency', 'impressions']
            );
        }
        if (resOutput001[0].pricingModel !== null) {
            expect(resOutput001[0].pricingModel)
                .to.be.oneOf(['CPM', 'CPC', 'CPA']);
        }
        expect(validator.isDate(resOutput001[0].startDate)).to.be.true;
        expect(validator.isDate(resOutput001[0].endDate)).to.be.true;
        expect(/^(\d{1,16}(\.\d{0,2})?)$/.test(resOutput001[0].pace))
            .to.be.true;
        expect(validator.isISO8601(resOutput001[0].created)).to.be.true;
        expect(/^[a-f0-9]{32}$/.test(resOutput001[0].createdBy)).to.be.true;
        expect(validator.isISO8601(resOutput001[0].modified)).to.be.true;
        expect(/^[a-f0-9]{32}$/.test(resOutput001[0].modifiedBy)).to.be.true;
    });

});
