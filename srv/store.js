const cds = require('@sap/cds');
const { ProductTypeView, CompanyManufacturersView, ProductsView, OrderItemsView, OrdersView } = cds.entities('Catalog');
const logger = cds.log('capb2p');
const { uuid } = cds.utils;



module.exports = cds.service.impl(function () {
  this.on('getStocksByID', getStockByID);

  this.on('addToOrderByCurrUser', ProductsView, addItemToOrder);
  this.on('addToOrderWithParams', ProductsView, addItemToOrderWithParams);

  this.after('READ', ProductsView, afterRead);

  this.after('each', ProductsView, afterEach);
  // this.after('each', OrderItemsView, afterEachItem);
  this.after('each', OrdersView, afterEachOrder);
  this.after('READ', OrderItemsView, handleCalcTotalByItem);

  async function addItemToOrder(req) {

      const currUser = req.user.id,
      id = req.params[0],
      orderByCurrUser = await SELECT.one.from(OrdersView).where(`createdBy = '${currUser}'`),
      orderItemByCurrUser = orderByCurrUser ? await SELECT.one.from(OrderItemsView).where(`order_ID = '${orderByCurrUser.ID}' and product_ID = '${id}'`)
      : null,
      count = 1,
      { stock, expireDate } = await SELECT.one.from(ProductsView).columns('stock', 'expireDate').where(`ID = '${id}'`);

    if (count > stock){
      return req.error(`Current quantity of product equal ${stock}`);
    }
      
    if (new Date(expireDate).getTime() <= new Date().getTime()){
      return req.error(`This item expired`);
    }

    if(!orderByCurrUser){
      var newOrder = {
        ID: orderByCurrUser ? orderByCurrUser.order_ID : uuid(),
        status_ID: '6FF30140-FADA-914F-1900-51EE8E50FF04',
        createdBy: currUser,
        modifiedBy: currUser
      };
      
      await INSERT.into(OrdersView).entries(newOrder);
    }

    let newOrderItem = {
      quantity: orderItemByCurrUser ? (+orderItemByCurrUser.quantity + 1) : count,
      order_ID: orderItemByCurrUser ? orderItemByCurrUser.order_ID : orderByCurrUser ? orderByCurrUser.ID : newOrder.ID,
      product_ID: id,
      createdBy: currUser,
      modifiedBy: currUser
    };

    await UPSERT.into(OrderItemsView).entries(newOrderItem);
    // .where(`order_ID = '${newOrderItem.order_ID}' and product_ID = '${newOrderItem.product_ID}'`);

  };

  function addItemToOrderWithParams(req) {
    logger(req);
  };

  function createNewData(ID, type_ID, company_ID, stock, price, expireDate, title, description) {
    return {
      ID,
      type_ID,
      company_ID,
      stock,
      price,
      expireDate,
      title,
      description
    }
  };
  async function getStockByID(req) {
    const { id } = req.data,
      data = await SELECT.one.from(ProductsView).columns('stock').where(`ID = '${id}'`),
      stock = data && data.stock;
    if (isNaN(stock)) {
      req.error(`No found product with id = ${id}`);
    } else {
      return stock;
    }
  };

  function generateExpireDate() {
    const oneDay = 1000 * 60 * 60 * 24;
    
    return new Date(new Date().getTime() + (oneDay * Math.random() * (10 - (-3) + 1) + (-3)));
  };

  async function afterRead(products, req) {
    const oneDay = 1000 * 60 * 60 * 24;
    let currentDate = new Date().getTime(),
      arr = products.map(product => {
      if (product.stock === 0) {
        product.description = '00000000000000000000000'
      }

      if(new Date(product.expireDate).getTime() - currentDate > oneDay * 3 ){
        product.expireStatus = 0;
      } else {
        product.expireStatus = 1;
      }
    });

    return arr;
  };
  function afterEach(product, next) {
    let { stock } = product;

    if (stock === 0)
      product.description = 'Empty';


    return next;
  };
  // function afterEachItem(orderItem, next) {
  //   let { product: {price}, quantity } = orderItem;
  
  //   orderItem.totalByItem = price * quantity;

  //   return next;
  // };

  function handleCalcTotalByItem (items) {
    for (const item of items) {
      if (item.quantity && item.product?.price) {
        item.totalByItem = item.quantity * item.product.price;
      } else {
        item.totalByItem = 0;
      }
    }
  };

  async function afterEachOrder(order, next) {
    let { ID } = order,
    orderItems = await SELECT.from(OrderItemsView).columns('quantity', 'product.price as price').where({order_ID: ID}),
    total = orderItems.reduce((total, currV)=> total+=currV.price * currV.quantity,0);

    order.totalByOrder = total;

    return next;
  };
});

