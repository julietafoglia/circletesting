'use strict';

module.exports = {

    // auth
    'authLogin': '/auth/login',
    'authLogout': '/auth/logout',
    'authRefresh': '/auth/refesh',
    'authMe': '/auth/me',

    // ad slot
    'adSlotCreate': '/ad-slot',
    'adSlotDelete': '/ad-slot/%s',
    'adSlotDetails': '/ad-slot/%s',
    'adSlotLinkStrategies': '/ad-slot/link-strategies/%s',
    'adSlotSave': '/ad-slot/%s',
    'adSlotActivate': '/ad-slot/activate/%s',

    // advertiser
    'advertiserCreate': '/advertiser',
    'advertiserDelete': '/advertiser/%s',
    'advertiserDetails': '/advertiser/%s',
    'advertiserSave': '/advertiser/%s',

    // agency
    'agencyCreate': '/media-group',
    'agencyDelete': '/media-group/%s',
    'agencyDetails': '/media-group/%s',
    'agencySave': '/media-group/%s',

    // audience
    'audienceCreate': '/audience',
    'audienceDelete': '/audience/%s',
    'audienceDetails': '/audience/%s',
    'audienceSave': '/audience/%s',

    // batch
    'batch': '/batch',

    // build
    'build': '/build',

    // bundle
    'bundleCreate': '/bundle',
    'bundleDelete': '/bundle/%s',
    'bundleDetails': '/bundle/%s',
    'bundleSave': '/bundle/%s',

    // campaign
    'campaignActivate': '/campaign/activate/%s',
    'campaignConfirm': '/campaign/confirm/%s',
    'campaignCreate': '/campaign',
    'campaignDelete': '/campaign/%s',
    'campaignDetails': '/campaign/%s',
    'campaignSave': '/campaign/%s',

    // creative
    'creativeCreate': '/creative',
    'creativeDelete': '/creative/%s',
    'creativeDetails': '/creative/%s',
    'creativeSave': '/creative/%s',
    'creativeApprove': '/creative/approve/%s/%s', // {id}/{approvalKey}
    'creativeReject': '/creative/reject/%s/%s', // {id}/{approvalKey}
    'creativeArchive': '/creative/archive/%s',
    'creativeUnarchive': '/creative/unarchive/%s',

    // insertion order
    'insertionOrderCreate': '/insertion-order',
    'insertionOrderDelete': '/insertion-order/%s',
    'insertionOrderDetails': '/insertion-order/%s',
    'insertionOrderSave': '/insertion-order/%s',

    // lau (live audience uploader)
    'lauCredentials': '/lau/credentials',
    'lauCancel': '/lau/cancel',
    'lauStatus': '/lau/status',
    'lauSearchAudienceAdvertiser':
        '/lau/search/audience/advertiser/%s',

    // media group
    'mediaGroupCreate': '/media-group',
    'mediaGroupDelete': '/media-group/%s',
    'mediaGroupDetails': '/media-group/%s',
    'mediaGroupSave': '/media-group/%s',

    // newsletter
    'newsletterCreate': '/newsletter',
    'newsletterDelete': '/newsletter/%s',
    'newsletterDetails': '/newsletter/%s',
    'newsletterLinkStrategies': '/newsletter/link-strategies/%s',
    'newsletterSave': '/newsletter/%s',
    'newsletterSafeRtbTags': '/newsletter/safe-rtb-tags/%s',
    'newsletterExportTags': '/newsletter/export-tags/%s',

    // pixel
    'pixelCreate': '/pixel',
    'pixelDelete': '/pixel/%s',
    'pixelDetails': '/pixel/%s',
    'pixelSave': '/pixel/%s',

    // pixel
    'liveconnectTag': '/dcs',

    // publisher
    'publisherCreate': '/publisher',
    'publisherDelete': '/publisher/%s',
    'publisherDetails': '/publisher/%s',
    'publisherSave': '/publisher/%s',

    // data provider
    'dataProviderCreate': '/data-provider',

    // search - agency
    'searchAgency': '/search/agency',
    'searchAgencyParameters': '/search/agency?params=%s',

    // search - audience
    'searchAudience': '/search/audience',
    'searchAudienceParameters': '/search/audience?params=%s',
    'searchAudienceStrategy':
        '/search/audience/strategy/', // search for audience by strategy

    // search - bundle
    'searchBundle': '/search/bundle',
    'searchBundleParameters': '/search/bundle?params=%s',

    // search - creative
    'searchCreativeStrategy':
        '/search/creative/strategy/', // search for creatives by strategy

    // search - data provider
    'searchDataProvider':
        '/search/data-provider/', // search for data provider
    'searchDataProviderCategory':
        '/search/data-provider/%s', // search for data provider categories
    'searchDataProviderSegment':
        '/search/data-provider/%s', // search for data provider segment

    // search - ssp-control - publisher
    'searchSspControlPublisher':
        '/search/ssp-control/publisher',
    'searchSspControlPublisherParams':
        '/search/ssp-control/publisher?params=%s',

    // search - entity (advanced)
    'searchAdSlotAdvanced': '/search/ad-slot',
    'searchAdvertiserAdvanced': '/search/advertiser',
    'searchAgencyAdvanced': '/search/agency',
    'searchBundleAdvanced': '/search/bundle',
    'searchCampaignAdvanced': '/search/campaign',
    'searchCityAdvanced': '/search/city',
    'searchCountryAdvanced': '/search/country',
    'searchCreativeAdvanced': '/search/creative',
    'searchDataProviderSegmentAdvanced':
        '/search/data-provider%2Fsegment',
    'searchDeviceTypeAdvanced': '/search/device-type',
    'searchDeviceManufacturerAdvanced': '/search/device-manufacturer',
    'searchInsertionOrderAdvanced': '/search/insertion-order',
    'searchMediaGroupAdvanced': '/search/media-group',
    'searchMetroAdvanced': '/search/metro',
    'searchNewsletterAdvanced': '/search/newsletter',
    'searchPublisherAdvanced': '/search/publisher',
    'searchRegionAdvanced': '/search/region',
    'searchPixelAdvanced': '/search/pixel',
    'searchStrategyAdvanced': '/search/strategy',
    'searchStrategyAdSlot': '/search/strategy/ad-slot/%s',
    'searchStrategyAdSlotAdvanced': '/search/strategy/ad-slot',
    'searchStrategyNewsletter': '/search/strategy/newsletter/%s',
    'searchStrategyNewsletterAdvanced': '/search/strategy/newsletter',
    'searchSspControlPublisherAdvanced': '/search/ssp-control/publisher',

    // search - key value
    'searchKeyValueStrategy':
        '/search/key-value/strategy/%s', // search for key values by strategy

    // search - liveramp audience
    'searchLiveRampAudienceAdvertiser':
        '/search/liveramp-audience/advertiser/%s',
    // search for liveramp audience by advertiser

    'searchLiveRampAudienceStrategy':
        '/search/liveramp-audience/strategy/%s',
    // search for liveramp audience by strategy

    'searchPublisherBlockable':
        '/search/publisher/blockable/advertiser/%s',
    // search publishers than an advertiser may whitelist or blacklist

    // strategy
    'strategyCreate': '/strategy',
    'strategyDelete': '/strategy/%s',
    'strategyDetails': '/strategy/%s',
    'strategyLinkCreatives': '/strategy/link-creatives/%s',
    'strategySave': '/strategy/%s',
    'strategyLinkAdSlots': '/strategy/link-ad-slots/%s',

    // rbac
    'rbacRole': '/rbac/role',
    'rbacUserAdmins': '/rbac/user/admins',
    'rbacUserManager': '/rbac/user/managers',
    'rbacUserDetails': '/rbac/user/%s',
    'rbacUserGrant': '/rbac/user/grant/%s',
    'rbacUserRevoke': '/rbac/user/revoke/%s',
    'rbacUserSave': '/rbac/user/save/%s',

    // user
    'userCreate': '/user',
    'userDelete': '/user/%s',
    'userDetails': '/user/%s',
    'userMetaSave': '/user/save-meta/%s',
    'userSave': '/user/%s'
};
