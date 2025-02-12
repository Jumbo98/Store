namespace market;

using {
    managed,
    cuid
} from '@sap/cds/common';

aspect describer {
    title       : String;
    description : String;
}

type ExpireStatus : Integer enum {
    highlighted = 1;
    noHighlighted = 0
}

entity ProductType : cuid, describer {
    // Products : Composition of many Products
    //                on Products.type = $self;
}

entity CompanyManufacturers : cuid, describer {
    // Products : Composition of many Products
    //                on Products.company = $self;
}

entity Products :  cuid, describer {
    type       : Association to ProductType;
    company    : Association to CompanyManufacturers;
    stock      : Integer;
    price      : Integer;
    expireDate : DateTime;
    expireStatus : ExpireStatus;
    
    // quantity : Integer;
    // status : Association to Statuses;
  }

entity Statuses : cuid, describer {}


entity Orders : cuid, managed {
  OrderItems : Association to many OrderItems on OrderItems.Order = $self;
  quantity : Integer;
  status : Association to Statuses;
}

entity OrderItems : cuid, managed {
key Order : Association to Orders;
 product : Association to Products;
  quantity : Integer;
}
