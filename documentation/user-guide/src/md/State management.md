# State management

Frame Agreement Management allows users to define a lifecycle based on business requirements. There are five states which are required in the journey and need to be set up in FAC custom settings: 

- Draft Status - this is the initial status of Frame Agreement. Any FA which is cloned or created will end up in this status
- Requires Approval Status - if any negotiation breaches Discount Thresholds, FAM will set the status of Frame Agreement automatically to this value
- Approved Status - This is the state in which FA should end up once it is Approved
- Closed Replaced status - This is the state in which a FA will be set once a new version is created and activated
- Active Status - Once Frame Agreement is submitted / activated, we will perform decomposition of negotiated values into Product and Pricing Model objects and the UI will be blocked for editing 

In addition to statuses above, it is possible to create any number of custom states and set up FAM to behave accordingly. Buttons controls are covered in FAM 

- Custom Buttons and FAM - Controlling standard button visibility sections. In order to define whether Frame Agreement should be negotiable or not, you can set the following custom setting value: 
- FA Editable Statuses - CSV List of statuses which enable negotiation