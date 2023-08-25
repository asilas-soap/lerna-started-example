const conventionalRecommendedBump = require(`conventional-recommended-bump`);
const bumpVersion = require('./bumpVersion');
const generateChangelog = require('./changelog');
const path = require('path');
const gitCommands = require('./gitCommands');


async function runSteps(error, bumpRecommendation) {
  if (error) throw error;

  const baseDir = path.join(process.cwd(), "../..");
  const fileChangelog = path.join(process.cwd(), "../..", "CHANGELOG.md");
  const filePackageJson = path.join(process.cwd(), "../..", "package.json");
  const branch = "main"; 

  const git = gitCommands(baseDir, branch);
  const bump = bumpVersion(filePackageJson, bumpRecommendation.releaseType);

  await git.pull();
  
  const newVersion = bump.getNextVersion();
  const changelogResult = await generateChangelog(fileChangelog, newVersion, "v");
  if (!changelogResult) {
    return;
  }

  bump.updateToNextVersion();

  await git.add(["CHANGELOG.md", "package.json"]);
  await git.commit(`chore(release): ${newVersion}`);

  await git.createTag(`v${newVersion}`);
  await git.push();
}

conventionalRecommendedBump({ preset: `angular` }, runSteps);
