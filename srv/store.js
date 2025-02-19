const cds = require('@sap/cds');
const { ProductTypeView, CompanyManufacturersView, ProductsView, OrderItemsView, OrdersView } = cds.entities('Catalog');
const logger = cds.log('capb2p');
const { uuid } = cds.utils;



module.exports = cds.service.impl(function () {
  // this.on('READ', ProductsView, req => {
  //   logger('on');
  // })
  this.on('getStocksByID', getStockByID);
  // this.on('getCurrentOrder', OrdersView, getCurrentOrder);

  this.on('addToOrderByCurrUser', ProductsView, addItemToOrder);
  // this.on('deleteCurrentOrder', OrdersView, deleteCurrentOrder);
  // this.on('deleteItemByID', OrdersView, deleteItemByID);
  // this.on('deleteItem', OrderItemsView, deleteItem);

//   this.before('READ', ProductsView, beforeRead);

  this.after('READ', ProductsView, afterRead);

  this.after('each', ProductsView, afterEach);

  // async function getCurrentOrder(req) {
  //   let [id] = req.params;

  //   return await SELECT.one.from(OrdersView).where(`ID = '${id}' `);
  // }
  // async function deleteCurrentOrder(req) {
  //   let [id] = req.params;
  //   await DELETE.from(OrdersView, id);
  // }
  // async function deleteItemByID(req) {
  //   let [id] = req.params,
  //     { itemID } = req.data;

  //   await DELETE.from(OrderItemsView).where(`product_id = '${itemID}' and parent_id = '${id}'`);

  //   return await SELECT.one.from(OrdersView).where(`ID = '${id}' `);
  // }
  // async function deleteItem(req) {
  //   let [id, itemID] = req.params;

  //   await DELETE.from(OrderItemsView, { product_ID: itemID, parent_ID: id })

  //   await SELECT.one.from(OrdersView).where(`ID = '${id}' `);
  // }


  
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
        status_ID: '66F30140FADA914F190051EE8E50FF04',
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

  function createNewData(ID, type_ID, company_ID, stock, price, expireDate, title, description) {
    return {
      ID: ID,
      type_ID: type_ID,
      company_ID: company_ID,
      stock: stock,
      price: price,
      expireDate: expireDate,
      title: title,
      description: description
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
//   async function beforeRead(req) {
//     const stock = Math.floor(Math.random() * 100),
//       price = Math.floor(Math.random() * 100),
//       expireDate = new Date(new Date().getTime() + Math.floor(Math.random() * 10000)),
//       { title } = await SELECT.one.from(ProductsView).columns('title').where('price > 0 and price < 100'),
//       { description } = await SELECT.one.from(ProductsView).columns('description').where('price > 100'),
//       createObj = createNewData(uuid(), 'id1', 'id10', stock, price, expireDate, title + " (New offer)", description + " (New offer)");

//     await INSERT.into(ProductsView).entries(createObj);

//     let arrExpireDateIsNull = await SELECT.from(ProductsView).where(`expireDate is null`);

//     if (arrExpireDateIsNull.length) {
//       arrExpireDateIsNull.map(data => data.expireDate = generateExpireDate());
//       await UPSERT.into(ProductsView)
//         .entries(arrExpireDateIsNull);

//     }

//     // await UPDATE.entity(ProductsView)
//     //         .set({expireDate: generateExpireDate() })
//     //         .where(`expireDate is null`);  

//   };

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
});

