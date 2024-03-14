import path from "path";
import process from "process";
import fs from "fs"
import { getArgValue } from "./utils/misc.mjs";

// node ./deployment-pipeline/version.mjs --suffix=voPks

const suffix = getArgValue("suffix", true);

if (suffix) {
  createVersionName(truncate(suffix, 7));
}
else {
  throw new Error(`Parameters are required. Please run "node version.mjs --suffix='value' --file=./version"`)
}

// Helpers ---------------------------------------------------------------------

function getVersion() {
  const fullPath = path.join(process.cwd(), "package.json");
  var text = fs.readFileSync(fullPath).toString('utf-8');
  const packageJson = JSON.parse(text);

  return packageJson.version;
}

function createVersionName(suffix) {
  const value = getVersion();
  const version = value.replaceAll(".", "").replaceAll("-", "");
  const formattedVersion = `${version}-${suffix}`;
  console.log(formattedVersion);

  return formattedVersion;
}

function truncate(value, max) {
  return value.substr(0, max);
}