# Merlin

## Table of Contents
- [Naming Test Objects](#obj-names)
- [Standard Test Cases](#test-cases)
 * [API](#api)
 * [Search](#search)

## <a name="obj-names"></a> Naming Test Objects

Test objects should be named in a consistent manner that not only fits API specifications but also makes it easy to track the objects if there is a need to. The naming convention to be followed is as below:

`[entity-abbreviation]@[timestamp][version-optional]`

- **entity-abbreviation**: the abbreviation of the endpoint the test object belongs to.
- **timestamp**: `YYYY-MM-DDTHH:mm:ss.SS`.
- **version**: `@vN` where N is the version number, e.g, the first update to an object is version 2.

#### Endpoints Abbreviation
Below is a list of standard abbreviations of endpoints currently supported in Merlin.

 Entity                 | Abbreviation
 ---------------------- | -------------------
  Advertiser            | adv
  Ad-Slot               | ads
  Agency                | agc
  Audience              | aud
  Bundle                | bun
  Campaign              | cam
  Creative              | cre
  Data Provider         | dp
  Data Provider Segment | dps
  Fallback Creative     | fc
  Insertion Order       | io
  Media Group           | mda-grp
  Newsletter            | news
  Pixel                 | pix
  Publisher             | pub
  Strategy (Line Item)  | strat

##### Examples:
- Initial Object: ```adv@YYYY-MM-DDTHH:mm:ss.SS```
- First update: ```adv@YYYY-MM-DDTHH:mm:ss.SS@v2```
- ...
- Nth update: ```adv@YYYY-MM-DDTHH:mm:ss.SS@vN```

Note: In cases where ```[endpoint]@YYYY-MM-DDTHH:mm:ss.SS@vN``` is too long, `v` can be dropped as follows, ```[endpoint]@YYYY-MM-DDTHH:mm:ss.SS@N```.

## <a name="test-cases"></a> Standard Test Cases

As per the [guideline](https://github.com/LiveIntent/ghostrider/blob/master/guideline.md), test cases should be grouped by endpoints (endpoints are divided into **`API`** and **`Search`**).

For each endpoint test cases are divided into **positive** and **negative** using the below criteria:

- *positive*: perform actions that fit the product specification.

- *negative*: attempt actions that go against product specification.

Each test case falls under one of the following categories:
- *body*: test cases concerned with the request body/payload.
- *url*: manipulate the url of the endpoint in being tested.
- *request type*: are concerned with the HTTP method being used or the entire request setup e.g a POST request with an empty body.

### <a name="api"></a> API
The following are the main API endpoints in Merlin:
- [Create](#create)
- [Delete](#del)
- [Details](#details)
- [Save](#save)

#### <a name="create"></a> *Create*
###### Body
  Test cases are defined by the contents of the request body as below:
  
      **Positive**                            |       **Negative**                 
   ------------------------------------------ | -------------------------------------- 
   minimum required fields only               |  invalid required field(s)            
   all valid fields accepted by the endpoint  |  missing required field(s)            
   non-required fields holding a null value   |  invalid non-required field(s)        
   string fields of maximum length            |                                      


###### Url

    **Positive**                            |       **Negative**                 
   ---------------------------------------- | --------------------------------------
    trailing slash appended to end the url e.g `url + "/"` |  invalid characters appended to the end of the url
                                            | a blank string appended to end the url
                                            | a directory navigation string appended to url e.g `url + "/../../`
    

###### Request type

  **Negative**                                |
  ------------------------------------------- |
   a PUT request with a valid body            |
   a PUT request with an invalid body         |
   a POST request with an empty body, ie,`{}` |
   a POST request missing request body        |

#### <a name="del"></a> *Delete*

###### Url

   **Positive**                             |   **Negative**                 
  ----------------------------------------- | -------------------------------------- 
    a trailing slash appended to end the url e.g `url + "/"` | invalid characters appended to the end of the url
                                            | a blank string appended to end the url
                                            | url with invalid id
                                            | url missing id
   
###### Request type
  
  NOTE: For positive test cases, an entity is deleted followed by a GET request. The response object's `status` field should be equal to `deleted`.

   **Positive**                               |   **Negative**                 
  ------------------------------------------- | -------------------------------------- 
   cascade delete: delete parent entity(s)    | a DELETE request with a valid request body
   delete entity with minimum required fields | a DELETE request with an invalid request body
   delete entity with all valid fields        | save to a deleted entity

#### <a name="details"></a> *Details*
 
###### Url

   **Positive**                             |   **Negative**                 
  ----------------------------------------- | -------------------------------------- 
  a trailing slash appended to end the url e.g `url + "/"` | invalid characters appended to the end of the url
                                            | url with invalid id
                                            | a blank string appended to end the url
                                            | url missing id
                                            | with a directory navigation string appended to url e.g `url + "/../../`

###### Request Type

  **Negative**                                |                
  ------------------------------------------- |
   a GET request with a valid request body    |
   a GET request with an invalid request body |

#### <a name="save"></a> *Save*
###### Body
  Test cases are defined by the contents of the request body used to update an entity, as follows:
  
  **Positive**                                                       |   **Negative**                 
  ------------------------------------------------------------------ | ----------------------------------------------- 
   valid minimum required fields for endpoint > create               | invalid required field(s) for endpoint > create
   minimum required field(s) for endpoint > save e.g `version`       | invalid required fields for endpoint > save
   all valid fields for endpoint > create                            | missing required field(s)
   valid null non-required fields for endpoint > create              | invalid non-required field(s)
   valid string fields of maximum length                             | version number that has been updated before
                                                                     | valid values for non-editable fields e.g. refId, id, etc
  NOTE: the fields for endpoint > create used should be valid, ie, accepted by endpoint > save.
  
###### Url

   **Positive**                             |   **Negative**                 
  ----------------------------------------- | -------------------------------------- 
   a trailing slash appended to end the url | invalid characters appended to the end of the url
                                            | a blank string appended to end the url
                                            | url with invalid id
                                            | with a directory navigation string appended to url e.g `url + "/../../`


###### Request type
  
    **Negative:**                       |
   ------------------------------------ | 
   a PUT request with a valid body      |
   a PUT request with an invalid body   |
   a POST request empty body, ie, `{}`  |
   a POST request missing body          |

### <a name="search"></a> Search

#### Basic Search

##### Url Based Test Cases
 **Positive**                                                           |          **Negative** 
 -----------------------------------------------------------------------|-----------------------------------------------
Basic verification - response object matches specification              | Invalid query parameters - keys
Basic verification - response object matches created object             | Invalid query parameters - values
Basic verification - response object matches search criteria/parameters | Unsupported query parameters - non-searchable keys
Order-by verification                                                   | Invalid query parameters - invalid sort-by value
Sort-by verification                                                    | Invalid query parameters - invalid order-by value
Row count verification                                                  | url ending in a blank string
Pagination verification                                                 |
url ending in a trailing forward slash                                  |

#### Advanced Search

##### Body Based Test Cases

  **Positive**                                  |          **Negative** 
 -----------------------------------------------|-----------------------------------------------
  empty request body (return all results)       | 
  orderBy verification                          | unsupported orderBy fields 
  sorting verification                          | invalid non-sortable fields
  row count verification                        | invalid values for row count (`number`)
  `return` and `returnMode` verification        | invalid value(s) in `return` list
  pagination verification                       | invalid `mode` operations
  search verification of a newly created object     | 
  `conditions` > `mode` verification                | 
  `conditions` > `field`, `value` pair verification | including non-searchable fields in the conditions
                                                    | invalid values for field names
  `conditions` > `operator` verification            | invalid operand, `operator` combinations
  multiple `conditions` combinations e.g `mode` with `field` and `operator` |

##### Url Based Test Cases
  
   **Positive**                              |          **Negative** 
 --------------------------------------------|-----------------------------------------------
  url ending in a trailing forward slash     |   url ending in a blank string
