'use strict';

// vendor dependencies
const chai = require('chai');
const expect = chai.expect;

// common runtime variables
const rootPath = process.env.ROOT_PATH;
const usersTargetEnvironment = require(rootPath +
    '/bootstrap/entities-dsp.json');
const targetUser = usersTargetEnvironment.agency002.children.agencyUser001;
const driverTimeOut = 0;

// bootstrap variables
const entitiesFile = require(rootPath + '/bootstrap/entities-dsp.json');
const entitiesObj = entitiesFile;
const targetAdvertiser = entitiesObj.agency002.children.advertiser001;
const targetAudience = targetAdvertiser.children.audience001;

let driver; // initialized during test runtime

// selenium page object(s)
//  initialized during test runtime
let LoginPage = require(rootPath + '/pages/maverick/platform/login');
let SideBar = require(rootPath + '/pages/maverick/platform/side-bar');
let AudiencesLibrary = require(rootPath + '/pages/maverick/' +
    'campaign-manager/audience-library');
let AudiencesDelete = require(rootPath + '/pages/maverick/' +
    'campaign-manager/audience-delete-form');
let audiencesLibrary;
let sideBar;
let loginPage;
let audiencesDelete;

// maverick runtime variables
const targetEnvironment =
    require(rootPath + '/config/maverick/' + process.env.NODE_ENV);
const targetServer = targetEnvironment.server;
const driverBuilder = require(rootPath + '/helpers/driver-builder');

describe('{{MAVERICK}} /audience-library {UI} @SS-AGENCY >>> ' +
    '(+) verify audience library ui elements >>>', function() {

    // disable mocha time outs
    this.timeout(0);

    before('get webdriver and reset session', (done) => {
        driver = driverBuilder();
        loginPage = new LoginPage(driver);
        sideBar = new SideBar(driver);
        audiencesLibrary = new AudiencesLibrary(driver);
        audiencesDelete = new AudiencesDelete(driver);
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

    it('audiences page should have all the elements', function(done) {
        sideBar.clickAudiencesLink();
        audiencesLibrary.getTitleAudiences().getAttribute('innerHTML').
            then(function(innerHTML) {
                expect(innerHTML).to.equal('Audiences');
            });
        expect(audiencesLibrary.getTitleAudienceSelect()).to.exist;
        expect(audiencesLibrary.getButtonNewAudience()).to.exist;
        expect(audiencesLibrary.getTitleAudienceView()).to.exist;
        expect(audiencesLibrary.getInputSearch()).to.exist;
        expect(audiencesLibrary.getRowsToShow()).to.exist;
        expect(audiencesLibrary.getFirstControlButton()).to.exist;
        expect(audiencesLibrary.getPreviousControlButton()).to.exist;
        expect(audiencesLibrary.getNextControlButton()).to.exist;
        expect(audiencesLibrary.getLastControlButton()).to.exist;
        expect(audiencesLibrary.getUploadFileButton()).to.exist;
        expect(audiencesLibrary.getAudienceTable()).to.exist;
        expect(audiencesLibrary.getTableAudienceName()).to.exist;
        expect(audiencesLibrary.getTableAdvName()).to.exist;
        expect(audiencesLibrary.getTableMatchCount()).to.exist;
        expect(audiencesLibrary.getTableSegmentSize()).to.exist;
        expect(audiencesLibrary.getTableUpdated()).to.exist;
        expect(audiencesLibrary.getTableCreated()).to.exist;
        driver.sleep(driverTimeOut).then(() => done());
    });


    it('audience in audience view should have correct' +
        ' options', function(done) {
        audiencesLibrary.getLinkEdit();
        audiencesLibrary.getLinkViewDetails();
        audiencesLibrary.clickLinkMore();
        audiencesLibrary.getDeleteAudience();
        audiencesLibrary.getShareAudience();
        driver.sleep(driverTimeOut).then(() => done());
    });

    it('delete modal should have all the elements', function(done) {
        driver.navigate().refresh();
        audiencesLibrary.clickDeleteAudience(targetAudience.name);
        audiencesDelete.getTitleDelete();
        audiencesDelete.getTextModal();
        audiencesDelete.getTextAudience(targetAudience.name);
        audiencesDelete.getTextFirstCheck();
        audiencesDelete.getTextSecondCheck();
        audiencesDelete.getCheckFirst();
        audiencesDelete.getCheckSecond();
        audiencesDelete.getButtonCancel();
        audiencesDelete.getButtonDelete();
        audiencesDelete.clickDelete();
        audiencesDelete.getAlertText('Hold Up! Please confirm you understand' +
                    ' what happens when you delete this audience.');
        audiencesDelete.clickCancel();
        driver.sleep(driverTimeOut).then(() => done());
    });

    // it('audiences view name should be editable', function(done) {
    //     audiencesLibrary.clickEditAudience(targetAudience.name);
    //     audiencesLibrary.setInputAudienceName('name edited');
    //     audiencesLibrary.clickAudienceView();
    //     audiencesLibrary.getAudienceName('name edited');
    //     audiencesLibrary.clickEditAudience('name edited');
    //     audiencesLibrary.setInputAudienceName(targetAudience.name);
    //     audiencesLibrary.clickAudienceView();
    //     audiencesLibrary.getAudienceName(targetAudience.name);
    //     driver.sleep(driverTimeOut).then(() => done());
    // });

});
