sap.ui.define(['sap/ui/core/mvc/ControllerExtension'], function (ControllerExtension) {
	'use strict';

	return ControllerExtension.extend('project1.ext.controller.OrdersView', {
		// this section allows to extend lifecycle hooks or hooks provided by Fiori elements
		override: {
			onInit: function () {
				// you can access the Fiori elements extensionAPI via this.base.getExtensionAPI
				var oModel = this.base.getExtensionAPI().getModel();

				this.base.getExtensionAPI().getEditFlow().attachonBeforeDelete(async function(event){
					var tableOrderItems = sap.ui.getCore().byId('project1::OrdersViewObjectPage--fe::table::OrderItems::LineItem::Itemsoforder::Table'),
					count = queueMicrotask(async ()=>await tableOrderItems.getCounts());
				});
			},

		}
	});
});
