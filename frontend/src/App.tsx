import React, { FC, useEffect, useState } from 'react';
import { useGoogleLogin,  } from '@react-oauth/google';
import axios from 'axios';
import { useQuery, gql } from '@apollo/client';


const App: FC = (): JSX.Element => {

    const [user, setUser] = useState<any>();

    const getUser = async () => {
        await fetch('http://localhost:5000/auth/user', {
            method: "GET",
            credentials: "include",
            // @ts-ignore
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                "Access-Control-Allow-Credentials": true
            }
        }).then(res => {
            if (res.status === 200)
                return res.json();
            throw new Error("Something went wrong... Login failed");
        }).then(res => {
            setUser(res.user);
        }).catch(err => {
            console.log(err);
        });
    };

    useEffect(() => {
        getUser();
    }, []);

    const handleLogout = () => {
        window.open('http://localhost:5000/auth/logout', '_self');
    };

    console.log(user);

    const getBooks = gql`
      query Query {
          filterBooks {
              books {
                  title
              }
          }
      }
  `;

    const { error, data } = useQuery(getBooks);

    data? console.log(data) : console.log(error);

    const googleLogin = useGoogleLogin({
        onSuccess: async (tokenResponse) => {
            console.log(tokenResponse);
            const userInfo = await axios.get(
                'https://www.googleapis.com/oauth2/v3/userinfo',
                { headers: { Authorization: `Bearer ${tokenResponse.access_token}` } },
            );
            window.open('http://localhost:5000/auth/google', '_self');
            console.log(userInfo.data);
        },
        onError: errorResponse => console.log(errorResponse),
    });

    return (
        user?
            <>
                Hello, nice to see you {user.displayName}!
                <button onClick={() => handleLogout()}>Log out!</button>
            </>:
            <button onClick={() => googleLogin()}>Please log in</button>
    );
};

export default App;