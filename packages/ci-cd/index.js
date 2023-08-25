const conventionalRecommendedBump = require(`conventional-recommended-bump`);
const bumpVersion = require('./bumpVersion');
const generateChangelog = require('./changelog');
const path = require('path');
const gitCommands = require('./gitCommands');


async function runSteps(error, bumpRecommendation) {
  if (error) throw error;

  const git = gitCommands(path.join(process.cwd(), "../.."));

  await git.pull();
  const newVersion = bumpVersion(bumpRecommendation.releaseType, path.join(process.cwd(), "../..", "package.json"));
  await generateChangelog(path.join(process.cwd(), "../..", "CHANGELOG.md"));

  await git.add();
  await git.commit("chore(release): tag");

  await git.createTag(`v${newVersion}`);
  await git.push();
}

conventionalRecommendedBump({ preset: `angular` }, runSteps);
