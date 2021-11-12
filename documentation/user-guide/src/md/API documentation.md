# API documentation

FAM exposes an API that can be used to invoke actions and subscribe to events. These functionalities are accessible through the global object `window.FAM`.

Breakdown of the FAM object:

|window.FAM.___ | Description|
| - | - |
|api | Contains API functions|
|eventList |List of events you can subscribe to|
|registerMethod |Function used for registering actions that will be bound to custom buttons|
|subscribe| Function used for subscribing to events (from eventList)|
|publish| Function used for publishing events (from eventList)|

## API

Every API function is a promise, with the single exception of `window.FAM.api.toast()`.

### activateFrameAgreement

**Parameters:** `[ Id <String> faId]` \
**Resolves:** `[ void ]` \
**Description:** (Promise) Starts activation process on a given Frame Agreement. \
**Example:**
```javascript
window.FAM.api.activateFrameAgreement("a1u4J000000Y8iGQAS").then(result => {}, reject => {});
```

### cloneFrameAgreement

**Parameters:** `[ Id <String> faId ]` \
**Resolves:** `[ Object cloned_frame_agreement]` \
**Description:** (Promise) Clones a given Frame Agreement \
**Example:**
```javascript
window.FAM.api.cloneFrameAgreement("a1u4J000000Y8iGQAS").then(result => {}, reject => {});
```

### createNewVersionOfFrameAgreement

**Parameters:** `[ Id <String> faId ]` \
**Resolves:** `[ Object frame agreement]` \
**Description:** (Promise) Creates new version of a given FA, returns a new FA. FAM will not redirect to the new FA upon calling this API. \
**Example:**
```javascript
window.FAM.api.createNewVersionOfFrameAgreement("a1u4J000000Y8iGQAS").then(result => {}, reject => {});
```


### getActiveFrameAgreement

**Available:** With selected Frame Agreement \
**Parameters:** `[ void ]` \
**Resolves:** `[ Object active_frame_agreement ]` \
**Description:** (Promise) Return selected Frame Agreement \
**Example:**
```javascript
let _activeFa = await window.FAM.api.getActiveFrameAgreement();
```


### saveFrameAgreement

**Parameters:** `[ Id <String> faId ]` \
**Resolves:** `[ String action_message]` \
**Description:** (Promise) Saves a given Frame Agreement \
**Example:**
```javascript
window.FAM.api.saveFrameAgreement("a1u4J000000Y8iGQAS").then(result => {}, reject => {});
```


### setStatusOfFrameAgreement

**Parameters:** `[ Id <String> faId, String new_state ]` \
**Resolves:** `[ String result ]` \
**Description:** (Promise) Refreshes a given Frame Agreement. Resolves with "Success" or rejects with an error message. \
**Example:**
```javascript
window.FAM.api.setStatusOfFrameAgreement("a1u4J000000Y8iGQAS", "Active").then(result => {}, reject => {});
```


### validateStatusConsistency

**Parameters:** `[ Id <String> faId ]` \
**Resolves:** `[ void ]` \
**Description:** (Promise) If active status management is turned on, this will set the frame agreement to its true status. \
This is useful when altering an attachment from a third party. \

**Example:**
```javascript
window.FAM.api.validateStatusConsistency("a1u4J000000Y8iGQAS").then(result => {}, reject => {});
```

### updateFrameAgreement

**Parameters:** `[ Id faId, String field_name, Any value]` \
**Resolves:** `[ void ]`<br>
**Description:** (Promise) Updates field_name with a new value on a given FA. Does not call Save action afterwards. \
**Example:**
```javascript
window.FAM.api.updateFrameAgreement("a1u4J000000Y8iGQAS", "csconta__Valid_From__c", new Date().getTime()).then(result => {}, reject => {});
window.FAM.api.updateFrameAgreement("a1u4J000000Y8iGQAS", "csconta__Status__c", "Draft").then(result => {}, reject => {});
```

### submitForApproval

**Parameters:** `[ Id <String> faId ]` \
**Resolves:** `[ Boolean result ]` \
**Description:** (Promise) Submits a given Frame Agreement for approval. Resolves with true or rejects with false. \
**Example:**
```javascript
window.FAM.api.submitForApproval("a1u4J000000Y8iGQAS").then(result => {}, reject => {});
```

### isAgreementEditable

**Parameters:** `[ Id <String> faId ]` \
**Resolves:** `[ Boolean is_fa_editable]` \
**Description:** Returns true if given FA is editable \
**Example:**
```javascript
// Not a promise!
var isFaEditable = window.FAM.api.isAgreementEditable("a1u4J000000Y8iGQAS");
if  (isFaEditable) {
    ...
}
```


### addProducts

**Parameters:** `[ Id <String> faId, Array <String> commercial_product_id_list ]` \
**Resolves:** `[ Object active_frame_agreement ]`<br>
**Description:** (Promise) Adds a list of commercial products to a given Frame Agreement. \
**Example:**
```javascript
window.FAM.api.addProducts("a1u4J000000Y8iGQAS", ["a1F1t0000001AAA", "a1F1t0000001BBB", "a1F1t0000001CCC"]).then(result => {}, reject => {});
```

### removeProducts

**Parameters:** `[ Id <String> faId, Array <String> commercial_product_id_list ]` \
**Resolves:** `[ Object active_frame_agreement ]`<br>
**Description:** (Promise) Removes the list of commercial products from a given Frame Agreement. \
**Example:**
```javascript
window.FAM.api.removeProducts("a1u4J000000Y8iGQAS", ["a1F1t0000001AAA", "a1F1t0000001BBB", "a1F1t0000001CCC"]).then(result => {});
```

### getCommercialProducts

**Parameters:** `[ Id <String> faId ] (optional)` \
**Resolves:** `[ List Commercial Products ]` \
**Description:** (Promise) Returns the list of available commercial products. If faId is passed in, it will return a list of added products. \
**Example:**
```javascript
window.FAM.api.getCommercialProducts("a1u4J000000Y8iGQAS").then(result => {});
window.FAM.api.getCommercialProducts().then(result => {});
```

### getAttachment

**Parameters:** `[ Id <String> faId ]` \
**Resolves:** [ Object attachment] \
**Description:** (Promise) Loads the attachment for a given Frame Agreement. \
**Example:**
```javascript
window.FAM.api.resetNegotiation("a1u4J000000Y8iGQAS").then(result => {}, reject => {});
```

### negotiate

**Parameters:** `[ Id <String> faId, Object data ]` \
**Resolves:** `[ Object new_attachment ]` \
**Description:** (Promise) Applies a new negotiated value on a charge. \
A Parameter is an object which contains information about price item, addon/charge/product charge/rate card line Id and the values to be applied. Selected properties should be passed depending on the wanted result.

Data structure (full):


```javascript
{
  priceItemId: String,   //1
  cpAddon: String (Commercial Product Add On Association Id), //2
  charge: String (Pricing Element Id),        //3
  rateCard: String,      //4
  rateCardLine: String,  //5
  value: {               //6
    recurring: Integer,
    oneOff: Integer
  },
  value: Integer         //7
}
```

### Negotiation Product Charges

requires: (#1, #6)

**Example:**

```javascript
let faId = "a1u4J000000Iyh8QAC";
// Negotiating only one charge type
let data_1 = {
    priceItemId: 'a1F1t0000001JCDEA2',
    value: {
        recurring: 26.3
    },
}
window.FAM.api.negotiate(faId, data_1).then(result => {}, reject => {});

// Negotiating both charge types
let data_2 = {
    priceItemId: 'a1F1t0000001JCDEA2',
    value: {
        recurring: 26.3,
        oneOff: 6.75
    },
}
window.FAM.api.negotiate(data_2).then(result => {}, reject => {});
```

### Negotiation Addon

Requires: (#1, #2, #6)

**Example:**

```javascript
let faId = "a1u4J000000Iyh8QAC";
// Negotiating only one charge type
let data_1 = {
    priceItemId: 'a1F1t0000001JCDEA2',
    cpAddon: 'a1A1t0000002cIMEAY',
    value: {
        oneOff: 6.75
    },
}
window.FAM.api.negotiate(faId, data_1).then(result => {}, reject => {});

// Negotiating both charge types
let data_2 = {
    priceItemId: 'a1F1t0000001JCDEA2',
    cpAddon: 'a1A1t0000002cIMEAY',
    value: {
        recurring: 26.3,
        oneOff: 6.75
    },
}
window.FAM.api.negotiate(data_2).then(result => {}, reject => {});
```


### Negotiation Charge

Requires: (#1, #3, #6)

API will prevent you from negotiating a charge type that is not in line with charge.cspmb\_\_pricing\_element\_type\_\_c.

**Example:**
```javascript
let faId = "a1u4J000000Iyh8QAC";
// Negotiating charge with cspmb__pricing_element_type__c === "One-off charge"
let data_1 = {
    priceItemId: 'a1F1t0000001JCDEA2',
    charge: 'a1I1t000001WkzjEAC',
    value: {
        oneOff: 6.75
    },
}
window.FAM.negotiate(data_1).then(result => {}, reject => {});

// Negotiating charge with cspmb__pricing_element_type__c === "Recurring Charge"
let data_2 = {
    priceItemId: 'a1F1t0000001JCDEA2',
    charge: 'a1I1t000001WkzjEAC',
    value: {
        recurring: 26.3,
    },
}
window.FAM.api.negotiate(faId, data_2).then(result => {}, reject => {});
```


### Negotiation Rate card line

Requires: (#1, #4, #5, #7)

**Example:**
```javascript
let faId = "a1u4J000000Iyh8QAC";
// Rate card line has only one value field
let data = {
    priceItemId: 'a1F1t00000017Y0EAI',
    rateCard: 'a1N1t0000001QxrEAE',
    rateCardLine: 'a1M1t000000BFrVEAW',
    value: 122.22,
}
window.FAM.api.negotiate(faId, data).then(result => {}, reject => {});
```

### resetNegotiation

**Parameters:** `[ Id <String> faId ]` \
**Resolves:** `[ void ]`<br>
**Description:** (Promise) Sets all negotiations to the original value. \
**Example:** \
```javascript
window.FAM.api.resetNegotiation("a1u4J000000Y8iGQAS").then(result => {}, reject => {});
```


### refreshFa

**Parameters:** `[ Id <String> faId, <boolean> shouldRefreshAttachment [optional]]` \
**Resolves:** `[ Object active_frame_agreement ]` \
**Description:** (Promise) Refreshes a given Frame Agreement. Refreshes the attachment as well if the second argument is set to true. If the argument is omitted, it defaults to false \
**Example:**<br>
```javascript
window.FAM.api.refreshFa("a1u4J000000Y8iGQAS", true).then(result => {}, reject => {});
```


### setVolumeField (faId, productId, volume)

**Parameters:** `[ <String> faId,<String> productId, <Object> volume_data]` \
**Resolves:** `[ void ]` \
**Description:** (Promise) Updates volume fields for productId on a given Frame Agreement. The volume_data parameter is a map containing shorthand field properties and their new values. \
**Example:** \

``` javascript
// volume_data (full)
{
mv: null // Minimum volume
mvp: null // Minimum volume period
muc: null // Minimum usage commitment
mucp: null // Minimum usage commitment period
}

/*
Method will perform assign operation to products volume so it only updates the fields present in volume_data.
*/

// Update Minimum usage commitment fields
window.FAM.api.setVolumeFields("a1t1t000000A0gOAAS", "a1F1t00000017Y0EAI", {muc: 4}).then(result => {}, reject => {});
// Update Minimum volume and Minimum volume period
window.FAM.api.setVolumeFields("a1t1t000000A0gOAAS", "a1F1t00000017Y0EAI", {mvp: 5, mv: 5}).then(result => {}, reject => {});
```

### getCustomData

**Parameters:** `[ Id <String> faId ]` \
**Resolves:** [ Object custom_data ] \
**Description:** (Promise) Returns parsed custom data from the attachment on a given Frame Agreement. \
**Example:** \
```javascript
window.FAM.api.getCustomData("a1u4J000000Y8iGQAS").then(result => {}, reject => {});
```

### setCustomData

**Parameters:** `[ Id <String> faId, String | Object data ]`<br>
**Resolves:** `[void ]` \
**Description:** (Promise) Sets value for the custom part of the attachment. Objects for the second argument will be serialized. \
**Example:** \

```javascript
window.FAM.api.setCustomData("a1u4J000000Y8iGQAS", {"test": 3}).then(result => {}, reject => {});
window.FAM.api.setCustomData("a1u4J000000Y8iGQAS", '{"test": 3}').then(result => {}, r
```


### toast

**Parameters:** `[ String type, String title, String message , Integer timeout_ms [optional]]` \
**Resolves:** N/A \
**Description:** Creates a toast message. Types: `[ "success", "info", "warning", "error" ]`. Timeout can be omitted `[ default: 3000]`. Setting it to null will bypass the removal, but onClick removal and api.clearToasts() will still work. \
**Example:** \

```javascript
window.FAM.api.toast('success', 'Success!', 'Action resolved successfully.'); // toast will be removed after 3 seconds
window.FAM.api.toast('success', 'Success!', 'Action resolved successfully.', 5000) // toast will be removed after 5 seconds
window.FAM.api.toast('success', 'Success!', 'Action resolved successfully.', null) // toast will not be removed
```

### clearToasts

**Parameters:** `[ ]` \
**Resolves:** `[ void ]` \
**Description:** Removes all toasts. \
**Example:** \
```javascript
window.FAM.api.clearToasts():
```

### performAction

**Parameters:**` [ String class_name, String params ]` \
**Resolves:** `[ String serialized_result ]` \
**Description:** (Promise) Invoke custom Apex code through generic remote action implementation. \
**Example:** \
```javascript
window.FAM.api.performAction('PluginController', 'a1N1t0000001QxrZUI').then(result => {}, reject => {});
```

## subscribe

Subscribe takes the name of the event and callback function which MUST return a promise. Some of the events will have parameters that can be optionally altered but must always be resolved. The process which publishes these events will wait for the data and continue with it.

**Example:**
```javascript
window.FAM.subscribe("onBeforeAddProducts", (data) => {
    return new Promise(resolve => {
        // do something
        resolve(data);
    });
})
```

|Event | Description | Event Data| User can alter data?!
| - | - | - | - |
|onLoad| Fired when the list of Frame Agreements is loaded. |Array of Frame Agreements| false|
|\*onFaSelect| Fired when Frame Agreements is selected |Selected Frame Agreement| true|
|\*onLoadCommercialProducts| Fired after data is loaded for Frame Agreement| Array of Commercial Products| true|
|onBeforeAddProducts| Fired before adding products| Array of products to be added| true|
|onAfterAddProducts |Fired after adding products| Array of Ids of newly added products |false|
|onBeforeCreateFrameAgreement |Fired before deleting standalone add ons   | New Frame Agreement   |true|
|onBeforeDeleteAddons |Fired before creating Frame Agreement  | Array of selected add-ons |true|
|onBeforeDeleteProducts| Fired before products are being deleted |Map of products| true|
|onAfterDeleteProducts| Fired after products are being deleted| Array of Ids of all added products| false|
|onAfterDeleteAddons| Fired after deleting standalone add-ons| Array of added standalone add-ons| false
|onBeforeSaveFrameAgreement |Fired before the frame agreement is saved| Frame Agreement Object| true|
|onAfterSaveFrameAgreement| Fired after the frame agreement is saved| New Frame Agreement Object| false|
|onBeforeNegotiate |Fired before negotiation |Attachment Object| true|
|onAfterNegotiate |Fired after negotiation| Attachment Object| false|
|onAfterActivation |Fired after activation | Pricing Rule Group Id|  false|
|onBeforeBulkNegotiation| Fired before bulk negotiation |Attachment Object| true|
|onAfterBulkNegotiation	|Fired after bulk negotiation |Attachment Object |false|
|onBeforeSubmit |Fired before Frame Agreement is submitted |N/A| false|
|onAfterSubmit| Fired after Frame Agreement is submitted |N/A| false|

\*onFaSelect has been chosen as a perfect event where the user can make per-FA settings. The user can currently only disable various negotiation methods through it. If discount levels are disabled they will convert to negotiation inputs. If inline is disabled all inputs will be readOnly. So if both are true no negotiations can be performed on this FA except through API (including extensions) and bulk.

**Example:**
```javascript
 Code Block
window.FAM.subscribe('onFaSelect', data => {
	return new Promise(resolve => {
		// both properties are optional
		resolve({
			disableDiscountLevels: true,
			disableInlineDiscounts: true
		});
	});
});
```

\*If onLoadCommercialProducts is subscribed to, Frame Agreements will receive the \_filter property in the \_ui. This will be populated by a list of Id's that are returned from the event and only these products will be available for adding.

**Example:**

```javascript
// Only products whose Id ends with 'EAM' will be available to ALL Frame Agreements.
window.FAM.subscribe("onLoadCommercialProducts", (cpList) => {
    return new Promise(resolve => {
           resolve(cpList.filter(cp => cp.Id.endsWith('EAM')));
    });
})

// On Frame Agreement "a1t1t0000009wpQAAQ" only products with One-Off charge greater then 35 will be available
window.FAM.subscribe("onLoadCommercialProducts", (cpList) => {
    return new Promise(resolve => {
        window.FAM.api.getActiveFrameAgreement()
        .then(activeFa => {
            if (activeFa.Id === 'a1t1t0000009wpQAAQ') {
                resolve(cpList.filter(cp => cp.cspmb__One_Off_Charge__c > 35));
            } else {
                resolve(cpList);
            }
        });
    });
})
```
*onBeforeActivation is exposed to support famext package. Activation structure will not be disclosed as its usage is not recommended.


## registerMethod

(Available in active Frame Agreement)

Register method handler corresponding to the "method" field of a button in "FA-CustomButtons". As this functionality is available while there is an active Frame Agreement, it should be bound to "onFaSelect" or any later events.

```javascript
window.FAM.subscribe("onFaSelect", (data) => {
    return new Promise(resolve => {
        // window.FAM.api.toast("success", "Custom Resource", "Frame agreement selected");

        window.FAM.registerMethod("ActionFunction", () => {
             return new Promise(resolve => {
                // Do something
                // Resolve anything
                 resolve("ActionFunction result")
             });
        });

        window.FAM.registerMethod("iFrameFunction", () => {
             return new Promise(resolve => {
                // Do something
                // Resolve url
                 resolve("https://cscfga.eu16.visual.force.com/apex/ManageLayout");
             });
        });

        window.FAM.registerMethod("RedirectFunction", () => {
             return new Promise(resolve => {
                // Do something
                // Resolve url to be opened
                 resolve("https://eu16.salesforce.com/a1N1t0000001X2d");
             });
        });

        resolve(data);
    });
})
```