import { useRouter } from 'next/router';
import { FormEvent, useEffect, useState } from 'react';
import { User } from '../../models/User';
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getFirestore,
  serverTimestamp,
} from 'firebase/firestore'
import Layout from '../../components/Layout'
import { toast } from 'react-toastify';
import { useAuthentication } from '../../hooks/authentication';

type Query = {
  uid: string
}

export default function UserShow() {
  const [user, setUser] = useState<User>(null);
  const router = useRouter();
  const query = router.query as Query

  const { user: currentUser } = useAuthentication()
  const [body, setBody] = useState('')
  const [isSending, setIsSending] = useState(false)

  useEffect(() => {
    async function loadUser() {
      const db = getFirestore()
      if (query.uid === undefined) {
        return
      }
      const ref = doc(collection(db, 'users'), query.uid)
      const userDoc = await getDoc(ref)

      if (!userDoc.exists()) {
        return
      }

      const gotUser = userDoc.data() as User
      gotUser.uid = userDoc.id
      setUser(gotUser)
    }
    loadUser()
  }, [query.uid])

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const db = getFirestore()
    setIsSending(true)
    // Todo senderUidとreceiverUidが同一になってしまっているが、一旦このまま進める
    await addDoc(collection(db, 'questions'), {
      senderUid: currentUser.uid,
      receiverUid: user.uid,
      body,
      isReplied: false,
      createdAt: serverTimestamp(),
    })
    setIsSending(false)

    setBody('')
    toast.success('質問を送信しました。', {
      position: 'bottom-left',
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    })
  }

  return (
    <Layout>
      {user && currentUser && (
        <div className="text-center">
          <h1 className="h4">{user.name}さんのページ</h1>
          <div className="m-5">{user.name}さんに質問しよう！</div>
          <div className="row justify-content-center mb-3">
          <div className="col-12 col-md-6">
            {user.uid === currentUser.uid ? (
              <div>自分には送信できません。</div>
            ) : (
              <form onSubmit={onSubmit}>
                <textarea
                  className="form-control"
                  placeholder="質問を記入しよう"
                  rows={6}
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  required
                ></textarea>
                <div className="m-3">
                  {isSending ? (
                    <div className="spinner-border text-secondary" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                  ) : (
                    <button type="submit" className="btn btn-primary">
                      質問を送信する
                    </button>
                  )}
                </div>
              </form>
            )}
          </div>
        </div>
        </div>
      )}
    </Layout>
  )
}