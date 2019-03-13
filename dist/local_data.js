var SF;

window.localMode = true;

function createPromise(result) {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve(result);
        }, 100);
    });
}

function makeId(n) {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (var i = 0; i < n; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}

function getRandomFromArr(arr) {
    return arr[Math.floor(Math.random() * arr.length)];;
}

function filterProducts(dataArr) {
    dataArr = JSON.parse(dataArr);
    var dataMap = {};
    dataArr.forEach(data => {
        dataMap[data.field] = data.values;
    });

    return commercialProducts.filter( cp => {
        for (var key in dataMap) {
            if (cp.hasOwnProperty(key)) {
                if (!dataMap[key].includes(cp[key])) {
                    return false;
                }
            } else {
                return false;
            }
        };
        return true;
    });
};

const nullValues = false;

const settings = {
    status: "Draft"
    // status: "Active"
};

const approval = {"isApprover":true,"isAdmin":true,"currentUser":"0051t0000025wM9AAI","listProcess":[{"Id":"04g1t0000009p45AAA","StepsAndWorkitems":[{"ProcessInstanceId":"04g1t0000009p45AAA","Id":"04i1t000000956mAAA","ProcessNodeId":"04b1t0000008jGQAAY","StepStatus":"Pending","TargetObjectId":"a1t1t000000ZP3bAAG","ActorId":"00G1t000001acVVEAY","CreatedById":"0051t0000025wM9AAI","IsDeleted":false,"IsPending":true,"OriginalActorId":"00G1t000001acVVEAY","RemindersSent":0,"CreatedDate":1551784837000,"Actor":{"Name":"International - Platinum/Gold","Id":"00G1t000001acVVEAY"},"OriginalActor":{"Name":"International - Platinum/Gold","Id":"00G1t000001acVVEAY"},"ProcessNode":{"Name":"Step1","Id":"04b1t0000008jGQAAY"}},{"ProcessInstanceId":"04g1t0000009p45AAA","Id":"04h1t0000009lhUAAQ","StepStatus":"Started","Comments":"Submitted frame agreement for approval. Please approve.","TargetObjectId":"a1t1t000000ZP3bAAG","ActorId":"0051t0000025wM9AAI","CreatedById":"0051t0000025wM9AAI","IsDeleted":false,"IsPending":false,"OriginalActorId":"0051t0000025wM9AAI","RemindersSent":0,"CreatedDate":1551784837000,"Actor":{"Name":"Marko Ivanetic","Id":"0051t0000025wM9AAI"},"OriginalActor":{"Name":"Marko Ivanetic","Id":"0051t0000025wM9AAI"}}]},{"Id":"04g1t0000009p40AAA","StepsAndWorkitems":[{"ProcessInstanceId":"04g1t0000009p40AAA","Id":"04h1t0000009lhPAAQ","ProcessNodeId":"04b1t0000008jGQAAY","StepStatus":"Removed","Comments":"Recalled by User: Marko Ivanetic","TargetObjectId":"a1t1t000000ZP3bAAG","ActorId":"0051t0000025wM9AAI","CreatedById":"0051t0000025wM9AAI","IsDeleted":false,"IsPending":false,"OriginalActorId":"00G1t000001acVVEAY","RemindersSent":0,"CreatedDate":1551784830000,"Actor":{"Name":"Marko Ivanetic","Id":"0051t0000025wM9AAI"},"OriginalActor":{"Name":"International - Platinum/Gold","Id":"00G1t000001acVVEAY"},"ProcessNode":{"Name":"Step1","Id":"04b1t0000008jGQAAY"}},{"ProcessInstanceId":"04g1t0000009p40AAA","Id":"04h1t0000009lhFAAQ","StepStatus":"Started","Comments":"Submitted frame agreement for approval. Please approve.","TargetObjectId":"a1t1t000000ZP3bAAG","ActorId":"0051t0000025wM9AAI","CreatedById":"0051t0000025wM9AAI","IsDeleted":false,"IsPending":false,"OriginalActorId":"0051t0000025wM9AAI","RemindersSent":0,"CreatedDate":1551784814000,"Actor":{"Name":"Marko Ivanetic","Id":"0051t0000025wM9AAI"},"OriginalActor":{"Name":"Marko Ivanetic","Id":"0051t0000025wM9AAI"}}]},{"Id":"04g1t0000009ouKAAQ","StepsAndWorkitems":[{"ProcessInstanceId":"04g1t0000009ouKAAQ","Id":"04h1t0000009lf3AAA","ProcessNodeId":"04b1t0000008jGQAAY","StepStatus":"Approved","Comments":"Approved by User: Marko Ivanetic","TargetObjectId":"a1t1t000000ZP3bAAG","ActorId":"0051t0000025wM9AAI","CreatedById":"0051t0000025wM9AAI","IsDeleted":false,"IsPending":false,"OriginalActorId":"00G1t000001acVVEAY","RemindersSent":0,"CreatedDate":1551783337000,"Actor":{"Name":"Marko Ivanetic","Id":"0051t0000025wM9AAI"},"OriginalActor":{"Name":"International - Platinum/Gold","Id":"00G1t000001acVVEAY"},"ProcessNode":{"Name":"Step1","Id":"04b1t0000008jGQAAY"}},{"ProcessInstanceId":"04g1t0000009ouKAAQ","Id":"04h1t0000009leKAAQ","StepStatus":"Started","Comments":"Submitted frame agreement for approval. Please approve.","TargetObjectId":"a1t1t000000ZP3bAAG","ActorId":"0051t0000025wM9AAI","CreatedById":"0051t0000025wM9AAI","IsDeleted":false,"IsPending":false,"OriginalActorId":"0051t0000025wM9AAI","RemindersSent":0,"CreatedDate":1551783277000,"Actor":{"Name":"Marko Ivanetic","Id":"0051t0000025wM9AAI"},"OriginalActor":{"Name":"Marko Ivanetic","Id":"0051t0000025wM9AAI"}}]},{"Id":"04g1t0000009ou5AAA","StepsAndWorkitems":[{"ProcessInstanceId":"04g1t0000009ou5AAA","Id":"04h1t0000009ldgAAA","ProcessNodeId":"04b1t0000008jGQAAY","StepStatus":"Removed","Comments":"Testing","TargetObjectId":"a1t1t000000ZP3bAAG","ActorId":"0051t0000025wM9AAI","CreatedById":"0051t0000025wM9AAI","IsDeleted":false,"IsPending":false,"OriginalActorId":"00G1t000001acVVEAY","RemindersSent":0,"CreatedDate":1551783066000,"Actor":{"Name":"Marko Ivanetic","Id":"0051t0000025wM9AAI"},"OriginalActor":{"Name":"International - Platinum/Gold","Id":"00G1t000001acVVEAY"},"ProcessNode":{"Name":"Step1","Id":"04b1t0000008jGQAAY"}},{"ProcessInstanceId":"04g1t0000009ou5AAA","Id":"04h1t0000009ldbAAA","StepStatus":"Started","TargetObjectId":"a1t1t000000ZP3bAAG","ActorId":"0051t0000025wM9AAI","CreatedById":"0051t0000025wM9AAI","IsDeleted":false,"IsPending":false,"OriginalActorId":"0051t0000025wM9AAI","RemindersSent":0,"CreatedDate":1551783045000,"Actor":{"Name":"Marko Ivanetic","Id":"0051t0000025wM9AAI"},"OriginalActor":{"Name":"Marko Ivanetic","Id":"0051t0000025wM9AAI"}}]}]};
const approval2 = { "isApprover": false,"isAdmin":false,"currentUser":"0051t0000025wM9AAI","listProcess": []};

const FACSettings = {
    Price_Item_Fields: "cspmb__Contract_Term__c, cspmb__Recurring_Cost__c",
    FA_Editable_Statuses: "Draft",
    Truncate_CP_Fields: true
};

const frameAgreements = [{
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

const Charges = {
    priceItemId: "a1F1t00000017Y0EAI",
    charges: [{
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
        "Id": "a1A1t0000002cIMEAY",
        "cspmb__Price_Item__c": "a1F1t00000017Y0EAI",
        "cspmb__One_Off_Charge__c": 8.49,
        "cspmb__Recurring_Charge__c": 12.75,
        "cspmb__Add_On_Price_Item__c": "a0w1t0000002hSaAAI",
        "cspmb__Price_Item__r": {
            "cspmb__Effective_Start_Date__c": 1545264000000,
            "Id": "a1F1t00000017Y0EAI"
        },
        "cspmb__Add_On_Price_Item__r": {
            "Name": "ADD1",
            "cspmb__Authorization_Level__c": "a0x1t000001RjCJAA0",
            "Id": "a0w1t0000002hSaAAI"
        }
    },
    {
        "Id": "a1A1t0000003ScfEAE",
        "cspmb__Price_Item__c": "a1F1t00000017Y0EAI",
        "cspmb__One_Off_Charge__c": 8.49,
        "cspmb__Add_On_Price_Item__c": "a0w1t000000zDnNAAU",
        "cspmb__Price_Item__r": {
            "cspmb__Effective_Start_Date__c": 1545264000000,
            "Id": "a1F1t00000017Y0EAI"
        },
        "cspmb__Add_On_Price_Item__r": {
            "Name": "ADD2",
            "cspmb__Authorization_Level__c": "a0x1t000001RjCEAA0",
            "cspmb__Recurring_Charge__c": 82.44,
            "Id": "a0w1t000000zDnNAAU"
        }
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

const attachment = "eyJhMUYxdDAwMDAwMDE3WTBFQUkiOnsiX2NoYXJnZXMiOnsiYTFJMXQwMDAwMDFXa3pvRUFDIjp7Im9uZU9mZiI6NS42fSwiYTFJMXQwMDAwMDFXa3pqRUFDIjp7InJlY3VycmluZyI6OX19LCJfcmF0ZUNhcmRzIjp7ImExTjF0MDAwMDAwMVF4ckVBRSI6eyJhMU0xdDAwMDAwMEJGclZFQVciOjE2Ljk5fX0sIl9hZGRvbnMiOnsiYTFBMXQwMDAwMDAyY0lNRUFZIjp7InJlY3VycmluZyI6Ni43NSwib25lT2ZmIjo3LjQ5fSwiYTFBMXQwMDAwMDAzU2NmRUFFIjp7InJlY3VycmluZyI6NzkuNDQsIm9uZU9mZiI6NC40OX19fSwiYTFGMXQwMDAwMDAxSkJVRUEyIjp7fSwiYTFGMXQwMDAwMDAxSkJlRUFNIjp7Il9yYXRlQ2FyZHMiOnsiYTFOMXQwMDAwMDAxWDJkRUFFIjp7ImExTTF0MDAwMDAwcGVYWkVBWSI6NjEuNDMsImExTTF0MDAwMDAwcGVYZUVBSSI6OC45OX19fX0=";

const DiscLevels = [{"discountLevel":{"Id":"a141t00000137a8AAA","Name":"Test","cspmb__Charge_Type__c":"RC","cspmb__Discount_Type__c":"Percentage","cspmb__Discount_Values__c":"10,20,30"},"levelId":"a141t00000137a8AAA","priceItemId":"a1F1t00000017Y0EAI"},{"discountLevel":{"Id":"a141t00000137cWAAQ","Name":"Invalid","cspmb__Charge_Type__c":"RC","cspmb__Discount_Type__c":"Percentage","cspmb__Discount_Values__c":"12, 34, gg"},"levelId":"a141t00000137cWAAQ","priceItemId":"a1F1t0000001JBPEA2"},{"addonId":"a0w1t0000002hSaAAI","discountLevel":{"Id":"a141t00000137e7AAA","Name":"TestAddons","cspmb__Charge_Type__c":"RC","cspmb__Discount_Type__c":"Amount","cspmb__Discount_Values__c":"10,20,30"},"levelId":"a141t00000137e7AAA"},{"discountLevel":{"Id":"a141t00000137cgAAA","Name":"Test2","cspmb__Charge_Type__c":"RC","cspmb__Discount_Increment__c":"1","cspmb__Discount_Type__c":"Amount","cspmb__Maximum_Discount_Value__c":10,"cspmb__Minimum_Discount_Value__c":5},"levelId":"a141t00000137cgAAA","priceItemId":"a1F1t00000017Y0EAI"},{"discountLevel":{"Id":"a141t00000137hrAAA","Name":"Test2_2","cspmb__Charge_Type__c":"RC","cspmb__Discount_Increment__c":"1","cspmb__Discount_Type__c":"Percentage","cspmb__Maximum_Discount_Value__c":10,"cspmb__Minimum_Discount_Value__c":1},"levelId":"a141t00000137hrAAA","priceItemId":"a1F1t00000017Y0EAI"},{"addonId":"a0w1t0000002hSaAAI","discountLevel":{"Id":"a141t00000137hrAAA","Name":"Test2_2","cspmb__Charge_Type__c":"RC","cspmb__Discount_Increment__c":"1","cspmb__Discount_Type__c":"Percentage","cspmb__Maximum_Discount_Value__c":10,"cspmb__Minimum_Discount_Value__c":1},"levelId":"a141t00000137hrAAA"},{"discountLevel":{"Id":"a141t00000137lLAAQ","Name":"One-off charge","cspmb__Charge_Type__c":"NRC","cspmb__Discount_Type__c":"Percentage","cspmb__Discount_Values__c":"10,20,30"},"levelId":"a141t00000137lLAAQ","priceItemId":"a1F1t00000017Y0EAI"},{"discountLevel":{"Id":"a141t00000137ycAAA","Name":"ProductCharge-11","cspmb__Charge_Type__c":"RC","cspmb__Discount_Type__c":"Percentage","cspmb__Discount_Values__c":"10,20,30"},"levelId":"a141t00000137ycAAA","priceItemId":"a1F1t0000001JC8EAM"}];

const HeaderData = [{
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

const CategorizationData = [{"name":"Alpha","field":"Categorization_Alpha__c","values":["Fixed","Mobile","Static"]},{"name":"Beta","field":"Categorization_Beta__c","values":["10GB","20GB","50GB","100GB"]}];

const ButtonData = [
  {
    "type": "action",
    "label": "Action button",
    "id": "bta1",
    "method": "ActionFunction",
    "hidden": [
      "Active"
    ]
  },
  {
    "type": "iframe",
    "label": "iFrame button",
    "id": "bta2",
    "method": "iFrameFunction",
    "hidden": [
      "Active"
    ]
  },
  {
    "type": "redirect",
    "label": "Redirect button",
    "id": "bta3",
    "method": "RedirectFunction",
    "hidden": [
      "Active"
    ]
  }
];

/*
    window.FAC.registerMethod("RedirectFunction", () => {
         return new Promise(resolve => {
             setTimeout(() => {resolve("https://stackoverflow.com/questions/503093/how-do-i-redirect-to-another-webpage")});
         });
    })

    window.FAC.registerMethod("iFrameFunction", () => {
         return new Promise(resolve => {
             setTimeout(() => {resolve("http://localhost:8080/#/agreement")});
         });
    })

    window.FAC.registerMethod("ActionFunction", () => {
         return new Promise(resolve => {
             setTimeout(() => {resolve("ActionFunction called")});
         });
    })
*/

const commercialProducts = [{"Id":"a1F1t0000001JBoEAM","Name":"Mobile L_7","cspmb__Effective_Start_Date__c":1545264000000,"cspmb__Authorization_Level__c":"a0x1t000000yZF3AAM","cspmb__Is_Authorization_Required__c":false,"cspmb__Contract_Term__c":"24 Months","cspmb__Recurring_Cost__c":69,"Categorization_Alpha__c":"Mobile","Categorization_Beta__c":"100GB"},{"Id":"a1F1t0000001JBUEA2","Name":"Mobile L_3","cspmb__Authorization_Level__c":"a0x1t000000yZF3AAM","cspmb__Is_Authorization_Required__c":false,"cspmb__Contract_Term__c":"24 Months","cspmb__Recurring_Cost__c":69,"Categorization_Alpha__c":"Fixed","Categorization_Beta__c":"100GB","attachmentLoaded":true},{"Id":"a1F1t0000001JBjEAM","Name":"Mobile L_6","cspmb__Effective_Start_Date__c":1545264000000,"cspmb__Authorization_Level__c":"a0x1t000000yZF3AAM","cspmb__Is_Authorization_Required__c":false,"cspmb__Contract_Term__c":"24 Months","cspmb__Recurring_Cost__c":69,"Categorization_Alpha__c":"Static","Categorization_Beta__c":"50GB"},{"Id":"a1F1t0000001JCDEA2","Name":"Mobile L_12","cspmb__Effective_Start_Date__c":1545264000000,"cspmb__Authorization_Level__c":"a0x1t000000yZF3AAM","cspmb__Is_Authorization_Required__c":false,"cspmb__Contract_Term__c":"24 Months","cspmb__Recurring_Cost__c":69,"Categorization_Alpha__c":"Fixed","Categorization_Beta__c":"50GB"},{"Id":"a1F1t0000001JByEAM","Name":"Mobile L_9","cspmb__Effective_Start_Date__c":1545264000000,"cspmb__Authorization_Level__c":"a0x1t000000yZF3AAM","cspmb__Is_Authorization_Required__c":false,"cspmb__Contract_Term__c":"24 Months","cspmb__Recurring_Cost__c":69,"Categorization_Alpha__c":"Mobile","Categorization_Beta__c":"50GB"},{"Id":"a1F1t0000001JC8EAM","Name":"Mobile L_11","cspmb__Effective_Start_Date__c":1545264000000,"cspmb__Authorization_Level__c":"a0x1t000001RjC4AAK","cspmb__Is_Authorization_Required__c":false,"cspmb__Contract_Term__c":"24 Months","cspmb__Recurring_Cost__c":69,"Categorization_Alpha__c":"Static","Categorization_Beta__c":"20GB"},{"Id":"a1F1t0000001JBeEAM","Name":"Mobile L_5","cspmb__Authorization_Level__c":"a0x1t000000yZF3AAM","cspmb__Is_Authorization_Required__c":false,"cspmb__Contract_Term__c":"24 Months","cspmb__Recurring_Cost__c":69,"Categorization_Alpha__c":"Fixed","Categorization_Beta__c":"10GB","attachmentLoaded":true},{"Id":"a1F1t0000001JBtEAM","Name":"Mobile L_8","cspmb__Effective_Start_Date__c":1545264000000,"cspmb__Authorization_Level__c":"a0x1t000000yZF3AAM","cspmb__Is_Authorization_Required__c":false,"cspmb__Contract_Term__c":"24 Months","cspmb__Recurring_Cost__c":69,"Categorization_Alpha__c":"Mobile","Categorization_Beta__c":"20GB"},{"Id":"a1F1t0000001JC3EAM","Name":"Mobile L_10","cspmb__Effective_Start_Date__c":1545264000000,"cspmb__Authorization_Level__c":"a0x1t000000yZF3AAM","cspmb__Is_Authorization_Required__c":false,"cspmb__Contract_Term__c":"24 Months","cspmb__Recurring_Cost__c":69,"Categorization_Alpha__c":"Static","Categorization_Beta__c":"10GB"},{"Id":"a1F1t00000017Y0EAI","Name":"Mobile L","cspmb__Effective_Start_Date__c":1545264000000,"cspmb__Authorization_Level__c":"a0x1t000001RjBzAAK","cspmb__Is_Authorization_Required__c":false,"cspmb__Contract_Term__c":"24 Months","cspmb__Recurring_Cost__c":69,"attachmentLoaded":true}];

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
    apiSession: "{!$Api.Session_ID}",
    invokeAction: function(remoteActionName, parametersArr = []) {
        let data = null;
        switch (remoteActionName) {
            case "getFrameAgreements":
                return createPromise(frameAgreements);

            case "getCommercialProducts":
                return createPromise(commercialProducts);

            case "cloneFrameAgreement":
                var faArr = frameAgreements.filter(fa => {
                    return fa.Id === parametersArr[0];
                });
                var fa = JSON.parse(JSON.stringify(faArr[0]));
                fa.Id = fa.Id.slice(0, -3) + makeId(3);
                frameAgreements.push(fa);
                return createPromise(fa);

            case "getAppSettings":
                data = {
                    commercialProductCount: 10,
                    frameAgreementsCount: 1,
                    itemsPerPage: 20,
                    ButtonData: ButtonData,
                    CategorizationData: CategorizationData,
                    HeaderData: HeaderData,
                    DiscLevels: DiscLevels,
                    AuthLevels: [{ "Id": "a151t000000rmV7AAI", "Name": "RCL1.1", "cspmb__Discount_Threshold__c": 10, "cspmb__Authorization_Level__c": "a0x1t000000yZF3AAM", "cspmb__Discount_Type__c": "Percentage" }, { "Id": "a151t000000y2MDAAY", "Name": "RCL1.1", "cspmb__Discount_Threshold__c": 21, "cspmb__Authorization_Level__c": "a0x1t000001RjC9AAK", "cspmb__Discount_Type__c": "Percentage" }, { "Id": "a151t000000y2M8AAI", "Name": "RCL_1_1", "cspmb__Discount_Threshold__c": 5, "cspmb__Authorization_Level__c": "a0x1t000001RjC9AAK", "cspmb__Discount_Type__c": "Amount" }, { "Id": "a151t000000y2M3AAI", "Name": "Percentage", "cspmb__Discount_Threshold__c": 20, "cspmb__Authorization_Level__c": "a0x1t000001RjC4AAK", "cspmb__Discount_Type__c": "Percentage" }, { "Id": "a151t000000y2LyAAI", "Name": "One-off charge", "cspmb__Discount_Threshold__c": 30, "cspmb__Authorization_Level__c": "a0x1t000001RjBzAAK", "cspmb__Discount_Type__c": "Percentage" }, { "Id": "a151t000000y2MNAAY", "Name": "ADD1", "cspmb__Discount_Threshold__c": 12, "cspmb__Authorization_Level__c": "a0x1t000001RjCJAA0", "cspmb__Discount_Type__c": "Percentage" }, { "Id": "a151t000000y2LtAAI", "Name": "Recurring Charge", "cspmb__Discount_Threshold__c": 5, "cspmb__Authorization_Level__c": "a0x1t000001RjBzAAK", "cspmb__Discount_Type__c": "Amount" }, { "Id": "a151t000000y2MIAAY", "Name": "Amount", "cspmb__Discount_Threshold__c": 3, "cspmb__Authorization_Level__c": "a0x1t000001RjCEAA0", "cspmb__Discount_Type__c": "Amount" }, { "Id": "a151t000000y2MXAAY", "Name": "ADD1", "cspmb__Discount_Threshold__c": 5, "cspmb__Authorization_Level__c": "a0x1t000001RjCJAA0", "cspmb__Discount_Type__c": "Amount" }],
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

            case "getAttachmentBody":
                return createPromise(attachment);

            case "getApprovalHistory":
                return createPromise(getRandomFromArr([approval, approval2]));

            case "getRateCards": // Obsolete
                return createPromise(rateCards);

            case "approveRejectRecallRecord": // Obsolete
                return createPromise(true);

            case "reassignApproval": // Obsolete
                return createPromise(true);

            case "submitForApproval": // Obsolete
                return createPromise(getRandomFromArr([true, true, false]));

            case "saveAttachment":
                return createPromise(parametersArr[1]);

            case "filterCommercialProducts":
                return createPromise(filterProducts(parametersArr[0]));            

            case "deleteFrameAgreement":
                return createPromise("Success");

            case "getCommercialProductData":
                var priceItemData = {};
                parametersArr[0].forEach(priceItemId => {
                    priceItemData[priceItemId] = {
                        Id: priceItemData,
                        addons: [...Addons.map(addon => { addon.cspmb__Add_On_Price_Item__c += priceItemId; return addon })],
                        charges: ["a1F1t0000001JC3EAM", "a1F1t0000001JC8EAM", "a1F1t0000001JCDEA2"].includes(priceItemId) ? { priceItemId: priceItemId, charges: [] } : Charges,
                        rateCards: rateCards
                    };
                });
                return createPromise(priceItemData);
        }
    }
};