public class CommercialProductService {
	public static final List<String> CP_ROLES = new List<String>{
		'Basic',
		'Master',
		'Variant'
	};

	public static List<cspmb__price_item__c> queryProducts(
		List<Id> priceItemIds,
		String filterFields,
		Id lastRecordId,
		Integer queryLimit,
		List<Id> skipIds
	) {

		// when empty/ null parameters are passed, set default query limit
		if (
			(priceItemIds == null || (priceItemIds != null && priceItemIds.isEmpty())) &&
			(filterFields == null || filterFields == '') &&
			(queryLimit <= 0)
		) {
			queryLimit = FrameRateManagerController.DEFAULT_QUERY_LIMIT;
		}

		Map<Id, cspmb__price_item__c> cpIdMap;
		List<String> fieldsArr = AppUtilService.getSObjectFields('cspmb__price_item__c');

		Boolean isPsEnabled = FrameRateManagerController.getPsSwitchStatus();

		String filterClause = AppUtilService.getFilterClause(filterFields);

		String query = 'select ' + String.join(fieldsArr, ',');
		query += ' from cspmb__price_item__c ';

		if (!isPsEnabled) {
			query += 'where cspmb__account__c = null ' +
			    'and cspmb__is_active__c = true ' +
			    'and (cspmb__effective_start_date__c = null ' +
			    'OR (cspmb__effective_start_date__c != null ' +
			    'and cspmb__effective_start_date__c < TODAY)) ' +
			    'and (cspmb__effective_end_date__c = null ' +
			    'OR (cspmb__effective_end_date__c != null ' +
			    'and cspmb__effective_end_date__c > TODAY)) ' +
			    // If user turns off PS after a successful synchronisation
			    'and (cspmb__type__c = null ' +
			    'OR (cspmb__type__c = ' + '\'' + FrameRateManagerController.CP_TYPE + '\'' +
			    ' AND cspmb__role__c in :CP_ROLES)) ';

			if (priceItemIds != null && !priceItemIds.isEmpty()) {
				query += 'and id in :priceItemIds ';
			}

			if (skipIds != null && !skipIds.isEmpty()) {
				query += 'and id not in :skipIds ';
			}

		} else {
			if (priceItemIds != null) {
				query += 'where id in :priceItemIds ';

				if (skipIds != null && !skipIds.isEmpty()) {
					query += 'and id not in :skipIds ';
		 		}
			} else {
				if (skipIds != null && !skipIds.isEmpty()) {
					query += 'where id not in :skipIds ';
		 		}
			}
		}

		// check for lastRecordId for pagination
		if (lastRecordId != null) {
			/*
			 * to fulfil a rare use case where ps switch is enabled and no catalogue or categories are configured/ synced
			 * in which case, priceItemIds will be empty. skipIds supplied is also empty.
			 */
			if (query.right(21) == 'cspmb__price_item__c ') {
				query += ' where id > :lastRecordId';
			} else {
				query += ' and id > :lastRecordId';
			}
		}

		// add  filterFields as part of where clause
		if (filterClause.length() > 0) {
			if (query.right(21) == 'cspmb__price_item__c ') {
				query += ' where ' + filterClause;
			} else {
				query += ' and ' + filterClause;
			}
		}

	   /*
		* 'order by id' is needed to ensure that we always pass a standard order of ids in the ascending order so that
		* the correct last record id value is used to fetch records for every subsequent page. Having no ORDER BY
		* clause returns ids in a random order.
		*/
		query += ' order by id';
		query += ' limit ' + String.valueOf(
			queryLimit > 0 ? queryLimit : FrameRateManagerController.DEFAULT_QUERY_LIMIT
		);

		try {
			cpIdMap = new Map<Id, cspmb__price_item__c>((List<cspmb__price_item__c>) database.query(query));
		}
		catch (QueryException e) {
			throw new CustomExceptions.ApplicationException(e.getMessage());
		}

		return FrameRateManagerController.overrideCharges(cpIdMap);

	}
}