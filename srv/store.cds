using market from '../db/schema.cds';

service Catalog {
    entity ProductTypeView as projection on market.ProductType;
    entity CompanyManufacturersView as projection on market.CompanyManufacturers;
    entity StatusesView as projection on market.Statuses;
    entity ProductsView as projection on market.Products actions{
        action addToOrderByCurrUser()
    };
    entity OrdersView as projection on market.Orders {
        *,
        OrderItems
    };
    entity OrderItemsView as projection on market.OrderItems;
};