import json

PutRequest = []
libraries = []
r2 = {"Libraries": libraries}
capacities = {"carpenter": 56, "olin": 200, "uris":125, "gates":20, "mann":60, "law": 35}

#carpenter hall gen
p1 = [{"S": "103C"}, {"S": "103D"}, {"S": "109"}, {"S": "110"}]
row = {"PutRequest": {"Item": { "libID": {"S": "carpenter"}, "libName": {"S": "Carpenter Hall"}, "libCapacity": {"N": str(capacities['carpenter'])}, "tables": {"L": p1}, "latitude": {"N": "-76.484129"}, "longitude": {"N": "42.444807"}}}}
libraries.append(row)
#carpenter tables gen
for i in range(capacities['carpenter']):
	item = {"libID": {"S": "carpenter"}, "tabID": {}, "reservable": {"BOOL": False}, "occupied": {"BOOL": False}}
	tabidStr = "CH" + str(i)
	item['tabID'] = {"S": tabidStr}
	packed = {"PutRequest": {"Item": item}}
	p1.append({"S": tabidStr})
	PutRequest.append(packed)


#olin library gen
p2 = [{"S": "302"}, {"S": "402"}, {"S": "404"}]
row = {"PutRequest": {"Item": { "libID": {"S": "olin"}, "libName": {"S": "Olin Library"}, "libCapacity": {"N": str(capacities['olin'])}, "tables": {"L": p2}, "latitude": {"N": "-76.484250"}, "longitude": {"N": "42.447881"}}}}
libraries.append(row)
#olin tables gen
for i in range(capacities['olin']):
	item = {"libID": {"S": "olin"}, "tabID": {}, "reservable": {"BOOL": False}, "occupied": {"BOOL": False}}
	tabidStr = "OL" + str(i)
	item['tabID'] = {"S": tabidStr}
	packed = {"PutRequest": {"Item": item}}
	p2.append({"S": tabidStr})
	PutRequest.append(packed)


#uris library gen
p3 = [{"S": "4B02"}, {"S": "4B03"}, {"S": "4B04"}]
row = {"PutRequest": {"Item": { "libID": {"S": "uris"}, "libName": {"S": "Uris Library"}, "libCapacity": {"N": str(capacities['uris'])}, "tables": {"L": p3}, "latitude": {"N": "-76.485310"}, "longitude": {"N": "42.447699"}}}}
libraries.append(row)
#uris tables gen
for i in range(capacities['uris']):
	item = {"libID": {"S": "uris"}, "tabID": {}, "reservable": {"BOOL": False}, "occupied": {"BOOL": False}}
	tabidStr = "UL" + str(i)
	item['tabID'] = {"S": tabidStr}
	packed = {"PutRequest": {"Item": item}}
	p3.append({"S": tabidStr})
	PutRequest.append(packed)


#gates hall gen
p4 = [{"S": "G23 room1"}, {"S": "G23 room2"}, {"S": "G23 room3"}, {"S": "G23 room4"}, {"S": "G23 room5"}]
row = {"PutRequest": {"Item": { "libID": {"S": "gates"}, "libName": {"S": "Gates Hall"}, "libCapacity": {"N": str(capacities['gates'])}, "tables": {"L": p4}, "latitude": {"N": "-76.480999"}, "longitude": {"N": "42.444973"}}}}
libraries.append(row)
#gates tables gen
for i in range(capacities['gates']):
	item = {"libID": {"S": "gates"}, "tabID": {}, "reservable": {"BOOL": False}, "occupied": {"BOOL": False}}
	tabidStr = "GATES" + str(i)
	item['tabID'] = {"S": tabidStr}
	packed = {"PutRequest": {"Item": item}}
	p4.append({"S": tabidStr})
	PutRequest.append(packed)


#mann library gen
p5 = [{"S": "Station 1"}, {"S": "Station 2"}]
row = {"PutRequest": {"Item": { "libID": {"S": "mann"}, "libName": {"S": "Mann Library"}, "libCapacity": {"N": str(capacities['mann'])}, "tables": {"L": p5}, "latitude": {"N": "-76.476414"}, "longitude": {"N": "42.448757"}}}}
libraries.append(row)
#mann tables gen
for i in range(capacities['mann']):
	item = {"libID": {"S": "mann"}, "tabID": {}, "reservable": {"BOOL": False}, "occupied": {"BOOL": False}}
	tabidStr = "MANN" + str(i)
	item['tabID'] = {"S": tabidStr}
	packed = {"PutRequest": {"Item": item}}
	p5.append({"S": tabidStr})
	PutRequest.append(packed)


#law library gen
p6 = [{"S": "Claudy Casual Reading Room"}, {"S": "Interview Room B20-A"}, {"S": "Interview Room B20-B"}, {"S": "Squash Court"}, {"S": "Study Room 471"}, {"S": "Study Room 473"}]
row = {"PutRequest": {"Item": { "libID": {"S": "law"}, "libName": {"S": "Law Library"}, "libCapacity": {"N": str(capacities['law'])}, "tables": {"L": p6}, "latitude": {"N": "-76.485772"}, "longitude": {"N": "42.443855"}}}}
libraries.append(row)
#law tables gen
for i in range(capacities['law']):
	item = {"libID": {"S": "law"}, "tabID": {}, "reservable": {"BOOL": False}, "occupied": {"BOOL": False}}
	tabidStr = "LAW" + str(i)
	item['tabID'] = {"S": tabidStr}
	packed = {"PutRequest": {"Item": item}}
	p6.append({"S": tabidStr})
	PutRequest.append(packed)


with open('libraries_updated_seed.json', 'w') as f2:
	json.dump(r2, f2)


#batch write limit is about 25 requests
groups = int(len(PutRequest) / 20)
remaining = len(PutRequest) % 20
for i in range(groups):
	temp = {"Tables": PutRequest[i * 20: (i + 1) * 20]}
	with open('occu/tables_occu_seed'+ str(i) +'.json', 'w') as f:
		json.dump(temp, f)

if remaining > 0:
	temp = {"Tables": PutRequest[groups * 20: len(PutRequest)]}
	with open('occu/tables_occu_seed'+ str(groups) +'.json', 'w') as f:
		json.dump(temp, f)

