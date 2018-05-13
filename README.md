Study Go !
========
#### It's a real-time study space allocation system for Cloud Computing project. The project aims to give the users an easier time to find the best library to study. Students are able to occupy and reserve tables in the libraries based on real-time information about the library availabilities and machine learning recommendation feature. Using the AWS cloud services, this system is scalable and fault-tolerant with fast response time. The project takes form of a web app where students can go online, sign up, and take multiple interactions for booking tables at the library.
#### Our solution stack is Node.js + DynamoDB + AWS Elastic Beanstalk + AWS SageMaker.


## How to run
* Install all dependencies using 'npm' command.
  
  npm install 
 
* Get an aws access key and configure your credentials.

  how to set up [[DynamoDB setup guide](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/SettingUp.DynamoWebService.html#SettingUp.DynamoWebService.GetCredentials)][[SageMaker setup guide](https://docs.aws.amazon.com/sagemaker/latest/dg/gs-set-up.html)][[Elastic beanstalk setup guide](https://docs.aws.amazon.com/elasticbeanstalk/latest/dg/GettingStarted.html)]

* Database Initilization using './feed_db.sh' command.

  ./feed_db.sh
  
* To start the server, run:

  node app.js
  
* Now the server is running on 'localhost:3000', you can use 'CTRL+C' command to stop.
