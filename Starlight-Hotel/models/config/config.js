(() => {
    const config = {};
    config.SERVER = 'cluster0.ynwnf.mongodb.net';
    config.USERNAME = 'tanishsalaria160';
    config.PASSWORD = 'NYxhWViSPTuULwsn'; // Fixed spelling
    config.DATABASE = 'Foruma';

    // Full MongoDB Atlas connection string
    config.CONNECTION_STRING = `mongodb+srv://${config.USERNAME}:${config.PASSWORD}@${config.SERVER}/${config.DATABASE}?retryWrites=true&w=majority&appName=Cluster0`;

    module.exports = config;
})();
