# This is the Browser version.

The version in dist and lib folders are to be run in two different environments: Browser (client) and Node.js (server) environment correspondently.

The version in the lib actually lives in the node.js repository and can be installed via npm install raidajs. It doesn't have libraries in it.  (like axios) Libraries are installed by npm using dependency tree.

the version for browser - is a complete bundle which includes axios and it doesn't have dependencies. It uses window.document browser object for global variables.


