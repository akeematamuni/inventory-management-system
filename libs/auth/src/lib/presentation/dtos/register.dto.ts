import { IsString, IsOptional, IsEmail, IsStrongPassword } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class RegisterDto {
    @ApiProperty()
    @IsOptional()
    @IsString()
    firstName?: string;

    @ApiProperty()
    @IsOptional()
    @IsString()
    lastName?: string;

    @ApiProperty({ example: 'example@example.com' })
    @IsEmail()
    email!: string;

    @ApiProperty()
    @IsStrongPassword()
    password!: string;
}
