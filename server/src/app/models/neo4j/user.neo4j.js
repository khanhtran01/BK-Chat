const User = (obj) => {
    return {
        _id: obj.properties._id,
        email: obj.properties.username,
    };
};

const getAll = (session) => {
    return session
        .readTransaction((txc) => txc.run('MATCH (u:User) RETURN u'))
        .then((r) => {
            return r.records.map((e) => User(e.get('u')));
        });
};

module.exports = { getAll };
