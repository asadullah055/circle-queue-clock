
class Circle {
    constructor(capacity) {
        this.items = new Array(capacity);
        this.currentLength = 0;
        this.front = -1;
        this.back = -1;
        this.capacity = capacity
    }

    isEmpty() {
        return this.currentLength === 0
    }
    isFull() {
        return this.capacity === this.currentLength
    }
    size() {
        return this.currentLength
    }

    enqueue(item) {
        if (!this.isFull()) {
            this.back = (this.back + 1) % this.capacity;
            this.items[this.back] = item;
            this.currentLength += 1;
            if (this.front === -1) {
                this.front = this.back;
            }
        }
    }

    dequeue() {
        if (this.isEmpty()) {
            return null
        } else {
            const item = this.items[this.front];
            this.items[this.front] = null;
            this.front = (this.front + 1) % this.capacity;
            this.currentLength -= 1;
            if (this.isEmpty()) {
                this.back = -1
                this.front = -1
            }
            return item
        }
    }
    print() {
        if (this.isEmpty()) {
            console.log('Queue is Empty');
        } else {
            let i;
            let str = ''
            for (i = this.front; i !== this.back; i = (i + 1) % this.capacity) {
                str += this.items[i] + ' '
            }
            str += this.items[i]
            console.log(str);
        }
    }

}
// Clock implementation using Circle Queue;

class Clock {
    constructor() {
        this.queueSecond = new Circle(60)
        this.queueMinute = new Circle(60)
        this.queueHour = new Circle(24)
        this.initializeClock()
        this.interval = null
    }

    initializeClock() {
        const date = new Date();
        const hours = date.getHours();
        const minutes = date.getMinutes();
        const second = date.getSeconds();
        for (let i = 0; i < 60; i++) {
            this.queueSecond.enqueue((second) % 60);
        }
        for (let i = 0; i < 60; i++) {
            this.queueMinute.enqueue((minutes) % 60);
        }
        for (let i = 0; i < 60; i++) {
            this.queueHour.enqueue((hours) % 60);
        }


    }

    start() {
        this.interval = setInterval(() => {
            this.update()
        }, 1000)
    }

    stop() {
        clearInterval(this.interval);
        this.interval = null
    }
    update() {
        if (!this.queueSecond.isEmpty()) {
            this.queueSecond.dequeue()
        }
        const now = new Date()
        const second = now.getSeconds()
        this.queueSecond.enqueue(second)

        if (second === 0) {
            if (!this.queueMinute.isEmpty()) {
                this.queueMinute.dequeue()
            }
            const minutes = now.getMinutes()
            this.queueMinute.enqueue(minutes)

            if (minutes === 0) {
                if (!this.queueHour.isEmpty()) {
                    this.queueHour.dequeue()
                }
                const hours = now.getHours()
                this.queueHour.enqueue(hours)
            }
        }
        this.show()
    }
    show() {
        const second = this.queueSecond.items[this.queueSecond.back];
        const minutes = this.queueMinute.items[this.queueMinute.back];
        const hours = this.queueHour.items[this.queueHour.back];

        const AHour = document.querySelector('.hour')
        const AMinute = document.querySelector('.minute')
        const ASecond = document.querySelector('.second')
        ASecond.style.transform = `rotate(${(second / 60) * 360}deg)`
        AMinute.style.transform = `rotate(${(minutes / 60) * 360}deg)`
        AHour.style.transform = `rotate(${(hours / 12) * 360}deg)`
        const convert = this.convertTo24Hour(hours)
        const s = document.getElementById('second')
        const h = document.getElementById('hour')
        const m = document.getElementById('minute')
        const AP = document.getElementById('A-P')

        s.innerText = this.formatTime(second)
        h.innerText = `${this.formatTime(convert)} :`
        m.innerText = `${this.formatTime(minutes)} :`
        AP.innerText = this.getAMPM(hours)

    }
    formatTime(time) {
        return time < 10 ? `0${time}` : time;
    }
    getAMPM(hour) {
        return hour < 12 ? 'AM' : 'PM';
    }
    convertTo24Hour(hour) {
        return hour % 12;
    }
}
const clock = new Clock()
clock.start()
clock.show()

