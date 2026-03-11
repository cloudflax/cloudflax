export interface RegisterRequest {
  name: string
  email: string
  password: string
}

export interface RegisterResponseUser {
  id: string
  name: string
  email: string
  created_at: string
  updated_at: string
}

export interface RegisterResponseMeta {
  email_verification_required: boolean
}

export interface RegisterResponse {
  data: RegisterResponseUser
  meta: RegisterResponseMeta
}

export interface RegisterFormState {
  success: boolean
  message: string
  errors?: {
    name?: string[]
    email?: string[]
    password?: string[]
    confirmPassword?: string[]
  }
}
