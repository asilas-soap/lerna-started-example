
import { Octokit } from '@octokit/rest';
import glob from 'globby';
import path from "path";
import { readFile } from "fs-extra";

const AUTH_TOKEN = process.env.TOKEN;

const ORGANIZATION = process.env.ORGANIZATION
const REPO = process.env.REPO
const BRANCH = process.env.BRANCH || 'main'

class GitOctokit {
  okt = new Octokit({
    auth: AUTH_TOKEN
  });

  envs = {
    org: "",
    repo: "",
    branch: "",
    baseDir: "./"
  };

  constructor() {
    this.envs = {
      org: ORGANIZATION,
      repo: REPO,
      branch: BRANCH
    };
  }

  async commit(message) {
    const currentCommit = this.getCurrentCommit();
    const filesPaths = await glob(this.envs.baseDir);
    const filesBlobs = await Promise.all(filesPaths.map(this.createBlobForFile()));
    const pathsForBlobs = filesPaths.map(fullPath => path.relative(coursePath, fullPath));

    const newTree = await this.createNewTree(
      filesBlobs,
      pathsForBlobs,
      currentCommit.treeSha
    );

    await this.okt.rest.git.createCommit({
      message
    });

    const newCommit = await this.createNewCommit(
      message,
      newTree.sha,
      currentCommit.commitSha
    );

    await this.okt.git.updateRef({
      owner: this.envs.org,
      repo: this.envs.repo,
      ref: `heads/${this.envs.branch}`,
      sha: newCommit,
    });
  }

  getFileAsUTF8 = (filePath) => readFile(filePath, 'utf8');

  async createBlobForFile() {
    const content = await getFileAsUTF8(filePath)
    const blobData = await this.okt.git.createBlob({
      owner: this.envs.org,
      repo: this.envs.repo,
      content,
      encoding: 'utf-8',
    })
    return blobData.data;
  }

  async getCurrentCommit() {
    const { data: refData } = await this.okt.git.getRef({
      owner: this.envs.org,
      repo: this.env.repo,
      ref: `heads/${this.envs.branch}`,
    });

    const commitSha = refData.object.sha;
    const { data: commitData } = await this.okt.git.getCommit({
      owner: this.envs.org,
      repo: this.env.repo,
      commit_sha: commitSha,
    });

    return {
      commitSha,
      treeSha: commitData.tree.sha,
    };
  }

  async createNewTree(
    blobs,
    paths,
    parentTreeSha
  ) {
    // My custom config. Could be taken as parameters
    const tree = blobs.map(({ sha }, index) => ({
      path: paths[index],
      mode: `100644`,
      type: `blob`,
      sha,
    }));

    const { data } = await this.okt.git.createTree({
      owner: this.envs.org,
      repo: this.envs.repo,
      tree,
      base_tree: parentTreeSha,
    })
    return data
  }
}

export default new GitOctokit(); 