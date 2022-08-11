import './Home.css'
import { useState } from 'react'
import { SimulationCanvas, SimulationControls, ScoreTable } from '@/components'
import { trainedAI } from '@/data'
import { optionsType } from '@/types'

export function Home() {
	const [generation, setGeneration] = useState<number>(1)
	const [generationTable, setGenerationTable] = useState<number[][]>([])

	const [simulationOptions, setSimulationOptions] = useState<optionsType>({
		population: 100,
		mutationRate: 0.1,
		speedOfSimulation: 10,
		currentBest: null,
		bestAI: null,
		currentBest5AI: [],
		best5AI: [],
		top5Array: [],
		render: true,
		mode: 'ai',
	})

	function save(): void {
		simulationOptions.bestAI = simulationOptions.currentBest
		simulationOptions.best5AI = simulationOptions.currentBest5AI
	}

	function useTrainedAI(): void {
		const trainedBest5 = new Array(...simulationOptions.currentBest5AI)
		trainedBest5.unshift(trainedAI)
		trainedBest5.pop()
		setSimulationOptions({
			...simulationOptions,
			best5AI: trainedBest5,
			currentBest5AI: trainedBest5,
			currentBest: trainedAI,
			bestAI: trainedAI,
		})
	}

	function discard(): void {
		setSimulationOptions({
			...simulationOptions,
			bestAI: null,
			best5AI: [],
		})
	}

	function reset(): void {
		discard()
		setGeneration(1)
		setGenerationTable([])
	}

	function nextGen(): void {
		if (simulationOptions.mode === 'user') {
			setSimulationOptions({ ...simulationOptions })
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
