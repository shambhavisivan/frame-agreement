# Controlling standard button visibility

It is possible to define the states in which certain custom buttons are available. This can be done by creating one record in the JSON Data object with the following details:
- name = FA-Standard-Buttons
- value - JSON with the following format:
  `{"key" :  [ array of statuses] }`
  where key is the name of the standard button and the value is a list of allowed statuses

The value also support expressions if visibility is dependent on FA field.

`{"key" : "expression" }`

(For an example, see "FAM - Showing custom Frame Agreement fields" - "Visible examples")

Available standard buttons are:

- Save
- SubmitForApproval
- Submit
- DeleteProducts
- DeleteAddons
- BulkNegotiate
- BulkNegotiateAddons
- AddProducts
- AddAddons
- NewVersion
- Delta

Example:
```json
{
  "Save": [
    "Draft",
    "Requires Approval"
  ],
  "SubmitForApproval": [
    "Requires Approval"
  ],
  "Submit": [
    "Draft",
    "Approved"
  ],
  "DeleteProducts": [
    "Draft",
    "Requires Approval"
  ],
  "DeleteAddons": [
    "Draft",
    "Requires Approval"
  ],
  "BulkNegotiateAddons": [
    "Draft",
    "Requires Approval"
  ],
  "BulkNegotiate": "show_bulk_boolean__c == true && csconta__Status__c != Active",
  "AddProducts": [
    "Draft",
    "Requires Approval"
  ],
  "AddAddons": [
    "Draft",
    "Requires Approval"
  ],
  "NewVersion": [
    "Active"
  ],
  "Delta": [
    "*"
  ]
}
```