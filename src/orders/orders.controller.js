const path = require("path");

// Use the existing order data
const orders = require(path.resolve("src/data/orders-data"));

// Use this function to assigh ID's when necessary
const nextId = require("../utils/nextId");

// TODO: Implement the /orders handlers needed to make the tests pass




const list = (req, res, next) =>{
    res.json({ data: orders })
}

function bodyDataHas(propertyName) {
    return function (req, res, next) {
      const { data = {} } = req.body;
      if (data[propertyName]) {
        return next();
        
      }
      next({
          status: 400,
          message: `Order must include a ${propertyName}`
      });
    };
  }




const hasDish = (dish) =>{

  return function (req, res, next) {

    const { data = {} } = req.body;

    if (Array.isArray(data[dish]) && data[dish].length > 0) {

      return next();

    }
    next({

        status: 400,

        message: `Order must include at least one dish`

    });
  };
  
}

function create(req, res) {
    const { data: { deliverTo, mobileNumber, status, dishes: [{ id, name, description, image_url, price, quantity }] } = {} } = req.body;
    const newOrder = {
        id: nextId(),
        deliverTo: deliverTo,
        mobileNumber: mobileNumber,
        status: status,
        dishes: [
        { id: id,
        name: name,
        description: description,
        image_url: image_url,
        price: price,
        quantity: quantity
        }]
    };
    orders.push(newOrder);
    res.status(201).json({ data: newOrder });
  }

function orderExists(req, res, next) {
    const { orderId } = req.params;
    const foundOrder = orders.find((order) => order.id === orderId);
    if (foundOrder) {
      res.locals.order = foundOrder
      return next();
    }
    next({
      status: 404,
      message: `order id not found: ${orderId}`,
    });
  }


  const validQuantity = (req, res, next) =>{
  
 
    // const index = dishes.indexOf((dish) => )

    const { data = { dishes }  } = req.body;
    
    const dishList = data.dishes;
    
    const index = dishList.findIndex((dish) => {
      if(!dish.quantity || dish.quantity <= 0 || !Number.isInteger(dish.quantity)){
        return dish
      }
    })
   
    if (index > -1)  {

      return next({
        
        status: 400,

        message: `Dish ${index} must have a quantity that is an integer greater than 0`
    
      }) 
      
    }
    next();
  };


const read = (req, res, next) => {
    
     res.json({ data: res.locals.order })
}

/*const idMatch = (req, res, next) =>{
  const { orderId } = req.params;

  const { data: { id } = {} } = req.body;

  if(orderId !== id && id !== "" && id !== null && id !== undefined){
    next({
    status: 400,
    message: `Order id does not match route id. Order: ${id}, Route: ${orderId}`
  })
  }
  next()
}*/

function update(req, res) {

  const order = res.locals.order;

  const { data: {
  deliverTo, 
  mobileNumber,
  status, 
  dishes: [{
  id,
  name,
  description,
  image_url,
  price,
  quantity
}] 
} = {} } = req.body;


  // Update the order

  order.deliverTo = deliverTo;

  order.mobileNumber = mobileNumber;

  order.status = status

  order.dishes = [{id, name, description, image_url, price, quantity}];


  res.json({ data: order });


}

/*const requireStatus = (req, res, next) => {
   
  const { data: { status } = {} } = req.body;

  

  if (!status || status == ""){
    
    next({
    status: 400,
    message: "Order must have a status of pending, preparing, out-for-delivery, delivered"
  });
  
}next(); 

};*/

const validStatus = (req, res, next) => {
  const { orderId } = req.params;
	const { data: { id, status } = {} } = req.body;

	let message;
	if(id && id !== orderId)
		message = `Order id does not match route id. Order: ${id}, Route: ${orderId}`
	else if(!status || status === "" || (status !== "pending" && status !== "preparing" && status !== "out-for-delivery"))
		message = "Order must have a status of pending, preparing, out-for-delivery, delivered";
	else if(status === "delivered")
		message = "A delivered order cannot be changed"

	if(message) {
		return next({
			status: 400,
			message: message,
		});
	}

	next();
  
}

const validDelete = (req, res, next) => {

    
    
    if (res.locals.order.status !== 'pending'){

     next({

      status: 400,

      message: "An order cannot be deleted unless it is pending"

    }) 

    }next()
    
  }



function destroy(req, res) {
  
  const index = orders.indexOf(res.locals.order);
  // `splice()` returns an array of the deleted elements, even if it is one element
  orders.splice(index, 1);
  res.sendStatus(204);
  
}


module.exports={
    create: [
      bodyDataHas("deliverTo"),
      bodyDataHas("mobileNumber"),
      bodyDataHas("dishes"),
      hasDish("dishes"),
      validQuantity,
      create
    ],
    list,
    read: [orderExists, read],
    update: [
      orderExists,
      bodyDataHas("deliverTo"),
      bodyDataHas("mobileNumber"),
      bodyDataHas("dishes"),
      hasDish("dishes"),
      validQuantity,
      validStatus,
      update
    ],
    delete: [orderExists, validDelete, destroy]
}
