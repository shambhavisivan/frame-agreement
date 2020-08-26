# Custom Buttons

Custom buttons can be added to the Frame Agreement Console. There are three types of buttons available:

Iframe button - opens a specified page in a modal window
Redirect - redirects to another page
Action - custom JS action which is invoked
In order to do that, create one record in the JSON Data object with the following details:

- name = FA-Custom-Buttons
- value = Array of JSON entities with following properties:
  - type - action / iframe / redirect
  - label - custom label
  - id - custom Id 
  - method - name of the JS function which will be invoked. This needs to be provided as part of a custom plugin
  - hidden - List of Frame Agreement statuses in which this button should be hidden
  - visible - Expression to be evaluated to determine button visibility
  - location - Control of where the button is located on the UI (Editor | List | Footer)
  - options (iFrame) - defining width, height and title of an iframe (use of % units for dimensions is encouraged). For full width and height, use "options": "max"

Custom buttons will be shown in the header's button container. Having 3 or more custom buttons will render them in a dropdown-like component.



>The "hidden" property was not removed to maintain backward compatibility. It is suggested to use one or the other. Using both will convert hidden statuses to expression components and evaluate them with the AND operator.
>
>For instance:
>
>`{`
>
>`...`
>
>`"hidden": ["Pending", "Active"],`
>
>`"visible": "custom_field__c == true || custom_text__c == show"`
>
>`...`
>
>`}`
>
>Will effectively merge into this expression:
>
>`"csconta__Status__c != Pending && csconta__Status__c != Active && custom_field__c == true || custom_text__c == show"`
>
>This will logically be evaluated as:
>
>`((A && B) && C) || D`

Example: 
```javascript
[
  {
    "type": "action",
    "label": "Action button",
    "id": "bta1",
    "method": "ActionFunction",
    "location": "Editor",
    "hidden": [
      "Active"
    ]
  },
  {
    "type": "iframe",
    "label": "iFrame button",
    "id": "bta2",
    "method": "iFrameFunction",
    "location": "Editor",
    "options": {
      "title": '"iFrame Title'",
      "width": '"100%'",
      "height": '"100%'"
    },
    "hidden": [
      "Active"
    ]
  },
  {
    "type": "redirect",
    "label": "Redirect button",
    "id": "bta3",
    "method": "RedirectFunction",
    "location": "List",
    "hidden": [
      "Active"
    ]
  }
]

```


Example of iFrame using "max" option:

```javascript
{
    "type": "iframe",
    "label": "iFrame button",
    "id": "bta2",
    "method": "iFrameFunction",
    "location": "Editor",
    "options": "max",
    "hidden": [
      "Active"
    ]
  }
```
In order to register a function which is invoked in a custom button, the following needs to be added to custom plugin code (this is an example for the event onFaSelect): 

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
                resolve("https://cscfga.eu8.visual.force.com/apex/ManageLayout");
            });
        });

        window.FAM.registerMethod("RedirectFunction", () => {
            return new Promise(resolve => {
                // Do something
                // Resolve url to be opened
                resolve("https://eu8.salesforce.com/0010N000049UjKmQAK");
            });
        });

        resolve(data);
    });
});
```
IMPORTANT: Check the FAM - API documentation page to learn more about subscribing to methods.

## iFrame expansion (16.9)

Some improvements are made to make work with iframe easier:

- default iFrame width is set to 90% of the screen. Override can be set in the options property of JSON Data.
- title property in settings is optional. If set, it will appear above the iframe in the modal header (in the iframe wrapper)
- close button and iframe will have their Id derived from the button Id:

```javascript

// Using above example for configuration
// "id": "bta2"

// Button
// 'btn-iframe-close-' + button.id
<button id="btn-iframe-close-bta2">...</button>

// Iframe close can be achieved through simulating click on it.

// Example of closing from FAM app:
document.getElementById("btn-iframe-close-bta2").click();

// Closing from within iframe:
parent.document.getElementById("btn-iframe-close-bta2").click();

// Iframe
// 'iframe-' + button.id
<iframe id="iframe-bta2"></iframe>
```