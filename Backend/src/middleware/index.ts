import type express from 'express'
import { get, merge } from 'lodash'
import { ObjectId } from 'mongodb'
import { getUserBySessionToken } from '../db/users'

export const isAuthenticated = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  try {
    const sessionToken = req.cookies['WEB-AUTH']
    if (!sessionToken) {
      console.log('it messes up here')
      return res.sendStatus(403)
    }
    console.log(sessionToken)

    const existingUser = await getUserBySessionToken(sessionToken)
    if (!existingUser) {
      console.log('it is ruined up here')
      return res.sendStatus(403)
    }
    console.log(existingUser)

    merge(req, { identity: existingUser })

    next()
  } catch (error) {
    console.log(error)
    res.sendStatus(400)
  }
}

export const isOwner = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  try {
    const { id } = req.params
    const currentUserId = get(req, 'identity._id') as string

    console.log('Current User ID:', currentUserId) // Add this line to check the currentUserId value

    if (!currentUserId) {
      console.log('Can\'t find ID here')
      return res.sendStatus(403)
    }

    const objectIdId = new ObjectId(id)
    console.log(currentUserId, 'and other id is', objectIdId)

    if (currentUserId.toString() !== objectIdId.toString()) {
      console.log('Not the owner')
      return res.sendStatus(403)
    }

    next()
  } catch (error) {
    console.log(error)
    return res.sendStatus(400)
  }
}
