# New features

## T-52719 FAM loading fails due to Commercial Product volumes

Introduced a custom filter via json data "FA-Initial-Categorization", to filter Commercial Products. The value is similar to the Product Configuration filter, but here the filtering of CPs happens when the app is loaded.

For example, If the json has a filter for "cspmb__role__c" field with a value equal to "Master", in the "Add Products" dialog only CPs of role "Master" will be loaded. Supported field types are String, picklist and one field at a time; if there are multiple filter fields then the app will use only the last filter field configuration by default.

## T-53241: Enable Bulk Negotiation for legacy pricing.

Products that are modelled using the 'legacy pricing' approach can now be negotiated in bulk. The user navigates to the 'Negotiation' screen, selects 1-n charges to which a discount should be applied, sets the discount and clicks "Apply Discount".
