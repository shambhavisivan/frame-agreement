public class FrameAgreementService {
	private static final String ACCOUNT_CANNOT_BE_NULL = 'Account id cannot be null';
	private static final Integer DEFAULT_QUERY_LIMIT = 5000;

	/**
	 * @param accountId associated frame agreement account
	 * @param filterFields {'fieldName': 'value} only supports string/picklist fields as of now
	 * @param lastRecordId Id of the record after which the pagination is applied
	 * @param queryLimit limit number of records to be fetched for pagination
	 *
	 * @return filtered list of Frame agreements
	 */
	public static List<csconta__Frame_Agreement__c> getFrameAgreements(
		Id accountId,
		String filterFields,
		Id lastRecordId,
		Integer queryLimit
	) {
		Map<String, Object> filterFieldsMap =  new Map<String, Object>();

		if (accountId == null) {
			throw new CustomExceptions.ApplicationException(ACCOUNT_CANNOT_BE_NULL);
		}

		if (String.isNotBlank(filterFields)) {
			filterFieldsMap = (Map<String, Object>) Json.deserializeUntyped(filterFields);
		}

		String whereClause = '(';
		Integer index = 1;
		for (String key : filterFieldsMap.keySet()) {
			if (index == filterFieldsMap.keySet().size()) {
				whereClause += key + ' like \'' + filterFieldsMap.get(key) + '%\'';
			} else {
				whereClause += key + ' like \'' + filterFieldsMap.get(key) + '%\' and ';
			}
			index++;
		}

		// as we have the column-chooser we let users to select the fields they require.
		List<String> allFAFields = AppUtilService.getFAFieldList();

		String query = 'select ' + String.join(allFAFields, ', ');
		query += ' from csconta__Frame_Agreement__c';
		query += ' where csconta__Account__c = :accountId';

		if (lastRecordId != null) {
			query += ' and id > :lastRecordId';
		}

		if (whereClause.length() > 1) {
			query += ' and ' + whereClause + ')';
		}

		query += ' order by LastModifiedDate DESC';
		query += ' limit ' + String.valueOf(queryLimit != null ? queryLimit : DEFAULT_QUERY_LIMIT);

		List<csconta__Frame_Agreement__c> faList;
		try {
			faList = (List<csconta__Frame_Agreement__c>) Database.query(query);
		} catch (QueryException e) {
			throw new CustomExceptions.ApplicationException(e.getMessage());
		}

		return faList;
	}

	/**
	 * @param masterFaId master frame agreement id
	 * @return list of child FAs
	 */
	public static List<csconta__Frame_Agreement__c> getChildFrameAgreements(Id masterFaId) {
		String query = 'SELECT ' + String.join(FrameRateManagerController.FA_FIELDS, ',')
			+ ' FROM csconta__Frame_Agreement__c '
			+ ' where csconta__master_frame_agreement__c = :masterFaId';

		List<csconta__Frame_Agreement__c> childFrameAgreements = null;
		try {
			childFrameAgreements = (List<csconta__Frame_Agreement__c>) Database.query(
				String.escapeSingleQuotes(query)
			);
		} catch (QueryException e) {
			throw new CustomExceptions.ApplicationException(e.getMessage());
		}

		return childFrameAgreements;
	}
}