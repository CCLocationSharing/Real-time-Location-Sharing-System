var cluster = require('cluster');
var _ = require('underscore');

if (!process.env.PORT) {
    throw new Error('process.env.PORT not set');
}

var CLUSTER_ENV_VARS = {};

if (cluster.isMaster) {
    fork();
} else {
    require('./app.js');
}

/**
 * fork one process per cpu
 */
function fork() {

    for (var i = 0; i < 4; i++) {
        var envClone = _.clone(process.env);
        envClone.PORT = parseInt(process.env.PORT)+i;
        
        var worker = cluster.fork(envClone);
        CLUSTER_ENV_VARS[worker.id] = envClone;
    }

    cluster.on('exit', function(worker, code, signal) {
        console.log('worker %s died, forking again', worker.process.pid);
        var new_worker = cluster.fork(CLUSTER_ENV_VARS[worker.id]);
        CLUSTER_ENV_VARS[new_worker.id] = CLUSTER_ENV_VARS[worker.id];
    });

}