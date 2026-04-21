import fs from 'fs';
import path from 'path';

function walkDir(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach((file) => {
        file = path.join(dir, file);
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) {
            results = results.concat(walkDir(file));
        } else {
            if (file.endsWith('.tsx') || file.endsWith('.ts')) {
                results.push(file);
            }
        }
    });
    return results;
}

const files = walkDir('./frontend');

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    let changed = false;

    // Pattern 1: "http://localhost:5000
    if (content.includes('"http://localhost:5000')) {
        content = content.replace(/"http:\/\/localhost:5000/g, '(process.env.API_URL || "http://localhost:5000") + "');
        changed = true;
    }

    // Pattern 2: `http://localhost:5000
    if (content.includes('`http://localhost:5000')) {
        content = content.replace(/`http:\/\/localhost:5000/g, '`${process.env.API_URL || "http://localhost:5000"}');
        changed = true;
    }

    if (changed) {
        fs.writeFileSync(file, content);
        console.log('Fixed:', file);
    }
});

console.log('Done mapping API URLs.');
