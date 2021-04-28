#!/bin/bash

echo "reactapp: build and test"

echo "TS check"

cd assets/src-frontend

set +ex                     # immediate script fail off, echo off
export NVM_DIR="$HOME/.nvm" # set local path to NVM
. ~/.nvm/nvm.sh             # add NVM into the Shell session
nvm install
nvm use > /dev/null 2>&1
set -ex                     # immediate script fail on (default), echo on (default)

npm ci
npm run build
npm run lint
npm run test

EXITCODE=$?

if [ $EXITCODE -ne 0 ]; then
	exit $EXITCODE;
fi

cd ../..

echo "JS check"

cd src

npm ci
npm run build

EXITCODE=$?

if [ $EXITCODE -ne 0 ]; then
	exit $EXITCODE;
fi

cd ..

function changedFiles() {
	git diff --name-only HEAD~1
}

if changedFiles | grep -q salesforce/src; then
	echo "sfdx: build and test"
	bash ./sfdx-build-script.sh
	EXITCODE=$?
fi

exit $EXITCODE