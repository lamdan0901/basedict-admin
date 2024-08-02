type TIdentityData = {
  email: string;
  email_verified: boolean;
  phone_verified: boolean;
  sub: string;
};

type TIdentity = {
  identity_id: string;
  id: string;
  user_id: string;
  identity_data: TIdentityData;
};

type TAppMetadata = {
  provider: string;
  providers: string[];
};

type TUserMetadata = {
  email: string;
  email_verified: boolean;
  phone_verified: boolean;
};

export type TUser = {
  id: string;
  aud: string;
  role: string;
  email: string;
  phone: string;
  app_metadata: TAppMetadata;
  user_metadata: TUserMetadata;
  identities: TIdentity[];
  is_anonymous: boolean;
};

export type TAuthBody = {
  access_token: string;
  expires_in: number;
  refresh_token: string;
  expires_at: number;
  user: TUser;
};
