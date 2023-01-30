// // This was a "test" using the npm config library. This requires further tests to replace the current approach (run npm config set ...)
// const {resolve} = require('node:path')
// const Config = require('@npmcli/config')
// async function main() {
//     const testConfig = new Config({
//         definitions: Config.typeDefs,
//         npmPath: resolve(__dirname, '..'),
//     })
//     await testConfig.load()
//     // testConfig.set('init-author-name', 'test')
//     testConfig.set('init-author-name', 'test', 'user')
//     try {
//         console.log(testConfig.validate('user'))
//         await testConfig.save('user')
//     } catch (e) {
//         console.error(e)
//     }
// }
// main()
