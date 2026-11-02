import { Injectable, NotFoundException} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class TasksService {
    constructor(private prisma: PrismaService) {}

    getTasks(userId: any){
        return this.prisma.task.findMany({
            where: {userId: userId},
        });
    }

    async getOneTask(id: number, userId){
        let task = await this.prisma.task.findUnique({
            where: {
                id: id,
                userId: userId
            },
        })
        if(!task) throw new NotFoundException(`The task with ID ${id} is not available`)
        return task;
    }

    async createTask(data: any, userId){
        return this.prisma.task.create({
            data: {
            title: data.title,
            description: data.description,
            userId: userId
        }
        });
    }
    async updateTask(id: number, data: any, userId){
        let task = await this.prisma.task.findUnique({
            where: {id: id,
                userId: userId
            },
        })
        if (!task) throw new NotFoundException(`The task with ID ${id} is not found`); 
        
        return this.prisma.task.update({
            where: {id: task.id},
            data: {
                title: data.title,
                description: data.description,
                status: data.status
            },
        });

    }
    async deleteTask(id: number, userId) {
        const task = await this.prisma.task.findFirst({
            where: {id: id, 
                userId: userId
            },
        });
        if(!task) throw new NotFoundException(`The task does not exist`);

        return this.prisma.task.delete({
            where: {id: task.id}
        })
    }
}