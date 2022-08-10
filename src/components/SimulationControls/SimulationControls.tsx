import './SimulationControls.css'
import { optionsType } from '@/types'
import { InputSlider, ToolTip } from '@/components'
import { useState, SetStateAction } from 'react'

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
	const { mode } = simulationOptions

	const [population, setPopulation] = useState<number>(
		simulationOptions.population
	)
	const [mutationPercent, setMutationPercent] = useState<number>(
		simulationOptions.mutationRate*100
	)

	function changePlayMode() {
		if (mode === 'ai') {
			setSimulationOptions({
				...simulationOptions,
				mode: 'user',
			})
		} else {
			setSimulationOptions({
				...simulationOptions,
				mode: 'ai',
			})
		}
	}

	function apply(population: number, mutationPercent: number): void {
		setSimulationOptions({
			...simulationOptions,
			population: population,
			mutationRate: mutationPercent/100,
		})
	}

	return (
		<div className={`SimulationControls`}>
			<div className="row-container">
				<ToolTip content='Deletes all AIs and reset the simulation.'>
					<button onClick={reset}>Reset</button>
				</ToolTip>
				<ToolTip content='Loads a pre-trained AI.'>
					<button onClick={useTrainedAI}>Trained AI</button>
				</ToolTip>
				{mode === 'ai' ? (
					<ToolTip content='Drive a car with the arrow key.'>
						<button onClick={changePlayMode}>Free Play</button>
					</ToolTip>
				) : (
					<ToolTip content='Run AI training'>
						<button onClick={changePlayMode}>AI Play</button>
					</ToolTip>
				)}
			</div>
			<div className="column-container">
				<ToolTip content='Number of AI simulated.'>
					<InputSlider
						label={'Population'}
						value={population}
						max={1000}
						setValue={setPopulation}
					/>
				</ToolTip>
				<ToolTip content='How different the next generation is form the previous.'>
					<InputSlider
						label={'Mutation Rate %'}
						value={mutationPercent}
						setValue={setMutationPercent}
						min={0}
					/>
				</ToolTip>
			</div>
			<div className="row-container">
			<ToolTip content='Apply settings'>
				<button
					onClick={() => {
						apply(population, mutationPercent)
					}}
				>
					Apply
				</button>
				</ToolTip>
				<ToolTip content='Manually save current best and run next generation.'>
					<button
						onClick={() => {
							nextGen()
						}}
					>
						Next Gen
					</button>
				</ToolTip>
			</div>
		</div>
	)
}
