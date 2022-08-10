import './Footer.css'

export function Footer() {
	const year = new Date().getFullYear()
	return (
		<div className='Footer'>
			<footer>
				<a target='_blank' href='http://www.kenny-trinh.ga/' id='footer-link'>
					Kenny Trinh © {year}
				</a>
			</footer>
		</div>
	)
}
