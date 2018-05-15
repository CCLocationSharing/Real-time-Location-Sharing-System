import csv
from random import *
import random as rd
arts_majors = ['Africana Studies', 'American Studies',
'Anthropology', 'Applied Economics and Management', 'Classics', 'Communication',
'Development Sociology', 'Economics', 'Feminist', 'Fine Arts', 'French', 'History', 'Human Development', 'Linguistics', 'Music',
'Philosophy', 'Religious Studies', 'Sociology', 'Urban and Regional Studies']
science_majors = ['Animal Science', 'Biological Sciences', 'Environmental and Sustainability Sciences',
'Food Science', 'Mathematics', 'Nutritional Sciences', 'Statistical Science', 'Science and Technology Studies']
business_majors = ['Accounting', 'Policy Analysis and Management', 'Hotel Administration']
engineering_majors = ['Biological Engineering', 'Biomedical Engineering', 'Chemical Engineering',
'Computer Science', 'Environmental Engineering', 'Independent Major—Engineering', 'Operations Research and Engineering',
'Mechanical Engineering', 'Electrical and Computer Engineering']

majors = arts_majors
all_majors = majors+business_majors+science_majors+engineering_majors

with open('mlDataOlin.csv', 'w') as csvfile:
    filewriter = csv.writer(csvfile, delimiter=',',
                            quotechar='|', quoting=csv.QUOTE_MINIMAL)
    for k in range(5000):
        isLib = randint(0, 1)
        history_precent = random()
        current_ava = random()
        if(isLib==1):
            label = "\"Y\""
            distance = random()
            if(history_precent<0.5):
                history_precent = history_precent + 0.5
            if(current_ava>0.8):
                current_ava = current_ava - 0.8
        else:
            label = "\"N\""
            distance = random()*randint(0, 2)
            if(history_precent>0.5):
                history_precent = history_precent - 0.5

        temp = random()
        if(temp < 0.5 and isLib==1):
            major = rd.choice(majors)
        else:
            major = rd.choice(all_majors)

        filewriter.writerow([label, major, distance, history_precent, current_ava])
