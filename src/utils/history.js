import { createBrowserHistory } from 'history';

const history = createBrowserHistory();


history.listen(()=> { 
  console.log('ádasd');
  return window.scrollTo(0,0)
} );


export default history;
