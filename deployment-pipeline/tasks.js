const fs = require("fs");


function getTasksId(path) {
  const content = fs.readFileSync(path).toString();

  console.log("content:", content.replace("\n", " "));
  const ids = content.replace("\n", " ").split(" ").filter(item => item.startsWith("#")).map(item => item.replace("#", ""));
  console.log("List of ids collected in file", ids);
}

getTasksId("/root/.ssh/log.txt");