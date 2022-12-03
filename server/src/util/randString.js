const randString = () => {
    const len = 8;
    let randString = '';
    for (let i = 0; i < len; i++) {
        const ch = Math.floor(Math.random() * 10 + 1);
        randString += ch;
    }
    return randString;
};

module.exports = randString;
