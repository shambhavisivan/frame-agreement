public with sharing class FAAttachmentStructure {

	public String cpId { get; private set; }
	public String cpaoaId { get; private set; }
	public String chId { get; private set; }
	public String addonId { get; private set; }
	public Decimal oneOff { get; private set; }
	public Decimal recurring { get; private set; }

	public FAAttachmentStructure(String recordId, Decimal oneOff, Decimal recurring, String type) {

		this.oneOff = oneOff;
		this.recurring = recurring;

		switch on type {
			when 'cpId' {
				this.cpId = recordId;
			}
			when 'cpaoaId' {
				this.cpaoaId = recordId;
			}
			when 'chId' {
				this.chId = recordId;
			}
			when 'addonId' {
				this.addonId = recordId;
			}
			when else {
				System.debug(LoggingLevel.Error, 'Type not valid: ' + type);
				IllegalArgumentException e = new IllegalArgumentException();
				e.setMessage('Type in the attachment not valid: ' + type);
				throw e;
			}
		}
	}
}
