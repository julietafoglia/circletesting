'use strict';

// vendor dependencies
const chai = require('chai');
const expect = chai.expect;

// common runtime variables
const rootPath = process.env.ROOT_PATH;
const usersTargetEnvironment =
    require(rootPath + '/config/users/' + process.env.NODE_ENV);
const targetUser = usersTargetEnvironment.admin;
const driverTimeOut = 0;

// bootstrap variables
const entitiesFile =
    require(rootPath + '/bootstrap/entities-dsp.json');
const entitiesObj = entitiesFile;
const targetAdv = entitiesObj.agency001.children.advertiser001;

let driver; // initialized during test runtime

// selenium page object(s)
//  initialized during test runtime
let LoginPage = require(rootPath +
    '/pages/maverick/platform/login');
let GlobalSearchInput = require(rootPath +
    '/pages/maverick/campaign-manager/global-search-page');
let GlobalSearchPage = require(rootPath +
    '/pages/maverick/campaign-manager/global-search-page');
let loginPage;
let globalSearchInput;
let globalSearchPage;

// maverick runtime variables
const targetEnvironment =
    require(rootPath + '/config/maverick/' + process.env.NODE_ENV);
const targetServer = targetEnvironment.server;
const driverBuilder = require(rootPath + '/helpers/driver-builder');

describe('{{MAVERICK}} /campaign-manager/' +
    'global-search-dropdown {ui} @MANAGER >>> ' +
    '(+) verify View All Results link >>>', function() {

    // disable mocha time outs
    this.timeout(0);

    before('get webdriver and reset session', (done) => {
        driver = driverBuilder();
        loginPage = new LoginPage(driver);
        globalSearchInput = new GlobalSearchInput(driver);
        globalSearchPage = new GlobalSearchPage(driver);
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

    it('should show results in dropdown after ' +
        ' search', function(done) {
        globalSearchInput.setInputSearchSecondDdn(targetAdv.name);
        expect(globalSearchInput.getLinkText(targetAdv.name)).to.exist;
        expect(globalSearchInput.getLinkContainsText('View All Search Results'))
            .to.exist;
        driver.sleep(driverTimeOut).then(() => done());
    });

    it('should show all results after clicking View All', function(done) {
        globalSearchInput.clickViewAllResults();
        globalSearchPage.getTitle(targetAdv.name);
        globalSearchPage.getInputSearch();
        globalSearchPage.getAdvertiserLink(targetAdv.name);
        driver.sleep(driverTimeOut).then(() => done());
    });

});
