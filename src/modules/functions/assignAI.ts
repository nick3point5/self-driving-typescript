import { Car, NeuralNetwork } from '@/modules'

export function assignAI(
	parentAIs: (NeuralNetwork | null)[],
	cars: Car[],
	mutationRate: number
) {
	if (parentAIs.length === 0) return

	for (let i = 0; i < cars.length; i++) {
		const parentAI: NeuralNetwork = JSON.parse(
			JSON.stringify(parentAIs[i % parentAIs.length])
		)
		const car = cars[i]
		car.brain = parentAI
		if(i >= parentAIs.length) {
			NeuralNetwork.mutate(car.brain, mutationRate)
		}
	}
}
