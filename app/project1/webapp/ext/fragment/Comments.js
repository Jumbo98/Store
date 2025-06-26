sap.ui.define([
    "sap/m/MessageToast",
    "sap/ui/unified/FileUploader",
], function (MessageToast, FileUploader) {
    'use strict';

    return {    
        onAddImage: async function () {
            if (!this.oDialog) {
                this.oDialog = await this.loadFragment({
                    name:"project1.ext.fragment.ImageUploaderDialog"
                });
                    
                this.getEditFlow().getView().addDependent(this.oDialog);

            }
                this.oDialog.open();
        },

        onUploadImage: function () {
            const oDialog = this.oDialog;
            const oFileUploader = oDialog.getContent()[0];
            const aFiles = oFileUploader.getInputReference().files;
            if (!aFiles || aFiles.length === 0) {
                MessageToast.show("Выберите файл");
                return;
            }
            const oFile = aFiles[0];
            const that = this;
            const reader = new FileReader();
            reader.onload = function (e) {
                const base64String = btoa(
                    new Uint8Array(e.target.result)
                        .reduce((data, byte) => data + String.fromCharCode(byte), '')
                );
                const oModel = that.getEditFlow().getView().getModel();
                that.getEditFlow().invokeAction(
                    "/uploadImage",
                    {
                        model: oModel,
                        parameterValues: [
                            {name: 'fileName', value: oFile.name},
                            {name: 'mimeType', value: oFile.type},
                            {name: 'data', value: base64String},
                        ],
                        skipParameterDialog: true
                    }
                ).then(function (oResponse) {
                    const sUrl = oResponse.getObject('value');
                    const oRTE = that.byId("rteComment");
                    let sHtml = oRTE.getValue();

                    sHtml += `<img src="${sUrl}" style="max-width:100%"/>`;
                    oRTE.setValue(sHtml);

                    MessageToast.show("Картинка добавлена");

                    oDialog.close();
                }).catch(function (e) {
                    MessageToast.show("Ошибка загрузки: " + (e && e.message ? e.message : e));
                });
            };
            reader.readAsArrayBuffer(oFile);
        },

        onUploadCancel: function () {
            this.byId("uploadDialog").close();
        },

        onUploadDialogClose: function () {
            const oFileUploader = this.byId("fileUploader");
            if (oFileUploader) {
                oFileUploader.clear();
            }
        },

        onSaveComment: function () {
            const oRTE = this.byId("rteComment");
            const sHtml = oRTE.getValue();
            const productID = this.getBindingContext().getProperty('ID');
            const oModel = this.getEditFlow().getView().getModel();
            const oBinding = oModel.bindList("/CommentsView"); 
            const oCreatedContext = oBinding.create({
                product_ID: productID,
                content: sHtml
            });

            oCreatedContext.created().then(function () {
                MessageToast.show("Комментарий сохранен");
                oRTE.setValue("");
            }).catch(function (e) {
                MessageToast.show("Ошибка: " + (e && e.message ? e.message : e));
            });
        }
    };
});
