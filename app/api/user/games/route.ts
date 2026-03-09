import { NextResponse } from 'next/server'
import { getNQuestions, getQuestionsById, updateNewQuestionDatabase } from '@/utils/games-data'
import { auth } from '@/auth'
import { getUserById, updateGames } from '@/utils/users-data'

// Fetch user questions and quiz data
export async function GET() {
  const session = await auth()
  if (!session?.user) {
    return NextResponse.json({ message: 'Unauthorized user.' }, { status: 401 })
  }

  try {
    const id = session.user.id as string
    const user = await getUserById(id)
    let games = user?.games

    const now = Date.now()

    if (!games) {
      games = {
        level: 0,
        score: 0,
        correctAnswers: [],
        questionsLimitedPerDay: 10,
        currentCompleted: {
          questions: [],
          expires: 0,
        },
      }
    }

    // User has no more questions today AND still within expiry window
    if (games.questionsLimitedPerDay === 0 && games.currentCompleted.expires > now) {
      const questionsObject = games.currentCompleted.questions
      const questionsArray = Object.values(questionsObject) // convert to array

      const idList = questionsArray
        .filter((q) => q && typeof q === 'object' && 'questionId' in q)
        .map((q) => q.questionId)
      const questAvailable = await getQuestionsById(idList)
      return NextResponse.json({ questAvailable, games })
    }

    // If expired, reset the counter (but don't update currentCompleted)
    if (games.questionsLimitedPerDay === 0 && games.currentCompleted.expires <= now) {
      games.questionsLimitedPerDay = 10
      games.currentCompleted.questions = []
      games.currentCompleted.expires = 0
    }

    const questNum = games.questionsLimitedPerDay
    const doneQuest = games.correctAnswers

    if (questNum && doneQuest) {
      const questAvailable = await getNQuestions(questNum, doneQuest)
      return NextResponse.json({ questAvailable, games })
    }

    return NextResponse.json({ message: 'No games data' }, { status: 500 })
  } catch (error: any) {
    return NextResponse.json(
      { message: 'Failed to fetch games data', error: error.message },
      { status: 500 },
    )
  }
}

// Update the question database with new questions
export async function POST(req) {
  try {
    const { post } = await req.json()

    await updateNewQuestionDatabase()

    return NextResponse.json({ message: 'Done' }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ message: 'Error', error: error.message }, { status: 500 })
  }
}

export async function PUT(req) {
  const session = await auth()

  if (!session?.user) return NextResponse.json({ message: 'Unauthorized user.' }, { status: 500 })

  try {
    const id = session?.user?.id as string
    const { games } = await req.json()

    await updateGames(id, games)
    return NextResponse.json({ message: 'Update user score...' }, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { message: 'Update user score error:', error: error.message },
      { status: 500 },
    )
  }
}
