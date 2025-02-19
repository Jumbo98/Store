sap.ui.define([
    "sap/m/MessageToast"
], function(MessageToast) {
    'use strict';

    return {
        refresh: function(oEvent) {
            sap.ui.getCore().byId('project1::ProductsViewList--fe::table::table2::LineItem::Table').refresh();
        },
        refreshOrders: function() {
            sap.ui.getCore().byId('project1::ProductsViewList--fe::table::tableView::LineItem::Table').refresh();
        },
        refreshOrderItems: function() {
            sap.ui.getCore().byId('project1::OrdersViewObjectPage--fe::table::OrderItems::LineItem::Itemsoforder::Table').refresh();
        }
    };
});
