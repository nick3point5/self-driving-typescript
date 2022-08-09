import './InputSlider.css';

type propsType = {
	label: string
	value: number
	setValue: React.Dispatch<React.SetStateAction<number>>
	min?: number
	max?: number
	step?: number
}

export function InputSlider({ label, value, setValue, min=1, max=100, step=1 }:propsType) {
	function handleInput(event: React.ChangeEvent<HTMLInputElement>) {
		event.preventDefault()
		const { value } = event.target
		if (+value > max) {
			setValue(max)
		} else if(+value < min){
			setValue(1)
		} else {
			setValue(+value)
		}
	}
	return (
		<div className={`InputSlider`}>
			<label>{label}</label>
			<div className='input-container'>
				<input
					className='range-input'
					min={0}
					max={max}
					step={step}
					type='range'
					value={value}
					onChange={(event) => {
						handleInput(event)
					}}
				/>
				<input
					className='number-input'
					min={0}
					max={max}
					step={step}
					type='number'
					value={value}
					onChange={(event) => {
						handleInput(event)
					}}
				/>
			</div>
		</div>
	)
}