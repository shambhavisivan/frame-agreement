import { deforcify } from '../datasources/deforcify';
import { frameAgreements } from '../local-server/local_data';
import { evaluateConditionalExpression } from './app-settings-config-utils';

describe('Evaluate conditional expression', () => {
	test('Single condition must be evaluated as per expression', async () => {
		const frameAgreement = deforcify(frameAgreements[0]);

		const positiveConditionalExpression = 'csconta__Status__c == Draft';
		const positiveConditionalExpressionResult = evaluateConditionalExpression(
			positiveConditionalExpression,
			frameAgreement
		);

		const negativeConditionalExpression = 'csconta__Status__c != Draft';
		const negativeConditionalExpressionResult = evaluateConditionalExpression(
			negativeConditionalExpression,
			frameAgreement
		);

		const nullConditionalExpression = 'csfam__Arb_Field_Text_4__c == null';
		const nullConditionalExpressionResult = evaluateConditionalExpression(
			nullConditionalExpression,
			frameAgreement
		);

		const nonNullConditionalExpression = 'csconta__Status__c != null';
		const nonNullConditionalExpressionResult = evaluateConditionalExpression(
			nonNullConditionalExpression,
			frameAgreement
		);

		expect(positiveConditionalExpressionResult).toBe(true);
		expect(negativeConditionalExpressionResult).toBe(false);
		expect(nullConditionalExpressionResult).toBe(true);
		expect(nonNullConditionalExpressionResult).toBe(true);
	});

	test('Multiple condition must be evaluated as per expression', async () => {
		const frameAgreement = deforcify(frameAgreements[0]);

		const andConditionalExpression =
			'csconta__Status__c == Draft && csconta__agreement_level__c == Master Agreement';
		const andConditionalExpressionResult = evaluateConditionalExpression(
			andConditionalExpression,
			frameAgreement
		);

		const orConditionalExpression =
			'csconta__Status__c != Draft || csconta__agreement_level__c == Master Agreement';
		const orConditionalExpressionResult = evaluateConditionalExpression(
			orConditionalExpression,
			frameAgreement
		);

		const andOrConditionalExpression =
			'(csconta__Status__c != Draft && csconta__agreement_level__c == Master Agreement) || ' +
			'csfam__Arb_Field_Text_4__c == null';
		const andOrConditionalExpressionResult = evaluateConditionalExpression(
			andOrConditionalExpression,
			frameAgreement
		);

		const andOrConditionalDiffDataTypeExpression =
			'(csfam__Arb_Field_Integer__c == 48 && csfam__Disable_Levels__c == false)';
		const andOrConditionalDiffDataTypeExpressionResult = evaluateConditionalExpression(
			andOrConditionalDiffDataTypeExpression,
			frameAgreement
		);

		const negativeConditionalExpression =
			'(csfam__Arb_Field_Integer__c == 50 || csconta__agreement_level__c == Frame Agreement) || ' +
			'csfam__Arb_Field_Text_4__c == "Custom Value"';
		const negativeConditionalExpressionResult = evaluateConditionalExpression(
			negativeConditionalExpression,
			frameAgreement
		);

		expect(andConditionalExpressionResult).toBe(true);
		expect(orConditionalExpressionResult).toBe(true);
		expect(andOrConditionalExpressionResult).toBe(true);
		expect(andOrConditionalDiffDataTypeExpressionResult).toBe(true);
		expect(negativeConditionalExpressionResult).toBe(false);
	});

	test('Condition must be evaluated for second level sub object as per expression', async () => {
		const frameAgreement = deforcify(frameAgreements[0]);

		const andConditionalExpression =
			'csconta__Status__c == Draft && csconta__Account__r.Name == Test Account';
		const andConditionalExpressionResult = evaluateConditionalExpression(
			andConditionalExpression,
			frameAgreement
		);

		expect(andConditionalExpressionResult).toBe(true);
	});

	test('Invalid Expression', async () => {
		const frameAgreement = deforcify(frameAgreements[0]);

		const andConditionalExpression = 'csconta__Status__c = Draft';
		const andConditionalExpressionResult = evaluateConditionalExpression(
			andConditionalExpression,
			frameAgreement
		);

		const incompleteChainingExpression =
			'csconta__Status__c == Draft && csfam__Disable_Levels__c == false &&';
		const incompleteChainingExpressionResult = evaluateConditionalExpression(
			incompleteChainingExpression,
			frameAgreement
		);

		const multiObjectLevelExpression =
			'csconta__Account__r.csconta__Account_parent__r.Name == Test Account';
		const multiObjectLevelExpressionResult = evaluateConditionalExpression(
			multiObjectLevelExpression,
			frameAgreement
		);

		const invalidEqualityExpression =
			'(csfam__Arb_Field_Integer__c == == 48 && csfam__Disable_Levels__c == false)';
		const invalidEqualityExpressionResult = evaluateConditionalExpression(
			invalidEqualityExpression,
			frameAgreement
		);

		expect(andConditionalExpressionResult).toBe(false);
		expect(incompleteChainingExpressionResult).toBe(true);
		expect(multiObjectLevelExpressionResult).toBe(false);
		expect(invalidEqualityExpressionResult).toBe(false);
	});
});
