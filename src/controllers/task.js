const { ApiResponse } = require("../helpers/api-response.helper");
const { handleException, ApiException } = require("../errors/api-exception");
const Task = require("../models/task");

class TaskController {

// Function to create task
createTask = async (req, res, next) => {
    try {        
        const { taskName, taskDate, taskStatus } = req.body;
        const createdBy = req.user.id;
        const sequence = await Task.countDocuments({ createdBy });

        const task = new Task({
            taskName,
            taskDate,
            taskStatus,
            createdBy,
            sequence,
        });

        await task.save();

        res.status(200).send(         
            new ApiResponse(task.toObject(),"Task created successfully")
        );      
    } catch (err) {
      handleException(err,next);
    }
}

// Function to update task
updateTask = async (req, res, next) => {
    try {        
        const { taskName, taskDate, taskStatus, sequence } = req.body;
        const { id } = req.params;
        const createdBy = req.user.id;

        const task = await Task.findOne({ _id: id, createdBy });
        if (!task) {
            throw new ApiException(404, 'Task not found');        
        }

        taskName ? task.taskName = taskName : null;
        taskDate ? task.taskDate = taskDate : null;
        taskStatus ? task.taskStatus = taskStatus : null;
        sequence ? task.sequence = sequence : null;        

        await task.save();

        res.status(200).send(         
            new ApiResponse(task.toObject(),"Task updated successfully")
        );      
    } catch (err) {
        handleException(err,next);
    }
}

// Function to get all tasks
getTasks = async (req, res, next) => {
    try {        
        const { page = 1, limit = 10 } = req.query;
        const createdBy = req.user.id;

        const tasks = await Task.find({ createdBy })
        .sort({ sequence: 1 })
        .skip((page - 1) * limit)
        .limit(limit);

        const totalCount = await Task.countDocuments({ createdBy });

        res.status(200).send(         
            new ApiResponse({
                count: totalCount,
                tasks: tasks
            },"Tasks fetched successfully")
        );      
    } catch (err) {
        handleException(err,next);
    }
}

// Function to get single task
getTask = async (req, res, next) => {
    try {        
        const { id } = req.params;
        const createdBy = req.user.id;

        const task = await Task.findOne({ _id: id, createdBy });
        if (!task) {
            throw new ApiException(404, 'Task not found');        
        }
        
        res.status(200).send(new ApiResponse(task.toObject(),"Task fetched successfully"));      
    } catch (err) {
        handleException(err,next);
    }
}

// Function to rearrange tasks
rearrangeTasks = async (req, res, next) => {
    try {        
        const { tasks } = req.body;
        const createdBy = req.user.id;
        const operations = tasks.map((task) => ({            
            updateOne: {
                filter: { _id: task.id, createdBy },
                update: { $set: { sequence: task.sequence } },
            },
        }));

        await Task.bulkWrite(operations);
        
        res.status(200).send(new ApiResponse(null,"Tasks rearranged successfully"));      
    } catch (err) {
        handleException(err,next);
    }
}

// Function to delete task
deleteTask = async (req, res, next) => {
    try {        
        const { id } = req.params;
        const createdBy = req.user.id;

        const task = await Task.findOneAndDelete({
            _id: id,
            createdBy: createdBy
        });

        if (!task) {
            throw new ApiException(404, 'Task not found');        
        }
        
        res.status(200).send(new ApiResponse(null,"Task deleted successfully"));      
    } catch (err) {
        handleException(err,next);
    }
}
}
module.exports = TaskController;
