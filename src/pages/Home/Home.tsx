import './Home.css'
import { useState } from 'react'
import { SimulationCanvas, SimulationControls, ScoreTable } from '@/components'

function initAI() {
	const bestAI = localStorage.getItem('bestAI')
	if (!bestAI) return null
	return JSON.parse(bestAI)
}

export function Home() {
	const [generation, setGeneration] = useState(0)
	// const [generation, setGeneration] = useState(0)
	const [simulationOptions] = useState({
		population: 100,
		mutationRate: 0.1,
		speedOfSimulation: 10,
		currentBest: null,
		bestAI: initAI(),
		top5Array: [],
		controlAction: null,
		render: true,
	})

	function save() {
		simulationOptions.bestAI = simulationOptions.currentBest
		localStorage.setItem('bestAI', JSON.stringify(simulationOptions.bestAI))
	}

	function discard() {
		localStorage.removeItem('bestAI')
		simulationOptions.bestAI = null
	}

	function reset() {
		discard()
		setGeneration(1)
	}

	function apply(population:number, mutationRate:number) {
		simulationOptions.population = population
		simulationOptions.mutationRate = mutationRate
		setGeneration(generation + 1)
	}

	function nextGen() {
		save()
		setGeneration(generation + 1)
	}

	return (
		<div className={`Home page`}>
			<SimulationCanvas
				simulationOptions={simulationOptions}
				generation={generation}
				nextGen={nextGen}
			/>

			<div className="ui">
				<SimulationControls
					simulationOptions={simulationOptions}
					save={save}
					discard={discard}
					reset={reset}
					apply={apply}
					nextGen={nextGen}
				/>
				<ScoreTable simulationOptions={simulationOptions} generation={generation}/>
			</div>
		</div>
	)
}
