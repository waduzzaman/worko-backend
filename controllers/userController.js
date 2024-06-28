const userService = require('../services/userService');
const UserDTO = require('../dtos/userDto');
const { userSchema } = require('../validators/userValidator');
const { validate } = require('express-validation');

const getAllUsers = async (req, res) => {
    try {
        const users = await userService.getAllUsers();
        res.json(users.map(user => new UserDTO(user)));
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getUserById = async (req, res) => {
    try {
        const user = await userService.getUserById(req.params.userId);
        if (user) {
            res.json(new UserDTO(user));
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const createUser = async (req, res) => {
    try {
        const { error } = userSchema.validate(req.body);
        if (error) {
            return res.status(400).json({ message: error.details[0].message });
        }
        const user = await userService.createUser(req.body);
        res.status(201).json(new UserDTO(user));
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateUser = async (req, res) => {
    try {
        const { error } = userSchema.validate(req.body);
        if (error) {
            return res.status(400).json({ message: error.details[0].message });
        }
        const user = await userService.updateUser(req.params.userId, req.body);
        if (user) {
            res.json(new UserDTO(user));
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const softDeleteUser = async (req, res) => {
    try {
        const user = await userService.softDeleteUser(req.params.userId);
        if (user) {
            res.json({ message: 'User soft deleted' });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getAllUsers,
    getUserById,
    createUser,
    updateUser,
    softDeleteUser
};
