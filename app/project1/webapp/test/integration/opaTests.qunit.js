sap.ui.require(
    [
        'sap/fe/test/JourneyRunner',
        'project1/test/integration/FirstJourney',
		'project1/test/integration/pages/ProductsViewList',
		'project1/test/integration/pages/ProductsViewObjectPage'
    ],
    function(JourneyRunner, opaJourney, ProductsViewList, ProductsViewObjectPage) {
        'use strict';
        var JourneyRunner = new JourneyRunner({
            // start index.html in web folder
            launchUrl: sap.ui.require.toUrl('project1') + '/index.html'
        });

       
        JourneyRunner.run(
            {
                pages: { 
					onTheProductsViewList: ProductsViewList,
					onTheProductsViewObjectPage: ProductsViewObjectPage
                }
            },
            opaJourney.run
        );
    }
);