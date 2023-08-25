const simpleGit = require("simple-git");


class GitCommands {
    git = simpleGit.default();

    constructor(baseDir) {
        this.git = simpleGit.default(baseDir);
    }

    async add(files) {
        (await this.git.add(files));
    }

    async commit(message) {
        const result = (await this.git.commit(message)).summary;
        console.log(result);
    }

    async createTag(value) {
        const result = (await this.git.addTag(value)).name;
        console.log(result);
    }

    async pull() {
        const result = (await this.git.pull(["--tags", "--ff-only"])).summary;
        console.log(result);
    }

    async push() {
        const result = (await this.git.push()).summary;
        console.log(result);
        await this.git.pushTags();
    }
}

module.exports = (baseDir) => new GitCommands(baseDir); 