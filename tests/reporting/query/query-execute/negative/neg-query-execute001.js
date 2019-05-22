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
const restrictedDimensionFixture = require(rootPath +
    '/fixtures/reporting/query/query-execute/restrictedDimensionData.json');

// shared test variable(s)
let authHeaders;
let restrictedDimensionBody1;
let restrictedDimensionBody2;
let restrictedDimensionBody3;

let restrictedDimensionDefaultOut;
let restrictedDimensionExtractionOut;
let restrictedDimensionBothOut;
let restrictedDimensionsDefault = ['mail_type','domain',
    'rtb_domain', 'list_id'];
let restrictedDimensionsExtraction = ['publisher_id'];
let restrictedDimensionsBoth = ['template_id', 'section_id'];
let forbiddenMessage = 'Request Not Permitted: %s - %s';

describe('{{REPORTING}} <SMOKE> /query {query-execute} report @ADMIN >>>' +
    '(-) advertiser restricted splits', function() {

    this.timeout(requestTimeOut);

    before('generate auth headers', function(done) {
        const genAuthHeaders =
            merlinAuthHeaders(targetUser);
        genAuthHeaders.then( function(headers) {
            authHeaders = headers;
            done();
        });
    });

    before('Advertiser - Try sending query with restricted splits ' +
            'and type default', function() {
        restrictedDimensionBody1 =
            Object.assign({},restrictedDimensionFixture);
        restrictedDimensionBody1.query.dimensions = [{
            'type': 'default',
            'dimension': 'mail_type',
            'outputName': 'Mail Type'
        }];

        request(targetServer)
            .post(util.format(targetEndpoint.queryRun))
            .set(authHeaders)
            .send(restrictedDimensionBody1)
            .then( function(response) {

                expect(response.body).to.exist;
                expect(response.status).to.equal(403);

                restrictedDimensionDefaultOut = (JSON.parse(response.text));
            })
            .catch( function(err) {
                throw(err);
            });
    });

    before('Advertiser - Try sending query with restricted splits ' +
            'and type extraction', function() {
        restrictedDimensionBody2 =
            Object.assign({},restrictedDimensionFixture);
        restrictedDimensionBody2.query.dimensions = [{
            'type': 'extraction',
            'dimension': 'publisher_id',
            'outputName': 'Publisher ID'
        }];

        request(targetServer)
            .post(util.format(targetEndpoint.queryRun))
            .set(authHeaders)
            .send(restrictedDimensionBody2)
            .then( function(response) {

                expect(response.body).to.exist;
                expect(response.status).to.equal(403);

                restrictedDimensionExtractionOut = (JSON.parse(response.text));
            })
            .catch( function(err) {
                throw(err);
            });
    });

    before('Advertiser - Try sending query with restricted splits ' +
            'and type both', function(done) {
        restrictedDimensionBody3 =
            Object.assign({},restrictedDimensionFixture);
        restrictedDimensionBody3.query.dimensions = [{
            'type': 'default',
            'dimension': 'template_id',
            'outputName': 'Template ID'
        }];

        request(targetServer)
            .post(util.format(targetEndpoint.queryRun))
            .set(authHeaders)
            .send(restrictedDimensionBody3)
            .then( function(response) {

                expect(response.body).to.exist;
                expect(response.status).to.equal(403);

                restrictedDimensionBothOut = (JSON.parse(response.text));
                done();
            })
            .catch( function(err) {
                throw(err);
            });
    });

    it('Advertiser - Check error sending query with restricted ' +
            'splits and type default', function() {
        if (restrictedDimensionsDefault.includes(restrictedDimensionBody1
            .query.dimensions[0].dimension)) {
            {expect(restrictedDimensionDefaultOut.statusCode).to.equal(403);}
            expect(restrictedDimensionDefaultOut.error).to.equal('Forbidden');
            expect(restrictedDimensionDefaultOut.message)
                .to.equal(util.format(forbiddenMessage,'dimension',
                    restrictedDimensionBody1.query.dimensions[0].outputName));
        }
    });

    it('Advertiser - Check error sending query with restricted ' +
            'splits and type extraction', function() {
        if (restrictedDimensionsExtraction.includes(restrictedDimensionBody2
            .query.dimensions[0].dimension)) {
            {expect(restrictedDimensionExtractionOut.statusCode).to.equal(403);}
            expect(restrictedDimensionExtractionOut.error)
                .to.equal('Forbidden');
            expect(restrictedDimensionExtractionOut.message)
                .to.equal(util.format(forbiddenMessage,'dimension',
                    restrictedDimensionBody2.query.dimensions[0].outputName));
        }
    });

    it('Advertiser - Check error sending query with restricted splits ' +
         'and type both', function(done) {
        if (restrictedDimensionsBoth.includes(restrictedDimensionBody3
            .query.dimensions[0].dimension)) {
            {expect(restrictedDimensionBothOut.statusCode).to.equal(403);}
            expect(restrictedDimensionBothOut.error).to.equal('Forbidden');
            expect(restrictedDimensionBothOut.message)
                .to.equal(util.format(forbiddenMessage,'dimension',
                    restrictedDimensionBody3.query.dimensions[0].outputName));
            done();
        }
    });

});
