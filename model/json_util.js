const fs = require('fs');

async function raedFromJson(filePath) {
    try {
        const data = JSON.parse(fs.readFileSync(filePath, "utf8"));
        for( let id of data){
            BlackList.push(id)
        }
        return data
    } catch (err) {
        throw(err)
    }
}

async function saveBlackListToJson(filePath, blackList) {
    fs.writeFile(filePath, blackList, 'utf8', function (err) {
        if (err) {
            return console.log(err);
        }
        console.log("The file was saved!");
    });

}

module.exports = raedFromJson, saveBlackListToJson