import { Car, Road } from '@/modules'

export function generateCars(n: number, road: Road, render = true): Car[] {
	const cars = []
	for (let i = 0; i < n; i++) {
		cars.push(new Car(road.getLaneCenter(1), 100, 30, 50, 'ai', 4, render))
	}
	return cars
}
