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

entity Statuses : cuid, describer {
    statusCriticality: Int16;
}

@odata.draft.enabled
entity Orders : cuid, managed {
  OrderItems : Composition of many OrderItems on OrderItems.order = $self;
  status : Association to Statuses;
  virtual totalByOrder: Integer default 0;
}


@odata.draft.bypass
entity OrderItems : managed {
key order : Association to Orders;
key product : Association to Products;
  quantity : Integer;
  virtual totalByItem: Integer default 0;
}
