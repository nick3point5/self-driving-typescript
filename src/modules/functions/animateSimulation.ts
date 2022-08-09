import {
	Car,
	Road,
	generateTraffic,
	generateCars,
	NeuralNetwork,
	Heap,
} from '@/modules'
import { optionsType } from '@/types'

export function animateSimulation(
	canvasRef: React.MutableRefObject<null>,
	simulationOptions: optionsType
) {
	const canvas: HTMLCanvasElement = canvasRef.current!
	canvas.width = 200
	canvas.height = window.innerHeight
	const n = simulationOptions.population
	const ctx: CanvasRenderingContext2D = canvas.getContext('2d')!

	const road = new Road(canvas.width / 2, canvas.width * 0.9, 3)
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
			ctx.fillStyle = 'black'
			ctx.fillRect(0, 0, canvas.width, canvas.height)
	
			ctx.save()
			ctx.translate(0, -camera + canvas.height * 0.7)
			road.draw(ctx)
		}


		for (let i = 0; i < traffic.length; i++) {
			traffic[i].update(road.borders, [], ctx)
		}

		for (let i = 0; i < cars.length; i++) {
			const car = cars[i]
			car.update(road.borders, traffic, ctx)
			clean(i)
		}

		setBest()

		ctx.restore()
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
			// if (car.isDamaged) continue
			const score = getFitnessScore(car)
			car.score = score > car.score ? score : car.score
			maxHeap.push(car)
		}

		best5.push(maxHeap.pop())
		best5.push(maxHeap.pop())
		best5.push(maxHeap.pop())
		best5.push(maxHeap.pop())
		best5.push(maxHeap.pop())

		// console.clear()
		// console.table({
		// 	first:best5[0].score,
		// 	second:best5[1].score,
		// 	third:best5[2].score,
		// 	fourth:best5[3].score,
		// 	fifth:best5[4].score,
		// })

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
