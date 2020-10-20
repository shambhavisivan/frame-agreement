# New features

## T-50531: Standalone Add-on negotiation

Users can now add Add-ons directly into frame agreements through the new FAM tab. 
PIPRA records will be created for linked Add-Ons upon Frame Agreement activation.

## T-51248: Expose updateFrameAgreement, add onBeforeCreateFrameAgreement event

The *onBeforeCreateFrameAgreement* event allows the user to alter values with which frame agreement is created.
A new API method *updateFrameAgreement* can be used to update frame agreements fields locally (Save action is needed afterwards).

## T-45623: Enforce locale decimal separator in non-input number components

FAM will try to respect the user's locale while rendering inputs and number values. 
More information is available in the Localization section of the User Guide.

## T-50530: Sequencing of Dynamic Groups - FWAC-72

Dynamic groups sequence can now be populated at the time of creation.

## T-50303: Ability to expose FAMeditor VF page in Communities

## T-51338: Expose createNewVersionOfFrameAgreement

## T-51428: Using Frame Agreement with Pricing Service

## T-52719 FAM loading fails due to Commercial Product volumes

Introduced a custom filter via json data "FA-Initial-Categorization", to filter Commercial Products,
the value is similar to the Product Configuration, but here the filtering of CPs happens when the app is loaded.

For example, If the json has a filter for "cspmb__role__c" field with value "Master", in the add products dialog only CPs of role "Master" will only be loaded. Supported field types are String, picklist and one field at a time, if there are multiple filter fields, app will use only the last filter field configuration by default.