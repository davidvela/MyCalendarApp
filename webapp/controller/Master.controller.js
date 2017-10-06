sap.ui.define([
	"jquery.sap.global",
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel"
], function(jQuery, Controller, JSONModel) {
	"use strict";
	return Controller.extend("mcap.controller.Master", {
		onInit: function() {
			this.aKeys = ["Name", "Category", "SupplierName"];
			this.oSelectName = this.getSelect("slName");
			this.oSelectCategory = this.getSelect("slCategory");
			this.oSelectSupplierName =
				this.getSelect("slSupplierName");
		},
		onExit: function() {
			this.aKeys = [];
			this.aFilters = [];
		},
		onAdd: function(){
				
		},
		onSelectChange: function() {
			var aCurrentFilterValues = [];
			aCurrentFilterValues.push(this.getSelectedItemText(this.oSelectName));
			aCurrentFilterValues.push(this.getSelectedItemText(this.oSelectCategory));
			aCurrentFilterValues.push(this.getSelectedItemText(this.oSelectSupplierName));
			this.filterTable(aCurrentFilterValues);
		},
		filterTable: function(aCurrentFilterValues) {
			this.getTableItems().filter(this.getFilters(aCurrentFilterValues));
			this.updateFilterCriterias(this.getFilterCriteria(aCurrentFilterValues));
		},
		getModel: function() {
			var oView = this.getView(),
				oModel = oView.getModel();
			return oModel;
		},
		updateFilterCriterias: function(aFilterCriterias) {
			var oModel;
			if (aFilterCriterias.length > 0) {
				/* We can`t use a single label and change only the model data, */
				oModel = this.getModel();
				this.removeSnappedLabel();
				/* because in case of label with an empty text, */
				this.addSnappedLabel();
				/* a space for the snapped content will be allocated and can lead to title misalignment */
				oModel.setProperty("/Filter/text",
					this.getFormattedSummaryText(aFilterCriterias));
			} else {
				this.removeSnappedLabel();
			}
		},
		addSnappedLabel: function() {
			this.getPageTitle().addSnappedContent(this.getSnappedLabel());
		},
		removeSnappedLabel: function() {
			this.getPageTitle().destroySnappedContent();
		},
		getFilters: function(aCurrentFilterValues) {
			this.aFilters = [];
			this.aFilters = this.aKeys.map(function(sCriteria, i) {
				return new sap.ui.model.Filter(sCriteria,
					sap.ui.model.FilterOperator.Contains, aCurrentFilterValues[i]);
			});
			return this.aFilters;
		},
		getFilterCriteria: function(aCurrentFilterValues) {
			return this.aKeys.filter(function(el, i) {
				if (aCurrentFilterValues[i] !== "") {
					return el;
				}
			});
		},
		getFormattedSummaryText: function(aFilterCriterias) {
			return "Filtered by: " + aFilterCriterias.join(", ");
		},
		getTable: function() {
			return this.getView().byId("idProductsTable");
		},
		getTableItems: function() {
			return this.getTable().getBinding("items");
		},
		getSelect: function(sId) {
			return this.getView().byId(sId);
		},
		getSelectedItemText: function(oSelect) {
			return oSelect.getSelectedItem() ?
				oSelect.getSelectedItem().getKey() : "";
		},
		getPage: function() {
			return this.getView().byId("dynamicPageId");
		},
		getPageTitle: function() {
			return this.getPage().getTitle();
		},
		getSnappedLabel: function() {
			return new sap.m.Label({
				text: "{/Filter/text}"
			});
		},
		onToggleFooter: function() {
			this.getPage().setShowFooter(!this.getPage().getShowFooter());
		},
		// routing!
		handleItemPress: function(oEvent) {
			return;
			var sId = oEvent.getParameter("id"),
				oSelectedItem = sap.ui.getCore().byId(sId),
				oModel = oSelectedItem.getModel(),
				sPath = oSelectedItem.getBindingContextPath(),
				oData = oModel.getProperty(sPath);
			this.getRouter().navTo("detailName", {
				"detail-item": oData.ProductId
			});
		},
		getRouter: function() {
			return sap.ui.core.UIComponent.getRouterFor(this);
		}
	});
});