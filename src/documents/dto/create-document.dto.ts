import { IsString, IsNotEmpty, IsOptional } from "class-validator";

export class CreateDocumentDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsOptional() // Optional if not required, else make it required
  content: string;

  // We will not directly handle the file in the DTO, it's handled via Multer
  // The file path can be passed through the controller logic (not in DTO)
}
