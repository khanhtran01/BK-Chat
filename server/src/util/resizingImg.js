module.exports = function resizingImg(imgLink, width = 400, height = 400) {
    if (imgLink && process.env.IMGPROXY_ENABLE) {
        const imgproxyURL = process.env.IMGPROXY_URL;
        return `${imgproxyURL}/${width}x${height}/${imgLink}`;
    }
    if (imgLink) return imgLink;
    return null;
};
