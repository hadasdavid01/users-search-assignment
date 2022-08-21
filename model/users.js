const fs = require("fs");

module.exports = {

    getUserById: async function(id){
        console.log(`getUserById called with id: ${id}`);
        try{
            if(BlackList.includes(id)){
                return "user was deleted"
            }
            return MainHashTable[id].data;
        }catch(e){
            throw ('id not found', e)
        }
    },

    getUsersByAge: async function(age) {
        let res =[]
        const AgeUsersList = AgeMapper[age]
        for(let userId of AgeUsersList){
            let user = MainHashTable[userId]
            if(!BlackList[user]){
                res.push(user.data)
            }
        }
        return res
    },

    getUsersByCountry: async function(country) {
        let res =[]
        const countryUsersList = CountryMapper[country]
        for(let userId of countryUsersList){
            let user = MainHashTable[userId]
            if(!BlackList[user]){
                res.push(user.data)
            }
        }
        return res

    },

    getUsersByName: async function(name){
        let res = [];
        name = name.toLowerCase()
        const subName = name.substring(0,3)
        let nameUsersList

        if(!FirstNameMapper[subName] && !SecondNameMapper[subName]){
            return
        }else if(SecondNameMapper[subName]){
            nameUsersList = SecondNameMapper[subName]
        }else{
            nameUsersList = FirstNameMapper[subName]
        }

        for(let firstName of nameUsersList) {
            if ((firstName.name.substring(0, name.length)) == name) {
                const user = MainHashTable[firstName.id]
                if (!BlackList[user]) {
                    res.push(user.data)
                }
            }
        }
        return res;
    },

    deleteUser: async function(id) {
        console.log(`deleteUser called with id: ${id}`);
        BlackList.push(id)
        const jsonList = JSON.stringify(BlackList);
        await fs.writeFile("blackList.json", jsonList, 'utf8', function (err) {
            if (err) {
                return console.log(err);
            }
            console.log("The file was saved!");
        });
        return "user was deleted ";
    }

}
