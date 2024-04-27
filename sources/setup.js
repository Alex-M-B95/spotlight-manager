import { log } from './utils.js'
import { NewSessionWindow } from './screens/new-session.js'
import { SessionSpotlightWindow } from './screens/session-spotlight.js'
import { Session } from './models/session.js'

export class Setup {
    // --- Public methods --- //
    static onInit() {
        log('on init')
        Session.onInit()
        Setup.#registerKeyboardShortcuts()
    }

    static onReady() {
        log('on ready')
        Session.onReady()
    }

    // --- Private methods --- //
    static onGetSceneControlButtons(controls) {
        if (!game.user.isGM) { return }

            log('on get scene control buttons')

            let tokenControl = controls.find(c => c.name === "token")
            if (tokenControl) {
                tokenControl.tools.push({
                    name: "spotlight-timer",
                    title: "Spotlight timer",
                    icon: "fas fa-alarm-clock",
                    onClick: Setup.#openSpotlightWindow,
                    button: true,
                })
            }
    }

    static onChangeSetting(scope, key, newValue, oldValue) {
        log(`Setting ${key} changed from ${oldValue} to ${newValue}`);
    }

    static #openSpotlightWindow() {
        if (Session.isRunning) {
            SessionSpotlightWindow.open()
        } else {
            NewSessionWindow.open()
        }
    }

    static #registerKeyboardShortcuts() {
        game.keybindings.register(
            'spotlight-manager',
            'open-spotlight-window-shortcut',
            {
                name: "Open Spotlight Window",
                hint: "Open Spotlight Window",
                editable: [
                    { key: "KeyS", modifiers: ['Shift'] }
                ],
                onDown: Setup.#openSpotlightWindow,
                restricted: true
            }
        )
    }
}
