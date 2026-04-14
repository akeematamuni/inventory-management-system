import { IsEmail, IsStrongPassword } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class LoginDto {
    @ApiProperty({ example: 'example@example.com' })
    @IsEmail()
    email!: string;

    @ApiProperty()
    @IsStrongPassword()
    password!: string;
}
