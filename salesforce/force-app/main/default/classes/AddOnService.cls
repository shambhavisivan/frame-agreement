public class AddOnService {
	public static List<cspmb__add_on_price_item__c> queryAddOns(
			Id priceItemId,
			Id lastRecordId,
			Integer queryLimit
	) {
		if (priceItemId == null) {
			throw new CustomExceptions.ApplicationException(System.Label.invalid_priceItem_Id);
		}
		List<cspmb__price_item_add_on_price_item_association__c> priceItemAddonAssociations =
			new List<cspmb__price_item_add_on_price_item_association__c>();
		List<cspmb__add_on_price_item__c> addOns = new List<cspmb__add_on_price_item__c>();

		List<String> fieldsArr = AppUtilService.getSObjectFields('cspmb__add_on_price_item__c');
		for (String field: fieldsArr) {
			 fieldsArr.set(fieldsArr.indexOf(field), 'cspmb__add_on_price_item__r.' + field);
		}

		String query =
		    'select id, cspmb__price_item__c, cspmb__overrides_add_on_charges__c, cspmb__effective_end_date__c, ' +
		    'cspmb__effective_start_date__c, cspmb__one_off_charge__c, cspmb__recurring_charge__c, ' +
		    'cspmb__add_on_price_item__c, ' + String.join(fieldsArr, ',');

		query +=
		    ' from cspmb__price_item_add_on_price_item_association__c where cspmb__price_item__c = :priceItemId and ' +
		    'cspmb__add_on_price_item__r.cspmb__is_active__c = true';

		// check for lastRecordId incase of pagination
		if (lastRecordId != null) {
			query += ' and cspmb__add_on_price_item__r.id > :lastRecordId';
		}

		/*
		* 'order by id' is needed to ensure that we always pass a standard order of ids in the ascending order so that
		* the correct last record id value is used to fetch records for every subsequent page. Having no ORDER BY
		* clause returns ids in a random order.
		*/
		query += ' order by id';
		query += ' limit ' + String.valueOf(
			queryLimit != null ? queryLimit : FrameRateManagerController.DEFAULT_QUERY_LIMIT
		);

		try {
			priceItemAddonAssociations = (List<cspmb__price_item_add_on_price_item_association__c>) database.query(
				query
			);
		}
		catch (QueryException e) {
			throw new CustomExceptions.ApplicationException(e.getMessage());
		}

		// filter out only valid priceItem - addOn associations
		List<cspmb__price_item_add_on_price_item_association__c> filteredPriceItemAddonAssociations =
			new List<cspmb__price_item_add_on_price_item_association__c>();

		for (cspmb__price_item_add_on_price_item_association__c addonAsson : priceItemAddonAssociations) {

			Date effectiveStartDate = addonAsson.cspmb__add_on_price_item__r.cspmb__effective_start_date__c;
			Date effectiveEndDate = addonAsson.cspmb__add_on_price_item__r.cspmb__effective_end_date__c;

			Boolean start_invalid = effectiveStartDate != null && Date.today() < effectiveStartDate;
			Boolean end_invalid = effectiveEndDate != null && Date.today() > effectiveEndDate;

			Boolean start_invalid_assoc =
				addonAsson.cspmb__effective_start_date__c != null &&
					date.today() < addonAsson.cspmb__effective_start_date__c;
			Boolean end_invalid_assoc =
				addonAsson.cspmb__effective_end_date__c != null &&
					date.today() > addonAsson.cspmb__effective_end_date__c;

			if (addonAsson.cspmb__overrides_add_on_charges__c == true) {
				addonAsson.cspmb__add_on_price_item__r.cspmb__one_off_charge__c = addonAsson.cspmb__one_off_charge__c;
				addonAsson.cspmb__add_on_price_item__r.cspmb__recurring_charge__c = addonAsson.cspmb__recurring_charge__c;
			}

			if (!(start_invalid || end_invalid) && !(start_invalid_assoc || end_invalid_assoc)) {
				filteredPriceItemAddonAssociations.add(addonAsson);
			}
		}

		for (cspmb__price_item_add_on_price_item_association__c assocItem: filteredPriceItemAddonAssociations) {
			addOns.add((cspmb__add_on_price_item__c) assocItem.getSObject('cspmb__add_on_price_item__r'));
		}

		return addOns;
	}
}

