rm -rf data
mkdir data
mongoimport --db usersdb --collection users --type json --file seeds/users_seed.json --jsonArray
mongoimport --db usersdb --collection courses --type json --file seeds/courses_seed.json --jsonArray
mongoimport --db usersdb --collection timetable --type json --file seeds/timetable_seed.json --jsonArray
mongoimport --db usersdb --collection vocs --type json --file seeds/voc_seed.json --jsonArray
