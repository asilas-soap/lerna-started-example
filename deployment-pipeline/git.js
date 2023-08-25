
const assert = require('assert');
const { exec } = require("child_process");
const { stderr } = require('process');

const { GITHUB_REPOSITORY, ENV } = process.env

module.exports = new (class Git {

  commandsRun = []

  init = async () => {
    // // Set config
    // await this.config('user.name', gitUserName)
    // await this.config('user.email', gitUserEmail)

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
    await exec(`git ${command}`, (error, stdout, stderr) => {

      if (stderr) {
        console.log(`Command git ${command} got this error: ${stderr}`);
        reject()
      }
      console.log("git output:", stdout);
      resolve(stdout);
      
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
    if (ENV === 'dont-use-git') {
      return false
    }

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