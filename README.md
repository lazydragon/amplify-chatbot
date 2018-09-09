# Prerequisit
- own an AWS account


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
## deploy your project on AWS
```
amplify publish
```