# Showing custom Frame Agreement fields

Custom fields can be shown on the Frame Agreement page. Fields can be set up to be read-only or editable. Currently supported types for editing are: 

- date
- Boolean
- number
- text
- url
- textarea
- lookup
- picklist

In order to define which fields are shown, create one record in the JSON Data object with the following details:

- name = FA-Header
- value = array of JSON entities with the following properties:
- field - API field name on the Frame Agreement object
- readOnly - true or false
- label - any custom label
- urlLabel - (url field only) label string to be displayed as link text 
- type - one of the types mentioned above
- grid - number of rows the field should take (e.g. the text area might require multiple rows)
- visible - logic to determine if field is shown on UI. Multiple conditions can be evaluated with the use of && (AND) and || (OR) operators.
- lookupData - used only for lookup type. Contains property "columns" which holds array of presented fields when operating with a lookup. Second property is "whereClause" which is used to filter the lookup data.

"visible" examples

```javascript
...(no visible property) // Visible 
"visible": "false",... //Not visible
"visible": "",... //Not visible
"visible": 'Arb_Field_Bool__c == true', // Visible if given checkbox is true
"visible": 'Arb_Field_Text__c != hide', // Visible if given input doesn't have specific value
"visible": 'Arb_Field_Text__c != hide && Arb_Field_Bool__c==true', // Visible if both conditions are true
```


JSON Data Example: 

```javascript
[
  {
    "field": "csconta__Agreement_Name__c",
    "readOnly": false,
    "label": "Agreement Name",
    "type": "text",
    "grid": 2
  },
  {
    "field": "Arb_Field_Bool__c",
    "readOnly": false,
    "label": "Arb Field Bool",
    "type": "boolean",
    "grid": 1
  },
  {
    "field": "csfam__Arb_Field_Integer__c",
    "readOnly": false,
    "label": "Arb Field Integer",
    "type": "number",
    "grid": 2
  },
  {
    "field": "csfam__arb_url_field__c",
    "readOnly": true,
    "label": "Arb URL",
    "urlLabel": "Salesforce Lightning Icons",
    "type": "url",
    "grid": 2
  },
  {
    "field": "Arb_Field_Text__c",
    "readOnly": false,
    "label": "Arb Field Text",
    "type": "text",
    "grid": 2
  },
  {
    "field": "Arb_Field_Date__c",
    "readOnly": false,
    "label": "Arb Field Date",
    "type": "date",
    "grid": 2
  },
  {
    "field": "Arb_Field_Text_2__c",
    "readOnly": false,
    "label": "Arb Field Text 2",
    "type": "text",
    "grid": 2
  },
  {
    "field": "Arb_Field_Text_3__c",
    "readOnly": false,
    "label": "Arb Field Text 3",
    "type": "text",
    "grid": 2,
    "visible": "csfam__Arb_Field_Text__c==hide",
    
  },
  {
    "field": "Arb_Field_Textarea__c",
    "readOnly": false,
    "label": "Arb Field Textarea",
    "type": "textarea",
    "grid": 4
  },
  {
    field: 'csconta__Account__c',
    readOnly: false,
    label: 'Account',
    type: 'lookup',
    grid: 4,
    lookupData: {
      columns: [
        'Name',
        'Type'
      ],
      whereClause: "name != 'invalidTest'"
    }
  }
]
```