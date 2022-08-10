import './SimulationControls.css'
import { optionsType } from '@/types'
import { InputSlider } from '@/components'
import { useEffect, useState, SetStateAction } from 'react'

type propsType = {
	simulationOptions: optionsType
	setSimulationOptions: React.Dispatch<SetStateAction<optionsType>>
	reset: () => void
	nextGen: () => void
	useTrainedAI: () => void
}

export function SimulationControls({
	simulationOptions,
	setSimulationOptions,
	reset,
	nextGen,
	useTrainedAI,
}: propsType) {
	const [population, setPopulation] = useState<number>(
		simulationOptions.population
	)
	const [mutationRate, setMutationRate] = useState<number>(
		simulationOptions.mutationRate
	)

	const {mode} = simulationOptions

	function changePlayMode() {
		if (mode === 'ai') {
			setSimulationOptions({
				...simulationOptions,
				mode: 'user'
			})
		} else {
			setSimulationOptions({
				...simulationOptions,
				mode: 'ai'
			})
		}
	}

	function apply(population: number, mutationRate: number): void {
		setSimulationOptions({
			...simulationOptions,
			population: population,
			mutationRate: mutationRate,
		})
	}

	return (
		<div className={`SimulationControls`}>
			<button onClick={reset}>Reset</button>
			<button onClick={useTrainedAI}>Use Trained AI</button>
			<InputSlider
				label={'Population'}
				value={population}
				max={1000}
				setValue={setPopulation}
			/>
			<InputSlider
				label={'Mutation Rate'}
				value={mutationRate}
				setValue={setMutationRate}
				min={0}
				max={1}
				step={0.01}
			/>
			<button
				onClick={() => {
					apply(population, mutationRate)
				}}
			>
				Apply
			</button>
			<button
				onClick={() => {
					nextGen()
				}}
			>
				Next Gen
			</button>
			<button onClick={changePlayMode}>{mode==='ai' ? `Free Play` : `AI Play`}</button>
		</div>
	)
}
