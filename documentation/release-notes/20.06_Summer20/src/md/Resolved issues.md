# Resolved issues

## T-49412: Expand expression parsing use cases

Format expressions not to ignore spaces as a part of pre-evaluation setup.

## T-50839: Open SF link in partners community

Previously, opening a SF link from FAM did not take into account the specific URL format within a partner community.

## T-50871: FAM allows negative values and values over 100% for discounts

Introduced the custom setting "Negotiate min/max restriction" governing whether the user can perform negotiation with negative values and values over 100% (in case of percentage discount).

## T-51339: Issue with multiple versions of active FA

Upon activating a version of Frame Agreement: the original will have its "Replaced by" field set to the version that was activated most recently.

## T-51345: FAM shows N/A for 0 valued charges

Fixed charge evaluation while fetching commercial product data.

## T-49841: Handle expired products

FAM will recognize deactivated/deleted products and search for their replacement.
If no replacement is found, they will be removed from Frame Agreement. A warning will be issued for this scenario.

## T-49509: Fix invisible app crash on invalid products

Fixed the scenario in which Frame Agreement validation was ignored.

## T-49651: Threshold breach comparison not fixed to same number of decimal places

FAM refactored to ignore decimal places during calculations.

## T-49415: onCPLoad subscription applied on CP filtering

Fixed commercial product filtering ignoring restriction set by user.

## T-51701: Frame agreement number not populated correctly when creating a new version of FA

Changed approach to generate agreement numbers, it will be properly populated for new versions of FA.
