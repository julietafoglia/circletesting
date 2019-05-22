'use strict';

const XLSX = require('xlsx');
const exec = require('child_process').exec;
const fs = require('fs');

const OUTPUT_FILE = 'tmp.xlsx';

function editWorkSheet(worksheet, rows, id, name) {
    const START_ROW = 3;
    for (let i = 0; i < rows; i++) {
        let publisherNameEntry = `{ "t": "s", 
                                    "v": "${name}", 
                                    "r": "<t>${name}</t>", 
                                    "h": "${name}", 
                                    "w": "${name}" }`;
        let publisherIdEntry = `{ "t": "n", "v": ${id}, "w": "${id}" }`;
        worksheet['B' + (START_ROW + i)] = JSON.parse(publisherNameEntry);
        worksheet['A' + (START_ROW + i)] = JSON.parse(publisherIdEntry);
    }
}

/**
 * Fill inventory upload Template
 * @param {String} path
 * @param {Number} rows template row count
 * @param {Number} id publisher id
 * @param {String} name publisher name
 * @return {String} file path of filled template
 */
function fillTemplate(path, rows, id, name) {
    let workbook = XLSX.readFile(path);
    editWorkSheet(workbook.Sheets['Template'], rows, id, name);
    let outputPath = `${process.cwd()}/${OUTPUT_FILE}`;
    XLSX.writeFile(workbook, outputPath);
    return outputPath;
}

function cleanUp(path) {
    exec(`rm ${path}`, (error) => {
        if (error) {
            process.stdout.write(`Cannot remove ${path}  ${error}`);
            return;
        }
    });
}

function toBase64(path) {
    return new Promise((resolve, reject) => {
        fs.readFile(path, (err, data) => {
            if (err) {
                reject(err);
            }
            resolve(data.toString('base64'));
        });
    });
}

module.exports = {
    fillTemplate,
    cleanUp,
    toBase64
};
