import Pet from '../model/pet.js'

//show pet list
export const showListPet = (req, res) => {
    Pet.list().then(result => res.json(result));
};

//add pet
export const createNewPet = (req, res) => {
    Pet.addPet(req.body).then(()=> {return res.send("Create Pet Successfully")})
}

//find pet
export const get = (req, res) => {
    const id = req.params.id;
    Pet.findPet(id)
    .then(pet => {
        if(!pet){
            return res.status(404).send({
                error: "Pet not found with id "+id
            });
        }
        res.json(pet);
    }).catch(err => {
        return res.status(500).send({
            error: "Error retrieving Pet with id " +id
        });
    });
};;

//update pet
export const put = (req, res) => {
    const data = req.body || {};
    if(!data || data.id != req.params.id)
        return res.status(422).send({error: "id must be alphanumeric."});

    Pet.updatePetData(req.params.id,req.body)
    .then(pet => {
        res.send(pet);
    }).catch(err => {
        return res.status(500).send({
            error: "Error updating Pet with id " + req.param.id
        });
    });
};

//delete pet
export const remove = (req, res) => {
    const data = req.body || {};
    if(!data || data.id != req.params.id)
        return res.status(422).send({error: "id must be alphanumeric."});
    Pet.deletePet(data.id).then(
        () => {
            return res.status(200).send({ success: true })
        }
    ).catch(() => {
        return res.status(404).send({
            error: "Pet not found with id "+ req.params.id
        });
    })
}


