# Overview

Frame Agreement Console is a Single Page Application used to manage Frame Agreements. It is opened in the context of a Salesforce Account and will list all associated Frame Agreements and allow creating new ones.

## Selecting a Frame Agreement

Frame Agreement negotiation starts with the following page:

![]({{images}}/Overview_1_FA_List.png)

#### Key features available here are:

- Clicking on Add new Agreement opens a dropdown from which the user can choose a type of Frame Agreement to create
- All created Frame Agreements are linked in the list with corresponding statuses listed next to them
- Searching for Frame Agreements is possible using the quick search box
- Clicking on any Frame Agreement will open the Negotiation part of Frame Agreement Console
- Clicking on the three dots will open a menu which enables Clone, Delete and Editing account associations

## Frame Agreement Negotiation

Once Frame Agreement is created or an existing one is selected, the following is available in the Frame Agreement Negotiation section:

![]({{images}}/Overview_2_FA_Cp_List.png)

#### Key features available here:

- Standard and custom buttons are located in the top right corner. Custom buttons will be in a dropdown menu in case there is a large number of them
- The Back to Frame Agreement list button is located in the top left corner
- The Frame Agreement header section is located under the header row. This allows users to see custom fields from Frame Agreement and edit those marked as editable
- The Products section displays the products added to Frame Agreement
- The Display Columns selection is used to select visible columns if multiple custom fields are added to Commercial Products
- Quick Search is used to search the list of added Commercial Products
- Clicking on any Commercial Product opens the section to negotiate Commercial Products, Add-Ons or Rates
- The footer contains standard buttons to Add Products, Delete Products or do Bulk Negotiation
- Only selected products will be deleted

## Adding Products to Frame Agreement

Clicking on Add Products will open the following page:

![]({{images}}/Overview_3_Cp_List.png)

![]({{images}}/Overview_4_Cp_Categorization.png)

#### Key features:

- Ability to apply one or more Categorizations to constrain the list of available products
- Select one or more products and add them to Frame Agreement
- Quick Search allows searching for specific products

## Adding Standalone Add-Ons to Frame Agreement

In addition to adding products to Frame Agreements, Add-Ons can also be added to a Frame Agreement on a standalone basis. To do so, navigate to the "Standalone Addons" tab and then click the "+ Add Add-Ons" button.

![]({{images}}/Overview_8_Addon_List.png)

#### Key features:

- Ability to apply one or more Categorizations to constrain the list of available addons
- Select one or more add-ons and add them to Frame Agreement
- Quick Search allows searching for specific add-ons

## Negotiating Values

Once a Commercial Product is selected, the following is used to drive negotiation:

![]({{images}}/Overview_5_FA_CpAddon_Negotiation.png)

#### Key features available here:

- Ability to negotiate Add-Ons, Charges and Rates
- Negotiation will be either manual entry (clicking on a number to edit it), or a preconfigured list of values if Discount Levels are used
- Negotiating more than Discount Thresholds allow will display so on the screen in red
- Product row and Frame Agreement header will be marked in red as well if there are approvals required.

## Bulk Negotiation

In order to open Bulk Negotiation, select one or more products in the list. This allows users to perform actions against all selected products:

![]({{images}}/Overview_6_Bulk_Negotaition.png)

#### Key features:

- Ability to select all Add-Ons, Charges or Rates, or only the shared ones among selected products
- Ability to apply bulk discounts to items - either as a percentage or a fixed amount
- Ability to apply bulk discounts for products with legacy pricing.

## Approving Frame Agreement

Once Frame Agreement is in Approval, it is possible to approve it directly from this application.

![]({{images}}/Overview_7_Approval.png)

#### Key features:

- Shows the full list of approval history
- Ability to Approve, Reject and Recall