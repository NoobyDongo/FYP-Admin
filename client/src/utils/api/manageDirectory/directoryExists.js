import fs from 'fs';

export default function directoryExists(path) {
    return fs.existsSync(path);
}
