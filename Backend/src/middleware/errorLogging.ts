import logger from 'logger'
import { Request, Response } from 'express'



export const errorHandler = (error: string, ) => {
    logger.error(error.message)

    if (error.name === 'CastError') {
        return response.status(400).send({ error: 'malformatted id' })
    } else if (error.name === 'ValidationError') {
        return response.status(400).json({ error: error.message })
    } else if (error.name ===  'JsonWebTokenError') {
        return response.status(400).json({ error: error.message })
    }
    next(error)
}