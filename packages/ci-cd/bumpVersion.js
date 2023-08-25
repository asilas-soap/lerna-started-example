const fs = require('fs');
const semver = require('semver');
const objectPath = require('object-path');


/**
 * 
 * @param {*} releaseType Release type (major, minor, patch)
 * @param {*} fileLocation Path to package.json file
 * @returns new version number
 */
function bumpVersion(releaseType, fileLocation) {
    if (!fs.existsSync(fileLocation)) {
        throw new Error("File location not found.");
    }

    const fileContent = fs.readFileSync(fileLocation, 'utf8');
    const eol = fileContent.endsWith('\n') ? '\n' : '';
    const jsonContent = JSON.parse(fileContent);

    const oldVersion = objectPath.get(jsonContent, "version", null);
    const newVersion = semver.inc(oldVersion, releaseType);

    objectPath.set(jsonContent, "version", newVersion);
    fs.writeFileSync(fileLocation, JSON.stringify(jsonContent, null, 2) + eol);

    console.log(`Version bump from ${oldVersion} to ${newVersion}`);
    
    return newVersion;
}

module.exports = bumpVersion;