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
const targetUser = usersTargetEnvironment.publisherDemand;
const merlinAuthHeaders =
    require(rootPath + '/helpers/merlin-auth-headers');
const targetServer =
    targetEnvironment.server;
const requestTimeOut = 8000;


// fixtures
const allowedDimensionFixture = require(rootPath +
    '/fixtures/reporting/query/query-execute/pubDimensionData.json');
const allowedMetricFixture = require(rootPath +
    '/fixtures/reporting/query/query-execute/pubMetricData.json');

// shared test variable(s)
let authHeaders;
let allowedDimensionsBody;
let allowedMetricsBody;

let allowedDimensionsOut;
let allowedMetricsOut;

let allowedDimensions =
    ['age','browser','country','size','device_maker','device_type',
        'domain','gender','isp','list_id','metro','os','rtb_domain','region'];

let allowedMetrics =
    ['clicks', 'conversions', 'decisions',
        'impressions','pvc','publisher_revenue'];

describe('{{REPORTING}} <SMOKE> /query {query-execute} report @ADMIN >>>' +
    '(+) publishers allowed splits and metrics', function() {

    this.timeout(requestTimeOut);

    before('generate auth headers', function(done) {
        const genAuthHeaders =
            merlinAuthHeaders(targetUser);
        genAuthHeaders.then( function(headers) {
            authHeaders = headers;
            done();
        });
    });

    before('Publishers - Try sending query with allowed ' +
            'splits ', function(done) {
        allowedDimensionsBody = Object.assign({},allowedDimensionFixture);
        allowedDimensionsBody.query.dimensions = [{
            'dimension' : 'isp',
            'type': 'default',
            'outputName': 'ISP'
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

    before('Publisher - Try sending query with allowed ' +
            'metrics ', function(done) {
        allowedMetricsBody = Object.assign({},allowedMetricFixture);
        allowedMetricsBody.query.aggregations = [{
            'fieldName' : 'publisher_revenue',
            'type': 'doubleSum',
            'name': 'Publisher Revenue'
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

    it('Publisher - Sending query with allowed ' +
            'splits should return status 200', function(done) {
        if (allowedDimensions.includes(allowedDimensionsBody
            .query.dimensions[0].dimension)) {
            {expect(allowedDimensionsOut.status).to.equal(200);}
            done();
        }
    });

    it('Publisher - Sending query with allowed ' +
            'metrics should return status 200', function(done) {
        if (allowedMetrics.includes(allowedMetricsBody
            .query.aggregations[0].fieldName)) {
            {expect(allowedMetricsOut.status).to.equal(200);}
            done();
        }
    });

});
