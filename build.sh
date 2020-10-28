#!/bin/bash

echo "reactapp: build and test"

# TODO: should be updated to the latest ts-app.
npm ci
npm run build

EXITCODE=$?

if [ $EXITCODE -ne 0 ]; then
	exit $EXITCODE;
fi

function changedFiles() {
	git diff --name-only HEAD~1
}

if changedFiles | grep -q salesforce/src; then
	echo "sfdx: build and test"
	bash ./sfdx-build-script.sh
	EXITCODE=$?
fi

exit $EXITCODE