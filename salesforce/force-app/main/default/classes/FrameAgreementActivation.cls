public with sharing class FrameAgreementActivation {

	public static Map<String, Id> createPricingRuleGroup(Id faId) {

		Map<String, Id> returnMap = new Map<String, Id>();
		Integer prg_count = database.countQuery('select count() from cspmb__Pricing_Rule_Group__c');
		String rgc = 'FAM ' + String.valueOfGmt(datetime.now()) + '___' + prg_count;
		csconta__Frame_Agreement__c fa = [
			select id, name, csconta__effective_start_date__c,
				csconta__effective_end_date__c, csconta__frame_agreement_number__c
			from csconta__Frame_Agreement__c
			where id = :faId
			limit 1
		];

		cspmb__Pricing_Rule_Group__c prg = new cspmb__Pricing_Rule_Group__c(
			cspmb__description__c = 'Auto generated from FA decomposition.',
			cspmb__pricing_rule_group_code__c = rgc,
			csconta__frame_agreement__c = faId,
			cspmb__effective_start_date__c = fa.csconta__effective_start_date__c,
			cspmb__effective_end_date__c = fa.csconta__effective_end_date__c
		);
		insert prg;
		returnMap.put('prgId', prg.id);

		cspmb__pricing_rule__c pr = new cspmb__pricing_rule__c(
			cspmb__description__c = 'Auto generated from FA decomposition.',
			cspmb__pricing_rule_code__c = rgc,
			cspmb__effective_end_date__c = fa.csconta__effective_end_date__c,
			cspmb__effective_start_date__c = fa.csconta__effective_start_date__c
		);
		insert pr;
		returnMap.put('prId', pr.id);

		cspmb__Pricing_Rule_Group_Rule_Association__c prgra = new cspmb__Pricing_Rule_Group_Rule_Association__c(
			cspmb__pricing_rule__c = pr.Id,
			cspmb__pricing_rule_group__c = prg.Id
		);
		insert prgra;

		return returnMap;
	}

	public static String structureFAData(Id faId){

		Blob body = [
			select id, parentId, body
			from Attachment
			where parentId = :faId
		]?.body;

		if (body == null) {
			throw new NullAttachmentException('Framework attachment does not exist.');
		}

		String attachmentBody = body.toString();
		Map<String, Object> faData = (Map<String, Object>) Json.deserializeUntyped(attachmentBody);
		Map<String, Object> productsData = (Map<String, Object>) faData.get('products');
		Map<String, Object> addonsData = (Map<String, Object>) faData.get('addons');
		List<FAAttachmentStructure> returnData = new List<FAAttachmentStructure>();

		if (productsData == null) {
			productsData = new Map<String,Object>();
		}
		if (addonsData == null) {
			addonsData = new Map<String,Object>();
		}

		for (String prodId : productsData.keySet()) {
			Map<String, Object> product = ((Map<String, Object>) productsData.get(prodId));

			Map<String, Object> cpProducts = (Map<String, Object>) product.get('_product');
			if (cpProducts != null) {
				FAAttachmentStructure prodData = new FAAttachmentStructure(
					prodId,
					cpProducts.get('oneOff') != null ? (Decimal) cpProducts.get('oneOff') : null,
					cpProducts.get('recurring') != null ? (Decimal) cpProducts.get('recurring') : null,
					'cpId'
				);
				returnData.add(prodData);
			}

			Map<String, Object> cpCharges = (Map<String, Object>) product.get('_charges');
			if (cpCharges != null) {
				for (String chargeId : cpCharges.keySet()) {
					Map<String, Object> charge = (Map<String, Object>) cpCharges.get(chargeId);
					FAAttachmentStructure chargeData = new FAAttachmentStructure(
						chargeId,
						charge.get('oneOff') != null ? (Decimal) charge.get('oneOff') : null,
						charge.get('recurring') != null ? (Decimal) charge.get('recurring') : null,
						'chId'
					);
					returnData.add(chargeData);
				}
			}

			Map<String, Object> cpAddons = (Map<String, Object>) product.get('_addons');
			if (cpAddons != null) {
				for (String cpAddonId : cpAddons.keySet()) {
					Map<String, Object> cpAddon = (Map<String, Object>) cpAddons.get(cpAddonId);
					FAAttachmentStructure cpAddonData = new FAAttachmentStructure(
						cpAddonId,
						cpAddon.get('oneOff') != null ? (Decimal) cpAddon.get('oneOff') : null,
						cpAddon.get('recurring') != null ? (Decimal) cpAddon.get('recurring') : null,
						'cpaoaId'
					);
					returnData.add(cpAddonData);
				}
			}
		}

		for (String addonId : addonsData.keySet()) {
			Map<String, Object> addon = ((Map<String, Object>) addonsData.get(addonId));
			FAAttachmentStructure addonData = new FAAttachmentStructure(
				addonId,
				addon.get('oneOff') != null ? (Decimal) addon.get('oneOff') : null,
				addon.get('recurring') != null ? (Decimal) addon.get('recurring') : null,
				'addonId'
			);
			returnData.add(addonData);
		}

		for (Integer i = returnData.size()-1; i >= 0; i--) {
			FAAttachmentStructure checkData = returnData.get(i);
			if (checkData.oneOff == null && checkData.recurring == null) {
				returnData.remove(i);
			}
		}

		String returnString = '[';
		for (FAAttachmentStructure item : returnData){
			if (item.cpId != null){
				returnString += '{"cpId":"' + item.cpId + '",';
			} else if (item.cpaoaId != null) {
				returnString += '{"cpaoaId":"' + item.cpaoaId + '",';
			} else if (item.chId != null) {
				returnString += '{"peId":"' + item.chId + '",';
			} else if (item.addonId != null) {
				returnString += '{"addonId":"' + item.addonId + '",';
			}
			returnString += '"recurring":' + String.valueOf(item.recurring)
				+ ',"oneOff":' + String.valueOf(item.oneOff) + '},';
		}
		returnString = returnString.removeEnd(',') + ']';

		return returnString;
	}

	public static String decomposeAttachment(String data, Id prId) {

		String retString = 'Success';
		List<Object> categorizationData;
		List <cspmb__Price_Item_Pricing_Rule_Association__c> pipraList =
			new List <cspmb__Price_Item_Pricing_Rule_Association__c>();

		categorizationData = (List<Object>) JSON.deserializeUntyped(data);
		System.debug('***********data**************');
		System.debug(categorizationData);

		for (Object item : categorizationData) {
			try {
				Map<String, Object> categoryMap = (Map<String, Object>) item;

				String cpId = (String) categoryMap.get('cpId');
				String cpaoaId = (String) categoryMap.get('cpaoaId');
				String peId = (String) categoryMap.get('peId');
				String addonId = (String) categoryMap.get('addonId');

				Decimal recurring = (Decimal) categoryMap.get('recurring');
				Decimal oneOff = (Decimal) categoryMap.get('oneOff');

				cspmb__Price_Item_Pricing_Rule_Association__c pipra =
					new cspmb__Price_Item_Pricing_Rule_Association__c(
						cspmb__target_price__c = 'Sales',
						cspmb__recurring_adjustment_type__c = 'Price Override',
						cspmb__one_off_adjustment_type__c = 'Price Override',
						cspmb__pricing_rule__c = prId
					);

				if (cpId != null) {
					pipra.cspmb__price_item__c = cpId;
				}

				if (cpaoaId != null) {
					pipra.cspmb__price_item_add_on_association__c = cpaoaId;
				}

				if (peId != null) {
					pipra.cspmb__pricing_element__c = peId;
				}

				if (addonId != null) {
					pipra.cspmb__add_on__c = addonId;
				}

				if (recurring != null) {
					pipra.cspmb__recurring_adjustment__c = recurring;
				}

				if (oneOff != null) {
					pipra.cspmb__one_off_adjustment__c = oneOff;
				}
				System.debug(pipra);
				pipraList.add(pipra);
				System.debug('pipraList *** ' + pipraList);

			} catch (Exception e) {
				retString = e.getMessage();
			}
		}

		if (retString == 'Success') {
			try {
				insert pipraList;
			} catch (Exception e) {
				retString = e.getMessage();
			}
		}

		return retString;
	}

	public static String updateFAStatus(Id faId) {

		String retString = 'Success';

		try {
			Fac_Settings__c facSettings = Fac_Settings__c.getInstance(UserInfo.getUserId());
			// Set active status to FA, and if its replacing another fa, set its effective start date
			csconta__Frame_Agreement__c fa = [
				select id, csconta__status__c, csconta__replaced_frame_agreement__c
				from csconta__Frame_Agreement__c
				where id = :faId
				limit 1
			];
			fa.csconta__status__c = (String) facSettings.get('active_status__c');

			// If this was a version of another fa we need to set the original to replaced/closed
			if (fa.csconta__replaced_frame_agreement__c != null) {
				fa.csconta__effective_start_date__c = datetime.now();
				csconta__Frame_Agreement__c original = [
					select id, csconta__status__c, csconta__effective_end_date__c
					from csconta__Frame_Agreement__c
					where id = :fa.csconta__replaced_frame_agreement__c
					limit 1
				];
				if (original != null) {
					original.csconta__status__c = (String) facSettings.get('closed_status__c');
					original.csconta__replaced_by__c = faId;

					// if the original does not have an end date or
					// the end date is in the future, we need to end it now
					// leave the end date intact if it is already ended
					if (
						original.csconta__effective_end_date__c == null ||
						original.csconta__effective_end_date__c > datetime.now()
					) {
						original.csconta__effective_end_date__c = datetime.now();
					}

					update original;
				}
			}
			update fa;
		} catch (Exception e) {
			retString = e.getMessage();
		}

		return retString;
	}
}