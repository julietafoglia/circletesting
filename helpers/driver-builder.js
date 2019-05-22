'use strict';
/* eslint no-unused-vars: "off" */
require('chromedriver');
require('geckodriver');
const selenium = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const firefox = require('selenium-webdriver/firefox');
const UNCAUGHT_EXCEPTION =
    selenium.promise.ControlFlow.EventType.UNCAUGHT_EXCEPTION;

const fs = require('fs');
const moment = require('moment');
const rootPath = process.env.ROOT_PATH;
const targetBrowser = process.env.SELENIUM_BROWSER;
const headless = (process.env.SELENIUM_HEADLESS == 'true');

let buildDriver = (function() {

    let driver;
    /**
     * Build selenium webdriver
     * @param {Object} capabilities desired driver capabilities
     * @returns {WebDriver}
     */
    function init(capabilities) {
        capabilities = capabilities || {};

        let chromeOptions = new chrome.Options();
        let firefoxOptions = new firefox.Options();
        if (driver !== undefined) {
            return driver;
        } else if (targetBrowser == 'jenkinsChrome'){
            process.env.SELENIUM_BROWSER = 'chrome';
            chromeOptions.addArguments('--no-sandbox');
            chromeOptions.addArguments('--window-size=1600,900');
            if (headless) {
                chromeOptions.addArguments('--headless');
                chromeOptions.addArguments('--disable-gpu');
            }
        } else if (targetBrowser == 'firefox') {
            if (headless){
                firefoxOptions.addArguments('--headless');
            }
        } else {
            chromeOptions.addArguments('--no-sandbox');
            chromeOptions.addArguments('--start-maximized');
            if (headless) {
                chromeOptions.addArguments('--headless');
                chromeOptions.addArguments('--disable-gpu');
            }
        }

        driver = new selenium.Builder()
            .forBrowser(targetBrowser)
            .setChromeOptions(chromeOptions)
            .setFirefoxOptions(firefoxOptions)
            .withCapabilities(capabilities)
            .build();
        registerHandlers(driver);

        if(targetBrowser == 'firefox'){
            driver.manage().window().maximize();
        }

        return driver;
    }

    /**
     * Take and save screenshots to disk
     * @param {Webdriver} driver
     */
    function takeScreenshot(driver) {
        driver.takeScreenshot().then((png) => {
            let timeStamp = moment().format('MM-DD-YY-HH:mm:ss.SS');
            let screenshotsRoot = `${rootPath}/screenshots/`;
            let productScreenshots =
                screenshotsRoot + process.env.PRODUCT + '/';
            if (!fs.existsSync(screenshotsRoot)) {
                fs.mkdirSync(screenshotsRoot);
                fs.mkdirSync(productScreenshots);
            } else if (!fs.existsSync(productScreenshots)) {
                fs.mkdirSync(productScreenshots);
            }
            let outputFile = `${productScreenshots}${timeStamp}.png`;
            fs.writeFileSync(outputFile, new Buffer(png, 'base64'));
        }, (err) => {
            // Ignore error
        });
    }

    /**
     * Register event handlers
     * @param {Webdriver} driver
     */
    function registerHandlers(driver) {
        // Attach listener for Selenium specific uncaught exceptions
        if (process.env.SCREENSHOT === 'on') {
            let controlFlow = driver.controlFlow();
            controlFlow.addListener(UNCAUGHT_EXCEPTION, (error) => {
                takeScreenshot(driver);
                throw error;
            });
        }

        // Register a listener to call driver quit before process exits
        process.on('beforeExit', () => {
            if (driver) {
                driver.quit().then( () => {
                    driver = null;
                }, (err) => {
                // Ignore error and quit process
                    process.exit(1);
                });
            }
        });

        process.on('uncaughtException', (err) => {
        // Suppress unhandled exceptions
        });
    }

    return init;

})();

module.exports = buildDriver;
