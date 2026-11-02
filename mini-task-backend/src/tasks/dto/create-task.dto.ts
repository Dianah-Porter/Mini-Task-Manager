import { ApiProperty } from "@nestjs/swagger";
import { IsEmpty, IsInt, IsNotEmpty, IsString } from "class-validator"

export class CreateTaskDto{
    @ApiProperty({
        example: "Learn Swagger",
        description: "The title of the task",
    })
    @IsNotEmpty()
    @IsString()
    title!: string | undefined;

    @ApiProperty({
        example: "Document my NestJS API",
        description: "The description of the task",
    })
    @IsNotEmpty()
    @IsString()
    description!: string | undefined;
}