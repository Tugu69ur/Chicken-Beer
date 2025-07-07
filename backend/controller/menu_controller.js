import asyncHandler from "../middleware/asyncHandler.js";
import Menu from "../models/menuModel.js";

export const getMenu = asyncHandler(async (req, res) => {
  try {
    const menu = await Menu.find({});
    res.status(200).json({
      success: true,
      data: menu,
    });
  } catch (error) {
    console.error("Error fetching menu:", error);
    res.status(500).json({
      success: false,
      message: "Menu fetching failed",
    });
  }
});

export const addMenu = asyncHandler(async (req, res) => {
  const { name, price, category, description, image } = req.body;

  if (!name || !price || !category) {
    res.status(400);
    throw new Error("Нэр, үнэ, төрөл заавал шаардлагатай");
  }

  const menuItem = new Menu({
    name,
    price,
    category,
    description,
    image,
  });

  const createdItem = await menuItem.save();
  res.status(201).json(createdItem);
});

// @desc    Delete a menu item
// @route   DELETE /api/menus/:id
// @access  Private/Admin
export const deleteMenu = asyncHandler(async (req, res) => {
  const { id } = req.params;
try {
  const deleteMenu = await Menu.findByIdAndDelete(id);
  if (!deleteMenu) return res.status(404).json({ message: "Menu not found" });

  res.status(200).json({ message: "Menu deleted successfully" });
}catch (error){
  res
    .status(500)
    .json({ message: "Error deleting menu", error: error.message });
}
 
});

// @desc    Update a menu item
// @route   PUT /api/menus/:id
// @access  Private/Admin
export const updateMenu = asyncHandler(async (req, res) => {
  const { name, price, category, description, image } = req.body;

  const menuItem = await Menu.findById(req.params.id);

  if (!menuItem) {
    res.status(404);
    throw new Error("Меню олдсонгүй");
  }

  menuItem.name = name || menuItem.name;
  menuItem.price = price || menuItem.price;
  menuItem.category = category || menuItem.category;
  menuItem.description = description || menuItem.description;
  menuItem.image = image || menuItem.image;

  const updatedItem = await menuItem.save();
  res.json(updatedItem);
});




