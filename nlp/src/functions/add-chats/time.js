const generatorTime = (index) => {
    const now = new Date();
    var hours = process.env.HOURS || 9;
    const time = new Date(
        now.getFullYear(),
        now.getMonth() - 1,
        now.getDate(),
        hours,
        index
    );
    return time;
}

module.exports = generatorTime;