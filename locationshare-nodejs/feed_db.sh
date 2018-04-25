#!/bin/bash

tablelist=$(aws dynamodb list-tables)

if [[ $tablelist != *"Libraries"* ]]; then
	echo "Creating \"Libraries\" table."
	aws dynamodb create-table --table-name Libraries \
		--attribute-definitions AttributeName=libID,AttributeType=S \
		--key-schema AttributeName=libID,KeyType=HASH \
		--provisioned-throughput ReadCapacityUnits=5,WriteCapacityUnits=5
fi

if [[ $tablelist != *"LibraryAvailability"* ]]; then
	echo "Creating \"LibraryAvailability\" table."
	aws dynamodb create-table --table-name LibraryAvailability \
		--attribute-definitions AttributeName=libID,AttributeType=S \
		--key-schema AttributeName=libID,KeyType=HASH \
		--provisioned-throughput ReadCapacityUnits=5,WriteCapacityUnits=5
fi

if [[ $tablelist != *"Users"* ]]; then
	echo "Creating \"Users\" table."
	aws dynamodb create-table --table-name Users \
		--attribute-definitions AttributeName=username,AttributeType=S \
		--key-schema AttributeName=username,KeyType=HASH \
		--provisioned-throughput ReadCapacityUnits=5,WriteCapacityUnits=5
fi

if [[ $tablelist != *"Tables"* ]]; then
	echo "Creating \"Tables\" table."
	aws dynamodb create-table --table-name Tables \
		--attribute-definitions AttributeName=tabID,AttributeType=S \
		--key-schema AttributeName=tabID,KeyType=HASH \
		--provisioned-throughput ReadCapacityUnits=5,WriteCapacityUnits=5
fi

aws dynamodb batch-write-item --request-items file://seeds/libraries_seed.json
aws dynamodb batch-write-item --request-items file://seeds/library_availability_seed.json
aws dynamodb batch-write-item --request-items file://seeds/users_seed.json
aws dynamodb batch-write-item --request-items file://seeds/tables_seed.json

echo "If you see ResourceNotFoundException, wait for 10 seconds and run this script again."