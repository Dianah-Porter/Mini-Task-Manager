import { IsEmpty, IsNotEmpty, IsOptional, IsString } from "class-validator"
    
    export class UpdateTaskDto{
        @IsOptional()
        @IsString()
        @IsNotEmpty()
        title?: string;
        
         @IsOptional()
        @IsString()
        @IsNotEmpty()
        description?: string;

        @IsOptional()
        @IsString()
        @IsNotEmpty()
        status?: string;
    }
