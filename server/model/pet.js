let data = [
    {
        id: 1, 
        image_src: 'https://knightsmsk.github.io/HomePetResource/imgPet/Cat/delta.jpg'
        , name: 'Delta', type: 'Cat',breed: 'Thai cat', 
        details: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit adipiscing elit adipiscing elit. adipiscing elit adipiscing elit adipiscing elit. adipiscing elit adipiscing elit adipiscing elit.'
        , ageMonth: '8',  ageYear: '0', gender: 'Male',
        status: 'Available', owner: 'Phoebe', time: '1 hours ago', topic: 'cat'
        
    },
    {
        id: 2, 
        image_src: 'https://knightsmsk.github.io/HomePetResource/imgPet/Cat/khunpan.jpeg'
        , name: 'Khunpan', type: 'Cat',breed: 'Thai cat', 
        details: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit adipiscing elit adipiscing elit. adipiscing elit adipiscing elit adipiscing elit. adipiscing elit adipiscing elit adipiscing elit.'
        , ageMonth: '6',  ageYear: '0', gender: 'Male',
        status: 'Available', owner: 'Grace', time: '2 hours ago', topic: 'cat'

    },
    {
        id: 3, 
        image_src: 'https://knightsmsk.github.io/HomePetResource/imgPet/Dog/boo.jpg'
        , name: 'Boo', type: 'Dog',breed: 'Thai dog', 
        details: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit adipiscing elit adipiscing elit. adipiscing elit adipiscing elit adipiscing elit. adipiscing elit adipiscing elit adipiscing elit.'
        , ageMonth: '8',  ageYear: '0', gender: 'Female',
        status: 'Adopted', owner: 'Linda', time: '3 hours ago', topic: 'dog'

    },
    {
        id: 4, 
        image_src: 'https://knightsmsk.github.io/HomePetResource/imgPet/Cat/mew.jpeg'
        , name: 'Mew', type: 'Cat',breed: 'Siamese cat', 
        details: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit adipiscing elit adipiscing elit. adipiscing elit adipiscing elit adipiscing elit. adipiscing elit adipiscing elit adipiscing elit.'
        , ageMonth: '3',  ageYear: '0', gender: 'Male',
        status: 'Available', owner: 'Dion', time: '3 hours ago', topic: 'cat'

    },
    {
        id: 5, 
        image_src: 'https://knightsmsk.github.io/HomePetResource/imgPet/Dog/lulu.jpg'
        , name: 'Lulu', type: 'Dog',breed: 'Pit Bull', 
        details: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit adipiscing elit adipiscing elit. adipiscing elit adipiscing elit adipiscing elit. adipiscing elit adipiscing elit adipiscing elit.'
        , ageMonth: '0',  ageYear: '1', gender: 'Male',
        status: 'Adopted', owner: 'Renny', time: '3 hours ago', topic: 'dog'
    
    },
    {
        id: 6, 
        image_src: 'https://knightsmsk.github.io/HomePetResource/imgPet/Dog/kankaew.jpeg'
        , name: 'Kankaew', type: 'Dog',breed: 'Thai dog', 
        details: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit adipiscing elit adipiscing elit. adipiscing elit adipiscing elit adipiscing elit. adipiscing elit adipiscing elit adipiscing elit.'
        , ageMonth: '2',  ageYear: '0', gender: 'Male',
        status: 'Available', owner: 'Randel', time: '4 hours ago', topic: 'dog'
        
    },
    {
        id: 7, 
        image_src: 'https://knightsmsk.github.io/HomePetResource/imgPet/Dog/joe.jpg'
        , name: 'Joe', type: 'Dog',breed: 'Jack Russell', 
        details: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit adipiscing elit adipiscing elit. adipiscing elit adipiscing elit adipiscing elit. adipiscing elit adipiscing elit adipiscing elit.'
        , ageMonth: '0',  ageYear: '8', gender: 'Male',
        status: 'Adopted', owner: 'Milada', time: '4 hours ago', topic: 'dog'
        
    },
    {
        id: 8, 
        image_src: 'https://knightsmsk.github.io/HomePetResource/imgPet/Cat/milo.jpg'
        , name: 'Milo', type: 'Cat',breed: 'Thai cat', 
        details: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit adipiscing elit adipiscing elit. adipiscing elit adipiscing elit adipiscing elit. adipiscing elit adipiscing elit adipiscing elit.'
        , ageMonth: '3',  ageYear: '0', gender: 'Male',
        status: 'Available', owner: 'Cara', time: '6 hours ago', topic: 'cat'

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
            let index = data.findIndex(e => e.id === id)
            if (index<0) return reject ("Not found pet for delete "+ id);
            data.splice(index, 1)
            resolve(1)
        })
    },
    threeLastPet: () => {
        return new Promise((resolve, reject) => {
            let index = data.length()
            let lastThreeIndex = []
            if (index<=3) {
                lastThreeIndex.push(data[index-1])
                lastThreeIndex.push(data[index-2])
                lastThreeIndex.push(data[index-3])
                resolve(lastThreeIndex)
            }
            else{
                for (let i=index-1 ; i>=0 ; i--) {
                    lastThreeIndex.push(data[i])
                }
                resolve(lastThreeIndex)
            }
            
        })
    }

}
export default Pet;