import { log } from '../utils.js'
import { Session } from '../models/session.js'
import { SessionSpotlightWindow } from './session-spotlight.js'

export class NewSessionWindow extends Application {
    static open() {
        const window = new NewSessionWindow()
        window.render(true)
    }
    
    static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
            id: "new-session-window",
            title: "New Session",
            template: "modules/spotlight-manager/templates/windows/new-session.html",
            width: 'auto',
            height: 'auto',
            popOut: true,
        });
    }

    getData() {
        return {
            players: game.users.contents.filter(user => !user.isGM).map(user => ({
                id: user.id,
                name: user.name
            }))
        };
    }

    activateListeners(html) {
        super.activateListeners(html);
        html.find('#start-session-button').click(this._onStartSession.bind(this));
    }

    _onStartSession(event) {
        const form = this.element.find("#players-form");
        const selectedPlayers = form.find('input[type="checkbox"]:checked').map((_, checkbox) => {
            return checkbox.dataset.playerId;
        }).get();
        console.log("Select player for session:", selectedPlayers);
        
        Session.startSession(selectedPlayers)
        this.close()
        setTimeout(SessionSpotlightWindow.open, 1000)
    }
}
