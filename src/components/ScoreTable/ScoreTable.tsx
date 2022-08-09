import './ScoreTable.css'
import { optionsType } from '@/types'
import { useEffect, useState } from 'react'

type propType = {
	simulationOptions: optionsType
	generation: number
}

export function ScoreTable({ simulationOptions, generation }: propType) {
	const [scores, setScores] = useState(simulationOptions.top5Array)
	useEffect(()=> {
		const refreshScore = setInterval(() => {
			setScores(simulationOptions.top5Array)
		}, 500);

		return ()=> {
			clearInterval(refreshScore)
		}
	},[])
	return (
		<div className={`ScoreTable`}>
			<table>
				<thead>
					<td>Gen</td>
					<td>1<sup>st</sup></td>
					<td>2<sup>nd</sup></td>
					<td>3<sup>rd</sup></td>
					<td>4<sup>th</sup></td>
					<td>5<sup>th</sup></td>
				</thead>
				<tbody>
					<tr>
						<td>{generation}</td>
						<td>{scores[0]}</td>
						<td>{scores[1]}</td>
						<td>{scores[2]}</td>
						<td>{scores[3]}</td>
						<td>{scores[4]}</td>
					</tr>
				</tbody>
			</table>
		</div>
	)
}