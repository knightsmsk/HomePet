import Pet, { PetBreeds } from '../model/pet.js';
import PetDB from '../model/PetDB.js';
import BreedDB from '../model/BreedDB.js';

//show pet list
export const showListPet = (req, res) => {
  const { type } = req.params;
  let filterwType =
    type !== 'null' ? { type: { $regex: type, $options: 'i' } } : {};

  PetDB.find(filterwType)
    .sort({ dateTime: -1 })
    .sort({ _id: -1 })
    .then((result) => {
      res.json(result);
    })
    .catch((err) => res.status(500).send({ errors: 'Servers Database Error' }));
};

//add pet to first child
export const createNewPet = (req, res) => {
  PetDB.create(req.body)
    .then((doc) => {
      res.json('Post create successfully');
    })
    .catch((error) => {
      if (error.name === 'MongoServerError' && error.code === 11000) {
        return res.status(400).send({
          error: `A duplicate key error on: ${Object.keys(
            error.keyPattern[0]
          )}`,
        });
      } else if (error.name === 'ValidationError') {
        let errors = {};
        Object.keys(error.errors).forEach((key) => {
          errors[key] = error.errors[key].message;
        });
        return res.status(400).send(errors);
      } else
        res
          .status(500)
          .send({
            errors: `Database Server Error ${error.name} ${error.code}`,
          });
    });
};

//find pet
export const get = (req, res) => {
  const id = req.params.id;

  PetDB.findOne({ id: id })
    .then((pet) => {
      if (!pet) {
        return res.status(404).send({ error: `Pet not found with id ${id}` });
      }
      res.json(pet);
    })
    .catch((error) => {
      return res.status(500).send({
        error: `Error retrieving Pet with id ${id}`,
      });
    });
};

//update pet
export const put = (req, res) => {
  const data = req.body || {};
  if (!data || data.id != req.params.id)
    return res.status(422).send({ error: 'id must be alphanumeric.' });

  PetDB.findOneAndUpdate(
    { id: req.params.id },
    { $set: data },
    {
      upsert: false,
      new: true,
    }
  )
    .then((pet) => {
      if (!product) {
        return res
          .status(404)
          .send({ error: `Pet not found with id ${req.params.id}` });
      }
      res.json(pet);
    })
    .catch((error) => {
      if (error.kind === 'ObjectId') {
        return res
          .status(404)
          .send({ error: `Object not found with id ${req.params.id}` });
      }
      return res
        .status(500)
        .send({ error: `Error updating Pet with id ${req.param.id}` });
    });
};

//delete pet
export const remove = (req, res) => {
  const data = req.body || {};
  if (!data || data.id != req.params.id)
    return res.status(422).send({ error: 'id must be alphanumeric.' });

  PetDB.deleteOne({ id: data.id })
    .then((response) => {
      if (response.acknowledged && response.deletedCount === 1)
        return res.status(200).send({ success: 'Delete post successfully' });
      else
        return res
          .status(200)
          .send({ success: "Post doesn't exist or already deleted'" });
    })
    .catch((error) => {
      return res.status(404).send({ error: error.name });
    });
};

//get last pet
export const lastPost = (req, res) => {
  const { type } = req.params;
  let filterwType =
    type !== 'null' ? { type: { $regex: type, $options: 'i' } } : {};

  PetDB.find(filterwType)
    .sort({ dateTime: -1 })
    .then((result) => {
      res.json(result.slice(0, 4));
    })
    .catch((err) => res.status(500).send({ errors: 'Servers Database Error' }));
};

//get breeds
export const getBreeds = (req, res) => {
  const { type } = req.params;
  BreedDB.find({ id: type })
    .then((result) => {
      res.json(result[0].breeds);
    })
    .catch((err) => res.status(500).send({ errors: 'Servers Database Error' }));
};
