const crypto = require('crypto');

export default function generateHashedString(extra = "") {
    const timestamp = Date.now().toString() + extra;
    const hash = crypto.createHash('sha256').update(timestamp).digest('hex');
    return hash;
}
