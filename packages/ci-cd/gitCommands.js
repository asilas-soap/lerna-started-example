const simpleGit = require("simple-git");

const git = simpleGit.default();

function gitCommands() {
    return {
        async add() {
            const result = (await git.add("."));
            console.log(result);
        },

        async commit(message) {
            const result = (await git.commit(message)).summary;
            console.log(result);
        },

        async createTag(value) {
            const result = (await git.addTag(value)).name;
            console.log(result);
        },

        async pull() {
            const result = (await git.pull(["--tags", "--ff-only"])).summary;
            console.log(result);
        },

        async push() {
            const result = (await git.push()).summary;
            console.log(result);
            await git.pushTags();
        }
    }
}

module.exports = gitCommands();