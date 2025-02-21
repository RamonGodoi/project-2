document.addEventListener('DOMContentLoaded', function() {
    const daysContainer = document.getElementById('days');
    const timeList = document.getElementById('time-list');
    const timesContainer = document.getElementById('times');
    const formAgendamento = document.getElementById('form-agendamento');
    const agendamentoForm = document.getElementById('agendamento-form');
    const prevMonthButton = document.getElementById('prev-month');
    const nextMonthButton = document.getElementById('next-month');
    const monthName = document.getElementById('month-name');
    const year = document.getElementById('year');

    let currentDate = new Date();
    let selectedDay = null;
    let selectedTime = null;

    function renderCalendar() {
        const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
        const lastDay = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
        const daysInMonth = lastDay.getDate();
        const startingDay = firstDay.getDay();

        daysContainer.innerHTML = '';

        for (let i = 0; i < startingDay; i++) {
            daysContainer.innerHTML += `<div class="day empty"></div>`;
        }

        for (let i = 1; i <= daysInMonth; i++) {
            daysContainer.innerHTML += `<div class="day" data-day="${i}">${i}</div>`;
        }

        monthName.textContent = currentDate.toLocaleString('pt-BR', { month: 'long' });
        year.textContent = currentDate.getFullYear();
    }

    function showTimes(day) {
        selectedDay = day;
        const times = ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00']; // Exemplo de horários
        timeList.innerHTML = times.map(time => `<li data-time="${time}">${time}</li>`).join('');
        timesContainer.style.display = 'block';
        formAgendamento.style.display = 'none';
    }

    function selectTime(timeElement) {
        document.querySelectorAll('#time-list li').forEach(li => li.classList.remove('selected'));
        timeElement.classList.add('selected');
        selectedTime = timeElement.getAttribute('data-time');
        formAgendamento.style.display = 'block';
    }

    function changeMonth(offset) {
        currentDate.setMonth(currentDate.getMonth() + offset);
        renderCalendar();
    }

    daysContainer.addEventListener('click', function(e) {
        if (e.target.classList.contains('day')) {
            const day = e.target.getAttribute('data-day');
            showTimes(day);
        }
    });

    timeList.addEventListener('click', function(e) {
        if (e.target.tagName === 'LI') {
            selectTime(e.target);
        }
    });

    prevMonthButton.addEventListener('click', () => changeMonth(-1));
    nextMonthButton.addEventListener('click', () => changeMonth(1));

    agendamentoForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const nome = document.getElementById('nome').value;
        const cpf = document.getElementById('cpf').value;
        const telefone = document.getElementById('telefone').value;

        const agendamento = {
            nome,
            cpf,
            telefone,
            data: `${selectedDay}/${currentDate.getMonth() + 1}/${currentDate.getFullYear()}`,
            horario: selectedTime
        };

        fetch('http://localhost:8080/agendar', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(agendamento)
        }).then(response => response.json())
          .then(data => {
              alert('Agendamento realizado com sucesso!');
              formAgendamento.reset();
          })
          .catch(error => console.error('Erro:', error));
    });

    renderCalendar();
});

document.getElementById('submitLogin').addEventListener('click', function() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    fetch('http://localhost:8080/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
    })
    .then(response => response.json())
    .then(data => {
        if (data.tipo === 'ADMIN') {
            alert('Login como Administrador realizado com sucesso!');
            // Redirecionar ou mostrar informações específicas do administrador
        } else if (data.tipo === 'PACIENTE') {
            alert('Login como Paciente realizado com sucesso!');
            // Redirecionar ou mostrar informações específicas do paciente
        } else {
            alert('Email ou senha incorretos!');
        }
    })
    .catch(error => console.error('Erro:', error));
});

document.getElementById('agendamento-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const nome = document.getElementById('nome').value;
    const cpf = document.getElementById('cpf').value;
    const telefone = document.getElementById('telefone').value;

    const agendamento = {
        nome,
        cpf,
        telefone,
        data: `${selectedDay}/${currentDate.getMonth() + 1}/${currentDate.getFullYear()}`,
        horario: selectedTime
    };

    fetch('http://localhost:8080/agendar', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(agendamento)
    }).then(response => response.json())
      .then(data => {
          alert('Agendamento realizado com sucesso!');
          formAgendamento.reset();
      })
      .catch(error => console.error('Erro:', error));
});