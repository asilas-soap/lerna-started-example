const conventionalRecommendedBump = require(`conventional-recommended-bump`);
const bumpVersion = require('./bumpVersion');
const generateChangelog = require('./changelog');
const path = require('path');
const git2 = require('./git');


async function runSteps(error, bumpRecommendation) {
  if (error) throw error;

  const baseDir = path.join(process.cwd(), "..");
  const fileChangelog = path.join(process.cwd(), "..", "CHANGELOG.md");
  const filePackageJson = path.join(process.cwd(), "..", "package.json");
  const branch = "main"; 

  const bump = bumpVersion(filePackageJson, bumpRecommendation.releaseType);

  await git2.pull();
  
  const newVersion = bump.getNextVersion();
  const changelogResult = await generateChangelog(fileChangelog, newVersion, "v");
  if (!changelogResult) {
    return;
  }

  bump.updateToNextVersion();

  git2.add("../");
  git2.commit(`chore(release): ${newVersion}`);
  git2.createTag(`v${newVersion}`);
  git2.push(branch);
}

conventionalRecommendedBump({ preset: `angular` }, runSteps);
