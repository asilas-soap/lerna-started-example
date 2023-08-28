const simpleGit = require("simple-git");


class GitCommands {
    git = simpleGit.default();
    branchName = '';

    constructor(baseDir, branch) {
        this.git = simpleGit.default({ baseDir });
        this.branchName = branch;
        this.git.init();

        if (!baseDir || !branch)
            throw new Error("Git commands parameter required.");
    }

    async add(files) {
        (await this.git.add(files));
    }

    async commit(message) {
        const result = (await this.git.commit(message)).summary;
        console.log(result);
    }

    async config(key, value) {
        const result = (await this.git.addConfig(key, value));
        console.log(result);
    }

    async createTag(value) {
        const result = (await this.git.addTag(value)).name;
        console.log(result);
    }

    async pull() {
        const args= ["--tags", "--ff-only"];
        if (await this.isShallow()) {
            args.push("--unshallow");
        }
        const result = (await this.git.pull(args.join(" "))).summary;
        console.log(result);
    }

    async isShallow() {
        const result = await this.git.revparse(["--is-shallow-repository"]);
        console.log(result);
        return result.trim().replace('\n', '') === 'true';
    }

    async push() {
        const result = (await this.git.push("origin", this.branchName, ["--follow-tags"])).summary;
        console.log(result);
    }
}

module.exports = (baseDir, branch) => new GitCommands(baseDir, branch); 