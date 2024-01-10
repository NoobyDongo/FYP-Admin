const hashString = require("./_hashString")

function generateUniqueHashedString(extra = "") {
    return hashString(Date.now().toString() + extra);
}
module.exports = generateUniqueHashedString;