import csv
from random import *
with open('ccMlData.csv', 'w') as csvfile:
    filewriter = csv.writer(csvfile, delimiter=',',
                            quotechar='|', quoting=csv.QUOTE_MINIMAL)
    filewriter.writerow(['libID', 'Distance', 'Quiet', 'Monitor'])
    for k in range(100):
        libId = randint(1, 4)
        dis = random()*randint(1, 4)
        if(libId==1):
            if(random()<0.8):
                q = 1
            else:
                q = 0
            if(random()<0.6):
                m = 1
            else:
                m = 0
            filewriter.writerow(['carpenter', dis, q, m])
        elif(libId==2):
            if(random()<0.7):
                q = 1
            else:
                q = 0
            if(random()<0.55):
                m = 1
            else:
                m = 0
            filewriter.writerow(['olin', dis, q, m])
        elif(libId==3):
            if(random()<0.6):
                q = 1
            else:
                q = 0
            if(random()<0.4):
                m = 1
            else:
                m = 0
            filewriter.writerow(['uris', dis, q, m])
        elif(libId==4):
            if(random()<0.35):
                q = 1
            else:
                q = 0
            if(random()<0.8):
                m = 1
            else:
                m = 0
            filewriter.writerow(['gates', dis, q, m])
