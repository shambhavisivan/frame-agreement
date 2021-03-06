global with sharing class FAMDelta {
	@RemoteAction
	public static Map<String, Object> getDelta(Id fa1, Id fa2) {
		// Will compare fa1 (original) to fa2

		// Initialise final structure

		// Compare fa fields
		// Decompose attachment

		String encoded_att_1 = FrameRateManagerController.getAttachmentBody(fa1);
		String encoded_att_2 = FrameRateManagerController.getAttachmentBody(fa2);

		if (String.isBlank(encoded_att_1) || String.isBlank(encoded_att_2)) {
			throw new NullAttachmentException('Attachment not present in one of the frame agreements!');
		}

		String att_1 = EncodingUtil.base64Decode(encoded_att_1).toString();
		String att_2 = EncodingUtil.base64Decode(encoded_att_2).toString();

		Map<String, Object> sourceProducts = null;
		Map<String, Object> targetProducts = null;
		Map<String, Object> sourceAddons = null;
		Map<String, Object> targetAddons = null;
		Map<String, Object> sourceOffers = null;
		Map<String, Object> targetOffers = null;

		Map<String, Object> desAtt = (Map<String, Object>) JSON.deserializeUntyped(att_1);
		sourceProducts = (Map<String, Object>) desAtt.get('products');
		sourceAddons = (Map<String, Object>) desAtt.get('addons');
		sourceOffers = (Map<String, Object>) desAtt.get('offers');

		Map<String, Object> desAtt2 = (Map<String, Object>) JSON.deserializeUntyped(att_2);
		targetProducts = (Map<String, Object>) desAtt2.get('products');
		targetAddons = (Map<String, Object>) desAtt2.get('addons');
		targetOffers = (Map<String, Object>) desAtt2.get('offers');

		Map<String, Object> diff_structure = compareFrameAgreements(fa1, fa2);

		// Compare attachment
		Map<Id, Object> comparedProducts = new Map<Id, Object>();
		if (sourceProducts != null && targetProducts != null) {
			comparedProducts = compareProducts(sourceProducts, targetProducts);
		}

		Map<Id, Object> comparedOffers = new Map<Id, Object>();
		if (sourceOffers != null && targetOffers != null) {
			comparedOffers = compareProducts(sourceOffers, targetOffers);
		}

		// Compare standalone Addons
		if (sourceAddons != null | targetAddons != null) {
			if(sourceAddons == null) {
				sourceAddons = new Map<String, Object>();
			}

			if(targetAddons == null) {
				targetAddons = new Map<String, Object>();
			}

			diff_structure.put('_addons', compareAddons(sourceAddons, targetAddons));
		}

		// Put attachment diff into the main structure
		diff_structure.put('_products', comparedProducts);
		if (comparedOffers != null && comparedOffers.size() > 0) {
			diff_structure.put('_offers', comparedOffers);
		}
		// unchangedProductIds.
		return diff_structure;
	}

	public static Map<String, diffWrap> compareVolume(Map<String, Object> volumes1, Map<String, Object> volumes2) {
		// muc, mucp, mv, mvp
		Set<String> volumeFields = new Set<String>{
			'muc', 'mucp', 'mv', 'mvp'
		};

		Map<String, diffWrap> result = new Map<String, diffWrap>();

		for (String vf : volumeFields) {
			Decimal vf_val_1 = (Decimal) volumes1.get(vf);
			Decimal vf_val_2 = (Decimal) volumes2.get(vf);
			String status = 'unchanged';

			if (vf_val_1 != vf_val_2) {
				status = 'changed';
			}
			result.put(vf, new diffWrap(vf_val_1, vf_val_2, status));
		}

		return result;
	}

	public static Map<String, addonWrap> compareAddons(Map<String, Object> addons1, Map<String, Object> addons2) {
		Map<String, addonWrap> result = new Map<String, addonWrap>();
		Set<String> secondaryAddonsIds = addons2.keySet();

		for (String addonId : addons1.keySet()) {
			Map<String, Object> addon1 = (Map<String, Object>) addons1.get(addonId);
			Map<String, Object> addon2 = (Map<String, Object>) addons2.get(addonId);

			if (secondaryAddonsIds.contains(addonId)) {
				// Existing
				addonWrap thisAddon = new addonWrap();

				// Need:
				// diffWrap oneOFfDiff
				// diffWrap recurringDiff
				// String status (x3)

				diffWrap oneOffDiff = new diffWrap();
				diffWrap recurringDiff = new diffWrap();

				// State of add on, depends on other statuses
				String addonStatus = 'unchanged';
				// Status of oneOff charge in this add on
				String oneOffStatus = '';
				// Status of recurring charge in this add on
				String recurringStatus = '';
				// Compare
				Decimal oneOff_1 = (Decimal) addon1.get('oneOff');
				Decimal oneOff_2 = (Decimal) addon2.get('oneOff');

				Decimal recurring_1 = (Decimal) addon1.get('recurring');
				Decimal recurring_2 = (Decimal) addon2.get('recurring');

				if (oneOff_1 != oneOff_2) {
					oneOffStatus = 'changed';
					addonStatus = 'changed';
				} else {
					oneOffStatus = 'unchanged';
				}

				oneOffDiff = new diffWrap(oneOff_1, oneOff_2, oneOffStatus);

				if (recurring_1 != recurring_2) {
					recurringStatus = 'changed';
					addonStatus = 'changed';
				} else {
					recurringStatus = 'unchanged';
				}

				recurringDiff = new diffWrap(recurring_1, recurring_2, recurringStatus);

				thisAddon.oneOff = oneOffDiff;
				thisAddon.recurring = recurringDiff;
				thisAddon.status = addonStatus;

				result.put(addonId, thisAddon);

				// Remove this add on Id from the list
				secondaryAddonsIds.remove(addonId);

			} else {
				// removed
				Decimal oneOff = (Decimal) addon1.get('oneOff');
				Decimal recurring = (Decimal) addon1.get('recurring');

				result.put(
					addonId,
					new addonWrap(new diffWrap(oneOff, null, 'removed'),
					new diffWrap(recurring, null, 'removed'), 'removed')
				);

				// Remove this add on Id from the list
				secondaryAddonsIds.remove(addonId);
			}
		}

		// secondaryAddonsIds now contains added
		for (String addedAddonId : secondaryAddonsIds) {
			// added
			Map<String, Object> addon2 = (Map<String, Object>) addons2.get(addedAddonId);

			Decimal oneOff = (Decimal) addon2.get('oneOff');
			Decimal recurring = (Decimal) addon2.get('recurring');

			result.put(
				addedAddonId,
				new addonWrap(new diffWrap(null, oneOff, 'added'),
				new diffWrap(null, recurring, 'added'), 'added')
			);

		}

		return result;
	}

	public static Map<String, diffWrap> compareProductCharges(
		Map<String, Object> p_charge1,
		Map<String, Object> p_charge2
	) {
		Map<String, diffWrap> result = new Map<String, diffWrap>();
		String oneOffStatus = 'unchanged';

		if (p_charge1.get('oneOff') != p_charge2.get('oneOff')) {
			oneOffStatus = 'changed';
		}

		result.put('oneOff', new diffWrap(p_charge1.get('oneOff'), p_charge2.get('oneOff'), oneOffStatus));

		String recurringStatus = 'unchanged';
		if (p_charge1.get('recurring') != p_charge2.get('recurring')) {
			recurringStatus = 'changed';
		}
		result.put('recurring', new diffWrap(p_charge1.get('recurring'), p_charge2.get('recurring'), recurringStatus));


		return result;
	}

	public static Map<String, Map<String, diffWrap>> compareCharges(
		Map<String, Object> charges1,
		Map<String, Object> charges2
	) {
		Map<String, Map<String, diffWrap>> result = new Map<String, Map<String, diffWrap>>();
		Set<String> secondaryChargesIds = charges2.keySet();

		for (String chargeId : charges1.keySet()) {
			Map<String, diffWrap> this_diff = new Map<String, diffWrap>();
			String chargeStatus = 'unchanged';
			Map<String, Object> this_charge = (Map<String, Object>) charges1.get(chargeId);

			if (charges2.containsKey(chargeId)) {
				// Existing
				Map<String, Object> secondary_charge = (Map<String, Object>) charges2.get(chargeId);

				if (this_charge.containsKey('oneOff')) {
					String oneOffStatus = 'unchanged';
					if (this_charge.get('oneOff') != secondary_charge.get('oneOff')) {
						oneOffStatus = 'changed';
						chargeStatus = 'changed';
					}

					this_diff.put(
						'oneOff',
						new diffWrap(this_charge.get('oneOff'),
						secondary_charge.get('oneOff'), oneOffStatus)
					);
				}

				if (this_charge.containsKey('recurring')) {
					String recurringStatus = 'unchanged';
					if (this_charge.get('recurring') != secondary_charge.get('recurring')) {
						recurringStatus = 'changed';
						chargeStatus = 'changed';
					}
					this_diff.put(
						'recurring',
						new diffWrap(this_charge.get('recurring'),
						secondary_charge.get('recurring'),
						recurringStatus)
					);
				}

				secondaryChargesIds.remove(chargeId);
			} else {
				// Removed
				secondaryChargesIds.remove(chargeId);
				String chargeType = '';
				if (this_charge.containsKey('recurring')) {
					chargeType = 'recurring';
				} else {
					chargeType = 'oneOff';
				}
				this_diff.put(chargeType, new diffWrap(this_charge.get(chargeType), null, 'removed'));
			}

			result.put(chargeId, this_diff);
		}

		for (String chargeId : secondaryChargesIds) {
			Map<String, diffWrap> this_diff = new Map<String, diffWrap>();
			// added
			Map<String, Object> secondary_charge = (Map<String, Object>) charges2.get(chargeId);

			String chargeType = '';
			if (secondary_charge.containsKey('recurring')) {
				chargeType = 'recurring';
			} else {
				chargeType = 'oneOff';
			}
			this_diff.put(chargeType, new diffWrap(null, (Decimal) secondary_charge.get(chargeType), 'added'));
			result.put(chargeId, this_diff);
		}

		return result;

	}

	public static Map<String, rcWrap> compareRateCards(Map<String, Object> rcList1, Map<String, Object> rcList2) {

		Set<String> rc2rclSet = rcList2.keySet();

		Map<String, rcWrap> result = new Map<String, rcWrap>();

		for (String rcId : rcList1.keySet()) {

			String rcStatus = 'unchanged';
			Map<String, Object> this_rc = (Map<String, Object>) rcList1.get(rcId);

			Map<String, diffWrap> this_diff = new Map<String, diffWrap>();

			if (rcList2.containsKey(rcId)){
				// Existing
				Map<String, Object> secondary_rc = (Map<String, Object>) rcList2.get(rcId);

				for (String rclId : this_rc.keySet()) {

					if (secondary_rc.containsKey(rclId)) {
						// Existing rcl
						String rclStatus = 'unchanged';

						if (this_rc.get(rclId) != secondary_rc.get(rclId)) {
							rclStatus = 'changed';
							rcStatus = 'changed';
						}

						this_diff.put(
							rclId,
							new diffWrap((Decimal) this_rc.get(rclId),
							(Decimal) secondary_rc.get(rclId), rclStatus)
						);

					} else {
						// Removed rcl
						this_diff.put(rclId, new diffWrap((Decimal) this_rc.get(rclId), 0, 'changed'));
					}

					secondary_rc.remove(rclId);
				}

				for (String rclId : secondary_rc.keySet()) {
					// added, but actually changed from unset
					this_diff.put(rclId, new diffWrap(0, (Decimal) secondary_rc.get(rclId), 'changed'));
				}

				rc2rclSet.remove(rcId);

			} else {
				// Removed
				rcStatus = 'removed';
				for (String rclId : this_rc.keySet()) {
					this_diff.put(rclId, new diffWrap((Decimal) this_rc.get(rclId), null, 'removed'));
				}

				rc2rclSet.remove(rcId);
			}

			result.put(rcId, new rcWrap(this_diff, rcStatus));
		}

		for (String rcId : rc2rclSet) {
			// added
			Map<String, diffWrap> this_diff = new Map<String, diffWrap>();

			Map<String, Object> secondary_rc = (Map<String, Object>) rcList2.get(rcId);

			for (String rclId : secondary_rc.keySet()) {
				this_diff.put(rclId, new diffWrap(null, (Decimal) secondary_rc.get(rclId), 'added'));
			}

			result.put(rcId, new rcWrap(this_diff, 'added'));
		}

		return result;
	}

	public static Map<String, Object> compareFrameAgreements(String faId1, String faId2) {

		Map<String, Object> result = new Map<String, Object>();

		csconta__Frame_Agreement__c fa1 = FrameRateManagerController.getFrameAgreement(faId1);
		csconta__Frame_Agreement__c fa2 = FrameRateManagerController.getFrameAgreement(faId2);

		Set<String> excluded_fields = new Set<String>{
			'LastModifiedDate', 'Id', 'Name', 'csconta__frame_agreement_number__c'
		};


		Map<String, Object> fa1PopulatedFields = fa1.getPopulatedFieldsAsMap();
		Map<String, Object> fa2PopulatedFields = fa2.getPopulatedFieldsAsMap();

		for (String fieldName : fa1PopulatedFields.keySet()) {
			if (!excluded_fields.contains(fieldName) && !fieldName.endsWith('__r')) {
				if (fa1PopulatedFields.get(fieldName) != fa2PopulatedFields.get(fieldName)) {
					result.put(
						fieldName,
						new diffWrap(fa1PopulatedFields.get(fieldName),
						fa2PopulatedFields.get(fieldName),
						'changed')
					);
				} else {
					result.put(
						fieldName,
						new diffWrap(fa1PopulatedFields.get(fieldName),
						fa2PopulatedFields.get(fieldName),
						'unchanged')
					);
				}
			}
		}

		return result;

	}

	private static Map<Id, Object> compareProducts(
		Map<String, Object> sourceProducts, Map<String, Object> targetProducts
	) {
		Map<Id, Object> comparisonMap = new Map<Id, Object>();
		List<Id> unchangedProductIds = new List<Id>();

		// .clone() because apex will remove key from map if removed from Set created from keySet
		Set<String>  sourceProductIds = sourceProducts.keySet().clone();
		Set<String>  targetProductIds = targetProducts.keySet().clone();
		List<Id> priceItemIds = new List<Id>();

		for (String cpId : sourceProductIds) {
			if (targetProductIds.contains(cpId)) {
				// Unchanged
				unchangedProductIds.add(cpId);
			} else {
				// Removed
				comparisonMap.put(cpId, 'removed');
			}
			// Delete this cpId from productIds_2 so that we are left with added
			targetProductIds.remove(cpId);
			priceItemIds.add(cpId);
		}

		for (String cpId : targetProductIds) {
			comparisonMap.put(cpId, 'added');
			priceItemIds.add(cpId);
		}
		Set<Id> priceItemCharges = FrameRateManagerController.getCommercialProductCharges(priceItemIds).keySet();

		for (String productId : unchangedProductIds) {
			Map<String, Object> original_cp = (Map<String, Object>) sourceProducts.get(productId);
			Map<String, Object> secondary_cp = (Map<String, Object>) targetProducts.get(productId);

			Map<String, addonWrap> addon_compare = new Map<String, addonWrap>();

			Map<String, Object> addons1 = (Map<String, Object>) original_cp.get('_addons');
			Map<String, Object> addons2 = (Map<String, Object>) secondary_cp.get('_addons');

			if (addons1 != null || addons2 != null) {
				if (addons1 == null) {
					addons1 = new Map<String, Object>();
				}
				if (addons2 == null) {
					addons2 = new Map<String, Object>();
				}

				addon_compare = compareAddons(addons1, addons2);
			}

			// ********************** CHARGES

			Map<String, Map<String, diffWrap>> charges_compare = new Map<String, Map<String, diffWrap>>();

			Map<String, Object> charges1 = (Map<String, Object>) original_cp.get('_charges');
			Map<String, Object> charges2 = (Map<String, Object>) secondary_cp.get('_charges');

			if ((charges1 != null || charges2 != null) &&
				priceItemCharges.contains(productId)) {

				if (charges1 == null) {
					charges1 = new Map<String, Object>();
				}

				if (charges2 == null) {
					charges2 = new Map<String, Object>();
				}

				charges_compare = compareCharges(charges1, charges2);
			}

			// ********************** PRODUCTS

			Map<String, diffWrap> products_compare = new Map<String, diffWrap>();

			Map<String, Object> product1 = (Map<String, Object>) original_cp.get('_product');
			Map<String, Object> product2 = (Map<String, Object>) secondary_cp.get('_product');

			if ((product1 != null || product2 != null) &&
				!priceItemCharges.contains(productId)) {

				if (product1 == null) {
					product1 = new Map<String, Object>();
				}

				if (product2 == null) {
					product2 = new Map<String, Object>();
				}

				products_compare = compareProductCharges(product1, product2);
			}

			// ********************** RATE CARD

			Map<String, rcWrap> rateCards_compare = new Map<String, rcWrap>();

			system.debug(productId + '-' + JSON.serialize(original_cp));
			system.debug(productId + '-' + JSON.serialize(secondary_cp));

			Map<String, Object> rcList1 = (Map<String, Object>) original_cp.get('_rateCards');
			Map<String, Object> rcList2 = (Map<String, Object>) secondary_cp.get('_rateCards');

			if (rcList1 != null || rcList2 != null) {

				if (rcList1 == null) {
					rcList1 = new Map<String, Object>();
				}

				if (rcList2 == null) {
					rcList2 = new Map<String, Object>();
				}

				rateCards_compare = compareRateCards(rcList1, rcList2);
			}

			// ********************** VOLUMES

			Map<String, Object> volumes1 = (Map<String, Object>) original_cp.get('_volume');
			Map<String, Object> volumes2 = (Map<String, Object>) secondary_cp.get('_volume');

			system.debug(volumes1);
			system.debug(volumes2);

			Boolean isAllNull1 = new Set<Object>(volumes1.values()).equals(new Set<Object>{
				null
			});
			Boolean isAllNull2 = new Set<Object>(volumes2.values()).equals(new Set<Object>{
				null
			});
			system.debug(isAllNull1);
			system.debug(isAllNull2);

			Map<String, diffWrap> volume_compare = new Map<String, diffWrap>();

			if (!isAllNull1 || !isAllNull2) {
				volume_compare = compareVolume(volumes1, volumes2);
			}

			// ********************** DONE COMPARING
			comparisonMap.put(productId,
				new attachmentWrap(
					addon_compare, charges_compare, products_compare, rateCards_compare, volume_compare
				)
			);
		}

		return comparisonMap;
	}

	public class diffWrap {
		public Object old_value {
			get;
			set;
		}
		public Object new_value {
			get;
			set;
		}
		public String status {
			get;
			set;
		}

		public diffWrap(Object old_value, Object new_value, String status) {
			this.old_value = old_value;
			this.new_value = new_value;
			this.status = status;
		}

		public diffWrap() {
			this.status = status;
		}
	}


	public class addonWrap {
		public diffWrap oneOff {
			get;
			set;
		}
		public diffWrap recurring {
			get;
			set;
		}
		public String status {
			get;
			set;
		}

		public addonWrap(diffWrap oneOff, diffWrap recurring, String status) {
			this.oneOff = oneOff;
			this.recurring = recurring;
			this.status = status;
		}

		public addonWrap() {

		}
	}

	public class rcWrap {

		public String status {
			get;
			set;
		}

		public Map<String, diffWrap> rcl {
			get;
			set;
		}


		public rcWrap(Map<String, diffWrap> rcl, String status) {
			this.rcl = rcl;
			this.status = status;
		}

	}

	public class attachmentWrap {
		public Map<String, addonWrap> addons {
			get;
			set;
		}

		public Map<String, Map<String, diffWrap>> charges {
			get;
			set;
		}
		public Map<String, diffWrap> product {
			get;
			set;
		}
		public Map<String, rcWrap> rateCard {
			get;
			set;
		}
		public Map<String, diffWrap> volume {
			get;
			set;
		}

		public attachmentWrap(
			Map<String, addonWrap> addons,
			Map<String, Map<String, diffWrap>> charges,
			Map<String, diffWrap> product,
			Map<String, rcWrap> rateCard,
			Map<String, diffWrap> volume
		) {
			this.addons = addons;
			this.charges = charges;
			this.product = product;
			this.rateCard = rateCard;
			this.volume = volume;
		}
	}
}