*entity001* agency003 - minimum required fields (self-service)

*entity002* advertiser001 - minimum required fields

*entity003* insertionOrder001 - self-service - [advertiser001] (self-service)

*entity004* campaign001 - minimum required fields - [insertionOrder001] (branding - impressions)

*entity005* lineItem001 - dsp - exchange - newsletter - currency - cpm - 1st price -
    [campaign001]

*entity006* creative001 - url file (300x250 jpg) - [advertiser001]

*entity007* creative002  - url file (300x250 jpg) - [advertiser001]

*entity008* pixel001 - ssp - minimum required fields - [advertiser001]

*entity009* insertionOrder002 - self-service - [advertiser001] (self-service)

*entity010* campaign002 - minimum required fields - [insertionOrder002] (branding - impressions)

*entity011* agencyUser001 - [granted to agency003] (self-service)

*entity012* advertiserUser001 - [granted to advertiser001]

*entity013* advertiserUser002 - [granted to advertiser001]
    (zero-state - granted but not added to meta data)

*entity014* lineItem002 - dsp - exchange - newsletter - currency - cpm - 1st price -
    [campaign001] (delete)