sap.ui.define([
    "sap/m/MessageToast",
    "sap/m/Dialog",
    "sap/m/Button",
    "sap/m/HBox",
    "sap/m/List",
    "sap/m/CustomListItem",
    "sap/m/Text",
    "sap/m/Label",
    "sap/m/Title",
    "sap/m/VBox",
    "sap/ui/model/Filter",
    "sap/ui/model/Sorter",
    "sap/m/ObjectStatus",
    "sap/ui/core/library",
    "sap/m/StepInput",
], function (MessageToast, Dialog, Button, HBox, List, CustomListItem, Text, Label, Title, VBox, Filter, Sorter, ObjectStatus, library, StepInput) {
    'use strict';
    var ValueState = library.ValueState;
    return {
        openActiveOrderPopup: function (oEvent) {
            let formatStatus = (criticality) => {
                switch (criticality) {
                    case "1": return ValueState.Error;
                    case "2": return ValueState.Warning;
                    case "3": return ValueState.Success;
                    case "5": return ValueState.None;
                    default: return ValueState.None;
                }
            },

                formmaterStock = (data) => Number(data),
                totalCostsByAdding = (data) => {
                    let amount = sap.ui.getCore().byId('addingToOrderSI').getValue(),
                        price = sap.ui.core.format.NumberFormat.getFloatInstance().parse(data);
                    if (data) {
                        return (price * amount) + " $"
                    }
                    return "0 $"
                },
                addingToOrderSICH = function (event) {
                    const textCtrl = sap.ui.getCore().byId('totalCostsByAdding');
                    textCtrl.getBindingInfo('text').modelChangeHandler();
                },

                selectItem = function (event) {
                    const selectedOrder = event.getParameter('listItem'),
                        order = selectedOrder.getBindingContext().getObject('ID'),
                        count = sap.ui.getCore().byId('addingToOrderSI').getValue(),
                        product = this.getBindingContext().getObject('ID'),
                        params = {product, count, order},
                        mInParameters = {
                            // context: this.getBindingContext(),
                            model: this.getModel(),
                            // invocationGrouping: 'Isolated',
                            // label: 'Confirm',
                            parameterValues: params,
                            // skipParameterDialog: true
                        };
                    this.getEditFlow().invokeAction("Catalog.addToOrderWithParams", mInParameters);

                    this.dialogOfOrders.close();
                },

                createDialog = () => new Dialog({
                    title: "{i18n>ttlAdding}: {title}",
                    content: [
                        new HBox({
                            renderType: "Bare",
                            wrap: "Wrap",
                            alignItems: "Center",
                            items: [
                                new Label({
                                    text: "{i18n>lPricePerUnit}",
                                    showColon: true
                                }).addStyleClass("sapUiTinyMarginEnd"),
                                new Text({
                                    text: "{price} $"
                                })
                            ]
                        }).addStyleClass("sapUiTinyMargin"),
                        new HBox({
                            renderType: "Bare",
                            wrap: "Wrap",
                            alignItems: "Center",
                            items: [
                                new Label({
                                    text: "{i18n>lAmount}",
                                    showColon: true
                                }).addStyleClass("sapUiTinyMarginEnd"),
                                new StepInput({
                                    id: "addingToOrderSI",
                                    width: "1rem",
                                    value: 1,
                                    min: 1,
                                    max: { path: 'stock', targetType: 'float', formatter: formmaterStock },
                                    step: 1,
                                    largerStep: 2,
                                    change: addingToOrderSICH.bind(this)
                                })
                            ]
                        }).addStyleClass("sapUiTinyMargin"),
                        new HBox({
                            renderType: "Bare",
                            wrap: "Wrap",
                            alignItems: "Center",
                            items: [
                                new Label({
                                    text: "{i18n>lTotalCostsByAdding}",
                                    showColon: true
                                }).addStyleClass("sapUiTinyMarginEnd"),
                                new Text({
                                    id: 'totalCostsByAdding',
                                    text: { path: 'price', formatter: totalCostsByAdding }
                                })
                            ]
                        }).addStyleClass("sapUiTinyMargin"),
                        new List({
                            select: selectItem.bind(this),
                            mode: "SingleSelectMaster",
                            items: {
                                path: "/Catalog.OrdersView",
                                filters: [new Filter({
                                    path: "status_ID",
                                    value1: '6FF30140-FADA-914F-1900-51EE8E50FF04',
                                    operator: "EQ"
                                }),
                                new Filter({
                                    path: "status_ID",
                                    value1: '66F30140-FADA-914F-1900-51EE8E50FF04',
                                    operator: "EQ"
                                })],
                                // events: { dataReceived: data => console.log(data) },
                                template: new CustomListItem({
                                    content:
                                        new VBox({
                                            items: [
                                                new HBox({
                                                    renderType: "Bare",
                                                    wrap: "Wrap",
                                                    items: [
                                                        new Label({ text: "{i18n>lCreatedAt}", showColon: true }).addStyleClass("sapUiTinyMarginEnd"),
                                                        new Text({
                                                            text: "{createdAt}"
                                                        }),
                                                    ]
                                                }).addStyleClass("sapUiTinyMarginBottom"),
                                                new HBox({
                                                    renderType: "Bare",
                                                    wrap: "Wrap",
                                                    items: [
                                                        new Label({ text: "{i18n>lStatus}", showColon: true }).addStyleClass("sapUiTinyMarginEnd"),
                                                        new ObjectStatus({
                                                            text: "{status/title}",
                                                            state: {
                                                                path: 'status/statusCriticality',
                                                                formatter: formatStatus
                                                            }
                                                        })]
                                                }).addStyleClass("sapUiTinyMarginBottom"),
                                                new HBox({
                                                    renderType: "Bare",
                                                    wrap: "Wrap",
                                                    items: [
                                                        new Label({ text: "Total by Order", showColon: true }).addStyleClass("sapUiTinyMarginEnd"),
                                                        new Text({
                                                            text: "{totalByOrder} $"
                                                        })
                                                    ]
                                                })
                                            ]
                                        }).addStyleClass("sapUiTinyMargin")
                                })
                            }
                        })],
                    endButton: new Button({
                        text: "{i18n>btnCancel}",
                        tooltip: "{i18n>ttCancel}",
                        type: "Transparent",
                        press: () => this.dialogOfOrders.close()
                    })
                });

            if (!this.dialogOfOrders) {
                this.dialogOfOrders = createDialog();

                this.getEditFlow().getView().addDependent(this.dialogOfOrders);
            }
            this.dialogOfOrders.open();
        }
    };
});
