import './Home.css'
import { useState } from 'react'
import { SimulationCanvas, SimulationControls, ScoreTable } from '@/components'
import { trainedAI } from '@/data'
import { optionsType } from '@/types'
import { NeuralNetwork } from '@/modules'

function initAI(): NeuralNetwork | null {
	const bestAI = localStorage.getItem('bestAI')
	if (!bestAI) return null
	return JSON.parse(bestAI)
}

export function Home() {
	const [generation, setGeneration] = useState<number>(0)
	const [generationTable, setGenerationTable] = useState<number[][]>([])

	const [simulationOptions] = useState<optionsType>({
		population: 100,
		mutationRate: 0.1,
		speedOfSimulation: 10,
		currentBest: null,
		bestAI: initAI(),
		top5Array: [],
		controlAction: null,
		render: true,
	})

	function save(): void {
		simulationOptions.bestAI = simulationOptions.currentBest
		localStorage.setItem('bestAI', JSON.stringify(simulationOptions.bestAI))
	}

	function useTrainedAI(): void {
		simulationOptions.bestAI = trainedAI
		localStorage.setItem('bestAI', JSON.stringify(trainedAI))
		setGeneration(1)
	}

	function discard(): void {
		localStorage.removeItem('bestAI')
		simulationOptions.bestAI = null
	}

	function reset(): void {
		discard()
		setGeneration(1)
		setGenerationTable([])
	}

	function apply(population: number, mutationRate: number): void {
		simulationOptions.population = population
		simulationOptions.mutationRate = mutationRate
		setGeneration(generation + 1)
	}

	function nextGen(): void {
		save()
		const newTable = generationTable
		const newEntry = new Array(...simulationOptions.top5Array)
		newEntry.unshift(generation)
		newTable.unshift(newEntry)

		console.log(generationTable)

		setGeneration(generation + 1)
		setGenerationTable(newTable)
	}

	return (
		<div className={`Home page`}>
			<SimulationCanvas
				simulationOptions={simulationOptions}
				generation={generation}
				nextGen={nextGen}
			/>

			<div className='ui'>
				<SimulationControls
					simulationOptions={simulationOptions}
					reset={reset}
					apply={apply}
					nextGen={nextGen}
					useTrainedAI={useTrainedAI}
				/>
				<ScoreTable
					simulationOptions={simulationOptions}
					generation={generation}
					generationTable={generationTable}
				/>
			</div>
		</div>
	)
}
