import './SimulationControls.css'
import { optionsType } from '@/types'
import { InputSlider } from '@/components'
import { useEffect, useState } from 'react'

type propsType = {
	simulationOptions: optionsType
	reset: () => void
	apply: (a: number, b: number) => void
	nextGen: () => void
	useTrainedAI: () => void
}

export function SimulationControls({
	simulationOptions,
	reset,
	apply,
	nextGen,
	useTrainedAI,
}: propsType) {
	const [population, setPopulation] = useState(simulationOptions.population)
	const [mutationRate, setMutationRate] = useState(
		simulationOptions.mutationRate
	)

	return (
		<div className={`SimulationControls`}>
			<button onClick={reset}>Reset</button>
			<button onClick={useTrainedAI}>Use trained AI</button>
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
		</div>
	)
}
