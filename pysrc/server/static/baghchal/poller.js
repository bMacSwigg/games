class Poller {

    // one second
    static INITIAL_INTERVAL = 1000.0
    static MULTIPLIER = 1.1
    // one minute
    static MAX_INTERVAL = 60_000.0

    constructor(func) {
        this.running = false
        this.func = func
        this.interval = Poller.INITIAL_INTERVAL
    }

    start() {
        this.running = true
        setTimeout(this.#poll, this.interval)
    }

    stop() {
        this.running = false
        this.interval = Poller.INITIAL_INTERVAL
    }

    #poll() {
        console.log('polling...')
        if (!this.running) {
            console.log('stopped')
            return
        }
        this.func.call()

        this.#updateInterval()
        setTimeout(this.#poll, Math.ceil(this.interval))
        console.log(`Polled! Next poll in ${this.interval} milliseconds`)
    }

    #updateInterval() {
        this.interval *= Poller.MULTIPLIER
        if (this.interval > Poller.MAX_INTERVAL) {
            this.interval = Poller.MAX_INTERVAL
        }
    }
}