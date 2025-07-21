import express from 'express';
import { isAuthenticated } from '../middleware/auth.js';
import { createAccount } from '../controllers/user.js';

const router = express.Router();

/**
 * @swagger
 * /api/users:
 *   post:
 *     summary: Create a new user account
 *     tags:
 *       - Users
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - first_name
 *               - last_name
 *               - email
 *               - phone_number
 *               - password
 *             properties:
 *               first_name:
 *                 type: string
 *                 description: "* First name of the user"
 *                 example: John
 *               last_name:
 *                 type: string
 *                 description: "* Last name of the user"
 *                 example: Doe
 *               email:
 *                 type: string
 *                 format: email
 *                 description: "* Valid email address"
 *                 example: john.doe@example.com
 *               phone_number:
 *                 type: string
 *                 description: "* Phone number (10-15 digits)"
 *                 example: "0912345678"
 *               password:
 *                 type: string
 *                 description: |
 *                   * Password with:
 *                   - Minimum 8 characters  
 *                   - At least one uppercase letter  
 *                   - At least one lowercase letter  
 *                   - At least one number  
 *                   - At least one special character  
 *                 example: "StrongP@ss1"
 *     responses:
 *       201:
 *         description: User created successfully
 *       400:
 *         description: Validation errors
 *       500:
 *         description: Internal server error
 */

router.post('/users' , createAccount);

// router.get('/user/:id', isAuthenticated, getUserById);
// router.put('/user/:id', isAuthenticated , updateUser);
// router.delete('/user/:id', isAuthenticated, deleteUser);
// router.get('/users', isAuthenticated, getAllUsers);
// router.post('/user/login', loginUser);
// router.post('/user/logout', isAuthenticated , logoutUser); 


export default  router