import 'bootstrap/dist/css/bootstrap.min.css';
import { useMemo, useState } from 'react';
import { Alert, Badge, Button, Card, Col, Form, ListGroup, ProgressBar, Row, Table } from 'react-bootstrap';
import Swal from 'sweetalert2';
import { Bar, BarChart, Cell, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

const patientsSeed = [
    { id: 1, nom: 'Amira', prenom: 'Saidi', age: 34, risk: 'Moyen', lastVisit: '2026-04-20', status: 'Suivi actif' },
    { id: 2, nom: 'Youssef', prenom: 'Ben Ali', age: 46, risk: 'Élevé', lastVisit: '2026-04-18', status: 'RDV requis' },
    { id: 3, nom: 'Nour', prenom: 'Trabelsi', age: 29, risk: 'Faible', lastVisit: '2026-04-25', status: 'Stable' },
    { id: 4, nom: 'Sarra', prenom: 'Khelifi', age: 51, risk: 'Moyen', lastVisit: '2026-04-12', status: 'Traitement en cours' },
];

const consultationTrend = [
    { day: 'Lun', visites: 8, messages: 12, prescriptions: 5 },
    { day: 'Mar', visites: 10, messages: 9, prescriptions: 6 },
    { day: 'Mer', visites: 12, messages: 14, prescriptions: 7 },
    { day: 'Jeu', visites: 9, messages: 8, prescriptions: 4 },
    { day: 'Ven', visites: 14, messages: 16, prescriptions: 9 },
    { day: 'Sam', visites: 7, messages: 5, prescriptions: 3 },
];

const pathologySplit = [
    { name: 'Cardio', value: 35, color: '#0d6efd' },
    { name: 'Diabète', value: 28, color: '#dc3545' },
    { name: 'Respiratoire', value: 18, color: '#198754' },
    { name: 'Autres', value: 19, color: '#6c757d' },
];

function StatCard({ title, value, text, variant = 'primary' }) {
    return (
        <Card className="shadow-sm border-0 h-100">
            <Card.Body>
                <div className={`text-${variant} fw-semibold small text-uppercase`}>{title}</div>
                <div className="h3 mb-1">{value}</div>
                <div className="text-muted small">{text}</div>
            </Card.Body>
        </Card>
    );
}

export default function EspaceMedecin({ section = 'dashboard' }) {
    const [patients, setPatients] = useState(patientsSeed);
    const [selectedPatientId, setSelectedPatientId] = useState(1);
    const [search, setSearch] = useState('');
    const [prescriptionForm, setPrescriptionForm] = useState({ patient: 'Amira Saidi', medicine: '', dosage: '', duration: '' });
    const [prescriptions, setPrescriptions] = useState([
        { id: 1, patient: 'Amira Saidi', medicine: 'Paracétamol', dosage: '500 mg', duration: '5 jours' },
    ]);
    const [messageForm, setMessageForm] = useState({ patient: 'Amira Saidi', subject: '', body: '' });
    const [messages, setMessages] = useState([
        { id: 1, patient: 'Youssef Ben Ali', subject: 'Rappel de contrôle', status: 'Répondu' },
        { id: 2, patient: 'Sarra Khelifi', subject: 'Résultats biologiques', status: 'En attente' },
    ]);
    const [reportForm, setReportForm] = useState({ period: 'Hebdomadaire', focus: 'Cardio' });

    const selectedPatient = useMemo(() => patients.find((patient) => patient.id === selectedPatientId) || patients[0], [patients, selectedPatientId]);

    const filteredPatients = useMemo(() => {
        const query = search.trim().toLowerCase();
        if (!query) return patients;
        return patients.filter((patient) =>
            `${patient.nom} ${patient.prenom} ${patient.status} ${patient.risk}`.toLowerCase().includes(query),
        );
    }, [patients, search]);

    const dashboardStats = [
        { title: 'Patients suivis', value: patients.length, text: 'Dossiers actifs', variant: 'primary' },
        { title: 'Consultations', value: 42, text: 'Cette semaine', variant: 'success' },
        { title: 'Messages', value: messages.length, text: 'Demandes à traiter', variant: 'warning' },
        { title: 'Ordonnances', value: prescriptions.length, text: 'Émises récemment', variant: 'info' },
    ];

    const patientCards = [
        { title: 'Suivi clinique', value: 'Actif', text: 'Dernier contrôle à jour' },
        { title: 'Dernier rendez-vous', value: selectedPatient.lastVisit, text: selectedPatient.status },
        { title: 'Niveau de risque', value: selectedPatient.risk, text: 'Basé sur les dernières mesures' },
    ];

    const handlePrescriptionSubmit = (event) => {
        event.preventDefault();
        setPrescriptions((current) => [
            { id: Date.now(), patient: prescriptionForm.patient, medicine: prescriptionForm.medicine, dosage: prescriptionForm.dosage, duration: prescriptionForm.duration },
            ...current,
        ]);
        Swal.fire('Ordonnance créée', 'La prescription a été ajoutée.', 'success');
    };

    const handleMessageSubmit = (event) => {
        event.preventDefault();
        setMessages((current) => [
            { id: Date.now(), patient: messageForm.patient, subject: messageForm.subject, status: 'Envoyé' },
            ...current,
        ]);
        Swal.fire('Message envoyé', 'Le patient a reçu un nouveau message.', 'success');
    };

    const handleReportSubmit = (event) => {
        event.preventDefault();
        Swal.fire('Rapport généré', `Rapport ${reportForm.period.toLowerCase()} sur ${reportForm.focus.toLowerCase()} prêt à être exporté.`, 'success');
    };

    const handlePatientUpdate = (patientId, status) => {
        setPatients((current) => current.map((patient) => (patient.id === patientId ? { ...patient, status } : patient)));
        Swal.fire('Statut mis à jour', 'Le dossier du patient a été modifié.', 'success');
    };

    return (
        <div className="d-flex flex-column gap-4">
            <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">
                <div>
                    <h1 className="h3 mb-1">Espace Médecin</h1>
                    <p className="text-muted mb-0">Pilotage des patients, prescriptions et rapports médicaux.</p>
                </div>
                <Badge bg="info" className="p-2">Accès sécurisé médecin</Badge>
            </div>

            {section === 'dashboard' && (
                <>
                    <Row className="g-3">
                        {dashboardStats.map((stat) => (
                            <Col md={6} xl={3} key={stat.title}><StatCard {...stat} /></Col>
                        ))}
                    </Row>

                    <Row className="g-4">
                        <Col lg={8}>
                            <Card className="shadow-sm border-0 h-100">
                                <Card.Body>
                                    <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-3">
                                        <div>
                                            <h2 className="h5 mb-1">Activité médicale de la semaine</h2>
                                            <p className="text-muted mb-0">Consultations, messages et prescriptions.</p>
                                        </div>
                                        <Badge bg="primary">Temps réel</Badge>
                                    </div>
                                    <div style={{ width: '100%', height: 300 }}>
                                        <ResponsiveContainer>
                                            <LineChart data={consultationTrend}>
                                                <XAxis dataKey="day" />
                                                <YAxis />
                                                <Tooltip />
                                                <Line type="monotone" dataKey="visites" stroke="#0d6efd" strokeWidth={3} />
                                                <Line type="monotone" dataKey="messages" stroke="#198754" strokeWidth={3} />
                                                <Line type="monotone" dataKey="prescriptions" stroke="#dc3545" strokeWidth={3} />
                                            </LineChart>
                                        </ResponsiveContainer>
                                    </div>
                                </Card.Body>
                            </Card>
                        </Col>

                        <Col lg={4}>
                            <Card className="shadow-sm border-0 h-100">
                                <Card.Body>
                                    <h2 className="h5 mb-3">Répartition des pathologies</h2>
                                    <div style={{ width: '100%', height: 240 }}>
                                        <ResponsiveContainer>
                                            <PieChart>
                                                <Pie data={pathologySplit} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                                                    {pathologySplit.map((entry) => <Cell key={entry.name} fill={entry.color} />)}
                                                </Pie>
                                                <Tooltip />
                                            </PieChart>
                                        </ResponsiveContainer>
                                    </div>
                                    <ListGroup variant="flush">
                                        {pathologySplit.map((item) => (
                                            <ListGroup.Item key={item.name} className="d-flex justify-content-between align-items-center px-0">
                                                <span>{item.name}</span>
                                                <Badge bg="light" text="dark">{item.value}%</Badge>
                                            </ListGroup.Item>
                                        ))}
                                    </ListGroup>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                </>
            )}

            {section === 'patients' && (
                <Card className="shadow-sm border-0">
                    <Card.Body>
                        <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 mb-3">
                            <div>
                                <h2 className="h5 mb-1">Liste des patients</h2>
                                <p className="text-muted mb-0">Filtrer, suivre et mettre à jour le statut des patients.</p>
                            </div>
                            <Form.Control style={{ maxWidth: 280 }} placeholder="Rechercher un patient" value={search} onChange={(e) => setSearch(e.target.value)} />
                        </div>

                        <Table responsive hover className="align-middle">
                            <thead><tr><th>Nom</th><th>Âge</th><th>Risque</th><th>Dernière visite</th><th>Status</th><th>Action</th></tr></thead>
                            <tbody>
                                {filteredPatients.map((patient) => (
                                    <tr key={patient.id}>
                                        <td>{patient.nom} {patient.prenom}</td>
                                        <td>{patient.age}</td>
                                        <td><Badge bg={patient.risk === 'Élevé' ? 'danger' : patient.risk === 'Moyen' ? 'warning' : 'success'}>{patient.risk}</Badge></td>
                                        <td>{patient.lastVisit}</td>
                                        <td>{patient.status}</td>
                                        <td>
                                            <Button size="sm" variant="outline-primary" className="me-2" onClick={() => setSelectedPatientId(patient.id)}>Ouvrir</Button>
                                            <Button size="sm" variant="outline-secondary" onClick={() => handlePatientUpdate(patient.id, 'Contrôle planifié')}>Planifier</Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </Card.Body>
                </Card>
            )}

            {section === 'dossier' && (
                <Row className="g-4">
                    <Col lg={4}>
                        <Card className="shadow-sm border-0 h-100">
                            <Card.Body>
                                <h2 className="h5 mb-3">Choisir un patient</h2>
                                <ListGroup>
                                    {patients.map((patient) => (
                                        <ListGroup.Item key={patient.id} action active={patient.id === selectedPatient.id} onClick={() => setSelectedPatientId(patient.id)}>
                                            <div className="fw-semibold">{patient.nom} {patient.prenom}</div>
                                            <small>{patient.risk} - {patient.status}</small>
                                        </ListGroup.Item>
                                    ))}
                                </ListGroup>
                            </Card.Body>
                        </Card>
                    </Col>

                    <Col lg={8}>
                        <Row className="g-3 mb-3">
                            {patientCards.map((card) => (
                                <Col md={4} key={card.title}><StatCard {...card} /></Col>
                            ))}
                        </Row>
                        <Card className="shadow-sm border-0 mb-3">
                            <Card.Body>
                                <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">
                                    <div>
                                        <h2 className="h5 mb-1">Dossier de {selectedPatient.nom} {selectedPatient.prenom}</h2>
                                        <p className="text-muted mb-0">Synthèse clinique et évolution récente.</p>
                                    </div>
                                    <Badge bg={selectedPatient.risk === 'Élevé' ? 'danger' : selectedPatient.risk === 'Moyen' ? 'warning' : 'success'}>{selectedPatient.risk}</Badge>
                                </div>
                                <Row className="g-3 mt-2">
                                    <Col md={6}><Alert variant="light">Dernier contrôle: {selectedPatient.lastVisit}</Alert></Col>
                                    <Col md={6}><Alert variant="info">Statut actuel: {selectedPatient.status}</Alert></Col>
                                </Row>
                                <ProgressBar now={selectedPatient.risk === 'Élevé' ? 85 : selectedPatient.risk === 'Moyen' ? 58 : 22} label="Indice de suivi" />
                            </Card.Body>
                        </Card>
                        <Card className="shadow-sm border-0">
                            <Card.Body>
                                <h6>Plan d'action</h6>
                                <Row className="g-3">
                                    <Col md={4}><Button className="w-100" variant="outline-primary">Consulter historique</Button></Col>
                                    <Col md={4}><Button className="w-100" variant="outline-success">Planifier contrôle</Button></Col>
                                    <Col md={4}><Button className="w-100" variant="outline-warning">Alerter patient</Button></Col>
                                </Row>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            )}

            {section === 'prescriptions' && (
                <Row className="g-4">
                    <Col lg={5}>
                        <Card className="shadow-sm border-0 h-100">
                            <Card.Body>
                                <h2 className="h5 mb-3">Créer une prescription</h2>
                                <Form onSubmit={handlePrescriptionSubmit}>
                                    <Form.Select className="mb-3" value={prescriptionForm.patient} onChange={(e) => setPrescriptionForm({ ...prescriptionForm, patient: e.target.value })}>
                                        {patients.map((patient) => <option key={patient.id}>{patient.nom} {patient.prenom}</option>)}
                                    </Form.Select>
                                    <Form.Control className="mb-3" placeholder="Médicament" value={prescriptionForm.medicine} onChange={(e) => setPrescriptionForm({ ...prescriptionForm, medicine: e.target.value })} />
                                    <Row className="g-2 mb-3">
                                        <Col md={6}><Form.Control placeholder="Dosage" value={prescriptionForm.dosage} onChange={(e) => setPrescriptionForm({ ...prescriptionForm, dosage: e.target.value })} /></Col>
                                        <Col md={6}><Form.Control placeholder="Durée" value={prescriptionForm.duration} onChange={(e) => setPrescriptionForm({ ...prescriptionForm, duration: e.target.value })} /></Col>
                                    </Row>
                                    <Button type="submit" className="w-100">Valider la prescription</Button>
                                </Form>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col lg={7}>
                        <Card className="shadow-sm border-0 h-100">
                            <Card.Body>
                                <h2 className="h5 mb-3">Ordonnances récentes</h2>
                                <Table responsive hover>
                                    <thead><tr><th>Patient</th><th>Médicament</th><th>Dosage</th><th>Durée</th></tr></thead>
                                    <tbody>
                                        {prescriptions.map((item) => (
                                            <tr key={item.id}><td>{item.patient}</td><td>{item.medicine}</td><td>{item.dosage}</td><td>{item.duration}</td></tr>
                                        ))}
                                    </tbody>
                                </Table>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            )}

            {section === 'communication' && (
                <Row className="g-4">
                    <Col lg={5}>
                        <Card className="shadow-sm border-0 h-100">
                            <Card.Body>
                                <h2 className="h5 mb-3">Envoyer un message</h2>
                                <Form onSubmit={handleMessageSubmit}>
                                    <Form.Select className="mb-3" value={messageForm.patient} onChange={(e) => setMessageForm({ ...messageForm, patient: e.target.value })}>
                                        {patients.map((patient) => <option key={patient.id}>{patient.nom} {patient.prenom}</option>)}
                                    </Form.Select>
                                    <Form.Control className="mb-3" placeholder="Objet" value={messageForm.subject} onChange={(e) => setMessageForm({ ...messageForm, subject: e.target.value })} />
                                    <Form.Control as="textarea" rows={6} className="mb-3" placeholder="Contenu du message" value={messageForm.body} onChange={(e) => setMessageForm({ ...messageForm, body: e.target.value })} />
                                    <Button type="submit" className="w-100">Envoyer</Button>
                                </Form>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col lg={7}>
                        <Card className="shadow-sm border-0 h-100">
                            <Card.Body>
                                <h2 className="h5 mb-3">Messagerie patients</h2>
                                <ListGroup>
                                    {messages.map((message) => (
                                        <ListGroup.Item key={message.id} className="d-flex justify-content-between align-items-start">
                                            <div>
                                                <div className="fw-semibold">{message.patient}</div>
                                                <small>{message.subject}</small>
                                            </div>
                                            <Badge bg={message.status === 'Répondu' ? 'success' : message.status === 'Envoyé' ? 'info' : 'warning'}>{message.status}</Badge>
                                        </ListGroup.Item>
                                    ))}
                                </ListGroup>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            )}

            {section === 'rapports' && (
                <Row className="g-4">
                    <Col lg={4}>
                        <Card className="shadow-sm border-0 h-100">
                            <Card.Body>
                                <h2 className="h5 mb-3">Générer un rapport</h2>
                                <Form onSubmit={handleReportSubmit}>
                                    <Form.Label>Période</Form.Label>
                                    <Form.Select className="mb-3" value={reportForm.period} onChange={(e) => setReportForm({ ...reportForm, period: e.target.value })}>
                                        <option>Hebdomadaire</option><option>Mensuel</option><option>Trimestriel</option>
                                    </Form.Select>
                                    <Form.Label>Focus</Form.Label>
                                    <Form.Select className="mb-3" value={reportForm.focus} onChange={(e) => setReportForm({ ...reportForm, focus: e.target.value })}>
                                        <option>Cardio</option><option>Diabète</option><option>Respiratoire</option>
                                    </Form.Select>
                                    <Button type="submit" className="w-100">Générer le rapport</Button>
                                </Form>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col lg={8}>
                        <Row className="g-3 mb-3">
                            <Col md={6}>
                                <Card className="shadow-sm border-0 h-100"><Card.Body><h6>Export</h6><p className="text-muted">PDF, CSV et envoi automatique par messagerie sécurisée.</p><Button variant="outline-primary">Exporter le rapport</Button></Card.Body></Card>
                            </Col>
                            <Col md={6}>
                                <Card className="shadow-sm border-0 h-100"><Card.Body><h6>Suivi synthétique</h6><p className="text-muted">Synthèse des consultations, prescriptions et recommandations.</p><Button variant="outline-success">Partager avec le patient</Button></Card.Body></Card>
                            </Col>
                        </Row>
                        <Card className="shadow-sm border-0">
                            <Card.Body>
                                <h6>Activité hebdomadaire</h6>
                                <div style={{ width: '100%', height: 240 }}>
                                    <ResponsiveContainer>
                                        <BarChart data={consultationTrend}>
                                            <XAxis dataKey="day" />
                                            <YAxis />
                                            <Tooltip />
                                            <Bar dataKey="visites" fill="#0d6efd" radius={[6, 6, 0, 0]} />
                                            <Bar dataKey="prescriptions" fill="#198754" radius={[6, 6, 0, 0]} />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            )}
        </div>
    );
}