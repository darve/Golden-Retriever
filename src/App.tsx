import './App.scss'

import GifCanvas from './components/GifCanvas';
import clip from './clips/showcase';

function App() {

  return (
    <div className="App">
      <GifCanvas clip={clip}/>
    </div>
  )
}

export default App
