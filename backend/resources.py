from flask import Flask, request, jsonify
from flask_restful import Api, Resource
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from models import db, User, Appointment
from datetime import datetime

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///agenda.db'
app.config['JWT_SECRET_KEY'] = 'super-secret'  # Troque por uma chave segura em produção
db.init_app(app)
jwt = JWTManager(app)
api = Api(app)

class UserRegistration(Resource):
    def post(self):
        data = request.get_json()
        if not data or 'username' not in data or 'password' not in data:
            return {'message': 'Dados inválidos'}, 400
        if User.query.filter_by(username=data['username']).first():
            return {'message': 'Usuário já existe'}, 400
        new_user = User(username=data['username'], password=data['password'])  # Em produção, use hash para senhas
        db.session.add(new_user)
        db.session.commit()
        return {'message': 'Usuário criado com sucesso'}, 201

class UserLogin(Resource):
    def post(self):
        data = request.get_json()
        if not data or 'username' not in data or 'password' not in data:
            return {'message': 'Dados inválidos'}, 400
        user = User.query.filter_by(username=data['username'], password=data['password']).first()
        if user:
            access_token = create_access_token(identity=user.id)
            return {'access_token': access_token}, 200
        return {'message': 'Credenciais inválidas'}, 401

class AppointmentResource(Resource):
    @jwt_required()
    def post(self):
        user_id = get_jwt_identity()
        data = request.get_json()
        if not data or 'title' not in data or 'start_time' not in data or 'end_time' not in data or 'name' not in data or 'cpf' not in data or 'phone' not in data:
            return {'message': 'Dados inválidos'}, 400
        try:
            start_time = datetime.fromisoformat(data['start_time'])
            end_time = datetime.fromisoformat(data['end_time'])
        except ValueError:
            return {'message': 'Formato de data inválido'}, 400
        new_appointment = Appointment(
            title=data['title'],
            start_time=start_time,
            end_time=end_time,
            user_id=user_id,
            name=data['name'],
            cpf=data['cpf'],
            phone=data['phone']
        )
        db.session.add(new_appointment)
        db.session.commit()
        return {'message': 'Agendamento criado com sucesso'}, 201

api.add_resource(UserRegistration, '/register')
api.add_resource(UserLogin, '/login')
api.add_resource(AppointmentResource, '/appointments')