const productIds = ["id-1", "id-2"];

export const queryCpIdsInCatalogue = async () => {
	return new Promise((resolve) => {
		resolve(productIds);
	});
};

const categoriesInCatalogue = [
	{ id: "categoryid1", name: "Mobile" },
	{ id: "categoryid1", name: "Laptop" },
];

export const queryCategoriesInCatalogue = async (catalogueId = null) => {
	return new Promise((resolve) => {
		resolve(categoriesInCatalogue);
	});
};

const productsInCategory = {
	categoryid1: [
		{ id: "cpid-1", name: "Samsung A7" },
		{ id: "cpid-2", name: "Samsung A12" },
	],
	categoryid2: [
		{ id: "cpid-1", name: "Apple Macbook Pro" },
		{ id: "cpid-2", name: "Apple Airbook" },
	],
};

export const queryProductsInCategory = async (categoryId) => {
	return new Promise((resolve) => {
		resolve(productsInCategory[categoryId]);
	});
};

const offersInCategory = {
	categoryid1: [
		{ id: "ofid-1", name: "Samsung A7" },
		{ id: "ofid-2", name: "Samsung A12" },
	],
	categoryid2: [
		{ id: "ofid-1", name: "Apple Macbook Pro" },
		{ id: "ofid-2", name: "Apple Airbook" },
	],
};

export const queryOffersInCategory = async categoryId => {
	return Promise.resolve(offersInCategory[categoryId]);
}

export const queryOfferIdsInCatalogue = () => Promise.resolve(productIds);

const cpMetadata = [
	{
	  "id": "a1F1t0000001JBjEAM",
	  "name": "Mobile L_6",
	  "commercialProductMetadata": {
		"attributeMetadata": {
		  "version": "2-0-0",
		  "attributes": [
			{
			  "name": "Colour",
			  "values": [
				{
				  "value": "Midnight Green"
				},
				{
				  "value": "SpaceGrey"
				},
				{
				  "value": "Silver"
				},
				{
				  "value": "Gold"
				}
			  ]
			},
			{
			  "name": "Memory",
			  "values": [
				{
				  "value": "64"
				},
				{
				  "value": "128"
				}
			  ]
			}
		  ]
		}
	  }
	}
  ]

export const queryCpMetadataByIds = () => Promise.resolve(cpMetadata);