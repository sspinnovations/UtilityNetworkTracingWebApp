# Esri Utility Network Angular/Typescript Web Tracing App

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 6.0.8.

## Web Map  

In order for the map to operate you need to have a web map set up in ArcGIS Enterprise Portal.  The way the app is currently set up it will load the first web map it finds on the server and uses that as the base map.

## Login  

The login for the application is the same login a user would use to log in to Portal

## Environment Variables

Set the portalBaseUrl in the environments/environment.ts file

## Known Issues

The token received from the server after a successful login has an expiration date.  If you leave the app stale for over an hour and then try to use the functionality it will stop working without any messages to the user as to what happened.  The user will need to logout and login again to get the app working again.  

After clicking on the Trace button, the cursor will move to a cross hair on the map.  You need to click exactly on the right feature for the trace to work.  If the user clicks anywhere except on a feature, the app will error and may no longer work.  

The tracking results are very raw as far as the output on the screen goes.  This can be greatly improved upon.

There may be other issues that have not been uncovered.  

## Web App Setup Instructions

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `-prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).

## Great Electron Guide

[https://angularfirebase.com/lessons/desktop-apps-with-electron-and-angular/](https://angularfirebase.com/lessons/desktop-apps-with-electron-and-angular/)
