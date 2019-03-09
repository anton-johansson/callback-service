const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const config = require('../config')().database;
const log = require('../logging').logging(module);

const adapter = new FileSync(config.fileName);
const database = low(adapter);
database.defaults({users: {}}).write();

const setTarget = (username, target) => {
    log.info(`Setting target to '${target}' for ${username}`);
    const key = `users.${username}.target`;
    database.set(key, target).write();
};

const getTarget = (username) => {
    log.info(`Getting target for ${username}`);
    const key = `users.${username}.target`;
    return database.get(key).value();
}

const saveCallbackHistory = (username, callbackData) => {
    const key = `users.${username}.callbackHistory`;
    let history = database.get(key).value();
    if (!history || !Array.isArray(history)) {
        log.debug(`No callback history found (or history is not an array) for ${username}, setting a new history`);
        database.set(key, [callbackData]).write();
    } else {
        if (history.length >= config.callbackHistorySize) {
            log.debug(`Callback history for ${username} is larger than ${config.callbackHistorySize}, popping one`);
            history.pop();
        }
        log.debug(`Adding callback history for ${username}`);
        history.unshift(callbackData);
        database.set(key, history).write();
    }
}

module.exports = {setTarget, getTarget, saveCallbackHistory};
