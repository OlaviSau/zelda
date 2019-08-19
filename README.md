# Purpose
It's basically a GUI for running commands, with linking especially catered to.

# Installation
Windows Build Tools installation might take a very long time to install on some computer. Be patient. On a clean docker instance the installation added 5GB to the size of the image, however if you have VSCode installed you already have most of the components.

`npm i && npm start` takes a while (5 minutes) for the first time, be patient.
```
npm i --global --production windows-build-tools
git clone https://github.com/OlaviSau/zelda.git
cd zelda
npm i
npm start
```
This is tested on a clean windows 10.0.17763 that has node@10.0.16.

# Configuring
Get an existing config if you can as a base.
To configure a existing project hover over the project tab.
![alt text](https://raw.githubusercontent.com/OlaviSau/zelda/master/docs/images/configuring-existing-project.png)

# FAQ
## Linking produces an error: `cannot find the 'match' of undefined`
`rm -rf node_modules package-lock.json` in the package directory

## Electron rebuild fails: `An unhandled error occurred inside electron-rebuild`
Remove the electron:rebuild from `postinstall` scripts.
