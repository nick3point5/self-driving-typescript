import { useState } from 'react'
import { Home } from '@/pages'
import { Footer, Header } from '@/components'
import './App.css'

function App() {
	return (
		<div className='App'>
			<Header />
			<Home />
			<Footer />
		</div>
	)
}

export default App
