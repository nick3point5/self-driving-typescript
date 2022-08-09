import './ScoreTable.css'
import { optionsType } from '@/types'
import { useEffect, useState } from 'react'

type propType = {
	simulationOptions: optionsType
	generation: number
	generationTable: number[][]
}

export function ScoreTable({
	simulationOptions,
	generation,
	generationTable,
}: propType) {
	const [scores, setScores] = useState(simulationOptions.top5Array)
	useEffect(() => {
		const refreshScore = setInterval(() => {
			setScores(simulationOptions.top5Array)
		}, 500)

		return () => {
			clearInterval(refreshScore)
		}
	}, [])
	return (
		<div className={`ScoreTable`}>
			<table>
				<thead>
					<tr>
						<th>Gen</th>
						<th>
							1<sup>st</sup>
						</th>
						<th>
							2<sup>nd</sup>
						</th>
						<th>
							3<sup>rd</sup>
						</th>
						<th>
							4<sup>th</sup>
						</th>
						<th>
							5<sup>th</sup>
						</th>
					</tr>
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
					{generationTable.map((row, i) => {
						if (i > 8) return
						return (
							<tr key={i}>
								<td>{row[0]}</td>
								<td>{row[1]}</td>
								<td>{row[2]}</td>
								<td>{row[3]}</td>
								<td>{row[4]}</td>
								<td>{row[5]}</td>
							</tr>
						)
					})}
				</tbody>
			</table>
		</div>
	)
}
