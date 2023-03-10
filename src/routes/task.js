const express = require('express');
const TaskController = require('../controllers/task');
const { isUserLoggedin } = require('../middlewares/auth');
const handleValidationErrors = require('../middlewares/validator');

const taskRouter = express.Router();
const taskController = new TaskController();
/**
 * @swagger
 * tags:
 *   name: 2. Tasks 
 *   description: APIs to manage tasks
 */

/**
 * @swagger
 *  /tasks:
 *    post:
 *      summary: Create a new task
 *      description: 
 *        <h3>You can create a new task by using this api.</h3>
 *      tags: [2. Tasks]
 *      security:
 *       - bearerAuth: [] 
 *      requestBody:
 *          required: true
 *          content:
 *              'application/x-www-form-urlencoded':              
 *                  schema:
 *                      type: object
 *                      properties:
 *                          taskName:
 *                              type: string
 *                              description: Name of the task
 *                          taskDate:
 *                              type: string
 *                              format: date
 *                              description: Date of the task
 *                              example: '2023-03-10'
 *                          taskStatus:
 *                              type: string
 *                              enum: 
 *                                  - Completed
 *                                  - Incomplete
 *                              description: status of the task 
 *      responses:
 *        "200":
 *          description: Task created successfully
 *        "400":
 *          description: Invalid request
 *        "500":
 *          description: Internal server error
 */
taskRouter.post('/', isUserLoggedin, taskController.createTask);

/**
 * @swagger
 *  /tasks/rearrange:
 *    put:
 *      summary: Rearrange the sequence of tasks
 *      description: 
 *        <h3>Allows users to rearrange the sequence of their tasks by specifying a new order.</h3>
 *      tags: [2. Tasks]
 *      security:
 *       - bearerAuth: [] 
 *      requestBody:
 *          required: true
 *          content:
 *              'application/json':              
 *                  schema:
 *                      type: object
 *                      properties:
 *                          tasks:
 *                              type: array
 *                              items:
 *                                  type: object
 *                                  properties:
 *                                      id:
 *                                          type: string
 *                                          description: The ID of the task to rearrange
 *                                      sequence:
 *                                          type: integer
 *                                          description: The new position of the task in the sequence
 *                                          minimum: 0
 *                                  required:
 *                                      - id
 *                                      - sequence
 *                      required:
 *                          - tasks 
 *      responses:
 *        "200":
 *          description: Task created successfully
 *        "400":
 *          description: Invalid request
 *        "500":
 *          description: Internal server error
 */
taskRouter.put('/rearrange', isUserLoggedin, taskController.rearrangeTasks);


/**
 * @swagger
 *  /tasks/{id}:
 *    put:
 *      summary: Update a task
 *      description: 
 *        <h3>You can update a new task by using this api.</h3>
 *      tags: [2. Tasks]
 *      security:
 *       - bearerAuth: [] 
 *      parameters:
 *          - in: path
 *            name: id
 *            description: id of the task
 *            required: true
 *            schema:
 *              type: string
 *      requestBody:
 *          required: true
 *          content:
 *              'application/x-www-form-urlencoded':              
 *                  schema:
 *                      type: object
 *                      properties:
 *                          taskName:
 *                              type: string
 *                              description: Name of the task
 *                          taskDate:
 *                              type: string
 *                              format: date
 *                              description: Date of the task
 *                          taskStatus:
 *                              type: string
 *                              enum: 
 *                                  - Completed
 *                                  - Incomplete
 *                              description: status of the task 
 *                          sequence:
 *                              type: integer
 *                              description: Position of the task
 *      responses:
 *        "200":
 *          description: Task updated successfully
 *        "400":
 *          description: Invalid request
 *        "500":
 *          description: Internal server error
 */
taskRouter.put('/:id', isUserLoggedin, taskController.updateTask);

/**
 * @swagger
 *  /tasks:
 *    get:
 *      summary: Get all tasks
 *      description: 
 *        <h3>You can get all tasks by using this api.</h3>
 *      tags: [2. Tasks]
 *      security:
 *       - bearerAuth: [] 
 *      parameters: 
 *         - in: query
 *           name: page
 *           description: The number of items to skip before starting to collect the result set.
 *           required: false
 *           schema:
 *            type: integer
 *            minimum: 0 
 *         - in: query
 *           name: limit
 *           description: The number of items to return
 *           required: false
 *           schema:
 *            type: integer
 *            minimum: 1 
 *      responses:
 *        "200":
 *          description: Task created successfully
 *        "400":
 *          description: Invalid request
 *        "500":
 *          description: Internal server error
 */
taskRouter.get('/', isUserLoggedin, taskController.getTasks);

/**
 * @swagger
 *  /tasks/{id}:
 *    get:
 *      summary: Get a single task
 *      description: 
 *        <h3>You can get a single task by using this api.</h3>
 *      tags: [2. Tasks]
 *      security:
 *       - bearerAuth: [] 
 *      parameters:
 *          - in: path
 *            name: id
 *            description: id of the task
 *            required: true
 *            schema:
 *              type: string 
 *      responses:
 *        "200":
 *          description: Task fetched successfully
 *        "400":
 *          description: Invalid request
 *        "500":
 *          description: Internal server error
 */
taskRouter.get('/:id', isUserLoggedin, taskController.getTask);

/**
 * @swagger
 *  /tasks/{id}:
 *    delete:
 *      summary: Delete a task
 *      description: 
 *        <h3>You can delete a task by using this api.</h3>
 *      tags: [2. Tasks]
 *      security:
 *       - bearerAuth: [] 
 *      parameters:
 *          - in: path
 *            name: id
 *            description: id of the task
 *            required: true
 *            schema:
 *              type: string 
 *      responses:
 *        "200":
 *          description: Task deleted successfully
 *        "400":
 *          description: Invalid request
 *        "500":
 *          description: Internal server error
 */
taskRouter.delete('/:id', isUserLoggedin, taskController.deleteTask);

module.exports = taskRouter;