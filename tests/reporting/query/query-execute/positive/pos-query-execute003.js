'use strict';

// vendor dependicies
const chai = require('chai');
const expect = chai.expect;
const request = require('supertest-as-promised');
const util = require('util');

// runtime variables
const rootPath =
    process.env.ROOT_PATH;
const targetEndpoint =
    require(rootPath + '/config/reporting/endpoints');
const targetEnvironment =
    require(rootPath + '/config/merlin/' + process.env.NODE_ENV);
const usersTargetEnvironment =
    require(rootPath + '/config/users/' + process.env.NODE_ENV);
const targetUser = usersTargetEnvironment.advertiserAudienceDemand;
const merlinAuthHeaders =
    require(rootPath + '/helpers/merlin-auth-headers');
const targetServer =
    targetEnvironment.server;
const requestTimeOut = 8000;


// fixtures
const allowedFilterFixture = require(rootPath +
    '/fixtures/reporting/query/query-execute/advFilterData.json');

// shared test variable(s)
let authHeaders;
let allowedFilterBody;

let allowedFilterOut;

let allowedFilters =
    ['age','browser','campaign_id','country','creative_id','size','demand_type',
        'device_type', 'gender','line_item_id', 'metro',
        'os','publisher_id','region'];

describe('{{REPORTING}} <SMOKE> /query {query-execute} report @ADMIN >>>' +
    '(+) Advertiser allowed filter dimensions', function() {

    this.timeout(requestTimeOut);

    before('generate auth headers', function(done) {
        const genAuthHeaders =
            merlinAuthHeaders(targetUser);
        genAuthHeaders.then( function(headers) {
            authHeaders = headers;
            done();
        });
    });

    before('Advertiser (+) Try sending query with allowed ' +
            'filter ', function(done) {
        allowedFilterBody = Object.assign({},allowedFilterFixture);
        allowedFilterBody.query.filter = {
            'dimension' : 'campaign_id',
            'type': 'selector',
            'value': '1234'
        };

        request(targetServer)
            .post(util.format(targetEndpoint.queryRun))
            .set(authHeaders)
            .send(allowedFilterBody)
            .then( function(res) {
                expect(res.body).to.exist;
                expect(res.status).to.equal(200);
                allowedFilterOut = res;
                done();
            })
            .catch( function(err) {
                throw(err);
            });
    });

    it('Advertiser - Sending query with allowed ' +
            'filters should return status 200', function(done) {
        if (allowedFilters.includes(allowedFilterBody
            .query.filter.dimension)) {
            {expect(allowedFilterOut.status).to.equal(200);}
            done();
        }
    });

});
