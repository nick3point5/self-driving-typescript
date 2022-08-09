type itemType = {
	x: number,
	y: number,
	width: number,
	height: number,
	angle: number
}

export function createBoxPolygon(item: itemType) {
	const points = []
	const rad = Math.hypot(item.width, item.height) / 2
	const alpha = Math.atan2(item.width, item.height)
	points.push({
		x: item.x - Math.sin(item.angle - alpha) * rad,
		y: item.y - Math.cos(item.angle - alpha) * rad,
	})
	points.push({
		x: item.x - Math.sin(item.angle + alpha) * rad,
		y: item.y - Math.cos(item.angle + alpha) * rad,
	})
	points.push({
		x: item.x - Math.sin(Math.PI + item.angle - alpha) * rad,
		y: item.y - Math.cos(Math.PI + item.angle - alpha) * rad,
	})
	points.push({
		x: item.x - Math.sin(Math.PI + item.angle + alpha) * rad,
		y: item.y - Math.cos(Math.PI + item.angle + alpha) * rad,
	})
	return points
}