'use strict';

// vendor dependencies
const chance = require('chance').Chance();
const chai = require('chai');


const expect = chai.expect; // use bdd chai
const fs = require('fs');
const jsonfile = require('jsonfile');
const moment = require('moment');


const request = require('supertest-as-promised');
const util = require('util');
const validator = require('validator');

module.exports = function(filename, options) {

    return new Promise( function(resolve, reject) {
        jsonfile.readFile(filename, options, function(err, obj) {
            if (err) {
                reject(err);
            } else {
                resolve(obj);
            }
        });
    });
};
