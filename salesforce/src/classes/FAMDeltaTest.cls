@isTest

private class FAMDeltaTest {

	static String getUUID() {
		Blob b = Crypto.GenerateAESKey(128);

		String h = EncodingUtil.ConvertTohex(b);

		String guid = h.SubString(0, 8) + '-' + h.SubString(8, 12) + '-' + h.SubString(12, 16) + '-' + h.SubString(16, 20) + '-' + h.substring(20);

		return guid;
	}

	static Map <String, Integer> setupVolumeParams(Integer muc, Integer mucp, Integer mv, Integer mvp) {

		Map <String, Integer> volumes = new Map <String, Integer>();

		volumes.put('muc', muc);
		volumes.put('mucp', mucp);
		volumes.put('mv', mv);
		volumes.put('mvp', mvp);

		return volumes;
	}

	static Map <String, Integer> setupRateCardsParams(List <Integer> rclvalues) {

		Map <String, Integer> rcAtt = new Map <String, Integer>();

		for (Integer i = 0; i < rclvalues.size(); i++) {
			rcAtt.put('rcl' + i, rclvalues[i]);
		}

		system.debug(rclvalues);
		system.debug(rcAtt);

		return rcAtt;
	}

	static Map <String, Object> setupAddonsParams(List <Integer> oneOffList, List <Integer> recurringList) {
		// Always have the same length
		Map <String, Object> addons = new Map <String, Object>();

		for (Integer i = 0; i < oneOffList.size(); i++) {

			Map <String, Integer> att = new Map <String, Integer>();
			att.put('oneOff', oneOffList[i]);
			att.put('recurring', recurringList[i]);

			addons.put('addon' + i, att);
		}

		return addons;

	}

	public static testMethod void testCompareVolume() {

		// Basic
		Map <String, Integer> volume1 = setupVolumeParams(120, 2140, 10500, 330);
		Map <String, Integer> volume2 = setupVolumeParams(330, 2140, 1100, 330);

		// Null
		Map <String, Integer> volume3 = setupVolumeParams(null, 2140, 10500, 330);
		Map <String, Integer> volume4 = setupVolumeParams(120, 2140, null, 500);

		Test.startTest();

		Map <String, FAMDelta.diffWrap> result1 = FAMDelta.compareVolume(volume1, volume2);
		Map <String, FAMDelta.diffWrap> result2 = FAMDelta.compareVolume(volume3, volume4);

		Test.stopTest();

		// system.assertEqual(expected, real);

		// ************ result1 ************
		system.assertEquals('changed', result1.get('muc').status);
		system.assertEquals('unchanged', result1.get('mucp').status);
		system.assertEquals('changed', result1.get('mv').status);
		system.assertEquals('unchanged', result1.get('mvp').status);

		// 330 - 330
		system.assertEquals(result1.get('mvp').new_value, result1.get('mvp').old_value);

		system.assertEquals(10500, result1.get('mv').old_value);
		system.assertEquals(1100, result1.get('mv').new_value);

		// 2140 - 2140
		system.assertEquals(result1.get('mucp').new_value, result1.get('mucp').old_value);

		system.assertEquals(120, result1.get('muc').old_value);
		system.assertEquals(330, result1.get('muc').new_value);

		// ************ result2 ************
		system.assertEquals('changed', result2.get('muc').status);
		system.assertEquals('unchanged', result2.get('mucp').status);
		system.assertEquals('changed', result2.get('mv').status);
		system.assertEquals('changed', result2.get('mvp').status);

		system.assertEquals(330, result2.get('mvp').old_value);
		system.assertEquals(500, result2.get('mvp').new_value);

		system.assertEquals(10500, result2.get('mv').old_value);
		system.assertEquals(null, result2.get('mv').new_value);

		// 2140 - 2140
		system.assertEquals(result2.get('mucp').new_value, result2.get('mucp').old_value);

		system.assertEquals(null, result2.get('muc').old_value);
		system.assertEquals(120, result2.get('muc').new_value);
	}

	public static testMethod void testCompareAddons() {

		// Basic
		Map <String, Object> addons1 = setupAddonsParams(new List <Integer>{
			19, 45, null, 32, 16
		}, new List <Integer>{
			85, 41, null, 52, 10
		});
		Map <String, Object> addons2 = setupAddonsParams(new List <Integer>{
			19, 55, null, 74, 16
		}, new List <Integer>{
			85, 52, null, 32, 11
		});

		// Added
		Map <String, Object> addons3 = setupAddonsParams(new List <Integer>{
			19, 45, 32
		}, new List <Integer>{
			19, 52, 32
		});
		Map <String, Object> addons4 = setupAddonsParams(new List <Integer>{
			19, 52, 32, 46
		}, new List <Integer>{
			10, 22, 23, 16
		});

		// Removed
		Map <String, Object> addons5 = setupAddonsParams(new List <Integer>{
			19, 52, 32, 46
		}, new List <Integer>{
			10, 22, 23, 16
		});
		Map <String, Object> addons6 = setupAddonsParams(new List <Integer>{
			19, 45, 32
		}, new List <Integer>{
			19, 52, 32
		});

		Test.startTest();

		Map <String, FAMDelta.addonWrap> basic = FAMDelta.compareAddons(addons1, addons2);
		Map <String, FAMDelta.addonWrap> added = FAMDelta.compareAddons(addons3, addons4);
		Map <String, FAMDelta.addonWrap> removed = FAMDelta.compareAddons(addons5, addons6);

		Test.stopTest();

		// Basic
		// https://pastebin.com/2xjh9hfC
		system.assertEquals('unchanged', basic.get('addon0').status);
		system.assertEquals('unchanged', basic.get('addon0').oneOff.status);
		system.assertEquals('unchanged', basic.get('addon0').recurring.status);

		system.assertEquals('changed', basic.get('addon1').status);
		system.assertEquals('changed', basic.get('addon1').oneOff.status);
		system.assertEquals('changed', basic.get('addon1').recurring.status);

		system.assertEquals('unchanged', basic.get('addon2').status);
		system.assertEquals('unchanged', basic.get('addon2').oneOff.status);
		system.assertEquals('unchanged', basic.get('addon2').recurring.status);

		system.assertEquals('changed', basic.get('addon3').status);
		system.assertEquals('changed', basic.get('addon3').oneOff.status);
		system.assertEquals('changed', basic.get('addon3').recurring.status);

		system.assertEquals('changed', basic.get('addon4').status);
		system.assertEquals('unchanged', basic.get('addon4').oneOff.status);
		system.assertEquals('changed', basic.get('addon4').recurring.status);

		// Added
		// https://pastebin.com/ECBzRHri
		system.assertEquals('changed', added.get('addon0').status);
		system.assertEquals('unchanged', added.get('addon0').oneOff.status);
		system.assertEquals('changed', added.get('addon0').recurring.status);

		system.assertEquals('added', added.get('addon3').status);
		system.assertEquals('added', added.get('addon3').oneOff.status);
		system.assertEquals(46, added.get('addon3').oneOff.new_value);
		system.assertEquals(null, added.get('addon3').oneOff.old_value);

		system.assertEquals('added', added.get('addon3').recurring.status);
		system.assertEquals(16, added.get('addon3').recurring.new_value);
		system.assertEquals(null, added.get('addon3').recurring.old_value);

		// Removed
		// https://pastebin.com/Ax9T2Ub2
		system.assertEquals('changed', removed.get('addon0').status);
		system.assertEquals('unchanged', removed.get('addon0').oneOff.status);
		system.assertEquals('changed', removed.get('addon0').recurring.status);

		system.assertEquals('removed', removed.get('addon3').status);
		system.assertEquals('removed', removed.get('addon3').oneOff.status);
		system.assertEquals(null, removed.get('addon3').oneOff.new_value);
		system.assertEquals(46, removed.get('addon3').oneOff.old_value);

		system.assertEquals('removed', removed.get('addon3').recurring.status);
		system.assertEquals(null, removed.get('addon3').recurring.new_value);
		system.assertEquals(16, removed.get('addon3').recurring.old_value);

	}

	public static testMethod void testCompareProductCharges() {
		// Setup
		Map <String, Integer> pcharges1 = new Map <String, Integer>();
		Map <String, Integer> pcharges2 = new Map <String, Integer>();
		Map <String, Integer> pcharges3 = new Map <String, Integer>();
		Map <String, Integer> pcharges4 = new Map <String, Integer>();

		pcharges1.put('oneOff', null);
		pcharges1.put('recurring', 2140);

		pcharges2.put('oneOff', 10500);
		pcharges2.put('recurring', 330);

		pcharges3.put('oneOff', null);
		pcharges3.put('recurring', 2140);

		pcharges4.put('oneOff', null);
		pcharges4.put('recurring', 500);

		Test.startTest();

		Map <String, FAMDelta.diffWrap> diff1 = FAMDelta.compareProductCharges(pcharges1, pcharges2);
		Map <String, FAMDelta.diffWrap> diff2 = FAMDelta.compareProductCharges(pcharges1, pcharges3);
		Map <String, FAMDelta.diffWrap> diff3 = FAMDelta.compareProductCharges(pcharges1, pcharges4);

		Test.stopTest();

		// All diffs
		// https://pastebin.com/mC8fVBsZ
		system.assertEquals('changed', diff1.get('recurring').status);
		system.assertEquals(2140, diff1.get('recurring').old_value);
		system.assertEquals(330, diff1.get('recurring').new_value);

		system.assertEquals('changed', diff1.get('oneOff').status);
		system.assertEquals(null, diff1.get('oneOff').old_value);
		system.assertEquals(10500, diff1.get('oneOff').new_value);

		system.assertEquals('unchanged', diff2.get('recurring').status);
		system.assertEquals(2140, diff2.get('recurring').old_value);
		system.assertEquals(2140, diff2.get('recurring').new_value);

		system.assertEquals('unchanged', diff2.get('oneOff').status);
		system.assertEquals(null, diff2.get('oneOff').old_value);
		system.assertEquals(null, diff2.get('oneOff').new_value);

		system.assertEquals('changed', diff3.get('recurring').status);
		system.assertEquals(2140, diff3.get('recurring').old_value);
		system.assertEquals(500, diff3.get('recurring').new_value);

		system.assertEquals('unchanged', diff3.get('oneOff').status);
		system.assertEquals(null, diff3.get('oneOff').old_value);
		system.assertEquals(null, diff3.get('oneOff').new_value);
	}

	public static testMethod void testCompareCharges() {
		// Setup

		Map <String, Map <String, Integer>> chargeAtt1 = new Map <String, Map <String, Integer>>();
		chargeAtt1.put('charges1', new Map <String, Integer>{
			'oneOff' => 2140
		});
		chargeAtt1.put('charges3', new Map <String, Integer>{
			'recurring' => 330
		});
		chargeAtt1.put('charges5', new Map <String, Integer>{
			'oneOff' => 330
		});
		chargeAtt1.put('charges7', new Map <String, Integer>{
			'recurring' => 10500
		});
		chargeAtt1.put('charges9', new Map <String, Integer>{
			'oneOff' => 250
		});

		Map <String, Map <String, Integer>> chargeAtt2 = new Map <String, Map <String, Integer>>();
		chargeAtt2.put('charges1', new Map <String, Integer>{
			'oneOff' => 2140
		});
		chargeAtt2.put('charges3', new Map <String, Integer>{
			'recurring' => 330
		});
		chargeAtt2.put('charges5', new Map <String, Integer>{
			'oneOff' => 2140
		});
		chargeAtt2.put('charges7', new Map <String, Integer>{
			'recurring' => 330
		});
		chargeAtt2.put('charges9', new Map <String, Integer>{
			'recurring' => 500
		});

		Test.startTest();

		Map <String, Map <String, FAMDelta.diffWrap>> diff = FAMDelta.compareCharges(chargeAtt1, chargeAtt2);

		Test.stopTest();

		Map <String, FAMDelta.diffWrap> diff1 = diff.get('charges1');
		system.assertEquals('unchanged', diff1.get('oneOff').status);
		system.assertEquals(2140, diff1.get('oneOff').new_value);
		system.assertEquals(2140, diff1.get('oneOff').old_value);

		Map <String, FAMDelta.diffWrap> diff2 = diff.get('charges3');
		system.assertEquals('unchanged', diff2.get('recurring').status);
		system.assertEquals(330, diff2.get('recurring').old_value);
		system.assertEquals(330, diff2.get('recurring').new_value);

		Map <String, FAMDelta.diffWrap> diff3 = diff.get('charges5');
		system.assertEquals('changed', diff3.get('oneOff').status);
		system.assertEquals(330, diff3.get('oneOff').old_value);
		system.assertEquals(2140, diff3.get('oneOff').new_value);

		Map <String, FAMDelta.diffWrap> diff4 = diff.get('charges7');
		system.assertEquals('changed', diff4.get('recurring').status);
		system.assertEquals(10500, diff4.get('recurring').old_value);
		system.assertEquals(330, diff4.get('recurring').new_value);

		Map <String, FAMDelta.diffWrap> diff5 = diff.get('charges9');
		system.assertEquals('changed', diff5.get('oneOff').status);
		system.assertEquals(250, diff5.get('oneOff').old_value);
		system.assertEquals(null, diff5.get('oneOff').new_value);

	}

	public static testMethod void testCompareRateCards() {
		// Setup

		Map <String, Map <String, Integer>> rcAtt1 = new Map <String, Map <String, Integer>>();
		rcAtt1.put('rc1', setupRateCardsParams(new List<Integer>{
			124, 55, 32
		}));
		rcAtt1.put('rc2', setupRateCardsParams(new List<Integer>{
			45, 22
		}));
		rcAtt1.put('rc3', setupRateCardsParams(new List<Integer>{
			87, 22
		}));
		rcAtt1.put('rc5', setupRateCardsParams(new List<Integer>{
			47, 62, 79
		}));


		Map <String, Map <String, Integer>> rcAtt2 = new Map <String, Map <String, Integer>>();
		rcAtt2.put('rc1', setupRateCardsParams(new List<Integer>{
			124, 22, 33
		}));
		rcAtt2.put('rc2', setupRateCardsParams(new List<Integer>{
			45
		}));
		rcAtt2.put('rc3', setupRateCardsParams(new List<Integer>{
			87, 22, 77
		}));
		rcAtt2.put('rc4', setupRateCardsParams(new List<Integer>{
			47, 62, 79
		}));

		Test.startTest();

		// https://pastebin.com/3fCVXbTy
		Map <String, FAMDelta.rcWrap> diff = FAMDelta.compareRateCards(rcAtt1, rcAtt2);

		Test.stopTest();

		FAMDelta.rcWrap rc1 = diff.get('rc1');
		system.assertEquals('changed', rc1.status);

		Map <String, FAMDelta.diffWrap> rcl1List = rc1.rcl;
		system.assertEquals('unchanged', rcl1List.get('rcl0').status);
		system.assertEquals('changed', rcl1List.get('rcl1').status);
		system.assertEquals('changed', rcl1List.get('rcl2').status);


		FAMDelta.rcWrap rc2 = diff.get('rc2');
		system.assertEquals('unchanged', rc2.status);

		Map <String, FAMDelta.diffWrap> rcl2List = rc2.rcl;
		system.assertEquals('unchanged', rcl2List.get('rcl0').status);
		// system.assertEquals('added', rcl2List.get('rcl1').status);


		FAMDelta.rcWrap rc3 = diff.get('rc3');
		system.assertEquals('unchanged', rc3.status);

		Map <String, FAMDelta.diffWrap> rcl3List = rc3.rcl;
		system.assertEquals('unchanged', rcl3List.get('rcl0').status);
		system.assertEquals('unchanged', rcl3List.get('rcl1').status);
		system.assertEquals('changed', rcl3List.get('rcl2').status);


		FAMDelta.rcWrap rc4 = diff.get('rc4');
		system.assertEquals('added', rc4.status);

		Map <String, FAMDelta.diffWrap> rcl4List = rc4.rcl;
		system.assertEquals('added', rcl4List.get('rcl0').status);
		system.assertEquals('added', rcl4List.get('rcl1').status);
		system.assertEquals('added', rcl4List.get('rcl2').status);


		FAMDelta.rcWrap rc5 = diff.get('rc5');
		system.assertEquals('removed', rc5.status);

		Map <String, FAMDelta.diffWrap> rcl5List = rc5.rcl;
		system.assertEquals('removed', rcl5List.get('rcl0').status);
		system.assertEquals('removed', rcl5List.get('rcl1').status);
		system.assertEquals('removed', rcl5List.get('rcl2').status);


	}

	public static testMethod void testCompareFrameAgreements() {
		csconta__Frame_Agreement__c fa1 = new csconta__Frame_Agreement__c(csconta__Agreement_Name__c = 'FA SAME', csconta__effective_end_date__c = DateTime.newInstance(2019, 12, 17, 13, 6, 6), csconta__agreement_level__c = 'Frame Agreement', csconta__Status__c = 'Draft');
		csconta__Frame_Agreement__c fa2 = new csconta__Frame_Agreement__c(csconta__Agreement_Name__c = 'FA SAME', csconta__effective_end_date__c = DateTime.newInstance(2019, 12, 17, 13, 6, 6), csconta__agreement_level__c = 'Master Agreement', csconta__Status__c = 'Active');

		insert fa1;
		insert fa2;


		Test.startTest();

		Map <String, Object> diff = FAMDelta.compareFrameAgreements(fa1.Id, fa2.Id);

		Test.stopTest();

		// https://pastebin.com/9vFw9aLL
		FAMDelta.diffWrap name_diff = (FAMDelta.diffWrap) diff.get('csconta__Agreement_Name__c');
		FAMDelta.diffWrap level_diff = (FAMDelta.diffWrap) diff.get('csconta__agreement_level__c');
		FAMDelta.diffWrap end_date_diff = (FAMDelta.diffWrap) diff.get('csconta__effective_end_date__c');
		FAMDelta.diffWrap status_diff = (FAMDelta.diffWrap) diff.get('csconta__Status__c');

		system.assertEquals('unchanged', name_diff.status);
		system.assertEquals('changed', level_diff.status);
		system.assertEquals('unchanged', end_date_diff.status);
		system.assertEquals('changed', status_diff.status);


	}

	public static testMethod void testGetDiff() {
		csconta__Frame_Agreement__c fa1 = new csconta__Frame_Agreement__c(csconta__Agreement_Name__c = 'FA SAME', csconta__effective_end_date__c = DateTime.newInstance(2019, 12, 17, 13, 6, 6), csconta__agreement_level__c = 'Frame Agreement', csconta__Status__c = 'Draft');
		csconta__Frame_Agreement__c fa2 = new csconta__Frame_Agreement__c(csconta__Agreement_Name__c = 'FA SAME', csconta__effective_end_date__c = DateTime.newInstance(2019, 12, 17, 13, 6, 6), csconta__agreement_level__c = 'Master Agreement', csconta__Status__c = 'Active');

		insert fa1;
		insert fa2;

		String att1 = '{"custom":"","products":{"a1F1t0000001JBoEAM":{"_volume":{"mv":null,"mvp":null,"muc":null,"mucp":null},"_product":{"recurring":269},"_allowances":{}},"a1F1t0000001JBZEA2":{"_volume":{"mv":null,"mvp":null,"muc":null,"mucp":null},"_product":{"recurring":269},"_rateCards":{"a1N1t0000001QxrEAE":{"a1M1t000000BFrVEAW":124.99}},"_allowances":{"a1x1t0000001iWkAAI":{"Name":"ALL1","value":14}}},"a1F1t0000001JBUEA2":{"_volume":{"mv":null,"mvp":null,"muc":null,"mucp":null},"_addons":{"a1A1t0000003SXxEAM":{"oneOff":5,"recurring":19.79},"a1A1t0000003SgeEAE":{"oneOff":10.99,"recurring":31.99}},"_product":{"oneOff":67,"recurring":267},"_rateCards":{"a1N1t0000001QxrEAE":{"a1M1t000000BFrVEAW":120.99},"a1N1t0000001X2dEAE":{"a1M1t000000peXUEAY":50.98,"a1M1t000000peXZEAY":65.43,"a1M1t000000peXeEAI":12.99},"a1N1t000000GUYbEAO":{"a1M1t000000WwRtEAK":50.43,"a1M1t000000WwS3EAK":12.9,"a1M1t000000WwRyEAK":44.21},"a1N1t000000GUYgEAO":{"a1M1t000000WwSIEA0":10.88,"a1M1t000000WwS8EAK":41.11,"a1M1t000000WwSDEA0":14.55,"a1M1t000000WwSNEA0":76.55}},"_allowances":{"a1x1t0000001iWkAAI":{"Name":"ALL1","value":14},"a1x1t00000049NCAAY":{"Name":"ALL2","value":14}}},"a1F1t0000001JCDEA2":{"_volume":{"mv":null,"mvp":null,"muc":null,"mucp":null},"_product":{"recurring":269},"_allowances":{}}}}';
		String att2 = '{"custom":"","products":{"a1F1t0000001JBoEAM":{"_volume":{"mv":null,"mvp":null,"muc":null,"mucp":null},"_product":{"recurring":269},"_allowances":{}},"a1F1t0000001JBZEA2":{"_volume":{"mv":null,"mvp":null,"muc":null,"mucp":null},"_product":{"recurring":269},"_allowances":{"a1x1t0000001iWkAAI":{"Name":"ALL1","value":14}}},"a1F1t0000001JBUEA2":{"_volume":{"mv":null,"mvp":null,"muc":null,"mucp":null},"_addons":{"a1A1t0000003SXxEAM":{"oneOff":10,"recurring":21.79},"a1A1t0000003SgeEAE":{"oneOff":10.99,"recurring":31.99}},"_product":{"oneOff":69,"recurring":269},"_rateCards":{"a1N1t0000001QxrEAE":{"a1M1t000000BFrVEAW":124.99},"a1N1t0000001X2dEAE":{"a1M1t000000peXUEAY":55.98,"a1M1t000000peXZEAY":65.43,"a1M1t000000peXeEAI":12.99},"a1N1t000000GUYbEAO":{"a1M1t000000WwRtEAK":55.43,"a1M1t000000WwS3EAK":12.9,"a1M1t000000WwRyEAK":44.21},"a1N1t000000GUYgEAO":{"a1M1t000000WwSIEA0":10.88,"a1M1t000000WwS8EAK":41.11,"a1M1t000000WwSDEA0":14.55,"a1M1t000000WwSNEA0":76.55}},"_allowances":{"a1x1t0000001iWkAAI":{"Name":"ALL1","value":14},"a1x1t00000049NCAAY":{"Name":"ALL2","value":14}}},"a1F1t0000001JBjEAM":{"_volume":{"mv":null,"mvp":null,"muc":null,"mucp":null},"_addons":{"a1A1t0000003SbnEAE":{"oneOff":10,"recurring":12}},"_product":{"recurring":269},"_allowances":{}}}}';

		String expected_diff = '{"_products":{"a1F1t0000001JBUEA2":{"volume":{},"rateCard":{"a1N1t000000GUYgEAO":{"status":"unchanged","rcl":{"a1M1t000000WwSNEA0":{"status":"unchanged","old_value":76.55,"new_value":76.55},"a1M1t000000WwSDEA0":{"status":"unchanged","old_value":14.55,"new_value":14.55},"a1M1t000000WwS8EAK":{"status":"unchanged","old_value":41.11,"new_value":41.11},"a1M1t000000WwSIEA0":{"status":"unchanged","old_value":10.88,"new_value":10.88}}},"a1N1t000000GUYbEAO":{"status":"changed","rcl":{"a1M1t000000WwRyEAK":{"status":"unchanged","old_value":44.21,"new_value":44.21},"a1M1t000000WwS3EAK":{"status":"unchanged","old_value":12.9,"new_value":12.9},"a1M1t000000WwRtEAK":{"status":"changed","old_value":50.43,"new_value":55.43}}},"a1N1t0000001X2dEAE":{"status":"changed","rcl":{"a1M1t000000peXeEAI":{"status":"unchanged","old_value":12.99,"new_value":12.99},"a1M1t000000peXZEAY":{"status":"unchanged","old_value":65.43,"new_value":65.43},"a1M1t000000peXUEAY":{"status":"changed","old_value":50.98,"new_value":55.98}}},"a1N1t0000001QxrEAE":{"status":"changed","rcl":{"a1M1t000000BFrVEAW":{"status":"changed","old_value":120.99,"new_value":124.99}}}},"product":{"recurring":{"status":"changed","old_value":267,"new_value":269},"oneOff":{"status":"changed","old_value":67,"new_value":69}},"charges":{},"addons":{"a1A1t0000003SgeEAE":{"status":"unchanged","recurring":{"status":"unchanged","old_value":31.99,"new_value":31.99},"oneOff":{"status":"unchanged","old_value":10.99,"new_value":10.99}},"a1A1t0000003SXxEAM":{"status":"changed","recurring":{"status":"changed","old_value":19.79,"new_value":21.79},"oneOff":{"status":"changed","old_value":5,"new_value":10}}}},"a1F1t0000001JBZEA2":{"volume":{},"rateCard":{"a1N1t0000001QxrEAE":{"status":"removed","rcl":{"a1M1t000000BFrVEAW":{"status":"removed","old_value":124.99,"new_value":null}}}},"product":{"recurring":{"status":"unchanged","old_value":269,"new_value":269},"oneOff":{"status":"unchanged","old_value":null,"new_value":null}},"charges":{},"addons":{}},"a1F1t0000001JBoEAM":{"volume":{},"rateCard":{},"product":{"recurring":{"status":"unchanged","old_value":269,"new_value":269},"oneOff":{"status":"unchanged","old_value":null,"new_value":null}},"charges":{},"addons":{}},"a1F1t0000001JBjEAM":"added","a1F1t0000001JCDEA2":"removed"},"csconta__agreement_level__c":{"status":"changed","old_value":"Frame Agreement","new_value":"Master Agreement"},"csconta__effective_end_date__c":{"status":"unchanged","old_value":"2019-12-17T13:06:06.000Z","new_value":"2019-12-17T13:06:06.000Z"},"csconta__Status__c":{"status":"changed","old_value":"Draft","new_value":"Active"},"csconta__Agreement_Name__c":{"status":"unchanged","old_value":"FA SAME","new_value":"FA SAME"}}';

		FrameRateManagerController.saveAttachment(fa1.Id, att1);
		FrameRateManagerController.saveAttachment(fa2.Id, att2);

		Test.startTest();

		Map <String, Object> diff = FAMDelta.getDelta(fa1.Id, fa2.Id);

		Test.stopTest();
		system.debug(JSON.serialize(diff));
		system.assertEquals(expected_diff, JSON.serialize(diff));

	}

	public static testMethod void testGetDiffNoCharges() {
		csconta__Frame_Agreement__c fa1 = new csconta__Frame_Agreement__c(csconta__Agreement_Name__c = 'FA SAME', csconta__effective_end_date__c = DateTime.newInstance(2019, 12, 17, 13, 6, 6), csconta__agreement_level__c = 'Frame Agreement', csconta__Status__c = 'Draft');
		csconta__Frame_Agreement__c fa2 = new csconta__Frame_Agreement__c(csconta__Agreement_Name__c = 'FA SAME', csconta__effective_end_date__c = DateTime.newInstance(2019, 12, 17, 13, 6, 6), csconta__agreement_level__c = 'Master Agreement', csconta__Status__c = 'Active');

		insert fa1;
		insert fa2;

		String att_no_charges_1 = '{"custom":"","products":{"a1F1t0000001JBoEAM":{"_volume":{"mv":null,"mvp":null,"muc":null,"mucp":null},"_product":{"recurring":269},"_charges":{"a1I1t000001WkzoEAC":{"oneOff":7}}},"a1F1t0000001JBZEA2":{"_volume":{"mv":null,"mvp":null,"muc":null,"mucp":null},"_product":{"recurring":269},"_allowances":{"a1x1t0000001iWkAAI":{"Name":"ALL1","value":14}}},"a1F1t0000001JBUEA2":{"_volume":{"mv":null,"mvp":null,"muc":null,"mucp":null},"_addons":{"a1A1t0000003SXxEAM":{"oneOff":10,"recurring":21.79},"a1A1t0000003SgeEAE":{"oneOff":10.99,"recurring":31.99}},"_product":{"oneOff":69,"recurring":269},"_rateCards":{"a1N1t0000001QxrEAE":{"a1M1t000000BFrVEAW":124.99},"a1N1t0000001X2dEAE":{"a1M1t000000peXUEAY":55.98,"a1M1t000000peXZEAY":65.43,"a1M1t000000peXeEAI":12.99},"a1N1t000000GUYbEAO":{"a1M1t000000WwRtEAK":55.43,"a1M1t000000WwS3EAK":12.9,"a1M1t000000WwRyEAK":44.21},"a1N1t000000GUYgEAO":{"a1M1t000000WwSIEA0":10.88,"a1M1t000000WwS8EAK":41.11,"a1M1t000000WwSDEA0":14.55,"a1M1t000000WwSNEA0":76.55}},"_allowances":{"a1x1t0000001iWkAAI":{"Name":"ALL1","value":14},"a1x1t00000049NCAAY":{"Name":"ALL2","value":14}}},"a1F1t0000001JBjEAM":{"_volume":{"mv":null,"mvp":null,"muc":null,"mucp":null},"_addons":{"a1A1t0000003SbnEAE":{"oneOff":10,"recurring":12}},"_product":{"recurring":269},"_allowances":{}},"a1F1t00000017Y0EAI":{"_volume":{"mv":null,"mvp":null,"muc":null,"mucp":null},"_addons":{"a1A1t0000002cIMEAY":{"oneOff":8.49,"recurring":12.75},"a1A1t0000003ScfEAE":{"oneOff":8.49,"recurring":82.44}},"_charges":{"a1I1t000001WkzjEAC":{"recurring":12}},"_rateCards":{"a1N1t0000001QxrEAE":{"a1M1t000000BFrVEAW":124.99},"a1N1t000000GUYbEAO":{"a1M1t000000WwRtEAK":55.43,"a1M1t000000WwS3EAK":12.9,"a1M1t000000WwRyEAK":44.21},"a1N1t000000GUYgEAO":{"a1M1t000000WwSIEA0":10.88,"a1M1t000000WwS8EAK":41.11,"a1M1t000000WwSDEA0":14.55,"a1M1t000000WwSNEA0":76.55}},"_allowances":{"a1x1t0000001iWkAAI":{"Name":"ALL1","value":14}}}}}';
		String att_no_charges_2 = '{"custom":"","products":{"a1F1t0000001JBoEAM":{"_volume":{"mv":null,"mvp":null,"muc":null,"mucp":null},"_product":{"recurring":269},"_charges":{"a1I1t000001WkzjEAC":{"recurring":12},"a1I1t000001WkzoEAC":{"oneOff":7}}},"a1F1t0000001JBZEA2":{"_volume":{"mv":null,"mvp":null,"muc":null,"mucp":null},"_product":{"recurring":269},"_rateCards":{"a1N1t0000001QxrEAE":{"a1M1t000000BFrVEAW":124.99}},"_allowances":{"a1x1t0000001iWkAAI":{"Name":"ALL1","value":14}}},"a1F1t0000001JBUEA2":{"_volume":{"mv":null,"mvp":null,"muc":null,"mucp":null},"_addons":{"a1A1t0000003SXxEAM":{"oneOff":5,"recurring":19.79},"a1A1t0000003SgeEAE":{"oneOff":10.99,"recurring":31.99}},"_product":{"oneOff":67,"recurring":267},"_rateCards":{"a1N1t0000001QxrEAE":{"a1M1t000000BFrVEAW":120.99},"a1N1t0000001X2dEAE":{"a1M1t000000peXUEAY":50.98,"a1M1t000000peXZEAY":65.43,"a1M1t000000peXeEAI":12.99},"a1N1t000000GUYbEAO":{"a1M1t000000WwRtEAK":50.43,"a1M1t000000WwS3EAK":12.9,"a1M1t000000WwRyEAK":44.21},"a1N1t000000GUYgEAO":{"a1M1t000000WwSIEA0":10.88,"a1M1t000000WwS8EAK":41.11,"a1M1t000000WwSDEA0":14.55,"a1M1t000000WwSNEA0":76.55}},"_allowances":{"a1x1t0000001iWkAAI":{"Name":"ALL1","value":14},"a1x1t00000049NCAAY":{"Name":"ALL2","value":14}}},"a1F1t0000001JCDEA2":{"_volume":{"mv":null,"mvp":null,"muc":null,"mucp":null},"_product":{"recurring":269},"_charges":{"a1I1t000001WkzjEAC":{"recurring":12},"a1I1t000001WkzoEAC":{"oneOff":7}}},"a1F1t00000017Y0EAI":{"_volume":{"mv":null,"mvp":null,"muc":null,"mucp":null},"_addons":{"a1A1t0000002cIMEAY":{"oneOff":8.49,"recurring":12.75},"a1A1t0000003ScfEAE":{"oneOff":8.49,"recurring":82.44}},"_rateCards":{"a1N1t0000001QxrEAE":{"a1M1t000000BFrVEAW":124.99},"a1N1t000000GUYbEAO":{"a1M1t000000WwRtEAK":55.43,"a1M1t000000WwS3EAK":12.9,"a1M1t000000WwRyEAK":44.21},"a1N1t000000GUYgEAO":{"a1M1t000000WwSIEA0":10.88,"a1M1t000000WwS8EAK":41.11,"a1M1t000000WwSDEA0":14.55,"a1M1t000000WwSNEA0":76.55}},"_allowances":{"a1x1t0000001iWkAAI":{"Name":"ALL1","value":14}}}}}';

		String expected_diff = '{"_products":{"a1F1t00000017Y0EAI":{"volume":{},"rateCard":{"a1N1t000000GUYgEAO":{"status":"unchanged","rcl":{"a1M1t000000WwSNEA0":{"status":"unchanged","old_value":76.55,"new_value":76.55},"a1M1t000000WwSDEA0":{"status":"unchanged","old_value":14.55,"new_value":14.55},"a1M1t000000WwS8EAK":{"status":"unchanged","old_value":41.11,"new_value":41.11},"a1M1t000000WwSIEA0":{"status":"unchanged","old_value":10.88,"new_value":10.88}}},"a1N1t000000GUYbEAO":{"status":"unchanged","rcl":{"a1M1t000000WwRyEAK":{"status":"unchanged","old_value":44.21,"new_value":44.21},"a1M1t000000WwS3EAK":{"status":"unchanged","old_value":12.9,"new_value":12.9},"a1M1t000000WwRtEAK":{"status":"unchanged","old_value":55.43,"new_value":55.43}}},"a1N1t0000001QxrEAE":{"status":"unchanged","rcl":{"a1M1t000000BFrVEAW":{"status":"unchanged","old_value":124.99,"new_value":124.99}}}},"product":{},"charges":{"a1I1t000001WkzjEAC":{"recurring":{"status":"removed","old_value":12,"new_value":null}}},"addons":{"a1A1t0000003ScfEAE":{"status":"unchanged","recurring":{"status":"unchanged","old_value":82.44,"new_value":82.44},"oneOff":{"status":"unchanged","old_value":8.49,"new_value":8.49}},"a1A1t0000002cIMEAY":{"status":"unchanged","recurring":{"status":"unchanged","old_value":12.75,"new_value":12.75},"oneOff":{"status":"unchanged","old_value":8.49,"new_value":8.49}}}},"a1F1t0000001JBUEA2":{"volume":{},"rateCard":{"a1N1t000000GUYgEAO":{"status":"unchanged","rcl":{"a1M1t000000WwSNEA0":{"status":"unchanged","old_value":76.55,"new_value":76.55},"a1M1t000000WwSDEA0":{"status":"unchanged","old_value":14.55,"new_value":14.55},"a1M1t000000WwS8EAK":{"status":"unchanged","old_value":41.11,"new_value":41.11},"a1M1t000000WwSIEA0":{"status":"unchanged","old_value":10.88,"new_value":10.88}}},"a1N1t000000GUYbEAO":{"status":"changed","rcl":{"a1M1t000000WwRyEAK":{"status":"unchanged","old_value":44.21,"new_value":44.21},"a1M1t000000WwS3EAK":{"status":"unchanged","old_value":12.9,"new_value":12.9},"a1M1t000000WwRtEAK":{"status":"changed","old_value":55.43,"new_value":50.43}}},"a1N1t0000001X2dEAE":{"status":"changed","rcl":{"a1M1t000000peXeEAI":{"status":"unchanged","old_value":12.99,"new_value":12.99},"a1M1t000000peXZEAY":{"status":"unchanged","old_value":65.43,"new_value":65.43},"a1M1t000000peXUEAY":{"status":"changed","old_value":55.98,"new_value":50.98}}},"a1N1t0000001QxrEAE":{"status":"changed","rcl":{"a1M1t000000BFrVEAW":{"status":"changed","old_value":124.99,"new_value":120.99}}}},"product":{"recurring":{"status":"changed","old_value":269,"new_value":267},"oneOff":{"status":"changed","old_value":69,"new_value":67}},"charges":{},"addons":{"a1A1t0000003SgeEAE":{"status":"unchanged","recurring":{"status":"unchanged","old_value":31.99,"new_value":31.99},"oneOff":{"status":"unchanged","old_value":10.99,"new_value":10.99}},"a1A1t0000003SXxEAM":{"status":"changed","recurring":{"status":"changed","old_value":21.79,"new_value":19.79},"oneOff":{"status":"changed","old_value":10,"new_value":5}}}},"a1F1t0000001JBZEA2":{"volume":{},"rateCard":{"a1N1t0000001QxrEAE":{"status":"added","rcl":{"a1M1t000000BFrVEAW":{"status":"added","old_value":null,"new_value":124.99}}}},"product":{"recurring":{"status":"unchanged","old_value":269,"new_value":269},"oneOff":{"status":"unchanged","old_value":null,"new_value":null}},"charges":{},"addons":{}},"a1F1t0000001JBoEAM":{"volume":{},"rateCard":{},"product":{"recurring":{"status":"unchanged","old_value":269,"new_value":269},"oneOff":{"status":"unchanged","old_value":null,"new_value":null}},"charges":{"a1I1t000001WkzjEAC":{"recurring":{"status":"added","old_value":null,"new_value":12}},"a1I1t000001WkzoEAC":{"oneOff":{"status":"unchanged","old_value":7,"new_value":7}}},"addons":{}},"a1F1t0000001JCDEA2":"added","a1F1t0000001JBjEAM":"removed"},"csconta__agreement_level__c":{"status":"changed","old_value":"Frame Agreement","new_value":"Master Agreement"},"csconta__effective_end_date__c":{"status":"unchanged","old_value":"2019-12-17T13:06:06.000Z","new_value":"2019-12-17T13:06:06.000Z"},"csconta__Status__c":{"status":"changed","old_value":"Draft","new_value":"Active"},"csconta__Agreement_Name__c":{"status":"unchanged","old_value":"FA SAME","new_value":"FA SAME"}}';

		FrameRateManagerController.saveAttachment(fa1.Id, att_no_charges_1);
		FrameRateManagerController.saveAttachment(fa2.Id, att_no_charges_2);


		Test.startTest();

		Map <String, Object> diff_no_charges = FAMDelta.getDelta(fa1.Id, fa2.Id);

		Test.stopTest();

		system.assertEquals(expected_diff, JSON.serialize(diff_no_charges));

	}

	public static testMethod void testGetDiffNoAddons() {
		csconta__Frame_Agreement__c fa1 = new csconta__Frame_Agreement__c(csconta__Agreement_Name__c = 'FA SAME', csconta__effective_end_date__c = DateTime.newInstance(2019, 12, 17, 13, 6, 6), csconta__agreement_level__c = 'Frame Agreement', csconta__Status__c = 'Draft');
		csconta__Frame_Agreement__c fa2 = new csconta__Frame_Agreement__c(csconta__Agreement_Name__c = 'FA SAME', csconta__effective_end_date__c = DateTime.newInstance(2019, 12, 17, 13, 6, 6), csconta__agreement_level__c = 'Master Agreement', csconta__Status__c = 'Active');

		insert fa1;
		insert fa2;

		String att_no_addons_1 = '{"custom":"","products":{"a1F1t0000001JBoEAM":{"_volume":{"mv":null,"mvp":null,"muc":null,"mucp":null},"_product":{"recurring":269},"_allowances":{}},"a1F1t0000001JBZEA2":{"_volume":{"mv":null,"mvp":null,"muc":null,"mucp":null},"_product":{"recurring":269},"_allowances":{"a1x1t0000001iWkAAI":{"Name":"ALL1","value":14}}},"a1F1t0000001JBUEA2":{"_volume":{"mv":null,"mvp":null,"muc":null,"mucp":null},"_addons":{"a1A1t0000003SXxEAM":{"oneOff":10,"recurring":21.79},"a1A1t0000003SgeEAE":{"oneOff":10.99,"recurring":31.99}},"_product":{"oneOff":69,"recurring":269},"_rateCards":{"a1N1t0000001QxrEAE":{"a1M1t000000BFrVEAW":124.99},"a1N1t0000001X2dEAE":{"a1M1t000000peXUEAY":55.98,"a1M1t000000peXZEAY":65.43,"a1M1t000000peXeEAI":12.99},"a1N1t000000GUYbEAO":{"a1M1t000000WwRtEAK":55.43,"a1M1t000000WwS3EAK":12.9,"a1M1t000000WwRyEAK":44.21},"a1N1t000000GUYgEAO":{"a1M1t000000WwSIEA0":10.88,"a1M1t000000WwS8EAK":41.11,"a1M1t000000WwSDEA0":14.55,"a1M1t000000WwSNEA0":76.55}},"_allowances":{"a1x1t0000001iWkAAI":{"Name":"ALL1","value":14},"a1x1t00000049NCAAY":{"Name":"ALL2","value":14}}},"a1F1t0000001JBjEAM":{"_volume":{"mv":null,"mvp":null,"muc":null,"mucp":null},"_addons":{"a1A1t0000003SbnEAE":{"oneOff":10,"recurring":12}},"_product":{"recurring":269},"_allowances":{}},"a1F1t00000017Y0EAI":{"_volume":{"mv":null,"mvp":null,"muc":null,"mucp":null},"_addons":{"a1A1t0000002cIMEAY":{"oneOff":8.49,"recurring":12.75},"a1A1t0000003ScfEAE":{"oneOff":8.49,"recurring":82.44}},"_charges":{"a1I1t000001WkzjEAC":{"recurring":12},"a1I1t000001WkzoEAC":{"oneOff":7}},"_rateCards":{"a1N1t0000001QxrEAE":{"a1M1t000000BFrVEAW":124.99},"a1N1t000000GUYbEAO":{"a1M1t000000WwRtEAK":55.43,"a1M1t000000WwS3EAK":12.9,"a1M1t000000WwRyEAK":44.21},"a1N1t000000GUYgEAO":{"a1M1t000000WwSIEA0":10.88,"a1M1t000000WwS8EAK":41.11,"a1M1t000000WwSDEA0":14.55,"a1M1t000000WwSNEA0":76.55}},"_allowances":{"a1x1t0000001iWkAAI":{"Name":"ALL1","value":14}}}}}';
		String att_no_addons_2 = '{"custom":"","products":{"a1F1t0000001JBoEAM":{"_volume":{"mv":null,"mvp":null,"muc":null,"mucp":null},"_product":{"recurring":269},"_allowances":{}},"a1F1t0000001JBZEA2":{"_volume":{"mv":null,"mvp":null,"muc":null,"mucp":null},"_product":{"recurring":269},"_rateCards":{"a1N1t0000001QxrEAE":{"a1M1t000000BFrVEAW":124.99}},"_allowances":{"a1x1t0000001iWkAAI":{"Name":"ALL1","value":14}}},"a1F1t0000001JBUEA2":{"_volume":{"mv":null,"mvp":null,"muc":null,"mucp":null},"_addons":{"a1A1t0000003SXxEAM":{"oneOff":5,"recurring":19.79},"a1A1t0000003SgeEAE":{"oneOff":10.99,"recurring":31.99}},"_product":{"oneOff":67,"recurring":267},"_rateCards":{"a1N1t0000001QxrEAE":{"a1M1t000000BFrVEAW":120.99},"a1N1t0000001X2dEAE":{"a1M1t000000peXUEAY":50.98,"a1M1t000000peXZEAY":65.43,"a1M1t000000peXeEAI":12.99},"a1N1t000000GUYbEAO":{"a1M1t000000WwRtEAK":50.43,"a1M1t000000WwS3EAK":12.9,"a1M1t000000WwRyEAK":44.21},"a1N1t000000GUYgEAO":{"a1M1t000000WwSIEA0":10.88,"a1M1t000000WwS8EAK":41.11,"a1M1t000000WwSDEA0":14.55,"a1M1t000000WwSNEA0":76.55}},"_allowances":{"a1x1t0000001iWkAAI":{"Name":"ALL1","value":14},"a1x1t00000049NCAAY":{"Name":"ALL2","value":14}}},"a1F1t0000001JCDEA2":{"_volume":{"mv":null,"mvp":null,"muc":null,"mucp":null},"_product":{"recurring":269},"_allowances":{}},"a1F1t00000017Y0EAI":{"_volume":{"mv":null,"mvp":null,"muc":null,"mucp":null},"_addons":{"a1A1t0000002cIMEAY":{"oneOff":8.49,"recurring":12.75},"a1A1t0000003ScfEAE":{"oneOff":8.49,"recurring":82.44}},"_charges":{"a1I1t000001WkzjEAC":{"recurring":12},"a1I1t000001WkzoEAC":{"oneOff":7}},"_rateCards":{"a1N1t0000001QxrEAE":{"a1M1t000000BFrVEAW":124.99},"a1N1t000000GUYbEAO":{"a1M1t000000WwRtEAK":55.43,"a1M1t000000WwS3EAK":12.9,"a1M1t000000WwRyEAK":44.21},"a1N1t000000GUYgEAO":{"a1M1t000000WwSIEA0":10.88,"a1M1t000000WwS8EAK":41.11,"a1M1t000000WwSDEA0":14.55,"a1M1t000000WwSNEA0":76.55}},"_allowances":{"a1x1t0000001iWkAAI":{"Name":"ALL1","value":14}}}}}';

		String expected_diff = '{"_products":{"a1F1t00000017Y0EAI":{"volume":{},"rateCard":{"a1N1t000000GUYgEAO":{"status":"unchanged","rcl":{"a1M1t000000WwSNEA0":{"status":"unchanged","old_value":76.55,"new_value":76.55},"a1M1t000000WwSDEA0":{"status":"unchanged","old_value":14.55,"new_value":14.55},"a1M1t000000WwS8EAK":{"status":"unchanged","old_value":41.11,"new_value":41.11},"a1M1t000000WwSIEA0":{"status":"unchanged","old_value":10.88,"new_value":10.88}}},"a1N1t000000GUYbEAO":{"status":"unchanged","rcl":{"a1M1t000000WwRyEAK":{"status":"unchanged","old_value":44.21,"new_value":44.21},"a1M1t000000WwS3EAK":{"status":"unchanged","old_value":12.9,"new_value":12.9},"a1M1t000000WwRtEAK":{"status":"unchanged","old_value":55.43,"new_value":55.43}}},"a1N1t0000001QxrEAE":{"status":"unchanged","rcl":{"a1M1t000000BFrVEAW":{"status":"unchanged","old_value":124.99,"new_value":124.99}}}},"product":{},"charges":{"a1I1t000001WkzoEAC":{"oneOff":{"status":"unchanged","old_value":7,"new_value":7}},"a1I1t000001WkzjEAC":{"recurring":{"status":"unchanged","old_value":12,"new_value":12}}},"addons":{"a1A1t0000003ScfEAE":{"status":"unchanged","recurring":{"status":"unchanged","old_value":82.44,"new_value":82.44},"oneOff":{"status":"unchanged","old_value":8.49,"new_value":8.49}},"a1A1t0000002cIMEAY":{"status":"unchanged","recurring":{"status":"unchanged","old_value":12.75,"new_value":12.75},"oneOff":{"status":"unchanged","old_value":8.49,"new_value":8.49}}}},"a1F1t0000001JBUEA2":{"volume":{},"rateCard":{"a1N1t000000GUYgEAO":{"status":"unchanged","rcl":{"a1M1t000000WwSNEA0":{"status":"unchanged","old_value":76.55,"new_value":76.55},"a1M1t000000WwSDEA0":{"status":"unchanged","old_value":14.55,"new_value":14.55},"a1M1t000000WwS8EAK":{"status":"unchanged","old_value":41.11,"new_value":41.11},"a1M1t000000WwSIEA0":{"status":"unchanged","old_value":10.88,"new_value":10.88}}},"a1N1t000000GUYbEAO":{"status":"changed","rcl":{"a1M1t000000WwRyEAK":{"status":"unchanged","old_value":44.21,"new_value":44.21},"a1M1t000000WwS3EAK":{"status":"unchanged","old_value":12.9,"new_value":12.9},"a1M1t000000WwRtEAK":{"status":"changed","old_value":55.43,"new_value":50.43}}},"a1N1t0000001X2dEAE":{"status":"changed","rcl":{"a1M1t000000peXeEAI":{"status":"unchanged","old_value":12.99,"new_value":12.99},"a1M1t000000peXZEAY":{"status":"unchanged","old_value":65.43,"new_value":65.43},"a1M1t000000peXUEAY":{"status":"changed","old_value":55.98,"new_value":50.98}}},"a1N1t0000001QxrEAE":{"status":"changed","rcl":{"a1M1t000000BFrVEAW":{"status":"changed","old_value":124.99,"new_value":120.99}}}},"product":{"recurring":{"status":"changed","old_value":269,"new_value":267},"oneOff":{"status":"changed","old_value":69,"new_value":67}},"charges":{},"addons":{"a1A1t0000003SgeEAE":{"status":"unchanged","recurring":{"status":"unchanged","old_value":31.99,"new_value":31.99},"oneOff":{"status":"unchanged","old_value":10.99,"new_value":10.99}},"a1A1t0000003SXxEAM":{"status":"changed","recurring":{"status":"changed","old_value":21.79,"new_value":19.79},"oneOff":{"status":"changed","old_value":10,"new_value":5}}}},"a1F1t0000001JBZEA2":{"volume":{},"rateCard":{"a1N1t0000001QxrEAE":{"status":"added","rcl":{"a1M1t000000BFrVEAW":{"status":"added","old_value":null,"new_value":124.99}}}},"product":{"recurring":{"status":"unchanged","old_value":269,"new_value":269},"oneOff":{"status":"unchanged","old_value":null,"new_value":null}},"charges":{},"addons":{}},"a1F1t0000001JBoEAM":{"volume":{},"rateCard":{},"product":{"recurring":{"status":"unchanged","old_value":269,"new_value":269},"oneOff":{"status":"unchanged","old_value":null,"new_value":null}},"charges":{},"addons":{}},"a1F1t0000001JCDEA2":"added","a1F1t0000001JBjEAM":"removed"},"csconta__agreement_level__c":{"status":"changed","old_value":"Frame Agreement","new_value":"Master Agreement"},"csconta__effective_end_date__c":{"status":"unchanged","old_value":"2019-12-17T13:06:06.000Z","new_value":"2019-12-17T13:06:06.000Z"},"csconta__Status__c":{"status":"changed","old_value":"Draft","new_value":"Active"},"csconta__Agreement_Name__c":{"status":"unchanged","old_value":"FA SAME","new_value":"FA SAME"}}';

		FrameRateManagerController.saveAttachment(fa1.Id, att_no_addons_1);
		FrameRateManagerController.saveAttachment(fa2.Id, att_no_addons_2);


		Test.startTest();

		Map <String, Object> diff_no_addons = FAMDelta.getDelta(fa1.Id, fa2.Id);

		Test.stopTest();
		system.debug(JSON.serialize(diff_no_addons));
		system.assertEquals(expected_diff, JSON.serialize(diff_no_addons));


	}

	public static testMethod void testGetDiffNoAttachment() {
		csconta__Frame_Agreement__c fa1 = new csconta__Frame_Agreement__c(csconta__Agreement_Name__c = 'FA SAME', csconta__effective_end_date__c = DateTime.newInstance(2019, 12, 17, 13, 6, 6), csconta__agreement_level__c = 'Frame Agreement', csconta__Status__c = 'Draft');
		csconta__Frame_Agreement__c fa2 = new csconta__Frame_Agreement__c(csconta__Agreement_Name__c = 'FA SAME', csconta__effective_end_date__c = DateTime.newInstance(2019, 12, 17, 13, 6, 6), csconta__agreement_level__c = 'Master Agreement', csconta__Status__c = 'Active');

		insert fa1;
		insert fa2;

		String att1 = '{"custom":"","products":{"a1F1t0000001JBoEAM":{"_volume":{"mv":null,"mvp":null,"muc":null,"mucp":null},"_product":{"recurring":269},"_allowances":{}},"a1F1t0000001JBZEA2":{"_volume":{"mv":null,"mvp":null,"muc":null,"mucp":null},"_product":{"recurring":269},"_rateCards":{"a1N1t0000001QxrEAE":{"a1M1t000000BFrVEAW":124.99}},"_allowances":{"a1x1t0000001iWkAAI":{"Name":"ALL1","value":14}}},"a1F1t0000001JBUEA2":{"_volume":{"mv":null,"mvp":null,"muc":null,"mucp":null},"_addons":{"a1A1t0000003SXxEAM":{"oneOff":5,"recurring":19.79},"a1A1t0000003SgeEAE":{"oneOff":10.99,"recurring":31.99}},"_product":{"oneOff":67,"recurring":267},"_rateCards":{"a1N1t0000001QxrEAE":{"a1M1t000000BFrVEAW":120.99},"a1N1t0000001X2dEAE":{"a1M1t000000peXUEAY":50.98,"a1M1t000000peXZEAY":65.43,"a1M1t000000peXeEAI":12.99},"a1N1t000000GUYbEAO":{"a1M1t000000WwRtEAK":50.43,"a1M1t000000WwS3EAK":12.9,"a1M1t000000WwRyEAK":44.21},"a1N1t000000GUYgEAO":{"a1M1t000000WwSIEA0":10.88,"a1M1t000000WwS8EAK":41.11,"a1M1t000000WwSDEA0":14.55,"a1M1t000000WwSNEA0":76.55}},"_allowances":{"a1x1t0000001iWkAAI":{"Name":"ALL1","value":14},"a1x1t00000049NCAAY":{"Name":"ALL2","value":14}}},"a1F1t0000001JCDEA2":{"_volume":{"mv":null,"mvp":null,"muc":null,"mucp":null},"_product":{"recurring":269},"_allowances":{}}}}';
		// String att2 = '{"custom":"","products":{"a1F1t0000001JBoEAM":{"_volume":{"mv":null,"mvp":null,"muc":null,"mucp":null},"_product":{"recurring":269},"_allowances":{}},"a1F1t0000001JBZEA2":{"_volume":{"mv":null,"mvp":null,"muc":null,"mucp":null},"_product":{"recurring":269},"_allowances":{"a1x1t0000001iWkAAI":{"Name":"ALL1","value":14}}},"a1F1t0000001JBUEA2":{"_volume":{"mv":null,"mvp":null,"muc":null,"mucp":null},"_addons":{"a1A1t0000003SXxEAM":{"oneOff":10,"recurring":21.79},"a1A1t0000003SgeEAE":{"oneOff":10.99,"recurring":31.99}},"_product":{"oneOff":69,"recurring":269},"_rateCards":{"a1N1t0000001QxrEAE":{"a1M1t000000BFrVEAW":124.99},"a1N1t0000001X2dEAE":{"a1M1t000000peXUEAY":55.98,"a1M1t000000peXZEAY":65.43,"a1M1t000000peXeEAI":12.99},"a1N1t000000GUYbEAO":{"a1M1t000000WwRtEAK":55.43,"a1M1t000000WwS3EAK":12.9,"a1M1t000000WwRyEAK":44.21},"a1N1t000000GUYgEAO":{"a1M1t000000WwSIEA0":10.88,"a1M1t000000WwS8EAK":41.11,"a1M1t000000WwSDEA0":14.55,"a1M1t000000WwSNEA0":76.55}},"_allowances":{"a1x1t0000001iWkAAI":{"Name":"ALL1","value":14},"a1x1t00000049NCAAY":{"Name":"ALL2","value":14}}},"a1F1t0000001JBjEAM":{"_volume":{"mv":null,"mvp":null,"muc":null,"mucp":null},"_addons":{"a1A1t0000003SbnEAE":{"oneOff":10,"recurring":12}},"_product":{"recurring":269},"_allowances":{}}}}';

		FrameRateManagerController.saveAttachment(fa1.Id, att1);
		// FrameRateManagerController.saveAttachment(fa2.Id, att2);

		Boolean expectedExceptionThrown = false;
		String errorMessage = '';

		Test.startTest();

		try {
			Map <String, Object> diff = FAMDelta.getDelta(fa1.Id, fa2.Id);
		} catch (Exception e) {
			expectedExceptionThrown = true;
			errorMessage = e.getMessage();
		}

		Test.stopTest();

		system.assertEquals(expectedExceptionThrown, true);
		system.assertEquals(errorMessage, 'Attachment not present in one of the frame agreements!');


	}

}