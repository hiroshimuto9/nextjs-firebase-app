import { getAuth, onAuthStateChanged, signInAnonymously } from 'firebase/auth'
import { User } from '../models/User'
import { atom } from 'recoil'

const userState = atom<User>({
  key: 'user',
  default: null,
});

function authenticate() {
  const auth = getAuth();

  signInAnonymously(auth).catch(function (error) {
    // Todo: error handling
    const errorCode = error.code
    const errorMessage = error.message
  });

  onAuthStateChanged(auth, function (user) {
    if (user) {
      // Todo User機能開発時に削除
      console.log(user.uid)
      console.log(user.isAnonymous)
    } else {
      // User is signed out.
    }
  })
}

if (typeof window !== 'undefined') {
  authenticate()
}