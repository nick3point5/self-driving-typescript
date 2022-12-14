import { lerp, getIntersection, Car } from '@/modules'
import { pointType, intersectionType } from 'types'

export class Sensor {
	car: Car
	rayCount: number
	rayLength: number
	raySpread: number
	rays: pointType[][]
	readings: intersectionType[]

	constructor(car: Car) {
		this.car = car
		this.rayCount = 5
		this.rayLength = 150
		this.raySpread = Math.PI / 2

		this.rays = this.castRays()
		this.readings = []
	}

	private getReadings(collisionPolygons: pointType[][]): intersectionType[] {
		const readings = []
		for (let i = 0; i < this.rays.length; i++) {
			const reading = this.getReading(this.rays[i], collisionPolygons)
			readings.push(reading)
		}
		return readings
	}

	private getReading(
		ray: pointType[],
		collisionPolygons: pointType[][]
	): intersectionType {
		let minIntersection = null

		for (let i = 0; i < collisionPolygons.length; i++) {
			const poly = collisionPolygons[i]
			for (let j = 0; j < poly.length; j++) {
				const intersection = getIntersection(
					ray[0],
					ray[1],
					poly[j],
					poly[(j + 1) % poly.length]
				)

				if (intersection === null) continue

				if (!minIntersection) {
					minIntersection = intersection
				}

				if (intersection.offset < minIntersection.offset) {
					minIntersection = intersection
				}
			}
		}

		return minIntersection
	}

	private castRays() {
		const rays = []
		for (let i = 0; i < this.rayCount; i++) {
			const rayAngle =
				lerp(
					this.raySpread / 2,
					-this.raySpread / 2,
					this.rayCount === 1 ? 0.5 : i / (this.rayCount - 1)
				) + this.car.angle

			const start = { x: this.car.x, y: this.car.y }
			const end = {
				x: this.car.x - Math.sin(rayAngle) * this.rayLength,
				y: this.car.y - Math.cos(rayAngle) * this.rayLength,
			}
			rays.push([start, end])
		}
		return rays
	}

	draw(ctx: CanvasRenderingContext2D) {
		for (let i = 0; i < this.rayCount; i++) {
			const ray = this.rays[i][1]
			let end = ray
			if (this.readings[i]) {
				end = this.readings[i]!
			}

			ctx.beginPath()
			ctx.lineWidth = 2
			ctx.strokeStyle = 'yellow'
			ctx.moveTo(this.rays[i][0].x, this.rays[i][0].y)
			ctx.lineTo(end.x, end.y)
			ctx.stroke()

			ctx.beginPath()
			ctx.lineWidth = 2
			ctx.strokeStyle = 'black'
			ctx.moveTo(this.rays[i][1].x, this.rays[i][1].y)
			ctx.lineTo(end.x, end.y)
			ctx.stroke()
		}
	}

	update(collisionPolygons: pointType[][]) {
		this.rays = this.castRays()
		this.readings = this.getReadings(collisionPolygons)
	}
}
