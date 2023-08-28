const conventionalChangelog = require('conventional-changelog');
const fs = require('fs')
const { Readable } = require('stream');

function getChangelogStream(version, tagPrefix) {
    return conventionalChangelog({ preset: 'angular' }, { version, currentTag: `${tagPrefix}${version}` }, { path: "." });
}

async function generateChangelogString(version, tagPrefix) {
    return new Promise((resolve) => {
        const stream = getChangelogStream(version, tagPrefix);
        let changelog = '';

        stream
            .on('data', (data) => {
                changelog += data.toString()
            })
            .on('end', () => resolve(changelog));
    });
}

async function generateChangelog(changelogOutput, version, tagPrefix) {
    return new Promise(async (resolve) => {
        const log = await generateChangelogString(version, tagPrefix);
        console.log("log", log);
        // Removes the version number from the changelog
        const cleanLog = log.split('\n').slice(3).join('\n').trim();
        if (cleanLog === '') {
            console.log("Changelog is empty. Operation will be skipped.");
            resolve(false);
        }

        const stream = getChangelogStream();
        // The default changelog output to be streamed first
        const readStreams = [stream];

        // if a changelog output file already exists
        // preserve its content
        if (fs.existsSync(changelogOutput)) {
            const buffer = fs.readFileSync(changelogOutput);
            const readableStream = Readable.from(buffer);
            // add the stream as the next item for later pipe
            readStreams.push(readableStream);
        }

        const writeStream = fs.createWriteStream(changelogOutput)
        let currentIndex = 0;

        function pipeNextStream() {
            if (currentIndex < readStreams.length) {
                const currentStream = readStreams[currentIndex];

                currentStream.pipe(writeStream, { end: false });

                currentStream.once('end', () => {
                    currentIndex++;
                    pipeNextStream();
                });
            } else {
                // All stream pipes have completed
                writeStream.end();
                resolve(true);
            }
        }

        pipeNextStream();
    });
}

module.exports = generateChangelog;