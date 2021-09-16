# Controlling allowed values

Each Commercial Product can have one or more Discount Levels associated with it. Discount Levels can be used to constrain what can be negotiated for a particular Commercial Product. If any discount levels are present, the corresponding charge negotiation will be changed from free entry to a predefined picklist of allowed values.

Example of two add ons where one has associated Discount Levels and one has no constraints:

![]({{images}}/ConVal1.png)

## IgnoreSettings

IgnoreSettings allows users to disable the discount threshold on certain commercial products based on Frame Agreement field values. This is possible through utilization of the "onFaUpdate" event and the "ignoreSettings" store property.

IgnoreSettings is an internal JSON that holds a list of ignored products (and custom tabs, but this article focuses on products).

It looks similar to this:

```javascript
{
	"products": ["a1F1t0000001JBjEAM","a1F1t0000001JCDEA2"],
	"tabs": ["customTab1"]
}
```

The way to edit this property is through an event hook (see FAM - API documentation > subscribe) which allows users to implement their own logic.

The "onFaUpdate" event is triggered on Frame Agreement field change. If the user is subscribed to this event, the current ignoreSettings will be provided as event parameter.

This is an intercept-type event; updated ignoreSettings need to be resolved from the event and have proper structure as validation will occur upon execution.


Here are a few examples of how this can be implemented:


Basic implementation template:

```javascript
// ES6
window.FAM.subscribe("onFaUpdate", ignoreSettings => {
	return new Promise(async () => {
		// custom logic
		resolve(ignoreSettings);
	});
});

// <=ES5
window.FAM.subscribe("onFaUpdate", function(ignoreSettings) {
	return new Promise(function(resolve) {
		// custom logic
		resolve(ignoreSettings);
	});
});
```


Updating ignoreSettings based on an fa field value:

```javascript
// ES6
window.FAM.subscribe("onFaUpdate", ignoreSettings => {
  return new Promise(async () => {
    // Get active frame agreement to compare properties
    let active_fa = await window.FAM.api.getActiveFrameAgreement();

    let _productsToIgnore = ["a1F1t0000001JBjEAM", "a1F1t0000001JCDEA2", "a1F1t0000001JC8EAM", "a1F1t00000017Y0EAI"];
	// Check if fa field has specific value
    if (active_fa.csfam__Disable_Levels__c === true) {
	  // If yes, add products to ignoreSettings.products (in this case: whole premade array)
      ignoreSettings.products = _productsToIgnore;
    } else {
	  // If not, no products are ignored
      ignoreSettings.products = [];
    }
	// Resolve new and updated ignoreSettings
    resolve(ignoreSettings);
  });
});

// <=ES5
window.FAM.subscribe("onFaUpdate", function(ignoreSettings) {
  return new Promise(function(resolve) {
    window.FAM.api.getActiveFrameAgreement()
    .then(function(active_fa) {
      let _productsToIgnore = ["a1F1t0000001JBjEAM", "a1F1t0000001JCDEA2", "a1F1t0000001JC8EAM", "a1F1t00000017Y0EAI"];

      if (active_fa.csfam__Disable_Levels__c === true) {
        ignoreSettings.products = _productsToIgnore;
      } else {
        ignoreSettings.products = [];
      }

      resolve(ignoreSettings);
    });
  });
});
```

Note that the API function "getCommercialProducts" will return a list of all commercial products (see FAM - API documentation > API > getCommercialProducts).

If provided by frame agreement Id parameter: it will only return products added to that specific agreement.


Subscription can make use of this:

```javascript
window.FAM.subscribe("onFaUpdate", ignoreSettings => {
  return new Promise(async () => {
    let active_fa = await window.FAM.api.getActiveFrameAgreement();
	// This will return list of all commercial products
    let _allProducts = await window.FAM.api.getCommercialProducts();

    /*
		Faster way for ES6 savy:
		let [active_fa, _allProducts] = await Promise.all([window.FAM.api.getActiveFrameAgreement(), window.FAM.api.getCommercialProducts()]);
	*/

    // We only want their Id's
    _allProducts = _allProducts.map(cp => cp.Id);


    if (active_fa.csfam__Disable_Levels__c === true) {
      ignoreSettings.products = _allProducts;
    } else {
      ignoreSettings.products = [];
    }

    resolve(ignoreSettings);
  });
});
```

Ignoring discount levels for added products based on text/picklist field value:

```javascript
window.FAM.subscribe("onFaUpdate", ignoreSettings => {
  return new Promise(async () => {
    // Get active frame agreement to compare properties
    let active_fa = await window.FAM.api.getActiveFrameAgreement();
    // Get only added products
    let _addedProducts = await window.FAM.api.getCommercialProducts(active_fa.Id);

    if (active_fa.csfam__Disable_Type__c === "Mobile") {
      ignoreSettings.products = _addedProducts.filter(cp => cp.Name.startsWith("Mobile")).map(cp => cp.Id);
    } else if (active_fa.csfam__Disable_Type__c === "Fixed") {
      ignoreSettings.products = _addedProducts.filter(cp => cp.Name.startsWith("Fixed")).map(cp => cp.Id);
    } else {
      ignoreSettings.products = [];
    }

    resolve(ignoreSettings);
  });
});
```



