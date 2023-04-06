let data = [
    {
        id: 1, name: 'Delta', type: 'Cat',breed: 'Thai cat', gender: 'Male', ageYear: 0, ageMonth: 8,
        title: '', description: '', topic: '', status: 'ALREADY', 
        imgSource: 'https://knightsmsk.github.io/HomePetResource/imgPet/Cat/delta.jpg'
    },
    {
        id: 2, name: 'Khunpan', type: 'Cat',breed: 'Thai cat', gender: 'Male', ageYear: 0, ageMonth: 6,
        title: '', description: '', topic: '', status: 'NOT YET',
        imgSource: 'https://knightsmsk.github.io/HomePetResource/imgPet/Cat/khunpan.jpeg'
    },
    {
        id: 3, name: 'Boo', type: 'Dog',breed: 'Thai dog', gender: 'Female', ageYear: 0, ageMonth: 8,
        title: '', description: '', topic: '', status: 'NOT YET',
        imgSource: 'https://knightsmsk.github.io/HomePetResource/imgPet/Dog/boo.jpg'
    },
    {
        id: 4, name: 'Mew', type: 'Cat',breed: 'Siamese cat', gender: 'Male', ageYear: 0, ageMonth: 3,
        title: '', description: '', topic: '', status: 'ALREADY',
        imgSource: 'https://knightsmsk.github.io/HomePetResource/imgPet/Cat/mew.jpeg'
    },
    {
        id: 5, name: 'Lulu', type: 'Dog',breed: 'Pit Bull', gender: 'Male', ageYear: 1, ageMonth:0,
        title: '', description: '', topic: '', status: 'NOT YET',
        imgSource: 'https://knightsmsk.github.io/HomePetResource/imgPet/Dog/lulu.jpg'
    },
    {
        id: 6, name: 'Kankaew', type: 'Dog',breed: 'Thai dog', gender: 'Male', ageYear: 0, ageMonth: 2,
        title: '', description: '', topic: '', status: 'ALREADY',
        imgSource: 'https://knightsmsk.github.io/HomePetResource/imgPet/Dog/kankaew.jpeg'
    },
    {
        id: 7, name: 'Joe', type: 'Dog',breed: 'Jack Russell', gender: 'Male', ageYear: 8, ageMonth: 0,
        title: '', description: '', topic: '', status: 'NOT YET',
        imgSource: 'https://knightsmsk.github.io/HomePetResource/imgPet/Dog/joe.jpg'
    },
    {
        id: 8, name: 'Milo', type: 'Cat',breed: 'Thai cat', gender: 'Male', ageYear: 0, ageMonth: 3,
        title: '', description: '', topic: '', status: 'ALREADY',
        imgSource: 'https://knightsmsk.github.io/HomePetResource/imgPet/Cat/milo.jpg'
    }

]

let Pet = {
    list: () => new Promise((resolve, reject) => resolve(data))
    ,
    findPet: (id) => {
        return new Promise((resolve, reject) => {
            let index = data.findIndex(e => e.id ===id)
            if (index < 0) reject("Not found pet id:"+id);
            resolve(data[index])
        }
    )},
    updatePetData: (id, editPet) => {
        return new promise ((resolve, reject) => {
            let index = data.findIndex(e => e.id ===id);
            data.splice(index, 1 ,editPet)
            resolve(data[index])
        })

    },
    addPet: (newPet) => {
        return new Promise((resolve, reject) => {
            data.push(newPet);
            resolve(data[data.length]-1)
        })

    },
    deletePet: (id) => {
        return new Promise((resolve, reject) => {
            let index = data.findIndex(e => e.id ===id)
            if (index<0) return reject ("Not found pet for delete "+ id);
            data.splice(index, 1)
            resolve(1)
        })
    }

}
export default Pet;