const checkEmail = (email) => {
    // don't remember from where i copied this code, but this works.
    let re =
        /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    if (re.test(email)) return true;
    return false;
};

const sleep = (milliseconds) => {
    return new Promise(resolve => setTimeout(resolve, milliseconds))
}

const deepCopy = (obj) => {
    return JSON.parse(JSON.stringify(obj));
};

export { checkEmail, deepCopy, sleep };
