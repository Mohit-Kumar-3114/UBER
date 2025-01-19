const {z} = require("zod")

const registerSchema = z.object({
    email: z.string().email("Invalid Email"),
    name:  z.string().min(3, "First name must be at least 3 characters long"),
    password: z.string().min(6, "Password must be at least 6 characters long"),
});

const logInSchema = z.object({
    email: z.string().email("Invalid Email"),
    password: z.string().min(6, "Password must be at least 6 characters long"),
});

const captainRegisterSchema=z.object({
    name: z.string().min(3, "First name must be at least 3 characters long"),
    email: z.string().email("Invalid email format").min(5, "Email must be at least 5 characters long"),
    password: z.string().min(6, "Password must be at least 6 characters long"),
    //socketId: z.string().optional(),
   // status: z.enum(["active", "inactive"]).default("inactive"),
    vehicle: z.object({
        color: z.string().min(3, "Color must be at least 3 characters long"),
        plate: z.string().min(3, "Plate must be at least 3 characters long"),
        capacity: z.number().min(1, "Capacity must be at least 1"),
        vehicleType: z.enum(["car", "motorcycle", "auto"]),
    }),
    // location: z.object({
    //     ltd: z.number().optional(),
    //     lng: z.number().optional(),
    // })
})
module.exports={registerSchema , logInSchema, captainRegisterSchema}