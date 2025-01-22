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
      const currUser = req.user,
      orderByCurrUser = await SELECT.one.from(OrderItemsView).where(`createdBy = ${currUser}`),
      id = req.params[0],
      count = 1,
      { stock } = await SELECT.one.from(ProductsView).columns('stock').where(`ID = '${id}'`);

    if (count > stock)
      req.error(`Current quantity of product equal ${stock}`);

    let newItem = {
      quantity: count,
      parent_ID: orderByCurrUser ? orderByCurrUser.ID : uuid(),
      product_ID: id,
      createdBy: currUser,
      modifiedBy: currUser
    };

    await INSERT.into(OrderItemsView).entries(newItem);

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
      // if (!product.expireDate) {
      // product.expireDate = new Date();
      // product.expireDate = new Date(new Date().getTime() + (oneDay * Math.random() * (10 - (-3) + 1) + (-3)));
      // }
      if(new Date(product.expireDate).getTime() - currentDate > oneDay * 3 ){
        product.expireStatus = 0;
      } else {
        product.expireStatus = 1;
      }
      if (product.stock > 50) {
        product.price = product.price * 0.9;
        product.title += "10% discount";
      }
    });

    // const srv = await cds.connect.to('Catalog');

    // return await SELECT.from(ProductTypeView);
    // return await SELECT.from('Catalog.ProductsView').join('Catalog.ProductTypeView').on('ProductsView.type_ID = ProductTypeView.ID');
    return arr;
  };
  function afterEach(product, next) {
    let { stock } = product;

    if (stock === 0)
      product.description = 'Empty';


    return next;
  };
});

