# Cloning

It is possible to clone a negotiated Frame Agreement and continue negotiation on the new one. The cloned Frame Agreement will always end up being a Draft and will possibly need to go through approvals. In order to clone a Frame Agreement, navigate to Account and open the menu to select the appropriate action: 

![]({{images}}/Cloning1.png)

It is possible to intercept the clone action and invoke custom logic after cloning. In order to do that, users need to implement the RemoteActionDataProvider class and register it by creating an entry in the JSON Data object. Record details: 

- name = FA-Clone-Observer
- value = Name of Apex Class implementing RemoteActionDataProvider 

The implemented class will receive both the cloned and source Frame Agreement Ids in the payload. 