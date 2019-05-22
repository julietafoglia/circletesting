'use strict';

const moment = require('moment');

/**
 * Parse LSD campaign's comment field into an object
 * @param {String} lsdCampaignComment
 * @return {Object} object representation of the comment
 */
function parseComment(lsdCampaignComment) {
    let toJson;
    try {
        toJson = JSON.parse(lsdCampaignComment);
    } catch(err) {
        return 'Failed to parse comment';
    }
    let startDate = parseDate(toJson.startDate);
    let endDate = parseDate(toJson.endDate);
    let results = {};
    results.startDate = startDate;
    results.endDate = endDate;
    if (toJson.targetingDescription) {
        results.targetingDescription = toJson.targetingDescription;
    }
    return results;
}

/**
 * Parse LSD date into the format used on SFDC
 * @param {String} lsdDateString date string in the format used by LSD
 * @return {String} date string in SFDC format
 */
function parseDate(lsdDateString) {
    return moment(lsdDateString, 'YYYY-MM-DD').format('MM/DD/YYYY');
}

function parseFreqCapPeriod(lsdFreqCapPeriod) {
    switch (lsdFreqCapPeriod) {
    case 'minute':
        return 'Minute';
    case 'hourly':
        return 'Hour';
    case 'daily':
        return 'Day';
    case 'weekly':
        return 'Week';
    case 'monthly':
        return 'Month';
    default:
        throw new Error('Unknown frequency cap period');
    }
}

/**
 * Construct an IO name that matches the one sent to LSD by SFDC
 * @param {String} accountName SFDC account name
 * @param {Object} opportunity test data
 * @param {Number} budget campaign budget
 * @return {String} io name
 */
function constructIOName(accountName, opportunity, budget) {
    let result = [];
    if (opportunity.type === 'Agency') {
        result.push(accountName + ' (' + opportunity.brand + ')');
    } else {
        result.push(accountName);
    }
    result.push(opportunity.type);
    result.push(stripLeadingZeros(opportunity.liveDate));
    result.push(stripLeadingZeros(opportunity.endDate));
    result.push('$' + budget);
    return result.join(' : ');
}

/**
 * Strip leading zeros from a date with format MM/DD/YYYY
 */
function stripLeadingZeros(date) {
    return date.split('/').map(val => parseInt(val)).join('/');
}

module.exports = {
    constructIOName,
    parseComment,
    parseDate,
    parseFreqCapPeriod
};
