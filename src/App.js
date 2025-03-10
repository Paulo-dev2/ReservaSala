import React, { useState, useEffect } from 'react';

function App() {
  const [reservas, setReservas] = useState([]);
  const [nome, setNome] = useState('');
  const [sala, setSala] = useState('');
  const [horario, setHorario] = useState('');
  const [erro, setErro] = useState('');
  const [mostrarModal, setMostrarModal] = useState(false);

  const salasDisponiveis = [
    'Laboratório 1', 'Laboratório 2', 'Laboratório 3', 'Laboratório 4',
    'Laboratório 5', 'Laboratório 6', 'Laboratório 7', 'Laboratório 8',
    'Laboratório 9', 'Laboratório 10'
  ];

  useEffect(() => {
    const reservasSalvas = JSON.parse(localStorage.getItem('reservas')) || [];
    setReservas(reservasSalvas);
  }, []);

  useEffect(() => {
    localStorage.setItem('reservas', JSON.stringify(reservas));
  }, [reservas]);

  const formatarHorario = (horario) => {
    const [hora, minuto] = horario.split(':').map(Number);
    return hora * 60 + minuto;
  };

  const reservar = () => {
    if (!nome || !horario || !sala) {
      setErro('Preencha todos os campos.');
      return;
    }

    const regexHorario = /^([01]\d|2[0-3]):([0-5]\d)$/;
    if (!regexHorario.test(horario)) {
      setErro('Formato de horário inválido. Use HH:MM.');
      return;
    }

    const novoHorarioMin = formatarHorario(horario);
    const horarioOcupado = reservas.some((reserva) => {
      const reservaHorarioMin = formatarHorario(reserva.horario);
      return (
        reserva.sala === sala &&
        Math.abs(novoHorarioMin - reservaHorarioMin) < 60
      );
    });

    if (horarioOcupado) {
      setErro('Este horário está muito próximo de uma reserva existente.');
      return;
    }

    const novaReserva = {
      id: new Date().getTime(),
      nome,
      horario,
      sala,
    };

    setReservas([...reservas, novaReserva]);
    setNome('');
    setSala('');
    setHorario('');
    setErro('');
    setMostrarModal(false);
  };

  const cancelar = (id) => {
    if (window.confirm('Tem certeza que deseja cancelar esta reserva?')) {
      setReservas(reservas.filter((reserva) => reserva.id !== id));
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Reserva de Sala de Estudo</h1>
      <button onClick={() => setMostrarModal(true)}>Nova Reserva</button>

      {mostrarModal && (
        <div
          style={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            backgroundColor: 'white',
            padding: '20px',
            borderRadius: '8px',
            boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)',
          }}
        >
          <h2>Nova Reserva</h2>
          <input
            placeholder="Nome"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            style={{ marginRight: '10px' }}
          />
          <input
            type="time"
            value={horario}
            onChange={(e) => setHorario(e.target.value)}
            style={{ marginRight: '10px' }}
          />
          <select
            value={sala}
            onChange={(e) => setSala(e.target.value)}
            style={{ marginRight: '10px' }}
          >
            <option value="">Selecione uma sala</option>
            {salasDisponiveis.map((sala) => (
              <option key={sala} value={sala}>
                {sala}
              </option>
            ))}
          </select>
          <button onClick={reservar}>Reservar</button>
          <button onClick={() => setMostrarModal(false)} style={{ marginLeft: '10px' }}>
            Cancelar
          </button>
          {erro && <p style={{ color: 'red' }}>{erro}</p>}
        </div>
      )}

      <h2>Agenda</h2>
      <ul>
        {reservas.map((reserva) => (
          <li key={reserva.id} style={{ marginBottom: '10px' }}>
            <strong>{reserva.nome}</strong> - {reserva.horario} - Sala {reserva.sala}
            <button onClick={() => cancelar(reserva.id)} style={{ marginLeft: '10px', color: 'red' }}>
              Cancelar
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
