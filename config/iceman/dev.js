'use strict';

// note 2016-10-28: wolfman is the main consumer of iceman in
//  ghostrider and dev-wolfman currently uses qa-iceman for oauth
//  setting dev-iceman to this config is a hack in order to avoid
//  have to set local settings are each gulp task runtime

module.exports = {
    'server': 'https://qa-iceman.liveintenteng.com',

    'clientToken': 'Y2xpZW50MTpjbGllbnQxLXNlY3JldA=='
};
