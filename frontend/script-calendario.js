document.addEventListener('DOMContentLoaded', () => {
    const calendar = document.getElementById('calendar');
    const timeSlots = document.getElementById('time-slots');
    const formContainer = document.getElementById('form-container');
    const timesDiv = document.getElementById('times');
    const appointmentForm = document.getElementById('appointment-form');
    const loginButton = document.getElementById('login-button');
    const registerButton = document.getElementById('register-button');
    const loginModal = document.getElementById('login-modal');
    const registerModal = document.getElementById('register-modal');
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const closeButtons = document.querySelectorAll('.close');
    const switchToRegister = document.getElementById('switch-to-register');
    const switchToLogin = document.getElementById('switch-to-login');

    let currentUser = null;

    // Gerar dias do mês (exemplo)
    for (let i = 1; i <= 31; i++) {
        const day = document.createElement('div');
        day.classList.add('day');
        day.textContent = i;
        day.addEventListener('click', () => showTimeSlots(i));
        calendar.appendChild(day);
    }

    // Botão de Login
    loginButton.addEventListener('click', () => {
        loginModal.classList.add('active');
        registerModal.classList.remove('active');
    });

    // Botão de Registro
    registerButton.addEventListener('click', () => {
        registerModal.classList.add('active');
        loginModal.classList.remove('active');
    });

    // Fechar modais
    closeButtons.forEach(button => {
        button.addEventListener('click', () => {
            loginModal.classList.remove('active');
            registerModal.classList.remove('active');
        });
    });

    // Alternar para a tela de registro
    switchToRegister.addEventListener('click', (e) => {
        e.preventDefault();
        loginModal.classList.remove('active');
        registerModal.classList.add('active');
    });

    // Alternar para a tela de login
    switchToLogin.addEventListener('click', (e) => {
        e.preventDefault();
        registerModal.classList.remove('active');
        loginModal.classList.add('active');
    });

    // Login
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        try {
            const response = await fetch('http://localhost:5000/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });
            const data = await response.json();

            if (data.access_token) {
                currentUser = data.access_token;
                showNotification('Login realizado com sucesso!');
                loginModal.classList.remove('active');
            } else {
                showNotification('Credenciais inválidas', 'error');
            }
        } catch (error) {
            console.error('Erro:', error);
            showNotification('Erro ao fazer login', 'error');
        }
    });

    // Registro
    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const username = document.getElementById('reg-username').value;
        const password = document.getElementById('reg-password').value;

        try {
            const response = await fetch('http://localhost:5000/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });
            const data = await response.json();

            if (response.ok) {
                showNotification(data.message);
                registerModal.classList.remove('active');
            } else {
                showNotification(data.message || 'Erro ao registrar', 'error');
            }
        } catch (error) {
            console.error('Erro:', error);
            showNotification('Erro ao registrar', 'error');
        }
    });

    // Mostrar notificação
    function showNotification(message, type = 'success') {
        const notification = document.createElement('div');
        notification.classList.add('notification');
        notification.textContent = message;
        if (type === 'error') {
            notification.style.backgroundColor = '#dc3545'; // Vermelho para erros
        } else {
            notification.style.backgroundColor = '#28a745'; // Verde para sucesso
        }
        document.body.appendChild(notification);
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }

    function showTimeSlots(day) {
        timeSlots.classList.remove('hidden');
        formContainer.classList.add('hidden');
        timesDiv.innerHTML = '';

        // Gerar horários (exemplo)
        for (let hour = 9; hour <= 17; hour++) {
            const time = document.createElement('div');
            time.classList.add('time');
            time.textContent = `${hour}:00`;
            time.addEventListener('click', () => showForm(day, hour));
            timesDiv.appendChild(time);
        }
    }

    function showForm(day, hour) {
        formContainer.classList.remove('hidden');
        appointmentForm.onsubmit = (e) => {
            e.preventDefault();
            const name = document.getElementById('name').value;
            const cpf = document.getElementById('cpf').value;
            const phone = document.getElementById('phone').value;

            if (!currentUser) {
                showNotification('Faça login para agendar.', 'error');
                return;
            }

            // Enviar dados para o backend
            fetch('http://localhost:5000/appointments', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${currentUser}`,
                },
                body: JSON.stringify({
                    title: `Agendamento para ${day}/${new Date().getMonth() + 1}`,
                    start_time: `${new Date().getFullYear()}-${new Date().getMonth() + 1}-${day}T${hour}:00:00`,
                    end_time: `${new Date().getFullYear()}-${new Date().getMonth() + 1}-${day}T${hour + 1}:00:00`,
                    user_id: 1, // Substitua pelo ID do usuário logado
                    name: name,
                    cpf: cpf,
                    phone: phone
                }),
            })
            .then(response => response.json())
            .then(data => {
                showNotification(data.message);
                formContainer.classList.add('hidden');
            })
            .catch(error => console.error('Erro:', error));
        };
    }
});
let ul = document.querySelector('nav .ul');

function openMenu(){
    ul.classList.add('open');
}

function closeMenu(){
    ul.classList.remove('open');
}
  