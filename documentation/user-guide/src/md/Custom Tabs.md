# Custom Tabs

Additional tabs can be added to FAM Editor (alongside Products). This can be achieved in two steps:

## Add information in JSON Data

Create a JSON Data record "FA-Custom-Tabs". The value must be an array of objects, each representing one custom tab.

- label - Name of custom tab
- container_id  - Id property of tab container element
- onEnter - event to be triggered upon enetering the tab
Example JSON Data:

```javascript
[
  {
    "label": "Custom Tab #1",
    "container_id": "customtab1",
    "onEnter": "customTabEnter1"
  },
  {
    "label": "Custom Tab #2",
    "container_id": "customtab2",
    "onEnter": "customTabEnter2"
  }
]
```

Note that the onEnter handler defined in this setting must be registered using the FAM.registerMethod function.

Example:

```javascript
window.FAM.registerMethod('customTabEnter1', id => {
	return new Promise(async resolve => {
		// ****************************
		console.log('Entered tab with id:' + id);
		renderUIforCustomTab(id);
		// ****************************
		resolve();
	});
});	
```

## Register plugin and resource

Create a new JSON Setting in csutil__Json_Settings__c.

- name - CustomResource/FAMeditor/{any}
- JSON Configuration - {"type":"js", "path":""name_of_static_resource"}

The custom tab should appear next to the "Products" tab.

Note that it is sometimes necessary to Hard Reload the app in order to load the changed custom static resource.