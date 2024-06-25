export type User = {
    username: string,
    password: string,
    role: string,
    token: string,
    profile: string,
    resetToken: string,
    resetTokenExpiration: number
}