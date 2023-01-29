import Desktop from './components/Desktop'
import Header from './components/Header'

function App () {
  return (
    <div id='app' className='flex w-full h-full flex-col'>
      <header>
        <Header />
      </header>
      <main>
        <Desktop />
      </main>
    </div>
  )
}

export default App
