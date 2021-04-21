/**
 * Custom PrgSelector plugin which will add FA Prg Id to the list of
 * selected Prgs when used in runtime.
 */
global with sharing class FaPrgSelector extends cspsi.APrgSelector {
	global override void selectPrgs(
		String salesAppId,
		User user,
		String basketId,
		Map<String, String> salesContext,
		Set<String> prgs
	) {
		String faId = [
			select id, csconta__frame_agreement__c
			from cscfga__Product_Basket__c
			where id = :basketId
		]?.csconta__frame_agreement__c;

		if (String.isNotEmpty(faId)) {
			/*
			  Limit 1 is to ensure we only return one PRG. Having more can be result of some customization
			  by customer and is not supported by FA OOTB. If this changes in the future we will
			  amend this code to return multiple PRG codes.
			*/
			String prgCode = [
				select id, cspmb__pricing_rule_group_code__c
				from cspmb__Pricing_Rule_Group__c
				where csconta__frame_agreement__c = :faId
				and (
					csconta__frame_agreement__r.csconta__effective_end_date__c = null
					or csconta__frame_agreement__r.csconta__effective_end_date__c >= :DateTime.now()
				)
				limit 1
			]?.cspmb__pricing_rule_group_code__c;
			if (String.isNotEmpty(prgCode)) {
				prgs.add(prgCode);
			}
		}
	}
}