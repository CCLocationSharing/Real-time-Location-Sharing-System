import csv
from random import *
with open('ccMlData.csv', 'w') as csvfile:
    filewriter = csv.writer(csvfile, delimiter=',',
                            quotechar='|', quoting=csv.QUOTE_MINIMAL)
    for k in range(100):
        varone = random()
        vartwo = random()
        varthree = random()
        varfour = random()
        result = 0.1 *varone + 0.2*vartwo+0.3*varthree+0.4*varfour
        filewriter.writerow([result, varone, vartwo, varthree, varfour])
