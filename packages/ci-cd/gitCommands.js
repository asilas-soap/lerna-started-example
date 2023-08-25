const simpleGit = require("simple-git");

const git = simpleGit.default();

function gitCommands() {
    return {
        async add() {
            return (await git.add("."));
        },

        async commit(message) {
            return (await git.commit(message)).summary;
        },

        async createTag(value) {
            return (await git.addTag(value)).name;
        },

        async pull() {
            return (await git.pull()).summary;
        },

        async push() {
            return (await git.push()).summary;
        }
    }
}

module.exports = gitCommands();