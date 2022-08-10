import './SimulationCanvas.css'
import { useEffect, useRef, useState } from 'react'
import { animateSimulation } from '@/modules'
import { optionsType } from '@/types'

type propsType = {
	simulationOptions: optionsType
	generation: number
	nextGen: ()=>void
}

export function SimulationCanvas({simulationOptions,generation,nextGen}:propsType) {
	const simulationElement = useRef(null)
	const neuralVisualizer = useRef(null)
	const isRunning = useRef(true)

	useEffect(() => {
		const animateFrame = animateSimulation(simulationElement, neuralVisualizer, simulationOptions)
		let frame = 0
		let lastTopChange = 0
		const  animation = setInterval(()=> {
			if(!isRunning)return
			const previous5 = JSON.stringify(simulationOptions.top5Array)
			animateFrame()
			frame++
			if (previous5 !== JSON.stringify(simulationOptions.top5Array)) {
				lastTopChange = frame
			}
			if (frame - lastTopChange> 300) {
				nextGen()
				clearInterval(animation)
			}
			
			
		}, 100/simulationOptions.speedOfSimulation)

		return ()=>{
			clearInterval(animation)
		}
	}, [generation, simulationOptions])

	return (
		<div className={`SimulationCanvas`}>
			<canvas ref={neuralVisualizer} id=' neural-window' />
			<canvas ref={simulationElement} id='simulation-window' />
		</div>
	)
}
