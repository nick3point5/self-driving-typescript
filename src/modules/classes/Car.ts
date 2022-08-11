import { pointType, intersectionType } from '@/types'
import {
	Controls,
	Sensor,
	NeuralNetwork,
	createBoxPolygon,
	polyIntersect,
} from '@/modules'
import { carWhite, carBlue, carRed, carGreen } from '@/assets'

export class Car {
	x: number
	y: number
	width: number
	height: number
	type: 'traffic' | 'ai' | 'user'
	maxSpeed: number
	speed: number
	acceleration: number
	friction: number
	angle: number
	isDamaged: boolean
	polygon: pointType[]
	controls: Controls
	sensor: Sensor | null
	brain: NeuralNetwork | null
	best: boolean
	render: boolean
	color: string
	score: number
	image: HTMLImageElement

	constructor(
		x = 0,
		y = 0,
		width = 20,
		height = 40,
		type: 'traffic' | 'ai' | 'user' = 'traffic',
		maxSpeed = 4,
		render = true
	) {
		this.x = x
		this.y = y
		this.width = width
		this.height = height
		this.type = type
		this.maxSpeed = maxSpeed

		this.speed = 0
		this.acceleration = 0.2
		this.friction = 0.05
		this.angle = 0
		this.isDamaged = false
		this.best = false
		this.render = render
		this.score = -Infinity
		this.polygon = createBoxPolygon(this)
		this.color = this.getColor()
		this.image = new Image()
		this.image.src = this.getImage()
		this.sensor = null
		this.brain = null

		this.controls = new Controls(type, this)
	}

	private assessDamage2(polygon: pointType[][]) {
		for (let i = 0; i < polygon.length; i++) {
			if (polyIntersect(this.polygon, polygon[i])) {
				this.color = this.getColor()
				return true
			}
		}

		return false
	}

	private assessDamage(roadBorders: pointType[][], traffic: Car[]) {
		// console.log(traffic.map(car => [car.polygon]))
		// console.log(roadBorders)
		// const item = traffic.map(car => car.polygon)
		for (let i = 0; i < roadBorders.length; i++) {
			if (polyIntersect(this.polygon, roadBorders[i])) {
				this.color = this.getColor()
				return true
			}
		}
		for (let i = 0; i < traffic.length; i++) {
			if (polyIntersect(this.polygon, traffic[i].polygon)) {
				this.color = this.getColor()
				return true
			}
		}
		return false
	}

	private getImage(): string {
		if (this.isDamaged) {
			return carWhite
		}
		if (this.type === 'ai') {
			if (this.best) {
				return carGreen
			}
			return carBlue
		}
		if (this.type === 'traffic') {
			return carRed
		}
		if (this.type === 'user') {
			return carGreen
		}
		return ''
	}

	private getColor(): string {
		if (this.isDamaged) {
			return 'gray'
		}
		if (this.type === 'ai') {
			if (this.best) {
				return 'rgba(0,255,255,1)'
			}
			return 'rgba(0,0,255,0.5)'
		}
		if (this.type === 'traffic') {
			return 'red'
		}
		if (this.type === 'user') {
			return 'green'
		}
		return 'black'
	}

	draw(ctx: CanvasRenderingContext2D) {
		if (!this.render) return
		if (this.best && this.sensor) {
			this.sensor.draw(ctx)
		}
		this.image.src = this.getImage()
		ctx.save()
		ctx.translate(this.x, this.y)
		ctx.rotate(-this.angle)
		ctx.drawImage(
			this.image,
			-this.width / 2,
			-this.height / 2,
			this.width,
			this.height
		)
		ctx.restore()

		ctx.fill()
	}

	update(
		collisionPolygons: pointType[][],
		ctx: CanvasRenderingContext2D
	) {
		if (this.isDamaged) return

		this.controls.update(collisionPolygons)
		this.polygon = createBoxPolygon(this)

		if(this.type !== 'traffic') {
			// Don't check for traffic collision if below first traffic car
			// if (this.y - this.height < traffic[0].y) {
			// 	this.isDamaged = this.assessDamage2(collisionPolygons)
				// this.isDamaged = this.assessDamage(roadBorders)
			// }

			this.isDamaged = this.assessDamage2(collisionPolygons)
			// this.isDamaged = this.assessDamage(collisionPolygons, traffic)

			if (this.sensor) {
				this.sensor.update(collisionPolygons)
			}
		}

		this.draw(ctx)
	}
}
