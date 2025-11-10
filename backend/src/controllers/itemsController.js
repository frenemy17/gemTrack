const prisma=require('../prismaClient');

exports.createItem = async (req, res) => {
    try {
      const { name, sku, weight, cost, price } = req.body;
  
      if (!name) {
        return res.status(400).json({ message: 'Item name is required' });
      }
  
      const newItem = await prisma.item.create({
        data: {
          name,
          sku,
          weight,
          cost,
          price
        }
      });
  
      res.status(201).json(newItem);
  
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error while creating item' });
    }
  };

exports.getAllItems = async (req, res) => {
    try {
     
      const items = await prisma.item.findMany({
       
        orderBy: {
          createdAt: 'desc'
        }
      });
  
      
      res.status(200).json(items);
  
    } catch (error){
      console.error(error);
      res.status(500).json({ message: 'Server error while getting items' });
    }
  };

  exports.updateItem = async (req, res) => {
    try {
      const { id } = req.params;
      const { name, sku, weight, cost, price } = req.body;
  
      const updatedItem = await prisma.item.update({
        where: {
          id: parseInt(id) 
        },
        data: {
          name,
          sku,
          weight,
          cost,
          price
        }
      });
  
      res.status(200).json(updatedItem);
  
    } catch (error) {
      console.error(error);
      if (error.code === 'P2025') {
        return res.status(404).json({ message: 'Item not found' });
      }
      res.status(500).json({ message: 'Server error while updating item' });
    }
  };

  exports.deleteItem = async (req, res) => {
    try {
      const { id } = req.params;
  
      await prisma.item.delete({
        where: {
          id: parseInt(id)
        }
      });
  
      res.status(200).json({ message: 'Item deleted successfully' });
  
    } catch (error) {
      console.error(error);
      if (error.code === 'P2025') {
        return res.status(404).json({ message: 'Item not found' });
      }
      res.status(500).json({ message: 'Server error while deleting item' });
    }
  };