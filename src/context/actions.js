const ROOT_URL = 'https://secret-hamlet-03431.herokuapp.com';

export async function loginUser(dispatch, loginPayload) {

  try {
    dispatch({ type: 'REQUEST_LOGIN' });
    //let response = await fetch(`${ROOT_URL}/login`, requestOptions);
    //let data = await response.json();
    let data = {
        user : {
            username : loginPayload.username,
            password : loginPayload.password
        }
    }

    if (data.user) {
      dispatch({ type: 'LOGIN_SUCCESS', payload: data });
      return data;
    }

    dispatch({ type: 'LOGIN_ERROR', error: data.errors[0] });
    return;
  } catch (error) {
    dispatch({ type: 'LOGIN_ERROR', error: error });
  }
}

export async function logout(dispatch) {
  dispatch({ type: 'LOGOUT' });
  // localStorage.removeItem('currentUser');
  // localStorage.removeItem('token');
}
