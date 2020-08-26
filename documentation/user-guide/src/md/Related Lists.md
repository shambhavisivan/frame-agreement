# Related Lists 

Related lists can be added to FAM via JSON data “FA-Related-Lists“. Once defined, they will appear above the FA header as a tab.

Data record should have these properties:

- name: FA-Related-Lists
- value: - array of JSON entries with the following properties: 
    - label - title of related group table
    - object - API name of object from which records will be presented
    - fa_lookup - API name of the field on the above object which points to FA
    - columns - CSV of fields to be presented on the UI from the object above

Example:

```json
[
  {
    "label": "Child FA",
    "object": "csconta__Frame_Agreement__c",
    "fa_lookup": "csconta__master_frame_agreement__c",
    "columns": "Id, csconta__Agreement_Name__c"
  },
  {
    "label": "Pricing Rule Group",
    "object": "cspmb__Pricing_Rule_Group__c",
    "fa_lookup": "csconta__frame_agreement__c",
    "columns": "Id, cspmb__always_applied__c, cspmb__description__c"
  }
]
```