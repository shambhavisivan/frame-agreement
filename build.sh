#!/bin/bash

echo "reactapp: build and test"

cd assets/src-frontend
npm ci
npm run build
npm run lint
npm run test

EXITCODE=$?

if [ $EXITCODE -ne 0 ]; then
	exit $EXITCODE;
fi

cd ../..

function changedFiles() {
	git diff --name-only HEAD~1
}

if changedFiles | grep -q salesforce/src; then
	echo "sfdx: build and test"
	bash ./sfdx-build-script.sh
	EXITCODE=$?
fi

exit $EXITCODE