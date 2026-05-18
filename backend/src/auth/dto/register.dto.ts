import { IsString, IsEmail, IsNotEmpty, MinLength, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({ example: '+201001234567' })
  @IsString()
  @IsNotEmpty()
  phoneNumber: string;

  @ApiProperty({ example: 'user@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'Ahmed' })
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @ApiProperty({ example: 'Mohamed' })
  @IsString()
  @IsNotEmpty()
  lastName: string;

  @ApiProperty({ example: 'male', required: false })
  @IsString()
  @IsOptional()
  gender?: string;

  @ApiProperty({ example: '1990-01-15', required: false })
  @IsString()
  @IsOptional()
  dateOfBirth?: string;

  @ApiProperty({ example: 'Egyptian', required: false })
  @IsString()
  @IsOptional()
  nationality1?: string;

  @ApiProperty({ example: 'Egypt', required: false })
  @IsString()
  @IsOptional()
  residenceCountry?: string;

  @ApiProperty({ example: 'Cairo', required: false })
  @IsString()
  @IsOptional()
  city?: string;

  @ApiProperty({ example: 'personal', required: false })
  @IsString()
  @IsOptional()
  accountType?: string;

  @ApiProperty({ example: 'SecurePass123!' })
  @IsString()
  @MinLength(8)
  password: string;
}
