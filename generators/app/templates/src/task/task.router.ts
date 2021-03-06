import TaskModel from './task.model';
import { Request, Response, NextFunction, Router } from 'express';

class TaskRouter {
  public router: Router;

  constructor() {
    this.router = Router();
    this.routes();
  }

  public routes(): void {
    this.router.get('/tasks', this.getTasks);
    this.router.post('/tasks', this.saveTask);
    this.router.get('/tasks/:id', this.getTask);
    this.router.put('/tasks/:id', this.updateTask);
    this.router.delete('/tasks/:id', this.deleteTask);
  }

  private getTask(req: Request, res: Response): void {
    const taskId = req.params.id;

    TaskModel.findById(taskId)
      .then((data) => {
        if (!data) {
          res.status(404).send({
            data: new Error('Task requested doesn\'t exist')
          });
        } else {
          res.status(200).send({
            data
          });
        }
      })
      .catch((err) => {
        res.status(500).send({
          data: new Error('Error retrieving the task')
        });
      });
  }

  private getTasks(req: Request, res: Response): void {
    TaskModel.find({})
      .then((data) => {
        if (!data) {
          res.status(404).send({
            data: new Error('There are no tasks')
          });
        } else {
          res.status(200).send({
            data
          });
        }
      })
      .catch((err) => {
        console.log(err);
        res.status(500).send({
          data: new Error('Error retrieving tasks')
        });
      });
  }

  private saveTask(req: Request, res: Response): void {
    const params = req.body;
    const task = new TaskModel({
      name: params.name,
      createdAt: (new Date).toISOString(),
      updatedAt: (new Date).toISOString()
    });

    task.save().
      then((data) => {
        res.status(200).send({
          data
        });
      })
      .catch((err) => {
        console.log(err);
        res.status(500).send({
          data: new Error('Error creating task')
        });
      });

  }

  private updateTask(req: Request, res: Response): void {
    const taskId = req.params.id;
    const params = req.body;
    const options = { new: true };

    params.updatedAt = (new Date).toISOString();

    TaskModel.findByIdAndUpdate({ _id: taskId }, params, options)
      .then((data) => {
        res.status(200).send({
          data
        });
      })
      .catch((err) => {
        console.log(err);
        res.status(500).send({
          data: new Error('Error updating task')
        });
      });
  }

  private deleteTask(req: Request, res: Response): void {
    const taskId = req.params.id;

    TaskModel.findByIdAndRemove({ _id: taskId })
      .then((data) => {
        res.status(200).send({
          data
        });
      })
      .catch((err) => {
        console.log(err);
        res.status(500).send({
          data: new Error('Error deleting task')
        });
      });
  }

}

export default new TaskRouter().router;