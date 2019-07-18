# Installation
Windows Build Tools installation might hang on the first run, just Control+C & run it again.

`npm i && npm start` takes a while (5 minutes) for the first time, be patient.
```
npm i --global --production windows-build-tools
git clone https://github.com/OlaviSau/zelda.git
cd zelda
npm i
npm start
```
This is tested on a clean windows install that has node@10.0.16.

# FAQ
## Linking produces an error: `cannot find the 'match' of undefined`
`rm -rf node_modules package-lock.json` in the package directory
