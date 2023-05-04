function log(text) {
    console.log(`[${new Date().toISOString()}] ` + text);
}

function error(text) {
    console.error(`[${new Date().toISOString()}] ` + text);
}


module.exports = {log, error};