console.log("Custom resource lodaded.");

subscribe("onLoad", (data) => {
    return new Promise(resolve => {



        resolve(data);
    });
})

subscribe("onFaSelect", (data) => {
    return new Promise(resolve => {
    	// window.FAC.api.toast("success", "Custom Resource", "Frame agreement selected");

        window.FAC.registerMethod("ActionFunction", () => {
             return new Promise(resolve => {
                 resolve("ActionFunction result")
             });
        });

        window.FAC.registerMethod("iFrameFunction", () => {
             return new Promise(resolve => {
                 resolve("https://cscfga.eu16.visual.force.com/apex/ManageLayout");
                 // resolve("https://eu16.salesforce.com/a1N1t0000001X2d");
             });
        });
        
        resolve(data);
    });
})

subscribe("onBeforeAddProducts", (data) => {
    return new Promise(resolve => {
    	// window.FAC.api.toast("success", "Custom Resource", "onBeforeAddProducts: total " + data.length + " products");
        resolve(data);
    });
})

subscribe("onAfterAddProducts", (data) => {
    return new Promise(resolve => {
    	// window.FAC.api.toast("success", "Custom Resource", "onBeforeAddProducts");
        resolve(data);
    });
})