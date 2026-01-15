import './App.scss'

import GifCanvas from './components/GifCanvas';
// import clip from './clips/template';
// import clip from './clips/overview';
// import clip from './clips/video-test';
// import clip from './clips/scene-test';
// import clip from './clips/save-activities-for-later';
// import clip from './clips/find-the-perfect-vocabulary';
// import clip from './clips/text-test';
import clip from './clips/showcase';

function App() {

  return (
    <div className="App">
      <GifCanvas clip={clip}/>
    </div>
  )
}

export default App
