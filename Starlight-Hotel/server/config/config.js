(() => {
    const config = {}
    config.PORT = process.env.PORT || 3030
    config.ROOT = 'views'
    config.LOG_FILE = 'server/log/node.js.log'
    module.exports = config
})()
