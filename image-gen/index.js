var fs = require("fs"),
  request = require("request");

var download = function (uri, filename, callback) {
  request.head(uri, function (err, res, body) {
    console.log("content-type:", res.headers["content-type"]);
    console.log("content-length:", res.headers["content-length"]);

    request(uri).pipe(fs.createWriteStream(filename)).on("close", callback);
  });
};

var startsWith = require("lodash/startsWith");

// CONSTANTS
const CLOUDINARY_URL = "https://res.cloudinary.com/";
const CLOUDINARY_PATH = "nifty-gateway/";
const MEDIACDN_URL = "https://media.niftygateway.com/";
const UPLOAD_STR = "/upload/";

// Methods
const cloudinaryUrl = (assetUrl = "", spec) => {
  let url = assetUrl.trim();

  // switch URLs from cloudinary to media.niftygateway.com
  if (startsWith(url, CLOUDINARY_URL)) {
    url = url.replace(CLOUDINARY_URL + CLOUDINARY_PATH, MEDIACDN_URL);
  }

  // don't optimize non-cloudinary urls...
  if (!startsWith(url, MEDIACDN_URL)) {
    return url;
  }

  if (!spec) {
    return url;
  }

  // add Cloudinary transformation directive
  const slashUploadIndex = url.indexOf(UPLOAD_STR) + UPLOAD_STR.length;
  return `${url.slice(0, slashUploadIndex)}${spec}/${url.slice(
    slashUploadIndex
  )}`;
};

const URL =
  "https://media.niftygateway.com/video/upload/v1657969658/AMatthew/CryptoCubes2022July18/FinalAssets/Reuben-Wu_The-Sentinel_zcfbaw.png";

const run = () => {
  const url = process.argv.slice(2)[0] || URL;

  const thumbnail2x = cloudinaryUrl(
    url,
    "c_fill,w_180,h_180,q_auto:good,f_png"
  );
  const thumbnail = cloudinaryUrl(url, "c_fill,w_90,h_90,q_auto:good,f_png");
  const background = cloudinaryUrl(
    url,
    "c_fill,w_180,h_220,e_blur:1000,q_auto:good,f_png"
  );

  download(thumbnail2x, "output/thumbnail@2x.png", () => {
    console.log("thumbnail@2x.png downloaded");
  });
  download(thumbnail, "output/thumbnail.png", () => {
    console.log("thumbnail.png downloaded");
  });
  download(background, "output/background.png", () => {
    console.log("background.png downloaded");
  });
};

run();
