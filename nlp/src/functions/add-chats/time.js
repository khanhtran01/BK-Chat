const randomTime = (number, maxHours) => {
    var arr = [];
    while (arr.length < number) {
        var r = Math.floor(Math.random() * maxHours * 60) + 1;
        if (arr.indexOf(r) === -1) {
            arr.push(r)
        }
    }
    return arr.sort(function (a, b) { return a - b });
}

const generatorTime = (index) => {
    const now = new Date();
    var hours = process.env.HOURS;
    const time = new Date(Date.UTC(
        now.getFullYear(),
        now.getMonth(),
        now.getDate(),
        hours - 7,
        index
    ));
    return time;
}

module.exports = { generatorTime, randomTime };