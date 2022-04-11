const glob  = require('glob');

module.exports = {
    entryPoints: [
        ...(glob.sync('./src/lib/client/**/*.ts')),
        ...(glob.sync('./src/lib/interfaces/**/*.ts')),
    ],
    out: './docs'
}