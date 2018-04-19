aws dynamodb batch-write-item --request-items file://seeds/libraries_seed.json
aws dynamodb batch-write-item --request-items file://seeds/library_availability_seed.json
aws dynamodb batch-write-item --request-items file://seeds/users_seed.json
aws dynamodb batch-write-item --request-items file://seeds/tables_seed.json