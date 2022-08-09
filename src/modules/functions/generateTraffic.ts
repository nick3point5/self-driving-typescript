import { Car, Road } from '@/modules'
import { trafficData } from '@/data'

export function generateTraffic(road: Road, render = true) {
	const traffic: Car[] = []
	for (let i = 0; i < trafficData.length; i++) {
		const carData = trafficData[i];

		traffic.push(new Car(road.getLaneCenter(carData[0]), carData[1], carData[2],  carData[3],  carData[4],  carData[5], render))
	}
	return traffic
}
