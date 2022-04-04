import { useEffect, useState } from 'react';
import { QueryStatus } from 'react-query';
import { CommercialProductData, Addon, Attachment, AttachmentOriginalItems } from '../datasources';
import { useCommercialProducts } from './use-commercial-products';
import { useCommercialProductData } from './use-commercial-product-data';
import { useGetStandaloneAddons } from './use-get-standalone-addons';
import { createAttExtended } from '../utils/helper-functions';

export function useGetAttachmentExtended(
	attachment: Attachment,
	attachmentStatus: QueryStatus
): AttachmentOriginalItems {
	const [productIds, setProductIds] = useState<string[]>([]);

	const { data: commercialProducts, status: productsStatus } = useCommercialProducts(productIds);
	const { data: productsData, status: productDataStatus } = useCommercialProductData(
		productIds || []
	);
	const { standaloneAddons, status: aoStatus } = useGetStandaloneAddons();
	const [attachmentExtended, setAttachmentExtended] = useState<AttachmentOriginalItems>(
		{} as AttachmentOriginalItems
	);

	useEffect(() => {
		if (attachment && attachmentStatus === QueryStatus.Success) {
			setProductIds(Object.keys(attachment.products || {}));
		}
	}, [attachment, attachmentStatus]);

	useEffect(() => {
		if (
			productsStatus === QueryStatus.Success &&
			productDataStatus === QueryStatus.Success &&
			aoStatus === QueryStatus.Success
		) {
			const faAttachment: AttachmentOriginalItems = createAttExtended(
				commercialProducts || [],
				productsData || ({} as CommercialProductData),
				standaloneAddons || ([] as Addon[])
			);

			setAttachmentExtended(faAttachment);
		}
	}, [
		JSON.stringify(commercialProducts),
		JSON.stringify(productsData),
		JSON.stringify(standaloneAddons),
		productDataStatus,
		productsStatus,
		aoStatus
	]);

	return attachmentExtended;
}
