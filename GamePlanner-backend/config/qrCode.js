const QR = require('qrcode');

exports.test = async (str) => {
    try {
        return await QR.toString(str, {type: 'terminal'});
    }
    catch(err) {
        return {error: err.message};
    }
}

exports.url = async (str) => {
    try {
        return await QR.toDataURL(str);
    }
    catch(err) {
        return {error: err.message};
    }
}