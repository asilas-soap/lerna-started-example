const fs = require('fs');
const semver = require('semver');
const objectPath = require('object-path');
const path = require('path');

class BumpVersion {
    file = '';
    releaseType = '';

    constructor(fileVersion, releaseType) {
        if (!fs.existsSync(fileVersion)) {
            throw new Error("File location not found.");
        }

        this.file = fileVersion;
        this.releaseType = releaseType;
    }

    getFileAsJSON() {
        const fileContent = fs.readFileSync(this.file, 'utf8');
        const jsonContent = JSON.parse(fileContent);

        return jsonContent;
    }

    getCurrentVersion() {
        const version = objectPath.get(this.getFileAsJSON(), "version", null);
        return version;
    }


    getNextVersion() {
        const current = this.getCurrentVersion();
        const newVersion = semver.inc(current, this.releaseType);

        return newVersion;
    }

    updateToNextVersion() {
        const next = this.getNextVersion();
        const jsonContent = this.getFileAsJSON();

        objectPath.set(jsonContent, "version", next);
        fs.writeFileSync(this.file, JSON.stringify(jsonContent, null, 2) + eol);

        console.log(`File ${this.file} bumped from ${oldVersion} to ${newVersion}`);
    }

}

module.exports = (fileVersion, releaseType) => new BumpVersion(fileVersion, releaseType);