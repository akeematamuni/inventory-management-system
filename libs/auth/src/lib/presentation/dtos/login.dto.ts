import { IsEmail, IsStrongPassword } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class LoginDto {
    @ApiProperty({ type: String, example: 'example@example.com' })
    @IsEmail()
    email!: string;

    @ApiProperty({ type: String })
    @IsStrongPassword()
    password!: string;
}
