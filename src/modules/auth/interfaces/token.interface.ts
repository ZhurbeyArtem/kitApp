import { ApiProperty } from "@nestjs/swagger";

export class TokenResponse {
  @ApiProperty({ description: 'Access token for the user', example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InpodXJiZXlhcnRlbUBnbWFpbC5jb20iLCJpZCI6IjY3N2M0M2FmZmY1NTkxZTM0Y2Y3YzliYiIsImlzQWN0aXZhdGVkIjp0cnVlLCJpYXQiOjE3MzYzMDg2NDYsImV4cCI6MTczNjM5NTA0Nn0.XlVlurvRnIO4DAhzuf8I_MGFAPlyUgfJrpGrEF4MAl4' })
  accessToken: string;

  @ApiProperty({ description: 'Refresh token for the user', example: '20b39c2a-7917-4825-8a84-f1872beaf8a1' })
  refreshToken: string;

  @ApiProperty({ description: 'Expiry date of the access token', example: '2025-01-11T03:57:26.028Z' })
  expiryTokenDate: Date;
}
