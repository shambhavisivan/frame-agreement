public class FieldMetadata {
	public String fieldLabel;
	public String apiName;
	public Boolean isUpdatable;
	public Boolean isCustom;
	public Integer scale;
	public Integer precision;
	public Schema.DisplayType fieldType;
	public List<String> referenceObjects;

	public FieldMetadata(Schema.DescribeFieldResult fieldDescribe) {
		this.apiName = fieldDescribe.getLocalName();
		this.fieldLabel = fieldDescribe.getLabel();
		this.isUpdatable = fieldDescribe.isUpdateable();
		this.isCustom = fieldDescribe.isCustom();
		this.scale = fieldDescribe.getScale();
		this.precision = fieldDescribe.getPrecision();
		this.fieldType = fieldDescribe.getType();

		if (fieldDescribe.getReferenceTo() != null) {
			referenceObjects = new List<String>();

			for (Schema.SObjectType reference: fieldDescribe.getReferenceTo()) {
				referenceObjects.add(reference.getDescribe().getName());
			}
		}
	}
}