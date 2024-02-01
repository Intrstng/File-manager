export const parseInputArguments = (inputArgs) => {
    const trimedInputArgs = inputArgs.replace(/\s+/g, ' ');
    const REGEX = /[^\s"']+|"([^"]*)"|'([^']*)'/g;
    const matches = trimedInputArgs.match(REGEX);
    return matches.map(match => match.replace(/['"]/g, ''));
}