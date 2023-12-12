import * as uuid from 'uuid'

import { TodoAccess } from '../dataLayer/todosAccess.mjs'
import { createLogger } from '../utils/logger.mjs'

const logger = createLogger('businessLogic/todos.mjs')

const todoAccess = new TodoAccess()

export async function getAllTodos(userId) {
  logger.info(`Get all todos of User_Id ${userId}`, {function: 'getAllTodos()'})  
  return todoAccess.getAllTodos(userId)
}