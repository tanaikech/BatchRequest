BatchRequest
=====

<a name="TOP"></a>
[![MIT License](http://img.shields.io/badge/license-MIT-blue.svg?style=flat)](LICENCE)

<a name="Overview"></a>
# Overview
**This is a library for running Batch Requests using Google Apps Script (GAS).**


<a name="Description"></a>
# Description
When users use Google's APIs, one quota is used for one API call. When the batch request is used, several APIs can be called by one quota, although there are some limitations in the batch request. For example, in GAS, Drive API can be used be ``DriveApp``. In this case, the quota is not used for using Drive API. (When ``Drive`` of Advanced Google Services is used, the quota is used.) But this is Drive API v2. If users want to use Drive API v3, it is required to directly request each endpoint of Drive API v3. The batch request is much useful for this situation. However, it is a bit difficult for users to use the batch request. Because the batch request is requested by ``multipart/mixed``. I thought that the script may become a bit complicated, because of the request of ``multipart/mixed`` using ``UrlFetchApp``. And although I had been looking for the libraries for the batch request, I couldn't find them. So I created this.


# Library's project key
~~~
1HLv6tWz0oXFOJHerBTP8HsNmhpRqssijJatC92bv9Ym6HSN69_UuzcDk
~~~


<a name="Howtoinstall"></a>
# How to install
In order to use this library, please install this library.

1. [Install BatchRequest library](https://developers.google.com/apps-script/guides/libraries).
    - Library's project key is **``1HLv6tWz0oXFOJHerBTP8HsNmhpRqssijJatC92bv9Ym6HSN69_UuzcDk``**.
1. For APIs you want to use, please enable the APIs at API console.
    - Recently, when it enabled APIs, I had an experience that I was made to wait for several minutes for enabling APIs. So when you enabled APIs at API console, if the error related to APIs occurs, please run again after several minutes.


## About scopes
About the install of scopes using at this library, users are not required to install scopes. Because this library can automatically install the required scopes to the project which installed this library. The detail information about this can be seen at [here](https://gist.github.com/tanaikech/23ddf599a4155b66f1029978bba8153b).

- ``https://www.googleapis.com/auth/drive``
- ``https://www.googleapis.com/auth/drive.scripts``
- ``https://www.googleapis.com/auth/script.external_request``
- ``https://mail.google.com/``
- ``https://www.googleapis.com/auth/calendar``

> IMPORTANT: Above 5 scopes are installed in this library. If you want to use APIs except for Calendar API, Drive API and Gmail API, please install the scopes for the APIs using [Manifests](https://developers.google.com/apps-script/concepts/manifests) to the project installed this library. Also there is [a GAS library for managing Manifests](https://github.com/tanaikech/ManifestsApp).


# Usage
A sample script is as follows. This sample script renames 2 files using [update of Drive API v3](https://developers.google.com/drive/v3/reference/files/update).

~~~javascript
var requests = {
    batchPath: "batch/drive/v3", // batch path. This will be introduced in the near future.
    requests: [
        {
            method: "PATCH",
            endpoint: "https://www.googleapis.com/drive/v3/files/### file ID1 ###?fields=name",
            requestBody: {name: "sample1"},
            accessToken: ScriptApp.getOAuthToken(), // If this key is used, this access token is used.
        },
        {
            method: "PATCH",
            endpoint: "https://www.googleapis.com/drive/v3/files/### file ID2 ###?fields=name",
            requestBody: {name: "sample2"},
        },
    ],
};
var result = BatchRequest.Do(requests); // Using this library
Logger.log(result);
~~~

- [``batchPath``](https://developers.google.com/drive/v3/web/batch#details) will be introduced in the near future. But you have already been able to use this. ``batchPath`` can be retrieved by [Discovery](https://developers.google.com/discovery/v1/reference/apis).

- If ``accessToken`` is used in the object of requests, the ``accessToken`` is used for the individual request in the batch request. If ``accessToken`` is not used in the requests, this library uses ``ScriptApp.getOAuthToken()`` for the whole batch request.


# Limitations for batch request
There are some limitations for the batch request.

- In the current stage, the batch request can be used for the following APIs. The number of requests which can be used in one batch request has the limitations for each API. Please check the detail information from following links.
    - Calendar API: [https://developers.google.com/calendar/batch](https://developers.google.com/calendar/batch)
    - Cloud Storage: [https://cloud.google.com/storage/docs/json_api/v1/how-tos/batch](https://cloud.google.com/storage/docs/json_api/v1/how-tos/batch)
    - Directory API: [https://developers.google.com/admin-sdk/directory/v1/guides/batch](https://developers.google.com/admin-sdk/directory/v1/guides/batch)
    - Drive API: [https://developers.google.com/drive/v3/web/batch](https://developers.google.com/drive/v3/web/batch)
    - Gmail API: [https://developers.google.com/gmail/api/guides/batch](https://developers.google.com/gmail/api/guides/batch)

- At Batch request, it can include only one kind of API in the requests. For example, Drive API and Gmail API cannot be used for one batch request. Only one API can be used. So as a sample, you can rename the filenames of several files using Drive API by one batch request.

- The batch request is worked by the asynchronous processing. So the order of request is not guaranteed.


# Appendix
- About the limitation of number of request for one batch request
    - The batch request is worked by the asynchronous processing. Also [the fetchAll method is worked by the asynchronous processing.](https://gist.github.com/tanaikech/c0f383034045ab63c19604139ecb0728) I think that by using both, the number of requests for one batch request can be increased.
- [RunAll](https://github.com/tanaikech/RunAll)
    - This is a library for running the concurrent processing using only native Google Apps Script (GAS).


-----

<a name="Licence"></a>
# Licence
[MIT](LICENCE)

<a name="Author"></a>
# Author
[Tanaike](https://tanaikech.github.io/about/)

If you have any questions and commissions for me, feel free to tell me.

<a name="Update_History"></a>
# Update History
* v1.0.0 (May 2, 2018)

    1. Initial release.


[TOP](#TOP)
