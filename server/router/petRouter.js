import express from 'express';
import { showListPet, createNewPet, get, put, remove } from '../controller/petController.js';

let router = express.Router()

// router.post('');
router.get('/', showListPet);
router.get('/:id', get);
router.put('/:id', put);
router.delete('/:id', remove);

export default router;