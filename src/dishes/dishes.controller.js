const path = require("path");

// Use the existing dishes data
const dishes = require(path.resolve("src/data/dishes-data"));

// Use this function to assign ID's when necessary
const nextId = require("../utils/nextId");

// TODO: Implement the /dishes handlers needed to make the tests pass

const list = (req, res, next) =>{
    res.json({ data: dishes })
}

function bodyDataHas(propertyName) {
    return function (req, res, next) {
      const { data = {} } = req.body;
      if (data[propertyName]) {
        return next();
      }
      next({
          status: 400,
          message: `dish must include a ${propertyName}`
      });
    };
  }



const isANumber = (req, res, next) =>{
  
    const { data: { price } = {} } = req.body;
    if (typeof price == "number" && price > 0)  {
      return next();
    }
    next({
        status: 400,
        message: `Dish must have a price that is an integer greater than 0`
    });
  };


function create(req, res) {
    const { data: { name, description, price, image_url } = {} } = req.body;
    const newdish = { 
        id: nextId(),
        name: name,
        description: description,
        price: price,
        image_url: image_url
       };
    
    dishes.push(newdish);
    res.status(201).json({ data: newdish });
  }

function dishExists(req, res, next) {
    const { dishId } = req.params;
    const foundDish = dishes.find((dish) => dish.id === dishId);
    if (foundDish) {
      res.locals.dish = foundDish
      return next();
    }
    next({
      status: 404,
      message: `Dish does not exist: ${dishId}`,
    });
  }
  

const read = (req, res, next) => {
    
     res.json({ data: res.locals.dish })
}

const idMatch = (req, res, next) =>{
  const { dishId } = req.params;
  const { data: { id } = {} } = req.body
  if(dishId !== id && id !== "" && id !== null && id !== undefined){
    next({
    status: 400,
    message: `Dish id does not match route id. Dish: ${id}, Route: ${dishId}`
  })
  }
  next()
}

function update(req, res) {

  const dish = res.locals.dish;

  const { data: {
  id,
  name,
  description,
  price,
  image_url
} = {} } = req.body;


  // Update the dish

  dish.id = id;

  dish.name = name;

  dish.description = description;

  dish.price = price;

  dish.image_url = image_url;

  res.json({ data: dish });


}


module.exports = {
    create: [
        bodyDataHas("name"),
        bodyDataHas("description"),
        bodyDataHas("price"),
        bodyDataHas("image_url"),
        isANumber,
        create
    ],
    list,
    read: [dishExists, read],
    update: [
        dishExists,
        bodyDataHas("name"),
        bodyDataHas("description"),
        bodyDataHas("price"),
        bodyDataHas("image_url"),
        idMatch,
        isANumber,
        update
    ]
}
