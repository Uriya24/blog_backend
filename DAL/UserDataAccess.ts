import pool from '../db';
import User from '../models/User';

export class UserDataAccess {
    async getById(id: string): Promise<User | null> {
        try {
            const query = 'SELECT * FROM users WHERE id = $1';
            const result = await pool.query(query, [id]);

            if (result.rows.length > 0) {
                return result.rows[0] as User;
            } else {
                return null;
            }
        } catch (error) {
            console.error('Error getting user by ID', error);
            throw error;
        }
    }

    async add(user: User): Promise<string> {
        try {
            // Check if the user already exists in the database
            const existingUser = await this.getById(user.id);

            // If the user exists, return an indication that the user was not added
            if (existingUser) {
                return `User ${user.email} already exists`;
            }

            // If the user doesn't exist, proceed to add the user
            const query = 'INSERT INTO users (id, email, name, admin) VALUES ($1, $2, $3, $4) RETURNING id';
            const result = await pool.query(query, [user.id, user.email, user.name, user.admin]);

            return `User ${user.email} created successfully`;
        } catch (error) {
            console.error('Error adding user', error);
            throw error;
        }
    }
}