module.exports = function resizeCloudinaryUrl(imgLink, width = 400, height = 400) {
    const urlParts = imgLink.split('/');
    const uploadIndex = urlParts.findIndex((part) => part === 'upload');
    urlParts.splice(uploadIndex + 1, 0, `c_fill,h_${height},w_${width}`);
    return urlParts.join('/');
};
