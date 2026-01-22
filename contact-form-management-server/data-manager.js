const fs = require('fs');
const { promisify } = require('util');

// Promisify the fs.readFile function
const readFileAsync = promisify(fs.readFile);

// Reading from a text file
async function readDataFromFile(fileName) {
    try {
        const dataString = await readFileAsync(fileName, 'utf8');
        const data = dataString ? JSON.parse(dataString) : [];
        return data;
    } catch (err) {
        console.error('Error reading file:', err);
        throw new Error('Error reading file', err);
    }
}

// Writing to a text file
function writeDataToFile(fileName, data) {
    const contentToWrite = JSON.stringify(data);
    fs.writeFile(fileName, contentToWrite, (err) => {
        if (err) {
            console.error('Error writing to file:', err);
        } else {
            console.log('File written successfully.', fileName);
        }
    });
}

async function getNextUserId(){
    const lastIdObject = await readDataFromFile('data/last-id.json');
    const lastUserId = lastIdObject.user;
    const nextUserId = lastUserId + 1;
    lastIdObject.user = nextUserId;
    writeDataToFile('data/last-id.json', lastIdObject);
    return nextUserId;
}

async function getNextMessageId(){
    const lastIdObject = await readDataFromFile('data/last-id.json');
    const lastMessageId = lastIdObject.message;
    const nextMessageId = lastMessageId + 1;
    lastIdObject.message = nextMessageId;
    writeDataToFile('data/last-id.json', lastIdObject);
    return lastMessageId;
}

module.exports = {
    readDataFromFile,
    writeDataToFile,
    getNextUserId,
    getNextMessageId
};
