
/**
 * Retrieves the value of a command line argument.
 * 
 * @param {string} argName the name of the argument to get the value of.
 * @returns {string|boolean|undefined} the value of the argument or undefined if the argument is not found.
 */
export function getArgValue(argName, required) {
  const param = process.argv.find(x => x && x.startsWith(`--${argName}`));
  if (!param) {
    if (required) throw new Error(`Parameter '--${argName}' is required.`);
    return null;
  }

  const argIndex = param.indexOf(`--${argName}`);

  if (argIndex < 0) {
    return undefined;
  }

  const argValue = param.split("=")
  if (!argValue || argValue[1])
    return argValue[1];

  return null;
}