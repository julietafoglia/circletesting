'use strict';

// vendor dependencies
const chai = require('chai');
const expect = chai.expect;

// common runtime variables
const rootPath = process.env.ROOT_PATH;
const usersTargetEnvironment = require(rootPath +
    '/bootstrap/entities-dsp.json');
const targetUser = usersTargetEnvironment.agency002
    .children.advertiser001
    .children.advertiserUser001;
const driverTimeOut = 0;

// bootstrap variables
const entitiesFile =
    require(rootPath + '/bootstrap/entities-dsp.json');
const entitiesObj = entitiesFile;
const targetAdv = entitiesObj.agency002.children.advertiser001;
const targetIo = targetAdv.children.insertionOrder001;
const targetCam = targetIo.children.campaign001;
const targetLi = targetCam.children.lineItem001;

let driver; // initialized during test runtime

// selenium page object(s)
//  initialized during test runtime
let LoginPage = require(rootPath +
    '/pages/maverick/platform/login');
let GlobalSearchInput = require(rootPath +
    '/pages/maverick/campaign-manager/global-search-page');
let loginPage;
let globalSearchInput;

// maverick runtime variables
const targetEnvironment =
    require(rootPath + '/config/maverick/' + process.env.NODE_ENV);
const targetServer = targetEnvironment.server;
const driverBuilder = require(rootPath + '/helpers/driver-builder');
const textNoResults = 'asdasdasdasdasd';

describe('{{MAVERICK}} /campaign-manager/' +
    'global-search-dropdown {ui} @SS-AGENCY-ADVERTISER >>> ' +
    '(+) verify ui elements >>>', function() {

    // disable mocha time outs
    this.timeout(0);

    before('get webdriver and reset session', (done) => {
        driver = driverBuilder();
        loginPage = new LoginPage(driver);
        globalSearchInput = new GlobalSearchInput(driver);
        driver.manage().deleteAllCookies().then(() => {
            done();
        }, (err) => {
            done(err);
        });
    });

    it('maverick - login', function(done) {
        loginPage.login(targetServer, targetUser)
            .then(() => done());
    });

    it('should show no results message in dropdown ' +
        'after search', function(done) {
        globalSearchInput.setInputSearchDdn(textNoResults);
        expect(globalSearchInput.getTextDdnNoResults()).to.exist;
        driver.sleep(driverTimeOut).then(() => done());
    });

    it('should show results in dropdown after ' +
        'advertiser search', function(done) {
        globalSearchInput.setInputSearchSecondDdn(targetAdv.refId);
        expect(globalSearchInput.getLinkText(targetAdv.name)).to.exist;
        driver.sleep(driverTimeOut).then(() => done());
    });

    it('should show results in dropdown after campaign search', function(done) {
        globalSearchInput.setInputSearchSecondDdn(targetCam.name);
        expect(globalSearchInput.getLinkContainsText(targetCam.name)).to.exist;
        driver.sleep(driverTimeOut).then(() => done());
    });
    it('should show results in dropdown after ' +
        'line item search', function(done) {
        globalSearchInput.setInputSearchSecondDdn(targetLi.name);
        expect(globalSearchInput.getLinkContainsText(targetLi.name)).to.exist;
        expect(globalSearchInput.getLinkContainsText('View All Search Results'))
            .to.exist;
        driver.sleep(driverTimeOut).then(() => done());
    });

    it('PERMISSION: should not show results in dropdown after ' +
        'insertion order search', function(done) {
        globalSearchInput.setInputSearchSecondDdn(targetIo.name);
        globalSearchInput.linkNotLocated(targetIo.name).then(function(arr) {
            expect(arr).to.be.empty;
        });
        driver.sleep(driverTimeOut)
            .then(() => done());
    });


});
