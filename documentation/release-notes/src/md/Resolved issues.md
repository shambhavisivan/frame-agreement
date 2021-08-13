# Resolved issues

## T-55147: Lookup field in community redirects to standard Salesforce

The org URL is fetched along with a path prefix for the partner community and then the redirection is done in a new tab.

## T-56147: ‘Approved’ status and ‘Requires Approval’ status issues

The approved negotiated value(s) and the current negotiated value(s) are checked to prevent the status from being switched back.

## T-55886: Effective End Date on Revision FA is set to Today's Date

The Effective End Date on the Original FA (which is to be replaced by the new FA) is updated to Today's Date only when the new FA version created from that original FA is activated. Until then, the date as entered by the user is retained.

## T-55869 - BUG-05556: Negotiated values get reflected on the Frame Agreement when Frame Agreement was not saved

When the user clicks the Back button without saving the changes and then provides the confirmation in the alert pop up, the Framework Agreement changes will be reset.

## T-52715: Standalone Add-Ons fields

FAM now supports case insensitivity for custom field names that were configured in the FAC Settings. I.e., the custom field names in the FAC Settings can be entered in any random case (all upper case or all lower case or a combination of both).

## T-52717: Screen not refreshed after updateFrameAgreement

Date fields updated via FAM API will now be reflected in the UI.

## T-55619: Clicking the Activate button multiple times will create multiple pricing rule groups and related records

All buttons and fields will be disabled when any backend process is still running in the background (such as saving an agreement, activating an agreement etc.).

## T-56547: Additional advanced pricing scenarios

When adding One-off and Recurring price adjustments through PLM, the prices that were set up in PLM will be fetched and then displayed in FA for each CP.

## BUG-07241: The ‘Display columns’ field on Master Frame Agreement shows empty fields

‘Display columns’ is hidden when there are no field(s) to display.

## T-55169 - BUG-07108: Application fails to handle the InActive/Expired products on load

Alternative commercial product(s) will be fetched for the InActive/Expired commercial product(s) by FAM.

## BUG-07252: ‘Agreement Name’ on the Master frame agreement is checked when searching frame agreements

‘Agreement Name’ on the Master frame agreement will remain unchecked when the search term entered by the user returns no results.

## T-53361: Custom Button - Visible property and criteria issue

The visible property criteria of a field/button configured in JSON Data is evaluated completely and will be displayed/hidden in the UI.

## T-58455: FAM incorrect entity used for standard pricebook configuration

Advanced Charges will be fetched based on the pricing rule group Id (PRG.Id) instead of the pricing rule - pricing rule group association Id configured in the FA-StandardPricebook.

## BUG-07781: Rate card with the same start and end date is displayed

For any commercial products the rate cards having the same start and end date will be filtered out.

## BUG-07812: Unable to deselected the lookup option

In the lookup modal, the selected option can be deselected by clicking the same option again. In the lookup field, the selected option can be cleared by clicking the clear icon. When the lookup modal is closed, the filtered result set will be reset back to the initial data set.

## BUG-07937: Page crashed when Advanced charges are negotiated and then std price book is removed

When the pricing rule group Id is removed from the FA-StandardPricebook, the legacy charges will be displayed.

## BUG-07997: Page crashes when filtering the child FA

The child Frame Agreement name filtering now works as expected. The pagination will be reset back to page one when the filtering is based on a search keyword.