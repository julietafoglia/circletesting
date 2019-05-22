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
const testFixture = require(rootPath + '/fixtures/common/ad-slot/create010');

// shared test variable(s)
let authHeaders;
let entitiesObject;
let newsletter;
let resOutputs;

describe('[BOOTSTRAP-SETUP] /ad-slot {create} @MANAGER >>> ' +
    '(+) diff ad-slots types - advanced newsletter >>>', function() {

    // set time out for requests
    this.timeout(requestTimeOut);

    resOutputs = [];

    before('generate auth headers', (done) => {
        // generate auth headers
        const genAuthHeaders =
            merlinAuthHeaders(targetUser);
        genAuthHeaders.then( function(headers) {
            authHeaders = headers;
            done();
        });
    });

    before('get newsletter from entities file', () => {
        entitiesObject = require(rootPath + '/bootstrap/entities-ssp.json');
        newsletter =
            entitiesObject.manager.mediaGroup001.publisher001.newsletter001;
    });


    testFixture.forEach((adSlot) => {

        let res001;
        let resText001;
        let resOutput001;
        let sendBody001;

        before(`create ad-slot - ${adSlot.name}`, (done) => {

            sendBody001 = Object.assign({}, adSlot);

            sendBody001.newsletter = newsletter.id;

            request(targetServer)
                .post(util.format(targetEndpoint.adSlotCreate))
                .set(authHeaders)
                .send(sendBody001)
                .then((res) => {
                    // assign shared test variable(s)
                    res001 = res;
                    resText001 = JSON.parse(res.text);
                    resOutput001 = resText001.output;
                    resOutputs.push(resOutput001);
                    done();
                })
                .catch( (err) => {
                    done(err);
                });
        });

        it(`${adSlot.name} response have status of 201`, () => {
            expect(res001.status).to.equal(201);
        });

        it(`${adSlot.name} notices and errors should not exist`, () => {
            expect(resText001.notices).to.not.exist;
            expect(resText001.errors).to.not.exist;
        });

        it(`${adSlot.name} response object property types should match spec`,() => {
            expect(/^[a-f0-9]{32}$/.test(resOutput001.id)).to.be.true;
            expect(validator.isInt(resOutput001.refId + '')).to.be.true;
            expect(validator.isInt(resOutput001.version + '')).to.be.true;
            expect(/^[a-f0-9]{32}$/.test(resOutput001.publisher)).to.be.true;
            expect(/^[a-f0-9]{32}$/.test(resOutput001.newsletter))
                .to.be.true;
            expect(resOutput001.type).to.be.oneOf([
                'image', 'tracking', 'powered_by', 'ad_choices', 'cookie_jar',
                'video', 'ad_choices_icon', 'marquee', 'left', 'right', 'native'
            ]);
            expect(resOutput001.status).to.be.oneOf([
                'pending', 'inactive', 'active'
            ]);
            expect(resOutput001.name)
                .to.have.length.of.at.most(255);
            expect(resOutput001.mediaType).to.be.oneOf([
                'dedicated', 'content', 'newsletter'
            ]);
            if (resOutput001.salesforceId != null) {
                expect(resOutput001.externalId)
                    .to.have.length.of.at.most(128);
            }
            if (resOutput001.width !== null) {
                expect(validator.isInt(resOutput001.sizes[0].width +
                    '')).to.be.true;
            }
            if (resOutput001.height !== null) {
                expect(validator.isInt(resOutput001.sizes[0].height +
                    '')).to.be.true;
            }
            expect(resOutput001.position).to.be.oneOf([
                'unknown', 'above the fold', 'may be below the fold',
                'below the fold'
            ]);
            if (resOutput001.sspFee !== null) {
                expect(validator.isInt(resOutput001.sspFee + '',
                    {'max': 99})).to.be.true;
            }
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
                expect(/^(\d{1,10}\.\d{1,2})$/
                    .test(resOutput001.sspControl.rtbFloor)).to.be.true;
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
            // created and modified
            expect(validator.isISO8601(resOutput001.created))
                .to.be.true;
            expect(/^[a-f0-9]{32}$/.test(resOutput001.createdBy))
                .to.be.true;
            expect(validator.isISO8601(resOutput001.modified))
                .to.be.true;
            expect(/^[a-f0-9]{32}$/.test(resOutput001.modifiedBy))
                .to.be.true;
        });

        it(`${adSlot.name} response object key values should match test object`, () => {
            expect(resOutput001.publisher).to.equal(newsletter.publisher);
            expect(resOutput001.newsletter).to.equal(newsletter.id);
            expect(resOutput001.type).to.equal(sendBody001.type);
            expect(resOutput001.name).to.equal(sendBody001.name);
            expect(resOutput001.mediaType).to.equal(sendBody001.mediaType);
            expect(resOutput001.sspControl.exchangeAllow)
                .to.equal(sendBody001.sspControl.exchangeAllow);
            if (resOutput001.sspControl.exchangeFloor) {
                expect(resOutput001.sspControl.exchangeFloor)
                    .to.equal(sendBody001.sspControl.exchangeFloor);
            }
            expect(resOutput001.sspControl.userMatchAllow).to.equal(null);
        });
    });

    after('save ad-slots to file', (done) => {
        resOutputs.forEach((adSlot, index) => {
            newsletter[`adSlot${index}`] = adSlot;
        });
        jsonfile.writeFile(
            rootPath + '/bootstrap/entities-ssp.json', entitiesObject, (err) => {
                if (err) {
                    throw err;
                }
                done();
            });
    });

});
