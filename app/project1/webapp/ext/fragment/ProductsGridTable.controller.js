sap.ui.define([
    "sap/m/MessageToast",
    "sap/ui/model/Filter"
], function (MessageToast, Filter) {
    'use strict';

    return {

        onProductPress: function (oEvent) {
            this.getRouting().navigateToRoute('ProductsViewObjectPage', { key: oEvent.getSource().getBindingContext().getObject('ID') });
        },
    };
});
