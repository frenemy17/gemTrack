const express=require('express');
const router=express.Router();
const {createItem,getAllItems, updateItem,deleteItem}=require('../controllers/itemsController');

const {protect}=require('../middlewares/authMiddleware');


router.post('/',protect,createItem);
router.get('/', protect, getAllItems);
router.put('/:id', protect, updateItem);
router.delete('/:id', protect, deleteItem);
module.exports=router;