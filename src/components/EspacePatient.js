import 'bootstrap/dist/css/bootstrap.min.css';
import { useMemo, useState } from 'react';
import { Accordion, Alert, Badge, Button, Card, Col, Form, ListGroup, ProgressBar, Row, Table } from 'react-bootstrap';
import Swal from 'sweetalert2';
import { Bar, BarChart, Cell, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

const initialGoals = [
  { id: 1, type: 'Pas', target: 10000, period: 'Quotidien', progress: 68 },
  { id: 2, type: 'Sommeil', target: 8, period: 'Quotidien', progress: 75 },
  { id: 3, type: 'Eau', target: 2, period: 'Quotidien', progress: 55 },
];

const healthTrend = [
  { day: 'Lun', heartRate: 72, steps: 6800, temp: 36.7 },
  { day: 'Mar', heartRate: 75, steps: 7400, temp: 36.8 },
  { day: 'Mer', heartRate: 70, steps: 8100, temp: 36.6 },
  { day: 'Jeu', heartRate: 78, steps: 9300, temp: 36.9 },
  { day: 'Ven', heartRate: 74, steps: 10200, temp: 36.7 },
  { day: 'Sam', heartRate: 71, steps: 8800, temp: 36.6 },
  { day: 'Dim', heartRate: 69, steps: 7600, temp: 36.5 },
];

const recentVitals = [
  { label: 'Fréquence cardiaque', value: '74 bpm', status: 'Normal' },
  { label: 'Tension artérielle', value: '12/8', status: 'Stable' },
  { label: 'Température', value: '36.7 °C', status: 'Normal' },
  { label: 'IMC', value: '23.4', status: 'OK' },
];

const initialReminders = [
  { id: 1, title: 'Vitamine D', time: '08:00', frequency: 'Quotidien' },
  { id: 2, title: 'Contrôle glycémie', time: '18:30', frequency: 'Hebdomadaire' },
];

const initialAppointments = [
  { id: 1, doctor: 'Dr. Ben Ali', date: '2026-05-04 10:30', status: 'Confirmé' },
  { id: 2, doctor: 'Dr. Haddad', date: '2026-05-10 15:00', status: 'En attente' },
];

function StatCard({ title, value, text, variant = 'primary' }) {
  return (
    <Card className="shadow-sm h-100 border-0">
      <Card.Body>
        <div className={`text-${variant} fw-semibold small text-uppercase`}>{title}</div>
        <div className="h3 mb-1">{value}</div>
        <div className="text-muted small">{text}</div>
      </Card.Body>
    </Card>
  );
}

export default function EspacePatient({ section = 'dashboard' }) {
  const [vitalForm, setVitalForm] = useState({ heartRate: '', systolic: '', diastolic: '', temperature: '' });
  const [biometricForm, setBiometricForm] = useState({ weight: '', height: '' });
  const [activityForm, setActivityForm] = useState({ steps: '', distance: '', calories: '' });
  const [nutritionForm, setNutritionForm] = useState({ calories: '', quality: 'Bonne' });
  const [pathologyForm, setPathologyForm] = useState({ glycemie: '', oxygen: '' });
  const [syncForm, setSyncForm] = useState({ device: 'Montre connectée', connection: 'Bluetooth' });
  const [goalForm, setGoalForm] = useState({ type: 'Pas', target: '10000', period: 'Quotidien' });
  const [goals, setGoals] = useState(initialGoals);
  const [editingGoalId, setEditingGoalId] = useState(null);
  const [reminderForm, setReminderForm] = useState({ medicine: '', time: '', frequency: 'Quotidien' });
  const [reminders, setReminders] = useState(initialReminders);
  const [appointmentForm, setAppointmentForm] = useState({ doctor: '', date: '', time: '' });
  const [appointments, setAppointments] = useState(initialAppointments);
  const [savedMeasurements, setSavedMeasurements] = useState([
    { id: 1, type: 'Vital', label: 'FC 74 bpm', time: 'Aujourd’hui 08:30' },
    { id: 2, type: 'Bio', label: 'Poids 71 kg / IMC 23.4', time: 'Hier 19:10' },
  ]);
  const [selectedPeriod, setSelectedPeriod] = useState('Semaine');

  const bmi = useMemo(() => {
    const weight = Number(biometricForm.weight);
    const height = Number(biometricForm.height);
    if (!weight || !height) return null;
    return (weight / (height * height)).toFixed(1);
  }, [biometricForm]);

  const bmiStatus = useMemo(() => {
    if (!bmi) return { label: 'Saisir poids et taille', color: 'secondary' };
    const value = Number(bmi);
    if (value < 18.5) return { label: 'Trop faible', color: 'info' };
    if (value < 25) return { label: 'Normal', color: 'success' };
    if (value < 30) return { label: 'Surpoids', color: 'warning' };
    return { label: 'Alerte', color: 'danger' };
  }, [bmi]);

  const goalCompletion = useMemo(() => {
    const values = goals.map((goal) => goal.progress);
    const average = values.length ? Math.round(values.reduce((acc, value) => acc + value, 0) / values.length) : 0;
    return average;
  }, [goals]);

  const nutritionPie = useMemo(() => {
    return [
      { name: 'Bon', value: 82, color: '#198754' },
      { name: 'Moyen', value: 12, color: '#ffc107' },
      { name: 'Faible', value: 6, color: '#dc3545' },
    ];
  }, []);

  const handleVitalSubmit = (event) => {
    event.preventDefault();
    Swal.fire('Enregistré', 'Vos signes vitaux ont été enregistrés.', 'success');
    setSavedMeasurements((current) => [
      { id: Date.now(), type: 'Vital', label: `${vitalForm.heartRate || '--'} bpm / ${vitalForm.systolic || '--'}/${vitalForm.diastolic || '--'} / ${vitalForm.temperature || '--'}°C`, time: 'À l’instant' },
      ...current,
    ]);
  };

  const handleBiometricSubmit = (event) => {
    event.preventDefault();
    Swal.fire('Enregistré', 'Vos données biométriques ont été enregistrées.', 'success');
    setSavedMeasurements((current) => [
      { id: Date.now(), type: 'Bio', label: `Poids ${biometricForm.weight || '--'} kg / IMC ${bmi || '--'}`, time: 'À l’instant' },
      ...current,
    ]);
  };

  const handleActivitySubmit = (event) => {
    event.preventDefault();
    Swal.fire('Enregistré', 'Votre activité physique a été enregistrée.', 'success');
  };

  const handleNutritionSubmit = (event) => {
    event.preventDefault();
    Swal.fire('Enregistré', 'Vos habitudes alimentaires ont été enregistrées.', 'success');
  };

  const handlePathologySubmit = (event) => {
    event.preventDefault();
    Swal.fire('Enregistré', 'Vos données pathologiques ont été enregistrées.', 'success');
  };

  const handleSyncSubmit = (event) => {
    event.preventDefault();
    Swal.fire('Synchronisation réussie', 'Le dispositif connecté a été synchronisé.', 'success');
  };

  const handleGoalSubmit = (event) => {
    event.preventDefault();

    if (editingGoalId) {
      setGoals((current) =>
        current.map((goal) =>
          goal.id === editingGoalId
            ? {
                ...goal,
                type: goalForm.type,
                target: Number(goalForm.target),
                period: goalForm.period,
                progress: goal.progress,
              }
            : goal,
        ),
      );
      setEditingGoalId(null);
      Swal.fire('Modifié', 'L’objectif a été mis à jour.', 'success');
      return;
    }

    setGoals((current) => [
      {
        id: Date.now(),
        type: goalForm.type,
        target: Number(goalForm.target),
        period: goalForm.period,
        progress: 0,
      },
      ...current,
    ]);
    Swal.fire('Créé', 'Votre objectif a été enregistré.', 'success');
  };

  const handleEditGoal = (goal) => {
    setEditingGoalId(goal.id);
    setGoalForm({ type: goal.type, target: goal.target, period: goal.period });
  };

  const handleDeleteGoal = (goalId) => {
    setGoals((current) => current.filter((goal) => goal.id !== goalId));
    Swal.fire('Supprimé', 'L’objectif a été supprimé.', 'info');
  };

  const handleReminderSubmit = (event) => {
    event.preventDefault();
    setReminders((current) => [
      { id: Date.now(), title: reminderForm.medicine, time: reminderForm.time, frequency: reminderForm.frequency },
      ...current,
    ]);
    Swal.fire('Ajouté', 'Le rappel médicament a été créé.', 'success');
  };

  const handleAppointmentSubmit = (event) => {
    event.preventDefault();
    setAppointments((current) => [
      { id: Date.now(), doctor: appointmentForm.doctor, date: `${appointmentForm.date} ${appointmentForm.time}`, status: 'Confirmé' },
      ...current,
    ]);
    Swal.fire('Rendez-vous créé', 'Le rendez-vous a été ajouté au calendrier.', 'success');
  };

  const handleCancelAppointment = (appointmentId) => {
    setAppointments((current) => current.filter((appointment) => appointment.id !== appointmentId));
    Swal.fire('Annulé', 'Le rendez-vous a été annulé.', 'info');
  };

  const recommendationCards = [
    { title: 'Hydratation', text: 'Boire au moins 2 litres d’eau aujourd’hui.', variant: 'info' },
    { title: 'Activité', text: 'Marcher 1500 pas supplémentaires avant ce soir.', variant: 'success' },
    { title: 'Alimentation', text: 'Réduire les calories du dîner de 15%.', variant: 'warning' },
  ];

  const goalProgressData = goals.map((goal) => ({
    name: goal.type,
    value: goal.progress,
  }));

  return (
    <div className="d-flex flex-column gap-4">
      <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">
        <div>
          <h1 className="h3 mb-1">Espace Patient</h1>
          <p className="text-muted mb-0">Suivi des signes vitaux, objectifs et notifications santé.</p>
        </div>
        <div className="d-flex gap-2 flex-wrap">
          <Button variant={selectedPeriod === 'Jour' ? 'primary' : 'outline-primary'} onClick={() => setSelectedPeriod('Jour')}>Jour</Button>
          <Button variant={selectedPeriod === 'Semaine' ? 'primary' : 'outline-primary'} onClick={() => setSelectedPeriod('Semaine')}>Semaine</Button>
          <Button variant={selectedPeriod === 'Mois' ? 'primary' : 'outline-primary'} onClick={() => setSelectedPeriod('Mois')}>Mois</Button>
        </div>
      </div>

      {section === 'dashboard' && (
        <>
          <Row className="g-3">
            <Col md={6} xl={3}><StatCard title="FC moyenne" value="74 bpm" text="Dernières 24h" variant="primary" /></Col>
            <Col md={6} xl={3}><StatCard title="IMC" value={bmi || '23.4'} text={bmiStatus.label} variant={bmiStatus.color} /></Col>
            <Col md={6} xl={3}><StatCard title="Objectifs" value={`${goalCompletion}%`} text="Moyenne d’atteinte" variant="success" /></Col>
            <Col md={6} xl={3}><StatCard title="Alertes" value="2" text="Notifications actives" variant="warning" /></Col>
          </Row>

          <Card className="shadow-sm border-0">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-3">
                <div>
                  <h2 className="h5 mb-1">Vue d’ensemble santé</h2>
                  <p className="text-muted mb-0">Données récentes et évolution des mesures.</p>
                </div>
                <Badge bg="primary">Période: {selectedPeriod}</Badge>
              </div>

              <Row className="g-4 align-items-center">
                <Col lg={8}>
                  <div style={{ width: '100%', height: 300 }}>
                    <ResponsiveContainer>
                      <LineChart data={healthTrend}>
                        <XAxis dataKey="day" />
                        <YAxis />
                        <Tooltip />
                        <Line type="monotone" dataKey="heartRate" stroke="#0d6efd" strokeWidth={3} />
                        <Line type="monotone" dataKey="steps" stroke="#198754" strokeWidth={3} />
                        <Line type="monotone" dataKey="temp" stroke="#dc3545" strokeWidth={3} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </Col>
                <Col lg={4}>
                  <div className="mb-3">
                    <h6>Dernières mesures</h6>
                    <ListGroup>
                      {recentVitals.map((item) => (
                        <ListGroup.Item key={item.label} className="d-flex justify-content-between align-items-center">
                          <div>
                            <div className="fw-semibold">{item.label}</div>
                            <small className="text-muted">{item.status}</small>
                          </div>
                          <Badge bg="light" text="dark">{item.value}</Badge>
                        </ListGroup.Item>
                      ))}
                    </ListGroup>
                  </div>
                  <div>
                    <h6 className="mb-2">Progression globale</h6>
                    <ProgressBar now={goalCompletion} label={`${goalCompletion}%`} />
                  </div>
                </Col>
              </Row>
            </Card.Body>
          </Card>

          <Row className="g-3">
            {recommendationCards.map((card) => (
              <Col md={4} key={card.title}>
                <Card className="h-100 shadow-sm border-0">
                  <Card.Body>
                    <Badge bg={card.variant} className="mb-2">Recommandation</Badge>
                    <Card.Title>{card.title}</Card.Title>
                    <Card.Text>{card.text}</Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </>
      )}

      {section === 'saisie' && (
        <Accordion defaultActiveKey="0" alwaysOpen>
          <Accordion.Item eventKey="0">
            <Accordion.Header>Saisir les signes vitaux</Accordion.Header>
            <Accordion.Body>
              <Form onSubmit={handleVitalSubmit}>
                <Row className="g-3">
                  <Col md={3}><Form.Control type="number" placeholder="Fréquence cardiaque" value={vitalForm.heartRate} onChange={(e) => setVitalForm({ ...vitalForm, heartRate: e.target.value })} /></Col>
                  <Col md={3}><Form.Control type="number" placeholder="Systolique" value={vitalForm.systolic} onChange={(e) => setVitalForm({ ...vitalForm, systolic: e.target.value })} /></Col>
                  <Col md={3}><Form.Control type="number" placeholder="Diastolique" value={vitalForm.diastolic} onChange={(e) => setVitalForm({ ...vitalForm, diastolic: e.target.value })} /></Col>
                  <Col md={3}><Form.Control type="number" step="0.1" placeholder="Température" value={vitalForm.temperature} onChange={(e) => setVitalForm({ ...vitalForm, temperature: e.target.value })} /></Col>
                </Row>
                <div className="mt-3 d-flex gap-2">
                  <Button type="submit">Valider et enregistrer</Button>
                  <Badge bg="success" className="align-self-center">Confirmation automatique à l’enregistrement</Badge>
                </div>
              </Form>
            </Accordion.Body>
          </Accordion.Item>

          <Accordion.Item eventKey="1">
            <Accordion.Header>Saisir les données biométriques</Accordion.Header>
            <Accordion.Body>
              <Form onSubmit={handleBiometricSubmit}>
                <Row className="g-3 align-items-end">
                  <Col md={4}><Form.Label>Poids (kg)</Form.Label><Form.Control type="number" value={biometricForm.weight} onChange={(e) => setBiometricForm({ ...biometricForm, weight: e.target.value })} /></Col>
                  <Col md={4}><Form.Label>Taille (m)</Form.Label><Form.Control type="number" step="0.01" value={biometricForm.height} onChange={(e) => setBiometricForm({ ...biometricForm, height: e.target.value })} /></Col>
                  <Col md={4}>
                    <Card className="bg-light border-0">
                      <Card.Body>
                        <div className="small text-muted">IMC calculé</div>
                        <div className="h4 mb-0">{bmi || '--'}</div>
                      </Card.Body>
                    </Card>
                  </Col>
                </Row>
                <Button type="submit" className="mt-3">Enregistrer les données</Button>
              </Form>
            </Accordion.Body>
          </Accordion.Item>

          <Accordion.Item eventKey="2">
            <Accordion.Header>Saisir l'activité physique</Accordion.Header>
            <Accordion.Body>
              <Form onSubmit={handleActivitySubmit}>
                <Row className="g-3">
                  <Col md={4}><Form.Control type="number" placeholder="Nombre de pas" value={activityForm.steps} onChange={(e) => setActivityForm({ ...activityForm, steps: e.target.value })} /></Col>
                  <Col md={4}><Form.Control type="number" placeholder="Distance parcourue (km)" value={activityForm.distance} onChange={(e) => setActivityForm({ ...activityForm, distance: e.target.value })} /></Col>
                  <Col md={4}><Form.Control type="number" placeholder="Calories brûlées" value={activityForm.calories} onChange={(e) => setActivityForm({ ...activityForm, calories: e.target.value })} /></Col>
                </Row>
                <Button type="submit" className="mt-3">Enregistrer l'activité</Button>
              </Form>
            </Accordion.Body>
          </Accordion.Item>

          <Accordion.Item eventKey="3">
            <Accordion.Header>Saisir les habitudes alimentaires</Accordion.Header>
            <Accordion.Body>
              <Form onSubmit={handleNutritionSubmit}>
                <Row className="g-3">
                  <Col md={6}><Form.Control type="number" placeholder="Calories consommées" value={nutritionForm.calories} onChange={(e) => setNutritionForm({ ...nutritionForm, calories: e.target.value })} /></Col>
                  <Col md={6}><Form.Select value={nutritionForm.quality} onChange={(e) => setNutritionForm({ ...nutritionForm, quality: e.target.value })}><option>Bonne</option><option>Moyenne</option><option>Faible</option></Form.Select></Col>
                </Row>
                <Row className="g-3 mt-2">
                  <Col md={4}><Card className="bg-light border-0"><Card.Body><div className="small text-muted">Bilan quotidien</div><div className="h4 mb-0">{nutritionForm.calories || 0} kcal</div></Card.Body></Card></Col>
                  <Col md={8}><ResponsiveContainer width="100%" height={120}><PieChart><Pie data={nutritionPie} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={45} label>{nutritionPie.map((entry) => <Cell key={entry.name} fill={entry.color} />)}</Pie><Tooltip /></PieChart></ResponsiveContainer></Col>
                </Row>
                <Button type="submit" className="mt-3">Enregistrer la nutrition</Button>
              </Form>
            </Accordion.Body>
          </Accordion.Item>

          <Accordion.Item eventKey="4">
            <Accordion.Header>Saisir les données pathologiques et synchroniser un dispositif</Accordion.Header>
            <Accordion.Body>
              <Row className="g-4">
                <Col lg={6}>
                  <Form onSubmit={handlePathologySubmit}>
                    <h6>Données pathologiques</h6>
                    <Row className="g-3">
                      <Col md={6}><Form.Control type="number" step="0.01" placeholder="Glycémie" value={pathologyForm.glycemie} onChange={(e) => setPathologyForm({ ...pathologyForm, glycemie: e.target.value })} /></Col>
                      <Col md={6}><Form.Control type="number" placeholder="Oxygène (%)" value={pathologyForm.oxygen} onChange={(e) => setPathologyForm({ ...pathologyForm, oxygen: e.target.value })} /></Col>
                    </Row>
                    <div className="mt-3 d-flex gap-2 flex-wrap">
                      <Button type="submit">Enregistrer</Button>
                      {(Number(pathologyForm.glycemie) > 1.26 || Number(pathologyForm.oxygen) < 95) && <Alert variant="danger" className="mb-0 py-2">Alerte: valeur anormale détectée</Alert>}
                    </div>
                  </Form>
                </Col>
                <Col lg={6}>
                  <Form onSubmit={handleSyncSubmit}>
                    <h6>Synchroniser un dispositif connecté</h6>
                    <Row className="g-3">
                      <Col md={6}><Form.Select value={syncForm.device} onChange={(e) => setSyncForm({ ...syncForm, device: e.target.value })}><option>Montre connectée</option><option>Tensiomètre</option><option>Glucomètre</option></Form.Select></Col>
                      <Col md={6}><Form.Select value={syncForm.connection} onChange={(e) => setSyncForm({ ...syncForm, connection: e.target.value })}><option>Bluetooth</option><option>Wi-Fi</option></Form.Select></Col>
                    </Row>
                    <Button type="submit" className="mt-3">Synchroniser le dispositif</Button>
                  </Form>
                </Col>
              </Row>
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>
      )}

      {section === 'objectifs' && (
        <Row className="g-4">
          <Col lg={4}>
            <Card className="shadow-sm border-0 h-100">
              <Card.Body>
                <h2 className="h5">Configurer un objectif de santé</h2>
                <Form onSubmit={handleGoalSubmit}>
                  <Form.Label>Type d'objectif</Form.Label>
                  <Form.Select className="mb-3" value={goalForm.type} onChange={(e) => setGoalForm({ ...goalForm, type: e.target.value })}>
                    <option>Pas</option><option>Sommeil</option><option>Eau</option><option>Calories</option>
                  </Form.Select>
                  <Form.Label>Valeur cible</Form.Label>
                  <Form.Control className="mb-3" type="number" value={goalForm.target} onChange={(e) => setGoalForm({ ...goalForm, target: e.target.value })} />
                  <Form.Label>Période</Form.Label>
                  <Form.Select className="mb-3" value={goalForm.period} onChange={(e) => setGoalForm({ ...goalForm, period: e.target.value })}>
                    <option>Quotidien</option><option>Hebdomadaire</option>
                  </Form.Select>
                  <Button type="submit" className="w-100">{editingGoalId ? 'Modifier l’objectif' : 'Enregistrer l’objectif'}</Button>
                </Form>
              </Card.Body>
            </Card>
          </Col>
          <Col lg={8}>
            <Card className="shadow-sm border-0 mb-3">
              <Card.Body>
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <div>
                    <h2 className="h5 mb-1">Objectifs enregistrés</h2>
                    <p className="text-muted mb-0">Modifier ou supprimer vos objectifs.</p>
                  </div>
                  <Badge bg="success">Progression moyenne {goalCompletion}%</Badge>
                </div>
                <Table responsive hover>
                  <thead><tr><th>Type</th><th>Cible</th><th>Période</th><th>Progression</th><th>Actions</th></tr></thead>
                  <tbody>
                    {goals.map((goal) => (
                      <tr key={goal.id}>
                        <td>{goal.type}</td>
                        <td>{goal.target}</td>
                        <td>{goal.period}</td>
                        <td style={{ width: 180 }}><ProgressBar now={goal.progress} label={`${goal.progress}%`} /></td>
                        <td>
                          <Button size="sm" variant="outline-primary" className="me-2" onClick={() => handleEditGoal(goal)}>Modifier</Button>
                          <Button size="sm" variant="outline-danger" onClick={() => handleDeleteGoal(goal.id)}>Supprimer</Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </Card.Body>
            </Card>
            <Card className="shadow-sm border-0">
              <Card.Body>
                <h6>Progression des objectifs</h6>
                <div style={{ width: '100%', height: 220 }}>
                  <ResponsiveContainer>
                    <BarChart data={goalProgressData}>
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="value" fill="#198754" radius={[6, 6, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}

      {section === 'notifications' && (
        <Row className="g-4">
          <Col lg={4}>
            <Card className="shadow-sm border-0 h-100">
              <Card.Body>
                <h2 className="h5">Recevoir des recommandations</h2>
                {recommendationCards.map((card) => (
                  <Alert variant={card.variant} key={card.title} className="mb-3">
                    <strong>{card.title}:</strong> {card.text}
                  </Alert>
                ))}
                <p className="text-muted mb-0">Les recommandations sont générées à partir des données enregistrées et des objectifs non atteints.</p>
              </Card.Body>
            </Card>
          </Col>

          <Col lg={4}>
            <Card className="shadow-sm border-0 h-100 mb-4">
              <Card.Body>
                <h2 className="h5">Créer un rappel médicament</h2>
                <Form onSubmit={handleReminderSubmit}>
                  <Form.Control className="mb-3" placeholder="Nom du médicament" value={reminderForm.medicine} onChange={(e) => setReminderForm({ ...reminderForm, medicine: e.target.value })} />
                  <Form.Control className="mb-3" type="time" value={reminderForm.time} onChange={(e) => setReminderForm({ ...reminderForm, time: e.target.value })} />
                  <Form.Select className="mb-3" value={reminderForm.frequency} onChange={(e) => setReminderForm({ ...reminderForm, frequency: e.target.value })}>
                    <option>Quotidien</option><option>Hebdomadaire</option>
                  </Form.Select>
                  <Button type="submit" className="w-100">Enregistrer le rappel</Button>
                </Form>
              </Card.Body>
            </Card>
            <Card className="shadow-sm border-0">
              <Card.Body>
                <h6>Rappels programmés</h6>
                <ListGroup>
                  {reminders.map((reminder) => (
                    <ListGroup.Item key={reminder.id} className="d-flex justify-content-between align-items-center">
                      <div>
                        <div className="fw-semibold">{reminder.title}</div>
                        <small className="text-muted">{reminder.frequency}</small>
                      </div>
                      <Badge bg="secondary">{reminder.time}</Badge>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              </Card.Body>
            </Card>
          </Col>

          <Col lg={4}>
            <Card className="shadow-sm border-0 h-100 mb-4">
              <Card.Body>
                <h2 className="h5">Planifier un rendez-vous</h2>
                <Form onSubmit={handleAppointmentSubmit}>
                  <Form.Control className="mb-3" placeholder="Médecin" value={appointmentForm.doctor} onChange={(e) => setAppointmentForm({ ...appointmentForm, doctor: e.target.value })} />
                  <Row className="g-2 mb-3">
                    <Col md={6}><Form.Control type="date" value={appointmentForm.date} onChange={(e) => setAppointmentForm({ ...appointmentForm, date: e.target.value })} /></Col>
                    <Col md={6}><Form.Control type="time" value={appointmentForm.time} onChange={(e) => setAppointmentForm({ ...appointmentForm, time: e.target.value })} /></Col>
                  </Row>
                  <Button type="submit" className="w-100">Confirmer le rendez-vous</Button>
                </Form>
              </Card.Body>
            </Card>
            <Card className="shadow-sm border-0">
              <Card.Body>
                <h6>Agenda</h6>
                <ListGroup>
                  {appointments.map((appointment) => (
                    <ListGroup.Item key={appointment.id}>
                      <div className="d-flex justify-content-between align-items-start">
                        <div>
                          <div className="fw-semibold">{appointment.doctor}</div>
                          <small className="text-muted">{appointment.date}</small>
                          <div><Badge bg={appointment.status === 'Confirmé' ? 'success' : 'warning'}>{appointment.status}</Badge></div>
                        </div>
                        <Button size="sm" variant="outline-danger" onClick={() => handleCancelAppointment(appointment.id)}>Annuler</Button>
                      </div>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}

      <Card className="shadow-sm border-0">
        <Card.Body>
          <h2 className="h5 mb-3">Historique des mesures</h2>
          <Table responsive hover className="mb-0">
            <thead><tr><th>Type</th><th>Détail</th><th>Heure</th></tr></thead>
            <tbody>
              {savedMeasurements.map((entry) => (
                <tr key={entry.id}><td>{entry.type}</td><td>{entry.label}</td><td>{entry.time}</td></tr>
              ))}
            </tbody>
          </Table>
        </Card.Body>
      </Card>
    </div>
  );
}
