sap.ui.define([
	"jquery.sap.global",
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel"
], function(jQuery, Controller, JSONModel) {
	"use strict";
	return Controller.extend("mcap.controller.Detail", {
		onInit: function() {
			this.getRouter().attachRouteMatched(this._handleRouteChanged.bind(this));
		},
		_itemDetail: null,
		_handleRouteChanged: function(oEvent) {
			var oView = this.oView,
				oModel = this.oView.getModel(),
				oData = oModel.getData(),
				sProductId = oEvent.getParameter("arguments")["detail-item"];
				
			this._itemDetail = sProductId;
	
			/*Uncaught (in promise) TypeError: Cannot read property 'filter' of undefined	=S */
			var	oItemData = oData["ProductCollection"].filter(function(oCurItem) {
					return oCurItem.ProductId === sProductId;
				})[0]; 

			if (oItemData) {
				oView.setModel(new JSONModel(oItemData),
					"detail");
			}
		},
		getRouter: function() {
			return sap.ui.core.UIComponent.getRouterFor(this);
		},
		toggleFooter: function(oEvent) {
			var oObjectPageLayout = this.getView().byId("ObjectPageLayout");
			oObjectPageLayout.setShowFooter(!oObjectPageLayout.getShowFooter());
		},
		handlePress: function(oEvent) {
			/*this.getRouter().navTo("detailDetailName", {
				"detaildetail-item": "item - inner1 ",
				"detail-item": "item1"
			});*/
			var sId = oEvent.getParameter("id"),
				oSelectedItem = sap.ui.getCore().byId(sId),
				// It's important to point that we're getting the second model, not the default one
				oModel = oSelectedItem.getModel("detailDetail"),
				sPath = oSelectedItem.getBindingContextPath(),
				oData = oModel.getProperty(sPath);
			this.getRouter().navTo("detailDetailName", {
				"detaildetail-item": oData.ProductId,
				"detail-item": this._itemDetail
			});

		}
	});
});