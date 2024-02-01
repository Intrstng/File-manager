export const getUserNameFromArgs = () => {
    // console.log(process.argv)
let name = '';
    const usernameArg = process.argv.find(arg => arg.includes('--username='));

// // npm run start -- --username= your_username (если имя введено через пробел после =)
//     if (usernameArg.length === '--username='.length) {
//         return process.argv[process.argv.indexOf('--username=') + 1];
//     }
    return usernameArg ? usernameArg.split('=')[1] : 'User';
}