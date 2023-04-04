const User = (obj) => {
    return {
        _id: obj.properties._id,
        email: obj.properties.username,
    };
};

const getAll = async (session) => {
    const r = await session.readTransaction((txc) => txc.run('MATCH (u:User) RETURN u'));
    return r.records.map((e) => User(e.get('u')));
};

const create = async (session, userId, username) => {
    const query = ['merge (u1:User {_id: $id, username: $username})'].join('\n');
    await session.writeTransaction((txc) =>
        txc.run(query, {
            id: userId,
            username: username,
        }),
    );
};

const createContact = async (session, user1, user2) => {
    const query = [
        'match (u1:User {_id: $user1})',
        'match (u2:User {_id: $user2})',
        'create (u1)-[:CONTACTED]->(u2), (u1)<-[:CONTACTED]-(u2)',
    ].join('\n');
    await session.writeTransaction((txc) =>
        txc.run(query, {
            user1,
            user2,
        }),
    );
};

module.exports = { getAll, create, createContact };
