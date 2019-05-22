'use strict';

// vendor dependencies

const rootPath = process.env.ROOT_PATH;

// selenium runtime variables
const webdriver = require('selenium-webdriver');
const By = webdriver.By;
const promise = webdriver.promise;

const BasePage = require(rootPath + '/pages/salesforce');

// elements
const IO_NUMBER = By.css('.pageDescription');

function InsertionOrderDetail(webdriver) {
    BasePage.call(this, webdriver);
}

InsertionOrderDetail.prototype = Object.create(BasePage.prototype);
InsertionOrderDetail.prototype.constructor = InsertionOrderDetail;

InsertionOrderDetail.prototype.getInsertionOrderNumber = function() {
    this.waitUntilVisible(IO_NUMBER);
    return new promise.Promise((resolve, reject) => {
        this.driver.findElement(IO_NUMBER).then((element) => {
            element.getText().then((text) => {
                resolve(text.trim());
            })
                .catch((err) => {
                    reject(err);
                });
        }, (err) => {
            reject(err);
        });
    });
};

module.exports = InsertionOrderDetail;
