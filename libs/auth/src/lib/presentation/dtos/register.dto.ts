import { IsString, IsOptional, IsEmail, IsStrongPassword } from "class-validator";

export class RegisterDto {
    @IsString()
    @IsOptional()
    firstName?: string;

    @IsString()
    @IsOptional()
    lastName?: string;

    @IsEmail()
    email!: string;

    @IsStrongPassword()
    password!: string;
}
