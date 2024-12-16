import os
from flask import Flask, jsonify, request
from flask_pymongo import PyMongo
from flask_cors import CORS
from bson import ObjectId
from flask_jwt_extended import JWTManager, jwt_required, create_access_token, create_refresh_token, get_jwt_identity
import datetime
from dotenv import load_dotenv
import bcrypt

# Load environment variables from .env file
load_dotenv()

# Initialize Flask app
app = Flask(__name__)

# Configuration
app.config['MONGO_URI'] = os.getenv('MONGO_URI')  # Mongo URI from .env
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY')  # JWT secret from .env
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = datetime.timedelta(seconds=int(os.getenv('JWT_ACCESS_TOKEN_EXPIRES', 3600)))  # Token expiry time
app.config['JWT_REFRESH_TOKEN_EXPIRES'] = datetime.timedelta(days=30)  # Set refresh token expiry time

# Initialize extensions
mongo = PyMongo(app)
CORS(app, origins=["http://localhost:3000"])  # Allow React frontend on port 3000
jwt = JWTManager(app)

# Database collections
users_db = mongo.db.users  # Referring to 'users' collection
notes_db = mongo.db.notes  # Referring to 'notes' collection

# Default Route
@app.route('/')
def default_route():
    return "Hello! The backend is running."

# User Routes

# Sign-up Route (Create user)
@app.route('/signup', methods=['POST'])
def createUser():
    data = request.json
    if not data.get('email') or not data.get('password'):
        return jsonify({'error': 'Missing required fields (email, password)'}), 400

    # Check if the email is already in use
    if users_db.find_one({'email': data['email']}):
        return jsonify({'error': 'Email already exists'}), 400

    # Hash the password before saving it
    hashed_password = bcrypt.hashpw(data['password'].encode('utf-8'), bcrypt.gensalt())

    user_data = {
        'email': data['email'],
        'password': hashed_password.decode('utf-8')  # Store as a string
    }

    result = users_db.insert_one(user_data)
    return jsonify({'message': 'Signup successful', '_id': str(result.inserted_id)})

# Login Route (Authenticate user)
@app.route('/login', methods=['POST'])
def login():
    data = request.json
    email = data.get('email')
    password = data.get('password')

    # Find the user by email
    user = users_db.find_one({'email': email})
    if not user:
        return jsonify({'error': 'Invalid credentials'}), 401

    # Verify the password
    if not bcrypt.checkpw(password.encode('utf-8'), user['password'].encode('utf-8')):
        return jsonify({'error': 'Invalid credentials'}), 401

    # Create a JWT access token and refresh token
    access_token = create_access_token(identity=str(user['_id']))
    refresh_token = create_refresh_token(identity=str(user['_id']))

    return jsonify({'access_token': access_token, 'refresh_token': refresh_token, 'message': 'Login successful'})

# Refresh Token Route
@app.route('/refresh', methods=['POST'])
@jwt_required(refresh=True)  # Ensure the token is a refresh token
def refresh_token():
    try:
        # Create a new access token using the identity from the refresh token
        current_user = get_jwt_identity()
        new_access_token = create_access_token(identity=current_user)
        return jsonify({'access_token': new_access_token})
    except Exception as e:
        return jsonify({'error': 'Failed to refresh token', 'message': str(e)}), 500

# Notes Routes

# Create a note
@app.route('/api/notes', methods=['POST'])
@jwt_required()
def createNote():
    try:
        data = request.json
        if not data.get('title') or not data.get('content'):
            return jsonify({'error': 'Missing required fields (title, content)'}), 400

        note_data = {
            'title': data['title'],
            'content': data['content'],
            'user_id': get_jwt_identity(),
            'createdAt': datetime.datetime.utcnow()
        }

        result = notes_db.insert_one(note_data)
        return jsonify({'_id': str(result.inserted_id), 'message': 'Note created successfully'})
    except Exception as e:
        return jsonify({'error': 'Failed to create note', 'message': str(e)}), 500

# Get all notes
@app.route('/api/notes', methods=['GET'])
@jwt_required()
def getNotes():
    try:
        user_id = get_jwt_identity()
        notes = []
        for doc in notes_db.find({'user_id': user_id}):
            notes.append({
                '_id': str(doc['_id']),
                'title': doc['title'],
                'content': doc['content'],
                'createdAt': doc['createdAt']
            })
        return jsonify(notes)
    except Exception as e:
        return jsonify({'error': 'Failed to fetch notes', 'message': str(e)}), 500

# Get a single note
@app.route('/api/notes/<id>', methods=['GET'])
@jwt_required()
def getNote(id):
    try:
        user_id = get_jwt_identity()
        note = notes_db.find_one({'_id': ObjectId(id), 'user_id': user_id})
        if not note:
            return jsonify({'error': 'Note not found'}), 404
        return jsonify({
            '_id': str(note['_id']),
            'title': note['title'],
            'content': note['content'],
            'createdAt': note['createdAt']
        })
    except Exception as e:
        return jsonify({'error': 'Failed to fetch note', 'message': str(e)}), 500

# Update a note
@app.route('/api/notes/<id>', methods=['PUT'])
@jwt_required()
def updateNote(id):
    try:
        user_id = get_jwt_identity()
        data = request.json
        if not data.get('title') or not data.get('content'):
            return jsonify({'error': 'Missing required fields (title, content)'}), 400

        result = notes_db.update_one(
            {'_id': ObjectId(id), 'user_id': user_id},
            {"$set": {
                'title': data['title'],
                'content': data['content']
            }}
        )

        if result.matched_count == 0:
            return jsonify({'error': 'Note not found'}), 404

        return jsonify({'message': 'Note updated successfully'})
    except Exception as e:
        return jsonify({'error': 'Failed to update note', 'message': str(e)}), 500

# Delete a note
@app.route('/api/notes/<id>', methods=['DELETE'])
@jwt_required()
def deleteNote(id):
    try:
        user_id = get_jwt_identity()
        result = notes_db.delete_one({'_id': ObjectId(id), 'user_id': user_id})
        if result.deleted_count == 0:
            return jsonify({'error': 'Note not found'}), 404
        return jsonify({'message': 'Note deleted successfully'})
    except Exception as e:
        return jsonify({'error': 'Failed to delete note', 'message': str(e)}), 500

# Run the server
if __name__ == "__main__":
    app.run(debug=True)
