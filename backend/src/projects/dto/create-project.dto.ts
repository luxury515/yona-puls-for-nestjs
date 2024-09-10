import { IsString, IsNotEmpty, IsEnum, IsBoolean, IsOptional } from 'class-validator';

enum PublicScope {
  PUBLIC = 'PUBLIC',
  PRIVATE = 'PRIVATE'
}

enum VcsType {
  GIT = 'Git',
  SUBVERSION = 'Subversion'
}

export class CreateProjectDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsEnum(PublicScope)
  publicScope: PublicScope;

  @IsEnum(VcsType)
  vcsType: VcsType;

  @IsBoolean()
  @IsOptional()
  code?: boolean;

  @IsBoolean()
  @IsOptional()
  issue?: boolean;

  @IsBoolean()
  @IsOptional()
  pullRequest?: boolean;

  @IsBoolean()
  @IsOptional()
  review?: boolean;

  @IsBoolean()
  @IsOptional()
  milestone?: boolean;

  @IsBoolean()
  @IsOptional()
  board?: boolean;
}

// UpdateProjectDto를 별도로 정의하지 않고 CreateProjectDto를 그대로 사용
export { CreateProjectDto as UpdateProjectDto };