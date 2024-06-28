const express = require( 'express' );
const mongoose = require( 'mongoose' );
const bodyParser = require( 'body-parser' );
const bcrypt = require( 'bcryptjs' );
const jwt = require( 'jsonwebtoken' );
const dotenv = require( 'dotenv' );
const userRoutes = require( './routes/userRoutes' );
const User = require( './models/User' ); // 

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET;

// Middleware
app.use( bodyParser.json() );

// Connect to MongoDB
mongoose.connect( process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
} );
const db = mongoose.connection;
db.on( 'error', console.error.bind( console, 'MongoDB connection error:' ) );
db.once( 'open', () =>
{
    console.log( 'Connected to MongoDB' );
} );

// Authentication middleware
const authenticateJWT = ( req, res, next ) =>
{
    const token = req.headers.authorization?.split( ' ' )[ 1 ];

    if ( token )
    {
        jwt.verify( token, JWT_SECRET, ( err, user ) =>
        {
            if ( err )
            {
                return res.status( 403 ).json( { message: 'Unauthorized' } );
            }
            req.user = user;
            next();
        } );
    } else
    {
        res.status( 401 ).json( { message: 'Unauthorized' } );
    }
};

// Routes
app.use( '/api/worko/user', authenticateJWT, userRoutes );

// API Endpoints
// List users
app.get( '/api/worko/user', async ( req, res ) =>
{
    try
    {
        const users = await User.find();
        res.json( users );
    } catch ( error )
    {
        res.status( 500 ).json( { message: error.message } );
    }
} );

// Get user details
app.get( '/api/worko/user/:userId', async ( req, res ) =>
{
    try
    {
        const userId = req.params.userId;
        const user = await User.findById( userId );
        if ( user )
        {
            res.json( user );
        } else
        {
            res.status( 404 ).json( { message: 'User not found' } );
        }
    } catch ( error )
    {
        res.status( 500 ).json( { message: error.message } );
    }
} );

// Create user
app.post( '/api/worko/user', async ( req, res ) =>
{
    const { email, name, age, city, zipCode } = req.body;
    try
    {
        const newUser = new User( { email, name, age, city, zipCode } );
        await newUser.save();
        res.status( 201 ).json( newUser );
    } catch ( error )
    {
        res.status( 400 ).json( { message: error.message } );
    }
} );

// Update user
app.put( '/api/worko/user/:userId', async ( req, res ) =>
{
    const userId = req.params.userId;
    try
    {
        const updatedUser = await User.findByIdAndUpdate( userId, req.body, {
            new: true,
        } );
        if ( updatedUser )
        {
            res.json( updatedUser );
        } else
        {
            res.status( 404 ).json( { message: 'User not found' } );
        }
    } catch ( error )
    {
        res.status( 400 ).json( { message: error.message } );
    }
} );

// Partially update user
app.patch( '/api/worko/user/:userId', async ( req, res ) =>
{
    const userId = req.params.userId;
    try
    {
        const updatedUser = await User.findByIdAndUpdate( userId, req.body, {
            new: true,
        } );
        if ( updatedUser )
        {
            res.json( updatedUser );
        } else
        {
            res.status( 404 ).json( { message: 'User not found' } );
        }
    } catch ( error )
    {
        res.status( 400 ).json( { message: error.message } );
    }
} );

// Soft delete user
app.delete( '/api/worko/user/:userId', async ( req, res ) =>
{
    const userId = req.params.userId;
    try
    {
        const deletedUser = await User.findByIdAndUpdate(
            userId,
            { deleted: true },
            { new: true }
        );
        if ( deletedUser )
        {
            res.json( { message: 'User deleted successfully' } );
        } else
        {
            res.status( 404 ).json( { message: 'User not found' } );
        }
    } catch ( error )
    {
        res.status( 400 ).json( { message: error.message } );
    }
} );

// Start the server
app.listen( PORT, () =>
{
    console.log( `Server is running on port ${ PORT }` );
} );

// API Endpoints
// GET /api/worko/user - List users
// GET /api/worko/user/:userId - Get user details
// POST /api/worko/user - Create user
// PUT /api/worko/user/:userId - Update user
// PATCH /api/worko/user/:userId - Update user
// DELETE /api/worko/user/:userId - Soft delete user
