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

	const [simulationOptions, setSimulationOptions] = useState<optionsType>({
		population: 100,
		mutationRate: 0.1,
		speedOfSimulation: 10,
		currentBest: null,
		bestAI: initAI(),
		currentBest5AI: [],
		best5AI: init5AI(),
		top5Array: [],
		render: true,
		mode: 'ai'
	})

	function save(): void {
		simulationOptions.bestAI = simulationOptions.currentBest
		simulationOptions.best5AI = simulationOptions.currentBest5AI
		localStorage.setItem('bestAI', JSON.stringify(simulationOptions.bestAI))
		localStorage.setItem('best5AI', JSON.stringify(simulationOptions.best5AI))
	}

	function log() {
		console.log(trainedAI.levels[0].biases[0])
		console.log(simulationOptions.best5AI[0]?.levels[0].biases[0])
	}

	function useTrainedAI(): void {
		const trainedBest5 = new Array(...simulationOptions.best5AI) 
		trainedBest5.unshift(trainedAI)
		trainedBest5.pop()
		localStorage.setItem('bestAI', JSON.stringify(trainedAI))
		localStorage.setItem('best5AI', JSON.stringify(trainedBest5))
		setSimulationOptions({
			...simulationOptions,
			best5AI: trainedBest5,
			bestAI: trainedAI
		})
	}

	function discard(): void {
		localStorage.removeItem('bestAI')
		localStorage.removeItem('best5AI')
		setSimulationOptions({
			...simulationOptions,
			bestAI: null,
			best5AI: []
		})
	}

	function reset(): void {
		discard()
		setGeneration(1)
		setGenerationTable([])
	}

	function nextGen(): void {		
		if (simulationOptions.mode === 'user') {
			setSimulationOptions({...simulationOptions})
		} else {
			save()
			const newTable = generationTable
			const newEntry = new Array(...simulationOptions.top5Array)
			newEntry.unshift(generation)
			newTable.unshift(newEntry)
			setGeneration(generation + 1)
			setGenerationTable(newTable)
		}

	}

	return (
		<div className={`Home page`}>
			<button onClick={log}>log</button>
			<SimulationCanvas
				simulationOptions={simulationOptions}
				generation={generation}
				nextGen={nextGen}
			/>

			<div className='ui'>
				<SimulationControls
					simulationOptions={simulationOptions}
					setSimulationOptions={setSimulationOptions}
					reset={reset}
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
