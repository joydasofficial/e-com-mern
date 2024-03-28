export interface CreateUserReqBody {
    _id: string;
    name: string;
    email: string;
    dob: Date;
    gender: "male" | "female";
    photo: string;
    role?: "admin" | "user";
    age?: number; 
    createdAt?: Date;
    updatedAt?: Date;
}