# Installation
Windows Build Tools installation might take a very long time to install on some computer. Be patient.

`npm i && npm start` takes a while (5 minutes) for the first time, be patient.
```
npm i --global --production windows-build-tools
git clone https://github.com/OlaviSau/zelda.git
cd zelda
npm i
npm start
```
This is tested on a clean windows 10.0.17763 that has node@10.0.16.

# FAQ
## Linking produces an error: `cannot find the 'match' of undefined`
`rm -rf node_modules package-lock.json` in the package directory
