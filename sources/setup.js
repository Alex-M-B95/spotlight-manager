import { log } from './utils.js'
import { NewSessionWindow } from './screens/new-session.js'
import { SessionSpotlightWindow } from './screens/session-spotlight.js'
import { Session } from './models/session.js'

Hooks.once('init', _onInit)
Hooks.once('ready', _onReady)
Hooks.on("getSceneControlButtons", _getSceneControlButtons)

Hooks.on("changeSetting", (scope, key, newValue, oldValue) => {
    log(`Setting ${key} changed from ${oldValue} to ${newValue}`);
})


function _onInit() {
    log('on init')
    Session.onInit()
}

function _onReady() {
    log('on ready')
    Session.onReady()
}

function _getSceneControlButtons(controls) {
    if (!game.user.isGM) { return }
    
    log('on get scene control buttons')

    let tokenControl = controls.find(c => c.name === "token")
    if (tokenControl) {
        tokenControl.tools.push(
            {
                name: "spotlight-timer",
                title: "Spotlight timer",
                icon: "fas fa-alarm-clock",
                onClick: () => {
                    log("Did tap 'spotlight' button")
                    if (Session.isRunning) {
                        SessionSpotlightWindow.open()
                    } else {
                        NewSessionWindow.open()
                    }
                },
                button: true,
            }
        )
    }
}
