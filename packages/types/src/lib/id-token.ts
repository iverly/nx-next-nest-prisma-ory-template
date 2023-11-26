export interface IdToken {
  exp: number;
  iat: number;
  iss: string;
  jti: string;
  nbf: number;
  session: Session;
  sub: string;
}

export interface Session {
  active: boolean;
  authenticated_at: string;
  authentication_methods: AuthenticationMethod[];
  authenticator_assurance_level: string;
  devices: Device[];
  expires_at: string;
  id: string;
  identity: Identity;
  issued_at: string;
}

export interface Identity {
  created_at: string;
  id: string;
  metadata_public: null;
  recovery_addresses: RecoveryAddress[];
  schema_id: string;
  schema_url: string;
  state: string;
  state_changed_at: string;
  traits: Traits;
  updated_at: string;
  verifiable_addresses: VerifiableAddress[];
}

export interface VerifiableAddress {
  created_at: string;
  id: string;
  status: string;
  updated_at: string;
  value: string;
  verified: boolean;
  verified_at: string;
  via: string;
}

export interface Traits {
  email: string;
  username: string;
}

export interface RecoveryAddress {
  created_at: string;
  id: string;
  updated_at: string;
  value: string;
  via: string;
}

export interface Device {
  id: string;
  ip_address: string;
  location: string;
  user_agent: string;
}

export interface AuthenticationMethod {
  aal: string;
  completed_at: string;
  method: string;
}
