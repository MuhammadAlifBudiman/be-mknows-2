import { 
  IsOptional, IsString, IsUUID, MaxLength, MinLength, 
} from "class-validator";

export class UpdateUserProfileDto {
  @IsString()
  @IsOptional()
  @MinLength(3)
  @MaxLength(124)
  public full_name: string;

  @IsUUID()
  @IsOptional()
  @MaxLength(36)
  public display_picture: string;
}