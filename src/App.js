/* eslint-disable react-hooks/exhaustive-deps */
import Router from './Router';
import { useEffect } from 'react'
import { connect } from 'react-redux'

import { getUserInfoAction } from './redux/actions'

function App({ getUserInfo }) {

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem('userInfo'))
    if (userInfo && userInfo.id) {
      getUserInfo({ id: userInfo.id });
    }
  }, [])


  return (
    <div>
      <Router />
    </div>
  );
}
const mapDisPatchToProps = (dispatch) => {
  return {
    getUserInfo: (params) => dispatch(getUserInfoAction(params)),
  }
}

export default connect(null, mapDisPatchToProps)(App);
