import { readFileSync, existsSync } from "fs";
import { checkAndUpdate } from "./utils/clickUp.js";

function getTasksId(text) {
  // const fromMsg = text.replace("\n", " ").split(" ")
  //   .filter(item => item.startsWith("#"))
  //   .map(item => item.replace("#", ""));

  // console.log(`fromMsg ${fromMsg}`);

  const fromBranchName = text.replace("\n", " ")
    .split(" ")
    .filter(item => item.startsWith("asilas-soap/"))
    .flatMap(item => item.split("_"))
    .filter(item => item.startsWith("#"))
    .map(item => item.replace("#", ""));


  // console.log(`fromBranchName ${fromBranchName}`);
  // return fromBranchName.concat(fromMsg).filter((item, i, ar) => ar.indexOf(item) === i);

  return fromBranchName;
}

function validateStatus(status) {
  if (!status) throw new Error("Status is required");
  if (['dev done', 'dev ready', 'queued to dev'].includes(status.toLowerCase())) {
    return status;
  }

  throw new Error(`Status ${status} is not valid.`);
}

// Main function ------------------------------------------------------------------------------------------------------

/**
 * Reads a file with a commit message, collects all Click Up tasks mentioned
 * and updated their status using Click Up API.
 * 
 * @param {*} path File that contains the commit message.
 * @param {*} currentStatus Expected current status of the Click Up Tasks.
 * @param {*} newStatus New status to be updated for the Click Up Tasks.
 * @returns 
 */
function updateTasks(path, currentStatus, newStatus) {
  if (!existsSync(path)) {
    throw Error(`File with the commit message not found: ${path}`);
  }

  const content = readFileSync(path).toString();
  const ids = getTasksId(content);

  if (!ids || ids.length == 0) {
    console.log("SKIP: None Click Up tasks ids found to update.")
    return;
  }
  console.log(currentStatus, newStatus);
  console.log("Updating Click Up tasks. Tasks Ids:", ids, "New Status:", newStatus);

  const list = [];
  ids.forEach(element => {
    const req = checkAndUpdate(element, currentStatus, newStatus);
    list.push(req);
  });

  Promise.all(list)
    .then(
      () => console.log('All requests were finished.'),
      (reason) => console.log('Request was rejected: ', reason));
}

const currentStatus = validateStatus(process.argv[2]);
const newStatus = validateStatus(process.argv[3]);

// updateTasks("/root/.ssh/log.txt", currentStatus, newStatus);
updateTasks("./log.txt", currentStatus, newStatus);