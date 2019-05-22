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
    require(rootPath + '/bootstrap/entities-ssp.json');
const entitiesObj = entitiesFile;
const targetMediaGroup = entitiesObj.manager.mediaGroup001;
const targetPublisher = targetMediaGroup.publisher001;
const targetTemplate = targetPublisher.newsletter001;
const targetAdSlot = targetTemplate.adSlot0;
const textNoResults = 'asdasdasdasdasd';

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

describe('<SMOKE-PROD> {{MAVERICK}} /campaign-manager/' +
    'global-search-dropdown {ui} @MANAGER >>> ' +
    '(+) verify ui elements for inventory manager entities >>>', function() {

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

    it('should show no results message in dropdown after search',
        function(done) {
            globalSearchInput.setInputSearchDdn(textNoResults);
            expect(globalSearchInput.getTextDdnNoResults()).to.exist;
            driver.sleep(driverTimeOut).then(() => done());
        });

    it('should show results in dropdown after ' +
        'media group search', function(done) {

        globalSearchInput.setInputSearchDdn(targetMediaGroup.refId);
        expect(globalSearchInput.getLinkText(targetMediaGroup.name)).to.exist;
        driver.sleep(driverTimeOut).then(() => done());
    });

    it('should show results in dropdown after publisher search',
        function(done) {
            globalSearchInput.setInputSearchSecondDdn(targetPublisher.name);
            expect(globalSearchInput.getLinkContainsText(targetPublisher.name))
                .to.exist;
            driver.sleep(driverTimeOut).then(() => done());
        });

    it('should show results in dropdown after ' +
        'newsletter search', function(done) {
        globalSearchInput.setInputSearchSecondDdn(targetTemplate.name);
        expect(globalSearchInput.getLinkContainsText(targetTemplate.name))
            .to.exist;
        globalSearchInput.setInputSearchSecondDdn(targetTemplate.name);
        expect(globalSearchInput.getLinkContainsText('View All Search Results'))
            .to.exist;
        driver.sleep(driverTimeOut).then(() => done());
    });

    // DEM-1391 bug reported
    xit('should show results in dropdown after ' +
        'adSlot search', function(done) {
        globalSearchInput.setInputSearchSecondDdn(targetAdSlot.name);
        expect(globalSearchInput.getLinkContainsText(targetAdSlot.name))
            .to.exist;
        driver.sleep(driverTimeOut).then(() => done());
    });


});
