import './Header.css'

import { gitHubIcon } from '@/assets'

export function Header() {
	return (
		<div className={`Header`}>
			<div className='header-container'>
				<h1>Self Driving Neural Network</h1>
				<a
					href='https://github.com/nick3point5/self-driving-typescript'
					id='git-hub-link'
				>
					<h1>Source Code</h1>
					<img src={gitHubIcon} alt="GitHub link" id='git-hub-image'/>
				</a>
			</div>
		</div>
	)
}
