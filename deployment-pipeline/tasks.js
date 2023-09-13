import { readFileSync, existsSync } from "fs";
import { checkAndUpdate } from "./utils/clickUp.js";

function getTasksId(text) {
  return text.replace("\n", " ").split(" ")
    .filter(item => item.startsWith("#"))
    .map(item => item.replace("#", ""));
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

updateTasks("/root/.ssh/log.txt", currentStatus, newStatus);