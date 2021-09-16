# Registering plugins

Framework Agreement Management supports custom plugins which can add business logic to the entire process. In order to register a plugin, you need to upload the code to Salesforce and store it in Static Resource as a JS file. This can then be registered in CS Util JSON settings: 

- name - CustomResource/FAMeditor/1
- JSON Configuration - `{"type":"js", "path":"FAMCustomResource"}`

> To avoid static resource caching, add **"timestamp": "rnd"** to JSON Configuration.

## Subscribing to events

Each plugin can subscribe to certain events in order to execute custom logic when required. Supported events and details are located in API Documentation - FAM - API documentation