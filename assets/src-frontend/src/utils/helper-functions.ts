import {
	CommercialProductStandalone,
	CommercialProductData,
	Addon,
	AttachmentOriginalItems
} from '../datasources';

export const createAttExtended = (
	commercialProducts: CommercialProductStandalone[],
	productsData: CommercialProductData,
	standaloneAddons: Addon[]
): AttachmentOriginalItems => {
	const cps = commercialProducts?.reduce((result, currentCp) => {
		result[currentCp.id] = currentCp;
		return result;
	}, {} as { [id: string]: CommercialProductStandalone });

	const aos = standaloneAddons?.reduce((result, currentAo) => {
		result[currentAo.id] = currentAo;
		return result;
	}, {} as { [id: string]: Addon });

	const attachmentOriginalItems: AttachmentOriginalItems = {
		commercialProducts: cps,
		commercialProductData: productsData,
		standaloneAddons: aos
	};

	return attachmentOriginalItems;
};
