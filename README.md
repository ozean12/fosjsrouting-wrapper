#  Node module for FOSJSROUTING bundle

## Installation

npm install --save fosjsrouting-wrapper

## Usage in file

import fosInit from 'fosjsrouting-wrapper'

### load json via webpack json loader (you can use any method to load routes)
### (file you can pipe and save in file system on webpack initialization)
import routes from './yourPathToRoutes.json'

const Routing = fosInit(routes);

## Usage as DefinePlugin
todo