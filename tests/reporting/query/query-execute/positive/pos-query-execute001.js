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
const allowedDimensionFixture = require(rootPath +
    '/fixtures/reporting/query/query-execute/restrictedDimensionData.json');
const allowedMetricFixture = require(rootPath +
    '/fixtures/reporting/query/query-execute/restrictedMetricData.json');

// shared test variable(s)
let authHeaders;
let allowedDimensionsBody;
let allowedMetricsBody;

let allowedDimensionsOut;
let allowedMetricsOut;

let allowedDimensions =
    ['age','browser','campaign_id','country','creative_id','size','demand_type',
        'device_type', 'gender','line_item_id', 'metro',
        'os','publisher_id','region'];

let allowedMetrics =
    ['advertiser_spent', 'clicks', 'conversions', 'impressions', 'pvc'];

describe('{{REPORTING}} <SMOKE> /query {query-execute} report @ADMIN >>>' +
    '(+) Advertiser allowed splits and metrics', function() {

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
            'splits ', function(done) {
        allowedDimensionsBody = Object.assign({},allowedDimensionFixture);
        allowedDimensionsBody.query.dimensions = [{
            'dimension' : 'publisher_id',
            'type': 'default',
            'outputName': 'Publisher ID'
        }];

        request(targetServer)
            .post(util.format(targetEndpoint.queryRun))
            .set(authHeaders)
            .send(allowedDimensionsBody)
            .then( function(res) {
                expect(res.body).to.exist;
                expect(res.status).to.equal(200);
                allowedDimensionsOut = res;
                done();
            })
            .catch( function(err) {
                throw(err);
            });
    });

    before('Advertiser (+) Try sending query with allowed ' +
            'metrics ', function(done) {
        allowedMetricsBody = Object.assign({},allowedMetricFixture);
        allowedMetricsBody.query.aggregations = [{
            'fieldName' : 'pvc',
            'type': 'doubleSum',
            'name': 'PVC'
        }];

        request(targetServer)
            .post(util.format(targetEndpoint.queryRun))
            .set(authHeaders)
            .send(allowedMetricsBody)
            .then( function(response) {
                expect(response.body).to.exist;
                expect(response.status).to.equal(200);
                allowedMetricsOut = response;
                done();
            })
            .catch( function(err) {
                throw(err);
            });
    });

    it('Advertiser - Sending query with allowed ' +
            'splits should return status 200', function() {
        if (allowedDimensions.includes(allowedDimensionsBody
            .query.dimensions[0].dimension)) {
            {expect(allowedDimensionsOut.status).to.equal(200);}
        }
    });

    it('Advertiser - Sending query with allowed ' +
            'metrics should return status 200', function(done) {
        if (allowedMetrics.includes(allowedMetricsBody
            .query.aggregations[0].fieldName)) {
            {expect(allowedMetricsOut.status).to.equal(200);}
            done();
        }
    });

});
