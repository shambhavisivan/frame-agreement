var SF;

function createPromise(result) {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve(result);
        }, 100);
    });
}

const nullValues = false;

const settings = {
    status: "Draft"
    // status: "Active"
};

const FACSettings = {
    Price_Item_Fields: "cspmb__Contract_Term__c, cspmb__Recurring_Cost__c",
    FA_Editable_Statuses: "Draft",
    Truncate_CP_Fields: true
};

const Charges = {
  priceItemId: "a1F1t00000017Y0EAI",
  charges: [
    {
      "chargeType": "One-off Charge",
      "Id": "a1I1t000001WkzoEAC",
      "Name": "One-off charge",
      "oneOff": 7
    },
    {
      "chargeType": "Recurring Charge",
      "Id": "a1I1t000001WkzjEAC",
      "Name": "Recurring Charge",
      "recurring": 12
    }
  ]
};

const Addons = [{
        Id: "a0w1t0000002hSaAAI",
        Name: "ADD1",
        cspmb__Is_Active__c: true,
        cspmb__Effective_Start_Date__c: 1545868800000,
        cspmb__Billing_Frequency__c: "Monthly",
        cspmb__Authorization_Level__c: "a0x1t000000yZF3AAM",
        cspmb__Recurring_Charge__c: nullValues ? null : 12.75,
        cspmb__One_Off_Charge__c: nullValues ? null : 8.49
    },
    {
        Id: "a0w1t000000zDnNAAU",
        Name: "ADD2",
        cspmb__Is_Active__c: true,
        cspmb__Recurring_Charge__c: nullValues ? null : 82.44,
        cspmb__Effective_Start_Date__c: 1545868800000,
        cspmb__Billing_Frequency__c: "Monthly",
        cspmb__Authorization_Level__c: "a0x1t000000yZF3AAM",
        cspmb__One_Off_Charge__c: nullValues ? null : 8.49
    }
];

const rateCards = [{
        authId: "a0x1t000000yZF3AAM",
        Id: "a1N1t0000001QxrEAE",
        Name: "RC1",
        rateCardLines: [{
                Id: "a1M1t000000BFrVEAW",
                Name: "RCL1.1",
                cspmb__Cap_Unit__c: "Sample Cap Unit",
                cspmb__rate_value__c: nullValues ? null : 18.29,
                cspmb__Rate_Card__c: "a1N1t0000001QxrEAE"
            },
            {
                Id: "a1M1t000000BFrVEAA",
                Name: "RCL1.2",
                cspmb__Cap_Unit__c: "Sample Cap Unit",
                cspmb__rate_value__c: nullValues ? null : 7.10,
                cspmb__Rate_Card__c: "a1N1t0000001QxrEAE"
            }
        ]
    },
    {
        authId: "a0x1t000000yZF3AAM",
        Id: "a1N1t0000001QxrEAF",
        Name: "RC2",
        rateCardLines: [{
                Id: "a1M1t000000BFrVEAR",
                Name: "RCL2.1",
                cspmb__Cap_Unit__c: "Sample Cap Unit",
                cspmb__rate_value__c: nullValues ? null : 4.99,
                cspmb__Rate_Card__c: "a1N1t0000001QxrEAF"
            },
            {
                Id: "a1M1t000000BFrVEAU",
                Name: "RCL2.2",
                cspmb__Cap_Unit__c: "Sample Cap Unit",
                cspmb__rate_value__c: nullValues ? null : 15.59,
                cspmb__Rate_Card__c: "a1N1t0000001QxrEAF"
            }
        ]
    }
];

const attachment = {
    "a1F1t00000017Y0EAI": {
        "_addons": {
            "a0w1t0000002hSaAAI": {
                "oneOff": 5.49,
                "recurring": 14.75
            },
            "a0w1t000000zDnNAAU": {
                "oneOff": 10.49,
                "recurring": 79.44
            }
        },
        "_charges": {
            "a1I1t000001WkzoEAC": {
                "oneOff": 4
            },
            "a1I1t000001WkzjEAC": {
                "recurring": 9
            }
        },
        "_rateCards": {
            "a1N1t0000001QxrEAE": {
                "a1M1t000000BFrVEAW": 118.99
            }
        }
    },
    "a1F1t0000001JBUEA2": null,
    "a1F1t0000001JBeEAM": {
        "_addons": {
            "a0w1t000000zDnhAAE": {
                "recurring": 38
            }
        },
        "_rateCards": {
            "a1N1t0000001X2dEAE": {
                "a1M1t000000peXZEAY": 61.43,
                "a1M1t000000peXeEAI": 8.99
            }
        }
    }
};

const JSONData = [{
        field: "csconta__Agreement_Name__c",
        readOnly: false,
        label: "Agreement Name",
        type: "text",
        grid: 2
    },
    {
        field: "Arb_Field_Integer__c",
        readOnly: false,
        label: "Arb Field Integer",
        type: "number",
        grid: 1
    },
    {
        field: "Arb_Field_Bool__c",
        readOnly: false,
        label: "Arb Field Bool",
        type: "boolean",
        grid: 2
    },
    {
        field: "Arb_Field_Text__c",
        readOnly: false,
        label: "Arb Field Text",
        type: "text",
        grid: 2
    },
    {
        field: "Arb_Field_Date__c",
        readOnly: false,
        label: "Arb Field Date",
        type: "date",
        grid: 2
    },
    {
        field: "Arb_Field_Text_3__c",
        readOnly: false,
        label: "Arb Field Text 3",
        type: "text",
        grid: 2
    },
    {
        field: "Arb_Field_Textarea__c",
        readOnly: false,
        label: "Arb Field Textarea",
        type: "textarea",
        grid: 4
    }
];

const commercialProducts = [{"Id":"a1F1t00000017Y0EAI","Name":"Mobile L","cspmb__Effective_Start_Date__c":1545264000000,"cspmb__Authorization_Level__c":"a0x1t000001RjBzAAK","cspmb__Is_Authorization_Required__c":false,"cspmb__Contract_Term__c":"24 Months","cspmb__Recurring_Cost__c":69},{"Id":"a1F1t0000001JBUEA2","Name":"Mobile L_3","cspmb__Authorization_Level__c":"a0x1t000000yZF3AAM","cspmb__Is_Authorization_Required__c":false,"cspmb__Contract_Term__c":"24 Months","cspmb__Recurring_Cost__c":69},{"Id":"a1F1t0000001JBeEAM","Name":"Mobile L_5","cspmb__Authorization_Level__c":"a0x1t000000yZF3AAM","cspmb__Is_Authorization_Required__c":false,"cspmb__Contract_Term__c":"24 Months","cspmb__Recurring_Cost__c":69},{"Id":"a1F1t0000001JBjEAM","Name":"Mobile L_6","cspmb__Effective_Start_Date__c":1545264000000,"cspmb__Authorization_Level__c":"a0x1t000000yZF3AAM","cspmb__Is_Authorization_Required__c":false,"cspmb__Contract_Term__c":"24 Months","cspmb__Recurring_Cost__c":69},{"Id":"a1F1t0000001JBoEAM","Name":"Mobile L_7","cspmb__Effective_Start_Date__c":1545264000000,"cspmb__Authorization_Level__c":"a0x1t000000yZF3AAM","cspmb__Is_Authorization_Required__c":false,"cspmb__Contract_Term__c":"24 Months","cspmb__Recurring_Cost__c":69},{"Id":"a1F1t0000001JBtEAM","Name":"Mobile L_8","cspmb__Effective_Start_Date__c":1545264000000,"cspmb__Authorization_Level__c":"a0x1t000000yZF3AAM","cspmb__Is_Authorization_Required__c":false,"cspmb__Contract_Term__c":"24 Months","cspmb__Recurring_Cost__c":69},{"Id":"a1F1t0000001JByEAM","Name":"Mobile L_9","cspmb__Effective_Start_Date__c":1545264000000,"cspmb__Authorization_Level__c":"a0x1t000000yZF3AAM","cspmb__Is_Authorization_Required__c":false,"cspmb__Contract_Term__c":"24 Months","cspmb__Recurring_Cost__c":69},{"Id":"a1F1t0000001JC3EAM","Name":"Mobile L_10","cspmb__Effective_Start_Date__c":1545264000000,"cspmb__Authorization_Level__c":"a0x1t000000yZF3AAM","cspmb__Is_Authorization_Required__c":false,"cspmb__Contract_Term__c":"24 Months","cspmb__Recurring_Cost__c":69},{"Id":"a1F1t0000001JC8EAM","Name":"Mobile L_11","cspmb__Effective_Start_Date__c":1545264000000,"cspmb__Authorization_Level__c":"a0x1t000001RjC4AAK","cspmb__Is_Authorization_Required__c":false,"cspmb__Contract_Term__c":"24 Months","cspmb__Recurring_Cost__c":69},{"Id":"a1F1t0000001JCDEA2","Name":"Mobile L_12","cspmb__Effective_Start_Date__c":1545264000000,"cspmb__Authorization_Level__c":"a0x1t000000yZF3AAM","cspmb__Is_Authorization_Required__c":false,"cspmb__Contract_Term__c":"24 Months","cspmb__Recurring_Cost__c":69}]; 

const newFA = {
    Id: "newFaId",
    Name: "AGR-000000",
    csconta__Account__c: "0011t00000DSEtnAAH",
    csconta__Agreement_Name__c: "Frame Agreement - Test #NEW",
    csconta__Status__c: "Draft",
    csconta__Valid_From__c: 1547424000000,
    csconta__Valid_To__c: 1568419200000,
    Arb_Field_Text__c: "Arb Text",
    Arb_Field_Date__c: 1547510400000,
    Arb_Field_Text_2__c: "Arb Text 2 - change 1dsfsdf",
    Arb_Field_Text_3__c: "Arb Text 3 - change 1",
    Arb_Field_Textarea__c: "Metus in vestibulum faucibus erat tortor et, suscipit orci, scelerisque a do ac eu, maecenas fusce velit, cras dui faucibus donec urna leo justo. Enim nec sagittis rutrum est, vel erat in venenatis vestibulum, sed nostra dui nonummy etiam eros, eget",
    csconta__Account__r: {
        Name: "Test Account",
        Id: "0011t00000DSEtnAAH"
    }
};

// const priceItemData = {"a1F1t00000017Y0EAI":{"addons":[{"Id":"a0w1t0000002hSaAAI","Name":"ADD1","cspmb__Is_Active__c":true,"cspmb__Recurring_Charge__c":22,"cspmb__Effective_Start_Date__c":1545868800000,"cspmb__Billing_Frequency__c":"Monthly","cspmb__Authorization_Level__c":"a0x1t000000yZF3AAM"},{"Id":"a0w1t000000zDnNAAU","Name":"ADD2","cspmb__Is_Active__c":true,"cspmb__Recurring_Charge__c":43,"cspmb__Effective_Start_Date__c":1545868800000,"cspmb__Billing_Frequency__c":"Monthly","cspmb__Authorization_Level__c":"a0x1t000000yZF3AAM"}],"Id":"a1F1t00000017Y0EAI","rateCards":[{"authId":"a0x1t000000yZF3AAM","Id":"a1N1t0000001QxrEAE","Name":"RC1","rateCardLines":[{"Id":"a1M1t000000BFrVEAW","Name":"RCL1.1","cspmb__Cap_Unit__c":"Sample Cap Unit","cspmb__rate_value__c":124.99,"cspmb__Rate_Card__c":"a1N1t0000001QxrEAE"},{"Id":"a1M1t000000peaJEAQ","Name":"RCL_1_1","cspmb__Rate_Card__c":"a1N1t0000001QxrEAE"}]}]},"a1F1t0000001JBUEA2":{"addons":[{"Id":"a0w1t0000002hSaAAI","Name":"ADD1","cspmb__Is_Active__c":true,"cspmb__Recurring_Charge__c":22,"cspmb__Effective_Start_Date__c":1545868800000,"cspmb__Billing_Frequency__c":"Monthly","cspmb__Authorization_Level__c":"a0x1t000000yZF3AAM"},{"Id":"a0w1t000000zDnNAAU","Name":"ADD2","cspmb__Is_Active__c":true,"cspmb__Recurring_Charge__c":43,"cspmb__Effective_Start_Date__c":1545868800000,"cspmb__Billing_Frequency__c":"Monthly","cspmb__Authorization_Level__c":"a0x1t000000yZF3AAM"}],"Id":"a1F1t0000001JBUEA2","rateCards":[{"authId":"a0x1t000000yZF3AAM","Id":"a1N1t0000001X2dEAE","Name":"RC2","rateCardLines":[{"Id":"a1M1t000000peXUEAY","Name":"RCL_1","cspmb__rate_value__c":55.98,"cspmb__Rate_Card__c":"a1N1t0000001X2dEAE"},{"Id":"a1M1t000000peXZEAY","Name":"RCL_2","cspmb__rate_value__c":65.43,"cspmb__Rate_Card__c":"a1N1t0000001X2dEAE"},{"Id":"a1M1t000000peXeEAI","Name":"RCL_3","cspmb__rate_value__c":12.99,"cspmb__Rate_Card__c":"a1N1t0000001X2dEAE"}]}]},"a1F1t0000001JBeEAM":{"addons":[{"Id":"a0w1t0000002hSaAAI","Name":"ADD1","cspmb__Is_Active__c":true,"cspmb__Recurring_Charge__c":22,"cspmb__Effective_Start_Date__c":1545868800000,"cspmb__Billing_Frequency__c":"Monthly","cspmb__Authorization_Level__c":"a0x1t000000yZF3AAM"},{"Id":"a0w1t000000zDnhAAE","Name":"ADD3","cspmb__Is_Active__c":true,"cspmb__Recurring_Charge__c":43,"cspmb__Effective_Start_Date__c":1545868800000,"cspmb__Billing_Frequency__c":"Monthly","cspmb__Authorization_Level__c":"a0x1t000000yZF3AAM"}],"Id":"a1F1t0000001JBeEAM","rateCards":[{"authId":"a0x1t000000yZF3AAM","Id":"a1N1t0000001X2dEAE","Name":"RC2","rateCardLines":[{"Id":"a1M1t000000peXUEAY","Name":"RCL_1","cspmb__rate_value__c":55.98,"cspmb__Rate_Card__c":"a1N1t0000001X2dEAE"},{"Id":"a1M1t000000peXZEAY","Name":"RCL_2","cspmb__rate_value__c":65.43,"cspmb__Rate_Card__c":"a1N1t0000001X2dEAE"},{"Id":"a1M1t000000peXeEAI","Name":"RCL_3","cspmb__rate_value__c":12.99,"cspmb__Rate_Card__c":"a1N1t0000001X2dEAE"}]}]}};

window.react_logs = [];

window.SF = SF = {
    param: {
        account: "0011t00000DSEtn"
    },
    invokeAction: function(remoteActionName, parametersArr = []) {
        let data = null;
        switch (remoteActionName) {
            case "getFrameAgreements":
                data = [{
                        Id: "a1t1t0000009wpQAAQ",
                        Name: "AGR-000000",
                        csconta__Account__c: "0011t00000DSEtnAAH",
                        csconta__Agreement_Name__c: "Frame Agreement - Test #1",
                        csconta__Status__c: "Draft",
                        csconta__Valid_From__c: 1547424000000,
                        csconta__Valid_To__c: 1568419200000,
                        Arb_Field_Bool__c: true,
                        Arb_Field_Integer__c: 48,
                        Arb_Field_Text__c: "Arb Text",
                        Arb_Field_Date__c: 1547510400000,
                        Arb_Field_Text_2__c: "Arb Text 2 - change 2",
                        Arb_Field_Text_3__c: "Arb Text 3 - change 1",
                        Arb_Field_Textarea__c: "Metus in vestibulum faucibus erat tortor et, suscipit orci, scelerisque a do ac eu, maecenas fusce velit, cras dui faucibus donec urna leo justo. Enim nec sagittis rutrum est, vel erat in venenatis vestibulum, sed nostra dui nonummy etiam eros, eget",
                        csconta__Account__r: {
                            Name: "Test Account",
                            Id: "0011t00000DSEtnAAH"
                        }
                    },
                    {
                        Id: "a1t1t000000A0gJAAS",
                        Name: "AGR-000001",
                        csconta__Account__c: "0011t00000DSEtnAAH",
                        csconta__Agreement_Name__c: "Frame Agreement - Test #2",
                        csconta__Status__c: "Active",
                        csconta__Valid_From__c: 1547424000000,
                        csconta__Valid_To__c: 1568419200000,
                        Arb_Field_Bool__c: true,
                        Arb_Field_Integer__c: 144,
                        Arb_Field_Text__c: "Arb Text",
                        Arb_Field_Date__c: 1547424000000,
                        Arb_Field_Text_2__c: "Arb Text 2 - change 1dsfsdf",
                        Arb_Field_Text_3__c: "Arb Text 3 - change 1",
                        Arb_Field_Textarea__c: "Metus in vestibulum faucibus erat tortor et, suscipit orci, scelerisque a do ac eu, maecenas fusce velit, cras dui faucibus donec urna leo justo. Enim nec sagittis rutrum est, vel erat in venenatis vestibulum, sed nostra dui nonummy etiam eros, eget",
                        csconta__Account__r: {
                            Name: "Test Account",
                            Id: "0011t00000DSEtnAAH"
                        }
                    },
                    {
                        Id: "a1t1t000000A0gOAAS",
                        Name: "AGR-000002",
                        csconta__Account__c: "0011t00000DSEtnAAH",
                        csconta__Agreement_Name__c: "Frame Agreement - Test #3",
                        csconta__Status__c: "Active",
                        csconta__Valid_From__c: 1547424000000,
                        csconta__Valid_To__c: 1568419200000,
                        Arb_Field_Bool__c: true,
                        Arb_Field_Integer__c: 22,
                        Arb_Field_Text__c: "Arb Text",
                        Arb_Field_Date__c: 1547424000000,
                        Arb_Field_Text_2__c: "Arb Text 2 - change 1dsfsdf",
                        Arb_Field_Text_3__c: "Arb Text 3 - change 1",
                        Arb_Field_Textarea__c: "Metus in vestibulum faucibus erat tortor et, suscipit orci, scelerisque a do ac eu, maecenas fusce velit, cras dui faucibus donec urna leo justo. Enim nec sagittis rutrum est, vel erat in venenatis vestibulum, sed nostra dui nonummy etiam eros, eget",
                        csconta__Account__r: {
                            Name: "Test Account",
                            Id: "0011t00000DSEtnAAH"
                        }
                    }
                ];
                return createPromise(data);

            case "getCommercialProducts":
                return createPromise(commercialProducts);

            case "getAppSettings":
                data = {
                    commercialProductCount: 10,
                    frameAgreementsCount: 1,
                    itemsPerPage: 20,
                    JSONData: JSONData,
                    AuthLevels: [{"Id":"a151t000000rmV7AAI","Name":"RCL1.1","cspmb__Discount_Threshold__c":10,"cspmb__Authorization_Level__c":"a0x1t000000yZF3AAM","cspmb__Discount_Type__c":"Percentage"},{"Id":"a151t000000y2MDAAY","Name":"RCL1.1","cspmb__Discount_Threshold__c":21,"cspmb__Authorization_Level__c":"a0x1t000001RjC9AAK","cspmb__Discount_Type__c":"Percentage"},{"Id":"a151t000000y2M8AAI","Name":"RCL_1_1","cspmb__Discount_Threshold__c":5,"cspmb__Authorization_Level__c":"a0x1t000001RjC9AAK","cspmb__Discount_Type__c":"Amount"},{"Id":"a151t000000y2M3AAI","Name":"Percentage","cspmb__Discount_Threshold__c":20,"cspmb__Authorization_Level__c":"a0x1t000001RjC4AAK","cspmb__Discount_Type__c":"Percentage"},{"Id":"a151t000000y2LyAAI","Name":"One-off charge","cspmb__Discount_Threshold__c":30,"cspmb__Authorization_Level__c":"a0x1t000001RjBzAAK","cspmb__Discount_Type__c":"Percentage"},{"Id":"a151t000000y2MNAAY","Name":"ADD1","cspmb__Discount_Threshold__c":12,"cspmb__Authorization_Level__c":"a0x1t000001RjCJAA0","cspmb__Discount_Type__c":"Percentage"},{"Id":"a151t000000y2LtAAI","Name":"Recurring Charge","cspmb__Discount_Threshold__c":5,"cspmb__Authorization_Level__c":"a0x1t000001RjBzAAK","cspmb__Discount_Type__c":"Amount"},{"Id":"a151t000000y2MIAAY","Name":"Amount","cspmb__Discount_Threshold__c":3,"cspmb__Authorization_Level__c":"a0x1t000001RjCEAA0","cspmb__Discount_Type__c":"Amount"},{"Id":"a151t000000y2MXAAY","Name":"ADD1","cspmb__Discount_Threshold__c":5,"cspmb__Authorization_Level__c":"a0x1t000001RjCJAA0","cspmb__Discount_Type__c":"Amount"}],
                    FACSettings: FACSettings
                };
                return createPromise(data);

            case "getAddons": // Obsolete
                return createPromise(Addons);

            case "upsertFrameAgreements":
                if (parametersArr[0] !== null) {
                    return createPromise(JSON.parse(parametersArr[1]));
                } else {
                    return createPromise(newFA);
                }

            case "getAttachment":
                return createPromise(attachment);

            case "getRateCards": // Obsolete
                return createPromise(rateCards);

            case "saveAttachment":
                return createPromise(parametersArr[1]);

            case "getCommercialProductData":
                var priceItemData = {};
                parametersArr[0].forEach(priceItemId => {
                    priceItemData[priceItemId] = {
                        Id: priceItemData,
                        addons: Addons,
                        charges: ["a1F1t0000001JC3EAM", "a1F1t0000001JC8EAM", "a1F1t0000001JCDEA2"].includes(priceItemId) ? { priceItemId: priceItemId, charges: [] } : Charges,
                        rateCards: rateCards
                    };
                });
                return createPromise(priceItemData);
        }
    }
};