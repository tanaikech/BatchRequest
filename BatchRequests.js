/**
 * GitHub  https://github.com/tanaikech/BatchRequest<br>
 * Run BatchRequest<br>
 * @param {Object} Object Object
 * @return {Object} Return Object
 */
function Do(object) {
    return new BatchRequest(object).Do();
}
;
(function(r) {
  var BatchRequest;
  BatchRequest = (function() {
    BatchRequest.name = "BatchRequest";

    function BatchRequest(p_) {
      var bP, batchPath;
      this.p = p_.requests;
      this.url = "https://www.googleapis.com/batch";
      if (p_.batchPath) {
        bP = p_.batchPath.trim();
        batchPath = "";
        if (~bP.indexOf("batch/")) {
          batchPath = bP.replace("batch", "");
        } else {
          batchPath = bP.slice(0, 1) === "/" ? bP : "/" + bP;
        }
        this.url += batchPath;
      }
      this.at = ScriptApp.getOAuthToken();
      this.lb = "\r\n";
      this.boundary = "xxxxxxxxxx";
    }

    BatchRequest.prototype.Do = function() {
      var contentId, data, e, params, res;
      try {
        contentId = 0;
        data = "--" + this.boundary + this.lb;
        this.p.forEach((function(_this) {
          return function(e) {
            data += "Content-Type: application/http" + _this.lb;
            data += "Content-ID: " + ++contentId + _this.lb + _this.lb;
            data += e.method + " " + e.endpoint + _this.lb;
            data += e.accessToken ? "Authorization: Bearer " + e.accessToken + _this.lb : "";
            data += e.requestBody ? "Content-Type: application/json; charset=utf-8" + _this.lb + _this.lb : _this.lb;
            data += e.requestBody ? JSON.stringify(e.requestBody) + _this.lb : "";
            return data += "--" + _this.boundary + _this.lb;
          };
        })(this));
        params = {
          muteHttpExceptions: true,
          method: "post",
          contentType: "multipart/mixed; boundary=" + this.boundary,
          payload: Utilities.newBlob(data).getBytes(),
          headers: {
            Authorization: 'Bearer ' + this.at
          }
        };
        res = UrlFetchApp.fetch(this.url, params);
      } catch (error) {
        e = error;
        throw new Error(e);
      }
      return res;
    };

    return BatchRequest;

  })();
  return r.BatchRequest = BatchRequest;
})(this);
