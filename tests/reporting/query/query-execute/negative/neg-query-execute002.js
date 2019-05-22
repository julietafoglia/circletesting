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
    require(rootPath + '/bootstrap/entities-dsp.json');
const targetUser = usersTargetEnvironment.agency002
    .children.advertiser001
    .children.advertiserUser001;
const merlinAuthHeaders =
    require(rootPath + '/helpers/merlin-auth-headers');
const targetServer =
    targetEnvironment.server;
const requestTimeOut = 8000;


// fixtures
const restrictedMetricFixture =
    require(rootPath + '/fixtures/reporting/query/query-execute/' +
        'restrictedMetricData.json');

// shared test variable(s)
let authHeaders;
let restrictedMetricsBody;

let restrictedMetricsOut;
let restrictedMetrics =
    ['publisher_revenue','dsp_fee_due','ssp_fee_due','programmatic_fee_due'];
let forbiddenMessage = 'Request Not Permitted: %s - %s';

describe('{{REPORTING}} <SMOKE> /query {query-execute} report @ADMIN >>>' +
    '(-) advertiser restricted metrics', function() {

    this.timeout(requestTimeOut);

    before('generate auth headers', function(done) {
        const genAuthHeaders =
            merlinAuthHeaders(targetUser);
        genAuthHeaders.then( function(headers) {
            authHeaders = headers;
            done();
        });
    });

    before('Advertiser - Try sending query with restricted ' +
            'metrics ', function(done) {
        restrictedMetricsBody = Object.assign({},restrictedMetricFixture);
        restrictedMetricsBody.query.aggregations = [{
            'fieldName' : 'publisher_revenue',
            'type': 'doubleSum',
            'name': 'Publisher Revenue'
        }];

        request(targetServer)
            .post(util.format(targetEndpoint.queryRun))
            .set(authHeaders)
            .send(restrictedMetricsBody)
            .then( function(response) {
                expect(response.body).to.exist;
                expect(response.status).to.equal(403);

                restrictedMetricsOut = (JSON.parse(response.text));
                done();
            })
            .catch( function(err) {
                throw(err);
            });
    });

    it('Advertiser - Check error sending query with restricted ' +
            'metrics', function(done) {
        if (restrictedMetrics.includes(restrictedMetricsBody
            .query.aggregations[0].fieldName)) {
            {expect(restrictedMetricsOut.statusCode).to.equal(403);}
            expect(restrictedMetricsOut.error).to.equal('Forbidden');
            expect(restrictedMetricsOut.message)
                .to.equal(util.format(forbiddenMessage,'aggregator',
                    restrictedMetricsBody.query.aggregations[0].name));
            done();
        }
    });

});
