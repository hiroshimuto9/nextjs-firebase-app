import { getAuth, onAuthStateChanged, signInAnonymously } from 'firebase/auth'
import { User } from '../models/User'
import { atom, useRecoilState } from 'recoil'
import { useEffect } from 'react';

const userState = atom<User>({
  key: 'user',
  default: null,
});

export function useAuthentication() {
  const [user, setUser] = useRecoilState(userState);
  useEffect(() => {
    if (user !== null) {
      return
    }

    const auth = getAuth();

    signInAnonymously(auth).catch(function (error) {
      // Todo: error handling
      console.error(error);
    });

    // firebaseからuserを取得し、userStateを更新する
    onAuthStateChanged(auth, function (firebaseUser) {
      if (firebaseUser) {
        setUser({
          uid: firebaseUser.uid,
          isAnonymous: firebaseUser.isAnonymous,
        })
      } else {
        // User is signed out.
        setUser(null)
      }
    })
  }, []);

  return { user }
}