import { pointType, intersectionType } from '@/types'
import {
	Controls,
	Sensor,
	NeuralNetwork,
	createBoxPolygon,
	polyIntersect,
} from '@/modules'

export class Car {
	x: number
	y: number
	width: number
	height: number
	type: string
	maxSpeed: number
	speed: number
	acceleration: number
	friction: number
	angle: number
	isDamaged: boolean
	polygon: pointType[]
	controls: Controls
	sensor: Sensor | undefined
	brain: NeuralNetwork | undefined
	best: boolean
	render: boolean
	score: number

	constructor(
		x = 0,
		y = 0,
		width = 20,
		height = 40,
		type = 'traffic',
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

		this.controls = new Controls(type, this)
	}

	private assessDamage(roadBorders: pointType[][], traffic: Car[]) {
		for (let i = 0; i < roadBorders.length; i++) {
			if (polyIntersect(this.polygon, roadBorders[i])) return true
		}
		for (let i = 0; i < traffic.length; i++) {
			if (polyIntersect(this.polygon, traffic[i].polygon)) return true
		}
		return false
	}

	private getColor(): string {
		if (this.isDamaged) {
			return 'gray'
		}
		if (this.type === 'ai') {
			if (this.best) return 'rgba(0,255,255,1)'
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
		if(!this.render) return
		ctx.fillStyle = this.getColor()
		ctx.beginPath()
		ctx.moveTo(this.polygon[0].x, this.polygon[0].y)
		for (let i = 0; i < this.polygon.length; i++) {
			ctx.lineTo(this.polygon[i].x, this.polygon[i].y)
		}

		ctx.fill()
		if (this.best && this.sensor) {
			this.sensor.draw(ctx)
		}
	}

	update(
		roadBorders: pointType[][],
		traffic: Car[],
		ctx: CanvasRenderingContext2D
	) {
		if (this.isDamaged) return

		this.controls.update(roadBorders, traffic)
		this.polygon = createBoxPolygon(this)
		this.isDamaged = this.assessDamage(roadBorders, traffic)
		if (this.sensor) {
			this.sensor.update(roadBorders, traffic)
			const offsets = this.sensor.readings.map((s: intersectionType) =>
				s === null ? 0 : 1 - s.offset
			)
		}
		this.draw(ctx)
	}
}
