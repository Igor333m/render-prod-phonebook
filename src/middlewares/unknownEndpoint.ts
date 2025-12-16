import type { Request, Response, NextFunction } from 'express'

const unknownEndpoint = (request: Request, response: Response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

export default unknownEndpoint