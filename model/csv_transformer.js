const csv  = require('csv-parser');
const fs = require('fs');

global.MainHashTable ={};  // need to think on something else not best practice
global.CountryMapper = {};
global.AgeMapper = {};
global.BlackList =[];
global.FirstNameMapper={};
global.SecondNameMapper={};

async function getData(file) {
    try {
        await getDataFromCsv(file);
    } catch (error) {
        console.error("An error occurred: ", error.message);
    }
}

function getDataFromCsv(file) {
    return new Promise((resolve, reject) => {
        fs.createReadStream(file)
            .on('error', error => {
                reject(error);
            })
            .pipe(csv())
            .on('data', (rowData) => {
                let userId = rowData.Id
                let userObject = buildUserObject(rowData)
                MainHashTable[userId] = userObject
                updateCountryMapper(rowData.Id, rowData.Country)
                updateAgeMapper(rowData.Id, rowData.DOB)
                updateFirstNameMapper(rowData.Id, rowData.Name)
                updateSecondNameMapper(rowData.Id, rowData.Name)
            })
            .on('end', () => {
                resolve(MainHashTable);
            });
    });
}

function buildUserObject(rowData ){
    return {
        data:{
            id: rowData.Id,
            name: rowData.Name,
            dob:rowData.DOB,
            country:rowData.Country
        }
    };
}

function updateCountryMapper(id, country){
    if(country in CountryMapper){
        CountryMapper[country].push(id)
    }else{
        CountryMapper[country] = []
        CountryMapper[country].push(id)
    }
}

function updateAgeMapper(id, age){
    const userAge = getAge(age)
    if( userAge in AgeMapper){
        AgeMapper[userAge].push(id)
    }else{
        AgeMapper[userAge] = []
        AgeMapper[userAge].push(id)
    }
}

function getAge(dob){
    const currentYear = new Date().getFullYear()
    const age= dob.split('/')
    return Number(currentYear)-Number(age[2])
}

function updateFirstNameMapper(id, name){
    const object = {
        "name" : name.toLowerCase(),
        "id": id

    }
    let prefixIndex  = name.substring(0,3).toLowerCase()
    if( prefixIndex in FirstNameMapper){
        FirstNameMapper[prefixIndex].push(object)
    }else{
        FirstNameMapper[prefixIndex] = []
        FirstNameMapper[prefixIndex].push(object)
    }
}

 function updateSecondNameMapper(id, secondName){
     secondName = (secondName.split(' ').slice(0))[1].toLowerCase()
     const object = {
         "name" : secondName.toLowerCase(),
         "id": id
     }
     if( secondName.substring(0,3) in SecondNameMapper){
         SecondNameMapper[secondName.substring(0,3)].push(object)
     }else{
         SecondNameMapper[secondName.substring(0,3)] = []
         SecondNameMapper[secondName.substring(0,3)].push(object)
     }
}
    module.exports = getData

