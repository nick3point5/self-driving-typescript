import { NeuralNetwork } from '@/modules'
import { Dispatch, SetStateAction } from 'react'

export type pointType = {
	x: number
	y: number
}

export type intersectionType = {
	x: number
	y: number
	offset: number
} | null

export type optionsType = {
	population: number
	mutationRate: number
	speedOfSimulation: number
	currentBest: NeuralNetwork | null
	bestAI: NeuralNetwork | null
	currentBest5AI: (NeuralNetwork | null)[]
	best5AI: (NeuralNetwork | null)[]
	top5Array: number[]
	render: boolean
}
