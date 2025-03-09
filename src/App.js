import React, { useState, useEffect } from 'react';

function App() {
  const [reservas, setReservas] = useState([]);
  const [nome, setNome] = useState('');
  const [horario, setHorario] = useState('');
  const [sala, setSala] = useState('');
  const [erro, setErro] = useState('');

  // Carrega as reservas do localStorage ao iniciar
  useEffect(() => {
    const reservasSalvas = JSON.parse(localStorage.getItem('reservas')) || [];
    setReservas(reservasSalvas);
  }, []);

  // Salva as reservas no localStorage sempre que houver alteração
  useEffect(() => {
    localStorage.setItem('reservas', JSON.stringify(reservas));
  }, [reservas]);

  // Função para reservar uma sala
  const reservar = () => {
    if (!nome || !horario || !sala) {
      setErro('Preencha todos os campos.');
      return;
    }

    // Verifica se o horário e a sala já estão ocupados
    const horarioOcupado = reservas.some(
      (reserva) => reserva.horario === horario && reserva.sala === sala
    );

    if (horarioOcupado) {
      setErro('Horário e sala já ocupados.');
      return;
    }

    // Adiciona a nova reserva
    const novaReserva = {
      id: new Date().getTime(), // ID único
      nome,
      horario,
      sala,
    };

    setReservas([...reservas, novaReserva]);
    setNome('');
    setHorario('');
    setSala('');
    setErro('');
  };

  // Função para cancelar uma reserva
  const cancelar = (id) => {
    const novasReservas = reservas.filter((reserva) => reserva.id !== id);
    setReservas(novasReservas);
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Reserva de Sala de Estudo</h1>

      {/* Formulário de Reserva */}
      <div>
        <input
          placeholder="Nome"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          style={{ marginRight: '10px' }}
        />
        <input
          placeholder="Horário (ex: 14:00)"
          value={horario}
          onChange={(e) => setHorario(e.target.value)}
          style={{ marginRight: '10px' }}
        />
        <input
          placeholder="Sala"
          value={sala}
          onChange={(e) => setSala(e.target.value)}
          style={{ marginRight: '10px' }}
        />
        <button onClick={reservar}>Reservar</button>
      </div>

      {/* Mensagem de Erro */}
      {erro && <p style={{ color: 'red' }}>{erro}</p>}

      {/* Grade Horária */}
      <h2>Agenda</h2>
      <ul>
        {reservas.map((reserva) => (
          <li key={reserva.id} style={{ marginBottom: '10px' }}>
            <strong>{reserva.nome}</strong> - {reserva.horario} - Sala {reserva.sala}
            <button
              onClick={() => cancelar(reserva.id)}
              style={{ marginLeft: '10px', color: 'red' }}
            >
              Cancelar
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;