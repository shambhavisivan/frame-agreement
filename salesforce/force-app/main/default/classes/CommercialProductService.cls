public class CommercialProductService {
	private static String cpType = FrameRateManagerController.CP_TYPE;
	private static String cpRole = FrameRateManagerController.CP_ROLE;

	public static List<cspmb__price_item__c> queryProducts(
			List<Id> priceItemIds,
			String filterFields,
			Id lastRecordId,
			Integer queryLimit
	) {

		// when empty/ null parameters are passed, return 1st page of records
		if ((priceItemIds == null || (priceItemIds != null && priceItemIds.isEmpty())) && (filterFields == null || filterFields == '') && (queryLimit == null || queryLimit < 0)) {
			queryLimit = FrameRateManagerController.DEFAULT_QUERY_LIMIT;
		}

		// when priceItemIds is non-empty/not null, ignore other filterFields if present in params
		if (priceItemIds != null && !priceItemIds.isEmpty()) {
			filterFields = null;
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
			    'OR (cspmb__type__c = :cpType ' +
			    'AND cspmb__role__c = :cpRole)) ';
			
			if (priceItemIds != null && !priceItemIds.isEmpty()) {
				query += 'and id in :priceItemIds ';
			}

		} else {
			if (priceItemIds != null) {
				query += 'where id in :priceItemIds ';
			}
		}

		// check for lastRecordId incase of pagination
		if (lastRecordId != null) {
			query += ' and id > :lastRecordId';
		}

		// add  filterFields as part of where clause
		if (filterClause.length() > 1 && filterClause != '()') {
			query += ' and ' + filterClause;
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
			cpIdMap = new Map<Id, cspmb__price_item__c>((List<cspmb__price_item__c>) database.query(query));
		}
		catch (QueryException e) {
			throw new CustomExceptions.ApplicationException(e.getMessage());
		}

		return FrameRateManagerController.overrideCharges(cpIdMap);

	}
}

