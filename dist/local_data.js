var SF;

window.localMode = true;

function createPromise(result, timeout = 100) {
	return new Promise(resolve => {
		setTimeout(() => {
			resolve(result);
		}, timeout);
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

	return commercialProducts.filter(cp => {
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

const approval = {
	"isApprover": true,
	"isAdmin": true,
	"currentUser": "0051t0000025wM9AAI",
	"listProcess": [{
		"Id": "04g1t0000009p45AAA",
		"StepsAndWorkitems": [{
			"ProcessInstanceId": "04g1t0000009p45AAA",
			"Id": "04i1t000000956mAAA",
			"ProcessNodeId": "04b1t0000008jGQAAY",
			"StepStatus": "Pending",
			"TargetObjectId": "a1t1t000000ZP3bAAG",
			"ActorId": "00G1t000001acVVEAY",
			"CreatedById": "0051t0000025wM9AAI",
			"IsDeleted": false,
			"IsPending": true,
			"OriginalActorId": "00G1t000001acVVEAY",
			"RemindersSent": 0,
			"CreatedDate": 1551784837000,
			"Actor": {
				"Name": "International - Platinum/Gold",
				"Id": "00G1t000001acVVEAY"
			},
			"OriginalActor": {
				"Name": "International - Platinum/Gold",
				"Id": "00G1t000001acVVEAY"
			},
			"ProcessNode": {
				"Name": "Step1",
				"Id": "04b1t0000008jGQAAY"
			}
		}, {
			"ProcessInstanceId": "04g1t0000009p45AAA",
			"Id": "04h1t0000009lhUAAQ",
			"StepStatus": "Started",
			"Comments": "Submitted frame agreement for approval. Please approve.",
			"TargetObjectId": "a1t1t000000ZP3bAAG",
			"ActorId": "0051t0000025wM9AAI",
			"CreatedById": "0051t0000025wM9AAI",
			"IsDeleted": false,
			"IsPending": false,
			"OriginalActorId": "0051t0000025wM9AAI",
			"RemindersSent": 0,
			"CreatedDate": 1551784837000,
			"Actor": {
				"Name": "Marko Ivanetic",
				"Id": "0051t0000025wM9AAI"
			},
			"OriginalActor": {
				"Name": "Marko Ivanetic",
				"Id": "0051t0000025wM9AAI"
			}
		}]
	}, {
		"Id": "04g1t0000009p40AAA",
		"StepsAndWorkitems": [{
			"ProcessInstanceId": "04g1t0000009p40AAA",
			"Id": "04h1t0000009lhPAAQ",
			"ProcessNodeId": "04b1t0000008jGQAAY",
			"StepStatus": "Removed",
			"Comments": "Recalled by User: Marko Ivanetic",
			"TargetObjectId": "a1t1t000000ZP3bAAG",
			"ActorId": "0051t0000025wM9AAI",
			"CreatedById": "0051t0000025wM9AAI",
			"IsDeleted": false,
			"IsPending": false,
			"OriginalActorId": "00G1t000001acVVEAY",
			"RemindersSent": 0,
			"CreatedDate": 1551784830000,
			"Actor": {
				"Name": "Marko Ivanetic",
				"Id": "0051t0000025wM9AAI"
			},
			"OriginalActor": {
				"Name": "International - Platinum/Gold",
				"Id": "00G1t000001acVVEAY"
			},
			"ProcessNode": {
				"Name": "Step1",
				"Id": "04b1t0000008jGQAAY"
			}
		}, {
			"ProcessInstanceId": "04g1t0000009p40AAA",
			"Id": "04h1t0000009lhFAAQ",
			"StepStatus": "Started",
			"Comments": "Submitted frame agreement for approval. Please approve.",
			"TargetObjectId": "a1t1t000000ZP3bAAG",
			"ActorId": "0051t0000025wM9AAI",
			"CreatedById": "0051t0000025wM9AAI",
			"IsDeleted": false,
			"IsPending": false,
			"OriginalActorId": "0051t0000025wM9AAI",
			"RemindersSent": 0,
			"CreatedDate": 1551784814000,
			"Actor": {
				"Name": "Marko Ivanetic",
				"Id": "0051t0000025wM9AAI"
			},
			"OriginalActor": {
				"Name": "Marko Ivanetic",
				"Id": "0051t0000025wM9AAI"
			}
		}]
	}, {
		"Id": "04g1t0000009ouKAAQ",
		"StepsAndWorkitems": [{
			"ProcessInstanceId": "04g1t0000009ouKAAQ",
			"Id": "04h1t0000009lf3AAA",
			"ProcessNodeId": "04b1t0000008jGQAAY",
			"StepStatus": "Approved",
			"Comments": "Approved by User: Marko Ivanetic",
			"TargetObjectId": "a1t1t000000ZP3bAAG",
			"ActorId": "0051t0000025wM9AAI",
			"CreatedById": "0051t0000025wM9AAI",
			"IsDeleted": false,
			"IsPending": false,
			"OriginalActorId": "00G1t000001acVVEAY",
			"RemindersSent": 0,
			"CreatedDate": 1551783337000,
			"Actor": {
				"Name": "Marko Ivanetic",
				"Id": "0051t0000025wM9AAI"
			},
			"OriginalActor": {
				"Name": "International - Platinum/Gold",
				"Id": "00G1t000001acVVEAY"
			},
			"ProcessNode": {
				"Name": "Step1",
				"Id": "04b1t0000008jGQAAY"
			}
		}, {
			"ProcessInstanceId": "04g1t0000009ouKAAQ",
			"Id": "04h1t0000009leKAAQ",
			"StepStatus": "Started",
			"Comments": "Submitted frame agreement for approval. Please approve.",
			"TargetObjectId": "a1t1t000000ZP3bAAG",
			"ActorId": "0051t0000025wM9AAI",
			"CreatedById": "0051t0000025wM9AAI",
			"IsDeleted": false,
			"IsPending": false,
			"OriginalActorId": "0051t0000025wM9AAI",
			"RemindersSent": 0,
			"CreatedDate": 1551783277000,
			"Actor": {
				"Name": "Marko Ivanetic",
				"Id": "0051t0000025wM9AAI"
			},
			"OriginalActor": {
				"Name": "Marko Ivanetic",
				"Id": "0051t0000025wM9AAI"
			}
		}]
	}, {
		"Id": "04g1t0000009ou5AAA",
		"StepsAndWorkitems": [{
			"ProcessInstanceId": "04g1t0000009ou5AAA",
			"Id": "04h1t0000009ldgAAA",
			"ProcessNodeId": "04b1t0000008jGQAAY",
			"StepStatus": "Removed",
			"Comments": "Testing",
			"TargetObjectId": "a1t1t000000ZP3bAAG",
			"ActorId": "0051t0000025wM9AAI",
			"CreatedById": "0051t0000025wM9AAI",
			"IsDeleted": false,
			"IsPending": false,
			"OriginalActorId": "00G1t000001acVVEAY",
			"RemindersSent": 0,
			"CreatedDate": 1551783066000,
			"Actor": {
				"Name": "Marko Ivanetic",
				"Id": "0051t0000025wM9AAI"
			},
			"OriginalActor": {
				"Name": "International - Platinum/Gold",
				"Id": "00G1t000001acVVEAY"
			},
			"ProcessNode": {
				"Name": "Step1",
				"Id": "04b1t0000008jGQAAY"
			}
		}, {
			"ProcessInstanceId": "04g1t0000009ou5AAA",
			"Id": "04h1t0000009ldbAAA",
			"StepStatus": "Started",
			"TargetObjectId": "a1t1t000000ZP3bAAG",
			"ActorId": "0051t0000025wM9AAI",
			"CreatedById": "0051t0000025wM9AAI",
			"IsDeleted": false,
			"IsPending": false,
			"OriginalActorId": "0051t0000025wM9AAI",
			"RemindersSent": 0,
			"CreatedDate": 1551783045000,
			"Actor": {
				"Name": "Marko Ivanetic",
				"Id": "0051t0000025wM9AAI"
			},
			"OriginalActor": {
				"Name": "Marko Ivanetic",
				"Id": "0051t0000025wM9AAI"
			}
		}]
	}]
};
const approval2 = {
	"isApprover": false,
	"isAdmin": false,
	"currentUser": "0051t0000025wM9AAI",
	"listProcess": []
};

const FACSettings = {
	fa_editable_statuses: "Draft",
	price_item_fields: "cspmb__Contract_Term__c",
	show_volume_fields: true,
	decomposition_chunk_size: 2,
	rcl_fields: "cspmb__Currency_Code__c, Category__c",
	statuses: {
		"active_status": "Active",
		"approved_status": "Approved",
		"closed_status": "Closed",
		"draft_status": "Draft",
		"requires_approval_status": "Requires Approval"
	},
	truncate_product_fields: true,
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
				cspmb__Currency_Code__c: "Euro",
				Category__c: "Cat_A",
				cspmb__rate_value__c: nullValues ? null : 18.29,
				cspmb__Rate_Card__c: "a1N1t0000001QxrEAE"
			},
			{
				Id: "a1M1t000000BFrVEAA",
				Name: "RCL1.2",
				cspmb__Cap_Unit__c: "Sample Cap Unit",
				cspmb__Currency_Code__c: "Dollar",
				Category__c: "Cat_B",
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
				cspmb__Currency_Code__c: "Dollar",
				Category__c: "Cat_A",
				cspmb__rate_value__c: nullValues ? null : 4.99,
				cspmb__Rate_Card__c: "a1N1t0000001QxrEAF"
			},
			{
				Id: "a1M1t000000BFrVEAU",
				Name: "RCL2.2",
				cspmb__Cap_Unit__c: "Sample Cap Unit",
				cspmb__Currency_Code__c: "Euro",
				Category__c: "Cat_C",
				cspmb__rate_value__c: nullValues ? null : 15.59,
				cspmb__Rate_Card__c: "a1N1t0000001QxrEAF"
			}
		]
	}
];

const attachment = "eyJhMUYxdDAwMDAwMDFKQmpFQU0iOnsiX3ZvbHVtZSI6eyJtdiI6bnVsbCwibXZwIjpudWxsLCJtdWMiOm51bGwsIm11Y3AiOm51bGx9LCJfYWRkb25zIjp7ImExQTF0MDAwMDAwM1NibkVBRSI6e319LCJfcHJvZHVjdCI6eyJyZWN1cnJpbmciOjI2Nn19LCJhMUYxdDAwMDAwMDFKQ0RFQTIiOnsiX3ZvbHVtZSI6eyJtdiI6bnVsbCwibXZwIjpudWxsLCJtdWMiOm51bGwsIm11Y3AiOm51bGx9LCJfcHJvZHVjdCI6eyJyZWN1cnJpbmciOjI2M319LCJhMUYxdDAwMDAwMDFKQzhFQU0iOnsiX3ZvbHVtZSI6eyJtdiI6bnVsbCwibXZwIjpudWxsLCJtdWMiOm51bGwsIm11Y3AiOm51bGx9LCJfcHJvZHVjdCI6eyJyZWN1cnJpbmciOjIzOS40MX19LCJhMUYxdDAwMDAwMDE3WTBFQUkiOnsiX3ZvbHVtZSI6eyJtdiI6bnVsbCwibXZwIjpudWxsLCJtdWMiOm51bGwsIm11Y3AiOm51bGx9LCJfYWRkb25zIjp7ImExQTF0MDAwMDAwMmNJTUVBWSI6eyJvbmVPZmYiOjcuNjQsInJlY3VycmluZyI6Ny43NX0sImExQTF0MDAwMDAwM1NjZkVBRSI6eyJvbmVPZmYiOjcuNDksInJlY3VycmluZyI6NzkuNDR9fSwiX2NoYXJnZXMiOnsiYTFJMXQwMDAwMDFXa3pvRUFDIjp7Im9uZU9mZiI6N30sImExSTF0MDAwMDAxV2t6akVBQyI6eyJyZWN1cnJpbmciOjEyfX0sIl9yYXRlQ2FyZHMiOnsiYTFOMXQwMDAwMDAxUXhyRUFFIjp7ImExTTF0MDAwMDAwQkZyVkVBVyI6MTI0Ljk5fX19fQ";

const DiscLevels = [{
	"discountLevel": {
		"Id": "a141t00000137a8AAA",
		"Name": "Test",
		"cspmb__Charge_Type__c": "RC",
		"cspmb__Discount_Type__c": "Percentage",
		"cspmb__Discount_Values__c": "10,20,30"
	},
	"levelId": "a141t00000137a8AAA",
	"priceItemId": "a1F1t00000017Y0EAI"
}, {
	"discountLevel": {
		"Id": "a141t00000137cWAAQ",
		"Name": "Invalid",
		"cspmb__Charge_Type__c": "RC",
		"cspmb__Discount_Type__c": "Percentage",
		"cspmb__Discount_Values__c": "12, 34, gg"
	},
	"levelId": "a141t00000137cWAAQ",
	"priceItemId": "a1F1t0000001JBPEA2"
}, {
	"addonId": "a0w1t0000002hSaAAI",
	"discountLevel": {
		"Id": "a141t00000137e7AAA",
		"Name": "TestAddons",
		"cspmb__Charge_Type__c": "RC",
		"cspmb__Discount_Type__c": "Amount",
		"cspmb__Discount_Values__c": "10,20,30"
	},
	"levelId": "a141t00000137e7AAA"
}, {
	"discountLevel": {
		"Id": "a141t00000137cgAAA",
		"Name": "Test2",
		"cspmb__Charge_Type__c": "RC",
		"cspmb__Discount_Increment__c": "1",
		"cspmb__Discount_Type__c": "Amount",
		"cspmb__Maximum_Discount_Value__c": 10,
		"cspmb__Minimum_Discount_Value__c": 5
	},
	"levelId": "a141t00000137cgAAA",
	"priceItemId": "a1F1t00000017Y0EAI"
}, {
	"discountLevel": {
		"Id": "a141t00000137hrAAA",
		"Name": "Test2_2",
		"cspmb__Charge_Type__c": "RC",
		"cspmb__Discount_Increment__c": "1",
		"cspmb__Discount_Type__c": "Percentage",
		"cspmb__Maximum_Discount_Value__c": 10,
		"cspmb__Minimum_Discount_Value__c": 1
	},
	"levelId": "a141t00000137hrAAA",
	"priceItemId": "a1F1t00000017Y0EAI"
}, {
	"addonId": "a0w1t0000002hSaAAI",
	"discountLevel": {
		"Id": "a141t00000137hrAAA",
		"Name": "Test2_2",
		"cspmb__Charge_Type__c": "RC",
		"cspmb__Discount_Increment__c": "1",
		"cspmb__Discount_Type__c": "Percentage",
		"cspmb__Maximum_Discount_Value__c": 10,
		"cspmb__Minimum_Discount_Value__c": 1
	},
	"levelId": "a141t00000137hrAAA"
}, {
	"discountLevel": {
		"Id": "a141t00000137lLAAQ",
		"Name": "One-off charge",
		"cspmb__Charge_Type__c": "NRC",
		"cspmb__Discount_Type__c": "Percentage",
		"cspmb__Discount_Values__c": "10,20,30"
	},
	"levelId": "a141t00000137lLAAQ",
	"priceItemId": "a1F1t00000017Y0EAI"
}, {
	"discountLevel": {
		"Id": "a141t00000137ycAAA",
		"Name": "ProductCharge-11",
		"cspmb__Charge_Type__c": "RC",
		"cspmb__Discount_Type__c": "Percentage",
		"cspmb__Discount_Values__c": "10,20,30"
	},
	"levelId": "a141t00000137ycAAA",
	"priceItemId": "a1F1t0000001JC8EAM"
}];

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

const CategorizationData = [{
	"name": "Alpha",
	"field": "Categorization_Alpha__c",
	"values": ["Fixed", "Mobile", "Static"]
}, {
	"name": "Beta",
	"field": "Categorization_Beta__c",
	"values": ["10GB", "20GB", "50GB", "100GB"]
}];

const ButtonCustomData = [{
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

const ButtonStandardData = {
	"Save": ["Draft", "Requires Approval"],
	"SubmitForApproval": ["Requires Approval"],
	"Submit": ["Draft", "Approved"],
	"DeleteProducts": ["Draft", "Requires Approval"],
	"BulkNegotiate": ["Draft", "Requires Approval"],
	"AddProducts": ["Draft", "Requires Approval"]
};

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

const commercialProducts = [{
	"Id": "a1F1t0000001JBoEAM",
	"Name": "Mobile L_7",
	"cspmb__Effective_Start_Date__c": 1545264000000,
	"cspmb__Recurring_Charge__c": 269,
	"cspmb__Authorization_Level__c": "a0x1t000000yZF3AAM",
	"cspmb__Is_Authorization_Required__c": false,
	"cspmb__Price_Item_Description__c": "30 Gb Internet + 5000 minutes/SMS",
	"cspmb__Contract_Term__c": "24 Months",
	"Categorization_Alpha__c": "Mobile",
	"Categorization_Beta__c": "100GB"
}, {
	"Id": "a1F1t0000001JBZEA2",
	"Name": "Mobile L_4",
	"cspmb__Effective_Start_Date__c": 1547337600000,
	"cspmb__Effective_End_Date__c": 1583625600000,
	"cspmb__Recurring_Charge__c": 269,
	"cspmb__Authorization_Level__c": "a0x1t000000yZF3AAM",
	"cspmb__Is_Authorization_Required__c": false,
	"cspmb__Price_Item_Description__c": "30 Gb Internet + 5000 minutes/SMS",
	"cspmb__Contract_Term__c": "24 Months",
	"Categorization_Alpha__c": "Static",
	"Categorization_Beta__c": "100GB"
}, {
	"Id": "a1F1t0000001JBUEA2",
	"Name": "Mobile L_3",
	"cspmb__Recurring_Charge__c": 269,
	"cspmb__Authorization_Level__c": "a0x1t000000yZF3AAM",
	"cspmb__Is_Authorization_Required__c": false,
	"cspmb__Price_Item_Description__c": "30 Gb Internet + 5000 minutes/SMS",
	"cspmb__Contract_Term__c": "24 Months",
	"Categorization_Alpha__c": "Fixed",
	"Categorization_Beta__c": "100GB"
}, {
	"Id": "a1F1t0000001JBjEAM",
	"Name": "Mobile L_6",
	"cspmb__Effective_Start_Date__c": 1545264000000,
	"cspmb__Recurring_Charge__c": 269,
	"cspmb__Authorization_Level__c": "a0x1t000000yZF3AAM",
	"cspmb__Is_Authorization_Required__c": false,
	"cspmb__Price_Item_Description__c": "30 Gb Internet + 5000 minutes/SMS",
	"cspmb__Contract_Term__c": "24 Months",
	"Categorization_Alpha__c": "Static",
	"Categorization_Beta__c": "50GB"
}, {
	"Id": "a1F1t0000001JCDEA2",
	"Name": "Mobile L_12",
	"cspmb__Effective_Start_Date__c": 1545264000000,
	"cspmb__Recurring_Charge__c": 269,
	"cspmb__Authorization_Level__c": "a0x1t000000yZF3AAM",
	"cspmb__Is_Authorization_Required__c": false,
	"cspmb__Price_Item_Description__c": "30 Gb Internet + 5000 minutes/SMS",
	"cspmb__Contract_Term__c": "24 Months",
	"Categorization_Alpha__c": "Fixed",
	"Categorization_Beta__c": "50GB"
}, {
	"Id": "a1F1t0000001JByEAM",
	"Name": "Mobile L_9",
	"cspmb__Effective_Start_Date__c": 1545264000000,
	"cspmb__Recurring_Charge__c": 269,
	"cspmb__Authorization_Level__c": "a0x1t000000yZF3AAM",
	"cspmb__Is_Authorization_Required__c": false,
	"cspmb__Price_Item_Description__c": "30 Gb Internet + 5000 minutes/SMS",
	"cspmb__Contract_Term__c": "24 Months",
	"Categorization_Alpha__c": "Mobile",
	"Categorization_Beta__c": "50GB"
}, {
	"Id": "a1F1t0000001JC8EAM",
	"Name": "Mobile L_11",
	"cspmb__Effective_Start_Date__c": 1545264000000,
	"cspmb__Recurring_Charge__c": 269,
	"cspmb__Authorization_Level__c": "a0x1t000001RjC4AAK",
	"cspmb__Is_Authorization_Required__c": false,
	"cspmb__Price_Item_Description__c": "30 Gb Internet + 5000 minutes/SMS",
	"cspmb__Contract_Term__c": "24 Months",
	"Categorization_Alpha__c": "Static",
	"Categorization_Beta__c": "20GB"
}, {
	"Id": "a1F1t0000001JBeEAM",
	"Name": "Mobile L_5",
	"cspmb__Recurring_Charge__c": 269,
	"cspmb__Authorization_Level__c": "a0x1t000000yZF3AAM",
	"cspmb__Is_Authorization_Required__c": false,
	"cspmb__Price_Item_Description__c": "30 Gb Internet + 5000 minutes/SMS",
	"cspmb__Contract_Term__c": "24 Months",
	"Categorization_Alpha__c": "Fixed",
	"Categorization_Beta__c": "10GB"
}, {
	"Id": "a1F1t0000001JBtEAM",
	"Name": "Mobile L_8",
	"cspmb__Effective_Start_Date__c": 1545264000000,
	"cspmb__Recurring_Charge__c": 269,
	"cspmb__Authorization_Level__c": "a0x1t000000yZF3AAM",
	"cspmb__Is_Authorization_Required__c": false,
	"cspmb__Price_Item_Description__c": "30 Gb Internet + 5000 minutes/SMS",
	"cspmb__Contract_Term__c": "24 Months",
	"Categorization_Alpha__c": "Mobile",
	"Categorization_Beta__c": "20GB"
}, {
	"Id": "a1F1t0000001JC3EAM",
	"Name": "Mobile L_10",
	"cspmb__Effective_Start_Date__c": 1545264000000,
	"cspmb__Recurring_Charge__c": 269,
	"cspmb__Authorization_Level__c": "a0x1t000000yZF3AAM",
	"cspmb__Is_Authorization_Required__c": false,
	"cspmb__Price_Item_Description__c": "30 Gb Internet + 5000 minutes/SMS",
	"cspmb__Contract_Term__c": "24 Months",
	"Categorization_Alpha__c": "Static",
	"Categorization_Beta__c": "10GB"
}, {
	"Id": "a1F1t00000017Y0EAI",
	"Name": "Mobile L",
	"cspmb__Effective_Start_Date__c": 1545264000000,
	"cspmb__Recurring_Charge__c": 269,
	"cspmb__Authorization_Level__c": "a0x1t000001RjBzAAK",
	"cspmb__Is_Authorization_Required__c": false,
	"cspmb__Price_Item_Description__c": "30 Gb Internet + 5000 minutes/SMS",
	"cspmb__Contract_Term__c": "24 Months"
}];

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
	labels: {
		frameAgreementTitle: "Frame Agreement Negotiation Console",
		frameAgreementListTitle: "Agreement List",
		input_quickSearchPlaceholder: "Quick search",
		faMenuActionDelete: "Delete",
		faMenuActionClone: "Clone",
		faMenuActionEdit: "Edit",
		btn_AddNewAgreement: "Add new Agreement",
		header_frameAgreementEditorTitle: "Frame Agreement Details",
		header_customDropdownPlaceholder: "Custom",
		btn_Save: "Save",
		btn_SubmitForApproval: "Submit For Approval",
		btn_Submit: "Decompose",
		btn_BulkNegotiate: "Negotiate Products",
		btn_DeleteProducts: "Delete Products",
		btn_AddProducts: "Add Products",
		approval_title: "Approval history",
		approval_action_approve: "Approve",
		approval_action_reject: "Reject",
		approval_action_reassign: "Reassign",
		approval_action_recall: "Recall",
		approval_table_header_action: "Action",
		approval_table_header_date: "Date",
		approval_table_header_status: "Status",
		approval_table_header_assignedTo: "Assigned to",
		approval_table_header_actualApprover: "Actual Approver",
		approval_table_header_comments: "Comments",
		products_title: "Products",
		products_display_columns: "Display Columns",
		products_volume_minVol: "Minimum vol",
		products_volume_minVolPeriod: "Minimum vol. period",
		products_volume_minUsageComm: "Min. usage commitment",
		products_volume_minUsageCommPeriod: "Min. usage commitment period",
		products_productNameHeaderCell: "Product name",
		products_addons: "Add-Ons",
		products_charges: "Charges",
		products_product_charges: "Charges (product)",
		products_rates: "Rates",
		modal_addProduct_title: "Add Product to Frame Agreement",
		modal_addProduct_input_search_placeholder: "Filter products",
		modal_categorization_switch: "Product categorisation panel",
		modal_categorization_title: "Product Categorization",
		modal_categorization_btn_clear: "Clear Filter",
		modal_categorization_btn_apply: "Apply Filter",
		modal_categorization_btn_add: "Add Selected",
		modal_bulk_title: "Bulk Negotiation",
		modal_bulk_selected_title: "Selected Products",
		modal_bulk_discount_title: "Discount options",
		modal_bulk_discount_input_title: "Discount to selection",
		modal_bulk_btn_percentage: "Percentage",
		modal_bulk_btn_fixed: "Fixed Amount",
		modal_bulk_btn_apply: "Apply discount",
		modal_bulk_btn_save: "Save to Frame Agreement",
		modal_bulk_input_placeholder: "Enter discount value",
		modal_charge_table_header_presentIn: "Present In",
		modal_charge_table_header_oneOff: "One-Off",
		modal_charge_table_header_recurring: "Recurring",
		modal_charge_table_header_chargeType: "Charge Type",
		modal_charge_table_header_value: "Value",
		modal_charge_table_header_unit: "Unit",
		modal_charge_table_header_rateValue: "Rate Value",
		modal_bluk_rateFilter_title: "Filter Rate Card Lines",
		modal_bluk_rateFilter_propertyTitle: "Select rate card line property:",
		modal_bluk_rateFilter_propertyValueTitle: "Select value:",
		modal_bluk_rateFilter_dropdownPlaceholder: "-- select a property ---",
		alert_deleteProducts_title: "Delete products",
		alert_deleteProducts_message: "Are you sure you want to delete selected products?",
		alert_deleteProducts_btn_action: "Delete",
		alert_cloneFa_title: "Clone Frame Agreement",
		alert_cloneFa_message: "Are you sure you want to clone this frame agreement?",
		alert_cloneFa_btn_action: "Clone",
		alert_btn_cancel: "Cancel",
		btn_NewVersion: "Create New Version",
		modal_charge_table_header_name: "Name",
		products_title_empty: "Product Negotiation",
		save_fa_message: "Save frame agreement before adding products!",
		save_fa_products_message: "They will be visible as soon as you create them.",
		no_fa_message: "There are no Frame Agreements in here.",
		no_fa_message_2: "Create at least one frame agreements.",
		addons_header_name: "Name",
		addons_header_oneOff: "One Off Charge",
		addons_header_oneOff_neg: "Negotiated One Off",
		addons_header_recc: "Recurring Charge",
		addons_header_recc_neg: "Negotiated Recurring",
		charges_header_name: "Charge Name",
		charges_header_type: "Charge Type",
		charges_header_oneOff: "One-Off Adjustment",
		charges_header_neg: "Negotiated One Off",
		charges_header_recc: "Recurring Adjustment",
		charges_header_recc_neg: "Negotiated Recurring",
		product_charge_header_name: "Charge Name",
		product_charge_header_oneOff: "One-Off Adjustment",
		product_charge_header_oneOff_neg: "Negotiated One Off",
		product_charge_header_recc: "Recurring Adjustment",
		product_charge_header_recc_neg: "Negotiated Recurring",
		rate_cards_header_name: "Name",
		rate_cards_header_value: "Rate Value",
		rate_cards_header_value_neg: "Negotiated Value",
		util_datepicker_today: "Today",
		util_negotiation_input_diff_label: "negotiated",
		util_input_text_enter: "Enter",
		toast_approvalAction_success: "action successful!",
		toast_approvalAction_failed: "action failed!",
		toast_success_title: "Submitted!",
		toast_failed_title: "Failed!",
		toast_submitForApproval_success: "Successfuly submitted for approval!",
		toast_submitForApproval_failed: "Unable to start approval process.",
		toast_decomposition_title_failed: "Decomposition failed!",
		toast_decomposition_failed: "Deleting associations made from this attempt.",
		toast_decomposition_title_revered: "Decomposition reverted!",
		toast_decomposition_revered: "Deleted all created associations.",
		toast_decomposition_title_success: "Decomposition succeded!",
		toast_decomposition_success: "Created associations",
		toast_invalid_handler_title: "Invalid handler!",
		toast_invalid_handler: "Handler not defined",
		toast_saved_fa: "Successfuly saved frame agreement.!",
		toast_created_fa: "Successfuly created new frame agreement.!",
		toast_discount_calculated_title: "Discount calculated!",
		toast_discount_calculated: "Changes have to be saved to Frame Agreement.!"
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
					ButtonCustomData: getRandomFromArr([ButtonCustomData, ButtonCustomData.slice(0, 2)]),
					ButtonStandardData: ButtonStandardData,
					CategorizationData: CategorizationData,
					HeaderData: HeaderData,
					DiscLevels: DiscLevels,
					AuthLevels: [{
						"Id": "a151t000000rmV7AAI",
						"Name": "RCL1.1",
						"cspmb__Discount_Threshold__c": 10,
						"cspmb__Authorization_Level__c": "a0x1t000000yZF3AAM",
						"cspmb__Discount_Type__c": "Percentage"
					}, {
						"Id": "a151t000000y2MDAAY",
						"Name": "RCL1.1",
						"cspmb__Discount_Threshold__c": 21,
						"cspmb__Authorization_Level__c": "a0x1t000001RjC9AAK",
						"cspmb__Discount_Type__c": "Percentage"
					}, {
						"Id": "a151t000000y2M8AAI",
						"Name": "RCL_1_1",
						"cspmb__Discount_Threshold__c": 5,
						"cspmb__Authorization_Level__c": "a0x1t000001RjC9AAK",
						"cspmb__Discount_Type__c": "Amount"
					}, {
						"Id": "a151t000000y2M3AAI",
						"Name": "Percentage",
						"cspmb__Discount_Threshold__c": 20,
						"cspmb__Authorization_Level__c": "a0x1t000001RjC4AAK",
						"cspmb__Discount_Type__c": "Percentage"
					}, {
						"Id": "a151t000000y2LyAAI",
						"Name": "One-off charge",
						"cspmb__Discount_Threshold__c": 30,
						"cspmb__Authorization_Level__c": "a0x1t000001RjBzAAK",
						"cspmb__Discount_Type__c": "Percentage"
					}, {
						"Id": "a151t000000y2MNAAY",
						"Name": "ADD1",
						"cspmb__Discount_Threshold__c": 12,
						"cspmb__Authorization_Level__c": "a0x1t000001RjCJAA0",
						"cspmb__Discount_Type__c": "Percentage"
					}, {
						"Id": "a151t000000y2LtAAI",
						"Name": "Recurring Charge",
						"cspmb__Discount_Threshold__c": 5,
						"cspmb__Authorization_Level__c": "a0x1t000001RjBzAAK",
						"cspmb__Discount_Type__c": "Amount"
					}, {
						"Id": "a151t000000y2MIAAY",
						"Name": "Amount",
						"cspmb__Discount_Threshold__c": 3,
						"cspmb__Authorization_Level__c": "a0x1t000001RjCEAA0",
						"cspmb__Discount_Type__c": "Amount"
					}, {
						"Id": "a151t000000y2MXAAY",
						"Name": "ADD1",
						"cspmb__Discount_Threshold__c": 5,
						"cspmb__Authorization_Level__c": "a0x1t000001RjCJAA0",
						"cspmb__Discount_Type__c": "Amount"
					}],
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

			case "createPricingRuleGroup":
				return createPromise("pricingRuleId");

			case "decomposeAttachment":
				return createPromise(getRandomFromArr(["Success", "Success", "Success", "Fail"]), 1000);

			case "undoDecomposition":
				return createPromise("Success", 2000);

			case "filterCommercialProducts":
				return createPromise(filterProducts(parametersArr[0]));

			case "setFrameAgreementState":
				return createPromise("Success");

			case "createNewVersionOfFrameAgrement":
				let newFa = JSON.parse(JSON.stringify(frameAgreements.filter(fa => fa.Id === parametersArr[0])[0]));

				newFa.Id = makeId(15);
				newFa.csconta__Status__c = "Draft";
				newFa.csconta__Agreement_Name__c = newFa.csconta__Agreement_Name__c + '_v2';

				return createPromise(newFa);

			case "getFrameAgreement":
				var fa = frameAgreements.filter(fa => fa.Id === parametersArr[0])[0];
				fa = JSON.parse(JSON.stringify(fa));
				delete fa._ui;
				return createPromise(fa);

			case "deleteFrameAgreement":
				return createPromise("Success");

			case "getCommercialProductData":
				var priceItemData = {};
				parametersArr[0].forEach(priceItemId => {
					priceItemData[priceItemId] = {
						Id: priceItemData,
						addons: [...Addons.map(addon => {
							addon.cspmb__Add_On_Price_Item__c += priceItemId;
							return addon
						})],
						charges: ["a1F1t0000001JC3EAM", "a1F1t0000001JC8EAM", "a1F1t0000001JCDEA2"].includes(priceItemId) ? {
							priceItemId: priceItemId,
							charges: []
						} : Charges,
						rateCards: rateCards
					};
				});
				return createPromise(priceItemData);
		}
	}
};