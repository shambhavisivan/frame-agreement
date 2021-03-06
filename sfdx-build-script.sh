#!/bin/bash
orgAlias=FAM-CI$BUILD_NUMBER

echo "Creating scratch org ..."
sfdx force:org:create --setdefaultusername -f ./workspace-scratch-def.json --setalias $orgAlias

function finish() {
	# make sure scratch org is removed before exit
	echo "Deleting scratch org"
	sfdx force:org:delete -u $orgAlias --noprompt
}

trap finish EXIT

echo "Installing CSUtil v33.0"
sfdx force:package:install --package 04t1n000001YWKJ  -u $orgAlias -w 20

echo "Installing ObjectGraph v1.37"
sfdx force:package:install --package 04t0X000000YVGe -u $orgAlias -w 20

echo "Installing Configurator 1.500"
sfdx force:package:install --package 04t2K000000gNTQ -u $orgAlias -w 20

echo "Installing Product and Pricing Data Model"
sfdx force:package:install --package 04t08000000FE70 -u $orgAlias -w 20

echo "Installing Cloudsense CRM Extension"
sfdx force:package:install --package 04t58000000JU3G -u $orgAlias -w 20

echo "Installing CloudSense Orders & Subscriptions Object Model v1.43"
sfdx force:package:install --package 04t2S0000002IT0 -u $orgAlias -w 20

echo "Installing Cloudsense Contracts"
sfdx force:package:install --package 04t6M000000YGsC -u $orgAlias -w 20

echo "Installing CloudSense Advanced Pricing Integration"
sfdx force:package:install --package 04t3g0000008xa6 -u $orgAlias -w 20

echo "Installing CloudSense Product Lifecyle Management(PLM)"
sfdx force:package:install --package 04t4J000001pODo -u $orgAlias -w 20

echo "Deploying source code"
sfdx force:source:push --targetusername $orgAlias -w 20

echo "Running tests"
sfdx force:apex:test:run -l RunLocalTests -u $orgAlias -r human -w 60