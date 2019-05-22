*manager - agency001* agency test entities for manager permission level

*manager - media-group001* media group test entities for manager permission level

*self-service - agency001* agency test entities for self-service permission levels (currently agency-demand-audience and advertiser-demand-audience)

*entities-dsp.json* source file where test entities are accessed (run `gulp bootstrap-view` for a visual representation of the file)

*teardown.js* script via SuperTest that performs a cascading delete of the test entities (deleting the top-most parent entity)