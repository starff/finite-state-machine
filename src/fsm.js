class FSM {
   
    constructor(config) {
        this.config = config;
        this.state = this.config.initial;
        this.line = [this.config.initial];
        this.forUndo = [];
        this.available = false;
    }

    /**
     * Returns active state.
     * @returns {String}
     */
    getState() {
        return this.state;
    }

    /**
     * Goes to specified state.
     * @param state
     */
    changeState(state) {
        for (this.allStates in this.config.states) {
            if (state == this.allStates) {
                this.line.push(this.state);
                this.state = state;
                this.available = false;
            };
        };
        if (state != this.state) {
                throw new Error;
        };
        
    }

    /**
     * Changes state according to event transition rules.
     * @param event
     */
    trigger(event) {
        if (!this.config.states[this.state]["transitions"][event]) {
          throw new Error();
        }
                this.state = this.config.states[this.state].transitions[event];
                this.line.push(this.state);
                this.available = false;
          this.forUndo = []
        }


    /**
     * Resets FSM state to initial.
     */
    reset() {
        this.state = this.config.initial;
    }

    /**
     * Returns an array of states for which there are specified event transition rules.
     * Returns all states if argument is undefined.
     * @param event
     * @returns {Array}
     */
    getStates(event) {
        this.event = event;
        let arr = [];
        if (this.event == undefined) {
            for (this.state in this.config.states) {
                arr.push(this.state);
            };
        } else {
            for (this.state in this.config.states) {
                if (this.event in this.config.states[this.state].transitions) {
                    arr.push(this.state);
                };
            };
        };
        return arr;
    }

    /**
     * Goes back to previous state.
     * Returns false if undo is not available.
     * @returns {Boolean}
     */
    undo() {
        if (this.line.length <= 1) {
            return false;
        } else if (this.line.length > this.forUndo.length + 1 && this.forUndo.length != 100) {
            this.forUndo.push(this.state);
            this.state = this.line[this.line.length - 2];
            this.line.pop();
            this.available = true;
        } else {
            return false;
        };
        return this.available;
    }

    /**
     * Goes redo to state.
     * Returns false if redo is not available.
     * @returns {Boolean}
     */
    redo() {
        if (this.forUndo.length > 0 && this.available === true) {
            this.state = this.forUndo.pop();
            return true;
        } else {
            return false;
        };
    }

    /**
     * Clears transition history
     */
    clearHistory() {
        this.forUndo.length = 100;
    }
}

module.exports = FSM;
