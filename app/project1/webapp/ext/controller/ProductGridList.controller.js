sap.ui.define(['sap/ui/core/mvc/ControllerExtension'], function (ControllerExtension) {
	'use strict';

	return ControllerExtension.extend('project1.ext.controller.ProductGridList', {
		override: {
			onInit: function () {
				// attaching filterbar to GridTable
				this.getView().attachEventOnce("afterRendering", function() {
					this.base.getExtensionAPI().getEditFlow().getView().getController()._getFilterBarControl().attachSearch(function (event) {
						const {filters, search} = this.base.getExtensionAPI().getFilters();
						const gridTable = sap.ui.getCore().byId('project1::ProductsViewList--fe::CustomTab::ProductsCard--productGrid');
	
						gridTable.getBinding('items').filter(filters);
	
					}.bind(this));
				  }, this);
				
			},
		}
	});
});