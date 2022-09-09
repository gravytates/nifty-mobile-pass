var fs = require("fs"),
  request = require("request");

var download = function (uri, filename, callback) {
  request.head(uri, function (err, res, body) {
    console.log("content-type:", res.headers["content-type"]);
    console.log("content-length:", res.headers["content-length"]);

    request(uri).pipe(fs.createWriteStream(filename)).on("close", callback);
  });
};

download(
  "https://media.niftygateway.com/video/upload/v1657969658/AMatthew/CryptoCubes2022July18/FinalAssets/Reuben-Wu_The-Sentinel_zcfbaw.png",
  "thumbnail.png",
  function () {
    console.log("done");
  }
);
