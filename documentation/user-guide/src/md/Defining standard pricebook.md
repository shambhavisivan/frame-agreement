# Defining standard pricebook

Framework Agreement reads data from [CloudSense Product and Pricing Data Model](https://cloudsense.atlassian.net/wiki/spaces/CPP/pages/32170215/CloudSense+Product+and+Pricing+Data+Model). The entire data model can be found on the following link: CloudSense Product and Pricing High-Level object model ERD. The negotiation process will start by adding Commercial Products to Frame Agreement. This will allow the user to negotiate Add Ons, Rate Cards, Charges (Price Element), and Product Charges on Commercial Products. If Commercial Products are using Charges (Price Element Type and Price Element), then it is required to define a standard price book which will define initial charge values.

In order to define a standard price book, please create an entry in JSON data with the following details:

- name =  FA-StandardPricebook
- value = Pricing Rule Group Id representing standard price book