export function setupHomePage() {
  const container = document.getElementById('container');

  if (!container) {
    console.warn('No se encontró el contenedor principal');
    return;
  }

  const action = container.dataset.action; // 'clinic', 'services', etc.
  console.log('Data-action actual:', action);

  if (action === 'clinic') {
    renderClinicSections(container);
  }
}

// Función principal que renderiza todas las secciones de la clínica
function renderClinicSections(container) {
  renderServices(container);
  renderSpecialties(container);
  renderStudies(container);
  renderSchedule(container);
  renderAppointments(container);
  renderMedicalHistory(container);
  renderResults(container);
}

// Sección de Servicios Médicos
function renderServices(container) {
  const section = document.createElement('section');
  section.className = 'services';
  section.innerHTML = `
    <h2>Servicios Médicos</h2>
    <p>Consulta los servicios médicos que ofrecemos en la clínica Gran Potosí.</p>
    <ul>
      <li>Consulta General <button data-info="Consulta general con médicos especializados.">Ver más</button></li>
      <li>Urgencias <button data-info="Atención de emergencias médicas 24/7.">Ver más</button></li>
      <li>Cirugías <button data-info="Realizamos cirugías ambulatorias y de mayor complejidad.">Ver más</button></li>
    </ul>
  `;
  container.appendChild(section);

  section.querySelectorAll('button[data-info]').forEach((btn) => {
    btn.addEventListener('click', () => {
      openModal(btn.dataset.info);
    });
  });
}

// Sección de Especialidades Médicas
function renderSpecialties(container) {
  const section = document.createElement('section');
  section.className = 'specialties';
  section.innerHTML = `
    <h2>Especialidades Médicas</h2>
    <ul>
      <li>Cardiología</li>
      <li>Dermatología</li>
      <li>Neurología</li>
      <li>Pediatría</li>
    </ul>
  `;
  container.appendChild(section);
}

// Sección de Estudios Complementarios
function renderStudies(container) {
  const section = document.createElement('section');
  section.className = 'studies';
  section.innerHTML = `
    <h2>Estudios Complementarios</h2>
    <p>Realizamos estudios y análisis para diagnóstico preciso:</p>
    <ul>
      <li>Radiografías</li>
      <li>Análisis de sangre</li>
      <li>Ultrasonidos</li>
    </ul>
  `;
  container.appendChild(section);
}

// Sección de Horarios de Atención
function renderSchedule(container) {
  const section = document.createElement('section');
  section.className = 'schedule';
  section.innerHTML = `
    <h2>Horarios de Atención</h2>
    <p>Lunes a Viernes: 8:00 AM - 6:00 PM</p>
    <p>Sábados: 8:00 AM - 2:00 PM</p>
  `;
  container.appendChild(section);
}

// Sección de Citas Médicas
function renderAppointments(container) {
  const section = document.createElement('section');
  section.className = 'appointments';
  section.innerHTML = `
    <h2>Solicitud de Cita Médica</h2>
    <form id="appointment-form">
      <label for="patient-name">Nombre del paciente:</label>
      <input type="text" id="patient-name" required />
      
      <label for="appointment-date">Fecha de la cita:</label>
      <input type="date" id="appointment-date" required />
      
      <button type="submit">Solicitar Cita</button>
    </form>
  `;
  container.appendChild(section);

  // Lógica para el formulario de citas
  const form = section.querySelector('#appointment-form');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const patientName = document.getElementById('patient-name').value;
    const appointmentDate = document.getElementById('appointment-date').value;
    openModal(
      `Cita médica solicitada para ${patientName} el ${appointmentDate}`
    );
  });
}

// Sección de Historia Clínica
function renderMedicalHistory(container) {
  const section = document.createElement('section');
  section.className = 'medical-history';
  section.innerHTML = `
    <h2>Consulta de Historia Clínica</h2>
    <p>Ingresa tus datos para consultar tu historial médico.</p>
    <button id="btn-history">Ver Historia Clínica</button>
  `;
  container.appendChild(section);

  document.getElementById('btn-history')?.addEventListener('click', () => {
    openModal('Mostrando historial médico...');
  });
}

// Sección de Resultados Médicos
function renderResults(container) {
  const section = document.createElement('section');
  section.className = 'results';
  section.innerHTML = `
    <h2>Resultados Médicos</h2>
    <p>Consulta los resultados de tus exámenes médicos.</p>
    <button id="btn-results">Ver Resultados</button>
  `;
  container.appendChild(section);

  document.getElementById('btn-results')?.addEventListener('click', () => {
    openModal('Mostrando resultados médicos...');
  });
}

// Modal básico reutilizable
function openModal(message) {
  let modal = document.getElementById('simple-modal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'simple-modal';
    modal.style.cssText = `
      position: fixed;
      top: 30%;
      left: 50%;
      transform: translate(-50%, -30%);
      background: white;
      padding: 1rem;
      border: 1px solid #ccc;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
      z-index: 1000;
    `;

    modal.innerHTML = `
      <div id="modal-content"></div>
      <button id="modal-close">Cerrar</button>
    `;
    document.body.appendChild(modal);

    modal.querySelector('#modal-close').addEventListener('click', () => {
      modal.style.display = 'none';
    });
  }

  modal.querySelector('#modal-content').textContent = message;
  modal.style.display = 'block';
}
