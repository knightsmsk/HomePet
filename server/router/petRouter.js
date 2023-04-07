import express from 'express';
import { showListPet, createNewPet, get, put, remove, lastPost } from '../controller/petController.js';

let router = express.Router()

router.post('/pages/Post', createNewPet);
router.get('/pages/Adopt', showListPet);
router.get('/pages/Index',lastPost);
router.get('/:id', get);
router.put('/:id', put);
router.delete('/:id', remove);

export default router;