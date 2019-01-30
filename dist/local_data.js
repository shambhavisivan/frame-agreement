        var SF;

        function createPromise(result) {
            return new Promise(resolve => {
                setTimeout(() => {
                    resolve(result);
                }, 100);
            });
        }

        const settings = {
            status: "Draft"
            // status: "Active"
        };

        const JSONData = [
            {
                "field": "csconta__Agreement_Name__c",
                "readOnly": false,
                "label": "Agreement Name",
                "type": "text",
                "grid": 2
            },
            {
                "field": "Arb_Field_Integer__c",
                "readOnly": false,
                "label": "Arb Field Integer",
                "type": "number",
                "grid": 1
            },
            {
                "field": "Arb_Field_Bool__c",
                "readOnly": false,
                "label": "Arb Field Bool",
                "type": "boolean",
                "grid": 2
            },
            {
                "field": "Arb_Field_Text__c",
                "readOnly": false,
                "label": "Arb Field Text",
                "type": "text",
                "grid": 2
            },
            {
                "field": "Arb_Field_Date__c",
                "readOnly": false,
                "label": "Arb Field Date",
                "type": "date",
                "grid": 2
            },
            {
                "field": "Arb_Field_Text_3__c",
                "readOnly": false,
                "label": "Arb Field Text 3",
                "type": "text",
                "grid": 2
            },
            {
                "field": "Arb_Field_Textarea__c",
                "readOnly": false,
                "label": "Arb Field Textarea",
                "type": "textarea",
                "grid": 4
            }
        ]

        const newFA = {
              "Id": "newFaId",
              "Name": "AGR-000000",
              "csconta__Account__c": "0011t00000DSEtnAAH",
              "csconta__Agreement_Name__c": "Frame Agreement - Test #NEW",
              "csconta__Status__c": "Draft",
              "csconta__Valid_From__c": 1547424000000,
              "csconta__Valid_To__c": 1568419200000,
              "Arb_Field_Text__c": "Arb Text",
              "Arb_Field_Date__c": 1547510400000,
              "Arb_Field_Text_2__c": "Arb Text 2 - change 1dsfsdf",
              "Arb_Field_Text_3__c": "Arb Text 3 - change 1",
              "Arb_Field_Textarea__c": "Metus in vestibulum faucibus erat tortor et, suscipit orci, scelerisque a do ac eu, maecenas fusce velit, cras dui faucibus donec urna leo justo. Enim nec sagittis rutrum est, vel erat in venenatis vestibulum, sed nostra dui nonummy etiam eros, eget",
              "csconta__Account__r": {
                "Name": "Test Account",
                "Id": "0011t00000DSEtnAAH"
              }
            }


        window.SF = SF = {
            param: {
                account: '0011t00000DSEtn'
            },
            invokeAction: function(remoteActionName, parametersArr = []) {
                let data = null;
                switch (remoteActionName) {
                    case 'getFrameAgreements':
                        data = [{"Id":"a1t1t0000009wpQAAQ","Name":"AGR-000000","csconta__Account__c":"0011t00000DSEtnAAH","csconta__Agreement_Name__c":"Frame Agreement - Test #1","csconta__Status__c":"Draft","csconta__Valid_From__c":1547424000000,"csconta__Valid_To__c":1568419200000,"Arb_Field_Bool__c":true,"Arb_Field_Integer__c":48,"Arb_Field_Text__c":"Arb Text","Arb_Field_Date__c":1547510400000,"Arb_Field_Text_2__c":"Arb Text 2 - change 2","Arb_Field_Text_3__c":"Arb Text 3 - change 1","Arb_Field_Textarea__c":"Metus in vestibulum faucibus erat tortor et, suscipit orci, scelerisque a do ac eu, maecenas fusce velit, cras dui faucibus donec urna leo justo. Enim nec sagittis rutrum est, vel erat in venenatis vestibulum, sed nostra dui nonummy etiam eros, eget","csconta__Account__r":{"Name":"Test Account","Id":"0011t00000DSEtnAAH"}},{"Id":"a1t1t000000A0gJAAS","Name":"AGR-000001","csconta__Account__c":"0011t00000DSEtnAAH","csconta__Agreement_Name__c":"Frame Agreement - Test #2","csconta__Status__c":"Active","csconta__Valid_From__c":1547424000000,"csconta__Valid_To__c":1568419200000,"Arb_Field_Bool__c":true,"Arb_Field_Integer__c":144,"Arb_Field_Text__c":"Arb Text","Arb_Field_Date__c":1547424000000,"Arb_Field_Text_2__c":"Arb Text 2 - change 1dsfsdf","Arb_Field_Text_3__c":"Arb Text 3 - change 1","Arb_Field_Textarea__c":"Metus in vestibulum faucibus erat tortor et, suscipit orci, scelerisque a do ac eu, maecenas fusce velit, cras dui faucibus donec urna leo justo. Enim nec sagittis rutrum est, vel erat in venenatis vestibulum, sed nostra dui nonummy etiam eros, eget","csconta__Account__r":{"Name":"Test Account","Id":"0011t00000DSEtnAAH"}},{"Id":"a1t1t000000A0gOAAS","Name":"AGR-000002","csconta__Account__c":"0011t00000DSEtnAAH","csconta__Agreement_Name__c":"Frame Agreement - Test #3","csconta__Status__c":"Active","csconta__Valid_From__c":1547424000000,"csconta__Valid_To__c":1568419200000,"Arb_Field_Bool__c":true,"Arb_Field_Integer__c":22,"Arb_Field_Text__c":"Arb Text","Arb_Field_Date__c":1547424000000,"Arb_Field_Text_2__c":"Arb Text 2 - change 1dsfsdf","Arb_Field_Text_3__c":"Arb Text 3 - change 1","Arb_Field_Textarea__c":"Metus in vestibulum faucibus erat tortor et, suscipit orci, scelerisque a do ac eu, maecenas fusce velit, cras dui faucibus donec urna leo justo. Enim nec sagittis rutrum est, vel erat in venenatis vestibulum, sed nostra dui nonummy etiam eros, eget","csconta__Account__r":{"Name":"Test Account","Id":"0011t00000DSEtnAAH"}}];
                        return createPromise(data);

                    case 'getCommercialProducts':
                        data = [{ "Id": "a1F1t0000001JBoEAM", "Name": "Mobile L_7", "cspmb__Effective_Start_Date__c": 1545264000000 }, { "Id": "a1F1t0000001JBZEA2", "Name": "Mobile L_4", "cspmb__Effective_Start_Date__c": 1545264000000 }, { "Id": "a1F1t0000001JBUEA2", "Name": "Mobile L_3", "cspmb__Effective_Start_Date__c": 1545264000000 }, { "Id": "a1F1t0000001JBjEAM", "Name": "Mobile L_6", "cspmb__Effective_Start_Date__c": 1545264000000 }, { "Id": "a1F1t0000001JCDEA2", "Name": "Mobile L_12", "cspmb__Effective_Start_Date__c": 1545264000000 }, { "Id": "a1F1t0000001JByEAM", "Name": "Mobile L_9", "cspmb__Effective_Start_Date__c": 1545264000000 }, { "Id": "a1F1t0000001JC8EAM", "Name": "Mobile L_11", "cspmb__Effective_Start_Date__c": 1545264000000 }, { "Id": "a1F1t0000001JBPEA2", "Name": "Mobile L_2", "cspmb__Effective_Start_Date__c": 1545264000000 }, { "Id": "a1F1t0000001JBeEAM", "Name": "Mobile L_5", "cspmb__Effective_Start_Date__c": 1545264000000 }, { "Id": "a1F1t0000001JBtEAM", "Name": "Mobile L_8", "cspmb__Effective_Start_Date__c": 1545264000000 }, { "Id": "a1F1t0000001JC3EAM", "Name": "Mobile L_10", "cspmb__Effective_Start_Date__c": 1545264000000 }, { "Id": "a1F1t00000017Y0EAI", "Name": "Mobile L", "cspmb__Effective_Start_Date__c": 1545264000000 }];
                        return createPromise(data);

                    case 'getAppSettings':
                        data = { "commercialProductCount": 10, "frameAgreementsCount": 1, "itemsPerPage": 20, "JSONData": JSONData };
                        return createPromise(data);

                    case 'upsertFrameAgreements':;
                        return createPromise(newFA);
                }
            }
        }