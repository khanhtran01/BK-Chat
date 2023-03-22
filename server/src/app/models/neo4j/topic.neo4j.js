const Topic = (obj) => {
    return {
        _id: obj.properties._id,
        name: obj.properties.name,
    };
};

const getAll = async (session) => {
    return session
        .readTransaction((txc) => txc.run('MATCH (u:Topic) RETURN u'))
        .then((r) => {
            return r.records.map((e) => Topic(e.get('u')));
        });
};

module.exports = { getAll };
