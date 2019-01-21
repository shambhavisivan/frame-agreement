        var SF;

        function createPromise(result) {
			return new Promise(resolve => {
				setTimeout(() => {
			        resolve(result);
				}, 100);
			});
        }

        

        window.SF = SF = {
            param: {
                account: '0011t00000DSEtn'
            },
        	invokeAction: function (remoteActionName, parametersArr = []) {
                let data = null;
        		switch (remoteActionName) {
        			case 'getFrameAgreements':
	        			data = [{"Id":"a1t1t0000009wpQAAQ","Name":"AGR-000000","csconta__Account__c":"0011t00000DSEtnAAH","csconta__Agreement_Name__c":"FA#1","csconta__Status__c":"Open","csconta__Valid_From__c":1547424000000,"csconta__Valid_To__c":1568419200000,"csconta__Account__r":{"Name":"Test Account","Id":"0011t00000DSEtnAAH"}}];
	        			return createPromise(data);

                    case 'getCommercialProducts':
                        data = [{"Id":"a1F1t0000001JBoEAM","Name":"Mobile L_7","cspmb__Effective_Start_Date__c":1545264000000},{"Id":"a1F1t0000001JBZEA2","Name":"Mobile L_4","cspmb__Effective_Start_Date__c":1545264000000},{"Id":"a1F1t0000001JBUEA2","Name":"Mobile L_3","cspmb__Effective_Start_Date__c":1545264000000},{"Id":"a1F1t0000001JBjEAM","Name":"Mobile L_6","cspmb__Effective_Start_Date__c":1545264000000},{"Id":"a1F1t0000001JCDEA2","Name":"Mobile L_12","cspmb__Effective_Start_Date__c":1545264000000},{"Id":"a1F1t0000001JByEAM","Name":"Mobile L_9","cspmb__Effective_Start_Date__c":1545264000000},{"Id":"a1F1t0000001JC8EAM","Name":"Mobile L_11","cspmb__Effective_Start_Date__c":1545264000000},{"Id":"a1F1t0000001JBPEA2","Name":"Mobile L_2","cspmb__Effective_Start_Date__c":1545264000000},{"Id":"a1F1t0000001JBeEAM","Name":"Mobile L_5","cspmb__Effective_Start_Date__c":1545264000000},{"Id":"a1F1t0000001JBtEAM","Name":"Mobile L_8","cspmb__Effective_Start_Date__c":1545264000000},{"Id":"a1F1t0000001JC3EAM","Name":"Mobile L_10","cspmb__Effective_Start_Date__c":1545264000000},{"Id":"a1F1t00000017Y0EAI","Name":"Mobile L","cspmb__Effective_Start_Date__c":1545264000000}];
                        return createPromise(data);

        			case 'getAppSettings':
	        			data = {commercialProductCount: 10, frameAgreementsCount: 1, itemsPerPage: 20};
	        			return createPromise(data);
        		}
        	}
        }