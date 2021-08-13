# Installation and Setup

>**Note**: Package installation and upgrade should be performed by a user with the ‘System Administrator’ profile. Users with other profiles may not have the privileges required for the installation process; this can result in unexpected outcomes.

## Installation Dependencies

FAM requires the installation of the following packages before it can be installed:

- Configurator
- ObjectGraph
- Product and Pricing Data Model
- Utilities
- CRM Extensions
- Contracts Object Model
- Advanced Pricing Integration
- Product Lifecycle Management

## Custom Settings

Frame Agreement Console settings (FAC settings) control the behaviour of the application.

| Field Label | Api Name |  Data Type |  Description | Example |
| - | - | - | - | - |
|Account Fields	|csfam__account_fields__c |Text |Additional fields to be shown in account table while associating them with Frame Agreement |Name,csfam__Active__c,Type|
| Active Status	|csfam__active_status__c| Text |Used to define which Frame Agreement status value is used for activating Frame Agreement| Active|
|Approval Process Name|	csfam__approval_process_name__c |Text|	Name of the approval process which will be invoked as a result of the negotiation |FA Approval|
|Approved Status |csfam__approved_status__c| Text| Once Frame Agreement is approved we will change the status to this value |Approved|
|Approvers revise |csfam__approvers_revise__c |Checkbox| Allow approver to edit FA while in "Pending" state. |true|
|Closed Status| csfam__closed_status__c |Text| Status of Frame Agreement once it becomes closed replaced. E.g. when a new version is activated. | Closed Replaced|
|Decomposition Chunk Size | csfam__decomposition_chunk_size__c| Number| Number of items we will process on decomposition in one remote action. Used to tweak performance in case of issues with Salesforce limits.| 1000|
|Discount As Price |csfam__discount_as_price__c |Checkbox| If selected, negotiated discount will be shown as new price instead of price difference.| true|
|Draft Status| csfam__draft_status__c |Text |Used to define which status will be used in Draft state| Draft|
|FA Editable Statuses |csfam__fa_editable_statuses__c| Text| CSV list of statuses in which editing and negotiation can happen |Draft, Requires Approval|
|FA Number Prefix |csfam__fa_number_prefix__c| Text| Prefix that is going to be assigned to Frame Agreement Number| FA_|
|Frame Agreement Fields	|csfam__frame_agreement_fields__c| Text| Additional Frame Agreement fields to show in FAM|csconta__agreement_level__c, csconta__Valid_From__c|
|Price Item Fields |csfam__price_item_fields__c |Text |Populate if additional fields should be displayed in Commercial Product lists [^1]| cspmb__description__c,cspmb__recurring_cost__c|
Negotiate min/max restriction | csfam__input_minmax_restriction__c | Checkbox | When true prevents user to input value less than 0 and greater than charges original value. | true
|Product Chunk Size| csfam__product_chunk_size__c| Number| Size of products to be loaded in one remote action.| 100|
|RCL Fields |csfam__rcl_fields__c |Text| Additional Rate Card Line fields used for filtering. description__c|
|Requires Approval Status| csfam__requires_approval_status__c |Text| Used to define which Frame Agreement status will be used when approval is required	|Requires Approval|
|Show New Frame Agreement |csfam__new_frame_agreement__c |Checkbox |Toggle visibility of "New Frame Agreement" button |true|
|Show Volume Fields| csfam__show_volume_fields__c |Checkbox |If selected, additional volume and usage fields will be shown for each Commercial Product	|true|
|Volume Fields Visibility |csfam__volume_fields_visibility__c| Text| Additional fields to be shown in account table while associating them with Frame Agreement. On the condition that csfam__show_volume_fields__c is set to true: here you can list volume fields you want to show. Fields are represented with abbreviation (mv,mvp,muc,mucp)|	mv,mvp|
|Standalone Addon Fields |csfam__standalone_addon_fields__c |Text |Populate if additional fields should be displayed in Standalone Addon lists [^1]| cspmb__description__c,cspmb__recurring_cost__c|
|Truncate CP Fields |csfam__truncate_product_fields__c |Checkbox |Used to create a nicer UI by truncating long values in custom fields |true|
|Usage Type Fields| csfam__usage_type_fields__c| Text Area| Additional Usage type fields.| cspmb__unit_of_measure__c|
|Active Status Management |csfam__active_status_management__c |Checkbox| On threshold breach while negotiating: FAM will automatically change status of FA to requires_approval_status__c. If all charges are within the threshold limits, it will return it back to draft_status__c.|
|Security Certificate Name|csfam__certificate_name__c|Text Area| The name of the self-signed certificate configured in Salesforce | CS_PRE_Security
|Dispatcher Service Url|csfam__dispatcher_service_url__c| Text Area | The URL of the Dispatcher Service to which the org has obtained access | https://cs-messaging-dispatcher-eu-dev.herokuapp.com
|Enable Pricing Service	| csfam__is_ps_enabled__c |Checkbox |This is reserved for future use so please do not enable it.	|false|

>**Note**: \

>- _Enable Pricing Service_ is reserved for future use so `please do not enable it`.
>- For _Price Item Fields_ and _Standalone Addon Fields_, by default _Name_ will be displayed. Therefore it is not required to configure the _Name_ field under _Price Item Fields_ and _Standalone Addon Fields_.

### Frame Agreement custom button

In order to open Framework Agreement Management, it is suggested to add a custom button on the Account. In order to do this, navigate to **Setup - Customize - Account - Buttons Links and Actions** and add a New Button or Link (to show it in Lightning, create a Detail Page Button with the URL and add it to the layout) type Detail Page Button which will execute JavaScript with the OnClick JavaScript content source.

Code to be executed:

`window.open("apex/csfam__FAMEditor?account={!Account.Id}","_blank");`

## JSON Data (object csutil__JSON_Data__c) setup

Framework Agreement Management uses JSON Data to configure application behaviour. There are five JSON data records which can be configured. The correct setup is defined in linked sections:

- FA-Initial-Categorization - FAM - Product Initial Categorization
- FA-Categorization - FAM - Product Categorization
- FA-Custom Buttons - FAM - Custom Buttons
- FA-Header - FAM - Showing custom Frame Agreement fields
- FA-Standard-Buttons - FAM - Controlling standard button visibility
- FA-StandardPricebook - FAM - Defining standard pricebook
- FA-Addon-Categorization - FAM - Product Categorization

Please ensure that at least empty arrays are added to JSON Data even if you do not want to customize it.

[^1]: These fields will be conjoined with standard fields (Id, Name...) and categorization fields (fields defined in "FA-Addon-Categorization" JSON Data for Standalone Add-Ons).