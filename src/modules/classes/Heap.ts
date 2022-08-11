function minComparator(a: number, b: number) {
	return a < b
}

type comparatorType = (a: any, b: any) => number | boolean

export class Heap {
	array: any[]
	comparator: comparatorType
	constructor(comparator: comparatorType = minComparator) {
		this.array = []
		this.comparator = comparator
	}
	push(element: any) {
		this.array.unshift(element)
		this.siftDown(0)
	}
	pop() {
		const top = this.array[0]
		const bottom = this.array.pop()
		if (this.array.length > 0) {
			this.array[0] = bottom
			this.siftDown(0)
		}
		return top
	}
	peek() {
		return this.array[0]
	}
	heapify(array: any[]) {
		for (let index = 0; index < array.length; index++) {
			this.push(array[index])
		}
	}
	remove(node: any) {
		const index = this.array.indexOf(node)
		const bottom = this.array.pop()

		if (index !== this.array.length - 1) {
			this.array[index] = bottom

			if (this.comparator(bottom, node)) {
				this.siftUp(index)
			} else {
				this.siftDown(index)
			}
		}
	}
	size() {
		return this.array.length
	}
	rescoreElement(node: any) {
		this.siftUp(this.array.indexOf(node))
	}
	siftUp(index: number) {
		const element = this.array[index]
		while (index > 0) {
			const parentIndex = ((index + 1) >> 1) - 1
			const parent = this.array[parentIndex]
			if (this.comparator(element, parent)) {
				this.array[parentIndex] = element
				this.array[index] = parent
				index = parentIndex
			} else {
				break
			}
		}
	}
	siftDown(index: number) {
		const length = this.array.length
		const element = this.array[index]

		while (true) {
			const childIndex2 = (index + 1) << 1
			const childIndex1 = childIndex2 - 1
			const child1 = this.array[childIndex1]
			const child2 = this.array[childIndex2]

			var swapIndex = null

			if (childIndex1 < length) {
				if (this.comparator(child1, element)) {
					swapIndex = childIndex1
				}
			}

			if (childIndex2 < length) {
				const compareElement = swapIndex === null ? element : child1
				if (this.comparator(child2, compareElement)) {
					swapIndex = childIndex2
				}
			}

			if (swapIndex !== null) {
				this.array[index] = this.array[swapIndex]
				this.array[swapIndex] = element
				index = swapIndex
			} else {
				break
			}
		}
	}
}
