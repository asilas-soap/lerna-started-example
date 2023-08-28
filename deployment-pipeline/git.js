
const assert = require('assert');
const { exec } = require("child_process");

const GITHUB_REPOSITORY = "asilas-soap/lerna-started-example";
const githubToken = "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";
const gitUrl = "github.com";

module.exports = new (class Git {

  commandsRun = []

  init = async () => {
    await this.exec(`remote add -f -t main -m main origin git://${gitUrl}/${GITHUB_REPOSITORY}.git`);
    await this.exec(`merge origin`);
    // Set config
    await this.config('user.name', "Conventional commit log")
    await this.config('user.email', "asilas@soap.health")

    // Update the origin
    if (githubToken) {
      await this.updateOrigin(`https://x-access-token:${githubToken}@${gitUrl}/${GITHUB_REPOSITORY}.git`)
    }
  }

  /**
   * Executes the git command
   *
   * @param command
   * @return {Promise<>}
   */
  exec = (command) => new Promise(async (resolve, reject) => {
    let execOutput = '';
    const cmd = await exec(`git ${command}`);
 
    cmd.stdout.on('data', (data) => {
      execOutput += data.toString()
    });

    cmd.stderr.on('data', (data) => {
      execOutput += data.toString()
    });

    cmd.on('close', (code) => {
      if (code == 0){
        console.log("git output:", execOutput);
        resolve(execOutput);
      } 
      else {
        console.log("git error:", execOutput);
        reject(`Command "git ${command}" exited with code ${code}.`);
      }
    });

  })

  /**
   * Set a git config prop
   *
   * @param prop
   * @param value
   * @return {Promise<>}
   */
  config = (prop, value) => this.exec(`config ${prop} "${value}"`)

  /**
   * Add a file to commit
   *
   * @param file
   * @returns {*}
   */
  add = (file) => this.exec(`add ${file}`)

  /**
   * Commit all changes
   *
   * @param message
   *
   * @return {Promise<>}
   */
  commit = (message) => (
    this.exec(`commit -m "${message}"`)
  )

  /**
   * Pull the full history
   *
   * @return {Promise<>}
   */
  pull = async () => {
    const args = ['pull']

    // Check if the repo is unshallow
    if (await this.isShallow()) {
      args.push('--unshallow')
    }

    args.push('--tags')

    return this.exec(args.join(' '))
  }

  /**
   * Push all changes
   *
   * @return {Promise<>}
   */
  push = (branch) => (
    this.exec(`push origin ${branch} --follow-tags`)
  )

  /**
   * Check if the repo is shallow
   *
   * @return {Promise<>}
   */
  isShallow = async () => {
    const isShallow = await this.exec('rev-parse --is-shallow-repository')

    return isShallow.trim().replace('\n', '') === 'true'
  }

  /**
   * Updates the origin remote
   *
   * @param repo
   * @return {Promise<>}
   */
  updateOrigin = (repo) => this.exec(`remote set-url origin ${repo}`)

  /**
   * Creates git tag
   *
   * @param tag
   * @return {Promise<>}
   */
  createTag = (tag) => this.exec(`tag -a ${tag} -m "${tag}"`)

})()