import { readFileSync } from "fs";
import { checkAndUpdate, updateStatus } from "./utils/clickUp.js";

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

function updateTasks(path, currentStatus, newStatus) {
  const content = readFileSync(path).toString();
  const ids = getTasksId(content);

  console.log(currentStatus, newStatus);
  console.log("Updating Click Up tasks. Tasks Ids:", ids, "New Status:", newStatus);

  const list = [];
  ids.forEach(element => {

    const req = checkAndUpdate(element, currentStatus, newStatus);
    list.push(req);
  });

  Promise.all(list)
    .then(
      (value) => console.log('All requests finished.'),
      (reason) => console.log('Request was rejected: ', reason));
}

const currentStatus = validateStatus(process.argv[2]);
const newStatus = validateStatus(process.argv[3]);
updateTasks("./log.txt", currentStatus, newStatus);