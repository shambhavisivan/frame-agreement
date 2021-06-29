export enum CommercialProductRole {
	master = 'Master',
	basic = 'Basic',
	varient = 'Varient',
	offer = 'Offer'
}

export enum CommercialProductType {
	package = 'Package',
	commercialProduct = 'CommercialProduct',
	addon = 'Add-On'
}

export interface ProductFilter {
	role: CommercialProductRole;
	type: CommercialProductType;
}

interface Attribute {
	name: string;
	values: { value: string }[];
}

interface AttributeMetadata {
	version: string;
	attributes: Attribute[];
}

interface CommercialProductMetadata {
	attributeMetadata: AttributeMetadata;
}

type GroupMember = AddonFields;

interface ProductGroup {
	name: string;
	members: GroupMember[];
}

interface Pricing {
	listOneOffPrice: number;
	listRecurringPrice: number;
}

interface Product {
	id: string;
	name: string;
	effectiveStartDate: string | null;
	effectiveEndDate: string | null;
	pricing: Pricing;
	customFields: KeyValue[];
}

interface AddonFields {
	product: Product;
	externalIds: KeyValue[];
}

interface AvailableChildProduct extends AddonFields {
	group: ProductGroup | null;
}

interface KeyValue {
	key: string;
	value: string;
}

interface GraphQLResponseBasic {
	hasMore: boolean;
	nextPage: {
		after: string;
		limit: number;
	} | null;
}

interface ProductsInCatalogueData {
	id: string;
	name: string;
	role: CommercialProductRole;
	type: CommercialProductType;
}

interface ProductsInCatalogue extends GraphQLResponseBasic {
	data: ProductsInCatalogueData[];
}

export interface ProductsInCatalogueResponse {
	productsInCatalogue: ProductsInCatalogue;
}

export interface CategoriesInCatalogueData {
	id: string;
	name: string;
}

interface CategoriesInCatalogue extends GraphQLResponseBasic {
	data: CategoriesInCatalogueData[];
}

export interface CategoriesInCatalogueResponse {
	categories: CategoriesInCatalogue;
}

export interface ProductsInCategoryData {
	id: string;
	name: string;
	role: CommercialProductRole;
	type: CommercialProductType;
	sequence: number;
	primary: boolean;
}

interface ProductsInCategory extends GraphQLResponseBasic {
	data: ProductsInCategoryData[];
}

export interface ProductsInCategoryResponse {
	productsInCategory: ProductsInCategory;
}

export interface ProductsByIdsData {
	id: string;
	name: string;
	commercialProductMetadata: CommercialProductMetadata;
	availableChildProducts: AvailableChildProduct[];
}

export interface ProductsByIdsResponse {
	productsByIds: ProductsByIdsData[];
}

export interface PricingServiceApi {
	queryProductIdsInCatalogue(catalogueId: string, filter: ProductFilter): Promise<string[]>;
	queryCategoriesInCatalogue(catalogueId: string): Promise<CategoriesInCatalogueData[]>;
	queryProductsInCategory(
		categoryId: string,
		filter: ProductFilter
	): Promise<ProductsInCategoryData[]>;
	queryProductsByIds(productIds: string[]): Promise<ProductsByIdsData[]>;
}
