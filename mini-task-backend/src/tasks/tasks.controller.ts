
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@ApiTags('Tasks')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get()
  @ApiOperation({ summary: 'Get all tasks belonging to the logged-in user' })
  @ApiResponse({ status: 200, description: 'Tasks retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized: invalid or missing token' })
  getTasks(@Req() request: any) {
    return this.tasksService.getTasks(request.user.userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get one task belonging to the logged-in user' })
  @ApiParam({ name: 'id', type: Number, description: 'Task ID' })
  @ApiResponse({ status: 200, description: 'Task retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized: invalid or missing token' })
  @ApiResponse({ status: 404, description: 'Task not found' })
  getOneTask(
    @Param('id', ParseIntPipe) id: number,
    @Req() request: any,
  ) {
    return this.tasksService.getOneTask(id, request.user.userId);
  }

  @Post()
  @ApiOperation({ summary: 'Create a task for the logged-in user' })
  @ApiResponse({ status: 201, description: 'Task created successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized: invalid or missing token' })
  createTask(@Body() body: CreateTaskDto, @Req() request: any) {
    return this.tasksService.createTask(body, request.user.userId);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a task belonging to the logged-in user' })
  @ApiParam({ name: 'id', type: Number, description: 'Task ID' })
  @ApiResponse({ status: 200, description: 'Task updated successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized: invalid or missing token' })
  @ApiResponse({ status: 404, description: 'Task not found' })
  updateTask(
    @Param('id') id: string,
    @Body() body: UpdateTaskDto,
    @Req() request: any,
  ) {
    return this.tasksService.updateTask(Number(id), body, request.user.userId);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a task belonging to the logged-in user' })
  @ApiParam({ name: 'id', type: Number, description: 'Task ID' })
  @ApiResponse({ status: 200, description: 'Task deleted successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized: invalid or missing token' })
  @ApiResponse({ status: 404, description: 'Task not found' })
  deleteTask(@Param('id') id: string, @Req() request: any) {
    return this.tasksService.deleteTask(Number(id), request.user.userId);
  }
}
