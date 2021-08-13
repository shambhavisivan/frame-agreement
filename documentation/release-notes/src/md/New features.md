# New features

## T-56662: Activate FA Apex API

Framework Agreement Management allows activation of the Frame Agreement via API. The functionality mimics the activation of the Frame Agreement in the UI screen. The same restrictions apply when activating via Apex API, i.e. Frame Agreements with the status: active, requires approval, pending or closed cannot be activated. \

Activation can be done synchronously or asynchronously.
- If the synchronous activation API is invoked, the subsequent process will be executed only after the Frame Agreement activation completes.
- If the asynchronous activation API is invoked, the Frame Agreement activation will be executed in the background and the status of the activation can be checked using getAsyncActivationStatus API. \

If additional changes are required on an activated Frame Agreement (i.e. changing the negotiated price or adding/removing a product or an add-on), it needs to be deactivated first.
Deactivation can be done using the undoActivation API. Once the undoActivation API is invoked, further changes can be done on the Frame Agreement.
If the activated Frame Agreement has a large number of products, the undo activation will be done in the background. The status of the undo activation can also be checked using getAsyncUndoActivationStatus API. \

Please refer to the Apex API documentation section to learn more about the details of these APIs and how to use them.