#!/bin/bash

#npm install -g terser

terser assets/js/tau-prolog.js --compress --mangle \
  -o assets/js/taupl.min.js \
  --source-map "includeSources=true,url='/relo-programado/assets/js/taupl.min.js.map'"

#terser modules/*.js \
#  --compress \
#  --mangle \
#  -o taupl.min.js