**Please read this document and relevant documentations carefully to reduce time wasted for debugging and struggling.**

**Author:** [tvhhh](https://github.com/tvhhh)  
**Last updated:** 2021, May 29

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
adb -s $DEVICE-NAME reverse tcp:3000 tcp:80
# Now when your device is trying to access local port 3000 (localhost:3000), that request will be routed to your host’s port 80.
```

# Build safe1 services

## Prerequisite
* [Docker](https://docs.docker.com/get-docker/)
* [Docker Compose](https://docs.docker.com/compose/install/)

**Noted:** If any of below steps fails, recheck and fix until success before moving on.

## Create environment file
Go to directory `services` and create a file named `adafruit.env` with following content
```
ADAFRUIT_BROKER=io.adafruit.com:1883
ADAFRUIT_USERNAME=tvhhh
ADAFRUIT_SECRET_KEY=$KEY
ADAFRUIT_USERNAME_1=RinnnnN
ADAFRUIT_SECRET_KEY_1=$KEY_1
```
`$KEY` and `$KEY_1` are the secret keys of IO Adafruit, login to my account with given credentials above and get the secret key (please don't generate new key). Because of security policy, if this key is published to github, IO Adafruit will automatically generate a new key.

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
After successfully finishing above steps, the output of this following command should be like this
```
~ ❯ docker ps
CONTAINER ID   IMAGE                                 COMMAND                  CREATED          STATUS          PORTS                                                                                                                                  NAMES
20c691facc07   nginx                                 "/docker-entrypoint.…"   14 seconds ago   Up 13 seconds   0.0.0.0:8080->80/tcp, :::8080->80/tcp                                                                                                  services_nginx_1
8e46db9b4dfd   safe1/control                         "/app/services/contr…"   15 seconds ago   Up 13 seconds   8010/tcp                                                                                                                               services_control_1
74cd7f25f45e   safe1/pipe                            "/app/services/pipe"     15 seconds ago   Up 13 seconds   9000/tcp                                                                                                                               services_pipe_1
99fd1cbe61d1   safe1/data                            "/app/services/data"     15 seconds ago   Up 14 seconds   8000/tcp                                                                                                                               services_data_1
78457a77e765   postgres                              "docker-entrypoint.s…"   16 seconds ago   Up 15 seconds   5432/tcp                                                                                                                               services_postgres_1
```

## Shutdown all running services
```
docker-compose down
```

# Step by step to build and run services
Open file `url.ts` in `safe1/src/api` directory and edit as follow
```
# If you use your Android device
const apiUrl = "localhost:3000"

# If you use Android emulator
const apiUrl = "10.0.2.2"

# Or another option that always works
const apiUrl = "YOUR_IP_ADDRESS"
```

Build and run services
```
# Go to safe1/services directory
cd $PATH-TO-SERVICES

# Build docker images
./build-services.sh

# Run Docker compose
docker-compose up -d
```

Open a terminal and run React Native start (remember to run in RN directory)
```
npx react-native start
```

Open another terminal and run React Native
```
npx react-native run-android

# If you use your device
adb reverse tcp:3000 tcp:80
```

Once app is successfully built and run, login then choose My Buildings option and create a building with any name and address and register some devices.

Remember that the topic of a device must be one of follows, please choose appropriate topic to avoid data misuse
* Gas sensor: `bk-iot-gas`
* Temperature sensor: `bk-iot-temp-humid`
* Relay (used for power system, sprinkler): `bk-iot-relay`
* Motor (used for fan): `bk-iot-drv`
* Buzzer: `bk-iot-speaker`
* Servo: `bk-iot-servo`
* Just testing: `bk-iot-led`
  
Another thing to remember is that names of devices MUST BE UNIQUE, since devices of the same type would subscribe same topic.

# The React Native redux state
Redux is one of the most useful tools of React Native to build MVC architecture. We have concepts of store, action, and reducer. I'll not say too much about these since they are all available on the [Redux documentation](https://redux.js.org/introduction/getting-started). Instead I'll introduce the models as well as saved state of our application
## Models
All declared models in `safe1/src/models`

## State
```
type State = {
  currentUser: User | null,
  buildings: Building[],
  defaultBuilding?: Building
};
```
The **currentUser** is yourself which contains the uid. The **buildings** is the list of the buildings that you belong to. The **defaultBuilding** is what you almost work with. Since we only see the received data of just one **defaultBuilding**, so the data displayed on Dashboard, Notification as well as the devices in Remote Control screen is from this building. 

To switch default building, you have to go to My Buildings screen and choose another one but this is my part. 

So your work is handling with the information of **defaultBuilding**, also notice the case that **defaultBuilding** is undefined when you are not in any building.

# Debug hints when Docker containers do not run properly
Remember to run `build-services.sh` again when you pull any new version.

If you run **docker ps** and see **STATUS** of `safe1/data` is **Restarting ...s ago**, it means the init scripts of postgres are not executed when you start Docker compose, so you have to manually exec postgres and do some stuffs
```
# You can find out $POSTGRES-CONTAINER-ID in docker ps
docker exec -it $POSTGRES-CONTAINER-ID sh

> psql -U postgres

# Now you successfully login to postgres server, let's create database and user
> create database safe1;
> create user safe1admin with password 'securepassword';
> grant all privileges on database safe1 to safe1admin;

# Ctrl+D to exit
```

In case you want to check the database, do as follow
```
docker exec -it $POSTGRES-CONTAINER-ID sh
> psql -U postgres
> \c safe1

# Show the list of tables
> \dt

# Show the columns of a table
> \d+ table_name

> # Any SQL command to retrieve the data
```

# Backend services
It is necessary to understand the function of our Docker containers to easily debug without asking me (tvhhh), I'll briefly say that
* `safe1/data` is to handle the data and store/query from the PSQL. To understand more about this service, you can read the Golang source code `services/data` and the `safe1/services/data.service.ts` in React Native project.
* `safe1/control` is the service between our application and Adafruit server, we connect to this service via **WebSocket** and it connects to the Adafruit via **MQTT**, through this service we receive messages from Adafruit as well as publishing messages back to server. To understand more about this service, you can read the Golang source code `services/control` and the `safe1/services/control.service.ts` in React Native project. You should also learn more about mechanism of WebSocket and MQTT by yourself.
* `safe1/pipe` is not too relavent to our Frontend, it subscribes Adafruit server all the time to receive messages and update the data in our PSQL, our application does not communicate with this. To understand more about this service, you can read the Golang source code `services/pipe`.
* `safe1/auto` is the automation service to automatically trigger protection mode of output devices. The client also does not communicate directly with this service. Instead they update the protection mode of each device to the data service, then `safe1/data` sends this information to the `safe1/auto`. Whenever gas or temperature exceeds the threshold, all output devices with configured protection mode will be triggered immediately.
* **NOTED:** Beside the automation service, we should also provide users (actually only building owners) ability to manually access and control their devices via user interface.

To read the logs of a Docker container, use this command
```
docker logs $CONTAINER_ID
```
