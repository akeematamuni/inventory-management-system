import { IsString, IsOptional, IsEmail, IsStrongPassword } from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class RegisterDto {
    @ApiPropertyOptional({ type: String })
    @IsOptional()
    @IsString()
    firstName?: string;

    @ApiPropertyOptional({ type: String })
    @IsOptional()
    @IsString()
    lastName?: string;

    @ApiProperty({ type: String, example: 'example@example.com' })
    @IsEmail()
    email!: string;

    @ApiProperty({ type: String })
    @IsStrongPassword()
    password!: string;
}
