import db from '@/lib/firebase.config'
import { addDoc, collection, getDocs, getDoc, deleteDoc, doc } from 'firebase/firestore'
import mockQuestions from '@/public/mockQuestions.json'

const ref = collection(db, 'questions')

async function deleteAllQuestionsOneByOne() {
  const snapshot = await getDocs(ref)
  await Promise.all(snapshot.docs.map((docSnap) => deleteDoc(doc(db, 'questions', docSnap.id))))
  console.log('Done delete.')
}

async function createQuestion(question: string, options: any, answer: number) {
  const questDoc = { question, options, answer }
  const docRef = await addDoc(ref, questDoc)
  return docRef.id
}

async function updateNewQuestionDatabase() {
  await deleteAllQuestionsOneByOne()

  for (const quest of mockQuestions) {
    await createQuestion(quest.question, quest.options, quest.answer)
  }

  console.log('Done create new.')
}

async function getNQuestions(count: number, doneQuest: string[]) {
  if (!Array.isArray(doneQuest)) {
    doneQuest = []
  }

  try {
    const snapshot = await getDocs(ref)

    const allQuestions = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }))

    const filteredQuestions = allQuestions.filter((q) => !doneQuest.includes(q.id))

    const shuffled = filteredQuestions.sort(() => 0.5 - Math.random())
    return shuffled.slice(0, count)
  } catch (error) {
    console.error('getNQuestions error:', error)
  }
}

async function getQuestionsById(idList: string[]) {
  if (!Array.isArray(idList) || idList.length === 0) return []

  // If list > 10, split into chunks due to Firestore "in" query limit
  const promises = idList.map((id) => getDoc(doc(db, 'questions', id)))

  const docs = await Promise.all(promises)

  return docs.filter((snap) => snap.exists()).map((snap) => ({ id: snap.id, ...snap.data() }))
}

export { updateNewQuestionDatabase, getNQuestions, getQuestionsById }
