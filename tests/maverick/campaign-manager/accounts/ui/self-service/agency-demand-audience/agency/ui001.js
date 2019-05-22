'use strict';

// common runtime variables
const rootPath = process.env.ROOT_PATH;
const usersTargetEnvironment = require(rootPath +
    '/bootstrap/entities-dsp.json');
const targetUser = usersTargetEnvironment.agency002.children.agencyUser001;

// bootstrap variables
let driver; // initialized during test runtime

// selenium page object(s)
//  initialized during test runtime

let LoginPage = require(rootPath + '/pages/maverick/platform/login');
let SetupPage = require(rootPath + '/pages/maverick/' +
    'platform/accounts-setup');
let loginPage;
let setupPage;

// maverick runtime variables
const targetEnvironment =
    require(rootPath + '/config/maverick/' + process.env.NODE_ENV);
const targetServer = targetEnvironment.server;
const driverBuilder = require(rootPath + '/helpers/driver-builder');

describe('{{MAVERICK}} /accounts {ui} @SS-AGENCY >>> ' +
    '(+) verify ui elements >>>', function() {

    // disable mocha time outs
    this.timeout(0);

    before('get webdriver and reset session', (done) => {
        driver = driverBuilder();
        loginPage = new LoginPage(driver);
        setupPage = new SetupPage(driver);
        driver.manage().deleteAllCookies().then(() => {
            done();
        }, (err) => {
            done(err);
        });
    });

    it('should navigate to Maverick Login page', function(done){
        loginPage.navigate(targetServer);
        driver.sleep(0).then(() => done());
    });

    it('should assert login elements', function(done) {
        loginPage.getUsernameField();
        loginPage.getPasswordField();
        loginPage.getLoginButton();
        driver.sleep(0).then(() => done());
    });

    it('should login to maverick', function(done) {
        loginPage
            .enterUsername(targetUser.username)
            .enterPassword(targetUser.password)
            .clickLoginBtn()
            .then(() => {
                done();
            }, (err) => {
                done(err);
            });
    });

    it('Should open the Choose Advertiser modal', function(done) {
        setupPage.navigateToSetup()
            .then(() => done());
    });

    it('should show Choose Advertiser modal elements', function(done) {
        setupPage.clickSelectAccounts();
        setupPage.getChooseAdvertiserInput();
        setupPage.getAddAdvertisers();
        setupPage.getCancelAdvertiserModal();
        driver.sleep(0).then(() => done());
    });

});
