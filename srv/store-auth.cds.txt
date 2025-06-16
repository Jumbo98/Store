using Catalog from './store.cds';
//Owner
annotate Catalog.CompanyManufacturersView with @(requires: 'authenticated-user');
annotate Catalog.ProductTypeView with @(requires: 'authenticated-user');
annotate Catalog.StatusesView with @(requires: 'authenticated-user');

annotate Catalog.ProductsView with @(restrict: [{
    grant: 'READ',
    to: 'Owner'
}, 
{
    grant: '*', 
    to: 'Admin'
}
]); 

annotate Catalog.OrderItemsView with @(restrict: [{
    grant: '*',
    to: 'Owner',
    where: `createdBy = $user`
}, 
{
    grant: '*', 
    to: 'Admin'
}
]); 
annotate Catalog.OrdersView with @(restrict: [{
    grant: '*',
    to: 'Owner',
    where: `createdBy = $user`
}, 
{
    grant: '*', 
    to: 'Admin'
}
]); 
