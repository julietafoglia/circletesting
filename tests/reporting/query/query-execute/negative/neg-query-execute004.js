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
const restrictedFilterFixture =
    require(rootPath + '/fixtures/reporting/query/query-execute/' +
        'advFilterData.json');

// shared test variable(s)
let authHeaders;
let restrictedFilterBody;

let restrictedFilterOut;
let queryOut1;
let restrictedFilter =
    ['template_id','section_id','list_id','rtb_domain','domain','mail_type'];
let forbiddenMessage = 'Request Not Permitted: %s - %s';

describe('{{REPORTING}} <SMOKE> /query {query-execute} report @ADMIN >>>' +
    '(-) advertiser restricted filters', function() {

    this.timeout(requestTimeOut);

    before('generate auth headers', function(done) {
        const genAuthHeaders =
            merlinAuthHeaders(targetUser);
        genAuthHeaders.then( function(headers) {
            authHeaders = headers;
            done();
        });
    });

    before('Advertiser - Try sending query with filter ' +
        'as array of objects ', function(done) {
        restrictedFilterBody = Object.assign({}, restrictedFilterFixture);
        restrictedFilterBody.query.filter.fields.field = [{
            'type': 'selector',
            'dimension' : 'template_id',
            'value': '1234'
        }];

        request(targetServer)
            .post(util.format(targetEndpoint.queryRun))
            .set(authHeaders)
            .send(restrictedFilterBody)
            .then( function(response) {
                expect(response.body).to.exist;
                expect(response.status).to.equal(400);

                queryOut1 = (JSON.parse(response.text));
                done();
            })
            .catch( function(err) {
                throw(err);
            });
    });

    before('Advertiser - Try sending query with restricted ' +
            'filters ', function(done) {
        restrictedFilterBody = Object.assign({},restrictedFilterFixture);
        restrictedFilterBody.query.filter.fields.field = {
            'dimension' : 'template_id',
            'type': 'selector',
            'value': '1234'
        };

        request(targetServer)
            .post(util.format(targetEndpoint.queryRun))
            .set(authHeaders)
            .send(restrictedFilterBody)
            .then( function(response) {
                expect(response.body).to.exist;
                expect(response.status).to.equal(403);

                restrictedFilterOut = (JSON.parse(response.text));
                done();
            })
            .catch( function(err) {
                throw(err);
            });
    });

    it('Advertiser - Check error sending query with filter ' +
            'as array of objects', function(done) {
        expect(queryOut1.statusCode).to.equal(400);
        expect(queryOut1.error).to.equal('Bad Request');
        expect(queryOut1.message).to.equal('child "query" fails ' +
                'because [child "filter" fails because ' +
                '["filter" must be an object]]');
        expect(queryOut1.validation.source).to.equal('payload');
        expect(queryOut1.validation.keys[0]).to.equal('query.filter');
        done();
    });

    it('Advertiser - Check error sending query with restricted ' +
            'filters', function(done) {
        if (restrictedFilter.includes(restrictedFilterBody
            .query.filter.dimension)) {
            {expect(restrictedFilterOut.statusCode).to.equal(403);}
            expect(restrictedFilterOut.error).to.equal('Forbidden');
            expect(restrictedFilterOut.message)
                .to.equal(util.format(forbiddenMessage,'filter',
                    restrictedFilterBody.query.filter.dimension));
            done();
        }
    });

});
