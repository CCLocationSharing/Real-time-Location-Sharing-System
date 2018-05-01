import csv
from random import *
with open('ccMlData.csv', 'w') as csvfile:
    filewriter = csv.writer(csvfile, delimiter=',',
                            quotechar='|', quoting=csv.QUOTE_MINIMAL)
    for k in range(50):
        filewriter.writerow(["YES", 1])
