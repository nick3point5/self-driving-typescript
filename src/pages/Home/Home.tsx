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
function init5AI(): NeuralNetwork[] {
	const dataBest5 = localStorage.getItem('best5AI')
	if (!dataBest5) return []
	return JSON.parse(dataBest5)
}

export function Home() {
	const [generation, setGeneration] = useState<number>(1)
	const [generationTable, setGenerationTable] = useState<number[][]>([])

	const [simulationOptions] = useState<optionsType>({
		population: 100,
		mutationRate: 0.1,
		speedOfSimulation: 10,
		currentBest: null,
		bestAI: initAI(),
		currentBest5AI: [],
		best5AI: init5AI(),
		top5Array: [],
		render: true,
	})

	function save(): void {
		simulationOptions.bestAI = simulationOptions.currentBest
		simulationOptions.best5AI = simulationOptions.currentBest5AI
		localStorage.setItem('bestAI', JSON.stringify(simulationOptions.bestAI))
		localStorage.setItem('best5AI', JSON.stringify(simulationOptions.best5AI))
	}

	function useTrainedAI(): void {
		simulationOptions.bestAI = trainedAI
		localStorage.setItem('bestAI', JSON.stringify(trainedAI))
		setGeneration(1)
	}

	function discard(): void {
		localStorage.removeItem('bestAI')
		simulationOptions.bestAI = null
		localStorage.removeItem('best5AI')
		simulationOptions.best5AI = []
	}

	function reset(): void {
		discard()
		setGeneration(1)
		setGenerationTable([])
	}

	function apply(population: number, mutationRate: number): void {
		simulationOptions.population = population
		simulationOptions.mutationRate = mutationRate
		setGeneration(generation)
	}

	function nextGen(): void {
		save()
		const newTable = generationTable
		const newEntry = new Array(...simulationOptions.top5Array)
		newEntry.unshift(generation)
		newTable.unshift(newEntry)

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
