class Poller {

    // one second
    static INITIAL_INTERVAL = 5000
    static MULTIPLIER = 1.1
    // one minute
    static MAX_INTERVAL = 60_000

    constructor(func) {
        this.func = func
        this.interval = Poller.INITIAL_INTERVAL
        this.timeoutId = null
    }

    start() {
        if (this.timeoutId) {
            // already running
            return
        }
        this.interval = Poller.INITIAL_INTERVAL
        this.timeoutId = setTimeout(() => this.#poll(), this.interval)
    }

    stop() {
        if (!this.timeoutId) {
            // already stopped
            return
        }
        clearTimeout(this.timeoutId)
        this.timeoutId = null
    }

    reset() {
        this.stop()
        this.start()
    }

    #poll() {
        this.func.call()
        this.#updateInterval()
        this.timeoutId = setTimeout(() => this.#poll(), this.interval)
    }

    #updateInterval() {
        this.interval = Math.ceil(this.interval * Poller.MULTIPLIER)
        if (this.interval > Poller.MAX_INTERVAL) {
            this.interval = Poller.MAX_INTERVAL
        }
    }
}