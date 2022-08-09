import {
	Car,
	Road,
	generateTraffic,
	generateCars,
	NeuralNetwork,
	Heap,
	Visualizer,
} from '@/modules'
import { optionsType } from '@/types'

export function animateSimulation(
	canvasRef: React.MutableRefObject<null>,
	visualRef: React.MutableRefObject<null>,
	simulationOptions: optionsType
) {
	const simulation: HTMLCanvasElement = canvasRef.current!
	simulation.width = 200
	simulation.height = window.innerHeight
	const visualizer: HTMLCanvasElement = visualRef.current!
	visualizer.width = 400
	visualizer.height = window.innerHeight
	const n = simulationOptions.population

	const ctxSimulation: CanvasRenderingContext2D = simulation.getContext('2d')!
	const ctxVisualizer: CanvasRenderingContext2D = visualizer.getContext('2d')!

	const road = new Road(simulation.width / 2, simulation.width * 0.9, 3)
	const cars = generateCars(n, road, simulationOptions.render)
	const traffic = generateTraffic(road, simulationOptions.render)

	let bestCar = cars[0]
	let best5 = cars.slice(0, 5)
	let camera = cars[0].y

	if (simulationOptions.bestAI) {
		for (let i = 0; i < cars.length; i++) {
			const car = cars[i]
			const bestAI: NeuralNetwork = JSON.parse(
				JSON.stringify(simulationOptions.bestAI)
			)
			car.brain = bestAI
			if (i !== 0) {
				NeuralNetwork.mutate(car.brain, simulationOptions.mutationRate)
			}
		}
	}

	function animate(): void {
		if (simulationOptions.render) {
			ctxSimulation.fillStyle = '#6a6a6a'
			ctxSimulation.fillRect(0, 0, simulation.width, simulation.height)
	
			ctxSimulation.save()
			ctxSimulation.translate(0, -camera + simulation.height * 0.7)
			road.draw(ctxSimulation)
		}


		for (let i = 0; i < traffic.length; i++) {
			traffic[i].update(road.borders, [], ctxSimulation)
		}

		for (let i = 0; i < cars.length; i++) {
			const car = cars[i]
			car.update(road.borders, traffic, ctxSimulation)
			clean(i)
		}

		setBest()

		ctxSimulation.restore()
		// networkCtx.lineDashOffset = -time / 50
		Visualizer.drawNetwork(ctxVisualizer, bestCar.brain)
	}

	function clean(i: number) {
		const car = cars[i]
		if (cars.length === 1) return
		if (!car.isDamaged) return
		if (car.score > -1000) return
		if (car.speed > 0) return
		cars.splice(i, 1)
	}

	function setBest() {
		const maxHeap = new Heap((a, b) => a.score > b.score)
		bestCar.best = false
		best5=[]

		for (let i = 0; i < cars.length; i++) {
			const car = cars[i]
			const score = getFitnessScore(car)
			car.score = score > car.score ? score : car.score
			maxHeap.push(car)
		}

		best5.push(maxHeap.pop())
		best5.push(maxHeap.pop())
		best5.push(maxHeap.pop())
		best5.push(maxHeap.pop())
		best5.push(maxHeap.pop())

		const currentCar = best5[0]

		if(currentCar.score > bestCar.score) {
			bestCar = currentCar
		}

		camera = traffic[0].y - bestCar.score
		
		bestCar.best = true

		simulationOptions.currentBest = bestCar.brain!
		simulationOptions.top5Array = best5.map(car => Math.round(car.score))
	}

	function getFitnessScore(car: Car): number {
		return traffic[0].y - car.y
	}

	return animate
}
