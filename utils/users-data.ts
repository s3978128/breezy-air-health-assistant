import db from '@/lib/firebase.config'
import {
  addDoc,
  collection,
  updateDoc,
  doc,
  getDoc,
  query,
  where,
  getDocs,
  deleteDoc,
} from 'firebase/firestore'
import bcrypt from 'bcryptjs'
import type {
  UserPreferences,
  NotificationSettings,
  CreateUserOptions,
  User,
  Games,
} from '@/lib/types'

const saltRounds = bcrypt.genSaltSync(10)
const ref = collection(db, 'users')

function flattenObject(obj: { [key: string]: any }, parentKey = ''): { [key: string]: any } {
  let result: { [key: string]: any } = {}
  for (const key in obj) {
    if (obj[key] && typeof obj[key] === 'object') {
      const nested = flattenObject(obj[key], parentKey + key + '.')
      result = { ...result, ...nested }
    } else {
      result[parentKey + key] = obj[key]
    }
  }
  return result
}

async function createUser(userData: CreateUserOptions) {
  try {
    const hashedPassword =
      userData.provider === 'credentials' && userData.password
        ? bcrypt.hashSync(userData.password, saltRounds)
        : undefined

    const userDoc = {
      name: userData.name,
      email: userData.email,
      password: hashedPassword || undefined,
      provider: userData.provider,
      preferences: {
        healthConditions: {
          asthma: false,
          copd: false,
          heartDisease: false,
          allergies: false,
        },
        sensitiveGroup: false,
      },
      notificationSettings: {
        emailNotifications: true,
        email: userData.email,
        location: 'Ho Chi Minh City, VN',
        dailyUpdates: true,
        alertThreshold: 100,
        alertFrequency: 'immediate',
      },
      games: null,
    }

    const docRef = await addDoc(ref, userDoc)
    console.log('Create new user successfully')
    return docRef.id
  } catch (error) {
    console.error('Create new user error:', error)
    throw new Error('Failed to create user')
  }
}

async function deleteUser(id: string) {
  try {
    await deleteDoc(doc(ref, id))
  } catch (error) {
    console.error('Delete user error:', error)
    return null
  }
}

async function getUserById(id: string): Promise<User | null> {
  try {
    const docRef = doc(ref, id)
    const snapshot = await getDoc(docRef)
    if (snapshot.exists()) {
      return { id: snapshot.id, ...snapshot.data() } as User
    }
    console.log('User not found')
    return null
  } catch (error) {
    console.error('Get user error:', error)
    return null
  }
}

async function getUserByEmailAndPassword(email: string, password: string): Promise<User | null> {
  try {
    const docRef = query(ref, where('email', '==', email))

    const snapshot = await getDocs(docRef)
    if (!snapshot.empty) {
      const user = {
        ...snapshot.docs[0].data(),
        id: snapshot.docs[0].id,
      }

      const isMatchedPassword = await bcrypt.compare(password, user.password)
      if (isMatchedPassword) return user as User
      return null
    }
    return null
  } catch (error) {
    console.error('Get user error:', error)
    return null
  }
}

async function getUserByEmailAndProvider(email: string, provider?: string): Promise<User | null> {
  try {
    const conditions = [where('email', '==', email)]
    if (provider) {
      conditions.push(where('provider', '==', provider))
    }

    const q = query(ref, ...conditions)
    const snapshot = await getDocs(q)

    if (!snapshot.empty) {
      return { id: snapshot.docs[0].id, ...snapshot.docs[0].data() } as User
    }

    console.log('User not found')
    return null
  } catch (error) {
    console.error('getUser error:', error)
    return null
  }
}

async function getUsersWithHourlyNotifications() {
  try {
    const usersRef = collection(db, 'users')
    const q = query(
      usersRef,
      where('notificationSettings.emailNotifications', '==', true),
      where('notificationSettings.alertFrequency', '==', 'hourly'),
    )
    const querySnapshot = await getDocs(q)

    const users = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }))

    return users as User[]
  } catch (error) {
    console.error('Error fetching users with daily notifications:', error)
    return []
  }
}

async function getUsersWithDailyNotifications() {
  try {
    const usersRef = collection(db, 'users')
    const q = query(
      usersRef,
      where('notificationSettings.emailNotifications', '==', true),
      where('notificationSettings.alertFrequency', '==', 'daily'),
    )
    const querySnapshot = await getDocs(q)

    const users = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }))

    return users as User[]
  } catch (error) {
    console.error('Error fetching users with daily notifications:', error)
    return []
  }
}

async function updatePassword(id: string, newPassword: string) {
  try {
    const docRef = doc(ref, id)
    const hashedPassword = bcrypt.hashSync(newPassword, saltRounds)
    await updateDoc(docRef, { password: hashedPassword })
    console.log('Password updated successfully')
  } catch (error) {
    console.error('Update password error:', error)
  }
}

async function updateNotifications(id: string, data: NotificationSettings) {
  try {
    const updateRef = doc(ref, id)
    const flattenedData = flattenObject(data, 'notificationSettings.')
    await updateDoc(updateRef, flattenedData)
  } catch (error) {
    console.log('Update Notification settings error:', error)
  }
}

async function updatePreferences(id: string, data: UserPreferences) {
  try {
    const updatedRef = doc(ref, id)
    const flattenedData = flattenObject(data, 'preferences.')
    await updateDoc(updatedRef, flattenedData)
  } catch (error) {
    console.log('Update Preferences error:', error)
  }
}

async function updateInformation(id: string, data: { name: string; password: string }) {
  try {
    const hashedPassword = bcrypt.hashSync(data.password, saltRounds)

    const updatedData = {
      name: name,
      password: hashedPassword,
    }

    const updatedRef = doc(ref, id)
    const flattenedData = flattenObject(updatedData)
    await updateDoc(updatedRef, flattenedData)
  } catch (error) {
    console.log('Update Information error:', error)
  }
}

async function updateGames(id: string, data: Games) {
  try {
    const updatedRef = doc(ref, id)
    const flattenedData = flattenObject(data, 'games.')
    await updateDoc(updatedRef, flattenedData)
  } catch (error) {
    console.log('Update Games error:', error)
  }
}

export {
  createUser,
  deleteUser,
  getUserById,
  updatePassword,
  updatePreferences,
  updateNotifications,
  updateInformation,
  updateGames,
  getUserByEmailAndPassword,
  getUserByEmailAndProvider,
  getUsersWithHourlyNotifications,
  getUsersWithDailyNotifications,
}
