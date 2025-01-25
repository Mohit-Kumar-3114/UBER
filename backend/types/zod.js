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
        vehicleType: z.enum(["car", "moto", "auto"]),
    }),
    // location: z.object({
    //     ltd: z.number().optional(),
    //     lng: z.number().optional(),
    // })
})

const addressSchema = z.string().min(3, "Address cannot be empty");

const distanceTimeSchema = z.object({
    origin: z.string().min(3, "Origin must be at least 3 characters long."),
    destination: z.string().min(3, "Destination must be at least 3 characters long."),
  });


  const createRideSchema = z.object({
    pickup: z.string().min(3, { message: "Invalid pickup address" }),
    destination: z.string().min(3, { message: "Invalid destination address" }),
    vehicleType: z.enum(["car", "moto", "auto"]),
    fare: z.number().positive({ message: "Fare must be a positive number" }),
  });

  const getFareSchema=z.object({
    pickup: z.string().min(3, { message: "Invalid pickup address" }),
    destination: z.string().min(3, { message: "Invalid destination address" }),
  });



module.exports={registerSchema , logInSchema, captainRegisterSchema, 
                addressSchema,distanceTimeSchema,createRideSchema, getFareSchema}