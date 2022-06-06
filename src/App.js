import React,{Component, Suspense,lazy} from 'react';

const Layout = lazy(()=> import('./Layout/Layout'))

class App extends Component{

  constructor(){
    super();
    window.addEventListener('orientationchange',function () {
      window.location.reload(true)
    },false);
  }

  render(){
    return(
      <React.Fragment>
        <Suspense fallback={<div style={{backgroundColor:'white'}}/>}>
          <Layout/>
        </Suspense>
      </React.Fragment>
    )
  }
}

export default App;
