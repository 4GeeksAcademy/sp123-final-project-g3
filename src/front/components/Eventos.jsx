import React, { useState, useEffect } from "react";
import { Box, Typography, Card, CardContent, CardMedia, Button, Modal, TextField, InputLabel, Select, MenuItem, FormControl } from "@mui/material";
import { user } from '../jsApiComponents/user'
import { useNavigate } from "react-router-dom";

export const Eventos = () => {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState("");
  const [sportFilter, setSportFilter] = useState("");


  const navigate = useNavigate()
  const BASE_URL = import.meta.env.VITE_BACKEND_URL;

  const fallbackEvents = [
    { id: 1, name: "Yoga Matutino", description: "Sesión de yoga matutina para empezar el día.", sport: "Yoga", image: "https://cdn.getyourguide.com/image/format=auto,fit=contain,gravity=auto,quality=60,width=1440,height=650,dpr=1/tour_img/724c514c8455afc2a374acfef42807e12740f867305e87421a07c24d39d14a23.jpeg" },
    { id: 2, name: "Carrera Nocturna", description: "Carrera grupal en el parque para todos los niveles.", sport: "Running", image: "https://www.aytolalaguna.es/actualidad/noticias/.galleries/IMAGENES-Noticias/2025/01/CARRERA-NOCTURNA-2024.jpeg" },
    { id: 3, name: "Pilates", description: "Relaja y fortalece tu cuerpo en la tarde.", sport: "Pilates", image: "https://assets.dmagstatic.com/wp-content/uploads/2019/08/tight10of19-677x451.jpg" },
    { id: 4, name: "Spinning Intensivo", description: "Entrenamiento intenso en bicicleta.", sport: "Spinning", image: "https://blogscdn.thehut.net/wp-content/uploads/sites/450/2016/08/09041209/beneficios-spinning-1.jpg" },
    { id: 5, name: "Meditación Guiada", description: "Sesión de meditación guiada para relajarte.", sport: "Meditación", image: "https://www.elpradopsicologos.es/storage/posts/June2021/group-of-young-sporty-people-sitting-in-padmasana-pose.jpg" },
    { id: 6, name: "Entrenamiento Funcional", description: "Mejora fuerza y movilidad con ejercicios funcionales.", sport: "Funcional", image: "https://akroscenter.com/wp-content/uploads/2023/05/Entrenamiento-funcional-Descubre-sus-beneficios.jpg" },
    { id: 7, name: "Caminata Saludable", description: "Caminata grupal al aire libre para mantenerse activo.", sport: "Caminata", image: "https://estaticosgn-cdn.deia.eus/clip/604fa017-9146-4961-b436-f7bb5a2ff949_16-9-discover-aspect-ratio_default_0.jpg" },
    { id: 8, name: "Natación para Todos", description: "Sesión de natación para todos los niveles.", sport: "Natación", image: "https://noticiasncc.com/wp-content/uploads/2024/01/183-6-CIENCIA_Natacio%CC%81n-nin%CC%83os_.jpg" },
  ];

  // eventos from backendu
  const fetchEvents = async () => {
    try {
      const resp = await fetch(`${BASE_URL}/api/activities`);
      if (!resp.ok) throw new Error("Retrieving error");
      const data = await resp.json();
      console.log(data)
      setEvents(data);
      console.log(events)
    } catch (err) {
      console.error(err);
      setEvents([]); // fallback
    }
  };






  useEffect(() => {
    fetchEvents();
    window.addEventListener("activities-updated", fetchEvents);
    return () => window.removeEventListener("activities-updated", fetchEvents);
  }, []);

  const showEventDetails = (event) => {
    console.log(event)
    setSelectedEvent(event);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedEvent(null);
  };

  const joinEvent = async (event) => {
    if (event.participants.length >= event.max_participants) {
      alert("Este evento ya está completo.");
      return;
    }

    try {
      const token = localStorage.getItem("JWT-STORAGE-KEY");
      const resp = await fetch(`${BASE_URL}/api/activities/${event.id}/join`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!resp.ok) {
        const err = await resp.json();
        throw new Error(err.error || "No pudiste unirte al evento");
      }

      alert(`Te has unido al evento: ${event.title}`);
      fetchEvents();
    } catch (err) {
      alert(err.message);
    }
  }

  // list of events from fallback
  const list = events.length > 0 ? events : fallbackEvents.map(e => ({
    ...e,
    participants: [],
    max_participants: 10,
  }));


  const filteredList = list.filter(event => {
    const matchesSearch =
      event.title?.toLowerCase().includes(search.toLowerCase()) ||
      event.sport?.toLowerCase().includes(search.toLowerCase());

    const matchesSport =
      sportFilter === "" || event.sport === sportFilter;

    return matchesSearch && matchesSport;
  });


  const sports = [...new Set(list.map(e => e.sport))];



  return (
    <>
      <Box sx={{ mt: 12, textAlign: "center" }}>
        <TextField
          variant="outlined"
          placeholder="Buscar evento o deporte..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{
            width: "60%",
            maxWidth: 450,
            bgcolor: "#fff",
            borderRadius: 2,
          }}
        />
        <Box sx={{ mt: 2, textAlign: "center" }}>
          <FormControl sx={{ width: "60%", maxWidth: 450, bgcolor: "#fff", borderRadius: 2}}>
            <InputLabel>Filtrar por deporte</InputLabel>
            <Select
              value={sportFilter}
              label="Filtrar por deporte"
              onChange={(e) => setSportFilter(e.target.value)}
            >
              <MenuItem value="">Todos</MenuItem>
              {sports.map((sport) => (
                <MenuItem key={sport} value={sport}>
                  {sport}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

      </Box>

      <Box sx={{ my: 16, display: "flex", flexWrap: "wrap", gap: 4, justifyContent: "center" }}>
        {filteredList.map((event) => (

          <Card
            key={event.id}
            sx={{
              width: "22%",
              minWidth: 170,
              boxShadow: "0px 0px 5px 2px #817DF9",
              borderRadius: 2,
              textAlign: "center",
              transition: "transform 0.3s",
              "&:hover": { transform: "scale(1.05)" },
            }}
          >
            {event.image && (
              <CardMedia
                component="img"
                height="175"
                image={event.image}
                alt={event.title}
              />
            )}
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 0.5, mb: 0.5 }}>
                <Typography variant="subtitle1" sx={{ color: "#20232D", fontWeight: 700 }}>
                  {event.sport}
                </Typography>
                <Button
                  size="small"
                  sx={{
                    minWidth: "24px",
                    bgcolor: (event.participants?.length ?? 0) >= (event.max_participants ?? 0) ? "#888" : "#EE6C4D",
                    color: "#fff",
                    fontWeight: "bold"
                  }}
                  onClick={() => joinEvent(event)}
                  disabled={(event.participants?.length ?? 0) >= (event.max_participants ?? 0)}
                >
                  +
                </Button>
                <Button
                  size="small"
                  sx={{ minWidth: "24px", bgcolor: "#817DF9", color: "#fff", fontWeight: "bold" }}
                  onClick={() => showEventDetails(event)}
                >
                  🔍
                </Button>
              </Box>
              <Typography variant="body2" sx={{ color: "#000000ff", fontSize: "0.75rem" }}>
                <h6>Titulo: {event.title}</h6> <br />
                Descripcion: {event.description} <br />
                Participantes: {(event.participants?.length ?? 0)}/{event.max_participants ?? 0}
              </Typography>
            </CardContent>
          </Card>
        ))}
      </Box>

      <Modal open={showModal} onClose={handleCloseModal}>
        <Box sx={{ bgcolor: "#333", color: "#fff", p: 4, mx: "auto", mt: "10%", borderRadius: 2, maxWidth: 400 }}>
          {selectedEvent && (
            <>
              <Typography variant="h6">{selectedEvent.title}</Typography>
              <Typography variant="subtitle2">{selectedEvent.sport}</Typography>
              <Typography variant="body2" sx={{ mt: 1 }}>{selectedEvent.description}</Typography>
            </>
          )}
        </Box>
      </Modal>
    </>
  );
};
