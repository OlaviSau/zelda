# Installation
Windows Build Tools installation might hang on the first run, just Control+C & run it again
```
npm i --global --production windows-build-tools
git clone https://github.com/OlaviSau/zelda.git
cd zelda
npm i
npm start
```

# FAQ
## Linking produces an error: `cannot find the 'match' of undefined`
`rm -rf node_modules package-lock.json` in the package directory
