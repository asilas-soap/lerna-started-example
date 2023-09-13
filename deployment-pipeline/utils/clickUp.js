import fetch from "node-fetch";
const AUTH_TOKEN = "pk_54921058_H3HH0BNL6AFC7BGQRHL6GSH0MEWZ55C3";

export function updateStatus(taskId, newStatus) {
  const url = `https://api.clickup.com/api/v2/task/${taskId}`;

  const request = fetch(url, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': AUTH_TOKEN
    },
    body: JSON.stringify({ "status": newStatus })
  }).then((res) => res.json());

  return request;
}


export async function verifyStatus(taskId, expectedStatus) {
  const url = `https://api.clickup.com/api/v2/task/${taskId}?team_id=4-63047063-1`;

  const request = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': AUTH_TOKEN
    }
  });

  const result = await request.json();
  return (result?.status?.status?.toLowerCase() === expectedStatus?.toLowerCase());
}

export async function checkAndUpdate(taskId, currentStatus, newStatus) {
  const isValid = await verifyStatus(taskId, currentStatus);
  if (isValid) {
    await updateStatus(taskId, newStatus);
  } else {
    console.error(`Fail: Task ${taskId} is not in the expected status ${currentStatus}`);
  }
}