# Remote action and observer interface

Generic (customer defined) remote actions and the Frame Agreement clone observer will use the following generic interface: 

```javascript
global interface RemoteActionDataProvider {
    Object performAction(String params);
}
```

Params will be either source/target Frame Agreement Ids in case of clone, or any custom parameter sent into the remote action.

Example:

Use case requires calling a method (from custom Apex class) inside FAM. 

**CalculationClass** - Apex class which holds the method
**initializeCalculation** - Method to call (requires 2 parameters)
**CalculationDataProvider** - Global class used to implement FAM's data provider


```javascript
global class CalculationDataProvider implements csfam.RemoteActionDataProvider {
 
  global Object performAction(String param) {
 
    Map < String,
    Object > inputMap = (Map < String, Object > ) JSON.deserializeUntyped(param);
 
    if ((String) inputMap.get('method') == 'initializeCalculation') {
 
      String sourceId = (String) inputMap.get('sourceId');
      Integer batchSize = (Integer) inputMap.get('batchSize');
 
      Object res = CalculationClass.initializeCalculation(sourceId, batchSize);
      return JSON.serialize(res).unescapeHtml4();
    }
 
    return null;
  }
}
```

Once set, `window.FAM.api.performAction` can be used to execute this.
```javascript
var className = 'CalculationClass';
var data = {
    method: 'initializeCalculation',
    sourceId: 'a4y3g000000g1c8',
    batchSize: 100,
};
 
window.FAM.api.performAction(className, JSON.stringify(data));
// returns a promise
```