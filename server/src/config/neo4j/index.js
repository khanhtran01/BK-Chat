const neo4j = require('neo4j-driver');
const driver = neo4j.driver(
    process.env.NEO4J_URL,
    neo4j.auth.basic(process.env.NEO4J_USERNAME, process.env.NEO4J_PASSWORD),
);

function getSession(context) {
    if (context.neo4jSession) {
        return context.neo4jSession;
    } else {
        context.neo4jSession = driver.session();
        return context.neo4jSession;
    }
}

module.exports = getSession;
