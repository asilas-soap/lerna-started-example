const conventionalRecommendedBump = require(`conventional-recommended-bump`);
const bumpVersion = require('./bumpVersion');
const generateChangelog = require('./changelog');
const path = require('path');
const git2 = require('./git');


async function runSteps(error, bumpRecommendation) {
  if (error) throw error;

  const fileChangelog = path.join(process.cwd(), "..", "CHANGELOG.md");
  const filePackageJson = path.join(process.cwd(), "..", "package.json");

  const branch = "main";

  const bump = bumpVersion(filePackageJson, bumpRecommendation.releaseType);

  await git2.pull();

  const newVersion = bump.getNextVersion();
  const result = await generateChangelog(fileChangelog, newVersion, "v");
  if (!result) return;

  bump.updateToNextVersion();

  await git2.add("..");
  await git2.commit(`chore(release): ${newVersion}`);
  await git2.createTag(`v${newVersion}`);
  await git2.push(branch);
}

conventionalRecommendedBump({ preset: `angular` }, runSteps);
