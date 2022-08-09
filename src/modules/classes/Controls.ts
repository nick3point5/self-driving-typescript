import { pointType, intersectionType } from '@/types'
import { Car, Sensor, NeuralNetwork } from '@/modules'

export class Controls {
	forward: boolean
	left: boolean
	right: boolean
	reverse: boolean
	turn: number
	car: Car

	constructor(type: string, car: Car) {
		this.forward = false
		this.left = false
		this.right = false
		this.reverse = false
		this.turn = 0.05
		this.car = car

		switch (type) {
			case 'user':
				this.addKeyboardListeners()
				break
			case 'traffic':
				this.forward = true
				break
			case 'ai':
				car.sensor = new Sensor(car)
				car.brain = new NeuralNetwork([car.sensor.rayCount, 9, 6, 4])
				break
			default:
				break
		}
	}

	private addKeyboardListeners() {
		document.onkeydown = (event) => {
			switch (event.key) {
				case 'ArrowLeft':
					this.left = true
					break
				case 'ArrowRight':
					this.right = true
					break
				case 'ArrowUp':
					this.forward = true
					break
				case 'ArrowDown':
					this.reverse = true
					break
			}
		}

		document.onkeyup = (event) => {
			switch (event.key) {
				case 'ArrowLeft':
					this.left = false
					break
				case 'ArrowRight':
					this.right = false
					break
				case 'ArrowUp':
					this.forward = false
					break
				case 'ArrowDown':
					this.reverse = false
					break
			}
		}
	}

	private move() {
		if (this.car.controls.forward) {
			this.car.speed += this.car.acceleration
			if (this.car.speed > this.car.maxSpeed) {
				this.car.speed = this.car.maxSpeed
			}
		}

		if (this.car.controls.reverse) {
			this.car.speed -= this.car.acceleration
		}
		if (this.car.speed < -this.car.maxSpeed / 2) {
			this.car.speed = -this.car.maxSpeed / 2
		}
		if (this.car.speed > 0) {
			this.car.speed -= this.car.friction
		}
		if (this.car.speed < 0) {
			this.car.speed += this.car.friction
		}
		if (Math.abs(this.car.speed) < this.car.friction) {
			this.car.speed = 0
		}

		if (this.car.speed !== 0) {
			const flip = this.car.speed > 0 ? 1 : -1
			if (this.car.controls.left) {
				this.car.angle += this.turn * flip
			}
			if (this.car.controls.right) {
				this.car.angle -= this.turn * flip
			}
		}

		this.car.x -= Math.sin(this.car.angle) * this.car.speed
		this.car.y -= Math.cos(this.car.angle) * this.car.speed
	}

	update(roadBorders: pointType[][], traffic: Car[]) {
		this.move()
		if (this.car.sensor) {
			this.car.sensor.update(roadBorders, traffic)
			const offsets = this.car.sensor.readings.map((s: intersectionType) =>
				s === null ? 0 : 1 - s.offset
			)
			const outputs = NeuralNetwork.feedForward(offsets, this.car.brain!)

			this.forward = !!outputs[0]
			this.left = !!outputs[1]
			this.right = !!outputs[2]
			this.reverse = !!outputs[3]
		}
	}
}
