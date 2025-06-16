using Catalog as service from '../../srv/store';
annotate service.ProductsView with @( 
    UI.FieldGroup #GeneratedGroup : {
        $Type : 'UI.FieldGroupType',
        Data : [
            {
                $Type : 'UI.DataField',
                Label : 'title',
                Value : title,
            }, 
            {
                $Type : 'UI.DataField',
                Label : 'description',
                Value : description,
            },
            {
                $Type : 'UI.DataField',
                Label : 'stock',
                Value : stock,
            },
            {
                $Type : 'UI.DataField',
                Label : 'price',
                Value : price,
            },
            {
                $Type : 'UI.DataField',
                Label : 'expireDate',
                Value : expireDate,
                Criticality : expireStatus,
                CriticalityRepresentation : #WithoutIcon,
            },
        ],
    },
    UI.Facets : [
        {
            $Type : 'UI.ReferenceFacet',
            ID : 'GeneratedFacet1',
            Label : 'General Information',
            Target : '@UI.FieldGroup#GeneratedGroup',
        },
    ],
    UI.LineItem : [
        {
            $Type : 'UI.DataField',
            Label : '{i18n>Prdoucts}',
            Value : title,
        },
        {
            $Type : 'UI.DataField',
            Label : '{i18n>ProductDescription}',
            Value : description,
        },
        {
            $Type : 'UI.DataField',
            Label : '{i18n>Stock}',
            Value : stock,
        },
        {
            $Type : 'UI.DataField',
            Label : '{i18n>Price}',
            Value : price,
        },
        {
            $Type : 'UI.DataField',
            Label : '{i18n>ExpireDate}',
            Value : expireDate,
            Criticality : expireStatus,
            CriticalityRepresentation : #WithoutIcon,
        },
    ],
    UI.SelectionPresentationVariant #table : {
        $Type : 'UI.SelectionPresentationVariantType',
        PresentationVariant : {
            $Type : 'UI.PresentationVariantType',
            Visualizations : [
                '@UI.LineItem',
            ],
        },
        SelectionVariant : {
            $Type : 'UI.SelectionVariantType',
            SelectOptions : [
            ],
        },
    },
    UI.SelectionFields : [
        type_ID,
        company_ID,
    ],
    UI.SelectionPresentationVariant #table2 : {
        $Type : 'UI.SelectionPresentationVariantType',
        PresentationVariant : {
            $Type : 'UI.PresentationVariantType',
            Visualizations : [
                '@UI.LineItem',
            ],
            GroupBy : [
                company_ID,
            ],
            SortOrder : [
                {
                    $Type : 'Common.SortOrderType',
                    Property : expireDate,
                    Descending : true,
                },
            ],
        },
        SelectionVariant : {
            $Type : 'UI.SelectionVariantType',
            SelectOptions : [
            ],
        },
        Text : '{i18n>Products}',
    },
    UI.Identification : [
        {
            $Type : 'UI.DataFieldForAction',
            Action : 'Catalog.addToOrderByCurrUser',
            Label : '{i18n>AddToOrder}',
        },
    ],

);



annotate service.ProductsView with {
    title @Common.FieldControl : #Mandatory
};

annotate service.ProductsView with {
    description @(
        UI.MultiLineText : true,
        Common.FieldControl : #Optional,
    )
};

annotate service.ProductsView with {
    stock @(
        Common.FieldControl : #Mandatory,
        )
};

annotate service.ProductsView with {
    price @(
        Measures.ISOCurrency : '$',
        Common.FieldControl : #ReadOnly,
    )
};

annotate service.ProductsView with {
    expireDate @Common.FieldControl : #ReadOnly
};

annotate service.ProductTypeView with {
    ID @Common.Text : {
        $value : title,
        ![@UI.TextArrangement] : #TextOnly,
    }
};

annotate service.CompanyManufacturersView with @(
    UI.PresentationVariant #vh_ProductsView_company : {
        $Type : 'UI.PresentationVariantType',
        SortOrder : [
            {
                $Type : 'Common.SortOrderType',
                Property : title,
                Descending : false,
            },
        ],
    }
);

annotate service.CompanyManufacturersView with {
    ID @Common.Text : {
        $value : title,
        ![@UI.TextArrangement] : #TextOnly,
    }
};

annotate service.ProductTypeView with @(
    UI.PresentationVariant #vh_ProductsView_type : {
        $Type : 'UI.PresentationVariantType',
        SortOrder : [
            {
                $Type : 'Common.SortOrderType',
                Property : title,
                Descending : false,
            },
        ],
    },
    UI.PresentationVariant #vh_ProductsView_type1 : {
        $Type : 'UI.PresentationVariantType',
        SortOrder : [
            {
                $Type : 'Common.SortOrderType',
                Property : ID,
                Descending : false,
            },
        ],
    },
);

annotate service.ProductsView with {
    type @(
        Common.Label : '{i18n>TypesOfProducts}',
        Common.Text : {
            $value : type.title,
            ![@UI.TextArrangement] : #TextOnly,
        },
        Common.ValueList : {
            $Type : 'Common.ValueListType',
            CollectionPath : 'ProductTypeView',
            Parameters : [
                {
                    $Type : 'Common.ValueListParameterInOut',
                    LocalDataProperty : type_ID,
                    ValueListProperty : 'ID',
                },
            ],
            Label : '{i18n>Types}',
            PresentationVariantQualifier : 'vh_ProductsView_type1',
        },
        Common.ValueListWithFixedValues : true,
    )
};

annotate service.ProductsView with {
  onlyFreshProducts @(
    Common.Label: 'Только свежие продукты'
  );
};

annotate service.ProductsView with {
    company @(
        Common.Label : '{i18n>Companies}',
        Common.Text : {
            $value : company.title,
            ![@UI.TextArrangement] : #TextOnly,
        },
        Common.ValueList : {
            $Type : 'Common.ValueListType',
            CollectionPath : 'CompanyManufacturersView',
            Parameters : [
                {
                    $Type : 'Common.ValueListParameterInOut',
                    LocalDataProperty : company_ID,
                    ValueListProperty : 'ID',
                },
            ],
            Label : 'Companies',
        },
        Common.ValueListWithFixedValues : true,
    )
};

annotate service.OrdersView with @(
    UI.LineItem #tableView : [
        {
            $Type : 'UI.DataField',
            Value : createdAt,
        },
        {
            $Type : 'UI.DataField',
            Value : createdBy,
        },
        {
            $Type : 'UI.DataField',
            Value : status_ID,
            Label : '{i18n>Status}',
            Criticality : status.statusCriticality,
            CriticalityRepresentation : #WithoutIcon,
        },
        {
            $Type : 'UI.DataField',
            Value : ID,
            Label : 'ID',
        },
    ],
    UI.SelectionPresentationVariant #tableView : {
        $Type : 'UI.SelectionPresentationVariantType',
        PresentationVariant : {
            $Type : 'UI.PresentationVariantType',
            Visualizations : [
                '@UI.LineItem#tableView',
            ],
        },
        SelectionVariant : {
            $Type : 'UI.SelectionVariantType',
            SelectOptions : [
            ],
        },
        Text : '{i18n>Orders}',
    },
    UI.Facets : [
        {
            $Type : 'UI.ReferenceFacet',
            Label : '{i18n>DescriptionOfOrder}',
            ID : 'i18nDescriptionOfOrder',
            Target : '@UI.FieldGroup#i18nDescriptionOfOrder',
        },
        {
            $Type : 'UI.ReferenceFacet',
            Label : '{i18n>ItemsOfOrder}',
            ID : 'Itemsoforder',
            Target : 'OrderItems/@UI.LineItem#Itemsoforder',
        },
    ],
    UI.FieldGroup #i18nDescriptionOfOrder : {
        $Type : 'UI.FieldGroupType',
        Data : [
            {
                $Type : 'UI.DataField',
                Value : createdBy,
            },
            {
                $Type : 'UI.DataField',
                Value : status_ID,
                Label : '{i18n>StatusOfOrder}',
                Criticality : status.statusCriticality,
                CriticalityRepresentation : #WithoutIcon,
            },
            {
                $Type : 'UI.DataField',
                Value : modifiedBy,
            },
            {
                $Type : 'UI.DataField',
                Value : totalByOrder,
                Label : '{i18n>Total}',
            },
        ],
    },
);

annotate service.OrdersView with {
    status @(
        Common.Text : {
            $value : status.title,
            ![@UI.TextArrangement] : #TextOnly
        },
        Common.ValueList : {
            $Type : 'Common.ValueListType',
            CollectionPath : 'StatusesView',
            Parameters : [
                {
                    $Type : 'Common.ValueListParameterInOut',
                    LocalDataProperty : status_ID,
                    ValueListProperty : 'ID',
                },
            ],
            Label : '{i18n>Statuses}',
        },
        Common.ValueListWithFixedValues : true,
    )
};

annotate service.StatusesView with {
    ID @Common.Text : {
        $value : title,
        ![@UI.TextArrangement] : #TextOnly,
    }
};

annotate service.OrderItemsView with @(
    UI.LineItem #Itemsoforder : [
        {
            $Type : 'UI.DataField',
            Value : product_ID,
            Label : '{i18n>Product}',
        },
        {
            $Type : 'UI.DataField',
            Value : product.expireDate,
            Label : 'expireDate',

            Criticality : product.expireStatus,
        },
        {
            $Type : 'UI.DataField',
            Value : product.price,
            Label : 'price',
        },
        {
            $Type : 'UI.DataField',
            Value : totalByItem,
            Label : 'Total by item',
        },
    ]
);

annotate service.OrderItemsView with {
    product @(
        Common.Text : {
            $value : product.title,
            ![@UI.TextArrangement] : #TextOnly
        },
        Common.ValueList : {
            $Type : 'Common.ValueListType',
            CollectionPath : 'FreshProducts',
            Parameters : [
                {
                    $Type : 'Common.ValueListParameterInOut',
                    LocalDataProperty : product_ID,
                    ValueListProperty : 'ID',
                },
                {
                    $Type : 'Common.ValueListParameterDisplayOnly',
                    ValueListProperty : 'title',
                },
                {
                    $Type : 'Common.ValueListParameterDisplayOnly',
                    ValueListProperty : 'type/title',
                },
                {
                    $Type : 'Common.ValueListParameterDisplayOnly',
                    ValueListProperty : 'company/title',
                },
                {
                    $Type : 'Common.ValueListParameterDisplayOnly',
                    ValueListProperty : 'stock',
                },
                {
                    $Type : 'Common.ValueListParameterDisplayOnly',
                    ValueListProperty : 'price',
                },
                {
                    $Type : 'Common.ValueListParameterDisplayOnly',
                    ValueListProperty : 'expireDate',
                },
            ],
            Label : 'Available products',
            PresentationVariantQualifier : 'vh_OrderItemsView_product',
           
        },
        Common.ValueListWithFixedValues : false,
        Common.FieldControl : #Mandatory, 
    )
};

annotate service.FreshProducts with {
    ID @Common.Text : {
        $value : title,
        ![@UI.TextArrangement] : #TextOnly,
    };
};

annotate service.FreshProducts with @(
    UI.PresentationVariant #vh_OrderItemsView_product : {
        $Type : 'UI.PresentationVariantType',
        SortOrder : [
            {
                $Type : 'Common.SortOrderType',
                Property : expireDate,
                Descending : true,
            },
        ],
    },
);

annotate service.ProductsView with {
    ID @Common.Text : {
        $value : title,
        ![@UI.TextArrangement] : #TextOnly,
    }
};

annotate service.OrdersView with {
    totalByOrder @(
        Common.FieldControl : #ReadOnly,
        Measures.ISOCurrency : '$',
    )
};


annotate service.OrderItemsView with {
    totalByItem @(
        Common.FieldControl : #ReadOnly,
        Measures.ISOCurrency : '$',
    )
};

