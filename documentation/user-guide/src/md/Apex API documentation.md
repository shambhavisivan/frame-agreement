# Apex API documentation

All API calls can be accessed through the Framework Agreement Manager namespace prefix **csfam**. \

`csfam.<API_Signature>(params)` \

Example : \
`csfam.API_1.getDelta('a1u4J000000Y8iGQAS', 'a1u4J000000Y8iGPUY')`

### getDelta(frameAgreementId\_1, frameAgreementId\_2)

Returns the difference between two Frame Agreements. The differences include additional/missing products and negotiated prices of the same products existing in both Frame Agreements. \

**Signature** \
```javascript
API_1.getDelta(Id frameAgreementId_1, Id frameAgreementId_2)
```

**Parameters** \

_frameAgreementId\_1_ \
Type: `Id` \

_frameAgreementId\_2_ \
Type: `Id` \

**Return Value** \

Type: `Map <String, Object>` \

**Usage** \

Used to compare negotiated prices and missing/additional products in two different Frame Agreements. \

Example : \
```javascript
csfam.API_1.getDelta('a1u4J000000Y8iGQAS', 'a1u4J000000Y8iGPUY')
```

### activateFrameAgreement(frameAgreementId, isAsync)

Activates a Frame Agreement \

**Signature** \
```javascript
API_1.activateFrameAgreement(Id frameAgreementId, Boolean isAsync);
```

**Parameters** \

_frameAgreementId_ \
Type: `Id` \

_isAsync_ \
Type: `Boolean` \

**Return Value** \

Type: `String` \

The _String_ is a stringified JSON consisting of the status (success or error) and a corresponding message (prId in case of success or a relevant error message in case of error). \

**Usage** \

Frame Agreement with the status active, requires approval, pending, or closed cannot be activated \

Activation can be done synchronously or asynchronously.

- If the synchronous activation API is invoked, the subsequent process will be executed only after the Frame Agreement activation completes.
- If the asynchronous activation API is invoked, the Frame Agreement activation will be executed in the background and the status of the activation can be checked using getAsyncActivationStatus API. \

Example : \
```javascript
csfam.API_1.activateFrameAgreement('a1u4J000000Y8iGQAS', true);
```

### getAsyncActivationStatus(frameAgreementId)

Get the activation status of a Frame Agreement \

**Signature** \
```javascript
API_1.getAsyncActivationStatus(Id frameAgreementId);
```

**Parameters** \

_frameAgreementId_ \
Type: `Id` \

**Return Value** \

Type: `String` \

The _String_ is denoting the activation status of the Frame Agreement \

**Usage** \

When the Frame Agreement is activated asynchronously, the status of the activation can be checked via this API. \

Example : \
```javascript
csfam.API_1.getAsyncActivationStatus('a1u4J000000Y8iGQAS');
```

### undoActivation(pricingRuleId)

Undo the activation or deactivation of a Frame Agreement \

**Signature** \
```javascript
API_1.undoActivation(Id pricingRuleId);
```

**Parameters** \

_pricingRuleId_ \
Type: `Id` \

**Return Value** \

Type: `String` \

The _String_ denoting the undo/deactivation status of the Frame Agreement \

**Usage** \

When additional changes are required on an already activated Frame Agreement (i.e. changing the negotiated price or adding/removing a product or an add-on), it needs to be deactivated first.
Deactivation can be done using the undoActivation API. Once the undoActivation API is invoked, further changes can be done on the Frame Agreement.
If the activated Frame Agreement has a large number of products, the undo activation will be done in the background. The status of the undo activation can also be checked using the getAsyncUndoActivationStatus API. \

Example : \
```javascript
csfam.API_1.undoActivation('a1u4J000000Y8iGFAS');
```

### getAsyncUndoActivationStatus(frameAgreementId)

Get the deactivation status of a Frame Agreement \

**Signature** \
```javascript
API_1.getAsyncUndoActivationStatus(Id frameAgreementId);
```

**Parameters** \

_frameAgreementId_ \
Type: `Id` \

**Return Value** \

Type: `String` \

The _String_ denoting deactivation status of the Frame Agreement \

**Usage** \

When deactivating a Frame Agreement with a large number of products, the deactivation will be done in the background, the status of the activation can be checked using this API. \

Example : \
```javascript
csfam.API_1.getAsyncUndoActivationStatus('a1u4J000000Y8iGQAS');
```