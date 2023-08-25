const conventionalRecommendedBump = require(`conventional-recommended-bump`);
const bumpVersion = require('./bumpVersion');
const generateChangelog = require('./changelog');
const path = require('path');
const gitCommands = require('./gitCommands');


async function runSteps(error, bumpRecommendation) {
  if (error) throw error;

  const git = gitCommands(path.join(process.cwd(), "../.."), "main");

  await git.pull();
  const newVersion = bumpVersion(bumpRecommendation.releaseType, path.join(process.cwd(), "../..", "package.json"));
  const changelogResult = await generateChangelog(path.join(process.cwd(), "../..", "CHANGELOG.md"));
  if (!changelogResult) {
    return;
  }

  await git.add(["CHANGELOG.md", "package.json"]);
  await git.commit(`chore(release): ${newVersion}`);

  await git.createTag(`v${newVersion}`);
  await git.push();
}

conventionalRecommendedBump({ preset: `angular` }, runSteps);