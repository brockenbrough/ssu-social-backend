const z = require('zod')

//validates when new user creates an account
const newUserValidation = data => {
  const registerValidationSchema = z.object({
    username : z.string().min(6, 'Invalid Username. Username must be 6 characters or more'),
    email: z.string().email('Invalid Email. Please Input a valid email'),
    password: z.string().min(8, 'Invalid Password. Password must be 8 or more characters').trim(),
    });
  
  return registerValidationSchema.safeParse(data)
};

//validate user request when logging in
const userLoginValidation = data => {
  const loginValidationSchema = z.object({
    username : z.string().min(6, 'Username must be 6 characters or more'),
    password: z.string().min(8, 'Password must be 8 or more characters').trim(),
  });
  return loginValidationSchema.safeParse(data)
};

const signup = async (req, res) => {
  // Extract the data from the request
  const { username, email, password } = req.body;

  // Validate the input
  const { error } = validateSignup(req.body);

  // If validation fails, return the error message
  if (error) return res.status(400).json({ errorType: error.details[0].message });

  // Continue with your user registration logic (e.g., saving to the database)
  try {
    // User creation logic...
    res.status(201).json({ message: "User created successfully" });
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
};
module.exports.newUserValidation = newUserValidation;
module.exports.userLoginValidation = userLoginValidation;