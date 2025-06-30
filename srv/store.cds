
using market from '../db/schema.cds';

service Catalog {
    
    entity CommentsView as projection on market.Comments;

    action uploadImage(fileName: String, mimeType: String, data: LargeBinary) returns String;

    entity FilesView as projection on market.Files;
    annotate FilesView with {
        data @Core.MediaType: 'mimeType';
    };

    entity ProductTypeView as projection on market.ProductType;
    entity CompanyManufacturersView as projection on market.CompanyManufacturers;
    entity StatusesView as projection on market.Statuses;
    
    entity ProductsView as projection on market.Products{
        *,
        virtual null as onlyFreshProducts : Boolean
    } actions{
        action addToOrderByCurrUser();
    };
    action addToOrderWithParams(order: UUID, count: Integer, product: UUID);
    entity FreshProducts as projection on ProductsView where expireDate > $now ORDER BY expireDate desc ;

    @requires: 'Admin'
    function updatePrices() returns String;
    
    entity OrdersView as projection on market.Orders {
        *,
        OrderItems
    };
    entity OrderItemsView as projection on market.OrderItems {
        order,
        product,
        quantity,
        quantity * product.price as totalByItem : Integer,
    };
    
};