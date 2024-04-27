import { log, Constants } from '../utils.js'

export class Session {
    // --- Getters (public) --- //
    static get players() {
        const data = game.settings.get(Constants.moduleName, this.#sessionKey)
        return Object.keys(data.players)
    }
    
    static get activePlayers() {
        return game.users.contents.filter(item => item.isActive).map(item => item.id)
    }
    
    static get isRunning() {
        const data = game.settings.get(Constants.moduleName, this.#sessionKey)
        return data.isActive ?? false
    }
    
    // --- Getters (private) --- //
    static get #sessionKey() {
        return "sessionData"
    }
    
    // --- Methods (public) --- //
    static onInit() {
        game.settings.register(Constants.moduleName, this.#sessionKey, {
            name: "Session Data",
            scope: "world",
            config: false,
            type: Object,
            default: {},
            onChange: data => {
                this.#onChange(data)
            }
        })
    }

    static onReady() {
        const data = game.settings.get(Constants.moduleName, this.#sessionKey)
        if (data) {
           this.#onChange(data)
        }
    }

    static startSession(players) {
        log('will start session')
        const sessionData = {
            isActive: true,
            startTime: Date.now(),
            players: players.reduce((acc, id) => {
                acc[id] = {
                    timer: 0,
                    isActive: false,
                }
                return acc;
            }, {})
        };
        game.settings.set(Constants.moduleName, this.#sessionKey, sessionData);
    }
    
    static stopSession() {
        log('will stop session')
        this.#stopTimer()
        game.settings.set(Constants.moduleName, this.#sessionKey, {});
    }
    
    static togglePlayer(id) {
        const data = game.settings.get(Constants.moduleName, this.#sessionKey);
        if (data.players && data.players[id]) {
            data.players[id].isActive = !data.players[id].isActive
            game.settings.set(Constants.moduleName, this.#sessionKey, data)
        }
    }

    // --- Private values and functions --- //
    static #updatePlayerTimer(playerId, time) {
        const data = game.settings.get(Constants.moduleName, this.#sessionKey)
        log('will update session for player', playerId, 'with time', time, 'in data', data)
        if (data.players && data.players[playerId]) {
            const current = data.players[playerId].timer ?? 0
            data.players[playerId].timer = current + time;
            log('will update session for player', playerId, 'with time', time, 'to new value', data.players[playerId].timer)
            game.settings.set(Constants.moduleName, this.#sessionKey, data)
        }
    }
    
    static #timerRepresentation(seconds) {
        let hours = Math.floor(seconds / 3600)
        let minutes = Math.floor((seconds - (hours * 3600)) / 60)
        let remainingSeconds = seconds % 60

        hours = hours < 10 ? "0" + hours : hours
        minutes = minutes < 10 ? "0" + minutes : minutes
        remainingSeconds = remainingSeconds < 10 ? "0" + remainingSeconds : remainingSeconds

        return `${hours}:${minutes}:${remainingSeconds}`
    }
    
    static #onChange(data) {
        log('session settings did change')
        this.#updateGameUsers(data)
        Hooks.call(Constants.updateTriggerHookName)
        
        this.#toggleTimerIfNeeded()
    }
    
    static #updateGameUsers(data) {
        for (let key in data.players) {
            const user = game.users.contents.find(item => item.id === key)
            user.spotlight = this.#timerRepresentation(data.players[key].timer)
            user.isActive = data.players[key].isActive
        }
    }
    
    // --- Timer (private) --- //
    static #timerId
    static #fireTimer() {
        log('on fire timer')
        for (let id of Session.activePlayers) {
            Session.#updatePlayerTimer(id, 1)
        }
    }
    static #startTimer() {
        log('start timer')
        if (Session.#timerId) {
            Session.#stopTimer()
        }
        Session.#timerId = setInterval(this.#fireTimer, 1000)
    }
    static #stopTimer() {
        log('stop timer')
        clearInterval(Session.#timerId)
        Session.#timerId = null
    }
    
    static #toggleTimerIfNeeded() {
        if (Session.#timerId) {
            if (Session.activePlayers.length == 0) {
                Session.#stopTimer()
            }
        } else {
            if (Session.activePlayers.length > 0) {
                Session.#startTimer()
            }
        }
    }
}
