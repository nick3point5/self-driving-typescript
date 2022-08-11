import { pointType } from '@/types'

import { getIntersection } from './getIntersection'

export function polyIntersect(poly1: pointType[], poly2: pointType[]): boolean {
	for (let i = 0; i < poly1.length; i++) {
		for (let j = 0; j < poly2.length; j++) {
			const touch = getIntersection(
				poly1[i],
				poly1[(i + 1) % poly1.length],
				poly2[j],
				poly2[(j + 1) % poly2.length]
			)
			if (touch) {
				return true
			}
		}
	}
	return false
}
