import csv
from random import *
with open('ccMlData.csv', 'w') as csvfile:
    filewriter = csv.writer(csvfile, delimiter=',',
                            quotechar='|', quoting=csv.QUOTE_MINIMAL)
    for k in range(50):
        varone = random()
        vartwo = random()
        varthree = random()
        varfour = random()
        result = 0.1 *varone + 0.2*vartwo+0.3*varthree+0.4*varfour
        if(result>0.5):
            filewriter.writerow(["YES", varone, vartwo, varthree, varfour])
        else:
            filewriter.writerow(["NO", varone, vartwo, varthree, varfour])
