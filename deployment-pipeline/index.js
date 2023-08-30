const conventionalRecommendedBump = require(`conventional-recommended-bump`);
const bumpVersion = require('./bumpVersion');
const generateChangelog = require('./changelog');
const path = require('path');
const git2 = require('./git');

const git3 = require('./gitCommands');
const git = git3(".", "main");


async function runSteps(error, bumpRecommendation) {
  if (error) throw error;


  const fileChangelog = path.join(process.cwd(), "CHANGELOG.md");
  const filePackageJson = path.join(process.cwd(), "package.json");

  const branch = "main";

  // await git.config("user.name", "Alberto Silas");
  // await git.config("user.email", "asilas@soap.health");
  
  const bump = bumpVersion(filePackageJson, bumpRecommendation.releaseType);

  // await git2.init();
  // await git2.checkout(branch);
  // await git2.pull();

  const newVersion = bump.getNextVersion();
  const result = await generateChangelog(fileChangelog, newVersion, "v");
  if (!result) return;

  bump.updateToNextVersion();

  // await git.add(".");
  // await git.commit(`chore: ${newVersion}`);
  // await git.createTag(newVersion);

  // await git.push();
  // await git2.add(".");
  // await git2.commit(`chore(release): ${newVersion}`);
  // await git2.createTag(`v${newVersion}`);
  // await git2.push(branch);

  
}

conventionalRecommendedBump({ preset: `angular` }, runSteps);