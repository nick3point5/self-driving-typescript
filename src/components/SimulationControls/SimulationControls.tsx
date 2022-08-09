import './SimulationControls.css'
import { optionsType } from '@/types'
import { InputSlider } from '@/components'
import { useEffect, useState } from 'react'

type propsType = {
	simulationOptions: optionsType
	save: () => void
	discard: () => void
	reset: () => void
	apply: (a: number, b: number) => void
	nextGen: () => void
}

export function SimulationControls({
	simulationOptions,
	save,
	discard,
	reset,
	apply,
	nextGen,
}: propsType) {
	const [population, setPopulation] = useState(simulationOptions.population)
	const [mutationRate, setMutationRate] = useState(
		simulationOptions.mutationRate
	)

	return (
		<div className={`SimulationControls`}>
			<button onClick={save}>save</button>
			<button onClick={discard}>discard</button>
			<button onClick={reset}>reset</button>
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
				apply
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
