A major persisting issue is the localisation of the decimal separator. FAM will try to respect the user's localisation while rendering inputs and number values, but the following points should be taken into consideration:

- The decimal separator for number inputs is sourced from the language settings of the user's OS. This information is not exposed by the browser (which is important because we would consume this information otherwise).

- Number values represented as text require custom enforcement. This information is taken from the globally exposed window.navigator object. The browser populates this value from the main language in settings (Settings > Languages).

Summary: 

- Input localisation is taken from the OS, everything else is governed by the browser language.
- The user should keep the two information sources in line

Sources:
https://html.spec.whatwg.org/multipage/system-state.html
https://developer.mozilla.org/en-US/docs/Web/API/NavigatorLanguage/language