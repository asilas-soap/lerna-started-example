import { readFileSync } from "fs";
import fetch from "node-fetch";

function getTasksId(path) {
  const content = readFileSync(path).toString();

  console.log("content:", content.replace("\n", " "));
  const ids = content.replace("\n", " ").split(" ").filter(item => item.startsWith("#")).map(item => item.replace("#", ""));
  console.log("List of ids collected in file", ids);

  const reqs = [];
  ids.forEach(element => {
    const url = `https://api.clickup.com/api/v2/task/${element}`;
    const req = fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'pk_54921058_H3HH0BNL6AFC7BGQRHL6GSH0MEWZ55C3'
      },
      body: JSON.stringify({ "status": "Dev Ready" })
    }).then((res) => res.json());

    reqs.push(req);
  });

  Promise.all(reqs).then(() => console.log('All requests finished'), (reason) => console.log('rejected: ', reason));
}

// getTasksId("./log.txt");
getTasksId("/root/.ssh/log.txt");