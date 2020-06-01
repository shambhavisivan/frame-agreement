import { parseExpression } from "../src/utils/shared-service";

const flattenExp = (expressionStructure) => {
	let parsedExp = "";

	expressionStructure.components.forEach((c, i) => {
		parsedExp += c.field + c.comparison + c.value;
		if (expressionStructure.operators[i]) {
			parsedExp += expressionStructure.operators[i];
		}
	});

	return parsedExp;
};

describe("Shared Service", () => {
	// beforeEach(() => {});

	it("parseExpression should properly operate a string", () => {
		let testData = [
			[
				"Customer_Agreement_Type__c == 'Mobile Connectivity Agreement' ",
				"Customer_Agreement_Type__c == 'Mobile Connectivity Agreement' ",
			],
			[
				"Arb_Field_Text__c != hide && Arb_Field_Bool__c==true",
				"Arb_Field_Text__c!=hide&&Arb_Field_Bool__c==true",
			],
			[
				"Arb_Field_Text__c != hide || Customer_Agreement_Type__c == 'customer A ' &&  Arb_Field_Text__c == arb field text ",
				"Arb_Field_Text__c!=hide||Customer_Agreement_Type__c==customer A&&Arb_Field_Text__c==arb field text",
			],
		];

		testData.forEach(td => {
			expect(flattenExp(parseExpression(td[0]))).toBe(td[1]);
		})
	});
});
