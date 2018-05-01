import csv
from random import *
with open('ccMlData.csv', 'w') as csvfile:
    filewriter = csv.writer(csvfile, delimiter=',',
                            quotechar='|', quoting=csv.QUOTE_MINIMAL)
    #filewriter.writerow(['libID', 'Distance', 'Quiet', 'Monitor'])
    for k in range(100):
        libId = randint(1, 4)
        #dis = random()*randint(1, 4)
        if(libId==1):
            carpenter = randint(5, 100)
            olin = randint(0, 20)
            uris = randint(0, 20)
            gates = randint(0, 50)
            if(random()<0.8):
                q = 1
            else:
                q = 0
            if(random()<0.6):
                m = 1
            else:
                m = 0
            #filewriter.writerow(['carpenter', dis, q, m])
        elif(libId==2):
            carpenter = randint(0, 50)
            olin = randint(5, 100)
            uris = randint(0, 75)
            gates = randint(0, 50)
            if(random()<0.7):
                q = 1
            else:
                q = 0
            if(random()<0.55):
                m = 1
            else:
                m = 0
            #filewriter.writerow(['olin', dis, q, m])
        elif(libId==3):
            carpenter = randint(0, 40)
            olin = randint(0, 70)
            uris = randint(5, 100)
            gates = randint(0, 20)
            if(random()<0.6):
                q = 1
            else:
                q = 0
            if(random()<0.4):
                m = 1
            else:
                m = 0
            #filewriter.writerow(['uris', dis, q, m])
        elif(libId==4):
            carpenter = randint(0, 40)
            olin = randint(0, 30)
            uris = randint(0, 20)
            gates = randint(5, 100)
            if(random()<0.35):
                q = 1
            else:
                q = 0
            if(random()<0.8):
                m = 1
            else:
                m = 0
            #filewriter.writerow(['gates', dis, q, m])
        filewriter.writerow([libId, q, m, carpenter, olin, uris, gates])
