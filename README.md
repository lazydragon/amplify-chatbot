# Prerequisit
- own a global AWS account


# Setup
## install npm packages
```
npm install
```
## configure amplify
```
# run configuration command
amplify configure

# then follow the instructions to
# 1. log in to AWS
# 2. create new user for amplify
# 3. configure your AK/SK
```
## init amplify
```
# init amplify
amplify init
# 1. choose your favourite IDE
# 2. choose javascript
# 3. choose react
# 4. leave source directory as default(src)
# 5. leave build directory as default(build)
# 6. leave build command as default
# 7. leave start command as default
# 8. yes on using an AWS profile, and choose the profile you created in amplify configuration step
```
## configure static hosting
```
# configure static hosting on AWS
amplify add hosting
# choose either DEV or PROD depending on your requirements
# use default options for the rest of the choices
```
## configure auth
```
ampliy add auth
# choose the default configuration 
```
## configure chatbot
- You have to manually create a chatbot on AWS console.
- Follow the instructions in the link to create a bot from blueprints Booktrip https://docs.aws.amazon.com/lex/latest/dg/gs-console.html
- config your bot name, alias and region in src/Config.js, e.g.
```
const bot = {
    name: "booktrip_andrew",
    alias: "latest",
    region: "us-east-1"
} 
```


## configure api
```
amplify add api
# 1. choose rest
# 2. input a friendly name, path
# 3. choose create a new lambda function
# 4. give your function a friendly name
# 5. choose CRUD from ddb
# 6. choose create a new ddb table
# 7. name your ddb table 'reservations' (this name must match the api lambda configuration)
# 8. add one string column called "id"
# 9. choose id as the partition key
# 10. no sort key
# 11. no global secondary index
# 12. skip local lambda editing
# 13. restrict api access to authenticated user only with read access
# 14. no for adding more path
```

## config chatbot function
```
# config lambda
# copy src/functions/chatbot.py to amplify/backend/function/{your_function_name}/src/chatbot.py
# edit chatbot-cloudformation-template.json

...
	"Resources": {
		"LambdaFunction": {
			"Type": "AWS::Lambda::Function",
			"Properties": {
				"Handler": "chatbot.lambda_handler",
				"FunctionName": "chatbot",
				"Role": {
					"Fn::GetAtt": [
						"LambdaExecutionRole",
						"Arn"
					]
				},
				"Runtime": "python2.7",
				"Timeout": "25"
			}
		},
...

```

## deploy your project on AWS
```
amplify publish
```

## chatbot configuration
### access
For your user to have access to the chatbot, we will use IAM roles issued by your cognito authentication.
To enable the role access to chatbot:
- go to AWS console IAM, 
- find the Auth role (not the unauth role) you created, 
- add AmazonLexRunBotsOnly policy to the role

### add lambda hook
- config your car & hotel intents, hook the chatbot lambda function you just created to validation & fullfillment
- build your bot
- publish it