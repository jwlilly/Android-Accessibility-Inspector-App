# Accessibility Inspector App

This is a front end for connecting to and displaying the accessibility node tree provided by the [Accessibility Inspector Service](https://github.com/jwlilly/Accessibility-Inspector-Service) installed on the device or VM. 

## Commands

`npm install`: installs the node packages

`npm run build`: builds the Angular app

`npm run start`: starts the electron app

`npm run package-win`: packages the electron app into a Windows executable 

`npm run package-macArm`: packages the electron app into an ARM macOS app. Note that this requires an ARM macOS device

`npm run package-macX64`: packages the electron app into an x86 macOS app. Note that this requires a macOS device (ARM or x86 will work)

`npm run package-all`: packages the electron app for all 3 platforms. Note that this command is only supported on ARM macOS since it is the only platform that can package all 3 executables. 

## Installing Companion App
This project contains a signed app for the Accessibility Inspector Service that installs as an accessibility service. The service can be installed by going to Tools > Install companion app (Install companion app will be found under the app name menu on a macOS device). You will see lots of errors on the first run of this app since it doesn't have a service to connect to yet. After the service app is installed on the device, this app will attempt to start the accessibility service using ADB commands, forward the required 38301 port so that the service can be reached at 127.0.0.1:38301, and trigger a capture of the accessibility node tree.

![Install companion app screenshot](install-companion-app.png?raw=true)

## Capturing Accessibility Tree
Clicking the capture button will trigger a capture of the accessibility node tree. The node tree and screenshot will be displayed. The node tree is in the form of a nested list in order to represent the parent/child relationships. A proper tree view is planned for future iterations. The screenshot can be clicked to highlight the corresponding accessibility node. Since multiple nodes can have overlapping bounds, the app attempts to figure out which node to select based on the node that has the smallest bounds that is currently under the mouse cursor. Note that the size listed for a node is not correct as it does not take screen density into account. 

![Accessibility node tree displayed for the home screen with the YouTube app highlighted](app-screenshot.png?raw=true)

## Announce for Accessibility
The app will automatically show any announcement made using [View.announceForAccessibility()](https://developer.android.com/reference/android/view/View#announceForAccessibility(java.lang.CharSequence)). This can be tested using the Google Home screen and moving to another home screen. 
![Announce for accessibility showing 'Home screen 2 of 2'](announce-for-accessibility.png?raw=true)

## Limitations
The app will only work if you have one device connected to the computer using USB debugging. This is because all of the ADB commands currently do not reference a specific device so if there are multiple devices connected, ADB will throw an error asking to specify a device. 
