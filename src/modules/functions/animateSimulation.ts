import {
	Car,
	Road,
	generateTraffic,
	generateCars,
	Heap,
	Visualizer,
	assignAI,
} from '@/modules'
import { optionsType } from '@/types'

export function animateSimulation(
	canvasRef: React.MutableRefObject<null>,
	visualRef: React.MutableRefObject<null>,
	simulationOptions: optionsType
) {
	const {population, render, bestAI, best5AI, mutationRate, mode} = simulationOptions

	// Create simulation canvas context
	const simulation: HTMLCanvasElement = canvasRef.current!
	simulation.width = 200
	simulation.height = window.innerHeight
	const ctxSimulation: CanvasRenderingContext2D = simulation.getContext('2d')!

	// Create visualizer canvas context
	const visualizer: HTMLCanvasElement = visualRef.current!
	visualizer.width = 400
	visualizer.height = window.innerHeight
	const ctxVisualizer: CanvasRenderingContext2D = visualizer.getContext('2d')!

	// Create game objects
	const road = new Road(simulation.width / 2, simulation.width * 0.9, 3)
	const traffic = generateTraffic(road, render)

	// Create car either user controlled or ai controlled
	let cars: Car[]
	if (mode === 'user') {
		cars = [new Car(road.getLaneCenter(1), 100, 30, 50, 'user', 4)]
	}else {
		cars = generateCars(population, road, render)
		assignAI(best5AI, cars,mutationRate)
	}

	let bestCar = cars[0]
	const best5: Car[] = new Array(5)
	let camera = cars[0].y


	let parentAIs = [bestAI]
	if (best5AI.length === 0) {
		parentAIs = best5AI
	}

	function animate(): void {
		if (render) {
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

		if (mode === 'user') return
		Visualizer.drawNetwork(ctxVisualizer, bestCar.brain!)
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

		for (let i = 0; i < cars.length; i++) {
			const car = cars[i]
			const score = getFitnessScore(car)

			car.score = score > car.score ? score : car.score
			maxHeap.push(car)
		}

		for (let i = 0; i < 5; i++) {
			const maxCar = maxHeap.pop()
			best5[i] = maxCar ? maxCar : null
		}

		const currentCar = best5[0]

		if (currentCar.score > bestCar.score) {
			bestCar = currentCar
		}

		camera = bestCar.y

		bestCar.best = true

		simulationOptions.currentBest = bestCar.brain!

		simulationOptions.currentBest5AI = best5
			.filter((car: Car | null) => car?.brain)
			.map((car: Car) => car.brain)

		simulationOptions.top5Array = best5.map((car) =>
			car ? Math.round(car.score) : 0
		)
	}

	function getFitnessScore(car: Car): number {
		return traffic[0].y - car.y + 200
	}

	return animate
}

