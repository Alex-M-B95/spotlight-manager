import { Setup } from './setup.js'

Hooks.once('init', Setup.onInit)
Hooks.once('ready', Setup.onReady)

Hooks.on("getSceneControlButtons", Setup.onGetSceneControlButtons)
Hooks.on("changeSetting", Setup.onChangeSetting)
