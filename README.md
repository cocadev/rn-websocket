# Hooligram React Native Android App

<img src="https://raw.githubusercontent.com/funnyjerry/react-native-websocket-chat-app/master/screenshots/whatsapp-onboarding-01.png" alt="Demo1" width="340" />
<img src="https://raw.githubusercontent.com/funnyjerry/react-native-websocket-chat-app/master/screenshots/whatsapp-onboarding-02.png" alt="Demo2" width="340" />
<img src="https://raw.githubusercontent.com/funnyjerry/react-native-websocket-chat-app/master/screenshots/whatsapp-onboarding-03.png" alt="Demo3" width="340" />
<img src="https://raw.githubusercontent.com/funnyjerry/react-native-websocket-chat-app/master/screenshots/whatsapp-onboarding-04.png" alt="Demo4" width="340" />
<img src="https://raw.githubusercontent.com/funnyjerry/react-native-websocket-chat-app/master/screenshots/whatsapp-onboarding-05.png" alt="Demo5" width="340" />
<img src="https://raw.githubusercontent.com/funnyjerry/react-native-websocket-chat-app/master/screenshots/whatsapp-onboarding-06.png" alt="Demo6" width="340" />
<img src="https://raw.githubusercontent.com/funnyjerry/react-native-websocket-chat-app/master/screenshots/whatsapp-onboarding-07.png" alt="Demo7" width="340" />
<img src="https://raw.githubusercontent.com/funnyjerry/react-native-websocket-chat-app/master/screenshots/whatsapp-onboarding-08.png" alt="Demo8" width="340" />
<img src="https://raw.githubusercontent.com/funnyjerry/react-native-websocket-chat-app/master/screenshots/whatsapp-onboarding-09.png" alt="Demo9" width="340" />
<img src="https://raw.githubusercontent.com/funnyjerry/react-native-websocket-chat-app/master/screenshots/whatsapp-onboarding-10.png" alt="Demo10" width="340" />
<img src="https://raw.githubusercontent.com/funnyjerry/react-native-websocket-chat-app/master/screenshots/whatsapp-onboarding-11.png" alt="Demo11" width="340" />


## How to run

1. `git clone https://github.com/hooligram/hooligram-client.git`
2. `cd hooligram-client`
3. Define environment variables in file named `.env` in project root:

   ```env
   API_HOST=ws://<domain>:<port>/<end-point>
   ```

   To connect to a localhost server, use `10.0.2.2` as `<domain>` (for emulators).

4. Ensure emulator is ready or mobile device is connected to your machine.
5. `yarn` or `npm install`
6. `yarn android` or `npm run android`

### Remote debugging on a real device

1. `adb reverse tcp:8081 tcp:8081`
2. Open [React Native Debugger](https://github.com/jhen0409/react-native-debugger).
3. _**Shake**_ the device & select _Debug JS Remotely_.

## Connecting to local hooligram-server

For debugging end-to-end, sometimes it's good to connect to a local a hooligram-server.
Assuming a local server is running on `ws://localhost:8080` (see the README at the [hooligram-server](https://github.com/hooligram/hooligram-server) repo on how to run the server locally):

1. Set `API_HOST=ws://localhost:8080` in `.env` file.
2. Run the emulator.
3. `adb tcp:8080 tcp:8080`
4. `yarn android`
5. Check out the client & the server logs. You should see that they are interacting with each other!

