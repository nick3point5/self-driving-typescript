import { pointType } from '@/types';
import { Car } from '@/modules'

export class Camera{
	x: number
	y: number
	height: number
	width: number

	constructor(x:number, y:number, height:number, width:number) {
		this.x = x
		this.y = y
		this.height = height
		this.width = width

	}
	isViewable(car:Car):boolean {
		if(car.y > this.y + car.height + this.height*0.3 ) return false // car is below camera
		if(car.y < this.y + car.height - this.height ) return false // car is  above camera
		return true
	}
}