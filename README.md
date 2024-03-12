# BatchRequest

<a name="top"></a>
[![MIT License](http://img.shields.io/badge/license-MIT-blue.svg?style=flat)](LICENCE)

<a name="overview"></a>

# Overview

**This is a library for running Batch Requests using Google Apps Script (GAS).**

<a name="description"></a>

# Description

When users use Google's APIs, one quota is used for one API call. When the batch request is used, several APIs can be called by one quota, although there are some limitations in the batch request. For example, in GAS, Drive API can be used be `DriveApp`. In this case, the quota is not used for using Drive API. (When `Drive` of Advanced Google Services is used, the quota is used.) But this is Drive API v2. If users want to use Drive API v3, it is required to directly request each endpoint of Drive API v3. The batch request is much useful for this situation. However, it is a bit difficult for users to use the batch request. Because the batch request is requested by `multipart/mixed`. I thought that the script may become a bit complicated, because of the request of `multipart/mixed` using `UrlFetchApp`. And although I had been looking for the libraries for the batch request, I couldn't find them. So I created this.

## Sample scripts

- [Managing A Lot Of Google Calendar Events using Batch Requests with Google Apps Script](https://github.com/tanaikech/Managing-A-Lot-Of-Google-Calendar-Events-using-Batch-Requests-with-Google-Apps-Script)
- [Batch Requests for Drive API using Google Apps Script](https://github.com/tanaikech/Batch-Requests-for-Drive-API-using-Google-Apps-Script)

# Library's project key

```
1HLv6tWz0oXFOJHerBTP8HsNmhpRqssijJatC92bv9Ym6HSN69_UuzcDk
```

<a name="Howtoinstall"></a>

# How to install

In order to use this library, please install this library.

1. [Install BatchRequest library](https://developers.google.com/apps-script/guides/libraries).
   - Library's project key is **`1HLv6tWz0oXFOJHerBTP8HsNmhpRqssijJatC92bv9Ym6HSN69_UuzcDk`**.
1. For APIs you want to use, please enable the APIs at API console.
   - Recently, when it enabled APIs, I had an experience that I was made to wait for several minutes for enabling APIs. So when you enabled APIs at API console, if the error related to APIs occurs, please run again after several minutes.

## About scopes

About the install of scopes using at this library, users are not required to install scopes. Because this library can automatically install the required scopes to the project which installed this library. The detail information about this can be seen at [here](https://gist.github.com/tanaikech/23ddf599a4155b66f1029978bba8153b).

- `https://www.googleapis.com/auth/drive`
- `https://www.googleapis.com/auth/drive.scripts`
- `https://www.googleapis.com/auth/script.external_request`
- `https://mail.google.com/`
- `https://www.googleapis.com/auth/calendar`

> IMPORTANT: Above 5 scopes are installed in this library. If you want to use APIs except for Calendar API, Drive API and Gmail API, please install the scopes for the APIs using [Manifests](https://developers.google.com/apps-script/concepts/manifests) to the project installed this library. Also there is [a GAS library for managing Manifests](https://github.com/tanaikech/ManifestsApp).

# Methods

| Method                                       | Description                                                                                                                                                                                                                                                                                                                                           |
| :------------------------------------------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [Do(object)](#do)                            | This is a simple method for the batch request. The maximum number of requests is 100. The raw values from the batch request are returned.                                                                                                                                                                                                             |
| [EDo(object)](#edo)                          | This method is the enhanced `Do()` method. When this method is used, the result values from the batch requests are parsed. And also, the number of requests more than 100 can be used. In this case, the split of the number of requests is processed for the limitation of 100.                                                                      |
| [getBatchPath(name, version)](#getbatchpath) | Get batch path for using batch requests. On August 12, 2020, in order to use batch requests, the batch path is required to be used to the endpoint of the batch requests. This method can simply retrieve the batch path from the name of Google API. And, the retrieved batch path can be used in [Do(object)](#do) and [EDo(object)](#edo) methods. |

# Usage

<a name="do"></a>

## Method: Do()

A sample script is as follows. This sample script renames 2 files using [update of Drive API v3](https://developers.google.com/drive/v3/reference/files/update).

```javascript
var requests = {
  batchPath: "batch/drive/v3", // batch path. This will be introduced in the near future.
  requests: [
    // In this method, this the maximum number of requests should be 100.
    {
      method: "PATCH",
      endpoint:
        "https://www.googleapis.com/drive/v3/files/### file ID1 ###?fields=name",
      requestBody: { name: "sample1" },
      accessToken: ScriptApp.getOAuthToken(), // If this key is used, this access token is used.
    },
    {
      method: "PATCH",
      endpoint:
        "https://www.googleapis.com/drive/v3/files/### file ID2 ###?fields=name",
      requestBody: { name: "sample2" },
    },
  ],
  accessToken: "###", // If you want to use the specific access token, please use this.
};
var result = BatchRequest.Do(requests); // Using this library
Logger.log(result);
```

- [`batchPath`](https://developers.google.com/drive/v3/web/batch#details) will be introduced in the near future. But you have already been able to use this. `batchPath` can be retrieved by [Discovery](https://developers.google.com/discovery/v1/reference/apis).

  - This `batchPath` can be retrieved using [getBatchPath(name, version)](#getbatchpath).

- If `accessToken` is used in the object of requests (At above sample, it's `requests.requests[0].accessToken`.), the `accessToken` is used for the individual request in the batch request. If `accessToken` is not used in the requests, this library uses `ScriptApp.getOAuthToken()` for the whole batch request.

- If `accessToken` is used in the object (At above sample, it's `requests.accessToken`.), you can use the specific access token. For example, in this case, you can use the access token retrieved by the service account.

<a name="edo"></a>

## Method: EDo()

A sample script is as follows. This sample script renames 2 files using [update of Drive API v3](https://developers.google.com/drive/v3/reference/files/update).

```javascript
var requests = {
  //   useFetchAll: true, // When "useFetchAll" is true, the request is run with fetchAll method. The default is false.
  batchPath: "batch/drive/v3", // batch path. This will be introduced in the near future.
  requests: [
    // In this method, this the number of requests can be used more than 100.
    {
      method: "PATCH",
      endpoint:
        "https://www.googleapis.com/drive/v3/files/### file ID1 ###?fields=name",
      requestBody: { name: "sample1" },
      accessToken: ScriptApp.getOAuthToken(), // If this key is used, this access token is used.
    },
    {
      method: "PATCH",
      endpoint:
        "https://www.googleapis.com/drive/v3/files/### file ID2 ###?fields=name",
      requestBody: { name: "sample2" },
    },
  ],
  accessToken: "###", // If you want to use the specific access token, please use this.
  // exportDataAsBlob: true, // When this option is used, the returned value from the batch request can be retrieved as Blob.
};
var result = BatchRequest.EDo(requests); // Using this library
Logger.log(result);
```

- In this method, the result values from the batch requests are parsed, and you can retrieve the result values as an array object.

* [`batchPath`](https://developers.google.com/drive/v3/web/batch#details) will be introduced in the near future. But you have already been able to use this. `batchPath` can be retrieved by [Discovery](https://developers.google.com/discovery/v1/reference/apis).

  - This `batchPath` can be retrieved using [getBatchPath(name, version)](#getbatchpath).

* If `accessToken` is used in the object of requests (At above sample, it's `requests.requests[0].accessToken`.), the `accessToken` is used for the individual request in the batch request. If `accessToken` is not used in the requests, this library uses `ScriptApp.getOAuthToken()` for the whole batch request.

- If `accessToken` is used in the object (At above sample, it's `requests.accessToken`.), you can use the specific access token. For example, in this case, you can use the access token retrieved by the service account.

* `requests`
  - [`batchPath`](https://developers.google.com/drive/v3/web/batch#details): `batchPath` can be retrieved by [Discovery](https://developers.google.com/discovery/v1/reference/apis).
  - `method`: GET, POST, PUT, PATCH, DELETE and so on. Please set this for the API you want to use.
  - `endpoint`: Endpoint of the API you want to use.
  - `requestBody`: Request body of the API you want to use. This library for Google APIs. So in this case, the request body is sent as JSON.
  - `useFetchAll`: When "useFetchAll" is true, the request is run with fetchAll method. The default is false. For example, when 200 batch requests are used, when `useFetchAll: true` is used, 2 requests which have 100 batch requests are run with the asynchronous process using fetchAll method. [Ref](https://developers.google.com/apps-script/reference/url-fetch/url-fetch-app#fetchallrequests) When `useFetchAll: false` is used, 2 requests which have 100 batch requests are run with the synchronous process using fetch method. [Ref](https://developers.google.com/apps-script/reference/url-fetch/url-fetch-app#fetchurl,-params)
  - `exportDataAsBlob`: When this option is used, the returned value from the batch request can be retrieved as Blob. By this, for example, when you export Google Spreadsheet as PDF data using the batch requests, the PDF data can be retrieved as Blob.

<a name="getbatchpath"></a>

## Method: getBatchPath(name, version)

After August 12, 2020, in order to use batch requests, the batch path is required to be used to the endpoint of the batch requests. And, the batch path is sometimes updated. So, when a constant batch path has been continued to be used, this might lead to the reason for an error. In this method, the batch path is retrieved from Discovery API. By this, the latest batch path can be always simply obtained from the name of Google API. And, the retrieved batch path can be used in [Do(object)](#do) and [EDo(object)](#edo) methods.

The sample script is as follows.

```javascript
var res = BatchRequest.getBatchPath("drive");
Logger.log(res); // <--- batch/drive/v3
```

- There are 2 arguments in `getBatchPath(arg1, arg2)`. `arg1` and `arg2` are the name of Google API and the version of Google API you want to use.

  - For example, when you want to use Drive API v2, please set `BatchRequest.getBatchPath("drive", "v2")`. When you want to use the latest version of Drive API, please use `BatchRequest.getBatchPath("drive", "v3")` or `BatchRequest.getBatchPath("drive")`. When the 2nd argument is not used, the latest version is used.

- In this sample, `batch/drive/v3` is returned. For example, when `var res = BatchRequest.getBatchPath("calendar")` is used, `batch/calendar/v3`.

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

- Sample script using `exportDataAsBlob` is as follows. In this sample, the Spreadsheet and Document files are exported as PDF format using the batch requests. The exported PDF data is created as a PDF file to the root folder. When I answered [this thread on Stackoverflow](https://stackoverflow.com/q/75661391), when this option is added to this librar, I thought that it might be useful for users.

  ```javascript
  const fileIds = ["###SpreadsheetID1###", "###DocumentID1###", , , ,];
  const requests = fileIds.map((id) => ({
    method: "GET",
    endpoint: `https://www.googleapis.com/drive/v3/files/${id}/export?mimeType=application/pdf`,
  }));
  const reqs = {
    batchPath: "batch/drive/v3",
    requests,
    exportDataAsBlob: true,
  };
  const blobs = BatchRequestTest.EDo(reqs); // Using this library
  blobs.forEach((b) => {
    if (b) {
      console.log({ filename: b.getName(), fileSize: b.getBytes().length });
      DriveApp.createFile(b);
    }
  });
  ```

# Important

- On 2024, it seems that the specification of the batch request for exporting files has been changed. In the current stage, when ["Method: files.export" of Drive API v3](https://developers.google.com/drive/api/reference/rest/v3/files/export) is used in the batch request, `HTTP/1.1 302 Found` is returned instead of the file content. So, I reported it to the Google issue tracker. [https://issuetracker.google.com/issues/328105509](https://issuetracker.google.com/issues/328105509) If you want to use it, please add a star. By this, I believe that it will help resolve the specification.

	- I got a response from Google. You can see it at [this issue tracker](https://issuetracker.google.com/issues/328105509). By this, in the current stage, it seems that the files cannot be export with the batch request. So, in the current stage, it is required to export the files in a loop.

---

<a name="licence"></a>

# Licence

[MIT](LICENCE)

<a name="author"></a>

# Author

[Tanaike](https://tanaikech.github.io/about/)

If you have any questions and commissions for me, feel free to tell me.

<a name="updatehistory"></a>

# Update History

- v1.0.0 (May 2, 2018)

  1. Initial release.

- v1.1.0 (June 10, 2020)

  1. New method of [`EDo()`](#edo) was added. This method is the enhanced `Do()` method. When this method is used, the result values from the batch requests are parsed. And also, the number of requests more than 100 can be used. In this case, the split of the number of requests is processed for the limitation of 100.

- v1.1.1 (June 12, 2020)

  1. Error handling for the input object was added.

- v1.1.2 (June 12, 2020)

  1. Removed a bug that when the returned value is empty, an error occurred.

- v1.1.3 (January 13, 2021)

  1. In order to give the access token from outside, the access token got to be able to be included in the object. By this, for example, you can use the access token retrieved by the service account.

- v1.1.4 (March 13, 2021)

  1. By [a pull request](https://github.com/tanaikech/BatchRequest/pull/2), the inputted request is used as the call by value instead of the call by reference. It's like `this.p = p_.requests.slice();`.

- v1.2.0 (September 30, 2022)

  1. A new method of [getBatchPath(name, version)](#getbatchpath) was added. On August 12, 2020, in order to use batch requests, the batch path is required to be used to the endpoint of the batch requests. This method can simply retrieve the batch path from the name of Google API. And, the retrieved batch path can be used in [Do(object)](#do) and [EDo(object)](#edo) methods.

- v1.2.1 (March 8, 2023)

  1. An option of `exportDataAsBlob` was added to the request object to the method of `EDo()`. [Ref](https://github.com/tanaikech/BatchRequest#method-edo) When this option is used, the response values from the batch requests are returned as Blob. By this, for example, when you export Google Spreadsheet as PDF data using the batch requests, the PDF data can be retrieved as Blob.

- v1.2.2 (March 27, 2023)

  1. A bug was removed.

- v1.2.3 (March 27, 2023)

  1. A bug was removed.

[TOP](#top)
