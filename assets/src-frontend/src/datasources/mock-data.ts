import {
	AppSettings,
	CommercialProductData,
	CommercialProductStandalone,
	FrameAgreement
} from './interfaces';

export const mockAppSettings: AppSettings = {
	account: {
		id: 'mockID',
		name: 'mockName'
	},
	headerData: {},
	customTabsData: {},
	buttonCustomData: {},
	buttonStandardData: {},
	relatedListsData: {},
	addonCategorizationData: {},
	categorizationData: {},
	facSettings: {}
};

export const mockFrameAgreements: FrameAgreement[] = [
	{ id: 'a1t1t000000kEIkAAM', name: 'AGR-017520', lastModifiedDate: 1608129028000 },
	{ id: 'a1t1t000000kEQKAA2', name: 'AGR-017851', lastModifiedDate: 1608124475000 },
	{ id: 'a1t1t000000kEBjAAM', name: 'AGR-017341', lastModifiedDate: 1606490153000 },
	{ id: 'a1t1t000000ZeTkAAK', name: 'AGR-017340', lastModifiedDate: 1606401386000 },
	{ id: 'a1t1t000000kEIQAA2', name: 'AGR-017518', lastModifiedDate: 1606401358000 },
	{ id: 'a1t1t000000kEIVAA2', name: 'AGR-017519', lastModifiedDate: 1606398651000 },
	{ id: 'a1t1t000000BkUzAAK', name: 'AGR-017013', lastModifiedDate: 1606388986000 },
	{ id: 'a1t1t000000kEEYAA2', name: 'AGR-017352', lastModifiedDate: 1605614507000 },
	{ id: 'a1t1t000000kEBoAAM', name: 'AGR-017342', lastModifiedDate: 1605614431000 },
	{ id: 'a1t1t000000BkVEAA0', name: 'AGR-017016', lastModifiedDate: 1605196737000 },
	{ id: 'a1t1t000000BkVJAA0', name: 'AGR-017017', lastModifiedDate: 1600867393000 },
	{ id: 'a1t1t000000BkVTAA0', name: 'AGR-017019', lastModifiedDate: 1600867389000 },
	{ id: 'a1t1t000000BkVOAA0', name: 'AGR-017018', lastModifiedDate: 1600865968000 },
	{ id: 'a1t1t000000BkV9AAK', name: 'AGR-017015', lastModifiedDate: 1600860641000 },
	{ id: 'a1t1t000000BkV4AAK', name: 'AGR-017014', lastModifiedDate: 1600856206000 }
];

export const mockCommercialProductData: CommercialProductData = {
	cpData: {
		a1F1t0000001JBoEAM: {
			addons: [],
			allowances: [],
			rateCards: []
		},
		a1F1t0000001JBZEA2: {
			addons: [],
			allowances: [
				{
					id: 'a1x1t0000001iWkAAI',
					name: 'ALL1'
				}
			],
			rateCards: []
		},
		a1F1t0000001JBUEA2: {
			addons: [
				{
					id: 'a1A1t0000003SXxEAM'
				},
				{
					id: 'a1A1t0000003SgeEAE'
				}
			],
			allowances: [
				{
					id: 'a1x1t0000001iWkAAI',
					name: 'ALL1'
				},
				{
					id: 'a1x1t00000049NCAAY',
					name: 'ALL2'
				}
			],
			rateCards: [
				{
					authId: 'a0x1t000001RjC9AAK',
					id: 'a1N1t0000001QxrEAE',
					name: 'Domestic',
					rateCardLines: [
						{
							id: 'a1M1t000000BFrVEAW',
							name: 'Voice',
							rateValue: 1
						},
						{
							id: 'a1M1t000000peaJEAQ',
							name: 'Data',
							rateValue: 2
						}
					]
				},
				{
					authId: 'a0x1t000000yZF3AAM',
					id: 'a1N1t0000001X2dEAE',
					name: 'International',
					rateCardLines: [
						{
							id: 'a1M1t000000peXUEAY',
							name: 'Voice',
							rateValue: 3
						},
						{
							id: 'a1M1t000000peXZEAY',
							name: 'Data',
							rateValue: 4
						},
						{
							id: 'a1M1t000000peXeEAI',
							name: 'SMS',
							rateValue: 5
						}
					]
				},
				{
					id: 'a1N1t000000GUYgEAO',
					name: 'Dimensional',
					rateCardLines: [
						{
							id: 'a1M1t000000WwSIEA0',
							name: 'RCL4.3',
							rateValue: 6
						},
						{
							id: 'a1M1t000000WwS8EAK',
							name: 'RCL4.1',
							rateValue: 7
						},
						{
							id: 'a1M1t000000WwSDEA0',
							name: 'RCL4.2',
							rateValue: 8
						},
						{
							id: 'a1M1t000000WwSNEA0',
							name: 'RCL4.4',
							rateValue: 9
						}
					]
				}
			]
		}
	}
};

export const mockCommercialProducts: CommercialProductStandalone[] = [
	{
		name: 'Project Manager',
		id: 'a1F1t0000001JBoEAM',
		contractTerm: '24 months',
		isActive: true,
		oneOffCharge: null,
		recurringCharge: 269
	},
	{
		name: 'Mobile L',
		id: 'a1F1t0000001JBUEA2',
		contractTerm: '24 months',
		isActive: true,
		oneOffCharge: null,
		recurringCharge: 33.06
	},
	{
		name: 'Microsoft E3',
		id: 'a1F1t0000001JBjEAM',
		contractTerm: '24 months',
		isActive: false,
		oneOffCharge: 269,
		recurringCharge: null
	}
];
