import { useEffect, useState } from 'react'
import {
  collection,
  getDocs,
  getFirestore,
  query,
  where,
} from 'firebase/firestore'
import { useAuthentication } from '../../hooks/authentication'
import { Question } from '../../models/Question'
import Layout from '../../components/Layout'

export default function QuestionsReceived() {
  const [questions, setQuestions] = useState<Question[]>([])
  const { user } = useAuthentication()

  const isServer = typeof window !== 'undefined'
  useEffect(() => {
    if (!isServer) {
      return
    }
    if (user === null) {
      return
    }

    async function loadQuestions() {
      const db = getFirestore()
      const q = query(
        collection(db, 'questions'),
        where('receiverUid', '==', user.uid)
      )
      const snapshot = await getDocs(q)

      if (snapshot.empty) {
        return
      }

      const gotQuestions = snapshot.docs.map((doc) => {
        const question = doc.data() as Question
        question.id = doc.id
        return question
      })
      setQuestions(gotQuestions)
    }

    loadQuestions()
  }, [isServer, user])

  return (
    <Layout>
      <div>サンプル</div>
    </Layout>
  )
}