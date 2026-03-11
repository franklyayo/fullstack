import React, { useEffect } from 'react';
import { auth } from '../_actions/user_actions';
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from 'react-router-dom';

function Auth(SpecificComponent, option, adminRoute = null) {
    function AuthenticationCheck(props) {
        let user = useSelector(state => state.user);
        const dispatch = useDispatch();
        const history = useHistory();

        useEffect(() => {
            dispatch(auth()).then(response => {
                if (!response.payload.isAuth) {
                    if (option) {
                        history.push('/login');
                    }
                } else {
                    if (adminRoute && !response.payload.isAdmin) {
                        history.push('/');
                    } else {
                        if (option === false) {
                            history.push('/');
                        }
                    }
                }
            });
        }, [dispatch, history, option, adminRoute]);

        return <SpecificComponent {...props} user={user} />;
    }

    return AuthenticationCheck;
}

export default Auth;