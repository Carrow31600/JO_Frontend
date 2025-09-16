import { useState, useEffect } from "react";
import { Container, Spinner, Alert } from "react-bootstrap";
import { useAuth } from "../Auth/AuthContext";
import EventFilters from "../components/Events/EventsFilters";
import EventList from "../components/Events/EventList";

  //États de la page
function EventsPage() {
  const [events, setEvents] = useState([]);
  const [offers, setOffers] = useState([]);
  const [sports, setSports] = useState([]);
  const [lieux, setLieux] = useState([]);
  const [filters, setFilters] = useState({ lieu: "", sport: "", date: "" });
  const [selections, setSelections] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Hook pour appeler l’API avec token
  const { fetchWithAuth } = useAuth();

  //Chargement des données
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [resEvents, resOffers, resSports, resLieux] = await Promise.all([
          fetchWithAuth(`${import.meta.env.VITE_API_URL}events/`),
          fetchWithAuth(`${import.meta.env.VITE_API_URL}offers/`),
          fetchWithAuth(`${import.meta.env.VITE_API_URL}sports/`),
          fetchWithAuth(`${import.meta.env.VITE_API_URL}lieux/`),
        ]);

        // Vérification des réponses
        if (!resEvents.ok) throw new Error("Erreur chargement événements");
        if (!resOffers.ok) throw new Error("Erreur chargement offres");
        if (!resSports.ok) throw new Error("Erreur chargement sports");
        if (!resLieux.ok) throw new Error("Erreur chargement lieux");

         // Conversion en JSON
        const dataEvents = await resEvents.json();
        const dataOffers = await resOffers.json();
        const dataSports = await resSports.json();
        const dataLieux = await resLieux.json();

         // Mise à jour des états
        setEvents(dataEvents);
        setOffers(dataOffers);
        setSports(dataSports);
        setLieux(dataLieux);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [fetchWithAuth]);

  //Filtrage des événements
  const filteredEvents = events.filter((event) => {
    const sportName = sports.find((s) => s.id === event.sport)?.nom || "";
    const lieuName = lieux.find((l) => l.id === event.lieu)?.nom || "";

    // Application des filtres ("contient" pour sport et lieu, "égal" pour la date)
    return (
      (filters.sport ? sportName.toLowerCase().includes(filters.sport.toLowerCase()) : true) &&
      (filters.lieu ? lieuName.toLowerCase().includes(filters.lieu.toLowerCase()) : true) &&
      (filters.date ? event.date === filters.date : true)
    );
  });

  //Gestion des états de chargement et erreurs
  if (loading) {
    return (
      <Container className="text-center mt-5">
        <Spinner animation="border" />
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="mt-5">
        <Alert variant="danger">{error}</Alert>
      </Container>
    );
  }

   // affichage de la page
  return (
    <Container className="mt-4">
      <h2>Événements</h2>

      {/* filtres */}
      <EventFilters 
        filters={filters}
        setFilters={setFilters}
        sports={sports}
        lieux={lieux}
      />

      {/*liste filtrée des événements */}
      <EventList
        events={filteredEvents}
        offers={offers}
        selections={selections}
        setSelections={setSelections}
        sportsList={sports}
        lieuxList={lieux}
      />
    </Container>
  );
}

export default EventsPage;
