'use strict';

function safeRtb(tags, tagsUrlPrefix) {
    let openingTag = `<table cellpading="0" cellspacing="0" 
                    border="0" width="40" height="6"><tbody><tr>`;
    let closingTag = `</tr></tbody></table>`;
    return isValidTag(tags, tagsUrlPrefix, openingTag, closingTag);
}

function adSlot(tag, tagsUrlPrefix) {
    const openingTag = `<table border="0" cellpadding="0" cellspacing="0" >`;
    const closingTag = `</table>`;
    return isValidTag(tag, tagsUrlPrefix, openingTag, closingTag);
}

/**
 * Check if a tag is valid
 * @param {String} tags safe rtb tags
 * @param {String} tagsUrlPrefix publisher tags domain
 * @param {string} openingTag html container opening tag
 * @param {String} closingTag html container closing tag
 */
function isValidTag(tag, tagsUrlPrefix, openingTag, closingTag) {
    let tdTags = tag.replace(openingTag, '').replace(closingTag, '');
    if (tdTags === tag) { return false; }

    let tdTagsArray = tdTags.split('</tr>');

    if (!tdTagsArray.length) { return false; }
    let imageTagPrefix = `<img src="${tagsUrlPrefix}/imp?`;
    for(let i = 0; i < tdTagsArray.length - 1; i++) {
        if (tdTagsArray[i].indexOf(imageTagPrefix) === -1) {
            return false;
        }
    }
    return true;
}

module.exports = {
    safeRtb,
    adSlot
};
