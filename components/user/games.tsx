import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { useAuth } from '@/contexts/auth-context'
import LoginPrompt from '@/components/login-prompt'
import { toast } from '@/hooks/use-toast'
import type { Games } from '@/lib/types'
import { Users } from 'lucide-react'

export default function Games() {
  const { games, updateGames, questions, userName } = useAuth()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<number, { selected: number; correct: boolean }>>({})
  const [isEnd, setIsEnd] = useState(false)

  // Load saved state
  useEffect(() => {
    const saved = localStorage.getItem('quiz-progress')
    if (saved) {
      const { answers: savedAnswers, currentIndex: savedIndex, isEnd: savedEnd } = JSON.parse(saved)
      setAnswers(savedAnswers || {})
      setCurrentIndex(savedIndex || 0)
      setIsEnd(savedEnd || false)
    }
  }, [])

  // Persist state
  useEffect(() => {
    localStorage.setItem('quiz-progress', JSON.stringify({ answers, currentIndex, isEnd }))
  }, [answers, currentIndex, isEnd])

  if (!userName) {
    return (
      <div className="mt-4">
        <LoginPrompt
          feature="Game Mode"
          message="Log in to play quiz games and boost your air quality knowledge!"
          variant="card"
        />
      </div>
    )
  }

  if (!questions || questions.length === 0) {
    return (
      <div className="flex justify-center items-center py-12">
        <p className="text-gray-500 text-sm">Loading questions...</p>
      </div>
    )
  }

  const total = questions.length
  const progress = total ? ((currentIndex + 1) / total) * 100 : 0

  const handleCheckAnswer = (index: number) => {
    if (answers[currentIndex] != null) return
    const correct = questions[currentIndex].answer === index
    setAnswers((prev) => ({ ...prev, [currentIndex]: { selected: index, correct } }))
    setTimeout(() => {
      if (currentIndex === total - 1) {
        setIsEnd(true)
      } else {
        setCurrentIndex((i) => i + 1)
      }
    }, 400)
  }

  const handleNext = () => {
    if (!answers[currentIndex]) {
      toast({ title: 'Please select an answer before proceeding.' })
      return
    }
    if (currentIndex < total - 1) setCurrentIndex((i) => i + 1)
    else setIsEnd(true)
  }

  const handlePrevious = () => {
    if (currentIndex > 0) setCurrentIndex((i) => i - 1)
  }

  const resetQuiz = () => {
    setAnswers({})
    setCurrentIndex(0)
    setIsEnd(false)
    localStorage.removeItem('quiz-progress')
  }

  const handleSaveScore = async () => {
    const correctIds = Object.entries(answers)
      .filter(([_, a]) => a.correct)
      .map(([i]) => questions[Number(i)].id)
      .concat(games.correctAnswers)

    const earned = Object.values(answers).filter((a) => a.correct).length * 10
    const newScore = (games.score || 0) + earned
    const newLevel = Math.floor(newScore / 30)
    const uniqueCorrect = Array.from(new Set(correctIds))

    const data: Games = {
      level: newLevel,
      score: newScore,
      correctAnswers: uniqueCorrect as string[],
      questionsLimitedPerDay: 0,
      currentCompleted: {
        questions: questions.map((q, idx) => ({
          questionId: q.id,
          answer: answers[idx]?.selected ?? -1,
        })),
        expires: Date.now() + 24 * 60 * 60 * 1000, // 24 hours later
      },
    }

    const success = await updateGames(data)
    if (success) {
      toast({ title: 'Score saved successfully!' })
      localStorage.removeItem('quiz-progress')

      // Optional: force a reload of context data
      // window.location.reload() // or call a refreshGames() if your context provides one
    } else {
      toast({ title: 'Failed to save score', variant: 'destructive' })
    }
  }

  const allAnswered = total && Object.keys(answers).length === total
  const doneForToday =
    games.questionsLimitedPerDay === 0 && games.currentCompleted.expires > Date.now()
  const isQuizOver = isEnd || doneForToday

  return (
    <div className="max-w-2xl mx-auto mt-6 space-y-6">
      <Card>
        <CardHeader className="bg-gradient-to-r from-emerald-50 to-sky-50 pb-2">
          <CardTitle className="text-emerald-700">{userName}</CardTitle>
          <CardDescription className="text-sm text-gray-600">
            Level {games.level} | Score: {games.score}
          </CardDescription>
        </CardHeader>
      </Card>

      {isQuizOver ? (
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="bg-gradient-to-r from-emerald-50 to-sky-50">
            <CardTitle className="text-2xl text-center text-emerald-700">
              {doneForToday ? 'Try Again Tomorrow' : 'Quiz Complete'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 p-4">
            {Object.keys(answers).length === total ||
            games.currentCompleted.questions.length ||
            doneForToday ? (
              <>
                <div className="flex justify-between items-start text-sm text-gray-600">
                  <div className="flex items-start gap-2">
                    <Users className="h-4 w-4 mt-0.5 text-gray-500" />
                    <span>
                      Completed{' '}
                      {Object.keys(answers).length || games.currentCompleted.questions.length}{' '}
                      questions.
                    </span>
                  </div>
                  {doneForToday && (
                    <p className="text-sm text-gray-500">
                      Updated:{' '}
                      {new Date(games.currentCompleted.expires - 86400000).toLocaleTimeString()}
                    </p>
                  )}
                </div>
                {questions.map((q, idx) => {
                  const userAns =
                    answers[idx]?.selected ?? games.currentCompleted.questions[idx]?.answer
                  const correctAns = q.answer
                  const isCorrect = userAns === correctAns
                  return (
                    <div
                      key={idx}
                      className={`${doneForToday && idx === questions.length - 1 ? '' : 'border-b'} pb-2`}
                    >
                      <p className="font-medium text-gray-800">
                        Q{idx + 1}: {q.question}
                      </p>
                      <p className="text-blue-600">Correct: {q.options[correctAns]}</p>
                      <p className={`font-bold ${isCorrect ? 'text-green-600' : 'text-red-600'}`}>
                        Your Answer: {userAns === -1 ? 'No Answer' : q.options[userAns]}
                      </p>
                    </div>
                  )
                })}
                {!doneForToday && (
                  <>
                    <p className="font-bold text-lg">
                      Your total score today:{' '}
                      {Object.values(answers).filter((a) => a.correct).length * 10}
                    </p>
                    <div className="flex justify-center gap-4 mt-3">
                      <Button
                        onClick={resetQuiz}
                        className="bg-gradient-to-l from-sky-500 to-sky-600 text-white"
                      >
                        Retry Quiz
                      </Button>
                      <Button
                        onClick={handleSaveScore}
                        disabled={!allAnswered}
                        className="bg-gradient-to-r from-sky-500 to-sky-600 text-white"
                      >
                        Save Score
                      </Button>
                    </div>
                  </>
                )}
              </>
            ) : (
              <p className="text-sm text-gray-500 italic text-center">
                Another quiz is waiting tomorrow!
              </p>
            )}
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader className="bg-gradient-to-r from-emerald-50 to-sky-50 pb-2">
            <CardTitle className="text-2xl text-center text-emerald-700">
              Question {currentIndex + 1} of {total}
            </CardTitle>
            <Progress value={progress} className="mt-2" />
          </CardHeader>
          <CardContent className="space-y-4 p-4">
            <p className="text-lg font-medium">
              {questions[currentIndex].question}
              {answers[currentIndex] && (
                <span
                  className={`ml-2 font-bold ${answers[currentIndex].correct ? 'text-green-600' : 'text-red-600'}`}
                >
                  {answers[currentIndex].correct ? 'Correct' : 'Incorrect'}
                </span>
              )}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {questions[currentIndex].options.map((opt, idx) => {
                const selected = answers[currentIndex]?.selected === idx
                const answered = answers[currentIndex] != null
                let classes = ''
                if (answered) {
                  if (selected && answers[currentIndex].correct)
                    classes = 'bg-green-600 text-white border-green-600'
                  else if (selected && !answers[currentIndex].correct)
                    classes = 'bg-red-600 text-white border-red-600'
                  else classes = 'opacity-70'
                }
                return (
                  <Button
                    key={idx}
                    variant="outline"
                    className={`w-full text-center whitespace-normal break-words p-4 h-auto ${classes}`}
                    onClick={() => handleCheckAnswer(idx)}
                    disabled={answered}
                  >
                    {opt}
                  </Button>
                )
              })}
            </div>
            <div className="flex justify-between mt-4">
              <Button onClick={handlePrevious} disabled={currentIndex === 0} variant="outline">
                Previous
              </Button>
              <Button onClick={handleNext} variant="outline">
                {currentIndex === total - 1 ? 'Finish' : 'Next'}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
