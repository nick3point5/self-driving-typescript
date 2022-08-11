import { useEffect, useRef, useState } from 'react'
import './ToolTip.css'

type propType = {
	content: string
	delay?: number
	fade?: number
	direction?: 'top' | 'right' | 'bottom' | 'left'
	children: JSX.Element
}

export function ToolTip({
	content,
	delay = 200,
	fade = 200,
	direction = 'top',
	children,
}: propType) {
	let timeoutShow: number
	let timeoutHide: number
	const tipElement = useRef<HTMLDivElement>(null)

	useEffect(()=> {
		return ()=> {
			clearTimeout(timeoutShow)
		}
	},[])

	const showTip = () => {
		timeoutShow = setTimeout(()=> {
			if (!tipElement.current) return
			tipElement.current.classList.remove('hidden-tip')
		}, delay)
		clearTimeout(timeoutHide)
	}

	const hideTip = () => {
		timeoutHide = setTimeout(()=> {
			if (!tipElement.current) return
			tipElement.current.classList.add('hidden-tip')
		}, fade)
		clearTimeout(timeoutShow)
	}

	return (
		<div className={`ToolTip`} onMouseEnter={showTip} onMouseLeave={hideTip}>
			{children}
			<div ref={tipElement} className={`Tooltip-Tip ${direction} hidden-tip`}>{content}</div>
		</div>
	)
}
