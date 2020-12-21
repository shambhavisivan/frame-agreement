# Product Categorization

Custom categories can be created for the Product explore section. This can be used to query a subset of commercial products and add them to a Frame Agreement. In order to set up custom categories, please create one JSON Data record with the following details:

- name = FA-Categorization
- value - array of JSON entries with the following properties: 
    - name - text shown in the category explore
    - field - API field name (e.g. categorization__c) - this needs to be a field on the Commercial Product record. Supported types are Text and Picklist. 
    - values - Array of values 

In order to apply categorisation, please click the Product Categorization icon, which will expand the available categories for selection: 

![]({{images}}/ProdCat1.png)

Example: 
```javascript
[
  {
    "name": "Alpha",
    "field": "Categorization_Alpha__c",
    "values": [
      "Fixed",
      "Mobile",
      "Static"
    ]
  },
  {
    "name": "Beta",
    "field": "Categorization_Beta__c",
    "values": [
      "10GB",
      "20GB",
      "50GB",
      "100GB"
    ]
  }
]
```

# Product Initial Categorization

Used to custom filter Commercial Products through this json configuration.

- name = FA-Initial-Categorization
- value - array of JSON entries with the following properties:
    - name - text shown in the category explore
    - field - API field name (e.g. categorization__c) - this needs to be a field on the Commercial Product record. Supported types are Text and Picklist.
    - values - Array of values

Example:
```javascript
[
  {
    "name": "Alpha",
    "field": "Categorization_Alpha__c",
    "values": [
      "Fixed",
      "Mobile",
      "Static"
    ]
  },
  {
    "name": "Beta",
    "field": "Categorization_Beta__c",
    "values": [
      "10GB",
      "20GB",
      "50GB",
      "100GB"
    ]
  }
]
```