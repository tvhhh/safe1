# Setup server on Adafruit IO

## Authentication
Login to [Adafruit IO](https://io.adafruit.com) by these credentials
* **Username**: tvhhh
* **Password**: safe123

# Setup React Native

## Prerequisite
* [nodejs](https://nodejs.org/en/)
* [npm](https://www.npmjs.com/)
* [OpenJDK8](https://openjdk.java.net/install/)

## (Optional) Install `yarn`
```
sudo npm install -g yarn
```
## Install `react-native-cli`
```
sudo npm install -g react-native-cli
```
or
```
yarn add global react-native-cli
```
## Install `Android Studio`
https://developer.android.com/studio?gclsrc=ds&gclsrc=ds
## Export environment variables
If you are using Linux, add the following lines to your env file
```
export ANDROID_HOME=$HOME/Android/Sdk
export PATH=$PATH:$ANDROID_HOME/emulator
export PATH=$PATH:$ANDROID_HOME/tools
export PATH=$PATH:$ANDROID_HOME/tools/bin
export PATH=$PATH:$ANDROID_HOME/platform-tools
```
## Initialize a React Native project
In case you create a new React Native project
```
cd $RN-APP-DIR
react-native init $PROJECT-NAME
```
## Import an existing React Native project
In case you keep working on an existing React Native project
```
git clone $GITHUB-REPO
cd $PACKAGES-JSON-DIR
npm install
```
## Run instructions for Android
Open terminal and run this instruction first
```
cd $APP-DIR && npx react-native start
```
Open another terminal, to run this you must have an Android emulator running (quickest way to get started), or a device connected
```
cd $APP-DIR && npx react-native run-android
```
## Run React Native on connected device
https://reactnative.dev/docs/running-on-device

# Access development server from React Native app (Android device)
Run React Native as above guides first  
To connect to development server (i.e. the host running the RN process), you must do port-forwarding
```
# To get the device name
adb devices

# Port-forwarding
adb -s $DEVICE-NAME reverse tcp:8081 tcp:8080
# Now when your device is trying to access local port 8081 (localhost:8081), that request will be routed to your host’s port 8080.
```

# Build safe1 services

## Prerequisite
* [Docker](https://docs.docker.com/get-docker/)
* [Docker Compose](https://docs.docker.com/compose/install/)

**Noted:** If any of below steps fails, recheck and fix until success before moving on.

## Create environment file
Go to directory `services/control` and create a file named `.env` with following content
```
ADAFRUIT_BROKER=io.adafruit.com:1883
ADAFRUIT_USERNAME=tvhhh
ADAFRUIT_SECRET_KEY=$KEY
```
`$KEY` is the secret key of IO Adafruit, login to my account with given credentials above and get the secret key (please don't generate new key). Because of security policy, if this key is published to github, IO Adafruit will automatically generate a new key.

## Build service Docker images
Run file `build-services.sh` in `services` directory
```
$PATH-TO-SERVICES/build-services.sh
```

## Create docker volume that will be used by postgres
```
docker volume create --name=pgdata
```

## Compose up to run the containers
```
cd $PATH-TO-SERVICES
docker-compose up -d
```

## Shutdown all running services
```
docker-compose down
```
